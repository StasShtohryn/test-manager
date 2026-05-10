import '../global.css';
import { SafeAreaView  } from 'react-native-safe-area-context';
import { auth } from '@/services/FireBaseConfig';
import { Stack, useRootNavigationState, useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { useColorScheme } from 'nativewind';
import { useEffect, useState } from 'react';

export default function RootLayout() {
  const { setColorScheme } = useColorScheme();
  const router = useRouter();
  const navigationState = useRootNavigationState();
  const [isReady, setIsReady] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setColorScheme('light');
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      setIsReady(true);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!isReady || !navigationState.key) {
      return;
    }
    if (!user) {
      router.replace('/auth');
    } else {
      router.replace('/(tabs)');
    }
  }, [user, isReady, navigationState?.key]);

  return (
    <SafeAreaView  className="flex-1 bg-background" edges={['top', 'left', 'right']}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaView>
  );
}
