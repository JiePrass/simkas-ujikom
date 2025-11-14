// app/_layout.tsx
import AnimatedSplash from '@/components/splash-screen';
import { AuthProvider, useAuth } from '@/contexts/AuthContext'; // ⬅️ pastikan path sesuai
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as Splash from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

Splash.preventAutoHideAsync();

function RootStack() {
  const colorScheme = useColorScheme();
  const { user } = useAuth();
  const [isReady, setIsReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    async function prepare() {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await Splash.hideAsync();
      setIsReady(true);
    }
    prepare();
  }, []);

  if (showSplash) {
    return <AnimatedSplash onFinish={() => setShowSplash(false)} />;
  }

  if (!isReady) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        {!user ? (
          <>
            <Stack.Screen name="login/index" />
            <Stack.Screen name="register/index" />
          </>
        ) : (
          <>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          </>
        )}
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RootStack />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
