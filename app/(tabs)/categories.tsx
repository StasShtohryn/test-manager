import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { fetchCategories } from '@/services/api.service';
import { Category } from '@/types/api.types';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, useWindowDimensions, View } from 'react-native';

type CategoryCardItem = {
  id: string;
  name: string;
  testsCount: number;
};

const INITIAL_VISIBLE_COUNT = 9;

export default function CategoriesScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const numColumns = width >= 900 ? 3 : 2;

  const [categories, setCategories] = useState<CategoryCardItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorText, setErrorText] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorText(null);
      const data = await fetchCategories();
      const normalized = data
        .map((category: Category) => ({
          id: category.id,
          name: category.name,
          testsCount: category.categories.reduce((sum, sub) => sum + sub.quizCount, 0),
        }))
        .sort((a, b) => b.testsCount - a.testsCount);

      setCategories(normalized);
    } catch {
      setErrorText('Failed to load categories. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const safeLoad = async () => {
      try {
        if (!isMounted) return;
        await loadCategories();
      } finally {
        if (!isMounted) {
          return;
        }
      }
    };
    safeLoad();

    return () => {
      isMounted = false;
    };
  }, [loadCategories]);



  const filteredCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return categories;
    return categories.filter((item) => item.name.toLowerCase().includes(query));
  }, [categories, searchQuery]);

  const displayedCategories = showAll
    ? filteredCategories
    : filteredCategories.slice(0, INITIAL_VISIBLE_COUNT);

  const canViewAll = filteredCategories.length > INITIAL_VISIBLE_COUNT;

  return (
    <View className="flex-1 bg-background p-4">
      <View className="mb-4 gap-3">
        <Text variant="h3">Categories</Text>
        <Input
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search categories..."
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center gap-2">
          <ActivityIndicator />
          <Text className="text-muted-foreground">Loading categories...</Text>
        </View>
      )
}

      const styles = StyleSheet.create({ })