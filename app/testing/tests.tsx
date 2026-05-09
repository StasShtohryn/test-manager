import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { TestCard } from '@/components/TestCard';
import { fetchCategories, fetchQuizzes } from '@/services/api.service';
import { Category, QuizPreview } from '@/types/api.types';
import axios from 'axios';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, View } from 'react-native';

const MIN_QUESTIONS_DEFAULT = '';
const MAX_QUESTIONS_DEFAULT = '';

export default function TestsScreen() {
  const router = useRouter();
  const { category } = useLocalSearchParams<{ category?: string }>();

  const goBackToCategories = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/categories');
    }
  };
  const [tests, setTests] = useState<QuizPreview[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [minQuestions, setMinQuestions] = useState(MIN_QUESTIONS_DEFAULT);
  const [maxQuestions, setMaxQuestions] = useState(MAX_QUESTIONS_DEFAULT);
  const [isLoading, setIsLoading] = useState(true);
  const [errorText, setErrorText] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setErrorText(null);
        const [quizzesData, categoriesData] = await Promise.all([
          fetchQuizzes({ limit: 100 }),
          fetchCategories(),
        ]);
        setTests(quizzesData);
        setCategories(categoriesData);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          setErrorText('Quiz API key is not authorized for tests endpoint (401).');
        } else {
          setErrorText('Failed to load tests. Please try again.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const categoryOptions = useMemo(() => {
    const topLevel = categories.map((category) => category.name);
    const nested = categories.flatMap((category) =>
      category.categories.map((subcategory) => subcategory.name)
    );
    return ['all', ...Array.from(new Set([...topLevel, ...nested]))];
  }, [categories]);

  useEffect(() => {
    if (!category) return;
    const decodedCategory = decodeURIComponent(category);
    if (categoryOptions.includes(decodedCategory)) {
      setSelectedCategory(decodedCategory);
    }
  }, [category, categoryOptions]);

  const filteredTests = useMemo(() => {
    const min = Number(minQuestions);
    const max = Number(maxQuestions);
    const hasMin = minQuestions.trim().length > 0 && !Number.isNaN(min);
    const hasMax = maxQuestions.trim().length > 0 && !Number.isNaN(max);

    const selectedCategoryGroup = categories.find(
      (categoryItem) => categoryItem.name.toLowerCase() === selectedCategory.toLowerCase()
    );
    const allowedCategoryNames = selectedCategoryGroup
      ? new Set([
        selectedCategoryGroup.name.toLowerCase(),
        ...selectedCategoryGroup.categories.map((subcategory) => subcategory.name.toLowerCase()),
      ])
      : null;

    return tests.filter((test) => {
      const byCategory =
        selectedCategory === 'all' ||
        (allowedCategoryNames
          ? allowedCategoryNames.has(test.category.toLowerCase())
          : test.category.toLowerCase() === selectedCategory.toLowerCase());
      if (!byCategory) return false;

      if (hasMin && test.questionCount < min) return false;
      if (hasMax && test.questionCount > max) return false;
      return true;
    });
  }, [tests, categories, selectedCategory, minQuestions, maxQuestions]);

  return (
    <View className="flex-1 bg-background p-4">
      <Stack.Screen options={{ headerShown: false }} />


      <View className="mb-4 gap-3">
        <View className="flex-row items-center gap-2">
          <Pressable
            onPress={goBackToCategories}
            accessibilityRole="button"
            accessibilityLabel="Back to categories"
            hitSlop={12}
            className="ml-2 rounded-lg p-2 active:opacity-70">
            <Icon as={ArrowLeft} size={22} />
          </Pressable>
          <Text variant="h3">Tests</Text>
        </View>
        <Text className="text-sm text-muted-foreground">Filter by category and number of questions</Text>

        <View className="flex-row gap-2">
          <Input
            value={minQuestions}
            onChangeText={setMinQuestions}
            keyboardType="numeric"
            placeholder="Min questions"
            className="flex-1"
          />
          <Input
            value={maxQuestions}
            onChangeText={setMaxQuestions}
            keyboardType="numeric"
            placeholder="Max questions"
            className="flex-1"
          />
        </View>

        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categoryOptions}
          keyExtractor={(item) => item}
          contentContainerStyle={{ gap: 8 }}
          renderItem={({ item }) => {
            const isActive = selectedCategory === item;
            return (
              <Pressable
                onPress={() => setSelectedCategory(item)}
                className={`rounded-full border px-3 py-2 ${isActive ? 'border-primary bg-primary/10' : 'border-border bg-card'
                  }`}>
                <Text className={isActive ? 'text-primary font-medium' : 'text-foreground'}>
                  {item === 'all' ? 'All categories' : item}
                </Text>
              </Pressable>
            );
          }}
        />
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center gap-2">
          <ActivityIndicator />
          <Text className="text-muted-foreground">Loading tests...</Text>
        </View>
      ) : errorText ? (
        <View className="flex-1 items-center justify-center gap-3">
          <Text className="text-destructive">{errorText}</Text>
          <Button
            onPress={async () => {
              try {
                setIsLoading(true);
                setErrorText(null);
                const [quizzesData, categoriesData] = await Promise.all([
                  fetchQuizzes({ limit: 100 }),
                  fetchCategories(),
                ]);
                setTests(quizzesData);
                setCategories(categoriesData);
              } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status === 401) {
                  setErrorText('Quiz API key is not authorized for tests endpoint (401).');
                } else {
                  setErrorText('Failed to load tests. Please try again.');
                }
              } finally {
                setIsLoading(false);
              }
            }}>
            <Text>Try again</Text>
          </Button>
        </View>
      ) : (
        <FlatList
          data={filteredTests}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: 10, paddingBottom: 20 }}
          ListEmptyComponent={
            <View className="items-center py-8">
              <Text className="text-muted-foreground">No tests found for selected filters.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <TestCard
              test={item}
              onPress={(testId) =>
                router.push({
                  pathname: '/test-preview/[id]',
                  params: { id: testId },
                })
              }
            />
          )}
        />
      )}
    </View>
  );
}
