export type QAPair = {
  question: string;
  answer: string;
  suggestedAnswer?: string;
};

export type InterviewRequest = {
  jobDescription: string;
  totalQuestions: number;
  history: QAPair[];
  currentQuestion?: string;
  answer?: string;
};

export type Evaluation = {
  score: number;
  strengths: string;
  suggestions: string;
};

export type InterviewResponse =
  | { done: false; history: QAPair[]; question: string; questionNumber: number; totalQuestions: number }
  | { done: true; history: QAPair[]; evaluation: Evaluation };

export const DEFAULT_TOTAL_QUESTIONS = 3;
export const MIN_TOTAL_QUESTIONS = 1;
export const MAX_TOTAL_QUESTIONS = 10;
