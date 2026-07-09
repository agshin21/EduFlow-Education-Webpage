import type { CodePractice as CodePracticeType, Course, Exam, LiveMeta, Syllabus, Topic } from "../@types/types";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { buildLiveMeta, getLiveStatus, providerLabel } from "../utils/liveSchedule";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import CodePractice from "../components/CodePractice";
import ExamCard from "../components/ExamCard";
import LiveLessonGate from "../components/LiveLessonGate";
import LiveStartedDialog from "../components/LiveStartedDialog";
import axios from "axios";
import { buildExamForTopic } from "../utils/examBank";
import { fetchCourseById } from "../api/courses";
import { getPracticesForCourse } from "../../public/data/codePractices";
import { useProgress } from "../store/progressStore";
import { usePurchased } from "../store/purchasedStore";
import { useTheme } from "../context/ThemeContext";

const SYLLABUS_URL = "https://6a2ec8d2c9776ca6c0c4f04a.mockapi.io/lessons/v1/previews";

type FlatLessonKind = "lesson" | "practice" | "exam";

interface FlatLesson {
  id: string;
  topicTitle: string;
  title: string;
  time: string;
  kind: FlatLessonKind;
  practice?: CodePracticeType;
  exam?: Exam;
  live?: LiveMeta;
}

const LESSON_KEYS = ["lesson_1", "lesson_2", "lesson_3"] as const;

function flattenSyllabus(syllabus: Syllabus | null, courseId?: string): FlatLesson[] {
  const topics: (Topic | undefined)[] = syllabus
    ? [syllabus.topic_1, syllabus.topic_2, syllabus.topic_3]
    : [];

  const lessons: FlatLesson[] = [];
  let globalIndex = 0;

  topics.forEach((topic, ti) => {
    if (!topic) return;
    const titles = topic.lesson_syllabus;
    const times = topic.lessonsTime;
    const dates = topic.lessonsDate;

    LESSON_KEYS.forEach((key, li) => {
      const title = titles?.[key];
      if (!title) return;
      const timeSlot = Array.isArray(times) ? times[li] : undefined
      const dateSlot = Array.isArray(dates) ? dates[li] : undefined

      const live =
        timeSlot?.startDate && timeSlot?.endDate && dateSlot?.startDate
          ? buildLiveMeta(courseId, globalIndex, dateSlot.startDate, timeSlot.startDate, timeSlot.endDate)
          : undefined;

      lessons.push({
        id: `t${ti}-l${li}`,
        topicTitle: topic.title || `Section ${ti + 1}`,
        title,
        time: live ? live.timeLabel : timeSlot?.startDate ?? "-",
        kind: "lesson",
        live,
      });
      globalIndex++;
    });

    lessons.push({
      id: `t${ti}-exam`,
      topicTitle: topic.title || `Section ${ti + 1}`,
      title: `${topic.title} — Exam`,
      time: "Exam",
      kind: "exam",
      exam: buildExamForTopic(topic.title || `Section ${ti + 1}`, ti, courseId),
    });
  });

  if (lessons.length === 0) {
    return [
      { id: "d-0", topicTitle: "Getting Started", title: "Course Introduction", time: "06:00", kind: "lesson" },
      { id: "d-1", topicTitle: "Getting Started", title: "Setting Up Your Environment", time: "12:00", kind: "lesson" },
    ];
  }

  return lessons;
}

function insertPractices(lessons: FlatLesson[], courseId?: string): FlatLesson[] {
  const lessonOnly = lessons.filter((l) => l.kind === "lesson");
  const practices = getPracticesForCourse(lessonOnly.length, courseId);
  let practiceIdx = 0;
  let lessonCounter = 0;

  const out: FlatLesson[] = [];
  lessons.forEach((lesson) => {
    out.push(lesson);
    if (lesson.kind !== "lesson") return;
    lessonCounter++;
    const isSecondInPair = lessonCounter % 2 === 0;
    if (isSecondInPair && practiceIdx < practices.length) {
      const p = practices[practiceIdx++];
      out.push({
        id: `${lesson.id}-practice-${practiceIdx}`,
        topicTitle: lesson.topicTitle,
        title: p.title,
        time: "Practice",
        kind: "practice",
        practice: p,
      });
    }
  });

  return out;
}

function groupByTopic(lessons: FlatLesson[]) {
  const map = new Map<string, FlatLesson[]>();
  for (const lesson of lessons) {
    const list = map.get(lesson.topicTitle) ?? [];
    list.push(lesson);
    map.set(lesson.topicTitle, list);
  }
  return Array.from(map.entries());
}

