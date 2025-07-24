import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import Avatar from '../../assets/img/icon.png';

const Profile = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      const result = await logout();
      if (result.success) {
        router.replace('/auth/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
      router.replace('/auth/login');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={Avatar} style={styles.avatar} />
      <Text style={styles.name}>{user?.name || 'No Name'}</Text>
      <Text style={styles.email}>{user?.email}</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 30,
  },
  logoutButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Profile; 