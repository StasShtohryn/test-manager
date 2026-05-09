import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { StandaloneQuestion } from '@/types/api.types';

interface QuestionsPreviewProps {
    questions: StandaloneQuestion[];
}

export const QuestionsPreview = ({ questions }: QuestionsPreviewProps) => {
    return (
        <View className="mt-6">
            <Text className="text-2xl font-bold text-slate-900 mb-4">
                Questions
            </Text>

            {questions.map((question, index) => (
                <View
                    key={question.id || index.toString()}
                    className="mb-4 p-4 bg-slate-50 rounded-2xl border border-slate-300"
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

                            {/* Теги: складність та категорія */}
                            <View className="flex-row mt-3 gap-2">
                                <View className="bg-slate-200 px-2 py-1 rounded-md">
                                    <Text className="text-[10px] text-slate-600 font-bold uppercase">
                                        {question.difficulty}
                                    </Text>
                                </View>
                                {question.category && (
                                    <View className="bg-blue-100 px-2 py-1 rounded-md">
                                        <Text className="text-[10px] text-blue-600 font-bold uppercase">
                                            {question.category}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>
                </View>
            ))}
        </View>
    );
};