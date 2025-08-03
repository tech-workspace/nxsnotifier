import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { API_BASE_URL, getApiUrl, ENDPOINTS } from './config/api';

export default function DebugComponent() {
  useEffect(() => {
    console.log('🔍 ===== DEBUG COMPONENT LOADED =====');
    console.log('🌐 API_BASE_URL:', API_BASE_URL);
    console.log('🔗 Inquiries URL:', getApiUrl(ENDPOINTS.INQUIRIES));
    console.log('✅ Is Railway URL?', API_BASE_URL.includes('railway.app'));
    console.log('🔍 ===== END DEBUG =====');
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔍 Debug Information</Text>
      <Text style={styles.text}>API Base URL: {API_BASE_URL}</Text>
      <Text style={styles.text}>Inquiries URL: {getApiUrl(ENDPOINTS.INQUIRIES)}</Text>
      <Text style={styles.text}>Using Railway: {API_BASE_URL.includes('railway.app') ? '✅ Yes' : '❌ No'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    marginBottom: 5,
  },
}); 