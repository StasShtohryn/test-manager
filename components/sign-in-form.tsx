import { SocialConnections } from '@/components/social-connections';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { auth } from '@/services/FireBaseConfig';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { Pressable, type TextInput, View } from 'react-native';

export function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoginMode, setIsLoginMode] = useState<boolean>(true);

  const handleAuth = async () => {
      if (!email || !password) {
          alert('заповніть усі поля!');
          return;
      }
      setLoading(true);
      try {
          if(isLoginMode){
              await signInWithEmailAndPassword(auth, email, password);
              alert('Ви успішно авторизовані!') 
          } else{
              await createUserWithEmailAndPassword(auth, email, password);
              alert('Ви успішно зареєстровані!')
          }
          router.replace('/(tabs)');
      }
      catch (err: any){
          let message = 'Сталася помилка';
          if(err.code === 'auth/email-already-in-use') {
              message = 'Цей E-Mail вже зайнятий'
          }
          if(err.code === 'auth/wrong-password') {
              message = 'Невірний пароль'
          }
          if(err.code === 'auth/user-not-fount') {
              message = 'Користувач не знайдений'
          }
          alert(message);
      }
      finally {
          setLoading(false);
      }
  };

  const passwordInputRef = React.useRef<TextInput>(null);

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  function onSubmit() {
    handleAuth();
  }

  return (
    <View className="gap-6">
      <Card className="border-border/0 sm:border-border shadow-none sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left">Увійдіть</CardTitle>
          <CardDescription className="text-center sm:text-left">
            Вітаємо! Увійдіть, щоб продовжити
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="gap-6">
            <View className="gap-1.5">
              <Label htmlFor="email">Пошта</Label>
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
                <Label htmlFor="password">Пароль</Label>
                <Button
                  variant="link"
                  size="sm"
                  className="web:h-fit ml-auto h-4 px-1 py-0 sm:h-4"
                  onPress={() => {
                    // TODO: Navigate to forgot password screen
                  }}>
                  <Text className="font-normal leading-4">Забули пароль?</Text>
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
              <Text>Увійти</Text>
            </Button>
          </View>
          <Text className="text-center text-sm">
            Немає акаунту?{' '}
            <Pressable
              onPress={() => {
                // TODO: Navigate to sign up screen
              }}>
              <Text className="text-sm underline underline-offset-4">Зареєструватися</Text>
            </Pressable>
          </Text>
          {/* <View className="flex-row items-center">
            <Separator className="flex-1" />
            <Text className="text-muted-foreground px-4 text-sm">or</Text>
            <Separator className="flex-1" />
          </View> */}
          {/* <SocialConnections /> */}
        </CardContent>
      </Card>
    </View>
  );
}
