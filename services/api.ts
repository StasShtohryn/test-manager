/**
 * OpenTDB API Service
 */

import { OpenTDBResponse, OpenTDBQueryParams, OpenTDBQuestion } from '../services/api.types';

const BASE_URL = 'https://opentdb.com/api.php';

/**
 * Fetch questions from OpenTDB
 */
export async function fetchQuestions(
  params: OpenTDBQueryParams = {}
): Promise<OpenTDBQuestion[]> {
  const queryParams = new URLSearchParams();

  if (params.amount) queryParams.append('amount', params.amount.toString());
  if (params.category) queryParams.append('category', params.category.toString());
  if (params.difficulty) queryParams.append('difficulty', params.difficulty);
  if (params.type) queryParams.append('type', params.type);

  const url = `${BASE_URL}?${queryParams.toString()}`;

  const response = await fetch(url);
  const data: OpenTDBResponse = await response.json();

  if (data.response_code !== 0) {
    throw new Error(`API error: response_code ${data.response_code}`);
  }

  return data.results;
}
