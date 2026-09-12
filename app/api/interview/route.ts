import OpenAI from "openai";
import { NextResponse } from "next/server";
import {
  DEFAULT_TOTAL_QUESTIONS,
  Evaluation,
  InterviewRequest,
  InterviewResponse,
  MAX_TOTAL_QUESTIONS,
  MIN_TOTAL_QUESTIONS,
  QAPair,
} from "@/lib/interview";

// 建立一個共用的 OpenAI client。金鑰從 .env.local 的 OPEN_AI_API_KEY 讀取，
// Next.js 會在伺服器啟動時自動載入 .env.local，所以這裡可以直接用 process.env 取得。
const client = new OpenAI({ apiKey: process.env.OPEN_AI_API_KEY });

// 使用的模型名稱。可以用 .env.local 的 OPENAI_MODEL 覆寫，
// 若沒有設定就 fallback 到 "gpt-4o-mini"（便宜且速度快，適合這種輪流問答的場景）。
const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

/**
 * 把「職缺描述」＋「目前為止的問答紀錄」組成 OpenAI Chat Completions API
 * 需要的 messages 陣列。
 *
 * 這裡的技巧是：把每一組 (question, answer) 拆成兩則訊息，
 * - 面試官問的問題 → role: "assistant"（因為在對話中，AI 扮演的是「面試官」角色）
 * - 應徵者的回答 → role: "user"
 * 這樣 OpenAI 在產生「下一題」或「評分」時，才能看到完整的對話上下文，
 * 而不是每次都是斷片式、沒有記憶的單次問答。
 */
function buildHistoryMessages(
  jobDescription: string,
  history: QAPair[]
): OpenAI.Chat.ChatCompletionMessageParam[] {
  return [
    // system 訊息只會出現一次，用來設定 AI 的角色與這次面試針對的職缺內容。
    {
      role: "system",
      content: `你是一位專業的面試官,正在針對以下職缺對應徵者進行模擬面試:\n\n${jobDescription}`,
    },
    // 把每一組已完成的 Q&A 攤平（flatMap）成 [assistant訊息, user訊息] 的交錯序列。
    ...history.flatMap((pair): OpenAI.Chat.ChatCompletionMessageParam[] => [
      { role: "assistant", content: pair.question },
      { role: "user", content: pair.answer },
    ]),
  ];
}

/**
 * 檢查並修正前端傳來的「面試題數」。
 * 因為 request body 是使用者可控的，不能完全信任前端傳來的數字，
 * 所以這裡會：
 * 1. 轉成數字，如果不是合法整數就用預設值 DEFAULT_TOTAL_QUESTIONS。
 * 2. 用 Math.min / Math.max 把數字夾在 [MIN_TOTAL_QUESTIONS, MAX_TOTAL_QUESTIONS] 之間，
 *    避免使用者傳 0 題、負數，或是 9999 題導致打爆 OpenAI API 額度。
 */
function normalizeTotalQuestions(value: unknown): number {
  const n = Number(value);
  if (!Number.isInteger(n)) return DEFAULT_TOTAL_QUESTIONS;
  return Math.min(MAX_TOTAL_QUESTIONS, Math.max(MIN_TOTAL_QUESTIONS, n));
}

/**
 * 產生「面試的第一個問題」。
 * 這是整個面試流程的起點：此時還沒有任何問答紀錄（history 是空陣列），
 * 純粹根據職缺描述請 AI 出一題。
 * 這裡不需要 JSON 格式，因為只要「一段純文字問題」，用一般文字回覆即可。
 */
async function generateFirstQuestion(jobDescription: string): Promise<string> {
  const completion = await client.chat.completions.create({
    model: MODEL,
    messages: [
      // history 傳空陣列，代表只帶 system prompt，沒有先前的問答。
      ...buildHistoryMessages(jobDescription, []),
      {
        role: "user",
        content:
          "請提出模擬面試的第一個問題。問題需具體且與職缺相關。請用繁體中文,只回覆問題本身,不要加上「問題：」等前綴或其他說明。",
      },
    ],
  });

  // completion.choices[0]?.message?.content 有可能是 undefined/null（例如 API 回應格式異常），
  // 所以用 ?. 安全存取，並在拿不到內容時提供一個保底的預設問題，確保 API 永遠不會回傳空問題。
  return (
    completion.choices[0]?.message?.content?.trim() ??
    "請簡單自我介紹,並說明你為什麼適合這個職缺。"
  );
}

/**
 * 「應徵者剛回答完一題，但這不是最後一題」時呼叫。
 * 這個函式一次向 OpenAI 要兩樣東西，藉此把 API 呼叫次數壓在一次：
 * 1. suggestedAnswer：針對「剛剛那一題」的更好示範回答（給使用者參考、學習用）。
 * 2. nextQuestion：根據職缺 + 目前為止所有問答，出下一題（避免問重複的題目）。
 *
 * 用 response_format: { type: "json_object" } 強制 OpenAI 回傳合法 JSON 字串，
 * 這樣後端才能穩定地用 JSON.parse 解析，不用自己寫正則表達式去抽取欄位。
 */
