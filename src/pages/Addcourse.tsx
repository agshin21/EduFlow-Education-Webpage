import type { Course, Syllabus, Topic } from "../@types/types";
import { useMemo, useState } from "react";

import { createCourseWithSyllabus } from "../api/teacherCourses";
import { toast } from "react-toastify";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const LESSON_KEYS = ["lesson_1", "lesson_2", "lesson_3"] as const;

type TopicForm = {
  title: string;
  lessons: { title: string; date: string; start: string; end: string }[];
};

const emptyTopic = (): TopicForm => ({
  title: "",
  lessons: [
    { title: "", date: "", start: "", end: "" },
    { title: "", date: "", start: "", end: "" },
    { title: "", date: "", start: "", end: "" },
  ],
});

const toLessonDate = (iso: string): string => {
  if (!iso) return "";
  const d = new Date(iso);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

export default function AddCourse() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const user = useCurrentUser();

  const isTeacher = user?.role === "teacher";

  const [saving, setSaving] = useState(false);
  const [course, setCourse] = useState({
    title: "",
    description: "",
    headline: "",
    price: 0,
    level: "beginner",
    businessCategory: "",
    thumbnail: "",
    previewVideoProvider: "youtube",
    previewVideoId: "",
    aboutInstructor: "",
    startDate: "",
    endDate: "",
    totalTime: 0,
  });
  const [topics, setTopics] = useState<TopicForm[]>([emptyTopic(), emptyTopic(), emptyTopic()]);

  const input =
    theme === "dark"
      ? "bg-gray-800/60 border-gray-600 text-white placeholder-gray-400"
      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500";

  const inputCls = `mt-1 w-full rounded-lg border px-3 py-2 outline-none transition focus:ring-2 focus:ring-blue-500/30 ${input}`;

  const setField = (k: string, v: string | number) =>
    setCourse((c) => ({ ...c, [k]: v }));

  const setLesson = (ti: number, li: number, k: string, v: string) =>
    setTopics((prev) => {
      const next = structuredClone(prev);
      (next[ti].lessons[li] as any)[k] = v;
      return next;
    });

  const setTopicTitle = (ti: number, v: string) =>
    setTopics((prev) => {
      const next = structuredClone(prev);
      next[ti].title = v;
      return next;
    });

  const buildTopic = (t: TopicForm, index: number): Topic => {
    const syllabus = {} as Topic["lesson_syllabus"];
    LESSON_KEYS.forEach((key, i) => {
      (syllabus as any)[key] = t.lessons[i]?.title || "";
    });
    return {
      title: t.title || `Section ${index + 1}`,
      lesson_syllabus: syllabus,
      lessonsTime: t.lessons.map((l) => ({
        startDate: l.start,
        endDate: l.end,
      })),
      lessonsDate: t.lessons.map((l) => ({
        startDate: toLessonDate(l.date),
      })),
    };
  };

  const canSubmit = useMemo(() => {
    if (!course.title.trim() || !course.description.trim()) return false;
    
    const first = topics[0]?.lessons[0];
    return Boolean(first?.title && first?.date && first?.start && first?.end);
  }, [course, topics]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      toast.error("Please fill course title, description and at least the first lesson.");
      return;
    }
    setSaving(true);
    try {
      const [t1, t2, t3] = topics;

      const coursePayload: Omit<Course, "id"> = {
        avatar: user?.avatar || "",
        title: course.title,
        description: course.description,
        headline: course.headline || course.description.slice(0, 60),
        price: Number(course.price) || 0,
        level: course.level,
        thumbnail: course.thumbnail || "/hero.png",
        instructorName: `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "Instructor",
        aboutInstructor: course.aboutInstructor || "",
        rating: "0",
        previewVideoProvider: course.previewVideoProvider,
        previewVideoId: course.previewVideoId,
        businessCategory: course.businessCategory || "General",
        testimonial: "",
        studentsCount: "0",
        status: "active",
        totalTime: Number(course.totalTime) || 0,
        startDate: course.startDate,
        endDate: course.endDate,
      };

      const syllabusPayload: Omit<Syllabus, "id"> = {
        previewCourse: course.previewVideoId || "",
        topic_1: buildTopic(t1, 0),
        topic_2: buildTopic(t2, 1),
        topic_3: buildTopic(t3, 2),
      };

      const created = await createCourseWithSyllabus(coursePayload, syllabusPayload);
      toast.success("Course published successfully!");
      navigate(`/details/${created.id}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to publish course.");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold">You must be logged in.</h1>
          <button onClick={() => navigate("/login")} className="mt-4 rounded-xl bg-blue-600 px-5 py-2.5 text-white">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!isTeacher) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-center">
        <div className="max-w-md rounded-2xl border p-10 shadow-sm">
          <h1 className="text-xl font-bold">Teachers only</h1>
          <p className="mt-2 text-sm text-gray-500">
            Only teacher accounts can add courses. Register as a teacher to continue.
          </p>
          <button onClick={() => navigate("/register")} className="mt-6 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white">
            Register as Teacher
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-24 pb-16 ${theme === "dark" ? "bg-[#1a1919] text-[#e1dede]" : "bg-[#f1f5fc] text-gray-900"}`}>
      <form onSubmit={handleSubmit} className="mx-auto max-w-4xl px-6">
        <h1 className="mb-6 text-3xl font-bold">Add a New Course</h1>

        {/* Course meta */}
        <div className={`rounded-2xl p-6 shadow-sm ${theme === "dark" ? "bg-[#313131]" : "bg-white"}`}>
          <h2 className="mb-4 text-lg font-semibold">Course details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-sm font-semibold">Title</label>
              <input className={inputCls} value={course.title} onChange={(e) => setField("title", e.target.value)} placeholder="e.g. React from Zero to Hero" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-semibold">Description</label>
              <textarea className={inputCls} rows={3} value={course.description} onChange={(e) => setField("description", e.target.value)} placeholder="Short description" />
            </div>
            <div>
              <label className="text-sm font-semibold">Category</label>
              <input className={inputCls} value={course.businessCategory} onChange={(e) => setField("businessCategory", e.target.value)} placeholder="Web Development" />
            </div>
            <div>
              <label className="text-sm font-semibold">Level</label>
              <select className={inputCls} value={course.level} onChange={(e) => setField("level", e.target.value)}>
                <option value="beginner">beginner</option>
                <option value="intermediate">intermediate</option>
                <option value="advanced">advanced</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold">Price ($)</label>
              <input type="number" min={0} className={inputCls} value={course.price} onChange={(e) => setField("price", Number(e.target.value))} />
            </div>
            <div>
              <label className="text-sm font-semibold">Total time (hours)</label>
              <input type="number" min={0} className={inputCls} value={course.totalTime} onChange={(e) => setField("totalTime", Number(e.target.value))} />
            </div>
            <div>
              <label className="text-sm font-semibold">Thumbnail URL</label>
              <input className={inputCls} value={course.thumbnail} onChange={(e) => setField("thumbnail", e.target.value)} placeholder="https://..." />
            </div>
            <div>
              <label className="text-sm font-semibold">YouTube preview video ID</label>
              <input className={inputCls} value={course.previewVideoId} onChange={(e) => setField("previewVideoId", e.target.value)} placeholder="e.g. dQw4w9WgXcQ" />
            </div>
            <div>
              <label className="text-sm font-semibold">Start date</label>
              <input type="date" className={inputCls} value={course.startDate} onChange={(e) => setField("startDate", e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-semibold">End date</label>
              <input type="date" className={inputCls} value={course.endDate} onChange={(e) => setField("endDate", e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-semibold">About instructor</label>
              <textarea className={inputCls} rows={2} value={course.aboutInstructor} onChange={(e) => setField("aboutInstructor", e.target.value)} />
            </div>
          </div>
        </div>

        {/* Curriculum / live schedule */}
        {topics.map((topic, ti) => (
          <div key={ti} className={`mt-6 rounded-2xl p-6 shadow-sm ${theme === "dark" ? "bg-[#313131]" : "bg-white"}`}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Section {ti + 1}</h2>
            </div>
            <input className={inputCls} value={topic.title} onChange={(e) => setTopicTitle(ti, e.target.value)} placeholder={`Section ${ti + 1} title`} />

            <div className="mt-4 space-y-4">
              {topic.lessons.map((lesson, li) => (
                <div key={li} className={`rounded-xl border p-4 ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
                  <p className="mb-2 text-xs font-semibold uppercase text-indigo-500">Lesson {li + 1}</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="text-sm font-semibold">Lesson title</label>
                      <input className={inputCls} value={lesson.title} onChange={(e) => setLesson(ti, li, "title", e.target.value)} placeholder="Introduction to..." />
                    </div>
                    <div>
                      <label className="text-sm font-semibold">Date</label>
                      <input type="date" className={inputCls} value={lesson.date} onChange={(e) => setLesson(ti, li, "date", e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-sm font-semibold">Start</label>
                        <input type="time" className={inputCls} value={lesson.start} onChange={(e) => setLesson(ti, li, "start", e.target.value)} />
                      </div>
                      <div>
                        <label className="text-sm font-semibold">End</label>
                        <input type="time" className={inputCls} value={lesson.end} onChange={(e) => setLesson(ti, li, "end", e.target.value)} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="mt-8 flex gap-3">
          <button type="submit" disabled={saving || !canSubmit} className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50">
            {saving ? "Publishing..." : "Publish Course"}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="rounded-xl border px-6 py-3 font-semibold">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
