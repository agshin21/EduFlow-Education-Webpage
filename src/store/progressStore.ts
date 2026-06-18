import { createJSONStorage, persist } from "zustand/middleware";

import { create } from "zustand";

interface ProgressState {
  completed: Record<string, string[]>;
  toggleLesson: (courseId: string, lessonId: string) => void;
  isCompleted: (courseId: string, lessonId: string) => boolean;
  getCompleted: (courseId: string) => string[];
  resetCourse: (courseId: string) => void;
}

const getCurrentUserId = (): string => {
  const raw = localStorage.getItem("user") || sessionStorage.getItem("user");
  if (!raw) return "guest";
  try {
    return String(JSON.parse(raw).id ?? "guest");
  } catch {
    return "guest";
  }
};

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      completed: {},
      toggleLesson: (courseId, lessonId) =>
        set((state) => {
          const current = state.completed[courseId] ?? [];
          const exists = current.includes(lessonId);
          return {
            completed: {
              ...state.completed,
              [courseId]: exists
                ? current.filter((id) => id !== lessonId)
                : [...current, lessonId],
            },
          };
        }),
      isCompleted: (courseId, lessonId) =>
        (get().completed[courseId] ?? []).includes(lessonId),
      getCompleted: (courseId) => get().completed[courseId] ?? [],
      resetCourse: (courseId) =>
        set((state) => {
          const next = { ...state.completed };
          delete next[courseId];
          return { completed: next };
        }),
    }),
    {
      name: "course-progress",
      storage: createJSONStorage(() => ({
        getItem: (name) =>
          localStorage.getItem(`${name}_${getCurrentUserId()}`),
        setItem: (name, value) =>
          localStorage.setItem(`${name}_${getCurrentUserId()}`, value),
        removeItem: (name) =>
          localStorage.removeItem(`${name}_${getCurrentUserId()}`),
      })),
    }
  )
);
