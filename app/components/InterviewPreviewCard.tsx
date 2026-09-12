import { CheckCircle2, Sparkles } from "lucide-react";

/**
 * 純展示用的靜態卡片,模擬面試工具實際畫面的縮影,用在 Landing Page 的 Hero 區塊。
 * 沒有任何互動邏輯,只是讓訪客在還沒點進工具前,先看到產品長什麼樣子。
 */
export default function InterviewPreviewCard() {
  return (
    <div className="relative w-full max-w-md rounded-2xl border border-zinc-200 bg-white/90 p-5 shadow-xl shadow-indigo-950/5 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/90">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-zinc-400">
          問題 2 / 3
        </span>
        <span className="flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
          <Sparkles className="h-3 w-3" />
          AI 面試官
        </span>
      </div>

      <p className="mt-3 text-base font-medium text-zinc-900 dark:text-zinc-50">
        你如何在團隊中處理與同事意見不合的情況?請分享一個實際案例。
      </p>

      <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-400">
        「我會先理解對方的觀點,找出彼此目標一致的地方,再用數據佐證我的想法…」
      </div>

      <div className="mt-3 rounded-lg bg-emerald-50 p-3 dark:bg-emerald-950/60">
        <p className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="h-3.5 w-3.5" />
          建議回答方式
        </p>
        <p className="mt-1 text-sm text-emerald-800/90 dark:text-emerald-300/90">
          可以用「情境 → 行動 → 結果」的架構描述,並強調你如何主動溝通、達成共識…
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-zinc-800">
        <span className="text-xs text-zinc-400">完成後將取得整體評分</span>
        <span className="rounded-full bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white dark:bg-white dark:text-zinc-900">
          下一題
        </span>
      </div>
    </div>
  );
}
