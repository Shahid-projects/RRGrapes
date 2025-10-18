import React from 'react';
import { SafeAreaView, ScrollView, View, Text, Image } from 'react-native';
import { styles } from '../constants/styles';
import Header from './components/Header';

export default function OtherScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <Header title="Other" showBackButton />
            <ScrollView contentContainerStyle={styles.cardListContainer}>
                <View style={styles.card}>
                    <Image source={{uri: 'https://images.pexels.com/photos/1435903/pexels-photo-1435903.jpeg'}} style={styles.cardImage} />
                    <Text style={styles.cardTitle}>Other 1: Farm Visit</Text>
                </View>
                <View style={styles.card}>
                    <Image source={{uri: 'https://images.pexels.com/photos/1327818/pexels-photo-1327818.jpeg'}} style={styles.cardImage} />
                    <Text style={styles.cardTitle}>Other 2: Nature Walk</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
