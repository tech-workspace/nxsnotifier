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
import { getInquiries } from '../services/database';

const InquiryItem = ({ item, onPress }) => (
  <TouchableOpacity style={styles.inquiryItem} onPress={() => onPress(item)}>
    <View style={styles.inquiryHeader}>
      <Text style={styles.inquiryName}>{item.fullName}</Text>
      <Ionicons name="chevron-forward" size={20} color="#FFD700" />
    </View>
    <Text style={styles.inquiryEmail}>{item.email}</Text>
    <Text style={styles.inquiryMobile}>{item.mobile}</Text>
    <Text style={styles.inquiryPreview} numberOfLines={2}>
      {item.message}
    </Text>
  </TouchableOpacity>
);

const InquiryModal = ({ visible, inquiry, onClose }) => (
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
            <Text style={styles.detailLabel}>Full Name</Text>
            <Text style={styles.detailValue}>{inquiry?.fullName}</Text>
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
        </ScrollView>
      </View>
    </View>
  </Modal>
);

const Inquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 Starting to fetch inquiries...');
      const data = await getInquiries();
      console.log('✅ Fetched inquiries successfully:', data);
      console.log('📊 Number of inquiries:', data.length);
      setInquiries(data);
    } catch (err) {
      console.error('❌ Error fetching inquiries:', err);
      setError('Failed to load inquiries. Please try again.');
      Alert.alert('Error', 'Failed to load inquiries. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInquiryPress = (inquiry) => {
    setSelectedInquiry(inquiry);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedInquiry(null);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Inquiries</Text>
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
          <Text style={styles.headerTitle}>Inquiries</Text>
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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Inquiries</Text>
        <Text style={styles.headerSubtitle}>{inquiries.length} total inquiries</Text>
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
            <InquiryItem item={item} onPress={handleInquiryPress} />
          )}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={fetchInquiries}
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
  inquiryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  inquiryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
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