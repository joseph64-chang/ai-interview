import Link from "next/link";
import Logo from "./Logo";

const navItems = [
  { href: "#features", label: "功能特色" },
  { href: "#how-it-works", label: "使用流程" },
  { href: "#faq", label: "常見問題" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/70 backdrop-blur-md dark:border-zinc-800/80 dark:bg-black/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-zinc-600 dark:text-zinc-300 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-50"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <Link
          href="/interview"
          className="inline-flex shrink-0 items-center rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          免費開始使用
        </Link>
      </div>
    </header>
  );
}
