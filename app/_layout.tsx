import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { I18nManager, Platform } from "react-native";
import { WhatsAppDataProvider } from "@/hooks/use-whatsapp-data";
import { TapsellAdsProvider, useTapsellAds } from "@/hooks/use-tapsell-ads";

// Enable RTL for Persian content
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function AppStartupAd() {
  const { showInterstitialAd, isInitialized } = useTapsellAds();

  useEffect(() => {
    const showStartupAd = async () => {
      if (isInitialized && Platform.OS !== 'web') {
        // Wait a bit for the app to fully load
        setTimeout(async () => {
          await showInterstitialAd();
        }, 2000);
      }
    };

    showStartupAd();
  }, [isInitialized, showInterstitialAd]);

  return null;
}

function RootLayoutNav() {
  return (
    <>
      <AppStartupAd />
      <Stack screenOptions={{ headerBackTitle: "بازگشت" }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="details" options={{ headerShown: true, presentation: 'card' }} />
        <Stack.Screen name="add-link" options={{ headerShown: false, presentation: 'modal' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TapsellAdsProvider>
        <WhatsAppDataProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <RootLayoutNav />
          </GestureHandlerRootView>
        </WhatsAppDataProvider>
      </TapsellAdsProvider>
    </QueryClientProvider>
  );
}
