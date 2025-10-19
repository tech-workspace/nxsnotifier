import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Modal,
    ScrollView,
    SafeAreaView,
    ActivityIndicator,
    Alert,
    Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getVisits, testNetworkConnectivity } from '../services/database';
import { API_BASE_URL } from '../config/api';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const VisitItem = ({ item, onPress }) => {
    // Helper function to format timestamp
    const formatTimestamp = (timestamp) => {
        if (!timestamp) return 'N/A';
        const date = new Date(timestamp);
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const dayName = days[date.getDay()];
        const monthName = months[date.getMonth()];
        const day = date.getDate();
        const year = date.getFullYear();

        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${dayName}, ${monthName} ${day}, ${year} at ${hours}:${minutes}:${seconds}`;
    };

    return (
        <TouchableOpacity
            style={styles.visitItem}
            onPress={() => onPress(item)}
        >
            <View style={styles.visitHeader}>
                <Ionicons name="globe-outline" size={24} color="#FFD700" />
                <Text style={styles.visitIP}>{item.deviceIPAddress || 'N/A'}</Text>
            </View>

            <View style={styles.visitInfo}>
                <View style={styles.infoRow}>
                    <Ionicons name="phone-portrait-outline" size={16} color="#999" />
                    <Text style={styles.visitDevice}>
                        {item.deviceName || item.device?.type || 'Unknown Device'}
                    </Text>
                </View>

                <View style={styles.infoRow}>
                    <Ionicons name="time-outline" size={16} color="#999" />
                    <Text style={styles.visitTimestamp}>
                        {formatTimestamp(item.timestamp)}
                    </Text>
                </View>
            </View>

            <View style={styles.visitFooter}>
                {item.deviceLocation?.country && (
                    <View style={styles.locationBadge}>
                        <Ionicons name="location-outline" size={12} color="#FFD700" />
                        <Text style={styles.locationText}>{item.deviceLocation.country}</Text>
                    </View>
                )}
                {item.device?.type && (
                    <View style={styles.deviceBadge}>
                        <Text style={styles.deviceTypeText}>{item.device.type}</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

const VisitModal = ({ visible, visit, onClose }) => {
    const formatTimestamp = (timestamp) => {
        if (!timestamp) return 'N/A';
        const date = new Date(timestamp);
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const dayName = days[date.getDay()];
        const monthName = months[date.getMonth()];
        const day = date.getDate();
        const year = date.getFullYear();

        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${dayName}, ${monthName} ${day}, ${year} at ${hours}:${minutes}:${seconds}`;
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity style={styles.backButton} onPress={onClose}>
                            <Ionicons name="arrow-back" size={24} color="#FFD700" />
                            <Text style={styles.backButtonText}>Back</Text>
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Visit Details</Text>
                    </View>

                    <ScrollView
                        style={styles.modalBody}
                        showsVerticalScrollIndicator={true}
                        nestedScrollEnabled={true}
                    >
                        <View style={styles.detailSection}>
                            <Text style={styles.detailLabel}>IP Address</Text>
                            <Text style={styles.detailValue}>{visit?.deviceIPAddress || 'N/A'}</Text>
                        </View>

                        <View style={styles.detailSection}>
                            <Text style={styles.detailLabel}>Device Name</Text>
                            <Text style={styles.detailValue}>{visit?.deviceName || 'N/A'}</Text>
                        </View>

                        <View style={styles.detailSection}>
                            <Text style={styles.detailLabel}>Timestamp</Text>
                            <Text style={styles.detailValue}>
                                {formatTimestamp(visit?.timestamp)}
                            </Text>
                        </View>

                        {visit?.device && (
                            <>
                                <View style={styles.detailSection}>
                                    <Text style={styles.detailLabel}>Device Type</Text>
                                    <Text style={styles.detailValue}>{visit.device.type || 'N/A'}</Text>
                                </View>

                                {visit.device.vendor && (
                                    <View style={styles.detailSection}>
                                        <Text style={styles.detailLabel}>Device Vendor</Text>
                                        <Text style={styles.detailValue}>{visit.device.vendor}</Text>
                                    </View>
                                )}

                                {visit.device.model && (
                                    <View style={styles.detailSection}>
                                        <Text style={styles.detailLabel}>Device Model</Text>
                                        <Text style={styles.detailValue}>{visit.device.model}</Text>
                                    </View>
                                )}
                            </>
                        )}

                        {visit?.browser && (
                            <>
                                <View style={styles.detailSection}>
                                    <Text style={styles.detailLabel}>Browser</Text>
                                    <Text style={styles.detailValue}>
                                        {visit.browser.name || 'N/A'} {visit.browser.version ? `v${visit.browser.version}` : ''}
                                    </Text>
                                </View>
                            </>
                        )}

                        {visit?.os && (
                            <>
                                <View style={styles.detailSection}>
                                    <Text style={styles.detailLabel}>Operating System</Text>
                                    <Text style={styles.detailValue}>
                                        {visit.os.name || 'N/A'} {visit.os.version ? `v${visit.os.version}` : ''}
                                    </Text>
                                </View>
                            </>
                        )}

                        {visit?.deviceLocation && (
                            <>
                                {visit.deviceLocation.country && (
                                    <View style={styles.detailSection}>
                                        <Text style={styles.detailLabel}>Country</Text>
                                        <Text style={styles.detailValue}>{visit.deviceLocation.country}</Text>
                                    </View>
                                )}

                                {visit.deviceLocation.city && (
                                    <View style={styles.detailSection}>
                                        <Text style={styles.detailLabel}>City</Text>
                                        <Text style={styles.detailValue}>{visit.deviceLocation.city}</Text>
                                    </View>
                                )}

                                {visit.deviceLocation.region && (
                                    <View style={styles.detailSection}>
                                        <Text style={styles.detailLabel}>Region</Text>
                                        <Text style={styles.detailValue}>{visit.deviceLocation.region}</Text>
                                    </View>
                                )}

                                {visit.deviceLocation.timezone && (
                                    <View style={styles.detailSection}>
                                        <Text style={styles.detailLabel}>Timezone</Text>
                                        <Text style={styles.detailValue}>{visit.deviceLocation.timezone}</Text>
                                    </View>
                                )}
                            </>
                        )}

                        {visit?.sourceSystemConst && (
                            <View style={styles.detailSection}>
                                <Text style={styles.detailLabel}>Source System</Text>
                                <Text style={styles.detailValue}>{visit.sourceSystemConst}</Text>
                            </View>
                        )}

                        {visit?.userAgent && (
                            <View style={styles.detailSection}>
                                <Text style={styles.detailLabel}>User Agent</Text>
                                <Text style={styles.detailValue}>{visit.userAgent}</Text>
                            </View>
                        )}

                        {visit?.referrer && (
                            <View style={styles.detailSection}>
                                <Text style={styles.detailLabel}>Referrer</Text>
                                <Text style={styles.detailValue}>{visit.referrer}</Text>
                            </View>
                        )}

                        {visit?.pageUrl && (
                            <View style={styles.detailSection}>
                                <Text style={styles.detailLabel}>Page URL</Text>
                                <Text style={styles.detailValue}>{visit.pageUrl}</Text>
                            </View>
                        )}

                        {visit?.sessionId && (
                            <View style={styles.detailSection}>
                                <Text style={styles.detailLabel}>Session ID</Text>
                                <Text style={styles.detailValue}>{visit.sessionId}</Text>
                            </View>
                        )}

                        {visit?.message && (
                            <View style={styles.detailSection}>
                                <Text style={styles.detailLabel}>Message</Text>
                                <Text style={styles.detailValue}>{visit.message}</Text>
                            </View>
                        )}

                        {visit?.metadata && Object.keys(visit.metadata).length > 0 && (
                            <View style={styles.detailSection}>
                                <Text style={styles.detailLabel}>Metadata</Text>
                                <View style={styles.metadataContainer}>
                                    {Object.entries(visit.metadata).map(([key, value]) => (
                                        <View key={key} style={styles.metadataRow}>
                                            <Text style={styles.metadataKey}>{key}:</Text>
                                            <Text style={styles.metadataValue}>
                                                {typeof value === 'object'
                                                    ? JSON.stringify(value, null, 2)
                                                    : String(value)}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const Visits = () => {
    const insets = useSafeAreaInsets();
    const [visits, setVisits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [selectedVisit, setSelectedVisit] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [lastFetchTime, setLastFetchTime] = useState(null);
    const [token, setToken] = useState(null);
    const [expandedGroups, setExpandedGroups] = useState({});

    // Helper function to format date with day name, full date, and 24-hour time
    const formatLastUpdateTime = (date) => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const dayName = days[date.getDay()];
        const monthName = months[date.getMonth()];
        const day = date.getDate();
        const year = date.getFullYear();

        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${dayName}, ${monthName} ${day}, ${year} at ${hours}:${minutes}:${seconds}`;
    };

    // Helper function to format date to day string
    const formatDayDate = (timestamp) => {
        if (!timestamp) return 'Unknown Date';
        const date = new Date(timestamp);
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const dayName = days[date.getDay()];
        const monthName = months[date.getMonth()];
        const day = date.getDate();
        const year = date.getFullYear();

        return `${dayName}, ${monthName} ${day}, ${year}`;
    };

    // Group visits by day date first, then by IP address
    const groupVisitsByDayAndIP = () => {
        const grouped = {};
        
        visits.forEach(visit => {
            const dayDate = formatDayDate(visit.timestamp);
            const ip = visit.deviceIPAddress || 'Unknown IP';
            
            if (!grouped[dayDate]) {
                grouped[dayDate] = {};
            }
            
            if (!grouped[dayDate][ip]) {
                grouped[dayDate][ip] = [];
            }
            
            grouped[dayDate][ip].push(visit);
        });
        
        return grouped;
    };

    // Toggle group expansion
    const toggleGroup = (groupKey) => {
        setExpandedGroups(prev => ({
            ...prev,
            [groupKey]: !prev[groupKey]
        }));
    };

    useEffect(() => {
        loadTokenAndFetchVisits();
    }, []);

    const loadTokenAndFetchVisits = async () => {
        try {
            // Get the authentication token from AsyncStorage
            const authToken = await AsyncStorage.getItem('userToken');

            if (!authToken) {
                setError('Authentication required. Please log in.');
                setLoading(false);
                Alert.alert('Authentication Required', 'Please log in to view visits.');
                router.replace('/auth/login');
                return;
            }

            setToken(authToken);
            await fetchVisits(authToken);
        } catch (err) {
            console.error('Error loading token:', err);
            setError('Failed to authenticate. Please log in again.');
            setLoading(false);
        }
    };

    const fetchVisits = async (authToken) => {
        try {
            setLoading(true);
            setError(null);

            // First test network connectivity
            const isConnected = await testNetworkConnectivity();

            if (!isConnected) {
                setError('Network connection issue. Please check your internet connection and try again.');
                Alert.alert('Network Error', 'Unable to connect to the server. Please check your internet connection and try again.');
                return;
            }

            const data = await getVisits(authToken || token, 1, 50); // Fetch more visits at once
            setVisits(data);
            setLastFetchTime(new Date());
        } catch (err) {
            console.error('Error fetching visits:', err);

            // Provide more specific error messages
            let errorMessage = 'Failed to load visits. Please try again.';

            // Check for authentication errors
            if (err.message.includes('401') || err.message.includes('Unauthorized') || err.message.includes('token')) {
                errorMessage = 'Session expired. Please log in again.';
                Alert.alert('Session Expired', 'Your session has expired. Please log in again.', [
                    { text: 'OK', onPress: () => router.replace('/auth/login') }
                ]);
                return;
            }

            if (err.message.includes('timeout')) {
                errorMessage = 'Request timed out. Please check your connection and try again.';
            } else if (err.message.includes('Network request failed')) {
                errorMessage = 'Network error. Please check your internet connection and try again.';
            } else if (err.message.includes('fetch')) {
                errorMessage = 'Connection error. Please check your internet connection and try again.';
            }

            setError(errorMessage);
            Alert.alert('Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleVisitPress = (visit) => {
        setSelectedVisit(visit);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedVisit(null);
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            await fetchVisits(token);
        } finally {
            setRefreshing(false);
        }
    };

    const handleRefreshIconPress = async () => {
        setRefreshing(true);
        try {
            await fetchVisits(token);
        } finally {
            setRefreshing(false);
        }
    };

    if (loading && visits.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.headerTopRow}>
                        <Text style={styles.headerTitle}>Visits</Text>
                        <TouchableOpacity
                            style={styles.refreshButton}
                            onPress={handleRefreshIconPress}
                            disabled={refreshing}
                        >
                            <Ionicons
                                name="refresh"
                                size={24}
                                color="#FFD700"
                                style={refreshing && styles.rotatingIcon}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#FFD700" />
                    <Text style={styles.loadingText}>Loading visits...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.headerTopRow}>
                        <Text style={styles.headerTitle}>Visits</Text>
                        <TouchableOpacity
                            style={styles.refreshButton}
                            onPress={handleRefreshIconPress}
                            disabled={refreshing}
                        >
                            <Ionicons
                                name="refresh"
                                size={24}
                                color="#FFD700"
                                style={refreshing && styles.rotatingIcon}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle" size={50} color="#ff6b6b" />
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={() => fetchVisits(token)}>
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { paddingBottom: insets.bottom + 100 }]}>
            <View style={styles.header}>
                <View style={styles.headerTopRow}>
                    <Text style={styles.headerTitle}>Visits</Text>
                    <TouchableOpacity
                        style={styles.refreshButton}
                        onPress={handleRefreshIconPress}
                        disabled={refreshing}
                    >
                        <Ionicons
                            name="refresh"
                            size={24}
                            color="#FFD700"
                            style={refreshing && styles.rotatingIcon}
                        />
                    </TouchableOpacity>
                </View>
                <Text style={styles.headerSubtitle}>
                    {visits.length} total visits
                </Text>
                {lastFetchTime && (
                    <Text style={styles.lastUpdateText}>
                        Last updated: {formatLastUpdateTime(lastFetchTime)}
                    </Text>
                )}
            </View>

            {visits.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="globe-outline" size={50} color="#666" />
                    <Text style={styles.emptyText}>No visits found</Text>
                </View>
            ) : (
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                >
                    {Object.entries(groupVisitsByDayAndIP()).map(([date, ipGroups]) => (
                        <View key={date} style={styles.dateGroup}>
                            {/* Date Header */}
                            <TouchableOpacity
                                style={styles.dateHeader}
                                onPress={() => toggleGroup(date)}
                            >
                                <View style={styles.dateHeaderLeft}>
                                    <Ionicons 
                                        name={expandedGroups[date] ? "chevron-down" : "chevron-forward"} 
                                        size={20} 
                                        color="#FFD700" 
                                    />
                                    <Ionicons name="calendar-outline" size={20} color="#FFD700" style={{ marginLeft: 8 }} />
                                    <Text style={styles.dateHeaderText}>{date}</Text>
                                </View>
                                <View style={styles.dateBadge}>
                                    <Text style={styles.dateBadgeText}>
                                        {Object.values(ipGroups).reduce((sum, visits) => sum + visits.length, 0)} visits
                                    </Text>
                                </View>
                            </TouchableOpacity>

                            {/* IP Groups - Show only if expanded */}
                            {expandedGroups[date] && Object.entries(ipGroups).map(([ip, ipVisits]) => (
                                <View key={`${date}-${ip}`} style={styles.ipGroup}>
                                    {/* IP Address Header */}
                                    <TouchableOpacity
                                        style={styles.ipHeader}
                                        onPress={() => toggleGroup(`${date}-${ip}`)}
                                    >
                                        <View style={styles.ipHeaderLeft}>
                                            <Ionicons 
                                                name={expandedGroups[`${date}-${ip}`] ? "chevron-down" : "chevron-forward"} 
                                                size={18} 
                                                color="#999" 
                                            />
                                            <Ionicons name="globe-outline" size={18} color="#999" style={{ marginLeft: 8 }} />
                                            <Text style={styles.ipHeaderText}>{ip}</Text>
                                        </View>
                                        <View style={styles.ipBadge}>
                                            <Text style={styles.ipBadgeText}>{ipVisits.length}</Text>
                                        </View>
                                    </TouchableOpacity>

                                    {/* Visit Items - Show only if expanded */}
                                    {expandedGroups[`${date}-${ip}`] && ipVisits.map((visit) => (
                                        <VisitItem
                                            key={visit._id || visit.id}
                                            item={visit}
                                            onPress={handleVisitPress}
                                        />
                                    ))}
                                </View>
                            ))}
                        </View>
                    ))}
                </ScrollView>
            )}

            <VisitModal
                visible={modalVisible}
                visit={selectedVisit}
                onClose={closeModal}
            />
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
    headerTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFD700',
        marginBottom: 5,
    },
    refreshButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#1a1a1a',
        borderWidth: 1,
        borderColor: '#333',
    },
    rotatingIcon: {
        transform: [{ rotate: '360deg' }],
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#666',
    },
    lastUpdateText: {
        fontSize: 12,
        color: '#999',
        marginTop: 5,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#FFD700',
        fontSize: 16,
        marginTop: 10,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: '#ff6b6b',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: '#FFD700',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '600',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: '#666',
        fontSize: 16,
        marginTop: 10,
    },
    listContainer: {
        padding: 20,
    },
    visitItem: {
        backgroundColor: '#1a1a1a',
        padding: 15,
        borderRadius: 8,
        marginBottom: 8,
        marginLeft: 15,
        borderWidth: 1,
        borderColor: '#333',
    },
    visitHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    visitIP: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFD700',
        marginLeft: 10,
    },
    visitInfo: {
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    visitDevice: {
        fontSize: 14,
        color: '#fff',
        marginLeft: 8,
        textTransform: 'capitalize',
    },
    visitTimestamp: {
        fontSize: 12,
        color: '#999',
        marginLeft: 8,
    },
    visitFooter: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    locationBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1a3a1a',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
    },
    locationText: {
        color: '#FFD700',
        fontSize: 12,
        marginLeft: 4,
    },
    deviceBadge: {
        backgroundColor: '#2a2a3a',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
    },
    deviceTypeText: {
        color: '#99ccff',
        fontSize: 12,
        textTransform: 'capitalize',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#1a1a1a',
        borderRadius: 15,
        width: '90%',
        maxHeight: '80%',
        borderWidth: 1,
        borderColor: '#FFD700',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
    },
    backButtonText: {
        color: '#FFD700',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFD700',
    },
    modalBody: {
        padding: 20,
        maxHeight: 500,
    },
    detailSection: {
        marginBottom: 20,
    },
    detailLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFD700',
        marginBottom: 5,
    },
    detailValue: {
        fontSize: 16,
        color: '#fff',
        lineHeight: 24,
    },
    metadataContainer: {
        backgroundColor: '#0a0a0a',
        borderRadius: 8,
        padding: 12,
        borderWidth: 1,
        borderColor: '#333',
    },
    metadataRow: {
        marginBottom: 10,
    },
    metadataKey: {
        fontSize: 14,
        fontWeight: '600',
        color: '#999',
        marginBottom: 4,
    },
    metadataValue: {
        fontSize: 14,
        color: '#fff',
        lineHeight: 20,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },
    scrollView: {
        flex: 1,
    },
    dateGroup: {
        marginBottom: 15,
    },
    dateHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
        padding: 15,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#FFD700',
        marginBottom: 5,
    },
    dateHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    dateHeaderText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFD700',
        marginLeft: 8,
    },
    dateBadge: {
        backgroundColor: '#FFD700',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
    },
    dateBadgeText: {
        color: '#000',
        fontSize: 12,
        fontWeight: 'bold',
    },
    ipGroup: {
        marginLeft: 20,
        marginBottom: 5,
    },
    ipHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#0a0a0a',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#333',
        marginBottom: 5,
    },
    ipHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    ipHeaderText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#999',
        marginLeft: 8,
    },
    ipBadge: {
        backgroundColor: '#333',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
    },
    ipBadgeText: {
        color: '#FFD700',
        fontSize: 11,
        fontWeight: 'bold',
    },
});

export default Visits;

