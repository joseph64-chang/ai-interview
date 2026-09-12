import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12 sm:px-6 md:flex-row md:justify-between">
        <div className="flex max-w-xs flex-col gap-3">
          <Logo />
          <p className="text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            用 AI 模擬真實面試情境,根據你貼上的職缺內容出題,幫助你在正式面試前充分練習。
          </p>
        </div>

        <div className="flex gap-16">
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              產品
            </p>
            <a
              href="#features"
              className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              功能特色
            </a>
            <a
              href="#how-it-works"
              className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              使用流程
            </a>
            <a
              href="#faq"
              className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              常見問題
            </a>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              開始使用
            </p>
            <Link
              href="/interview"
              className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              立即模擬面試
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-200 px-4 py-6 text-center text-xs text-zinc-400 dark:border-zinc-800 sm:px-6">
        © {new Date().getFullYear()} AI 面試模擬器
      </div>
    </footer>
  );
}
