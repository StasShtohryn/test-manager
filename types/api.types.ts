export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type QuestionType = 'MULTIPLE_CHOICE' | 'TRUE_FALSE';

// ============================================
// Quiz
// ============================================

export interface QuizPreview {
  id: string;
  title: string;
  slug: string | null;
  description: string;
  category: string;
  difficulty: Difficulty;
  tags: string[];
  questionCount: number;
  plays: number;
}

export interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  difficulty: Difficulty;
  explanation: string;
  order: number;
  answers: Answer[];
}

export interface Quiz extends QuizPreview {
  questions: Question[];
}

// ============================================
// Standalone Question (from /questions)
// ============================================

export interface StandaloneQuestion {
  id: string;
  text: string;
  type: QuestionType;
  difficulty: Difficulty;
  explanation: string;
  category: string;
  tags: string[];
  quizId: string;
  quizTitle: string;
  answers: Answer[];
}

// ============================================
// Categories
// ============================================

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  quizCount: number;
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  categories: Subcategory[];
}

// ============================================
// Query Params
// ============================================

export interface QuizzesQueryParams {
  category?: string;
  sort?: 'newest' | 'popular';
  limit?: number;
  offset?: number;
}

export interface QuestionsQueryParams {
  category?: string;      // comma-separated: "Programming,DevOps"
  difficulty?: string;     // comma-separated: "EASY,MEDIUM"
  type?: QuestionType;
  tags?: string;           // comma-separated: "javascript,react"
  limit?: number;
  offset?: number;
}