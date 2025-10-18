import { Ionicons } from '@expo/vector-icons';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from '../constants/api';

const CATEGORIES = ['Event', 'Sports', 'Fertilizer', 'Spray'];

const formatTime = (ms) => {
    if (isNaN(ms) || ms < 0) return '00:00';
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const VideoPlayer = ({ video, onClose }) => {
    const [status, setStatus] = useState({ isPlaying: false, position: 0, duration: 0, isBuffering: true });
    const player = useVideoPlayer({ uri: `${API_BASE_URL}/${video.path}`.replace(/\\/g, '/') }, p => { p.play(); });

    useEffect(() => {
        const sub = player.addListener('statusChange', setStatus);
        return () => sub.remove();
    }, [player]);

    return (
        <View style={styles.videoPlayerContainer}>
            <VideoView style={styles.video} player={player} allowsFullscreen />
            <View style={styles.controlsOverlay}>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Ionicons name="chevron-down" size={30} color="white" />
                </TouchableOpacity>
                <View style={styles.centerControls}>
                    {status.isBuffering ? (
                        <ActivityIndicator size="large" color="#fff" />
                    ) : (
                        <TouchableOpacity onPress={() => status.isPlaying ? player.pause() : player.play()}>
                            <Ionicons name={status.isPlaying ? 'pause' : 'play'} size={60} color="white" />
                        </TouchableOpacity>
                    )}
                </View>
                <View style={styles.bottomControls}>
                    <Text style={styles.timeText}>{formatTime(status.position)}</Text>
                    <Text style={[styles.timeText, { flex: 1, textAlign: 'right' }]}>{formatTime(status.duration)}</Text>
                </View>
            </View>
        </View>
    );
};

export default function VideoScreen() {
    const [allVideos, setAllVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [activeCategory, setActiveCategory] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                // --- UPDATED API PATH ---
                const response = await axios.get(`${API_BASE_URL}/api/v1/auth/videeos`);
                setAllVideos(response.data);
            } catch (e) {
                setError(e.message || "Failed to fetch videos.");
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchVideos();
    }, []);

    const filteredVideos = useMemo(() => {
        if (!activeCategory) return [];
        return allVideos.filter(video => video.event.toLowerCase() === activeCategory.toLowerCase());
    }, [activeCategory, allVideos]);

    const renderVideoThumbnail = ({ item }) => (
        <TouchableOpacity style={styles.videoItemContainer} onPress={() => setSelectedVideo(item)}>
            <View style={styles.thumbnail}>
                <Ionicons name="play-circle" size={60} color="rgba(255,255,255,0.9)" />
            </View>
            <View style={styles.videoInfoContainer}>
                <Text style={styles.videoTitle}>{item.event}</Text>
                <Text style={styles.videoStats}>{new Date(item.dateTime).toLocaleDateString()}</Text>
            </View>
        </TouchableOpacity>
    );

    if (selectedVideo) {
        return <VideoPlayer video={selectedVideo} onClose={() => setSelectedVideo(null)} />;
    }

    if (isLoading) {
        return <View style={styles.center}><ActivityIndicator size="large" color="#fff" /></View>;
    }

    if (error) {
        return <View style={styles.center}><Text style={styles.errorText}>{error}</Text></View>;
    }

    return (
        <SafeAreaView style={styles.container}>
            {activeCategory ? (
                <>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => setActiveCategory(null)} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={28} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>{activeCategory}</Text>
                    </View>
                    <FlatList
                        data={filteredVideos}
                        renderItem={renderVideoThumbnail}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.listContainer}
                        ListEmptyComponent={<View style={styles.center}><Text style={styles.emptyText}>No videos for "{activeCategory}"</Text></View>}
                    />
                </>
            ) : (
                <>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Videos</Text>
                    </View>
                    <FlatList
                        data={CATEGORIES}
                        keyExtractor={(item) => item}
                        contentContainerStyle={styles.categoryContainer}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.categoryCard} onPress={() => setActiveCategory(item)}>
                                <Text style={styles.categoryText}>{item}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
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
    listContainer: { paddingVertical: 8, paddingHorizontal: 16 },
    videoItemContainer: { 
        marginBottom: 20,
        backgroundColor: '#2D2A3E',
        borderRadius: 12,
        overflow: 'hidden',
    },
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
    videoPlayerContainer: { flex: 1, backgroundColor: '#000', justifyContent: 'center' },
    video: { width: '100%', height: '100%' },
    controlsOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'space-between', backgroundColor: 'rgba(0,0,0,0.2)' },
    closeButton: { position: 'absolute', top: 50, left: 15, padding: 5, zIndex: 10 },
    centerControls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flex: 1 },
    bottomControls: { flexDirection: 'row', alignItems: 'center', padding: 12 },
    timeText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
});
