import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons';
import { Answer, Quiz } from '@/types/api.types';
import { fetchQuizById } from '@/services/api.service';
import QuestionCard from '@/components/QuestionCard';
import { createTestResult } from '@/services/test-result-service';
import { saveTestResult } from '@/services/firebase-results.service';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function testing() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const { id } = useLocalSearchParams<{ id: string }>();
    const { data: quizString } = useLocalSearchParams<{ data: string }>();
    
    const temporaryQuiz: Quiz | null = quizString ? JSON.parse(quizString) : null;

    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [loading, setLoading] = useState(true);

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [userAnswers, setUserAnswers] = useState(
        new Map<string, string | null>()
    );
    const [questionTimings, setQuestionTimings] = useState(
        new Map<string, number>()
    );

    const [startedAt] = useState(new Date());

    useEffect(() => {
        if (id) {
            fetchQuizById(id).then((data) => {
                setQuiz(data);
                setLoading(false);
            });

            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }
        else setQuiz(temporaryQuiz)
    }, [id]);

    const startTime = Date.now()

    const handleAnswer = async (answer: Answer) => {
        const questionId = quiz!.questions[currentQuestion].id;

        // Створюємо новий Map одразу
        const newAnswers = new Map(userAnswers);
        newAnswers.set(questionId, answer.id);

        const endTime = Date.now();

        const newTimings = new Map(questionTimings);
        newTimings.set(questionId, endTime-startTime);

        // Оновлюємо state (для UI)
        setUserAnswers(newAnswers);
        setQuestionTimings(newTimings);

        if (currentQuestion < quiz!.questions.length - 1) {
            setCurrentQuestion((prev) => prev + 1);
        } else {
            // Використовуємо newAnswers, а НЕ userAnswers
            const result = createTestResult(quiz!, newAnswers, startedAt, newTimings);

            if(id) {
                try {
                    await saveTestResult(result);
                } catch (error) {
                    console.error('Failed to save result:', error);
                }
            }

            router.push({
            pathname: '/testing/results',
            params: { result: JSON.stringify(result) }
            });
        }
    };

    const nextQuestion = () => {
        if (
            quiz &&
            currentQuestion < quiz.questions.length - 1
        ) {
            setCurrentQuestion((prev) => prev + 1);
        }
    };  

    const prevQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion((prev) => prev - 1);
        }
    };

    const question = quiz?.questions[currentQuestion];

    return (
        <>
            <Stack.Screen options={{ headerShown: false}} />
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-slate-100" >
                <TouchableOpacity onPress={() => router.back()} className="p-2">
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text className="text-lg font-bold text-slate-900">{quiz?.title}</Text>
                <View className="w-10" />
            </View>
            
            <Text className='text-center text-md font-bold'>{currentQuestion + 1} / {quiz?.questionCount}</Text>

            <View className="flex-1 justify-center">
                {question && (
                    <QuestionCard
                        question={question.text}
                        answers={question.answers}
                        onSelect={handleAnswer}
                    />
                )}
            </View>

            <View className='flex-row gap-6 justify-center items-center mb-6' style={{paddingBottom: insets.bottom + 20 }}>
                <TouchableOpacity
                    onPress={prevQuestion}
                    disabled={currentQuestion === 0}
                    className={`w-14 h-14 rounded-full justify-center items-center ${
                        currentQuestion === 0
                            ? 'bg-slate-100'
                            : 'bg-slate-200'
                    }`}
                >
                    <Ionicons name='arrow-back' size={28} color='black' />
                </TouchableOpacity>
                
                <TouchableOpacity
                    onPress={nextQuestion}
                    disabled={
                        currentQuestion ===
                        (quiz?.questions.length ?? 0) - 1
                    }
                    className={`w-14 h-14 rounded-full justify-center items-center ${
                        currentQuestion ===
                        (quiz?.questions.length ?? 0) - 1
                            ? 'bg-slate-100'
                            : 'bg-slate-200'
                    }`}
                >
                    <Ionicons name='arrow-forward' size={28} color='black' />
                </TouchableOpacity>
            </View>
        </>
    )
}

const styles = StyleSheet.create({})