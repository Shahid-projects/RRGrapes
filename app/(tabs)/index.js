import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, Image, StatusBar, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { styles, COLORS } from '../../constants/styles';
import { useAuth } from '../../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';

// --- ⚡️ WEATHER CONFIGURATION ⚡️ ---
// Use your actual key here. This key will be used for the API request.
const ACTUAL_API_KEY = '37762ec298a783d3981f6247bb4ef522'; 
const CITY_NAME = 'Sangli';
const COUNTRY_CODE = 'IN'; 
const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${CITY_NAME},${COUNTRY_CODE}&appid=${ACTUAL_API_KEY}&units=metric`;
// ------------------------------------

// Utility to capitalize the first letter of each word
const capitalize = (s) => {
    if (!s) return '';
    return s.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

// Utility to get the correct weather icon name from Ionicons
const getWeatherIcon = (iconCode) => {
    switch (iconCode) {
        case '01d': // clear sky (day)
        case '01n': // clear sky (night)
            return 'sunny-outline';
        case '02d': // few clouds (day)
        case '03d': // scattered clouds (day)
            return 'partly-sunny-outline';
        case '04d': // broken clouds (day)
        case '04n': // broken clouds (night)
            return 'cloudy-outline';
        case '09d': // shower rain (day)
        case '10d': // rain (day)
        case '10n': // rain (night)
            return 'rainy-outline';
        case '11d': // thunderstorm
            return 'thunderstorm-outline';
        case '13d': // snow
            return 'snow-outline';
        case '50d': // mist
            return 'filter-outline';
        default:
            return 'partly-sunny-outline';
    }
};

export default function HomeScreen() {
    const router = useRouter();
    const { user, logout } = useAuth();
    const [weatherData, setWeatherData] = useState(null);
    const [weatherLoading, setWeatherLoading] = useState(true);
    const [weatherError, setWeatherError] = useState(null);

    // Fetch Weather Data
    useEffect(() => {
        const fetchWeather = async () => {
            // Check if the key is the general placeholder text before making the call
            // NOTE: I've removed the redundant check using an actual key, 
            // as using a key for the API_KEY constant and then checking against 
            // a different key is confusing and unnecessary.
            
            try {
                const response = await axios.get(WEATHER_API_URL);
                setWeatherData(response.data);
                setWeatherError(null);
            } catch (error) {
                // OpenWeatherMap 401 Unauthorized errors are common if the key is wrong or not yet active.
                if (error.response && error.response.status === 401) {
                    setWeatherError("API Key Invalid/Inactive. Check OpenWeatherMap account.");
                } else {
                    console.error("Failed to fetch weather:", error);
                    setWeatherError("Failed to load weather data.");
                }
            } finally {
                setWeatherLoading(false);
            }
        };

        fetchWeather();
    }, []); // Dependency array is empty, so it runs once on mount.

    // Format the date for display
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    // Conditional rendering for the weather content
    const renderWeatherContent = () => {
        if (weatherLoading) {
            return <ActivityIndicator size="small" color="#fff" style={{ paddingHorizontal: 15 }} />;
        }

        if (weatherError) {
            return <Text style={styles.weatherDetails}>⚠️ {weatherError}</Text>;
        }

        if (weatherData) {
            const temp = Math.round(weatherData.main.temp);
            const description = capitalize(weatherData.weather[0].description);
            const location = `${weatherData.name}, ${formattedDate}`;
            const iconName = getWeatherIcon(weatherData.weather[0].icon);

            return (
                <>
                    <Ionicons name={iconName} size={32} color="#FFC300" />
                    <View style={styles.weatherInfo}>
                        <Text style={styles.weatherLocation}>{location}</Text>
                        <Text style={styles.weatherDetails}>{description} - {temp}°C</Text>
                    </View>
                </>
            );
        }

        // Fallback to static data if everything fails (optional)
        return (
            <>
                <Ionicons name="partly-sunny-outline" size={32} color="#FFC300" />
                <View style={styles.weatherInfo}>
                    <Text style={styles.weatherLocation}>Sangli, {formattedDate}</Text>
                    <Text style={styles.weatherDetails}>Static Data - 29°C</Text>
                </View>
            </>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <ScrollView>
                <View style={styles.homeHeaderContainer}>
                    <LinearGradient
                        colors={['#a08fb4ff', '#1a053dff']}
                        style={styles.homeHeaderGradient}
                    >
                        <View style={styles.homeHeaderContent}>
                            <View style={styles.homeHeaderTitleWrapper}>
                                <Image source={require('../../assets/images/logo.jpeg')} style={styles.homeHeaderLogo} />
                                <Text style={styles.homeTitle}>RR Grapes</Text>
                            </View>
                            {user && (
                                <TouchableOpacity onPress={logout}>
                                    <Ionicons name="log-out-outline" size={30} style={{ marginLeft: 55, marginTop: 5 }} color={styles.homeTitle.color} />
                                </TouchableOpacity>
                            )}
                        </View>
                    </LinearGradient>
                </View>

                {/* --- ⚡️ DYNAMIC WEATHER WIDGET ⚡️ --- */}
                <View style={styles.weatherWidget}>
                    {renderWeatherContent()}
                </View>
                {/* ------------------------------------- */}

                <View style={styles.homeButtonContainer}>
                    <TouchableOpacity style={styles.homeButton} onPress={() => router.push('/about')}>
                        <Text style={styles.homeButtonText}>About Us</Text>
                    </TouchableOpacity>
                    {user ? (
                        <TouchableOpacity style={styles.homeButton} onPress={() => router.push('/plots')}>
                            <Text style={styles.homeButtonText}>Plots Section</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={styles.homeButton} onPress={() => router.push('/login')}>
                            <Text style={styles.homeButtonText}>Login</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <Text style={styles.sectionTitle}>Our Varieties</Text>
                <View style={styles.homeGrid}>
                    <TouchableOpacity style={styles.gridItem} onPress={() => router.push('/gallery')}>
                        <Image source={{ uri: 'https://images.pexels.com/photos/1029997/pexels-photo-1029997.jpeg' }} style={styles.gridImage} />
                        <Text style={styles.gridText}>Gallery</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.gridItem} onPress={() => router.push('/video')}>
                        <Image source={{ uri: 'https://images.pexels.com/photos/708777/pexels-photo-708777.jpeg' }} style={styles.gridImage} />
                        <Text style={styles.gridText}>Video</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.testimonialCard}>
                    <Text style={{ fontSize: 30 }}>🍇</Text>
                    <Text style={styles.testimonialText}>"Best app I've used this year."</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}