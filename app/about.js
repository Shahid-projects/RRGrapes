import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, View, Alert, useWindowDimensions } from 'react-native';
import { API_BASE_URL } from '../constants/api';
// 🔥 Import the HTML renderer
import RenderHtml from 'react-native-render-html'; 

export default function AboutScreen() {
    const { width } = useWindowDimensions(); // Hook needed for RenderHtml
    const [aboutUsData, setAboutUsData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAboutUsData = async () => {
            try {
                // Using the unauthenticated endpoint: /aboutuus
                const API_PATH = '/api/v1/auth/aboutuus'; 
                const response = await axios.get(`${API_BASE_URL}${API_PATH}`);
                
                if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                    setAboutUsData(response.data[0]); 
                } else {
                    setError('No public "About Us" information has been provided yet.');
                }
            } catch (err) {
                console.error("Failed to fetch About Us data:", err);
                let errorMessage = 'We couldn\'t load our story right now. Please check your connection and try again.';
                setError(errorMessage);
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

    // Define styles for HTML tags (optional, but good practice for consistency)
    const renderersProps = {
        p: {
            style: localStyles.bodyText // Apply your existing bodyText style to <p> tags
        }
    };
    
    // Create the source object for the renderer
    const htmlSource = {
        html: aboutUsData ? aboutUsData.information : 'Content is currently unavailable.'
    };
    
    return (
        <SafeAreaView style={localStyles.container}>
            <ScrollView contentContainerStyle={localStyles.scrollContent}>
                <View style={localStyles.headerContainer}>
                    {/* Header component is assumed to be handled by another component/navigation system */}
                    <Text style={localStyles.headerText}>About Us</Text>
                </View>
                
                {/* 🔥 Use RenderHtml to display the content */}
                <RenderHtml
                    contentWidth={width - 40} // Screen width minus horizontal padding (20 on each side)
                    source={htmlSource}
                    tagsStyles={{ p: localStyles.bodyText }} // Apply styles to specific tags
                />

            </ScrollView>
        </SafeAreaView>
    );
}

const localStyles = StyleSheet.create({
    // ... (Your existing styles remain here) ...
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
        // Assuming your 'About Us' title in the image is part of navigation, 
        // I'll keep the existing styles for the 'Our Story' text for now.
        // If 'About Us' is the only title, remove the border and adjust margin.
        borderBottomWidth: 1, 
        borderBottomColor: '#DEE2E6',
        paddingBottom: 16,
    },
    headerText: {
        fontSize: 30, // Adjusted to look more like the screenshot's secondary title
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