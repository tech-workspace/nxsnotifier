import React, { createContext, useContext, useState, useEffect } from 'react';
import { Client, Account, ID } from 'appwrite';

// Appwrite configuration
const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('6880db04000336a9886c');

const account = new Account(client);

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      console.log('Checking user session...');
      const session = await account.get();
      console.log('Active session found:', session);
      setUser({
        id: session.$id,
        email: session.email,
        name: session.name
      });
    } catch (error) {
      console.log('No active session or unauthorized:', error.message);
      // 401 Unauthorized is expected when there's no valid session
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('Attempting login with:', email);
      console.log('Account methods (login):', Object.getOwnPropertyNames(Object.getPrototypeOf(account)));
      
      // First, try to delete any existing sessions
      try {
        await account.deleteSessions();
      } catch (sessionError) {
        console.log('No existing sessions to delete:', sessionError.message);
      }
      
      const session = await account.createEmailPasswordSession(email, password);
      console.log('Login successful:', session);
      
      // Get user details
      const userDetails = await account.get();
      const user = {
        id: userDetails.$id,
        email: userDetails.email,
        name: userDetails.name
      };
      
      setUser(user);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.message || 'Invalid credentials. Please try again.' 
      };
    }
  };

  const signup = async (email, password) => {
    try {
      console.log('AuthContext: Attempting signup with:', email);
      console.log('Account methods (signup):', Object.getOwnPropertyNames(Object.getPrototypeOf(account)));
      
      const user = await account.create(
        ID.unique(),
        email,
        password,
        email.split('@')[0] // Use email prefix as name
      );
      
      console.log('AuthContext: Signup successful:', user);
      
      // Automatically log in after signup
      const session = await account.createEmailPasswordSession(email, password);
      const userDetails = await account.get();
      
      const userData = {
        id: userDetails.$id,
        email: userDetails.email,
        name: userDetails.name
      };
      
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error('AuthContext: Signup error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to create account. Please try again.' 
      };
    }
  };

  const logout = async () => {
    try {
      console.log('Attempting logout...');
      
      // Just clear the user state - no need to call account.get() which requires authentication
      setUser(null);
      console.log('Logout successful');
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      // Always clear user state even if there's an error
      setUser(null);
      return { success: true };
    }
  };

  const value = {
    user,
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