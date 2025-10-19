import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [mobile, setMobile] = useState('0568863388');
  const [password, setPassword] = useState('600660');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [autoLoginAttempted, setAutoLoginAttempted] = useState(false);
  const { login, user } = useAuth();

  // Auto-attempt login when component mounts with default credentials
  useEffect(() => {
    if (!autoLoginAttempted && !user) {
      setAutoLoginAttempted(true);
      handleLogin(true); // Silent auto-login attempt
    }
  }, []);

  // If user is already logged in, redirect to home
  useEffect(() => {
    if (user) {
      router.replace('/');
    }
  }, [user]);

  const handleLogin = async (silentAttempt = false) => {
    if (!silentAttempt) {
      setError('');
    }

    if (!mobile || !password) {
      if (!silentAttempt) {
        setError('Please fill in all fields');
      }
      return;
    }

    // Basic mobile validation (10-15 digits)
    const mobileRegex = /^[0-9]{10,15}$/;
    if (!mobileRegex.test(mobile)) {
      if (!silentAttempt) {
        setError('Please enter a valid mobile number (10-15 digits)');
      }
      return;
    }

    if (password.length < 6) {
      if (!silentAttempt) {
        setError('Password must be at least 6 characters');
      }
      return;
    }

    setLoading(true);
    try {
      const result = await login(mobile, password);

      if (result.success) {
        router.replace('/');
      } else {
        if (!silentAttempt) {
          setError(result.error || 'Invalid credentials. Please try again.');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      if (!silentAttempt) {
        setError('Invalid credentials. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const navigateToSignup = () => {
    router.push('/auth/signup');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mobile Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your mobile number"
              value={mobile}
              onChangeText={setMobile}
              keyboardType="phone-pad"
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={15}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={navigateToSignup}>
              <Text style={styles.linkText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    backgroundColor: '#1a1a1a',
    padding: 30,
    borderRadius: 15,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#FFD700',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#fff',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#FFD700',
  },
  input: {
    borderWidth: 1,
    borderColor: '#FFD700',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#000',
    color: '#fff',
  },
  button: {
    backgroundColor: '#FFD700',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#666',
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  footerText: {
    color: '#fff',
    fontSize: 16,
  },
  linkText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Login; 