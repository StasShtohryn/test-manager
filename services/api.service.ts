
import axios from 'axios';
import {
  QuizPreview,
  Quiz,
  StandaloneQuestion,
  Category,
  QuizzesQueryParams,
  QuestionsQueryParams,
} from '../types/api.types';



const api = axios.create({
  baseURL: 'https://quizapi.io/api/v1',
  headers: {
    'Authorization': `Bearer ${process.env.EXPO_PUBLIC_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

// Quizzes

/**
 * Get list of quizzes
 */
export async function fetchQuizzes(
  params: QuizzesQueryParams = {}
): Promise<QuizPreview[]> {
  console.log(params.limit);
  
  params.limit = params.limit ?? 50;
  const { data } = await api.get('/quizzes', { params });
  return data.data;
}

/**
 * Get single quiz with questions
 */
export async function fetchQuizById(id: string): Promise<Quiz> {
  const { data } = await api.get(`/quizzes/${id}`);
  return data.data;
}




// Questions


/**
 * Get questions with filters
 */
export async function fetchQuestions(
  params: QuestionsQueryParams = {}
): Promise<StandaloneQuestion[]> {
  params.limit = params.limit ?? 50;
  const { data } = await api.get('/questions', { params });
  return data.data;
}

// ============================================
// Categories
// ============================================

/**
 * Get all categories
 */
export async function fetchCategories(): Promise<Category[]> {
  const { data } = await api.get('/categories');
  return data.data;
}
