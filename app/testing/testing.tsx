import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons';
import { Answer, Quiz } from '@/types/api.types';
import { fetchQuizById } from '@/services/api.service';
import QuestionCard from '@/components/QuestionCard';

export default function testing() {
    const router = useRouter();
    
    const { id } = useLocalSearchParams<{ id: string }>();
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [loading, setLoading] = useState(true);

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);

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
    }, [id]);

    const handleAnswer = (answer: Answer) => {
        if (answer.isCorrect) {
            setCorrectAnswers((prev) => prev + 1);
        }

        if (
            quiz &&
            currentQuestion < quiz.questions.length - 1
        ) {
            setCurrentQuestion((prev) => prev + 1);
        } else {
            console.log('Результат:', correctAnswers);
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

            <View className='flex-row gap-6 justify-center items-center mb-6'>
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