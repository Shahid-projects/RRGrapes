import { Stack, useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from '../context/AuthContext';

// This component handles the redirection logic
const InitialLayout = () => {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // Check if the initial segment is the login screen
  const isLoginPage = segments[0] === 'login';
  
  useEffect(() => {
    // Check if the current route is part of the protected main tabs group
    const inTabsGroup = segments[0] === '(tabs)';
    
    // Determine if the current path is protected and requires authentication
    const isProtectedPath = inTabsGroup || segments[0] === 'plots' || segments[0] === 'schedule';

    if (isAuthenticated) {
        // If authenticated, ensure the user leaves the login page
        if (isLoginPage) {
            router.replace('/(tabs)');
        }
    } else {
        // If NOT authenticated, force navigation to login if they are on a protected page
        if (isProtectedPath) {
            router.replace('/login');
        }
    }
  }, [isAuthenticated, isLoginPage, segments]);

  return (
      <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false, presentation: 'modal' }} />
          {/* Routes for authenticated users */}
          <Stack.Screen name="plots" options={{ headerShown: false, title: 'Plots Section' }} />
          <Stack.Screen name="schedule" options={{ headerShown: false, presentation: 'fullScreenModal' }} /> 
          
          {/* Other public screens */}
          <Stack.Screen name="about" options={{ title: 'About Us' }} />
          <Stack.Screen name="gallery" options={{ title: 'Gallery' }} />
          <Stack.Screen name="video" options={{ title: 'Videos' }} />
          <Stack.Screen name="training" options={{ title: 'Training' }} />
          <Stack.Screen name="other" options={{ title: 'Other Activities' }} />
      </Stack>
  );
};

// This is the root component of your app
export default function RootLayout() {
  return (
    <AuthProvider> 
        <InitialLayout />
    </AuthProvider>
  );
}
