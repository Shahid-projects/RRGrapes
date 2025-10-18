import axios from 'axios';
import { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, View, Alert } from 'react-native';
import { API_BASE_URL } from '../constants/api';

export default function AboutScreen() {
    const [aboutUsData, setAboutUsData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAboutUsData = async () => {
            try {
                // --- FIX: Corrected API path spelling from 'aboutuus' to 'aboutus' to resolve the 400 error ---
                const response = await axios.get(`${API_BASE_URL}/api/v1/auth/aboutus`);
                if (response.data) {
                    setAboutUsData(response.data);
                } else {
                    setError('No information has been provided yet.');
                }
            } catch (err) {
                console.error("Failed to fetch About Us data:", err);
                // We keep the original error message for consistency
                setError('We couldn\'t load our story right now. Please check your connection and try again.');
                Alert.alert("Error", "Could not load 'About Us' information.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAboutUsData();
    }, []);

    if (isLoading) {
        return (
            <SafeAreaView style={[localStyles.container, localStyles.centered]}>
                <ActivityIndicator size="large" color="#007BFF" />
                <Text style={localStyles.statusText}>Loading Our Story...</Text>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={[localStyles.container, localStyles.centered]}>
                <Text style={localStyles.errorText}>{error}</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={localStyles.container}>
            <ScrollView contentContainerStyle={localStyles.scrollContent}>
                <View style={localStyles.headerContainer}>
                    <Text style={localStyles.headerText}>Our Story</Text>
                </View>
                
                {aboutUsData ? (
                    <Text style={localStyles.bodyText}>
                        {aboutUsData.information}
                    </Text>
                ) : (
                    <Text style={localStyles.bodyText}>
                        Content is currently unavailable.
                    </Text>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const localStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    scrollContent: {
        padding: 20,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    headerContainer: {
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#DEE2E6',
        paddingBottom: 16,
    },
    headerText: {
        fontSize: 38,
        fontWeight: 'bold',
        color: '#212529',
    },
    bodyText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#495057',
    },
    statusText: {
        marginTop: 10,
        fontSize: 16,
        color: '#495057',
    },
    errorText: {
        fontSize: 16,
        color: '#D9534F',
        textAlign: 'center',
    }
});