export default function Learning() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const purchased = usePurchased((s) => s.purchased);
  const { getCompleted, isCompleted, toggleLesson, setTotal, setLastLesson, getLastLesson } = useProgress();

  const [course, setCourse] = useState<Course | null>(null);
  const [syllabus, setSyllabus] = useState<Syllabus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeLessonId, setActiveLessonId] = useState<string>("");

  const [now, setNow] = useState<Date>(new Date());
  const [dialogDismissed, setDialogDismissed] = useState<string | null>(null);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000); 
    return () => clearInterval(t);
  }, []);

  const isOwned = useMemo(
    () => purchased.some((p) => String(p.id) === String(id)),
    [purchased, id]
  );

  useEffect(() => {
    if (!id) return;
    let active = true;
    setLoading(true);
    setError(false);

    Promise.all([
      fetchCourseById(id),
      axios.get<Syllabus>(`${SYLLABUS_URL}/${id}`).then((r) => r.data).catch(() => null),
    ])
      .then(([courseData, syllabusData]) => {
        if (!active) return;
        if (!courseData) setError(true);
        else setCourse(courseData);
        setSyllabus(syllabusData);
      })
      .catch(() => active && setError(true))
      .finally(() => active && setLoading(false));

    return () => { active = false; };
  }, [id]);

  const lessons = useMemo(() => {
    const flat = flattenSyllabus(syllabus, id);
    return insertPractices(flat, id);
  }, [syllabus, id]);

  useEffect(() => {
    if (id && lessons.length) setTotal(id, lessons.length);
  }, [id, lessons.length, setTotal]);

  useEffect(() => {
    if (!lessons.length || activeLessonId || !id) return;
    const saved = getLastLesson(id);
    if (saved && lessons.some((l) => l.id === saved)) {
      setActiveLessonId(saved);
      return;
    }
    const completed = getCompleted(id);
    const firstUnfinished = lessons.find((l) => !completed.includes(l.id));
    setActiveLessonId(firstUnfinished ? firstUnfinished.id : lessons[0].id);
  }, [lessons, activeLessonId, id, getLastLesson, getCompleted]);

  useEffect(() => {
    if (id && activeLessonId) setLastLesson(id, activeLessonId);
  }, [id, activeLessonId, setLastLesson]);

  const liveLesson = useMemo(
    () => lessons.find((l) => l.live && getLiveStatus(l.live, now) === "live"),
    [lessons, now]
  );

  const completedIds = id ? getCompleted(id) : [];
  const totalLessons = lessons.length;
  const completedCount = lessons.filter((l) => completedIds.includes(l.id)).length;
  const progressPct = totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0;

  const activeLesson = lessons.find((l) => l.id === activeLessonId) ?? lessons[0];
  const activeIndex = lessons.findIndex((l) => l.id === activeLesson?.id);

  const goTo = (index: number) => {
    if (index >= 0 && index < lessons.length) {
      setActiveLessonId(lessons[index].id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50">
        <div className="mx-auto max-w-7xl animate-pulse px-4 py-10">
          <div className="mb-6 h-8 w-1/3 rounded bg-gray-200" />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              <div className="aspect-video w-full rounded-2xl bg-gray-200" />
              <div className="h-6 w-1/2 rounded bg-gray-200" />
            </div>
            <div className="h-96 rounded-2xl bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Course not found</h1>
        <button onClick={() => navigate("/courses")} className="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700">
          Back to Courses
        </button>
      </div>
    );
  }

  if (!isOwned) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
        <div className="max-w-md rounded-2xl border border-gray-100 bg-white p-10 shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-2xl">🔒</div>
          <h1 className="text-xl font-bold text-gray-900">You don’t own this course yet</h1>
          <p className="mt-2 text-sm text-gray-500">Purchase “{course.title}” to unlock all lessons.</p>
          <div className="mt-6 flex justify-center gap-3">
            <button onClick={() => navigate(`/details/${course.id}`)} className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700">View Course</button>
            <button onClick={() => navigate("/my-lessons")} className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">My Lessons</button>
          </div>
        </div>
      </div>
    );
  }

  const isActiveDone = activeLesson ? isCompleted(course.id as string, activeLesson.id) : false;
  const isPracticeActive = activeLesson?.kind === "practice";
  const isExamActive = activeLesson?.kind === "exam";
  const activeLiveStatus = activeLesson?.live ? getLiveStatus(activeLesson.live, now) : null;
  const showLiveGate = activeLiveStatus === "upcoming" || activeLiveStatus === "live";

  return (
    <div className={`min-h-screen transition duration-500 ${theme === 'dark' ? 'bg-[#1a1919]/95' : 'bg-white'} pt-16`}>
      {liveLesson?.live && dialogDismissed !== liveLesson.id && (
        <LiveStartedDialog
          live={liveLesson.live}
          lessonTitle={liveLesson.title}
          onJoin={() => {
            setActiveLessonId(liveLesson.id);
            window.open(liveLesson.live!.joinUrl, "_blank");
            setDialogDismissed(liveLesson.id);
          }}
          onClose={() => setDialogDismissed(liveLesson.id)}
        />
      )}

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button onClick={() => navigate("/my-lessons")} className="mb-2 flex items-center gap-2 text-sm font-medium text-indigo-600 hover:underline">
              <IoIosArrowBack /> Back to My Lessons
            </button>
            <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-[#e1dede]' : 'text-gray-900'}`}>{course.title}</h1>
            <p className={`text-sm ${theme === 'dark' ? 'text-[#e1dede]/70' : 'text-gray-500'}`}>by {course.instructorName}</p>
          </div>
          <div className={`rounded-xl transition duration-500 ${theme === 'dark' ? 'bg-[#313131]/90' : 'bg-white'} px-4 py-3 shadow-sm`}>
            <p className={`text-xs ${theme === 'dark' ? 'text-[#e1dede]/90' : 'text-gray-500'}`}>Your progress</p>
            <p className={`text-lg ${theme === 'dark' ? 'text-[#e1dede]/80' : 'text-gray-900'} font-semibold`}>
              {progressPct}% <span className={`text-sm font-normal ${theme === 'dark' ? 'text-[#e1dede]/70' : 'text-gray-400'}`}>({completedCount}/{totalLessons})</span>
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {isPracticeActive && activeLesson?.practice ? (
              <CodePractice
                practice={activeLesson.practice}
                isCompleted={isActiveDone}
                hasPrevious={activeIndex > 0}
                hasNext={activeIndex < lessons.length - 1}
                onPrevious={() => goTo(activeIndex - 1)}
                onComplete={() => toggleLesson(course.id as string, activeLesson.id)}
                onContinue={() => { if (activeIndex < lessons.length - 1) goTo(activeIndex + 1); }}
              />
            ) : isExamActive && activeLesson?.exam ? (
              <ExamCard
                exam={activeLesson.exam}
                isCompleted={isActiveDone}
                hasNext={activeIndex < lessons.length - 1}
                onComplete={() => toggleLesson(course.id as string, activeLesson.id)}
                onContinue={() => { if (activeIndex < lessons.length - 1) goTo(activeIndex + 1); }}
              />
            ) : showLiveGate && activeLesson?.live ? (
              <LiveLessonGate live={activeLesson.live} status={activeLiveStatus as "upcoming" | "live"} lessonTitle={activeLesson.title} />
            ) : (
              <>
                <div className="overflow-hidden rounded-2xl bg-black shadow-sm">
                  <div className="aspect-video w-full">
                    {course.previewVideoProvider === "youtube" && course.previewVideoId ? (
                      <iframe
                        key={activeLesson?.id}
                        className="h-full w-full"
                        src={`https://www.youtube.com/embed/${course.previewVideoId}`}
                        title={activeLesson?.title ?? course.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-400">No preview available</div>
                    )}
                  </div>
                </div>

                {activeLesson && (
                  <div className={`mt-5 rounded-2xl transition duration-500 ${theme === 'dark' ? 'bg-[#313131]/90' : 'bg-white'} p-6 shadow-sm`}>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-medium uppercase tracking-wide text-indigo-500">{activeLesson.topicTitle}</p>
                      {activeLesson.live && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                          ▶ Recording
                        </span>
                      )}
                    </div>
                    <h2 className={`mt-1 text-xl font-semibold ${theme === 'dark' ? 'text-[#e1dede]' : 'text-gray-900'}`}>
                      {activeIndex + 1}. {activeLesson.title}
                    </h2>
                    {activeLesson.live && (
                      <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-[#e1dede]/80' : 'text-gray-500'}`}>
                        {activeLesson.live.dateLabel} · {activeLesson.live.timeLabel} · was live on {providerLabel(activeLesson.live.provider)}
                      </p>
                    )}

                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => {
                          if (!isActiveDone) toggleLesson(course.id as string, activeLesson.id);
                          if (activeIndex < lessons.length - 1) goTo(activeIndex + 1);
                        }}
                        className={`rounded-xl px-4 py-2.5 text-sm font-medium transition active:scale-[0.98] ${
                          isActiveDone ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-indigo-600 text-white hover:bg-indigo-700"
                        }`}
                      >
                        {isActiveDone ? (activeIndex < lessons.length - 1 ? "Completed · Next" : "Completed") : (activeIndex < lessons.length - 1 ? "Complete & continue" : "Mark as complete")}
                      </button>
                      <button onClick={() => goTo(activeIndex - 1)} disabled={activeIndex <= 0} className={`rounded-xl flex items-center gap-2 ${theme === 'dark' ? 'text-[#e1dede]/80' : 'border border-gray-200 text-gray-700'} px-4 py-2.5 text-sm font-medium transition hover:bg-gray-50 disabled:opacity-40`}>
                        <IoIosArrowBack /> Previous
                      </button>
                      <button onClick={() => goTo(activeIndex + 1)} disabled={activeIndex >= lessons.length - 1} className={`rounded-xl flex items-center gap-2 ${theme === 'dark' ? 'text-[#e1dede]/80' : 'border border-gray-200 text-gray-700'} px-4 py-2.5 text-sm font-medium transition hover:bg-gray-50 disabled:opacity-40`}>
                        Next <IoIosArrowForward />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right: Syllabus */}
          <aside className="lg:col-span-1">
            <div className={`overflow-hidden rounded-2xl transition duration-500 ${theme === 'dark' ? 'bg-[#313131]/90' : 'bg-white'} shadow-sm`}>
              <div className="p-5">
                <h3 className={`font-semibold ${theme === 'dark' ? 'text-[#e1dede]' : 'text-gray-900'}`}>Course content</h3>
                <p className={`mt-1 text-xs ${theme === 'dark' ? 'text-[#e1dede]/70' : 'text-gray-500'}`}>{totalLessons} items · live sessions, practice & exams</p>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full rounded-full bg-indigo-600 transition-all duration-500" style={{ width: `${progressPct}%` }} />
                </div>
              </div>

              <div className="max-h-[65vh] overflow-y-auto">
                {groupByTopic(lessons).map(([topicTitle, topicLessons]) => (
                  <div key={topicTitle}>
                    <p className={`${theme === 'dark' ? 'bg-[#484848]/40 text-[#e1dede]/90' : 'bg-gray-50 text-gray-500'} px-5 py-2 text-xs font-semibold uppercase tracking-wide`}>{topicTitle}</p>
                    <ul>
                      {topicLessons.map((lesson) => {
                        const active = lesson.id === activeLesson?.id;
                        const isPractice = lesson.kind === "practice";
                        const isExam = lesson.kind === "exam";
                        const liveStatus = lesson.live ? getLiveStatus(lesson.live, now) : null;

                        return (
                          <li key={lesson.id}>
                            <button
                              onClick={() => { setActiveLessonId(lesson.id); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                              className={`flex w-full items-start gap-3 px-5 py-3 text-left text-sm transition ${
                                active && theme === 'dark' ? "bg-[#484848]/20"
                                : active ? "bg-indigo-50"
                                : theme === 'dark' ? "hover:bg-[#3a3a3a]" : "hover:bg-gray-50"
                              }`}
                            >

                              <span className="flex-1 min-w-0">
                                <span className={`block truncate ${active ? "font-medium text-indigo-700" : theme === 'dark' ? "text-[#e1dede]/70" : "text-gray-700"}`}>
                                  {lesson.title}
                                </span>
                              </span>

                              {/* status badge */}
                              <span className="shrink-0 text-xs">
                                {liveStatus === "live" ? (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white">
                                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> LIVE
                                  </span>
                                ) : liveStatus === "upcoming" ? (
                                  <span className="text-[10px] text-indigo-500">{lesson.live?.dateLabel}</span>
                                ) : liveStatus === "ended" ? (
                                  <span className="text-[10px] text-emerald-500">▶ Recording</span>
                                ) : isExam ? (
                                  <span className="text-amber-500">Exam</span>
                                ) : isPractice ? (
                                  <span className="text-violet-500">Practice</span>
                                ) : (
                                  <span className="text-gray-400">{lesson.time}</span>
                                )}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
