// import { Text } from '@/components/ui/text';
import { Text } from 'react-native'
import { QuizPreview } from '@/types/api.types';
import React, { useState } from 'react';
import { Pressable, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type TestCardProps = {
  test: QuizPreview;
  onPress: (testId: string) => void;
};

export function TestCard({ test, onPress }: TestCardProps) {
  const [isFavorited, setFavorited] = useState<boolean>(false);

  return (
    <Pressable
      onPress={() => onPress(test.id)}
      className="rounded-xl border border-border bg-card p-4">
      <View className='flex-row justify-between'>
        <Text className="text-lg font-semibold">{test.title}</Text>
        <TouchableOpacity activeOpacity={0.7} onPress={() => setFavorited(!isFavorited)}>
          <Ionicons name={isFavorited ? 'heart' : 'heart-outline'} size={26}/>
        </TouchableOpacity>
      </View>
      <Text className="mt-1 text-sm text-muted-foreground">{test.category}</Text>
      <Text className="mt-1 text-sm text-muted-foreground">{test.questionCount} questions</Text>
    </Pressable>
  );
}
