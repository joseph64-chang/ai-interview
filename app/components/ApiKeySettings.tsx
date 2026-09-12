"use client";

import { useState } from "react";
import { Check, KeyRound, Trash2 } from "lucide-react";

type Props = {
  apiKey: string;
  onSave: (key: string) => void;
  onClear: () => void;
};

export default function ApiKeySettings({ apiKey, onSave, onClear }: Props) {
  const [draft, setDraft] = useState(apiKey);
  const [expanded, setExpanded] = useState(!apiKey);
  const [justSaved, setJustSaved] = useState(false);

  function handleSave() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onSave(trimmed);
    setJustSaved(true);
    setExpanded(false);
    setTimeout(() => setJustSaved(false), 2000);
  }

  function handleClear() {
    onClear();
    setDraft("");
    setExpanded(true);
  }

  const maskedKey = apiKey.length > 8 ? `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}` : "已設定";

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 text-left"
        onClick={() => setExpanded((e) => !e)}
      >
        <span className="flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-zinc-50">
          <KeyRound className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          OpenAI API Key
        </span>
        <span
          className={
            apiKey
              ? "text-xs font-medium text-emerald-600 dark:text-emerald-400"
              : "text-xs font-medium text-amber-600 dark:text-amber-400"
          }
        >
          {apiKey ? `已設定（${maskedKey}）` : "尚未設定"}
        </span>
      </button>

      {expanded && (
        <div className="mt-4 flex flex-col gap-3">
          <p className="text-xs leading-5 text-zinc-500 dark:text-zinc-400">
            請輸入你自己的 OpenAI API Key
            才能開始模擬面試。這組金鑰只會儲存在你目前瀏覽器的
            localStorage，發送問題時才會帶給伺服器用來呼叫 OpenAI，伺服器不會另外記錄或保存。
          </p>
          <input
            type="password"
            autoComplete="off"
            spellCheck={false}
            placeholder="sk-..."
            className="rounded-xl border border-zinc-300 bg-white p-2.5 text-sm text-zinc-900 outline-none transition-colors focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-40 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              onClick={handleSave}
              disabled={!draft.trim()}
            >
              <Check className="h-3.5 w-3.5" />
              儲存
            </button>
            {apiKey && (
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-full border border-zinc-300 px-4 py-2 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                onClick={handleClear}
              >
                <Trash2 className="h-3.5 w-3.5" />
                清除
              </button>
            )}
          </div>
        </div>
      )}

      {justSaved && (
        <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">已儲存到瀏覽器</p>
      )}
    </div>
  );
}
