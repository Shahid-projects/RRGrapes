import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
// Corrected import paths
import { styles, COLORS } from '../constants/styles';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
// *** Reverting to the original plan: using API_BASE_URL from constants and '/login' endpoint ***
import { API_BASE_URL } from '../constants/api';


export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Define the default fallback route (the target for successful login)
  const FALLBACK_ROUTE = '/(tabs)'; 

  const handleLogin = async () => {
    if (loading) return;

    if (!userId || !password) {
      Alert.alert('Error', 'User ID and Password are required.');
      return;
    }

    setLoading(true);

    try {
      // API call using the correct farmer-login path found in Postman.
      // NOTE: This assumes API_BASE_URL does not end in a slash.
      const response = await axios.post(`${API_BASE_URL}/api/farmer-login`, {
        username: userId,
        password: password,
      });

      // *** FIX: Prioritize checking the 'success' flag from the server response. ***
      if (response.status === 200 && response.data.success) {
        
        // Successful API Response
        const token = response.data.token || null;
        const user = { 
          username: response.data.username || userId, 
          farmerId: response.data.farmerId 
        };

        // If a token was expected but not returned, log a warning, but still proceed 
        // with navigation since the server explicitly said "Login successful".
        if (!token) {
          console.warn('Login successful, but JWT token was missing from the server response.');
        }

        // Store user info and token (token will be null if missing)
        login(user, token);
        
        // Navigate directly to the desired route (which is app/(tabs)/index.js)
        router.replace(FALLBACK_ROUTE); 

      } else {
        // Handle failure where status is 200 but success is explicitly false.
        // This handles cases like "Invalid credentials"
        const failMessage = response.data.message || 'Authentication failed. Please check your credentials.';
        Alert.alert('Login Failed', failMessage);
      }

    } catch (error) {
      // The catch block handles network errors or server responses outside the 2xx range
      const errorMessage = error.response?.data?.message || 'A network error occurred. Please try again.';
      Alert.alert('Login Failed', errorMessage);
      console.error('Login Failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.loginContainer}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, justifyContent: 'center', width: '100%' }}>
        <View style={styles.loginContent}>
          <View style={styles.loginLogoContainer}>
            <Image source={require('../assets/images/logo.jpeg')} style={styles.loginLogoImage} />
          </View>
          <Text style={styles.loginTitle}>Farmer Login</Text>
          <Text style={styles.loginSubtitle}>Access your schedules and updates</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.loginInput}
              placeholder="User ID"
              placeholderTextColor="rgba(255,255,255,0.7)"
              value={userId}
              onChangeText={setUserId}
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.loginInput}
              placeholder="Password"
              placeholderTextColor="rgba(255,255,255,0.7)"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
            {loading ? (
              <ActivityIndicator color={COLORS.PRIMARY_PURPLE} />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
