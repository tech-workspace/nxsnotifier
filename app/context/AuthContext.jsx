import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signupUser, loginUser, getUserProfile } from '../services/database';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('userToken');

      if (storedToken) {
        // Verify token by fetching user profile
        try {
          const result = await getUserProfile(storedToken);
          if (result.success && result.user) {
            setUser(result.user);
            setToken(storedToken);
          } else {
            // Token is invalid, try auto-login with stored credentials
            await tryAutoLogin();
          }
        } catch (error) {
          // Token is invalid or expired, try auto-login with stored credentials
          await tryAutoLogin();
        }
      } else {
        // No token, try auto-login with stored credentials
        await tryAutoLogin();
      }
    } catch (error) {
      console.error('Check user error:', error);
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const tryAutoLogin = async () => {
    try {
      const storedMobile = await AsyncStorage.getItem('userMobile');
      const storedPassword = await AsyncStorage.getItem('userPassword');

      if (storedMobile && storedPassword) {
        // Attempt auto-login
        const result = await loginUser(storedMobile, storedPassword);
        if (result.success && result.token) {
          await AsyncStorage.setItem('userToken', result.token);
          setToken(result.token);
          setUser(result.user);
        } else {
          // Clear invalid credentials
          await AsyncStorage.multiRemove(['userToken', 'userMobile', 'userPassword']);
          setUser(null);
          setToken(null);
        }
      }
    } catch (error) {
      console.error('Auto-login error:', error);
      setUser(null);
      setToken(null);
    }
  };

  const login = async (mobile, password, rememberCredentials = true) => {
    try {
      const result = await loginUser(mobile, password);

      if (result.success && result.token) {
        // Store token in AsyncStorage
        await AsyncStorage.setItem('userToken', result.token);

        // Store credentials for auto-login if requested
        if (rememberCredentials) {
          await AsyncStorage.setItem('userMobile', mobile);
          await AsyncStorage.setItem('userPassword', password);
        }

        setToken(result.token);
        setUser(result.user);
        return { success: true };
      } else {
        return {
          success: false,
          error: 'Invalid credentials. Please try again.'
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.message || 'Invalid credentials. Please try again.'
      };
    }
  };

  const signup = async (fullName, mobile, password) => {
    try {
      const result = await signupUser(fullName, mobile, password);

      if (result.success && result.token) {
        // Store token and credentials in AsyncStorage
        await AsyncStorage.setItem('userToken', result.token);
        await AsyncStorage.setItem('userMobile', mobile);
        await AsyncStorage.setItem('userPassword', password);
        setToken(result.token);
        setUser(result.user);
        return { success: true };
      } else {
        return {
          success: false,
          error: 'Failed to create account. Please try again.'
        };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create account. Please try again.'
      };
    }
  };

  const logout = async () => {
    try {
      // Clear all auth data from AsyncStorage
      await AsyncStorage.multiRemove(['userToken', 'userMobile', 'userPassword']);
      setUser(null);
      setToken(null);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      // Always clear user state even if there's an error
      setUser(null);
      setToken(null);
      return { success: true };
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    signup,
    logout,
    checkUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Default export
export default AuthProvider;