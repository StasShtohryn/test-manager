import type { Question, Answer, Difficulty, Quiz } from './api.types';

/**
 * Result of a single answered question
 */
export interface QuestionResult {
  question: Question;
  /** Answer selected by the user. null - question was skipped */
  selectedAnswer: Answer | null;
  /** Whether the answer is correct */
  isCorrect: boolean;
  /** Time spent on this question in seconds */
  timeSpent: number;
}

/**
 * Short quiz info stored together with the result
 */
export interface QuizSummary {
  id: string;
  title: string;
  difficulty: Difficulty;
  category: string;
}

/**
 * Full result of a completed quiz
 */
export interface TestResult {
  /** Unique identifier of the result */
  id: string;
  /** Quiz info */
  quiz: Quiz;
  /** Per-question results */
  questionResults: QuestionResult[];

  // ─── Counts ───
  /** Total number of questions */
  totalQuestions: number;
  /** Number of correct answers */
  correctAnswers: number;
  /** Number of wrong answers */
  wrongAnswers: number;
  /** Number of skipped questions */
  skippedAnswers: number;
  /** Score in percent (0-100) */
  score: number;
  /** Whether the test was passed (score >= passingScore) */
  passed: boolean;
  /** Passing score in percent (default 70) */
  passingScore: number;

  // ─── Time ───
  /** When the test started */
  startedAt: Date;
  /** When the test completed */
  completedAt: Date;
  /** Total time spent in seconds */
  totalTimeSpent: number;
}
