import { FaCheckCircle, FaCode, FaPlay, FaRedo, FaTerminal, FaTimesCircle } from "react-icons/fa";
import { useEffect, useMemo, useRef, useState } from "react";

import type { CodePractice as CodePracticeType } from "../@types/types";
import { IoMdTime } from "react-icons/io";
import { LuCircleCheck } from "react-icons/lu";
import { RiQuestionLine } from "react-icons/ri";
import { useTheme } from "../context/ThemeContext";

type Status = "idle" | "running" | "passed" | "failed" | "error";

interface CodePracticeProps {
  practice: CodePracticeType;
  isCompleted: boolean;
  onComplete: () => void;
  onContinue: () => void;
  onPrevious?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
}

function normalizeOutput(text: string): string {
  return text.replace(/\r\n/g, "\n").trim();
}

/**
 * Run the user's JS code inside an isolated Function() sandbox.
 * Returns the captured console output plus any thrown error.
 */
function runJavaScript(code: string): { output: string; error?: string } {
  const logs: string[] = [];
  const fakeConsole = {
    log: (...args: unknown[]) =>
      logs.push(args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" ")),
    info: (...args: unknown[]) =>
      logs.push(args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" ")),
    warn: (...args: unknown[]) =>
      logs.push(args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" ")),
    error: (...args: unknown[]) =>
      logs.push(args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" ")),
  };

  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function("console", `"use strict";\n${code}`);
    fn(fakeConsole);
    return { output: logs.join("\n") };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { output: logs.join("\n"), error: message };
  }
}

const difficultyColors: Record<string, string> = {
  easy: "bg-emerald-100 text-emerald-700",
  medium: "bg-amber-100 text-amber-700",
  hard: "bg-rose-100 text-rose-700",
};

