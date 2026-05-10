import { SocialConnections } from '@/components/social-connections';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { auth } from '@/services/FireBaseConfig';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useRef, useState } from 'react';
import { Pressable, type TextInput, View } from 'react-native';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2Icon } from 'lucide-react-native';




export function SignForm() {
    const [value, setValue] = useState('signin');
    const router = useRouter();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    const handleAuth = async () => {
        if (!email || !password) {
            alert('заповніть усі поля!');
            return;
        }
        setLoading(true);
        try {
            if (value === 'signin') {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);

            }
            setIsSuccess(true);

            await new Promise(resolve => setTimeout(resolve, 5000));
            router.replace('/(tabs)');

        }
        catch (err: any) {
            let message = 'Сталася помилка';
            if (err.code === 'auth/email-already-in-use') {
                message = 'This email E-Mail is already used'
            }
            if (err.code === 'auth/wrong-password') {
                message = 'Incorrect password'
            }
            if (err.code === 'auth/user-not-fount') {
                message = 'The user was not found'
            }
            alert(message);
        } finally {
            setLoading(false);
        }

    }

    const passwordInputRef = useRef<TextInput>(null);

    function onEmailSubmitEditing() {
        passwordInputRef.current?.focus();
    }

    function onSubmit() {
        handleAuth();
    }

    return (
        <View className="gap-2 w-[calc(100vw-10vw)] lg:w-[calc(100vw-60vw)]">
            <View className='bg-white flex-row gap-1 p-2 rounded-xl'>
                <Button onPress={() => setValue('signin')} variant={value === 'signin' ? 'default' : 'ghost'} className='border border-black/10'>
                    <Text>Sign In</Text>
                </Button>
                <Button onPress={() => setValue('signup')} variant={value === 'signup' ? 'default' : 'ghost'} className='border border-black/10'>
                    <Text>Sign Up</Text>
                </Button>
            </View>
            <Tabs value={value} onValueChange={setValue}>
                <TabsContent value="signin">
                    <Card className="border-border/0 sm:border-border shadow-none sm:shadow-sm sm:shadow-black/5">
                        <CardHeader>
                            <CardTitle className="text-center text-xl sm:text-left">Sign in to your app</CardTitle>
                            <CardDescription className="text-center sm:text-left">
                                Welcome back! Please sign in to continue
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="gap-6">
                            <View className="gap-6">
                                <View className="gap-1.5">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        placeholder="m@example.com"
                                        keyboardType="email-address"
                                        autoComplete="email"
                                        autoCapitalize="none"
                                        onSubmitEditing={onEmailSubmitEditing}
                                        returnKeyType="next"
                                        submitBehavior="submit"

                                        value={email}
                                        onChangeText={setEmail}
                                    />
                                </View>
                                <View className="gap-1.5">
                                    <View className="flex-row items-center">
                                        <Label htmlFor="password">Password</Label>
                                        <Button
                                            variant="link"
                                            size="sm"
                                            className="web:h-fit ml-auto h-4 px-1 py-0 sm:h-4"
                                            onPress={() => {
                                                // TODO: Navigate to forgot password screen
                                            }}>
                                            <Text className="font-normal leading-4">Forgot your password?</Text>
                                        </Button>
                                    </View>
                                    <Input
                                        ref={passwordInputRef}
                                        id="password"
                                        secureTextEntry
                                        returnKeyType="send"
                                        onSubmitEditing={onSubmit}

                                        value={password}
                                        onChangeText={setPassword}
                                    />
                                </View>
                                <Button className="w-full" onPress={onSubmit}>
                                    <Text>Continue</Text>
                                </Button>
                            </View>
                            <View className='flex-row justify-center items-center'>
                                <Text className="text-center text-sm">
                                    Don&apos;t have an account?{' '}
                                </Text>
                                <Pressable
                                    onPress={() => setValue('signup')}>
                                    <Text className="text-sm underline underline-offset-4 self-center">Sign up</Text>
                                </Pressable>
                            </View>
                            <View className="flex-row items-center">
                                <Separator className="flex-1" />
                                <Text className="text-muted-foreground px-4 text-sm">or</Text>
                                <Separator className="flex-1" />
                            </View>
                            <SocialConnections />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="signup">
                    <Card className="border-border/0 sm:border-border shadow-none sm:shadow-sm sm:shadow-black/5">
                        <CardHeader>
                            <CardTitle className="text-center text-xl sm:text-left">Create your account</CardTitle>
                            <CardDescription className="text-center sm:text-left">
                                Welcome! Create your account to continue
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="gap-6">
                            <View className="gap-6">
                                <View className="gap-1.5">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        placeholder="m@example.com"
                                        keyboardType="email-address"
                                        autoComplete="email"
                                        autoCapitalize="none"
                                        onSubmitEditing={onEmailSubmitEditing}
                                        returnKeyType="next"
                                        submitBehavior="submit"

                                        value={email}
                                        onChangeText={setEmail}
                                    />
                                </View>
                                <View className="gap-1.5">
                                    <View className="flex-row items-center">
                                        <Label htmlFor="password">Password</Label>
                                    </View>
                                    <Input
                                        ref={passwordInputRef}
                                        id="password"
                                        secureTextEntry
                                        returnKeyType="send"
                                        onSubmitEditing={onSubmit}

                                        value={password}
                                        onChangeText={setPassword}
                                    />
                                </View>
                                <Button className="w-full" onPress={onSubmit}>
                                    <Text>Continue</Text>
                                </Button>
                            </View>
                            <View className='flex-row justify-center items-center'>
                                <Text className="text-center text-sm">
                                    Already have an account?{' '}
                                </Text>
                                <Pressable
                                    onPress={() => setValue('signin')}>
                                    <Text className="text-sm underline underline-offset-4">Sign in</Text>
                                </Pressable>
                            </View>
                            <View className="flex-row items-center">
                                <Separator className="flex-1" />
                                <Text className="text-muted-foreground px-4 text-sm">or</Text>
                                <Separator className="flex-1" />
                            </View>
                            <SocialConnections />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

        </View>
    );
}
