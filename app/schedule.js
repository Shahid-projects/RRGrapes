// --- UPDATED ---
// Implemented safer date parsing for pruningDate to ensure accurate startDay calculation, 
// which should resolve the server's confusing 400 Bad Request error.

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import {
    Animated,
    FlatList,
    Modal,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
    Alert
} from 'react-native';
import Header from './components/Header';
import { COLORS, styles } from '../constants/styles';
import { useAuth } from '../context/AuthContext';

// Helper function to remove HTML tags from instructions
const cleanInstructions = (htmlString) => {
    if (!htmlString || typeof htmlString !== 'string') return '';
    let cleanedText = htmlString.replace(/<[^>]*>/g, '').trim();
    return cleanedText.replace(/&nbsp;/g, ' ').replace(/\r\n/g, '\n').replace(/\n\s*\n/g, '\n\n').trim();
};

// Day List Item Component
const DayListItem = ({ item, onPress }) => (
  <TouchableOpacity style={styles.itemContainer} onPress={onPress} activeOpacity={0.8}>
    <View style={styles.itemIcon}>
      <MaterialCommunityIcons name="calendar-check" size={28} color={COLORS.WHITE} />
    </View>
    <View style={styles.itemTextContainer}>
      <Text style={styles.itemTitle}>दिवस {item.day}</Text>
      <Text style={styles.itemDescription}>
        {new Date(item.scheduledDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
      </Text>
    </View>
    <MaterialCommunityIcons name="chevron-right" size={28} color={COLORS.TEXT_MEDIUM} />
  </TouchableOpacity>
);

// Main Screen Component
const ScheduleScreen = () => {
  const { user, apiClient } = useAuth();
  const params = useLocalSearchParams();
  // Ensure pruningDate is correctly destructured
  const { plotId, plotName, pruningDate } = params; 
  
  const [dailySchedules, setDailySchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  const handleDayPress = (item) => {
    setSelectedDay(item);
  };

  /**
   * Calculates the difference in days between the pruning date and today.
   * Uses YYYY-MM-DD parsing to avoid timezone errors.
   */
  const calculateStartDay = (pruningDateStr) => {
    if (!pruningDateStr) return 1;

    try {
        // Explicitly parse YYYY-MM-DD format as UTC midnight to avoid local timezone offset
        const parts = pruningDateStr.split('-');
        const pruning = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
        
        const today = new Date();
        // Create today's UTC date at midnight for comparison
        const todayUtc = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
        
        // Calculate difference in milliseconds
        const diffTime = todayUtc.getTime() - pruning.getTime();
        // Convert to days
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // The API day should start from 1. If today is before or on pruning day, start at day 1.
        return Math.max(1, diffDays + 1); 

    } catch (e) {
        console.error("Error calculating start day:", e);
        return 1;
    }
  };

  const fetchSchedules = async () => {
    const farmerIdStr = user?.farmerId?.toString();
    const plotIdStr = plotId?.toString();
    
    // Calculate dynamic startDay based on the pruning date
    const startDay = calculateStartDay(pruningDate); 
    const endDay = startDay + 180; // Fetch 6 months (180 days) worth of schedule from the start day
    
    // Base API Path
    const API_PATH = `/android/combinedAndroidReport`;

    if (!farmerIdStr || !plotIdStr) {
        setError("Missing plot or farmer information. Please select a plot.");
        setIsLoading(false);
        return;
    }

    setIsLoading(true);
    setError(null);
    
    // Construct the full GET URL with all parameters
    const API_URL = `${API_PATH}?farmerId=${farmerIdStr}&plotId=${plotIdStr}&startDay=${startDay}&endDay=${endDay}`;

    try {
      console.log(`Sending GET request to: ${API_URL}`);
      
      const response = await apiClient.get(API_URL);
      
      const combinedSchedule = response.data.combinedSchedule || {};
      
      // Transform the object structure into a flat array of schedule days
      const schedulesArray = Object.keys(combinedSchedule).map(dayKey => {
          const items = combinedSchedule[dayKey];
          const scheduledDate = items[0]?.scheduledDate; 
          
          return {
              day: parseInt(dayKey),
              scheduledDate: scheduledDate,
              sprays: items.filter(i => i.sprayManagementId !== undefined), 
              fertilizers: items.filter(i => i.fertilizerManagementId !== undefined),
              notes: [] 
          };
      });

      const sortedSchedules = schedulesArray.sort((a, b) => a.day - b.day);
      setDailySchedules(sortedSchedules);

    } catch (err) {
        console.error("API call failed:", err.response?.status, err.response?.data);
        
        let errorMessage = 'Could not fetch schedules. Please check your network or try logging in again.';
        if (err.response?.data?.message) {
             errorMessage = `Server Message: ${err.response.data.message}`;
        } else if (err.response?.status) {
             errorMessage = `Server Error: ${err.response.status} - ${err.response.statusText}`;
        }

        setError(errorMessage);
        Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [user?.farmerId, plotId, pruningDate]); // Rerun if any dependency changes

  const renderContent = () => {
    
    if (isLoading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 50 }}>
            <ActivityIndicator size="large" color={COLORS.PRIMARY_PURPLE} />
            <Text style={{marginTop: 10}}>Loading Schedules...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.infoContainer}>
            <MaterialCommunityIcons name="wifi-off" size={60} color={COLORS.TEXT_MEDIUM} />
            <Text style={styles.infoText}>{error}</Text>
            <TouchableOpacity style={styles.button} onPress={fetchSchedules}>
                <Text style={styles.buttonText}>Try Again</Text>
            </TouchableOpacity>
        </View>
      );
    }

    if (dailySchedules.length === 0) {
        return (
            <View style={styles.infoContainer}>
                <MaterialCommunityIcons name="calendar-search" size={60} color={COLORS.TEXT_MEDIUM} />
                <Text style={styles.infoText}>No schedules found for this plot.</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={dailySchedules}
            keyExtractor={(item) => item.day.toString()}
            renderItem={({ item }) => (
                <DayListItem item={item} onPress={() => handleDayPress(item)} />
            )}
            contentContainerStyle={{paddingTop: 12, paddingBottom: 24}}
        />
    );
  };

  const formattedPruningDate = pruningDate 
    ? new Date(pruningDate).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: '2-digit' })
    : 'N/A';
    
  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="शेतकरी वेळापत्रक" showBackButton={true} />
      <View style={styles.container}>
        <View style={{ paddingHorizontal: 20, paddingVertical: 10, backgroundColor: COLORS.WHITE, borderBottomWidth: 1, borderBottomColor: COLORS.BORDER_COLOR }}>
            <Text style={{ fontSize: 20, color: COLORS.TEXT_DARK, fontWeight: 'bold' }}>
                Plot: {plotName || plotId}
            </Text>
            <Text style={{ fontSize: 14, color: COLORS.TEXT_MEDIUM }}>
                Pruning Date: {formattedPruningDate}
            </Text>
        </View>
        {renderContent()}
      </View>

      {selectedDay && (
        <Modal
            animationType="slide"
            transparent={true}
            visible={selectedDay !== null}
            onRequestClose={() => setSelectedDay(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedDay(null)}>
                    <MaterialCommunityIcons name="close" size={24} color={COLORS.TEXT_MEDIUM} />
                </TouchableOpacity>

                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>दिवस - {selectedDay.day}</Text>
                    <View style={styles.modalDateContainer}>
                        <Text style={styles.modalDay}>
                            Scheduled Date:
                        </Text>
                        <Text style={styles.modalDate}>
                            {new Date(selectedDay.scheduledDate).toLocaleDateString('en-GB')}
                        </Text>
                    </View>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    {selectedDay.sprays.length === 0 && selectedDay.fertilizers.length === 0 && (
                        <Text style={styles.noScheduleText}>आज कोणतेही वेळापत्रक नाही.</Text>
                    )}

                    {/* Spray Section */}
                    {selectedDay.sprays.length > 0 && (
                        <View style={styles.detailSection}>
                            <View style={styles.detailSectionTitleContainer}>
                                <MaterialCommunityIcons name="spray" size={22} color={COLORS.SPRAY_BLUE_DARK} />
                                <Text style={styles.detailSectionTitle}>फवारणी (Spray)</Text>
                            </View>
                            {selectedDay.sprays.map((spray, index) => {
                                const { medicineName, waterQty, medicineQty, unitShortName, note } = spray;
                                return (
                                    <View key={`spray-detail-${index}`} style={[styles.detailItemContainer, styles.sprayBackground]}>
                                        <Text style={styles.detailItemTitle}>{medicineName || 'Spray Item'}</Text>
                                        <Text style={styles.detailItemDescription}>
                                            Dose: {medicineQty} {unitShortName} in {waterQty} L water
                                        </Text>
                                        {note ? <Text style={styles.detailItemCode}>Note: {note}</Text> : null}
                                    </View>
                                );
                            })}
                        </View>
                    )}

                    {/* Fertilizer Section */}
                    {selectedDay.fertilizers.length > 0 && (
                        <View style={styles.detailSection}>
                            <View style={styles.detailSectionTitleContainer}>
                                <MaterialCommunityIcons name="leaf" size={22} color={COLORS.FERTILIZER_GREEN_DARK} />
                                <Text style={styles.detailSectionTitle}>खत व्यवस्थापन (Fertilizer)</Text>
                            </View>
                            {selectedDay.fertilizers.map((fert, index) => {
                                const { title, instructions } = fert;
                                const cleanedInstructions = cleanInstructions(instructions);

                                return (
                                    <View key={`fert-detail-${index}`} style={[styles.detailItemContainer, styles.fertilizerBackground]}>
                                        <Text style={styles.detailItemTitle}>{title || 'Fertilizer Item'}</Text>
                                        <Text style={styles.detailItemDescription}>{cleanedInstructions}</Text>
                                    </View>
                                );
                            })}
                        </View>
                    )}
                </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

export default ScheduleScreen;
