// BYOK（Bring Your Own Key）：使用者自己的 OpenAI API Key 只存在瀏覽器的
// localStorage，呼叫 /api/interview 時透過自訂 header 帶給後端，
// 伺服器不會把它記錄下來或存進任何資料庫。

const STORAGE_KEY = "ai-interview:openai-api-key";

// 前端呼叫 API 時，用這個 header 名稱把 API Key 帶給後端。
export const API_KEY_HEADER = "x-openai-api-key";

export function getStoredApiKey(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    // 無痕模式或瀏覽器封鎖 localStorage 時，安全地當作沒有設定金鑰。
    return "";
  }
}

export function setStoredApiKey(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, key);
  } catch {
    // ignore
  }
}

export function clearStoredApiKey(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
