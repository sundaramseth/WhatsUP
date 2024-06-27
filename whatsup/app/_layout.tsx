import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { View } from 'react-native';

import * as SecureStore from 'expo-secure-store';

import {ClerkProvider, SignedIn, useAuth } from '@clerk/clerk-expo';

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY

const tokenCache = {
  async getToken(key: string) {
    try {
      const item = await SecureStore.getItemAsync(key);
      if (item) {
        console.log(`${key} was used \n`);
      } else {
        console.log("No values stored under key: " + key);
      }
      return item;
    } catch (error) {
      console.error("SecureStore get item error: ", error);
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const InitialLayout = ()=> {
  const router = useRouter();
  const segments = useSegments();
  const {isLoaded, isSignedIn} = useAuth();

  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

useEffect(()=>{
if(!isLoaded) return;

const inTabsGroup = segments[0] === '(tabs)';

if(isSignedIn && !inTabsGroup){
  router.replace("/(tabs)/chats");
}else if (!isSignedIn){
  router.replace('/');
}

},[isSignedIn])

  if (!loaded || !isLoaded) {
    return <View />;
  }

  return (
    <Stack>
    <Stack.Screen name="index" options={{ headerShown: false }} />
    <Stack.Screen name="otp" options={{ headerTitle: 'Enter Your Phone Number' , headerBackVisible:false}} />
    <Stack.Screen name="verify/[phone]" options={{ headerTitle: 'Verify Your Phone Number' , headerBackTitle:'Edit number'}} />
  </Stack>
  );
}

const RootLayoutNav = ()=> {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY!} tokenCache={tokenCache}>
      <InitialLayout />
      </ClerkProvider>
  );
}

export default RootLayoutNav;