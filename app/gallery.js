import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    FlatList,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from '../constants/api';

const CATEGORIES = ['Event', 'Sports', 'Fertilizer', 'Spray'];

const AnimatedCard = ({ item, index }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                delay: index * 150,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 500,
                delay: index * 150,
                useNativeDriver: true,
            })
        ]).start();
    }, [fadeAnim, slideAnim, index]);

    return (
        <Animated.View style={[localStyles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <Image
                style={localStyles.cardImage}
                source={{ uri: item.fullImageUrl }}
                onError={(e) => console.log(`Failed to load image: ${item.fullImageUrl}`, e.nativeEvent.error)}
            />
            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={localStyles.cardOverlay}>
                <Text style={localStyles.cardText}>{item.event}</Text>
            </LinearGradient>
        </Animated.View>
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
                // --- UPDATED API PATH ---
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
                <>
                    <View style={localStyles.header}>
                        <TouchableOpacity onPress={() => setActiveCategory(null)} style={localStyles.backButton}>
                            <Ionicons name="arrow-back" size={28} color="#fff" />
                        </TouchableOpacity>
                        <Text style={localStyles.headerTitle}>{activeCategory}</Text>
                    </View>
                    {filteredImages.length > 0 ? (
                        <FlatList
                            data={filteredImages}
                            renderItem={({ item, index }) => <AnimatedCard item={item} index={index} />}
                            keyExtractor={item => item.id.toString()}
                            contentContainerStyle={localStyles.listContainer}
                        />
                    ) : (
                        <View style={localStyles.center}>
                            <Text style={localStyles.emptyText}>No images found for "{activeCategory}"</Text>
                        </View>
                    )}
                </>
            ) : (
                <>
                    <View style={localStyles.header}>
                        <Text style={localStyles.headerTitle}>Gallery</Text>
                    </View>
                    <FlatList
                        data={CATEGORIES}
                        keyExtractor={(item) => item}
                        contentContainerStyle={localStyles.categoryContainer}
                        renderItem={({ item }) => (
                            <TouchableOpacity 
                                style={localStyles.categoryCard}
                                onPress={() => setActiveCategory(item)}
                            >
                                <LinearGradient
                                    colors={['#8e2de2', '#4a00e0']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={localStyles.gradientBackground}
                                >
                                    <Text style={localStyles.categoryText}>{item}</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        )}
                    />
                </>
            )}
        </SafeAreaView>
    );
}

const localStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#191919',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#191919',
    },
    errorText: {
        color: '#ff6b6b',
        fontSize: 16,
    },
    emptyText: {
        color: '#BDB8D2',
        textAlign: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#191919',
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
    },
    categoryContainer: {
        padding: 20,
    },
    categoryCard: {
        marginBottom: 25,
        borderRadius: 20,
        shadowColor: '#DA70D6',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 15,
        elevation: 15,
    },
    gradientBackground: {
        paddingVertical: 40,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    categoryText: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.25)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    listContainer: {
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    card: {
        marginBottom: 25,
        borderRadius: 16,
        backgroundColor: '#2D2A3E',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        overflow: 'hidden',
    },
    cardImage: {
        width: '100%',
        height: 240,
    },
    cardOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingTop: 40,
        paddingBottom: 16,
        paddingHorizontal: 16,
    },
    cardText: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
    },
});
