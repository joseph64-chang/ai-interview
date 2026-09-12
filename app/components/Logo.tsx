import { Sparkles } from "lucide-react";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 ${className}`}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm">
        <Sparkles className="h-4 w-4" strokeWidth={2.5} />
      </span>
      <span>
        AI<span className="text-indigo-600 dark:text-indigo-400">面試</span>模擬器
      </span>
    </span>
  );
}
