/**
 * App models for Test Manager
 */

import { QuestionDifficulty, QuestionType } from '../../services/api.types';

/**
 * Single answer option
 */
export interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
}

/**
 * Question in our app
 */
export interface Question {
  id: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  category: string;
  questionText: string;
  answers: Answer[];
}

/**
 * Test/Quiz
 */
export interface Test {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  createdAt: Date;
  timeLimit?: number; // seconds
}

/**
 * User's answer to a question
 */
export interface UserAnswer {
  questionId: string;
  selectedAnswerId: string;
  isCorrect: boolean;
}

/**
 * Test attempt (one session of taking a test)
 */
export interface TestAttempt {
  id: string;
  testId: string;
  startedAt: Date;
  completedAt?: Date;
  answers: UserAnswer[];
  score: number; // percentage 0-100
  totalQuestions: number;
  correctAnswers: number;
}
