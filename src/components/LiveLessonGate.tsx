import type { LiveMeta, LiveStatus } from "../@types/types";
import { providerColor, providerLabel, timeUntil } from "../utils/liveSchedule";

import { FaVideo } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

interface Props {
  live: LiveMeta;
  status: LiveStatus;      
  lessonTitle: string;
}

export default function LiveLessonGate({ live, status, lessonTitle }: Props) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const isLive = status === "live";

  return (
    <div className={`overflow-hidden rounded-2xl border shadow-sm ${isDark ? "bg-[#313131]/90 border-white/5" : "bg-white border-slate-100"}`}>
      <div
        className="relative flex flex-col items-center justify-center px-6 py-14 text-center"
        style={{ background: isLive
          ? "linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%)"
          : isDark ? "#1f1f1f" : "#f8fafc" }}
      >
        {isLive && (
          <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">
            <span className="h-2 w-2 animate-pulse rounded-full bg-white" /> LIVE NOW
          </span>
        )}

        <img
          src={live.instructorAvatar}
          alt={live.instructorName}
          className="h-20 w-20 rounded-full border-4 border-white object-cover shadow-lg"
        />
        <h2 className={`mt-4 text-xl font-bold ${isLive ? "text-white" : isDark ? "text-[#e1dede]" : "text-gray-900"}`}>
          {lessonTitle}
        </h2>
        <p className={`text-sm ${isLive ? "text-white/80" : isDark ? "text-[#e1dede]/60" : "text-gray-500"}`}>
          with {live.instructorName}
        </p>

        {isLive ? (
          <>
            <p className="mt-3 text-sm text-white/90">
              This lesson has already started on {providerLabel(live.provider)}.
            </p>
            <a
              href={live.joinUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-indigo-700 shadow hover:bg-indigo-50"
            >
              <FaVideo style={{ color: providerColor(live.provider) }} />
              Join on {providerLabel(live.provider)}
            </a>
          </>
        ) : (
          <>
            <p className={`mt-3 text-sm ${isDark ? "text-[#e1dede]/70" : "text-gray-500"}`}>
              This live session hasn’t started yet.
            </p>
            <div className={`mt-4 rounded-xl px-5 py-3 text-sm ${isDark ? "bg-[#484848]/40 text-[#e1dede]" : "bg-white text-gray-700 shadow-sm"}`}>
              <p className="font-semibold">{live.dateLabel} · {live.timeLabel}</p>
              <p className="mt-1 text-indigo-600 font-medium">Starts {timeUntil(live)}</p>
              <p className={`mt-1 text-xs ${isDark ? "text-[#e1dede]/50" : "text-gray-400"}`}>on {providerLabel(live.provider)}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
