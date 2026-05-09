import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView } from 'react-native';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Text } from '@/components/ui/text';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react-native';

import { Category, QuestionsQueryParams, StandaloneQuestion } from '@/types/api.types';
import { fetchCategories, fetchQuestions } from '@/services/api.service';
import { QuestionsPreview } from '@/components/generateTestPreview';
import { router } from 'expo-router';

export default function generating() {
    // ->
    const [loading, setLoading] = useState(false);

    // Поля фільтрації
    const [difficulty, setDifficulty] = useState<string>('EASY');
    const [limit, setLimit] = useState<number>(10);

    // Категорії
    const [rawCategories, setRawCategories] = useState<Category[]>([]);
    const [categories, setCategories] = useState<{ label: string, value: string }[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

    // Питання
    const [generatedQuestions, setGeneratedQuestions] = useState<StandaloneQuestion[]>([]);



    const loadCategories = useCallback(async () => {
        try {
            setLoading(true);
            const data = await fetchCategories();  // отримуємо масив з Category
            setRawCategories(data);                // зберігаємо Category

            const normalized = data.map((cat: Category) => ({
                label: cat.name,
                value: cat.name,
            }));
            setCategories(normalized);              // зберігаємо для випадаючого списку
        }
        catch (error) {
            alert('Failed to load categories' + error);
        }
        finally {
            setLoading(false);
        }
    }, []);


    const toggleCategory = (category: Category) => {
        setSelectedCategories((prev) => {
            const isSelected = prev.some((c) => c.id === category.id);
            return isSelected
                ? prev.filter((c) => c.id !== category.id)
                : [...prev, category];
        });
    };

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



    const generateQuiz = async () => {
        // Перевірка, щоб не відправляти порожній запит
        if (selectedCategories.length === 0) {
            alert("Please select at least one category");
            return;
        }

        setLoading(true);

        const randomOffset = Math.floor(Math.random() * 100);
        const categoryString = selectedCategories.map(c => c.name).join(',');

        let params: QuestionsQueryParams = {
            category: categoryString,
            limit: limit,
            offset: randomOffset,
        };

        if (difficulty !== 'ALL') {
            params.difficulty = difficulty.toLowerCase();
        }

        try {
            let questions = await fetchQuestions(params);
            // Перевірка: якщо прийшло порожньо або менше, ніж ми просили (момент з офсетом, якщо він великий)
            if (!questions || questions.length === 0) {
                // Відкат до початку списку (гарантовані питання)
                questions = await fetchQuestions({ ...params, offset: 0 });
            }

            if (questions && questions.length > 0) {
                // Перемішуємо результат на стороні клієнта для додаткового рандому
                const shuffled = [...questions].sort(() => Math.random() - 0.5);
                setGeneratedQuestions(shuffled);
            }
            else {
                alert("No questions found for these categories.");
            }
        }
        catch (error) {
            console.error("Generation error:", error);
            alert("Failed to generate quiz. Please check your network or API key.");
        }
        finally {
            setLoading(false);
        }
    };


    const startGeneratedQuiz = () => {
        if (generatedQuestions.length === 0) return;
        const temporaryQuiz = {
            id: `gen_${Date.now()}`,
            title: "Згенерований тест",
            category: selectedCategories.map(c => c.name).join(', '),
            difficulty: difficulty,
            questions: generatedQuestions,
            questionCount: generatedQuestions.length,
            createdAt: new Date().toISOString(),
        };


        router.push({
            pathname: '/testing/testing',
            params: { data: JSON.stringify(temporaryQuiz) }
        });
    };

    return (
        <ScrollView className="flex-1 p-6 bg-background">
            <Text className="text-2xl font-bold mb-6">Generate test</Text>

            {/* Вибір категорії */}
            <View className="mb-2">
                <Label className="mb-2">Category</Label>
                <Select
                    onValueChange={(val) => {
                        if (!val) return;
                        // Шукаємо оригінальний об'єкт Category за іменем (value), яке ми обрали
                        const fullCat = rawCategories.find(c => c.name === val.value);
                        if (fullCat) {
                            toggleCategory(fullCat);
                        }
                    }}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select category(-ies)" />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectGroup>
                            {categories.map((cat) => (
                                <SelectItem
                                    key={cat.value}
                                    label={cat.label}
                                    value={cat.value}
                                    className={selectedCategories.some(s => s.name === cat.value) ? "bg-accent" : ""}
                                />
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </View>

            {/* Контейнер для бейджів */}
            <View className="flex-row flex-wrap gap-2">
                {selectedCategories.map((cat) => (
                    <Badge key={cat.id} className="flex-row items-center gap-4 px-4 rounded-xl">
                        <Text className="text-xs">{cat.name}</Text>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="w-4 p-0"
                            onPress={() => toggleCategory(cat)}
                        >
                            <X size={12} color="gray" />
                        </Button>
                    </Badge>
                ))
                }
            </View >

            {/* Кількість питань */}
            < View className="mb-6 mt-3" >
                <Label className="mb-2">Number of questions</Label>
                <Input
                    keyboardType="numeric"
                    value={limit?.toString()}
                    onChangeText={(text) => {
                        // Якщо поле порожнє, записуємо 0 або залишаємо пустим (залежить від логіки)
                        if (text === '') {
                            setLimit(0);
                            return;
                        }

                        // Видаляємо все, що не є цифрами (захист від вставки тексту)
                        const numericValue = parseInt(text.replace(/[^0-9]/g, ''), 10);

                        if (!isNaN(numericValue)) {
                            setLimit(numericValue);
                        }
                    }}
                    placeholder="For example, 10"
                />
            </View >

            {/* Складність */}
            < View className="mb-6" >
                <Label className="mb-3">Difficulty</Label>
                <RadioGroup value={difficulty} onValueChange={setDifficulty} className="gap-3">
                    <View className="flex-row items-center gap-3">
                        <RadioGroupItem value="EASY" id="easy" />
                        <Label nativeID="easy">Easy</Label>
                    </View>
                    <View className="flex-row items-center gap-3">
                        <RadioGroupItem value="MEDIUM" id="medium" />
                        <Label nativeID="medium">Medium</Label>
                    </View>
                    <View className="flex-row items-center gap-3">
                        <RadioGroupItem value="HARD" id="hard" />
                        <Label nativeID="hard">Hard</Label>
                    </View>
                    <View className="flex-row items-center gap-3">
                        <RadioGroupItem value="ALL" id="all" />
                        <Label nativeID="all">All</Label>
                    </View>
                </RadioGroup>
            </View >

            <Button
                onPress={generateQuiz}
                disabled={loading}
            >
                <Text>{loading ? 'Generating...' : 'Generate new text'}</Text>
            </Button>

            {generatedQuestions.length > 0 && (
                <>
                    <QuestionsPreview questions={generatedQuestions} />

                    <Button
                        variant={'default'}
                        className="mt-6 h-14 rounded-2xl shadow-lg"
                        onPress={startGeneratedQuiz}
                    >
                        <Text className="text-white font-bold text-lg">Почати тестування</Text>
                    </Button>
                </>
            )}
        </ScrollView >
    )
}