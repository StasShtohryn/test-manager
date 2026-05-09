import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore';
import { db, auth } from '@/services/FireBaseConfig';
import type { QuizPreview } from '@/types/api.types';

/**
 * Add a quiz to favorites
 */
export async function addToFavorites(quiz: QuizPreview): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error('User is not authenticated');

  const docRef = doc(db, 'users', user.uid, 'favorites', quiz.id);
  await setDoc(docRef, {
    ...quiz,
    favoritedAt: Timestamp.now(),
  });
}

/**
 * Remove a quiz from favorites
 */
export async function removeFromFavorites(quizId: string): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error('User is not authenticated');

  const docRef = doc(db, 'users', user.uid, 'favorites', quizId);
  await deleteDoc(docRef);
}

/**
 * Check if a quiz is in favorites
 */
export async function isFavorite(quizId: string): Promise<boolean> {
  const user = auth.currentUser;
  if (!user) return false;

  const docRef = doc(db, 'users', user.uid, 'favorites', quizId);
  const snapshot = await getDoc(docRef);
  return snapshot.exists();
}

/**
 * Get all favorite quizzes for the current user
 */
export async function getFavorites(): Promise<QuizPreview[]> {
  const user = auth.currentUser;
  if (!user) throw new Error('User is not authenticated');

  const collectionRef = collection(db, 'users', user.uid, 'favorites');
  const snapshot = await getDocs(collectionRef);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    // Remove favoritedAt - it's not part of QuizPreview
    const { favoritedAt, ...quiz } = data;
    return quiz as QuizPreview;
  });
}

/**
 * Toggle favorite (convenient helper)
 */
export async function toggleFavorite(quiz: QuizPreview): Promise<boolean> {
  const isFav = await isFavorite(quiz.id);
  if (isFav) {
    await removeFromFavorites(quiz.id);
    return false;
  } else {
    await addToFavorites(quiz);
    return true;
  }
}