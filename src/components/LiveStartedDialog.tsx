import { FaVideo } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import type { LiveMeta } from "../@types/types";

interface Props {
  live: LiveMeta;
  lessonTitle: string;
  onJoin: () => void;
  onClose: () => void;
}

export default function LiveStartedDialog({ live, lessonTitle, onJoin, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="relative bg-gradient-to-br from-indigo-600 to-violet-600 px-6 py-6 text-center text-white">
          <button onClick={onClose} className="absolute right-3 top-3 rounded-full p-1 hover:bg-white/20">
            <IoClose className="text-xl" />
          </button>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1 text-xs font-bold">
            <span className="h-2 w-2 animate-pulse rounded-full bg-white" /> LIVE NOW
          </span>
          
          <h3 className="mt-3 text-lg font-bold">Your lesson has started!</h3>
        </div>
        <div className="px-6 py-5 text-center">
          <p className="font-semibold text-gray-900">{lessonTitle}</p>
          
          <p className="mt-1 text-xs text-gray-400">{live.dateLabel} · {live.timeLabel}</p>
          <div className="mt-5 flex justify-center gap-3">
            <button onClick={onJoin} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
              <FaVideo /> Join live
            </button>
            <button onClick={onClose} className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
