import Link from "next/link";
import {
  ArrowRight,
  Award,
  ClipboardList,
  FileText,
  Gauge,
  MessageCircle,
  PenLine,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import InterviewPreviewCard from "./components/InterviewPreviewCard";

const features = [
  {
    icon: FileText,
    title: "依職缺內容自動出題",
    description:
      "貼上任何一份職缺描述,AI 面試官會根據職務內容與需求,量身設計專屬的面試問題。",
  },
  {
    icon: MessageCircle,
    title: "逐題提供示範回答",
    description:
      "每回答完一題,立即取得更好的示範回答方式,了解該涵蓋哪些重點與表達架構。",
  },
  {
    icon: SlidersHorizontal,
    title: "題數彈性設定",
    description: "依練習需求自訂 1 到 10 題,快速複習或完整模擬都可以。",
  },
  {
    icon: Gauge,
    title: "AI 即時評分與建議",
    description:
      "完成所有題目後,獲得整體表現評分,以及具體、可執行的改善建議。",
  },
];

const steps = [
  {
    icon: ClipboardList,
    title: "貼上職缺描述",
    description: "複製任何一份職缺的工作內容與需求,貼到輸入框中,並設定想練習的題數。",
  },
  {
    icon: PenLine,
    title: "逐題作答",
    description: "AI 面試官會依內容提出問題,寫下你的回答後送出,即可看到示範回答與下一題。",
  },
  {
    icon: Award,
    title: "取得整體總評",
    description: "完成最後一題後,立即獲得整體評分與改善建議,知道下一步該加強什麼。",
  },
];

const faqs = [
  {
    question: "我的面試紀錄會被儲存嗎?",
    answer:
      "不會。所有問答紀錄只保留在你目前的瀏覽器分頁中,重新整理或關閉頁面後就會清除,不會留存在伺服器上。",
  },
  {
    question: "可以練習任何職缺類型嗎?",
    answer:
      "可以。只要貼上職缺描述,AI 就會依內容出題,不論是工程、行銷、業務或其他職位都適用。",
  },
  {
    question: "這個服務要收費嗎?",
    answer: "目前完全免費,直接開始使用即可,不需要註冊帳號。",
  },
];

export default function Home() {
  return (
    <>
      <Header />

      <main className="flex flex-1 flex-col">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[48rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-400/30 via-violet-400/20 to-transparent blur-3xl dark:from-indigo-500/20 dark:via-violet-500/10"
          />

          <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 md:grid-cols-2 md:items-center md:py-28">
            <div className="flex flex-col items-start gap-6">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-400">
                <Sparkles className="h-3.5 w-3.5" />
                由 AI 驅動 · 免費使用
              </span>

              <h1 className="text-4xl font-semibold leading-tight tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
                讓 AI 陪你,
                <br />
                練習下一場面試
              </h1>

              <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
                貼上職缺描述,AI 面試官就會依內容出題。逐題作答後立即取得示範回答與整體評分,讓你上場前更有把握。
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/interview"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  免費開始模擬面試
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-800"
                >
                  查看功能特色
                </a>
              </div>
            </div>

            <div className="flex justify-center md:justify-end">
              <InterviewPreviewCard />
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                功能特色
              </h2>
              <p className="mt-3 text-zinc-600 dark:text-zinc-400">
                專為求職者打造的面試練習工具,從出題到回饋都由 AI 協助完成。
              </p>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                    <feature.icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-medium text-zinc-900 dark:text-zinc-50">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="border-t border-zinc-200 dark:border-zinc-800">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                使用流程
              </h2>
              <p className="mt-3 text-zinc-600 dark:text-zinc-400">
                三個步驟,幾分鐘內就能開始一場模擬面試。
              </p>
            </div>

            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {steps.map((step, i) => (
                <div key={step.title} className="relative flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white dark:bg-white dark:text-zinc-900">
                      {i + 1}
                    </span>
                    <step.icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="font-medium text-zinc-900 dark:text-zinc-50">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
            <h2 className="text-center text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              常見問題
            </h2>

            <div className="mt-12 flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
              {faqs.map((faq) => (
                <div key={faq.question} className="py-6">
                  <h3 className="font-medium text-zinc-900 dark:text-zinc-50">
                    {faq.question}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t border-zinc-200 dark:border-zinc-800">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 to-indigo-950 px-8 py-16 text-center shadow-xl">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-indigo-500/30 blur-3xl"
              />
              <h2 className="text-3xl font-semibold tracking-tight text-white">
                準備好開始練習了嗎?
              </h2>
              <p className="mx-auto mt-3 max-w-md text-zinc-300">
                不需要註冊,現在就貼上職缺描述,開始你的第一場模擬面試。
              </p>
              <Link
                href="/interview"
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-zinc-900 shadow-sm transition-colors hover:bg-zinc-200"
              >
                免費開始模擬面試
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
