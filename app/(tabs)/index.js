import React from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, Image, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { styles, COLORS } from '../../constants/styles';
import { useAuth } from '../../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

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
                            <Ionicons name="log-out-outline" size={30} style={{marginLeft:55 , marginTop:5}}  color={styles.homeTitle.color} />
                        </TouchableOpacity>
                    )}
                </View>
            </LinearGradient>
        </View>
        <View style={styles.weatherWidget}>
          <Ionicons name="partly-sunny-outline" size={32} color="#FFC300" />
          <View style={styles.weatherInfo}>
            <Text style={styles.weatherLocation}>Sangli, 04 Aug</Text>
            <Text style={styles.weatherDetails}>Overcast Clouds - 29°C</Text>
          </View>
        </View>
        <View style={styles.homeButtonContainer}>
            <TouchableOpacity style={styles.homeButton} onPress={() => router.push('/about')}>
                <Text style={styles.homeButtonText}>About Us</Text>
            </TouchableOpacity>
            {user ? (
                // --- FIX: Change button to Plots Section and route to /plots ---
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
                <Image source={{uri: 'https://images.pexels.com/photos/1029997/pexels-photo-1029997.jpeg'}} style={styles.gridImage} />
                <Text style={styles.gridText}>Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.gridItem} onPress={() => router.push('/video')}>
                <Image source={{uri: 'https://images.pexels.com/photos/708777/pexels-photo-708777.jpeg'}} style={styles.gridImage} />
                <Text style={styles.gridText}>Video</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.testimonialCard}>
          <Text style={{fontSize: 30}}>🍇</Text>
          <Text style={styles.testimonialText}>"Best app I've used this year."</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
