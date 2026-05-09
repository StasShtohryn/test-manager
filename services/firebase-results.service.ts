import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db, auth } from '@/services/FireBaseConfig';
import type { TestResult } from '@/types/test-result.types';

/**
 * Save a completed test result for the current user
 */
export async function saveTestResult(result: TestResult): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error('User is not authenticated');

  const docRef = doc(db, 'users', user.uid, 'completedTests', result.id);

  // Convert Date objects to Firestore Timestamps for proper sorting
  await setDoc(docRef, {
    ...result,
    startedAt: Timestamp.fromDate(result.startedAt),
    completedAt: Timestamp.fromDate(result.completedAt),
  });
}

/**
 * Get all completed test results for the current user (newest first)
 */
export async function getCompletedTests(): Promise<TestResult[]> {
  const user = auth.currentUser;
  if (!user) throw new Error('User is not authenticated');

  const collectionRef = collection(db, 'users', user.uid, 'completedTests');
  const q = query(collectionRef, orderBy('completedAt', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    // Convert Firestore Timestamps back to Date
    return {
      ...data,
      startedAt: data.startedAt.toDate(),
      completedAt: data.completedAt.toDate(),
    } as TestResult;
  });
}

/**
 * Get a single test result by id
 */
export async function getTestResult(resultId: string): Promise<TestResult | null> {
  const user = auth.currentUser;
  if (!user) throw new Error('User is not authenticated');

  const docRef = doc(db, 'users', user.uid, 'completedTests', resultId);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) return null;

  const data = snapshot.data();
  return {
    ...data,
    startedAt: data.startedAt.toDate(),
    completedAt: data.completedAt.toDate(),
  } as TestResult;
}

/**
 * Delete a test result
 */
export async function deleteTestResult(resultId: string): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error('User is not authenticated');

  const docRef = doc(db, 'users', user.uid, 'completedTests', resultId);
  await deleteDoc(docRef);
}