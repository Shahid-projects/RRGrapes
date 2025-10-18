import React from 'react';
import { SafeAreaView, View, Text, ActivityIndicator, FlatList, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // Import useRouter
import { styles, COLORS } from '../constants/styles';
import { useAuth } from '../context/AuthContext';
import Header from './components/Header'; // Assuming you have a Header component in app/components/Header.js

// This is the screen for displaying a farmer's different agricultural plots.
const PlotsScreen = () => {
  const { user, apiClient } = useAuth();
  const router = useRouter(); // Initialize router
  const [plots, setPlots] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const fetchPlots = async () => {
    setLoading(true);
    
    // Safety check: Ensure farmerId exists before making the request
    if (!user || !user.farmerId) {
      console.warn("Farmer ID not found in user context. Cannot fetch plots.");
      Alert.alert("Error", "Your account information is missing. Please log in again.");
      setLoading(false);
      return;
    }
    
    try {
      // *** FIX: Construct the URL using the farmerId from the context ***
      const farmerId = user.farmerId;
      const API_URL = `/api/farmers/${farmerId}/plots`;
      
      console.log(`Fetching plots from: ${API_URL}`);
      
      const response = await apiClient.get(API_URL);

      // The API response for plots is an array at the root, not inside a 'plots' key
      setPlots(response.data || []); 
      
    } catch (error) {
      console.error("Failed to fetch plots:", error.response?.status, error.message);
      Alert.alert("Error", `Could not load farm plots (${error.response?.status}). Please check your network or API path.`);
      setPlots([]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPlots();
  }, []);

  // Handler to navigate to the schedule screen
  const handlePlotPress = (plot) => {
    // Navigate to the schedule screen, passing plotId and pruningDate
    router.push({
      pathname: '/schedule',
      params: { 
        plotId: plot.plot_id, 
        plotName: plot.plot_name,
        pruningDate: plot.plot_prunning_date // Needed for schedule calculation
      }
    });
  };

  const renderPlotItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.itemContainer, { paddingVertical: 20 }]} 
      onPress={() => handlePlotPress(item)}
      activeOpacity={0.8}
      key={item.plot_id} // Use plot_id as key
    >
      <View style={styles.itemIcon}>
        <Ionicons name="location-outline" size={30} color={COLORS.WHITE} />
      </View>
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemTitle}>{item.plot_name || 'Unnamed Plot'}</Text>
        {/* Use the actual fields from the API documentation */}
        <Text style={styles.itemDescription}>Variety: {item.grapeVariety?.grape_variety_name || 'N/A'}</Text>
        <Text style={styles.itemDescription}>Area: {item.totalArea ? `${item.totalArea.toFixed(2)} Acres` : 'N/A'}</Text>
      </View>
      <Ionicons name="arrow-forward" size={24} color={COLORS.TEXT_MEDIUM} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Plots Section" showBackButton={true} />
      
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY_PURPLE} />
          <Text style={{ marginTop: 10 }}>Loading Plots...</Text>
        </View>
      ) : plots.length === 0 ? (
        <View style={styles.infoContainer}>
            <Ionicons name="alert-circle-outline" size={60} color={COLORS.TEXT_MEDIUM} />
            <Text style={styles.infoText}>No plots are registered to your account ({user?.username}).</Text>
        </View>
      ) : (
        <FlatList
          data={plots}
          keyExtractor={(item) => item.plot_id.toString()}
          renderItem={renderPlotItem}
          contentContainerStyle={{ padding: 10 }}
        />
      )}
    </SafeAreaView>
  );
};

export default PlotsScreen;
