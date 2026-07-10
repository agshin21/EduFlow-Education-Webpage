import type { Course, Syllabus, Topic } from "../@types/types";
import { useMemo, useState } from "react";

import { createCourseWithSyllabus } from "../api/teacherCourses";
import { toast } from "react-toastify";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

type LessonForm = {
  title: string;
  date: string;
  start: string;
  end: string;
  meetUrl: string; 
};

type TopicForm = {
  title: string;
  lessons: LessonForm[];
};

const emptyLesson = (): LessonForm => ({
  title: "",
  date: "",
  start: "",
  end: "",
  meetUrl: "",
});

const emptyTopic = (): TopicForm => ({
  title: "",
  lessons: [emptyLesson()],
});

const toLessonDate = (iso: string): string => {
  if (!iso) return "";
  const d = new Date(iso);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

const isMeetUrl = (url: string): boolean => {
  if (!url.trim()) return false;
  try {
    const u = new URL(url.trim());
    return u.hostname === "meet.google.com";
  } catch {
    return false;
  }
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
    previewVideoProvider: "meet",
    previewMeetUrl: "",       
    aboutInstructor: "",
    startDate: "",
    endDate: "",
    totalTime: 0,
  });
  const [thumbnailName, setThumbnailName] = useState("");
  const [dragging, setDragging] = useState(false);

  const [topics, setTopics] = useState<TopicForm[]>([emptyTopic()]);

  const input =
    theme === "dark"
      ? "bg-gray-800/60 border-gray-600 text-white placeholder-gray-400"
      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500";

  const inputCls = `mt-1 w-full rounded-lg border px-3 py-2 outline-none transition focus:ring-2 focus:ring-blue-500/30 ${input}`;

  const setField = (k: string, v: string | number) =>
    setCourse((c) => ({ ...c, [k]: v }));

  const readFileAsDataUrl = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      toast.error("Image must be smaller than 3MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setField("thumbnail", String(reader.result || ""));
      setThumbnailName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) readFileAsDataUrl(file);
  };

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) readFileAsDataUrl(file);
  };

  const clearThumbnail = () => {
    setField("thumbnail", "");
    setThumbnailName("");
  };

  const addTopic = () =>
    setTopics((prev) => [...prev, emptyTopic()]);

  const removeTopic = (ti: number) =>
    setTopics((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== ti) : prev));

  const setTopicTitle = (ti: number, v: string) =>
    setTopics((prev) => {
      const next = structuredClone(prev);
      next[ti].title = v;
      return next;
    });

  const addLesson = (ti: number) =>
    setTopics((prev) => {
      const next = structuredClone(prev);
      next[ti].lessons.push(emptyLesson());
      return next;
    });

  const removeLesson = (ti: number, li: number) =>
    setTopics((prev) => {
      const next = structuredClone(prev);
      if (next[ti].lessons.length > 1) {
        next[ti].lessons.splice(li, 1);
      }
      return next;
    });

  const setLesson = (ti: number, li: number, k: keyof LessonForm, v: string) =>
    setTopics((prev) => {
      const next = structuredClone(prev);
      next[ti].lessons[li][k] = v;
      return next;
    });

  const buildTopic = (t: TopicForm, index: number): Topic => {
    const syllabus = {} as Topic["lesson_syllabus"];
    t.lessons.forEach((l, i) => {
      (syllabus as any)[`lesson_${i + 1}`] = l.title || "";
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

    if (!isMeetUrl(course.previewMeetUrl)) return false;

    const first = topics[0]?.lessons[0];
    if (!(first?.title && first?.date && first?.start && first?.end)) return false;

    if (!isMeetUrl(first.meetUrl)) return false;

    return true;
  }, [course, topics]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      toast.error(
        "Please fill title, description, a valid Google Meet preview link and at least the first lesson (with a valid Meet link)."
      );
      return;
    }
    setSaving(true);
    try {
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
        previewVideoProvider: "meet",
        previewVideoId: course.previewMeetUrl, 
        businessCategory: course.businessCategory || "General",
        testimonial: "",
        studentsCount: "0",
        status: "active",
        totalTime: Number(course.totalTime) || 0,
        startDate: course.startDate,
        endDate: course.endDate,
      };

      const syllabusPayload: Omit<Syllabus, "id"> = {
        previewCourse: course.previewMeetUrl, 
      } as Omit<Syllabus, "id">;

      topics.forEach((t, i) => {
        (syllabusPayload as any)[`topic_${i + 1}`] = buildTopic(t, i);
      });

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

            {/* Thumbnail: drag & drop + file upload */}
            <div className="sm:col-span-2">
              <label className="text-sm font-semibold">Thumbnail</label>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                className={`mt-1 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 text-center transition
                  ${dragging ? "border-blue-500 bg-blue-500/10" : theme === "dark" ? "border-gray-600" : "border-gray-300"}`}
              >
                {course.thumbnail ? (
                  <div className="flex flex-col items-center gap-3">
                    <img src={course.thumbnail} alt="thumbnail preview" className="h-32 w-auto rounded-lg object-cover" />
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-gray-500">{thumbnailName || "Selected image"}</span>
                      <button type="button" onClick={clearThumbnail} className="text-red-500 hover:underline">
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-gray-500">
                      Drag & drop an image here, or
                    </p>
                    <label className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                      Choose file
                      <input type="file" accept="image/*" className="hidden" onChange={onFileInput} />
                    </label>
                    <p className="text-xs text-gray-400">PNG/JPG, up to 3MB</p>
                  </>
                )}
              </div>
            </div>

            {/* Preview via Google Meet */}
            <div className="sm:col-span-2">
              <label className="text-sm font-semibold">Preview Google Meet link</label>
              <input
                className={inputCls}
                value={course.previewMeetUrl}
                onChange={(e) => setField("previewMeetUrl", e.target.value)}
                placeholder="https://meet.google.com/abc-defg-hij"
              />
              {course.previewMeetUrl && !isMeetUrl(course.previewMeetUrl) && (
                <p className="mt-1 text-xs text-red-500">Must be a valid meet.google.com link.</p>
              )}
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
              {topics.length > 1 && (
                <button type="button" onClick={() => removeTopic(ti)} className="text-sm text-red-500 hover:underline">
                  Remove section
                </button>
              )}
            </div>
            <input className={inputCls} value={topic.title} onChange={(e) => setTopicTitle(ti, e.target.value)} placeholder={`Section ${ti + 1} title`} />

            <div className="mt-4 space-y-4">
              {topic.lessons.map((lesson, li) => (
                <div key={li} className={`rounded-xl border p-4 ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase text-indigo-500">Lesson {li + 1}</p>
                    {topic.lessons.length > 1 && (
                      <button type="button" onClick={() => removeLesson(ti, li)} className="text-xs text-red-500 hover:underline">
                        Remove lesson
                      </button>
                    )}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="text-sm font-semibold">Lesson title</label>
                      <input className={inputCls} value={lesson.title} onChange={(e) => setLesson(ti, li, "title", e.target.value)} placeholder="Introduction to..." />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-sm font-semibold">Google Meet link</label>
                      <input
                        className={inputCls}
                        value={lesson.meetUrl}
                        onChange={(e) => setLesson(ti, li, "meetUrl", e.target.value)}
                        placeholder="https://meet.google.com/abc-defg-hij"
                      />
                      {lesson.meetUrl && !isMeetUrl(lesson.meetUrl) && (
                        <p className="mt-1 text-xs text-red-500">Must be a valid meet.google.com link.</p>
                      )}
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

            <button
              type="button"
              onClick={() => addLesson(ti)}
              className="mt-4 rounded-lg border border-indigo-400 px-4 py-2 text-sm font-medium text-indigo-500 transition hover:bg-indigo-500/10"
            >
              + Add lesson
            </button>
          </div>
        ))}

        {/* Add section */}
        <button
          type="button"
          onClick={addTopic}
          className="mt-6 w-full rounded-xl border-2 border-dashed border-blue-400 px-4 py-3 font-semibold text-blue-500 transition hover:bg-blue-500/10"
        >
          + Add section
        </button>

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
