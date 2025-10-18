import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { styles, COLORS } from '../../constants/styles';

export default function PublicTabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'index') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'legal') iconName = focused ? 'hammer' : 'hammer-outline';
          else if (route.name === 'contact') iconName = focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline';
          else if (route.name === 'community') iconName = focused ? 'people' : 'people-outline';
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.PRIMARY_PURPLE,
        tabBarInactiveTintColor: COLORS.TEXT_MEDIUM,
        tabBarStyle: { backgroundColor: '#fff', borderTopColor: COLORS.BORDER_COLOR },
        tabBarLabelStyle: { fontWeight: 'bold', fontSize: 12 },
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="community" options={{ title: 'Community' }} />
      <Tabs.Screen name="contact" options={{ title: 'Contact Us' }} />
      <Tabs.Screen name="legal" options={{ title: 'Legal Notice' }} />
    </Tabs>
  );
}
