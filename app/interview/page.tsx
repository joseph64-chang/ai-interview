"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, RotateCcw, Sparkles } from "lucide-react";
import {
  DEFAULT_TOTAL_QUESTIONS,
  Evaluation,
  InterviewResponse,
  MAX_TOTAL_QUESTIONS,
  MIN_TOTAL_QUESTIONS,
  QAPair,
} from "@/lib/interview";
import Logo from "../components/Logo";

type Phase = "input" | "interviewing" | "done";

function QAHistoryList({ history }: { history: QAPair[] }) {
  if (history.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      {history.map((pair, i) => (
        <div
          key={i}
          className="rounded-2xl border border-zinc-200 bg-white p-5 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
        >
          <p className="font-medium text-zinc-900 dark:text-zinc-50">
            Q{i + 1}. {pair.question}
          </p>
          <p className="mt-2 whitespace-pre-wrap text-zinc-600 dark:text-zinc-400">
            {pair.answer}
          </p>
          {pair.suggestedAnswer && (
            <div className="mt-3 rounded-xl bg-emerald-50 p-3 dark:bg-emerald-950/60">
              <p className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                建議回答方式
              </p>
              <p className="mt-1 whitespace-pre-wrap text-emerald-800/90 dark:text-emerald-300/90">
                {pair.suggestedAnswer}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function InterviewPage() {
  const [phase, setPhase] = useState<Phase>("input");
  const [jobDescription, setJobDescription] = useState("");
  const [totalQuestions, setTotalQuestions] = useState(DEFAULT_TOTAL_QUESTIONS);
  const [history, setHistory] = useState<QAPair[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [questionNumber, setQuestionNumber] = useState(1);
  const [answer, setAnswer] = useState("");
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function callInterviewApi(payload: {
    history: QAPair[];
    currentQuestion?: string;
    answer?: string;
  }) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription, totalQuestions, ...payload }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "發生未知錯誤");
      }

      const result = data as InterviewResponse;
      setHistory(result.history);

      if (result.done) {
        setEvaluation(result.evaluation);
        setPhase("done");
      } else {
        setCurrentQuestion(result.question);
        setQuestionNumber(result.questionNumber);
        setTotalQuestions(result.totalQuestions);
        setAnswer("");
        setPhase("interviewing");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "發生未知錯誤");
    } finally {
      setLoading(false);
    }
  }

  function handleStart() {
    if (!jobDescription.trim()) return;
    callInterviewApi({ history: [] });
  }

  function handleSubmitAnswer() {
    if (!answer.trim()) return;
    callInterviewApi({ history, currentQuestion, answer });
  }

  function handleRestart() {
    setPhase("input");
    setJobDescription("");
    setTotalQuestions(DEFAULT_TOTAL_QUESTIONS);
    setHistory([]);
    setCurrentQuestion("");
    setQuestionNumber(1);
    setAnswer("");
    setEvaluation(null);
    setError(null);
  }

  const progressPercent =
    phase === "done" ? 100 : Math.round(((questionNumber - 1) / totalQuestions) * 100);

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <div className="border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-black/80">
        <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            <ArrowLeft className="h-4 w-4" />
            返回首頁
          </Link>
          <Logo />
        </div>
      </div>

      {phase !== "input" && (
        <div className="h-1 w-full bg-zinc-200 dark:bg-zinc-800">
          <div
            className="h-1 bg-gradient-to-r from-indigo-500 to-violet-600 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      <main className="flex flex-1 flex-col items-center px-4 py-12">
        <div className="flex w-full max-w-2xl flex-col gap-6">
          {phase === "input" && (
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                開始一場模擬面試
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                貼上職缺描述並設定題數,AI 面試官就會依內容出題。
              </p>
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
              {error}
            </div>
          )}

          {phase === "input" && (
            <div className="flex flex-col gap-5 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                職缺描述
                <textarea
                  className="min-h-40 rounded-xl border border-zinc-300 bg-white p-3 text-base font-normal text-zinc-900 outline-none transition-colors focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
                  placeholder="例如：前端工程師，需熟悉 React、TypeScript，負責電商網站開發..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                面試題數（{MIN_TOTAL_QUESTIONS}～{MAX_TOTAL_QUESTIONS} 題）
                <input
                  type="number"
                  min={MIN_TOTAL_QUESTIONS}
                  max={MAX_TOTAL_QUESTIONS}
                  className="w-24 rounded-xl border border-zinc-300 bg-white p-2 text-base font-normal text-zinc-900 outline-none transition-colors focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
                  value={totalQuestions}
                  onChange={(e) => {
                    const n = Number(e.target.value);
                    if (Number.isNaN(n)) return;
                    setTotalQuestions(
                      Math.min(MAX_TOTAL_QUESTIONS, Math.max(MIN_TOTAL_QUESTIONS, n))
                    );
                  }}
                />
              </label>

              <button
                className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-700 disabled:opacity-40 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                onClick={handleStart}
                disabled={loading || !jobDescription.trim()}
              >
                <Sparkles className="h-4 w-4" />
                {loading ? "產生問題中..." : "開始模擬面試"}
              </button>
            </div>
          )}

          {phase === "interviewing" && (
            <div className="flex flex-col gap-6">
              <QAHistoryList history={history} />

              <div className="rounded-2xl border border-indigo-200 bg-white p-5 shadow-sm dark:border-indigo-500/30 dark:bg-zinc-900">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
                    問題 {questionNumber} / {totalQuestions}
                  </p>
                  <span className="flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                    <Sparkles className="h-3 w-3" />
                    AI 面試官
                  </span>
                </div>
                <p className="mt-3 text-lg font-medium text-zinc-900 dark:text-zinc-50">
                  {currentQuestion}
                </p>
              </div>

              <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                你的回答
                <textarea
                  className="min-h-32 rounded-xl border border-zinc-300 bg-white p-3 text-base font-normal text-zinc-900 outline-none transition-colors focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                />
              </label>

              <button
                className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-700 disabled:opacity-40 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                onClick={handleSubmitAnswer}
                disabled={loading || !answer.trim()}
              >
                {loading ? "處理中..." : "送出回答"}
              </button>
            </div>
          )}

          {phase === "done" && evaluation && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2 text-center">
                <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                  面試完成！
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  這是你這次模擬面試的整體表現
                </p>
              </div>

              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 to-indigo-950 p-8 text-center shadow-xl">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-indigo-500/30 blur-3xl"
                />
                <p className="text-sm font-medium text-indigo-300">總體評分</p>
                <p className="mt-1 text-5xl font-semibold text-white">
                  {evaluation.score}
                  <span className="text-lg font-normal text-zinc-400"> / 10</span>
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                  <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    優點
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                    {evaluation.strengths}
                  </p>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                  <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                    改善建議
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                    {evaluation.suggestions}
                  </p>
                </div>
              </div>

              <QAHistoryList history={history} />

              <button
                className="inline-flex items-center justify-center gap-2 self-start rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-800"
                onClick={handleRestart}
              >
                <RotateCcw className="h-4 w-4" />
                重新開始
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
