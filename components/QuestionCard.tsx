import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

type Answer = {
    id: string;
    text: string;
    isCorrect: boolean;
};

type Props = {
    question: string;
    answers: Answer[];
    onSelect: (answer: Answer) => void;
};

export default function QuestionCard({
    question,
    answers,
    onSelect,
}: Props) {
    return (
        <View className="mx-4 p-5 border border-black/15">
            <Text className="text-xl font-bold text-slate-900 mb-6">
                {question}
            </Text>

            {answers.map((answer) => (
                <TouchableOpacity
                    key={answer.id}
                    onPress={() => onSelect(answer)}
                    className="bg-slate-100 p-4 border border-black/5 mb-3"
                >
                    <Text className="text-center text-slate-800">
                        {answer.text}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}