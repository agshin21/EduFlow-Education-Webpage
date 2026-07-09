import type { LiveMeta, LiveStatus, MeetingProvider } from "../@types/types";

const PROVIDERS: MeetingProvider[] = ["teams", "zoom", "meet"];

const INSTRUCTORS = [
  { name: "Sarah Chen", avatar: "https://i.pravatar.cc/150?img=47" },
  { name: "David Miller", avatar: "https://i.pravatar.cc/150?img=12" },
  { name: "Aylin Kaya", avatar: "https://i.pravatar.cc/150?img=32" },
  { name: "James Okoro", avatar: "https://i.pravatar.cc/150?img=59" },
];

const JOIN_URLS: Record<MeetingProvider, string> = {
  teams: "https://teams.microsoft.com/l/meetup-join/eduflow-live",
  zoom: "https://zoom.us/j/eduflow-live",
  meet: "https://meet.google.com/eduflow-live",
};

const MONTHS: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

/** "26 Jun 2026" + "10:00" -> Date */
export function parseLessonDateTime(dateStr: string, timeStr: string): Date {
  const [dayRaw, monRaw, yearRaw] = String(dateStr).trim().split(/\s+/);
  const day = parseInt(dayRaw, 10);
  const month = MONTHS[String(monRaw).toLowerCase().slice(0, 3)] ?? 0;
  const year = parseInt(yearRaw, 10);
  const [h, m] = String(timeStr).trim().split(":").map(Number);
  return new Date(year, month, day, h || 0, m || 0, 0, 0);
}

export function buildLiveMeta(
  courseId: string | undefined,
  lessonIndex: number,
  dateStr: string,
  startTime: string,
  endTime: string
): LiveMeta {
  const start = parseLessonDateTime(dateStr, startTime);
  const end = parseLessonDateTime(dateStr, endTime);
  const seed = (Number(courseId) || 1) + lessonIndex;
  const provider = PROVIDERS[seed % PROVIDERS.length];
  const instructor = INSTRUCTORS[seed % INSTRUCTORS.length];

  return {
    startsAt: start.toISOString(),
    endsAt: end.toISOString(),
    provider,
    joinUrl: JOIN_URLS[provider],
    instructorName: instructor.name,
    instructorAvatar: instructor.avatar,
    dateLabel: dateStr,
    timeLabel: `${startTime} - ${endTime}`,
  };
}

export function getLiveStatus(meta: LiveMeta, ref: Date = new Date()): LiveStatus {
  const start = new Date(meta.startsAt).getTime();
  const end = new Date(meta.endsAt).getTime();
  const t = ref.getTime();
  if (t < start) return "upcoming";
  if (t >= start && t < end) return "live";
  return "ended";
}

export function providerLabel(p: MeetingProvider): string {
  return p === "teams" ? "Microsoft Teams" : p === "zoom" ? "Zoom" : "Google Meet";
}

export function providerColor(p: MeetingProvider): string {
  return p === "teams" ? "#5059C9" : p === "zoom" ? "#2D8CFF" : "#00897B";
}

/** upcoming ders için kalan süre */
export function timeUntil(meta: LiveMeta, ref: Date = new Date()): string {
  const diff = new Date(meta.startsAt).getTime() - ref.getTime();
  if (diff <= 0) return "starting now";
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  if (days > 0) return `in ${days}d ${hours}h`;
  if (hours > 0) return `in ${hours}h ${mins}m`;
  return `in ${mins}m`;
}
