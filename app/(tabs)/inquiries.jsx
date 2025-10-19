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
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getInquiries, markInquiryAsRead, getUnreadCount, testNetworkConnectivity } from '../services/database';
import { API_BASE_URL } from '../config/api';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const InquiryItem = ({ item, onPress, isUnread }) => (
  <TouchableOpacity
    style={[
      styles.inquiryItem,
      isUnread && styles.unreadInquiryItem
    ]}
    onPress={() => onPress(item)}
  >
    <View style={styles.inquiryHeader}>
      <View style={styles.inquiryTitleContainer}>
        <Text style={styles.inquiryName}>{item.name}</Text>
        {isUnread && <View style={styles.unreadBadge} />}
      </View>
      <Ionicons name="chevron-forward" size={20} color="#FFD700" />
    </View>
    <Text style={styles.inquiryEmail}>{item.email}</Text>
    <Text style={styles.inquiryMobile}>{item.mobile}</Text>
    <Text style={styles.inquiryPreview} numberOfLines={2}>
      {item.message}
    </Text>
    {isUnread && (
      <View style={styles.unreadIndicator}>
        <Text style={styles.unreadText}>NEW</Text>
      </View>
    )}
  </TouchableOpacity>
);

const InquiryModal = ({ visible, inquiry, onClose, onMarkAsRead }) => (
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
          <Text style={styles.modalTitle}>Inquiry Details</Text>
        </View>

        <ScrollView style={styles.modalBody}>
          <View style={styles.detailSection}>
            <Text style={styles.detailLabel}>Name</Text>
            <Text style={styles.detailValue}>{inquiry?.name}</Text>
          </View>

          <View style={styles.detailSection}>
            <Text style={styles.detailLabel}>Email</Text>
            <Text style={styles.detailValue}>{inquiry?.email}</Text>
          </View>

          <View style={styles.detailSection}>
            <Text style={styles.detailLabel}>Mobile</Text>
            <Text style={styles.detailValue}>{inquiry?.mobile}</Text>
          </View>

          <View style={styles.detailSection}>
            <Text style={styles.detailLabel}>Message</Text>
            <Text style={styles.detailValue}>{inquiry?.message}</Text>
          </View>

          <View style={styles.detailSection}>
            <Text style={styles.detailLabel}>Timestamp</Text>
            <Text style={styles.detailValue}>
              {inquiry?.createdAt ? new Date(inquiry.createdAt).toLocaleString() : 'N/A'}
            </Text>
          </View>

          <View style={styles.detailSection}>
            <Text style={styles.detailLabel}>Status</Text>
            <Text style={styles.detailValue}>
              {inquiry?.isRead ? 'Read' : 'Unread'}
            </Text>
          </View>
        </ScrollView>
      </View>
    </View>
  </Modal>
);

const Inquiries = () => {
  const insets = useSafeAreaInsets();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState(null);

  // Local state for unread count
  const [unreadCount, setUnreadCount] = useState(0);

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

  useEffect(() => {
    fetchInquiries();
    fetchUnreadCount();
  }, []);

  // Force refresh when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchInquiries();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const count = await getUnreadCount();
      setUnreadCount(count);
    } catch (err) {
      console.error('Error fetching unread count:', err);
    }
  };

  const fetchInquiries = async () => {
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

      const data = await getInquiries();
      setInquiries(data);
      setLastFetchTime(new Date());
    } catch (err) {
      console.error('Error fetching inquiries:', err);

      // Provide more specific error messages
      let errorMessage = 'Failed to load inquiries. Please try again.';
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

  const handleInquiryPress = async (inquiry) => {
    setSelectedInquiry(inquiry);
    setModalVisible(true);

    // Mark as read if it's unread
    if (!inquiry.isRead) {
      try {
        await markInquiryAsRead(inquiry._id);

        // Update local state
        setInquiries(prevInquiries =>
          prevInquiries.map(item =>
            item._id === inquiry._id
              ? { ...item, isRead: true }
              : item
          )
        );

        // Update local unread count
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (err) {
        console.error('Error marking inquiry as read:', err);
      }
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedInquiry(null);
  };

  const getUnreadInquiries = () => {
    return inquiries.filter(inquiry => !inquiry.isRead);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchInquiries();
      await fetchUnreadCount();
    } finally {
      setRefreshing(false);
    }
  };

  const handleRefreshIconPress = async () => {
    setRefreshing(true);
    try {
      await fetchInquiries();
      await fetchUnreadCount();
    } finally {
      setRefreshing(false);
    }
  };

  if (loading && inquiries.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>Inquiries</Text>
              {unreadCount > 0 && (
                <View style={styles.headerBadge}>
                  <Text style={styles.headerBadgeText}>{unreadCount}</Text>
                </View>
              )}
            </View>
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
          <Text style={styles.loadingText}>Loading inquiries...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>Inquiries</Text>
              {unreadCount > 0 && (
                <View style={styles.headerBadge}>
                  <Text style={styles.headerBadgeText}>{unreadCount}</Text>
                </View>
              )}
            </View>
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
          <TouchableOpacity style={styles.retryButton} onPress={fetchInquiries}>
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
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Inquiries</Text>
            {unreadCount > 0 && (
              <View style={styles.headerBadge}>
                <Text style={styles.headerBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </View>
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
          {inquiries.length} total inquiries • {unreadCount} unread
        </Text>
        {lastFetchTime && (
          <Text style={styles.lastUpdateText}>
            Last updated: {formatLastUpdateTime(lastFetchTime)}
          </Text>
        )}
      </View>

      {inquiries.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="document-text-outline" size={50} color="#666" />
          <Text style={styles.emptyText}>No inquiries found</Text>
        </View>
      ) : (
        <FlatList
          data={inquiries}
          keyExtractor={(item) => item._id || item.id}
          renderItem={({ item }) => (
            <InquiryItem
              item={item}
              onPress={handleInquiryPress}
              isUnread={!item.isRead}
            />
          )}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}

      <InquiryModal
        visible={modalVisible}
        inquiry={selectedInquiry}
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
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 5,
  },
  headerBadge: {
    backgroundColor: '#FFD700',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginLeft: 10,
  },
  headerBadgeText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
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
  inquiryItem: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  unreadInquiryItem: {
    borderColor: '#FFD700',
    borderWidth: 2,
  },
  inquiryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  inquiryTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inquiryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  unreadBadge: {
    backgroundColor: '#FFD700',
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 8,
  },
  inquiryEmail: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 5,
  },
  inquiryMobile: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 10,
  },
  inquiryPreview: {
    fontSize: 14,
    color: '#999',
    lineHeight: 20,
  },
  unreadIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  unreadText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
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


});

export default Inquiries; 