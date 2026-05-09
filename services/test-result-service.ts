import type { Quiz, Question, Answer } from '@/types/api.types';
import type {
  TestResult,
  QuestionResult,
  QuizSummary,
} from '@/types/test-result.types';

const DEFAULT_PASSING_SCORE = 70;

/**
 * Creates a test result based on the quiz and user answers.
 *
 * @param quiz - The quiz that the user has taken
 * @param userAnswers - Map: questionId → answerId (null if skipped)
 * @param startedAt - When the test was started
 * @param questionTimings - Map: questionId → secondsSpent (optional)
 * @param passingScore - Passing score percentage (default 70)
 */
export function createTestResult(
  quiz: Quiz,
  userAnswers: Map<string, string | null>,
  startedAt: Date,
  questionTimings?: Map<string, number>,
  passingScore: number = DEFAULT_PASSING_SCORE
): TestResult {
  const completedAt = new Date();

  const questionResults: QuestionResult[] = quiz.questions.map((question) => {
    const selectedAnswerId = userAnswers.get(question.id) ?? null;
    const selectedAnswer =
      selectedAnswerId === null
        ? null
        : question.answers.find((a) => a.id === selectedAnswerId) ?? null;

    return {
      question,
      selectedAnswer,
      isCorrect: selectedAnswer?.isCorrect === true,
      timeSpent: questionTimings?.get(question.id) ?? 0,
    };
  });

  const correctAnswers = questionResults.filter((r) => r.isCorrect).length;
  const skippedAnswers = questionResults.filter(
    (r) => r.selectedAnswer === null
  ).length;
  const wrongAnswers =
    questionResults.length - correctAnswers - skippedAnswers;

  const score = Math.round((correctAnswers / questionResults.length) * 100);

  const totalTimeSpent = Math.round(
    (completedAt.getTime() - startedAt.getTime()) / 1000
  );

  const quizSummary: QuizSummary = {
    id: quiz.id,
    title: quiz.title,
    category: quiz.category,
    difficulty: quiz.difficulty,
  };

  return {
    id: generateResultId(),
    quiz: quizSummary,
    questionResults,
    totalQuestions: questionResults.length,
    correctAnswers,
    wrongAnswers,
    skippedAnswers,
    score,
    passed: score >= passingScore,
    passingScore,
    startedAt,
    completedAt,
    totalTimeSpent,
  };
}

/**
 * Simple ID generator for results
 */
function generateResultId(): string {
  return `result_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Formats duration as "5m 23s" or "45s"
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (secs === 0) return `${mins}m`;
  return `${mins}m ${secs}s`;
}

/**
 * Converts difficulty level into a readable label
 */
export function getDifficultyLabel(difficulty: string): string {
  const map: Record<string, string> = {
    EASY: 'Easy',
    MEDIUM: 'Medium',
    HARD: 'Hard',
  };
  return map[difficulty] ?? difficulty;
}

/**
 * Returns a motivational message based on the result
 */
export function getResultMessage(score: number, passed: boolean): {
  title: string;
  subtitle: string;
} {
  if (score === 100) {
    return {
      title: 'Flawless!',
      subtitle: 'Not a single mistake. You know this topic inside out.',
    };
  }
  if (score >= 90) {
    return {
      title: 'Excellent result',
      subtitle: 'Near-perfect mastery of the topic.',
    };
  }
  if (score >= 80) {
    return {
      title: 'Very good',
      subtitle: 'A confident grasp of most topics.',
    };
  }
  if (passed) {
    return {
      title: 'Well done',
      subtitle: 'You passed the test, but there is room to improve.',
    };
  }
  if (score >= 50) {
    return {
      title: 'Almost there',
      subtitle: 'You came close. Give it another shot.',
    };
  }
  return {
    title: 'Don\'t give up',
    subtitle: 'Review the material and try again.',
  };
}
