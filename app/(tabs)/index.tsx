import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useState } from 'react'
import { auth } from '@/services/FireBaseConfig'
import { getCompletedTests } from '@/services/firebase-results.service'
import { getFavorites } from '@/services/firebase-favorites.service'
import { signOut } from 'firebase/auth'
import { router } from 'expo-router';
import { TestResult } from '@/types/test-result.types';
import { QuizPreview } from '@/types/api.types';

export default function indexScreen() {
    const [value, setValue] = useState('passed');
    const [completedTests, setCompletedTests] = useState<TestResult[]>([]);
    const [favoritedTests, setFavoritedTests] = useState<QuizPreview[]>([]);

    useEffect(() => {
        const loadCompletedTests = async () => {
            try {
                const tests = await getCompletedTests()
                setCompletedTests(tests)
            } catch (error) {
                console.log('Error loading tests:', error)
            }
        }

        const loadFavoritedTests = async () => {
            try{
                const tests = await getFavorites()
                setFavoritedTests(tests)
            } catch (error) {
                console.log('Error loading tests: ', error)
            }
        }

        loadCompletedTests()
        loadFavoritedTests()
    }, [])

    return (
        <View className='flex-1 items-center pt-20 bg-gray-50'>
            
            <Text className='font-bold text-lg'>Hi, {auth.currentUser?.email}!</Text>
            <Button variant={'destructive'} className='text-white px-12 mt-2 mb-8' onPress={() => signOut(auth)}><Text>Exit</Text></Button>
            
            <View className="w-[90vw] lg:w-[400px] h-[500px] gap-2">
                
                <View className='bg-white flex-row gap-1 p-1 rounded-xl border border-black/10'>
                    <Button onPress={() => setValue('passed')} variant={value === 'passed' ? 'default' : 'ghost'} className='flex-1'>
                        <Text>Passed Tests</Text>
                    </Button>
                    <Button onPress={() => setValue('saved')} variant={value === 'saved' ? 'default' : 'ghost'} className='flex-1'>
                        <Text>Saved Tests</Text>
                    </Button>
                </View>

                <Tabs value={value} onValueChange={setValue} className="flex-1">
                    <TabsContent value="passed" className="flex-1">
                        <ScrollView 
                            className="flex-1 border border-black/10 p-2 rounded-xl" 
                            showsVerticalScrollIndicator={false}
                        >
                            {completedTests.map((test) => (
                                <View
                                    key={test.id}
                                    className="p-4 border border-black/10 mb-2 rounded-xl bg-white"
                                >
                                    <View className='flex flex-row justify-between'>
                                        <Text className="font-bold text-lg">{test.quiz.title}</Text>
                                        <Text className="text-lg">{test.totalTimeSpent}s</Text>
                                    </View>
                                    <Text>Score: {test.score}</Text>
                                    <Text className="text-gray-500 text-sm">
                                        Date: {new Date(test.completedAt).toLocaleDateString()}
                                    </Text>
                                </View>
                            ))}
                        </ScrollView>
                    </TabsContent>

                    <TabsContent value="saved" className="flex-1">
                        <ScrollView 
                            className="flex-1 pt-2 border border-black/10 px-2 rounded-xl" 
                            showsVerticalScrollIndicator={false}
                        >
                            {favoritedTests.map((test) => (
                                <Pressable
                                    key={test.id}
                                    className="p-4 border border-black/10 mb-2 rounded-xl bg-white"
                                    onPress={() => router.push({ pathname: '/test-preview/[id]', params: { id: test.id }})}
                                >
                                    <Text className="font-bold text-lg">{test.title}</Text>
                                    <Text>Difficulty: {test.difficulty}</Text>
                                    <Text className="text-gray-500 text-sm">
                                        Description: {test.description}
                                    </Text>
                                </Pressable>
                            ))}
                        </ScrollView>
                    </TabsContent>
                </Tabs>
            </View>
        </View>
    )
}