async function generateFeedbackAndNextQuestion(
  jobDescription: string,
  history: QAPair[]
): Promise<{ suggestedAnswer: string; nextQuestion: string }> {
  const completion = await client.chat.completions.create({
    model: MODEL,
    response_format: { type: "json_object" },
    messages: [
      // 這裡傳入的 history 已經包含「剛剛回答的那一題」（在呼叫端組好才傳進來），
      // 所以 AI 看到的最後一則訊息就是應徵者最新的回答。
      ...buildHistoryMessages(jobDescription, history),
      {
        role: "user",
        content:
          '應徵者剛回答了上一個問題。請完成以下兩件事,並以 JSON 格式回覆,使用繁體中文:\n' +
          '1. suggestedAnswer：針對上一個問題,提供一個更好、更完整的示範回答方式(可說明應涵蓋的重點與表達架構),幫助應徵者了解如何回答得更好。\n' +
          '2. nextQuestion：根據職缺內容與先前的問答,提出下一個面試問題,問題需具體且與職缺相關,避免重複先前問過的問題,每次只問一題,且不要加上「問題：」等前綴。\n' +
          '回覆格式：{"suggestedAnswer": string, "nextQuestion": string}',
      },
    ],
  });

  // OpenAI 回傳的 content 理論上會是一個 JSON 字串，例如 '{"suggestedAnswer": "...", "nextQuestion": "..."}'
  // 若 content 是空的，就給一個空物件字串 "{}" 當保底，避免 JSON.parse 直接丟出例外。
  const raw = completion.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(raw);

  // 因為 parsed 的型別是 any，這裡逐一檢查欄位型別是否正確（typeof === "string"），
  // 避免 AI 沒有按照格式回覆時，把奇怪的型別（undefined、數字等）直接傳到前端。
  return {
    suggestedAnswer: typeof parsed.suggestedAnswer === "string" ? parsed.suggestedAnswer : "",
    nextQuestion:
      typeof parsed.nextQuestion === "string"
        ? parsed.nextQuestion
        : "請分享一個你最有成就感的專案經驗。",
  };
}

/**
 * 「應徵者剛回答完最後一題」時呼叫。
 * 邏輯跟 generateFeedbackAndNextQuestion 幾乎一樣，只是這次不用再出下一題，
 * 而是要根據「完整的問答紀錄」給出總結性的評分與建議：
 * - score：0～10 分的整體評分
 * - strengths：整體表現的優點
 * - suggestions：具體的改善建議
 * 同時也會一併附上最後一題的 suggestedAnswer，維持體驗一致（每一題都有示範回答）。
 */
