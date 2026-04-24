import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { AudioProvider } from '../context/AudioContext';
import { AuthProvider } from '../context/AuthContext';
import { useAuth } from '../hooks/useAuth';

function InitialLayout() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === 'auth';

    if (!user && !inAuthGroup) {
      // Redirect to the login page if not authenticated
      router.replace('/auth');
    } else if (user && inAuthGroup) {
      // Redirect away from the login page if already authenticated
      router.replace('/');
    }
  }, [user, segments, loading]);

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AudioProvider>
        <InitialLayout />
      </AudioProvider>
    </AuthProvider>
  );
}
