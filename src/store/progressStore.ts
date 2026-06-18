import { createJSONStorage, persist } from "zustand/middleware";

import { create } from "zustand";

interface ProgressState {
  completed: Record<string, string[]>;
  totals: Record<string, number>;
  lastLesson: Record<string, string>;
  toggleLesson: (courseId: string, lessonId: string) => void;
  isCompleted: (courseId: string, lessonId: string) => boolean;
  getCompleted: (courseId: string) => string[];
  setTotal: (courseId: string, total: number) => void;
  isCourseCompleted: (courseId: string) => boolean;
  resetCourse: (courseId: string) => void;
  setLastLesson: (courseId: string, lessonId: string) => void; 
  getLastLesson: (courseId: string) => string | undefined;     
  getProgressPct: (courseId: string) => number;                
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
      totals: {},
      lastLesson: {},
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
      setTotal: (courseId, total) =>
        set((state) =>
          state.totals[courseId] === total
            ? state
            : { totals: { ...state.totals, [courseId]: total } }
        ),
      isCourseCompleted: (courseId) => {
        const total = get().totals[courseId] ?? 0;
        const done = (get().completed[courseId] ?? []).length;
        return total > 0 && done >= total;
      },
      resetCourse: (courseId) =>
        set((state) => {
          const next = { ...state.completed };
          delete next[courseId];
          const nextLast = { ...state.lastLesson };
          delete nextLast[courseId];
          return { completed: next, lastLesson: nextLast };
        }),

     
      setLastLesson: (courseId, lessonId) =>
        set((state) =>
          state.lastLesson[courseId] === lessonId
            ? state
            : { lastLesson: { ...state.lastLesson, [courseId]: lessonId } }
        ),
      getLastLesson: (courseId) => get().lastLesson[courseId],

      
      getProgressPct: (courseId) => {
        const total = get().totals[courseId] ?? 0;
        const done = (get().completed[courseId] ?? []).length;
        return total > 0 ? Math.round((done / total) * 100) : 0;
      },
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
