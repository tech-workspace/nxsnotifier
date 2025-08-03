import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from './context/AuthContext';
import { API_BASE_URL } from './config/api';

export default function Index() {
  const { user, loading } = useAuth();

  useEffect(() => {
    console.log('🚀 ===== APP STARTED =====');
    console.log('🌐 API_BASE_URL from index:', API_BASE_URL);
    console.log('✅ Using Railway:', API_BASE_URL.includes('railway.app'));
    console.log('🚀 ===== END APP START =====');

    if (!loading) {
      if (user) {
        router.replace('/(tabs)/home');
      } else {
        router.replace('/auth/login');
      }
    }
  }, [user, loading]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
      <Text style={{ color: '#FFD700', fontSize: 18 }}>Loading...</Text>
    </View>
  );
} 