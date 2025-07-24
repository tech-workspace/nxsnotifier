import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from './context/AuthContext';

const Debug = () => {
  const { user, logout } = useAuth();

  const checkSession = () => {
    const storedUser = localStorage.getItem('mockUser');
    console.log('Current stored user:', storedUser ? JSON.parse(storedUser) : 'None');
  };

  const forceLogout = () => {
    console.log('Force logout');
    logout();
  };

  const testConnection = () => {
    console.log('Mock authentication is working');
    console.log('Available test credentials:');
    console.log('- Mobile: 1111, Password: password123');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Debug Panel</Text>
      
      <View style={styles.info}>
        <Text style={styles.label}>User State:</Text>
        <Text style={styles.value}>{user ? 'Authenticated' : 'Not Authenticated'}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={checkSession}>
        <Text style={styles.buttonText}>Check Session</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={forceLogout}>
        <Text style={styles.buttonText}>Force Logout</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={testConnection}>
        <Text style={styles.buttonText}>Test Connection</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f0f0',
    margin: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  info: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  value: {
    fontSize: 14,
    color: '#666',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default Debug; 