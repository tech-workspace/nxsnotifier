import { Stack } from 'expo-router';
import { View, Text } from 'react-native';
import { useEffect } from 'react';
import { router } from 'expo-router';
import { AuthProvider, useAuth } from './context/AuthContext';

function RootLayoutNav() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // User is authenticated, ensure they're on a protected route
        const currentPath = router.pathname;
        if (currentPath && (currentPath === '/' || currentPath.startsWith('/auth/'))) {
          router.replace('/(tabs)/home');
        }
      } else {
        // User is not authenticated, redirect to login
        const currentPath = router.pathname;
        if (currentPath && currentPath !== '/auth/login' && currentPath !== '/auth/signup') {
          router.replace('/auth/login');
        }
      }
    }
  }, [user, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
        <Text style={{ color: '#FFD700', fontSize: 18 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="auth/login" />
      <Stack.Screen name="auth/signup" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
} 