import { Text } from '@/components/ui/text';
import { QuizPreview } from '@/types/api.types';
import React from 'react';
import { Pressable } from 'react-native';

type TestCardProps = {
  test: QuizPreview;
  onPress: (testId: string) => void;
};

export function TestCard({ test, onPress }: TestCardProps) {
  return (
    <Pressable
      onPress={() => onPress(test.id)}
      className="rounded-xl border border-border bg-card p-4">
      <Text className="text-base font-semibold">{test.title}</Text>
      <Text className="mt-1 text-sm text-muted-foreground">{test.category}</Text>
      <Text className="mt-1 text-sm text-muted-foreground">{test.questionCount} questions</Text>
    </Pressable>
  );
}
