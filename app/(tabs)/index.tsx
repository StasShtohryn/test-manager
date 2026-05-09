import { ScrollView, StyleSheet, View } from 'react-native'
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

export default function indexScreen() {
    const [value, setValue] = useState('passed');
    const [completedTests, setCompletedTests] = useState<TestResult[]>([]);

    useEffect(() => {
        const loadCompletedTests = async () => {
            try {
                const tests = await getCompletedTests()
                setCompletedTests(tests)
            } catch (error) {
                console.log('Error loading tests:', error)
            }
        }

        loadCompletedTests()
    }, [])

    return (
        <View className='flex-1 justify-center items-center'>
            <Text className='font-bold text-lg'>Hi, {auth.currentUser?.email}!</Text>
            <Text className='text-red-500 font-semibold text-md' onPress={() => { signOut(auth) }}>Exit</Text>
            <View className="gap-2 w-[calc(100vw-10vw)] lg:w-[calc(100vw-60vw)]">
                <View className='bg-white flex-row gap-1 p-1 rounded-xl border border-black/10'>
                    <Button onPress={() => setValue('passed')} variant={value === 'passed' ? 'default' : 'ghost'} className='border border-black/10'>
                        <Text>Passed Tests</Text>
                    </Button>
                    <Button onPress={() => setValue('saved')} variant={value === 'saved' ? 'default' : 'ghost'} className='border border-black/10'>
                        <Text>Saved Tests</Text>
                    </Button>
                </View>
                <Tabs value={value} onValueChange={setValue}>
                    <TabsContent value="passed">
                        <View>
                            <ScrollView>
                                {completedTests.map((test) => (
                                    <View
                                        key={test.id}
                                        className="p-4 border border-black/10 rounded-xl mb-2 bg-white"
                                    >
                                        <Text className="font-bold text-lg">
                                            {test.quiz.title}
                                        </Text>
                                
                                        <Text>
                                            Score: {test.score}
                                        </Text>
                                
                                        <Text>
                                            Date: {test.completedAt.toLocaleString()}
                                        </Text>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    </TabsContent>

                    <TabsContent value="saved">
                        <View>
                            <Text>aszfdasd</Text>
                        </View>
                    </TabsContent>
                </Tabs>
            </View>
        </View>
    )
}