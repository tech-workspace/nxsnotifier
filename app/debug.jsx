import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getInquiries, testNetworkConnectivity, checkApiHealth } from './services/database';
import { API_BASE_URL } from './config/api';

const DebugScreen = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState({});

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { message, type, timestamp }]);
  };

  const clearLogs = () => {
    setLogs([]);
    setTestResults({});
  };

  const testBasicConnectivity = async () => {
    setLoading(true);
    addLog('🔍 Starting basic connectivity test...', 'info');

    try {
      // Test basic internet
      addLog('🌐 Testing basic internet connectivity...', 'info');
      const response = await fetch('https://httpbin.org/get', {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });

      if (response.ok) {
        addLog('✅ Basic internet connectivity: OK', 'success');
        setTestResults(prev => ({ ...prev, basicInternet: 'OK' }));
      } else {
        addLog('❌ Basic internet connectivity: FAILED', 'error');
        setTestResults(prev => ({ ...prev, basicInternet: 'FAILED' }));
      }
    } catch (error) {
      addLog(`❌ Basic internet test failed: ${error.message}`, 'error');
      setTestResults(prev => ({ ...prev, basicInternet: 'FAILED' }));
    }

    setLoading(false);
  };

  const testApiHealth = async () => {
    setLoading(true);
    addLog('🏥 Testing API health endpoint...', 'info');

    try {
      const healthData = await checkApiHealth();
      addLog(`✅ API health check successful: ${JSON.stringify(healthData)}`, 'success');
      setTestResults(prev => ({ ...prev, apiHealth: 'OK' }));
    } catch (error) {
      addLog(`❌ API health check failed: ${error.message}`, 'error');
      setTestResults(prev => ({ ...prev, apiHealth: 'FAILED' }));
    }

    setLoading(false);
  };

  const testInquiriesAPI = async () => {
    setLoading(true);
    addLog('📋 Testing inquiries API...', 'info');

    try {
      const inquiries = await getInquiries();
      addLog(`✅ Inquiries API successful: ${inquiries.length} inquiries found`, 'success');
      setTestResults(prev => ({ ...prev, inquiriesAPI: 'OK' }));
    } catch (error) {
      addLog(`❌ Inquiries API failed: ${error.message}`, 'error');
      setTestResults(prev => ({ ...prev, inquiriesAPI: 'FAILED' }));
    }

    setLoading(false);
  };

  const runAllTests = async () => {
    clearLogs();
    addLog('🚀 Starting comprehensive network test...', 'info');
    addLog(`🌐 API Base URL: ${API_BASE_URL}`, 'info');
    addLog(`📱 Platform: ${typeof window !== 'undefined' ? 'Web' : 'React Native'}`, 'info');

    await testBasicConnectivity();
    await testApiHealth();
    await testInquiriesAPI();

    addLog('🏁 All tests completed!', 'info');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Network Debug</Text>
        <Text style={styles.headerSubtitle}>Test API connectivity</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.testButton}
          onPress={runAllTests}
          disabled={loading}
        >
          <Ionicons name="play" size={20} color="#000" />
          <Text style={styles.buttonText}>Run All Tests</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.clearButton}
          onPress={clearLogs}
          disabled={loading}
        >
          <Ionicons name="trash" size={20} color="#FFD700" />
          <Text style={styles.clearButtonText}>Clear Logs</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>Test Results:</Text>
        <View style={styles.resultItem}>
          <Text style={styles.resultLabel}>Basic Internet:</Text>
          <Text style={[
            styles.resultValue,
            testResults.basicInternet === 'OK' ? styles.success : styles.error
          ]}>
            {testResults.basicInternet || 'Not tested'}
          </Text>
        </View>
        <View style={styles.resultItem}>
          <Text style={styles.resultLabel}>API Health:</Text>
          <Text style={[
            styles.resultValue,
            testResults.apiHealth === 'OK' ? styles.success : styles.error
          ]}>
            {testResults.apiHealth || 'Not tested'}
          </Text>
        </View>
        <View style={styles.resultItem}>
          <Text style={styles.resultLabel}>Inquiries API:</Text>
          <Text style={[
            styles.resultValue,
            testResults.inquiriesAPI === 'OK' ? styles.success : styles.error
          ]}>
            {testResults.inquiriesAPI || 'Not tested'}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.logsContainer}>
        <Text style={styles.logsTitle}>Debug Logs:</Text>
        {logs.map((log, index) => (
          <View key={index} style={styles.logItem}>
            <Text style={styles.logTimestamp}>{log.timestamp}</Text>
            <Text style={[
              styles.logMessage,
              log.type === 'error' ? styles.errorText :
                log.type === 'success' ? styles.successText : styles.infoText
            ]}>
              {log.message}
            </Text>
          </View>
        ))}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#FFD700" />
            <Text style={styles.loadingText}>Testing...</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 10,
  },
  testButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD700',
    padding: 15,
    borderRadius: 8,
    gap: 8,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFD700',
    gap: 8,
  },
  clearButtonText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    padding: 20,
    backgroundColor: '#1a1a1a',
    margin: 20,
    borderRadius: 10,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 15,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  resultLabel: {
    fontSize: 16,
    color: '#fff',
  },
  resultValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  success: {
    color: '#4CAF50',
  },
  error: {
    color: '#f44336',
  },
  logsContainer: {
    flex: 1,
    padding: 20,
  },
  logsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 15,
  },
  logItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#1a1a1a',
    borderRadius: 5,
  },
  logTimestamp: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
  logMessage: {
    fontSize: 14,
    lineHeight: 20,
  },
  infoText: {
    color: '#fff',
  },
  successText: {
    color: '#4CAF50',
  },
  errorText: {
    color: '#f44336',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 10,
  },
  loadingText: {
    color: '#FFD700',
    fontSize: 16,
  },
});

export default DebugScreen; 