export default function CodePractice({
  practice,
  isCompleted,
  onComplete,
  onContinue,
  onPrevious,
  hasPrevious,
  hasNext,
}: CodePracticeProps) {
  const { theme } = useTheme();
  const [code, setCode] = useState<string>(practice.starterCode);
  const [output, setOutput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [showHint, setShowHint] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Whenever a new practice loads, reset the editor
  useEffect(() => {
    setCode(practice.starterCode);
    setOutput("");
    setError(null);
    setStatus("idle");
    setShowHint(false);
  }, [practice.id, practice.starterCode]);

  // Auto-resize the textarea so users can write larger code blocks
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [code]);

  const handleRun = () => {
    setStatus("running");
    setError(null);
    const { output: out, error: err } = runJavaScript(code);
    setOutput(out);
    if (err) {
      setError(err);
      setStatus("error");
      return;
    }
    const expected = normalizeOutput(practice.expectedOutput);
    const actual = normalizeOutput(out);
    if (actual === expected) {
      setStatus("passed");
    } else {
      setStatus("failed");
    }
  };

  const handleReset = () => {
    setCode(practice.starterCode);
    setOutput("");
    setError(null);
    setStatus("idle");
  };

  const handleSubmit = () => {
    if (status !== "passed") {
      handleRun();
      return;
    }
    if (!isCompleted) onComplete();
    onContinue();
  };

  const lineCount = useMemo(() => code.split("\n").length, [code]);

  const isDark = theme === "dark";

  return (
    <div
      className={`mt-5 overflow-hidden rounded-2xl transition duration-500 ${
        isDark ? "bg-[#313131]/90" : "bg-white"
      } shadow-sm border ${isDark ? "border-white/5" : "border-slate-100"}`}
    >
      {/* Header */}
      <div
        className={`flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between ${
          isDark ? "bg-gradient-to-r from-indigo-900/40 to-violet-900/30" : "bg-gradient-to-r from-indigo-50 to-violet-50"
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/30">
            <FaCode />
          </div>
          <div>
            <p
              className={`text-xs font-semibold uppercase tracking-wide ${
                isDark ? "text-indigo-300" : "text-indigo-600"
              }`}
            >
              Code Practice
            </p>
            <h2
              className={`mt-0.5 text-xl font-bold leading-tight ${
                isDark ? "text-[#e1dede]" : "text-gray-900"
              }`}
            >
              {practice.title}
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
              difficultyColors[practice.difficulty] ?? "bg-gray-100 text-gray-600"
            }`}
          >
            {practice.difficulty}
          </span>
          {isCompleted && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              <LuCircleCheck /> Completed
            </span>
          )}
        </div>
      </div>

      {/* Description & instructions */}
      <div className={`px-6 py-5 ${isDark ? "text-[#e1dede]/85" : "text-gray-700"}`}>
        <p className="text-sm leading-relaxed">{practice.description}</p>

        <div className="mt-4">
          <p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? "text-[#e1dede]/60" : "text-gray-500"}`}>
            Instructions
          </p>
          <ol className="mt-2 space-y-1.5 text-sm">
            {practice.instructions.map((step, i) => (
              <li key={i} className="flex gap-2">
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                    isDark ? "bg-indigo-500/20 text-indigo-300" : "bg-indigo-100 text-indigo-700"
                  }`}
                >
                  {i + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <button
          onClick={() => setShowHint((v) => !v)}
          className={`mt-4 inline-flex items-center gap-1.5 text-xs font-semibold ${
            isDark ? "text-indigo-300 hover:text-indigo-200" : "text-indigo-600 hover:text-indigo-700"
          }`}
        >
          <RiQuestionLine className="text-base" />
          {showHint ? "Hide hint" : "Show hint"}
        </button>
        {showHint && (
          <p
            className={`mt-2 rounded-lg p-3 text-xs leading-relaxed ${
              isDark ? "bg-amber-500/10 text-amber-200" : "bg-amber-50 text-amber-800"
            }`}
          >
            💡 Use <code className="font-mono">console.log(...)</code> to print the final value. Compare your output carefully with the
            expected output below — whitespace and casing matter.
          </p>
        )}
      </div>

      {/* Editor + expected output */}
      <div className="grid gap-0 lg:grid-cols-2">
        {/* Editor */}
        <div
          className={`relative border-y ${isDark ? "border-white/5" : "border-slate-100"} lg:border-y-0 lg:border-r`}
        >
          <div
            className={`flex items-center justify-between px-4 py-2 text-xs font-semibold uppercase tracking-wide ${
              isDark ? "bg-[#1f1f1f] text-[#e1dede]/70" : "bg-slate-100 text-slate-600"
            }`}
          >
            <span className="flex items-center gap-2">
              <FaCode /> solution.js
            </span>
            <span className="text-[10px] opacity-70">{lineCount} lines</span>
          </div>
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className={`w-full resize-none font-mono text-sm outline-none ${
              isDark
                ? "bg-[#0f1115] text-[#e1dede] placeholder:text-[#e1dede]/30"
                : "bg-[#0f1115] text-[#e1dede] placeholder:text-[#e1dede]/30"
            } px-4 py-4`}
            placeholder="// Write your code here..."
            style={{ minHeight: "272px" }}
          />
        </div>

        {/* Console + Expected */}
        <div className="flex flex-col">
          {/* Expected */}
          <div
            className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide ${
              isDark ? "bg-[#1f1f1f] text-[#e1dede]/70" : "bg-slate-100 text-slate-600"
            }`}
          >
            <span className="flex items-center gap-2">
              <FaCheckCircle className="text-emerald-400" /> Expected Output
            </span>
          </div>
          <pre
            className={`whitespace-pre-wrap break-words px-4 py-3 font-mono text-sm leading-6 ${
              isDark ? "bg-[#0a0c10] text-emerald-300" : "bg-[#0a0c10] text-emerald-300"
            }`}
          >
            {practice.expectedOutput}
          </pre>

          {/* Console */}
          <div
            className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide ${
              isDark ? "bg-[#1f1f1f] text-[#e1dede]/70" : "bg-slate-100 text-slate-600"
            }`}
          >
            <span className="flex items-center gap-2">
              <FaTerminal /> Console
            </span>
          </div>
          <div
            className={`h-44 px-4 py-3 font-mono text-sm ${
              isDark ? "bg-[#0a0c10] text-[#e1dede]" : "bg-[#0a0c10] text-[#e1dede]"
            }`}
          >
            {status === "idle" && (
              <span className="text-[#e1dede]/40">// Click "Run" to see the output…</span>
            )}
            {status === "running" && (
              <span className="text-amber-300">// Running…</span>
            )}
            {(status === "passed" || status === "failed" || status === "error") && (
              <div className="space-y-2">
                {error && (
                  <div className="text-rose-400">
                    <strong>Error:</strong> {error}
                  </div>
                )}
                {output ? (
                  <pre className="whitespace-pre-wrap break-words">{output}</pre>
                ) : (
                  !error && <span className="text-[#e1dede]/40">(no output)</span>
                )}
                {status === "passed" && (
                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-emerald-500/15 px-2 py-1 text-xs font-semibold text-emerald-300">
                    <FaCheckCircle /> Output matches expected.
                  </div>
                )}
                {status === "failed" && (
                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-rose-500/15 px-2 py-1 text-xs font-semibold text-rose-300">
                    <FaTimesCircle /> Output doesn't match — try again.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div
        className={`flex flex-wrap items-center gap-3 border-t px-6 py-4 ${
          isDark ? "border-white/5 bg-[#252525]" : "border-slate-100 bg-slate-50"
        }`}
      >
        <button
          onClick={handleRun}
          className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600 active:scale-[0.98]"
        >
          <FaPlay /> Run Code
        </button>

        <button
          onClick={handleReset}
          className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
            isDark
              ? "border-white/10 text-[#e1dede]/80 hover:bg-white/5"
              : "border-slate-200 text-gray-700 hover:bg-white"
          }`}
        >
          <FaRedo /> Reset
        </button>

        <div className="ml-auto flex items-center gap-3">
          <span className={`inline-flex items-center gap-1 text-xs ${isDark ? "text-[#e1dede]/60" : "text-gray-500"}`}>
            <IoMdTime /> ~10 min
          </span>
          {onPrevious && (
            <button
              onClick={onPrevious}
              disabled={!hasPrevious}
              className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${
                isDark
                  ? "border-white/10 text-[#e1dede]/80 hover:bg-white/5"
                  : "border-slate-200 text-gray-700 hover:bg-white"
              }`}
            >
              ← Previous
            </button>
          )}
          <button
            onClick={handleSubmit}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition active:scale-[0.98] ${
              status === "passed"
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {status === "passed"
              ? isCompleted
                ? hasNext
                  ? "Continue →"
                  : "✓ Done"
                : "Submit & Continue →"
              : "Run to Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}