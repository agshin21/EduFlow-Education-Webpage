import type { CodePractice as CodePracticeType, Course, Syllabus, Topic } from "../@types/types";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import CodePractice from "../components/CodePractice";
import { FaCode } from "react-icons/fa";
import axios from "axios";
import { fetchCourseById } from "../api/courses";
import { getPracticesForCourse } from "../../public/data/codePractices";
import { useProgress } from "../store/progressStore";
import { usePurchased } from "../store/purchasedStore";
import { useTheme } from "../context/ThemeContext";

const SYLLABUS_URL = "https://6a2ec8d2c9776ca6c0c4f04a.mockapi.io/lessons/v1/previews";

type FlatLessonKind = "lesson" | "practice";

interface FlatLesson {
  id: string;
  topicTitle: string;
  title: string;
  time: string;
  kind: FlatLessonKind;
  practice?: CodePracticeType;
}

function flattenSyllabus(syllabus: Syllabus | null): FlatLesson[] {
  const topics: (Topic | undefined)[] = syllabus
    ? [syllabus.topic_1, syllabus.topic_2, syllabus.topic_3]
    : [];

  const lessons: FlatLesson[] = [];

  topics.forEach((topic, ti) => {
    if (!topic) return;
    const titles = topic.lesson_syllabus;
    const times = topic.lessonsTime;
    (["lesson_1", "lesson_2", "lesson_3"] as const).forEach((key, li) => {
      const title = titles?.[key];
      if (!title) return;
      lessons.push({
        id: `t${ti}-l${li}`,
        topicTitle: topic.title || `Section ${ti + 1}`,
        title,
        time: String(times?.[key] ?? "10:00"),
        kind: "lesson",
      });
    });
  });

  if (lessons.length === 0) {
    return [
      { id: "d-0", topicTitle: "Getting Started", title: "Course Introduction", time: "06:00", kind: "lesson" },
      { id: "d-1", topicTitle: "Getting Started", title: "Setting Up Your Environment", time: "12:00", kind: "lesson" },
      { id: "d-2", topicTitle: "Core Concepts", title: "Key Fundamentals", time: "18:00", kind: "lesson" },
      { id: "d-3", topicTitle: "Core Concepts", title: "Hands-on Walkthrough", time: "22:00", kind: "lesson" },
      { id: "d-4", topicTitle: "Wrapping Up", title: "Project & Next Steps", time: "15:00", kind: "lesson" },
    ];
  }

  return lessons;
}

/**
 * Insert code practice items after every two lessons. Practice items
 * are appended to the topic of the lesson that immediately precedes
 * them so the sidebar grouping stays meaningful.
 */
