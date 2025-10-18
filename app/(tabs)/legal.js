import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import { styles, COLORS } from '../../constants/styles';
import { API_BASE_URL } from '../../constants/api';

// Configure apiClient with JWT interceptor
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('No JWT token found in storage');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const useAuth = () => ({ apiClient, user: { isAuthenticated: true } });

export default function LegalScreen() {
  const { apiClient } = useAuth();
  const [allNotices, setAllNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchAllNotices = async () => {
      if (!isMounted) return;
      const API_PATH = '/api/v1/auth/legal-notices/active';
      setLoading(true);
      try {
        console.log('Fetching legal notices from:', API_BASE_URL + API_PATH);
        const response = await apiClient.get(API_PATH);
        if (response.data && Array.isArray(response.data)) {
          console.log('Legal notices fetched successfully. Data length:', response.data.length);
          setAllNotices(response.data);
          setError(null);
        } else {
          console.warn('Server responded successfully but data was not an array or was empty.');
          setAllNotices([]);
          setError('No legal notices available.');
        }
      } catch (error) {
        console.error('Failed to fetch legal notices:', error);
        let errorMessage = 'Could not load legal notices. Please try again later.';
        if (error.response) {
          console.error('Server Response Status:', error.response.status);
          console.error('Server Response Data:', error.response.data);
          if (error.response.status === 400) {
            errorMessage = 'Invalid request. Please check your login status.';
          } else if (error.response.status === 401) {
            errorMessage = 'Authentication failed. Please log in again.';
            // navigation.navigate('Login'); // Uncomment if using navigation
          } else if (error.response.status === 404) {
            errorMessage = 'API endpoint not found. Please contact support.';
          }
        } else if (error.request) {
          errorMessage = 'No response from server. Check your network connection.';
        }
        setAllNotices([]);
        setError(errorMessage);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchAllNotices();
    return () => {
      isMounted = false;
    };
  }, [apiClient]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Legal Notice" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY_PURPLE} />
        </View>
      </SafeAreaView>
    );
  }

  if (selectedNotice) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title={selectedNotice.section} showBackButton={() => setSelectedNotice(null)} />
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <Text style={styles.legalBody}>{selectedNotice.information}</Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Legal Notice" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, color: COLORS.TEXT_DARK, fontWeight: 'bold', marginBottom: 10 }}>
            Error Loading Content
          </Text>
          <Text style={{ fontSize: 16, color: COLORS.TEXT_MEDIUM, textAlign: 'center' }}>
            {error}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Legal Notice" />
      <ScrollView>
        <View style={{ marginTop: 10 }}>
          {allNotices.map((notice) => (
            <TouchableOpacity
              key={notice.id}
              style={styles.listItem}
              onPress={() => setSelectedNotice(notice)}
            >
              <Text style={styles.listItemText}>{notice.section}</Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.TEXT_MEDIUM} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}