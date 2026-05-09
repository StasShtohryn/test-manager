import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import loaderAnimation from '../../../assets/images/loader.json';

import { Quiz } from '@/types/api.types';
import { api, fetchQuizById } from '@/services/api.service';
import { isFavorite, toggleFavorite } from '@/services/firebase-favorites.service';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';


export default function TestingScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id?: string }>();
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [loading, setLoading] = useState(true);

    // ⭐ Стан улюбленого
    const [favorite, setFavorite] = useState(false);
    const [favoriteLoading, setFavoriteLoading] = useState(false);

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }

        fetchQuizById(id).then((data) => {
                setQuiz(data);
                setLoading(false);
            }).catch(() => setLoading(false));
    }, [id]);

    // ⭐ Перевіряємо чи квіз вже в улюблених
    useEffect(() => {
        if (!id) return;
        isFavorite(id)
            .then(setFavorite)
            .catch((err) => console.error('Failed to check favorite:', err));
    }, [id]);

    // ⭐ Перемикання улюбленого
    const handleToggleFavorite = async () => {
        if (!quiz || favoriteLoading) return;

        setFavoriteLoading(true);

        // Оптимістичне оновлення UI - користувач одразу бачить результат
        setFavorite((prev) => !prev);

        try {
            const newState = await toggleFavorite(quiz);
            setFavorite(newState);
        } catch (error) {
            console.error('Failed to toggle favorite:', error);
            // Відкочуємо UI у разі помилки
            setFavorite((prev) => !prev);
        } finally {
            setFavoriteLoading(false);
        }
    };

    const handleStart = () => {
        if (!id) return;
        router.push({ pathname: '/testing/testing', params: { id } });
    };


    if (loading) {
        return (
            <LottieView
                source={loaderAnimation}
                style={{ width: 20, height: 20 }}
                autoPlay
                loop
            />
        );
    }

    if (!quiz && !loading) {
        return (
            <View className="flex-1 justify-center items-center p-4">
                <Text>Тest wasn't found :( </Text>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text className="text-blue-600 mt-4">Back</Text>
                </TouchableOpacity>
            </View>
        );
    }



    return (
        <>
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-slate-100" >
                <TouchableOpacity onPress={() => router.back()} className="p-2">
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text className="text-lg font-bold text-slate-900">Preview of test </Text>

                {/* ⭐ Кнопка улюбленого замість пустого View */}
                <TouchableOpacity
                    onPress={handleToggleFavorite}
                    disabled={favoriteLoading}
                    className="p-2"
                >
                    <Ionicons
                        name={favorite ? 'heart' : 'heart-outline'}
                        size={26}
                        color={favorite ? '#ef4444' : '#1e293b'}
                    />
                </TouchableOpacity>
            </View >

            <ScrollView className="flex-1 px-6">
                <View className="mt-6 mb-2">
                    <View className="mb-3 py-1 px-3 border border-black/30 rounded-lg">
                        <Text className='text-center text-md font-semibold'>{quiz?.category || 'Category'}</Text>
                    </View>
                    <Text className="text-3xl font-extrabold text-slate-900 leading-tight">
                        {quiz?.title || 'Name of test'}
                    </Text>
                </View>

                <View className="flex-row justify-between bg-slate-50 px-14 py-4 rounded-2xl border border-black/20 mb-8 border border-slate-100">
                    <View className="items-center">
                        <Text className="text-slate-400 text-xs mb-1 uppercase font-bold">Questions</Text>
                        <Text className="text-lg font-bold text-slate-900">{quiz?.questionCount || 0}</Text>
                    </View>
                    <View className="items-center">
                        <Text className="text-slate-400 text-xs mb-1 uppercase font-bold">Level</Text>
                        <Text className='text-lg font-bold text-slate-900'>{quiz?.difficulty || 'EASY'}</Text>
                    </View>
                </View>

                {/* Опис */}
                <View className="mb-8">
                    <Text className="text-xl font-bold text-slate-900 mb-3">About this quizz</Text>
                    <Text className="text-slate-600 text-lg leading-7">
                        {quiz?.description || 'Description'}
                    </Text>
                </View>

                {/* Теги */}
                {quiz?.tags && (
                    <View className="flex-row flex-wrap gap-2 mb-10">
                        {quiz.tags.map((tag) => (
                            <View key={tag} className="bg-slate-100 px-4 py-2 rounded-2xl">
                                <Text className="text-slate-500 font-medium italic">#{tag}</Text>
                            </View>
                        ))}
                    </View>
                )}


                <View>
                    <Text className="text-2xl font-bold text-slate-900 mb-4">
                        Questions
                    </Text>

                    {quiz?.questions.map((question, index) => (
                        <View
                            key={question.id}
                            className="mb-4 p-4 bg-slate-50 rounded-2xl border border-slate-100"
                        >
                            <View className="flex-row items-start gap-3">
                                {/* Номер питання */}
                                <View className="bg-slate-800 w-8 h-8 rounded-xl items-center justify-center shadow-md">
                                    <Text className="text-white font-bold text-sm">
                                        {index + 1}
                                    </Text>
                                </View>

                                {/* Текст питання */}
                                <View className="flex-1">
                                    <Text className="text-slate-800 text-lg font-medium leading-6">
                                        {question.text}
                                    </Text>

                                    {/* Додаткова інфа: складність або тип */}
                                    <View className="flex-row mt-2 gap-2">
                                        <View className={`px-2 py-0.5 rounded-md ${question.difficulty === 'EASY' ? 'bg-green-400' : question.difficulty === 'MEDIUM' ? 'bg-yellow-700' : 'bg-red-500'}`}>
                                            <Text className={`text-[10px] font-bold uppercase ${question.difficulty ==='MEDIUM' ? 'text-white' : 'text-slate-200'}`}>
                                                {question.difficulty}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    ))}

                </View>
            </ScrollView >


            <Button variant={'default'} onPress={handleStart} className='mb-2 mx-2'>
                <Text className='uppercase'>Start</Text>
            </Button>
        </>
    );
}