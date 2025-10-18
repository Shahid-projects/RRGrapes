import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { styles } from '../../constants/styles';

const Header = ({ title, showBackButton }) => {
  const router = useRouter();
  return (
    <View style={styles.header}>
      {showBackButton && (
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={styles.headerTitle.color} />
        </TouchableOpacity>
      )}
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
};

export default Header;