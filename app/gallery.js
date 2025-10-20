import { Ionicons } from '@expo/vector-icons';
// NOTE: LinearGradient and Animated are removed as the target style doesn't use them
import { useEffect, useMemo, useState } from 'react'; 
import {
    ActivityIndicator,
    FlatList,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from '../constants/api';

const CATEGORIES = ['Event', 'Sports', 'Fertilizer', 'Spray'];

// Changed AnimatedCard to a simple functional component (GalleryCard)
// to match the simple styling of the original VideoScreen thumbnail.
const GalleryCard = ({ item, onPress }) => {
    return (
        <TouchableOpacity style={localStyles.videoItemContainer} onPress={onPress}>
            {/* The Image component is placed inside the 'thumbnail' area */}
            <Image
                // Note: Using the thumbnail style, which was for video placeholder, now contains the image
                style={localStyles.thumbnail} 
                source={{ uri: item.fullImageUrl }}
                onError={(e) => console.log(`Failed to load image: ${item.fullImageUrl}`, e.nativeEvent.error)}
            />
            <View style={localStyles.videoInfoContainer}>
                <Text style={localStyles.videoTitle}>{item.event}</Text>
                {/* Reusing videoStats style for a simple date/ID display */}
                <Text style={localStyles.videoStats}>Image ID: {item.id}</Text> 
            </View>
        </TouchableOpacity>
    );
};

export default function GalleryScreen() {
    const [allImages, setAllImages] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGalleryData = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/v1/auth/galleery`);
                const formattedImages = response.data.map(item => ({
                    ...item,
                    fullImageUrl: `${API_BASE_URL}/${item.imagePath}`.replace(/\\/g, '/')
                }));
                setAllImages(formattedImages);
            } catch (e) {
                console.error("Failed to fetch gallery data:", e);
                setError("Could not load images. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchGalleryData();
    }, []);

    const filteredImages = useMemo(() => {
        if (!activeCategory) return [];
        return allImages.filter(image => image.event.toLowerCase() === activeCategory.toLowerCase());
    }, [activeCategory, allImages]);

    if (isLoading) {
        return (
            <SafeAreaView style={[localStyles.container, localStyles.center]}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={{color: '#fff', marginTop: 10}}>Loading Gallery...</Text>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={[localStyles.container, localStyles.center]}>
                <Text style={localStyles.errorText}>{error}</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={localStyles.container}>
            {activeCategory ? (
                // --- Image List View (Using original VideoScreen list/item styles) ---
                <>
                    <View style={localStyles.header}>
                        <TouchableOpacity onPress={() => setActiveCategory(null)} style={localStyles.backButton}>
                            <Ionicons name="arrow-back" size={28} color="#fff" />
                        </TouchableOpacity>
                        <Text style={localStyles.headerTitle}>{activeCategory} Images</Text>
                    </View>
                    {filteredImages.length > 0 ? (
                        <FlatList
                            data={filteredImages}
                            renderItem={({ item }) => <GalleryCard item={item} onPress={() => console.log('View image:', item.fullImageUrl)} />}
                            keyExtractor={item => item.id.toString()}
                            contentContainerStyle={localStyles.listContainer}
                            // NOTE: Removing numColumns to match the single-column list view style of the original video screen
                        />
                    ) : (
                        <View style={localStyles.center}>
                            <Text style={localStyles.emptyText}>No images found for "{activeCategory}"</Text>
                        </View>
                    )}
                </>
            ) : (
                // --- Category Selection View (Using original VideoScreen category styles) ---
                <>
                    <View style={localStyles.header}>
                        <Text style={localStyles.headerTitle}>Gallery Categories</Text>
                    </View>
                    <FlatList
                        data={CATEGORIES}
                        keyExtractor={(item) => item}
                        contentContainerStyle={localStyles.categoryContainer}
                        renderItem={({ item }) => (
                            <TouchableOpacity 
                                // Direct application of categoryCard style (no gradient wrapper needed)
                                style={localStyles.categoryCard} 
                                onPress={() => setActiveCategory(item)}
                            >
                                <Text style={localStyles.categoryText}>{item}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </>
            )}
        </SafeAreaView>
    );
}

// ----------------------------------------------------
// ⚡️ STYLES ADOPTED FROM ORIGINAL VIDEO STYLING ⚡️
// ----------------------------------------------------
const localStyles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#5D3A9B' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#5D3A9B' },
    errorText: { color: '#ff6b6b', fontSize: 16 },
    emptyText: { color: '#BDB8D2', textAlign: 'center', marginTop: 50 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#5D3A9B',
    },
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
    },
    // --- Category Styles ---
    categoryContainer: {
        padding: 20,
    },
    categoryCard: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingVertical: 40,
        borderRadius: 20,
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    categoryText: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
    },
    // --- List Item Styles (renamed from video to generic use) ---
    listContainer: { paddingVertical: 8, paddingHorizontal: 16 },
    videoItemContainer: { // Keeping the original name for easy style transfer
        marginBottom: 20,
        backgroundColor: '#2D2A3E',
        borderRadius: 12,
        overflow: 'hidden',
    },
    // Adjusted height property to fit images, assuming 16:9 is still desired or acceptable
    thumbnail: {
        width: '100%',
        aspectRatio: 16 / 9, 
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1C1A27',
    },
    videoInfoContainer: { padding: 12 },
    videoTitle: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    videoStats: { color: '#BDB8D2', fontSize: 12, marginTop: 4 },
    // --- Video Player Styles (included for completeness, though not used here) ---
    videoPlayerContainer: { flex: 1, backgroundColor: '#000', justifyContent: 'center' },
    video: { width: '100%', height: '100%' },
    controlsOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'space-between', backgroundColor: 'rgba(0,0,0,0.2)' },
    closeButton: { position: 'absolute', top: 50, left: 15, padding: 5, zIndex: 10 },
    centerControls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flex: 1 },
    bottomControls: { flexDirection: 'row', alignItems: 'center', padding: 12 },
    timeText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
});