async function generateFeedbackAndEvaluation(
  jobDescription: string,
  history: QAPair[]
): Promise<{ suggestedAnswer: string; evaluation: Evaluation }> {
  const completion = await client.chat.completions.create({
    model: MODEL,
    response_format: { type: "json_object" },
    messages: [
      ...buildHistoryMessages(jobDescription, history),
      {
        role: "user",
        content:
          '模擬面試已結束。請完成以下工作,並以 JSON 格式回覆,使用繁體中文:\n' +
          '1. suggestedAnswer：針對最後一個問題,提供一個更好、更完整的示範回答方式。\n' +
          '2. score：0 到 10 之間的整數,根據應徵者全部回答給予整體評分。\n' +
          '3. strengths：應徵者整體表現的優點。\n' +
          '4. suggestions：具體的改善建議。\n' +
          '回覆格式：{"suggestedAnswer": string, "score": number, "strengths": string, "suggestions": string}',
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(raw);

  return {
    suggestedAnswer: typeof parsed.suggestedAnswer === "string" ? parsed.suggestedAnswer : "",
    evaluation: {
      // score 預期是 number，若 AI 沒有照格式回覆（例如回傳字串 "8"），就退回 0 分，
      // 避免把非數字型別的值送到前端造成畫面顯示錯誤。
      score: typeof parsed.score === "number" ? parsed.score : 0,
      strengths: typeof parsed.strengths === "string" ? parsed.strengths : "",
      suggestions: typeof parsed.suggestions === "string" ? parsed.suggestions : "",
    },
  };
}

/**
 * 整個 /api/interview 端點的入口。
 * 這支 API 是「無狀態（stateless）」設計：伺服器不會把任何面試紀錄存在資料庫或記憶體裡，
 * 每一次請求都必須由前端把「目前為止的完整問答歷史」一起帶過來，
 * 伺服器只負責根據這次請求的內容，決定「該回下一題」還是「該給總評」，算完就回傳，不留狀態。
 *
 * 前端與這支 API 的互動流程（詳見 app/page.tsx）：
 * 1. 使用者輸入職缺描述、選擇題數 → 呼叫一次 API，不帶 currentQuestion/answer → 拿到第 1 題。
 * 2. 使用者回答問題 → 呼叫 API，帶上 currentQuestion（剛剛的題目）與 answer（使用者的回答）
 *    以及目前的 history（之前已完成的所有 Q&A）→ 拿到「建議回答 + 下一題」或「建議回答 + 總評」。
 * 3. 重複步驟 2，直到 history 的長度達到 totalQuestions，這時 API 會回傳 done: true 與 evaluation。
 */
export async function POST(request: Request) {
  // 防呆：如果 .env.local 沒有設定 OPEN_AI_API_KEY，直接回傳 500，
  // 避免後面呼叫 OpenAI API 時才因為金鑰是 undefined 而丟出比較難懂的錯誤訊息。
  if (!process.env.OPEN_AI_API_KEY) {
    return NextResponse.json(
      { error: "伺服器未設定 OPEN_AI_API_KEY" },
      { status: 500 }
    );
  }

  // 解析 request body 的 JSON。如果前端傳來的不是合法 JSON（例如空 body），
  // request.json() 會 throw，這裡用 try/catch 接住並回傳 400（Bad Request）。
  let body: InterviewRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "請求格式錯誤" }, { status: 400 });
  }

  // 從 body 解構出各欄位。
  // - jobDescription：使用者輸入的職缺描述（面試的主題）
  // - history：目前為止「已經完成」的問答紀錄（不包含這次剛回答、還沒處理的那一題）
  // - currentQuestion：這次要回答的問題內容（第一次呼叫時不會有這個欄位）
  // - answer：使用者對 currentQuestion 的回答（第一次呼叫時不會有這個欄位）
  const { jobDescription, history, currentQuestion, answer } = body;
  // totalQuestions 交給 normalizeTotalQuestions 做邊界檢查與預設值處理。
  const totalQuestions = normalizeTotalQuestions(body.totalQuestions);

  // 職缺描述是整個面試的基礎，沒有它就無法出題，所以視為必填欄位。
  if (!jobDescription || !jobDescription.trim()) {
    return NextResponse.json({ error: "缺少職缺描述" }, { status: 400 });
  }

  try {
    // === 情境 A：這是面試的第一次呼叫（還沒有任何題目被回答過）===
    // 判斷依據：只要 currentQuestion 或 answer 缺其中一個，就代表前端還沒有「已回答的題目」要送過來，
    // 也就是「使用者剛輸入完職缺描述，準備開始面試」的第一次請求。
    if (!currentQuestion || !answer) {
      const question = await generateFirstQuestion(jobDescription);
      const response: InterviewResponse = {
        done: false,
        history: [], // 還沒有任何完成的問答
        question,
        questionNumber: 1,
        totalQuestions,
      };
      return NextResponse.json(response);
    }

    // === 情境 B：使用者剛回答完一題 ===
    // priorHistory 是「這次回答之前」已經完成的題目數。
    const priorHistory = history ?? [];
    // 判斷這次回答的題目，是不是使用者設定的最後一題：
    // priorHistory.length 是已完成的題數，+1 代表「加上這次剛回答的這一題」之後的總題數，
    // 如果達到或超過 totalQuestions，代表面試該結束了。
    const isFinalQuestion = priorHistory.length + 1 >= totalQuestions;

    if (isFinalQuestion) {
      // 面試結束：請 AI 產生「最後一題的建議回答」+「整體評分與建議」。
      const { suggestedAnswer, evaluation } = await generateFeedbackAndEvaluation(
        jobDescription,
        // 把這次剛回答的題目也併入 history，讓 AI 能看到完整的最後一題內容再評分。
        [...priorHistory, { question: currentQuestion, answer }]
      );
      // 組出最終要回傳給前端的完整問答紀錄（含這次剛完成的這一題與它的建議回答）。
      const newHistory: QAPair[] = [
        ...priorHistory,
        { question: currentQuestion, answer, suggestedAnswer },
      ];
      const response: InterviewResponse = {
        done: true,
        history: newHistory,
        evaluation,
      };
      return NextResponse.json(response);
    }

    // 面試尚未結束：請 AI 產生「這一題的建議回答」+「下一題的題目」。
    const { suggestedAnswer, nextQuestion } = await generateFeedbackAndNextQuestion(
      jobDescription,
      [...priorHistory, { question: currentQuestion, answer }]
    );
    const newHistory: QAPair[] = [
      ...priorHistory,
      { question: currentQuestion, answer, suggestedAnswer },
    ];
    const response: InterviewResponse = {
      done: false,
      history: newHistory,
      question: nextQuestion,
      // 下一題的題號 = 目前已完成的題數 + 1
      questionNumber: newHistory.length + 1,
      totalQuestions,
    };
    return NextResponse.json(response);
  } catch (error) {
    // 統一攔截「呼叫 OpenAI API 過程中」可能發生的錯誤（例如金鑰無效、額度用完、網路逾時、
    // 或是 JSON.parse 解析失敗等），記錄到伺服器 log 方便除錯，並回傳 502（Bad Gateway，
    // 意指「我們的伺服器」呼叫「上游服務（OpenAI）」時失敗了），避免把內部錯誤細節暴露給前端。
    console.error("Interview API error:", error);
    return NextResponse.json(
      { error: "呼叫 OpenAI API 時發生錯誤" },
      { status: 502 }
    );
  }
}
