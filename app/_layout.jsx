import { Stack, Redirect } from 'expo-router';
import { View, Text } from 'react-native';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function RootLayoutNav() {
  const { user, loading } = useAuth();

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
      <Stack.Screen name="debug" />
      <Stack.Screen name="logs" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </SafeAreaProvider>
  );
} 