function insertPractices(lessons: FlatLesson[]): FlatLesson[] {
  const out: FlatLesson[] = [];
  const total = lessons.length;
  const practices = getPracticesForCourse(total);
  let practiceIdx = 0;

  lessons.forEach((lesson, idx) => {
    out.push(lesson);
    const isSecondInPair = (idx + 1) % 2 === 0;
    const hasMoreLessons = idx + 1 < total;
    if (isSecondInPair && hasMoreLessons && practiceIdx < practices.length) {
      const p = practices[practiceIdx++];
      out.push({
        id: `${lesson.id}-practice-${practiceIdx}`,
        topicTitle: lesson.topicTitle,
        title: p.title,
        time: "10:00",
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
      axios
        .get<Syllabus>(`${SYLLABUS_URL}/${id}`)
        .then((r) => r.data)
        .catch(() => null),
    ])
      .then(([courseData, syllabusData]) => {
        if (!active) return;
        if (!courseData) setError(true);
        else setCourse(courseData);
        setSyllabus(syllabusData);
      })
      .catch(() => active && setError(true))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [id]);

  const topicLength = String(course?.topic_1).length;
  const lessons = useMemo(() => {
    const flat = flattenSyllabus(syllabus);
    return insertPractices(flat);
  }, [syllabus]);

  useEffect(() => {
    if (id && lessons.length) setTotal(id, lessons.length);
  }, [id, lessons.length, setTotal]);

  useEffect(() => {
    if (!lessons.length || activeLessonId || !id) return;

    const saved = getLastLesson(id);
    const savedExists = saved && lessons.some((l) => l.id === saved);

    if (savedExists) {
      setActiveLessonId(saved!);
      return;
    }

    const completed = getCompleted(id);
    const firstUnfinished = lessons.find((l) => !completed.includes(l.id));
    setActiveLessonId(firstUnfinished ? firstUnfinished.id : lessons[0].id);
  }, [lessons, activeLessonId, id, getLastLesson, getCompleted]);

  useEffect(() => {
    if (id && activeLessonId) setLastLesson(id, activeLessonId);
  }, [id, activeLessonId, setLastLesson]);

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
              <div className="h-4 w-full rounded bg-gray-200" />
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
        <p className="mt-2 text-gray-500">
          The course you’re looking for doesn’t exist or was removed.
        </p>
        <button
          onClick={() => navigate("/courses")}
          className="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  if (!isOwned) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
        <div className="max-w-md rounded-2xl border border-gray-100 bg-white p-10 shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-2xl">
            🔒
          </div>
          <h1 className="text-xl font-bold text-gray-900">
            You don’t own this course yet
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Purchase “{course.title}” to unlock all lessons and start learning.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => navigate(`/details/${course.id}`)}
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
            >
              View Course
            </button>
            <button
              onClick={() => navigate("/my-lessons")}
              className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              My Lessons
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isActiveDone = activeLesson ? isCompleted(course.id as string, activeLesson.id) : false;
  const isPracticeActive = activeLesson?.kind === "practice";

  return (
    <div className={`min-h-screen transition duration-500 ${theme === 'dark' ? 'bg-[#1a1919]/95' : 'bg-white'} pt-16`}>
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        {/* Title */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              onClick={() => navigate("/my-lessons")}
              className="mb-2 flex items-center gap-2 text-sm font-medium text-indigo-600 hover:underline"
            >
              <IoIosArrowBack /> Back to My Lessons
            </button>
            <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-[#e1dede]' : 'text-gray-900'}`}>{course.title}</h1>
            <p className={`text-sm ${theme === 'dark' ? 'text-[#e1dede]/70' : 'text-gray-500'}`}>
              by {course.instructorName}
            </p>
          </div>
          <div className={`rounded-xl transition duration-500 ${theme === 'dark' ? 'bg-[#313131]/90' : 'bg-white'}  px-4 py-3 shadow-sm`}>
            <p className={`text-xs ${theme === 'dark' ? 'text-[#e1dede]/90' : 'text-gray-500'}`}>Your progress</p>
            <p className={`text-lg ${theme === 'dark' ? 'text-[#e1dede]/80' : 'text-gray-900'} font-semibold`}>
              {progressPct}%{" "}
              <span className={`text-sm font-normal ${theme === 'dark' ? 'text-[#e1dede]/70' : 'text-gray-400'}`}>
                ({completedCount}/{totalLessons})
              </span>
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Lesson / Practice Content */}
          <div className="lg:col-span-2">
            {isPracticeActive && activeLesson?.practice ? (
              <CodePractice
                practice={activeLesson.practice}
                isCompleted={isActiveDone}
                hasPrevious={activeIndex > 0}
                hasNext={activeIndex < lessons.length - 1}
                onPrevious={() => goTo(activeIndex - 1)}
                onComplete={() => toggleLesson(course.id as string, activeLesson.id)}
                onContinue={() => {
                  if (activeIndex < lessons.length - 1) goTo(activeIndex + 1);
                }}
              />
            ) : (
              <>
                <div className="overflow-hidden rounded-2xl bg-black shadow-sm">
                  <div className="aspect-video w-full">
                    {course.previewVideoProvider === "youtube" &&
                    course.previewVideoId ? (
                      <iframe
                        key={activeLesson?.id}
                        className="h-full w-full"
                        src={`https://www.youtube.com/embed/${course.previewVideoId}`}
                        title={activeLesson?.title ?? course.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-400">
                        No preview available
                      </div>
                    )}
                  </div>
                </div>

                {activeLesson && (
                  <div className={`mt-5 rounded-2xl transition duration-500 ${theme === 'dark' ? 'bg-[#313131]/90' : 'bg-white'} p-6 shadow-sm`}>
                    <p className={`text-xs font-medium uppercase tracking-wide text-indigo-500`}>
                      {activeLesson.topicTitle}
                    </p>
                    <h2 className={`mt-1 text-xl font-semibold ${theme === 'dark' ? 'text-[#e1dede]' : 'text-gray-900'}`}>
                      {activeIndex + 1}. {activeLesson.title}
                    </h2>
                    <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-[#e1dede]/80' : 'text-gray-500'}`}>
                      Duration: {Math.ceil(Number(course.totalTime) / topicLength)}h
                    </p>

                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => {
                          if (!isActiveDone) {
                            toggleLesson(course.id as string, activeLesson.id);
                          }
                          if (activeIndex < lessons.length - 1) {
                            goTo(activeIndex + 1);
                          }
                        }}
                        className={`rounded-xl px-4 py-2.5 text-sm font-medium transition active:scale-[0.98] ${
                          isActiveDone
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                            : "bg-indigo-600 text-white hover:bg-indigo-700"
                        }`}
                      >
                        {isActiveDone
                          ? activeIndex < lessons.length - 1
                            ? "Completed · Next lesson"
                            : "✓ Completed"
                          : activeIndex < lessons.length - 1
                          ? "Complete & continue"
                          : "Mark as complete"}
                      </button>

                      <button
                        onClick={() => goTo(activeIndex - 1)}
                        disabled={activeIndex <= 0}
                        className={`rounded-xl flex items-center gap-2 ${theme === 'dark' ? 'text-[#e1dede]/80' : 'border border-gray-200 text-gray-700'}  px-4 py-2.5 text-sm font-medium  transition duration-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40`}
                      >
                        <IoIosArrowBack /> Previous
                      </button>
                      <button
                        onClick={() => goTo(activeIndex + 1)}
                        disabled={activeIndex >= lessons.length - 1}
                        className={`rounded-xl flex items-center gap-2 ${theme === 'dark' ? 'text-[#e1dede]/80' : 'border border-gray-200 text-gray-700'}  px-4 py-2.5 text-sm font-medium  transition duration-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40`}
                      >
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
            <div className={`overflow-hidden rounded-2xl transition duration-500 border-gray-100 ${theme === 'dark' ? 'bg-[#313131]/90' : 'bg-white'} shadow-sm`}>
              <div className="p-5">
                <h3 className={`font-semibold ${theme === 'dark' ? 'text-[#e1dede]' : 'text-gray-900'}`}>Course content</h3>
                <p className={`mt-1 text-xs ${theme === 'dark' ? 'text-[#e1dede]/70' : 'text-gray-500'} `}>
                  {totalLessons} items · includes code practice
                </p>
                {/* Progress bar */}
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              <div className="max-h-[60vh] overflow-y-auto">
                {groupByTopic(lessons).map(([topicTitle, topicLessons]) => (
                  <div key={topicTitle}>
                    <p className={`${theme === 'dark' ? 'bg-[#484848]/40 text-[#e1dede]/90' : 'bg-gray-50 text-gray-500'} transition duration-500 px-5 py-2 text-xs font-semibold uppercase tracking-wide`}>
                      {topicTitle}
                    </p>
                    <ul>
                      {topicLessons.map((lesson) => {
                        const done = completedIds.includes(lesson.id);
                        const active = lesson.id === activeLesson?.id;
                        const isPractice = lesson.kind === "practice";

                        return (
                          <li key={lesson.id}>
                            <button
                              onClick={() => {
                                setActiveLessonId(lesson.id);
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }}
                              className={`flex w-full items-center gap-3 px-5 py-3 text-left text-sm transition duration-500 ${
                                active && theme === 'dark'
                                  ? "bg-[#484848]/20"
                                  : active && theme === 'light'
                                  ? "bg-indigo-50"
                                  : theme === 'dark'
                                  ? "hover:bg-[#3a3a3a]"
                                  : "hover:bg-gray-50"
                              }`}
                            >
                              <span
                                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px] ${
                                  done
                                    ? "border-emerald-500 bg-emerald-500 text-white"
                                    : isPractice
                                    ? theme === 'dark'
                                      ? "border-violet-400/60 text-violet-300"
                                      : "border-violet-300 text-violet-500"
                                    : "border-gray-300 text-transparent"
                                }`}
                              >
                                {done ? "✓" : isPractice ? <FaCode className="!text-[10px]" /> : ""}
                              </span>
                              <span
                                className={`flex-1 truncate ${
                                  active
                                    ? isPractice
                                      ? theme === 'dark'
                                        ? "font-medium text-violet-300"
                                        : "font-medium text-violet-700"
                                      : "font-medium text-indigo-700"
                                    : isPractice
                                    ? theme === 'dark'
                                      ? "text-violet-200/80"
                                      : "text-violet-700/80"
                                    : theme === 'dark'
                                    ? "text-[#e1dede]/60"
                                    : "text-gray-700"
                                }`}
                              >
                                {lesson.title}
                              </span>
                              <span
                                className={`shrink-0 text-xs ${
                                  isPractice
                                    ? theme === 'dark'
                                      ? "text-violet-300/80"
                                      : "text-violet-500"
                                    : "text-gray-400"
                                }`}
                              >
                                {isPractice ? "Practice" : lesson.time}
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