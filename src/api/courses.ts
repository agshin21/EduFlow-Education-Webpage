import type { Course } from "../@types/types";

const BASE_URL = "https://6a0818fefa9b27c848faa2b1.mockapi.io/courses/teachers";

export interface CourseQuery {
  search?: string;
  level?: string;
  status?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}

export async function fetchCourses(query: CourseQuery): Promise<Course[]> {
  const params = new URLSearchParams();

  if (query.search) params.set("search", query.search);
  if (query.level) params.set("level", query.level);
  if (query.status) params.set("status", query.status);
  if (query.sortBy) {
    params.set("sortBy", query.sortBy);
    params.set("order", query.order ?? "asc");
  }

  const url = params.toString() ? `${BASE_URL}?${params}` : BASE_URL;

  const res = await fetch(url);

  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);

  return res.json();
}

export async function fetchCourseById(id: string | number): Promise<Course | null> {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}