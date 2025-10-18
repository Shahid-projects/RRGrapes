import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, Image } from 'react-native';
import { styles } from '../../constants/styles';
import Header from '../components/Header';

export default function CommunityScreen() {
    const [activeTab, setActiveTab] = useState('Events');

    const renderContent = () => {
        if (activeTab === 'Events') {
            return (
                <View>
                    <View style={styles.card}>
                        <Image source={{uri: 'https://images.pexels.com/photos/2284169/pexels-photo-2284169.jpeg'}} style={styles.cardImage} />
                        <Text style={styles.cardTitle}>Event 1: Grape Harvest Festival</Text>
                    </View>
                    <View style={styles.card}>
                        <Image source={{uri: 'https://images.pexels.com/photos/1029997/pexels-photo-1029997.jpeg'}} style={styles.cardImage} />
                        <Text style={styles.cardTitle}>Event 2: Vineyard Tour</Text>
                    </View>
                </View>
            );
        }
        if (activeTab === 'Training') {
            return (
                <View>
                    <View style={styles.card}>
                        <Image source={{uri: 'https://images.pexels.com/photos/708777/pexels-photo-708777.jpeg'}} style={styles.cardImage} />
                        <Text style={styles.cardTitle}>Training 1: Grape Growing 101</Text>
                    </View>
                    <View style={styles.card}>
                        <Image source={{uri: 'https://images.pexels.com/photos/5648069/pexels-photo-5648069.jpeg'}} style={styles.cardImage} />
                        <Text style={styles.cardTitle}>Training 2: Vineyard Management</Text>
                    </View>
                </View>
            );
        }
        if (activeTab === 'Other') {
            return (
                <View>
                    <View style={styles.card}>
                        <Image source={{uri: 'https://images.pexels.com/photos/1435903/pexels-photo-1435903.jpeg'}} style={styles.cardImage} />
                        <Text style={styles.cardTitle}>Other 1: Farm Visit</Text>
                    </View>
                    <View style={styles.card}>
                        <Image source={{uri: 'https://images.pexels.com/photos/1327818/pexels-photo-1327818.jpeg'}} style={styles.cardImage} />
                        <Text style={styles.cardTitle}>Other 2: Nature Walk</Text>
                    </View>
                </View>
            );
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Community" />
            <View style={styles.topTabs}>
                <TouchableOpacity 
                    style={[styles.topTab, activeTab === 'Events' && styles.topTabActive]} 
                    onPress={() => setActiveTab('Events')}>
                    <Text style={activeTab === 'Events' ? styles.topTabTextActive : styles.topTabText}>Events</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.topTab, activeTab === 'Training' && styles.topTabActive]} 
                    onPress={() => setActiveTab('Training')}>
                    <Text style={activeTab === 'Training' ? styles.topTabTextActive : styles.topTabText}>Training</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.topTab, activeTab === 'Other' && styles.topTabActive]} 
                    onPress={() => setActiveTab('Other')}>
                    <Text style={activeTab === 'Other' ? styles.topTabTextActive : styles.topTabText}>Other</Text>
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.cardListContainer}>
                {renderContent()}
            </ScrollView>
        </SafeAreaView>
    );
}
