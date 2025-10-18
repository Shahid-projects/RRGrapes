import React from 'react';
import { SafeAreaView, ScrollView, View, Text, Image } from 'react-native';
import { styles } from '../constants/styles';
import Header from './components/Header';

export default function TrainingScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <Header title="Training" showBackButton />
            <ScrollView contentContainerStyle={styles.cardListContainer}>
                <View style={styles.card}>
                    <Image source={{uri: 'https://images.pexels.com/photos/708777/pexels-photo-708777.jpeg'}} style={styles.cardImage} />
                    <Text style={styles.cardTitle}>Training 1: Grape Growing 101</Text>
                </View>
                <View style={styles.card}>
                    <Image source={{uri: 'https://images.pexels.com/photos/5648069/pexels-photo-5648069.jpeg'}} style={styles.cardImage} />
                    <Text style={styles.cardTitle}>Training 2: Vineyard Management</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
