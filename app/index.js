// --- REWRITTEN & SIMPLIFIED ---
// The root index.js file should be very simple. Its only job is to
// redirect to the main part of your app. The auth logic is now handled
// correctly in the root _layout.js file.

import { Redirect } from 'expo-router';
import React from 'react';

export default function StartPage() {
  return <Redirect href="/(tabs)" />;
}
