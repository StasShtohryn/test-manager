/**
 * Utilities for transforming API data to app models
 */

import { OpenTDBQuestion } from '../../services/api.types';
import { Question, Answer } from '../models';

/**
 * Decode HTML entities (&#039; → ')
 */
export function decodeHTMLEntities(text: string): string {
  const entities: Record<string, string> = {
    '&quot;': '"',
    '&#039;': "'",
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&nbsp;': ' ',
  };

  return text.replace(/&[#\w]+;/g, (match) => entities[match] || match);
}

/**
 * Generate simple unique ID (without external library)
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

/**
 * Shuffle array
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Transform API question to app Question model
 */
export function transformQuestion(apiQuestion: OpenTDBQuestion): Question {
  const correctAnswer: Answer = {
    id: generateId(),
    text: decodeHTMLEntities(apiQuestion.correct_answer),
    isCorrect: true,
  };

  const incorrectAnswers: Answer[] = apiQuestion.incorrect_answers.map((text) => ({
    id: generateId(),
    text: decodeHTMLEntities(text),
    isCorrect: false,
  }));

  // Shuffle answers so correct one is not always first
  const allAnswers = shuffleArray([correctAnswer, ...incorrectAnswers]);

  return {
    id: generateId(),
    type: apiQuestion.type,
    difficulty: apiQuestion.difficulty,
    category: decodeHTMLEntities(apiQuestion.category.name),
    questionText: decodeHTMLEntities(apiQuestion.question),
    answers: allAnswers,
  };
}

/**
 * Transform array of API questions
 */
export function transformQuestions(apiQuestions: OpenTDBQuestion[]): Question[] {
  return apiQuestions.map(transformQuestion);
}

/**
 * Calculate test score (percentage)
 */
export function calculateScore(totalQuestions: number, correctAnswers: number): number {
  if (totalQuestions === 0) return 0;
  return Math.round((correctAnswers / totalQuestions) * 100);
}
