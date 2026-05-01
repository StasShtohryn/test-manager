/**
 * Types for OpenTDB API
 * https://opentdb.com/api_config.php
 */

export type QuestionDifficulty = 'easy' | 'medium' | 'hard';
export type QuestionType = 'multiple' | 'boolean';

/**
 * Single question from OpenTDB API
 */
export interface OpenTDBQuestion {
  type: QuestionType;
  difficulty: QuestionDifficulty;
  category: Category;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

/**
 * Full API response
 */
export interface OpenTDBResponse {
  response_code: number;
  results: OpenTDBQuestion[];
}

/**
 * Query parameters for API
 */
export interface OpenTDBQueryParams {
  amount?: number;
  category?: Category;
  difficulty?: QuestionDifficulty;
  type?: QuestionType;
}

export interface Category {
  id: number;
  name: string;
}

export interface CategoriesResponse {
  trivia_categories: Category[];
}
