import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useState } from 'react';
import { Alert, Linking, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Header from '../components/Header';
import { styles, COLORS } from '../../constants/styles';
import { API_BASE_URL } from '../../constants/api';

// --- MOCK AUTH CONTEXT FOR DEMONSTRATION ---
// Using the same mock as in legal.js for consistent token management
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    // Note: A real apiClient would have an interceptor here to attach the JWT.
});
const useAuth = () => ({ apiClient, user: { isAuthenticated: true } }); 
// ---------------------------------------------


export default function ContactScreen() {
    const { apiClient } = useAuth(); // Use the authenticated client
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSendMessage = async () => {
        if (isSubmitting) return;

        if (!name.trim() || !email.trim() || !mobile.trim() || !message.trim()) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        setIsSubmitting(true);
        const contactData = { name, email, mobile, message };
        const API_PATH = `/api/v1/auth/enquiries`;

        try {
            // Convert contactData object into URL query string for GET request
            const queryString = new URLSearchParams(contactData).toString();
            const fullPath = `${API_PATH}?${queryString}`;
            
            console.log("Sending GET request to:", fullPath);
            
            // --- CRITICAL CHANGE: Changed to GET request and passing data via params ---
            const response = await apiClient.get(API_PATH, { params: contactData });
            
            console.log("Message sent successfully. Response:", response.data);
            Alert.alert('Success', response.data.message || 'Your message has been sent!');
            
            // Clear form on success
            setName('');
            setEmail('');
            setMobile('');
            setMessage('');
            
        } catch (error) {
            // Log the full error details to help debug the 405 status
            console.error("Failed to send message:", error);
            if (error.response) {
                console.error("Server Response Status:", error.response.status);
                console.error("Server Response Data:", error.response.data);
            }
            
            const errorMessage = error.response?.data?.message || `Request rejected (Status: ${error.response?.status || 'Network Error'}).`;
            Alert.alert('Error', errorMessage);
            
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Contact & Social" />
            <ScrollView>
                <Text style={styles.sectionTitle}>Social Media</Text>
                <TouchableOpacity style={styles.listItem} onPress={() => Linking.openURL('https://facebook.com')}>
                    <Ionicons name="logo-facebook" size={24} color="#3b5998" />
                    <Text style={styles.listItemText}>Facebook</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.listItem} onPress={() => Linking.openURL('https://twitter.com')}>
                    <Ionicons name="logo-twitter" size={24} color="#1da1f2" />
                    <Text style={styles.listItemText}>Twitter</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.listItem} onPress={() => Linking.openURL('https://youtube.com')}>
                    <Ionicons name="logo-youtube" size={24} color="#ff0000" />
                    <Text style={styles.listItemText}>YouTube</Text>
                </TouchableOpacity>

                <Text style={styles.sectionTitle}>Contact Us</Text>
                <TouchableOpacity style={styles.listItem} onPress={() => Linking.openURL('mailto:contact@rrgrapes.com')}>
                    <Ionicons name="mail-outline" size={24} color={COLORS.PRIMARY_PURPLE} />
                    <Text style={styles.listItemText}>Send us an email</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.listItem} onPress={() => Linking.openURL('https://rrgrapes.com')}>
                    <Ionicons name="globe-outline" size={24} color={COLORS.PRIMARY_PURPLE} />
                    <Text style={styles.listItemText}>Visit our website</Text>
                </TouchableOpacity>

                <View style={styles.enquiryForm}>
                    <Text style={styles.sectionTitle}>Enquiry Form</Text>
                    <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
                    <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" value={email} onChangeText={setEmail} autoCapitalize="none" />
                    <TextInput style={styles.input} placeholder="Mobile No" keyboardType="phone-pad" value={mobile} onChangeText={setMobile} />
                    <TextInput style={[styles.input, { height: 120, textAlignVertical: 'top' }]} placeholder="Message" multiline value={message} onChangeText={setMessage} />
                    <TouchableOpacity style={styles.submitButton} onPress={handleSendMessage} disabled={isSubmitting}>
                        <Text style={styles.submitButtonText}>{isSubmitting ? 'Sending...' : 'Send Message'}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
