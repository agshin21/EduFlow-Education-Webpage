import type { CartItem, StatusInput } from "../@types/types";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import type { Course } from "../@types/types";
import type { User } from "./Dashboard";
import { fetchCourses } from "../api/courses";
import { usePurchased } from "../store/purchasedStore";

const LEVELS = ["beginner", "intermediate", "advanced"];

const statusStyles: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  completed: "bg-green-100 text-green-700",
};

const levelStyles: Record<string, string> = {
  beginner: "bg-emerald-50 text-emerald-700",
  intermediate: "bg-amber-50 text-amber-700",
  advanced: "bg-rose-50 text-rose-700",
};

type PurchasedCourse = Course & CartItem;

function CourseCard({ course }: { course: PurchasedCourse }) { 
  const {purchased} = usePurchased()
  
  const isPurchased = (id?: number | string) => {
      return purchased.some((item) => String(item.id) === String(id))
    }
    
    const getCourseStatus = (course: StatusInput): string => {
      const today = new Date().setHours(0, 0, 0, 0);
      const startDateRaw = new Date(course.startDate)
      const endDateRaw = new Date(course.endDate)
      const startDate = isNaN(startDateRaw.getTime()) ? today : startDateRaw.setHours(0, 0, 0, 0);
      const endDate = isNaN(endDateRaw.getTime()) ? today : endDateRaw.setHours(0, 0, 0, 0);  
      const owned = isPurchased(course.id);
    
      if (owned) {
        if (today > endDate) return "completed"; 
        return "active";                          
      }
    
     
      if (today > endDate) return "locked";   
      if (today < startDate) return "upcoming";
      return "active";
    };

    const status = getCourseStatus(course)
    
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="relative h-44 overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {status && (
          <span
            className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-medium capitalize ${
              statusStyles[status] ?? "bg-gray-100 text-gray-600"
            }`}
          >
            {status}
          </span>
        )}
        <span className="absolute right-3 top-3 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
          Owned
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center gap-2">
          {course.businessCategory && (
            <span className="text-xs font-medium uppercase tracking-wide text-indigo-500">
              {course.businessCategory}
            </span>
          )}
          {course.level && (
            <span
              className={`rounded px-2 py-0.5 text-[11px] font-medium capitalize ${
                levelStyles[course.level] ?? "bg-gray-50 text-gray-600"
              }`}
            >
              {course.level}
            </span>
          )}
        </div>

        <h3 className="line-clamp-2 text-lg font-semibold text-gray-900">
          {course.title}
        </h3>
        {course.description && (
          <p className="mt-1 line-clamp-2 text-sm text-gray-500">
            {course.description}
          </p>
        )}

        {course.instructorName && (
          <div className="mt-3 flex items-center gap-3">
            {course.avatar && (
              <img
                src={course.avatar}
                alt={course.instructorName}
                className="h-8 w-8 rounded-full object-cover"
              />
            )}
            <span className="text-sm font-medium text-gray-700">
              {course.instructorName}
            </span>
          </div>
        )}

        <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
          {course.rating != null && <span>⭐ {course.rating}</span>}
          {course.totalTime != null && <span>🕒 {course.totalTime}h</span>}
          {course.studentsCount != null && <span>👥 {course.studentsCount}</span>}
        </div>

        <button className="mt-5 w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 active:scale-[0.98]">
          {status === "completed" ? "Review" : "Continue Learning"}
        </button>
      </div>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="h-44 animate-pulse bg-gray-200" />
      <div className="space-y-3 p-5">
        <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200" />
        <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
        <div className="h-9 w-full animate-pulse rounded bg-gray-200" />
      </div>
    </div>
  );
}

export default function MyCourses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const purchased = usePurchased((s) => s.purchased);

  const search = searchParams.get("search") ?? "";
  const level = searchParams.get("level") ?? "";
  const sortBy = searchParams.get("sortBy") ?? "";

  const [searchInput, setSearchInput] = useState(search);
  const navigate = useNavigate()
  const [catalog, setCatalog] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [user] = useState<User | null>(() => {
      const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
  });
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== search) updateParam("search", searchInput);
    }, 350);
    return () => clearTimeout(timer);
     
  }, [searchInput]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchCourses({})
      .then((data) => active && setCatalog(data))
      .catch(() => active && setCatalog([]))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);
  
  useEffect(() => {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      if (!user || !token) {
        navigate('/login');
      }
    }, [user, navigate]);

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next, { replace: true });
  }

  function clearFilters() {
    setSearchInput("");
    setSearchParams({}, { replace: true });
  }

  const purchasedCourses = useMemo<PurchasedCourse[]>(() => {
    return purchased.map((item) => {
      const match = catalog.find((c) => String(c.id) === String(item.id));
      return { ...match, ...item } as PurchasedCourse;
    });
  }, [purchased, catalog]);

  const visibleCourses = useMemo(() => {
    let list = purchasedCourses;

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.title?.toLowerCase().includes(q) ||
          c.instructorName?.toLowerCase().includes(q) ||
          c.businessCategory?.toLowerCase().includes(q)
      );
    }

    if (level) {
      list = list.filter((c) => c.level === level);
    }

    if (sortBy) {
      list = [...list].sort((a, b) => {
        if (sortBy === "title") return a.title?.localeCompare(b.title ?? "");
        if (sortBy === "price") return Number(a.price) - Number(b.price);
        if (sortBy === "rating") return Number(b.rating) - Number(a.rating);
        return 0;
      });
    }

    return list;
  }, [purchasedCourses, search, level, sortBy]);

  const hasFilters = Boolean(search || level || sortBy);
  const isEmpty = purchased.length === 0;

  return (
    <div className="min-h-screen pt-13 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-8 flex justify-between">
          <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
        </header>

        {/* Empty store state */}
        {isEmpty ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-20 text-center">
            <p className="text-lg font-medium text-gray-700">No courses yet</p>
            <p className="mt-1 text-sm text-gray-500">
              Browse the catalog and purchase a course to see it here.
            </p>
            <a
              href="/courses"
              className="mt-5 inline-block rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
            >
              Explore Courses
            </a>
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search your courses..."
                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
              <select
                value={level}
                onChange={(e) => updateParam("level", e.target.value)}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm capitalize outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">All levels</option>
                {LEVELS.map((l) => (
                  <option key={l} value={l} className="capitalize">
                    {l}
                  </option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => updateParam("sortBy", e.target.value)}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">Sort by</option>
                <option value="title">Title</option>
                <option value="price">Price</option>
                <option value="rating">Rating</option>
              </select>
            </div>

            {hasFilters && (
              <div className="mb-6 flex items-center gap-3 text-sm">
                <span className="text-gray-500">
                  {visibleCourses.length} result(s)
                </span>
                <button
                  onClick={clearFilters}
                  className="font-medium text-indigo-600 hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: purchased.length || 3 }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            ) : visibleCourses.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {visibleCourses.map((course) => (
                  <CourseCard key={String(course.id)} course={course} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-20 text-center">
                <p className="text-lg font-medium text-gray-700">
                  No matches
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  None of your courses match these filters.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
