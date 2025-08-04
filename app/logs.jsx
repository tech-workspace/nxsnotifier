import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { getInquiries, testNetworkConnectivity, checkApiHealth } from './services/database';
import { API_BASE_URL } from './config/api';

const LogsScreen = () => {
    const [logs, setLogs] = useState([]);
    const [isRunning, setIsRunning] = useState(false);
    const scrollViewRef = useRef(null);

    const addLog = (message, type = 'info') => {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = { message, type, timestamp, id: `${Date.now()}-${Math.random()}` };
        setLogs(prev => [...prev, logEntry]);

        // Auto-scroll to bottom
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const clearLogs = () => {
        setLogs([]);
    };

    const testInquiriesAPI = async () => {
        setIsRunning(true);
        addLog('🚀 ===== STARTING INQUIRIES API TEST =====', 'info');
        addLog(`🌐 API Base URL: ${API_BASE_URL}`, 'info');
        addLog(`📱 Platform: ${typeof window !== 'undefined' ? 'Web' : 'React Native'}`, 'info');

        try {
            addLog('🔍 Testing network connectivity...', 'info');
            const isConnected = await testNetworkConnectivity();

            if (isConnected) {
                addLog('✅ Network connectivity test passed', 'success');
            } else {
                addLog('❌ Network connectivity test failed', 'error');
            }

            addLog('🏥 Testing API health...', 'info');
            try {
                const healthData = await checkApiHealth();
                addLog(`✅ API health check successful: ${JSON.stringify(healthData)}`, 'success');
            } catch (error) {
                addLog(`❌ API health check failed: ${error.message}`, 'error');
            }

            addLog('📋 Testing inquiries API...', 'info');
            const inquiries = await getInquiries();
            addLog(`✅ Inquiries API successful: ${inquiries.length} inquiries found`, 'success');
            addLog(`📊 First inquiry: ${JSON.stringify(inquiries[0] || 'No inquiries')}`, 'info');

        } catch (error) {
            addLog(`❌ Inquiries API failed: ${error.message}`, 'error');
            addLog(`🔍 Error details: ${error.stack || 'No stack trace'}`, 'error');
        }

        addLog('🏁 ===== INQUIRIES API TEST COMPLETED =====', 'info');
        setIsRunning(false);
    };

    const runAllTests = async () => {
        clearLogs();
        addLog('🚀 ===== STARTING COMPREHENSIVE NETWORK TEST =====', 'info');
        addLog(`🌐 API Base URL: ${API_BASE_URL}`, 'info');
        addLog(`📱 Platform: ${typeof window !== 'undefined' ? 'Web' : 'React Native'}`, 'info');
        addLog(`⏰ Test started at: ${new Date().toLocaleString()}`, 'info');

        await testInquiriesAPI();

        addLog('🏁 ===== ALL TESTS COMPLETED =====', 'info');
    };

    const getLogColor = (type) => {
        switch (type) {
            case 'error': return '#f44336';
            case 'success': return '#4CAF50';
            case 'warning': return '#FF9800';
            default: return '#fff';
        }
    };

    const getLogIcon = (type) => {
        switch (type) {
            case 'error': return 'close-circle';
            case 'success': return 'checkmark-circle';
            case 'warning': return 'warning';
            default: return 'information-circle';
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="#FFD700" />
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Network Logs</Text>
                <View style={styles.headerRight}>
                    <TouchableOpacity
                        style={styles.clearButton}
                        onPress={clearLogs}
                    >
                        <Ionicons name="trash" size={20} color="#FFD700" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.testButton, isRunning && styles.disabledButton]}
                    onPress={runAllTests}
                    disabled={isRunning}
                >
                    <Ionicons name="play" size={20} color="#000" />
                    <Text style={styles.buttonText}>
                        {isRunning ? 'Testing...' : 'Test Inquiries API'}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.logsContainer}>
                <View style={styles.logsHeader}>
                    <Text style={styles.logsTitle}>Live Logs</Text>
                    <Text style={styles.logsCount}>{logs.length} entries</Text>
                </View>

                <ScrollView
                    ref={scrollViewRef}
                    style={styles.logsScrollView}
                    showsVerticalScrollIndicator={true}
                >
                    {logs.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Ionicons name="document-text-outline" size={50} color="#666" />
                            <Text style={styles.emptyText}>No logs yet</Text>
                            <Text style={styles.emptySubtext}>Tap "Test Inquiries API" to start logging</Text>
                        </View>
                    ) : (
                        logs.map((log) => (
                            <View key={log.id} style={styles.logItem}>
                                <View style={styles.logHeader}>
                                    <Ionicons
                                        name={getLogIcon(log.type)}
                                        size={16}
                                        color={getLogColor(log.type)}
                                    />
                                    <Text style={styles.logTimestamp}>{log.timestamp}</Text>
                                </View>
                                <Text style={[styles.logMessage, { color: getLogColor(log.type) }]}>
                                    {log.message}
                                </Text>
                            </View>
                        ))
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        paddingTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButtonText: {
        color: '#FFD700',
        fontSize: 16,
        marginLeft: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFD700',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    clearButton: {
        padding: 8,
    },
    buttonContainer: {
        padding: 20,
    },
    testButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFD700',
        padding: 15,
        borderRadius: 8,
        gap: 8,
    },
    disabledButton: {
        backgroundColor: '#666',
    },
    buttonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '600',
    },
    logsContainer: {
        flex: 1,
        margin: 20,
        backgroundColor: '#1a1a1a',
        borderRadius: 10,
        overflow: 'hidden',
    },
    logsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    logsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFD700',
    },
    logsCount: {
        fontSize: 14,
        color: '#666',
    },
    logsScrollView: {
        flex: 1,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyText: {
        color: '#666',
        fontSize: 18,
        marginTop: 10,
    },
    emptySubtext: {
        color: '#999',
        fontSize: 14,
        marginTop: 5,
        textAlign: 'center',
    },
    logItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    logHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    logTimestamp: {
        fontSize: 12,
        color: '#999',
        marginLeft: 8,
    },
    logMessage: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: 'monospace',
    },
});

export default LogsScreen; 