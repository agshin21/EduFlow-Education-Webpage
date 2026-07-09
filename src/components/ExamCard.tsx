import { useEffect, useMemo, useState } from "react";

import type { Exam } from "../@types/types";
import { FaClipboardCheck } from "react-icons/fa";
import { LuCircleCheck } from "react-icons/lu";
import { useTheme } from "../context/ThemeContext";

interface ExamCardProps {
  exam: Exam;
  isCompleted: boolean;
  onComplete: () => void;
  onContinue: () => void;
  hasNext?: boolean;
}

export default function ExamCard({ exam, isCompleted, onComplete, onContinue, hasNext }: ExamCardProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setAnswers({});
    setSubmitted(false);
  }, [exam.id]);

  const score = useMemo(() => {
    const correct = exam.questions.filter((q) => answers[q.id] === q.correctIndex).length;
    return Math.round((correct / exam.questions.length) * 100);
  }, [answers, exam.questions]);

  const passed = score >= exam.passScore;
  const allAnswered = exam.questions.every((q) => answers[q.id] !== undefined);

  const handleSubmit = () => {
    if (!allAnswered) return;
    setSubmitted(true);
    if (score >= exam.passScore && !isCompleted) onComplete();
  };

  return (
    <div className={`mt-5 overflow-hidden rounded-2xl border shadow-sm transition duration-500 ${
      isDark ? "bg-[#313131]/90 border-white/5" : "bg-white border-slate-100"
    }`}>
      <div className={`flex items-center justify-between px-6 py-5 ${
        isDark ? "bg-gradient-to-r from-amber-900/40 to-orange-900/30" : "bg-gradient-to-r from-amber-50 to-orange-50"
      }`}>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg">
            <FaClipboardCheck />
          </div>
          <div>
            <p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? "text-amber-300" : "text-amber-600"}`}>
              Topic Exam
            </p>
            <h2 className={`text-xl font-bold ${isDark ? "text-[#e1dede]" : "text-gray-900"}`}>{exam.title}</h2>
          </div>
        </div>
        {isCompleted && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            <LuCircleCheck /> Passed
          </span>
        )}
      </div>

      <div className="px-6 py-5">
        <p className={`mb-4 text-sm ${isDark ? "text-[#e1dede]/70" : "text-gray-500"}`}>
          Answer all questions. You need {exam.passScore}% to pass this topic.
        </p>

        <div className="space-y-6">
          {exam.questions.map((q, qi) => (
            <div key={q.id}>
              <p className={`mb-2 font-medium ${isDark ? "text-[#e1dede]" : "text-gray-900"}`}>
                {qi + 1}. {q.question}
              </p>
              <div className="space-y-2">
                {q.options.map((opt, oi) => {
                  const selected = answers[q.id] === oi;
                  const isCorrect = q.correctIndex === oi;
                  let cls = isDark ? "border-white/10 text-[#e1dede]/80" : "border-gray-200 text-gray-700";
                  if (submitted) {
                    if (isCorrect) cls = "border-emerald-500 bg-emerald-50 text-emerald-700";
                    else if (selected) cls = "border-rose-400 bg-rose-50 text-rose-700";
                  } else if (selected) {
                    cls = "border-indigo-500 bg-indigo-50 text-indigo-700";
                  }
                  return (
                    <button
                      key={oi}
                      disabled={submitted}
                      onClick={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                      className={`flex w-full items-center gap-3 rounded-xl border px-4 py-2.5 text-left text-sm transition ${cls}`}
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded-full border text-[11px]">
                        {String.fromCharCode(65 + oi)}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>
              {submitted && q.explanation && (
                <p className={`mt-2 text-xs ${isDark ? "text-[#e1dede]/60" : "text-gray-500"}`}>{q.explanation}</p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {!submitted ? (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered}
              className="rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-40"
            >
              Submit exam
            </button>
          ) : (
            <>
              <span className={`rounded-xl px-4 py-2.5 text-sm font-semibold ${
                passed ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
              }`}>
                Score: {score}% — {passed ? "Passed 🎉" : "Try again"}
              </span>
              {passed ? (
                hasNext && (
                  <button onClick={onContinue} className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700">
                    Continue
                  </button>
                )
              ) : (
                <button onClick={() => { setSubmitted(false); setAnswers({}); }} className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium">
                  Retake
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
