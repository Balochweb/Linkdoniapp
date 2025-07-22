import { useState, useEffect } from 'react';
import { Platform, Alert } from 'react-native';
import createContextHook from '@nkzw/create-context-hook';
import { PersianTexts } from '@/constants/persian';

// Mock Tapsell implementation for Expo Go compatibility
interface TapsellAdModel {
  responseId: string;
}

interface TapsellError {
  message: string;
}

// Mock Tapsell SDK for development
const MockTapsellPlus = {
  initialize: (appId: string, callback: (success: boolean) => void) => {
    console.log('Mock Tapsell initialized with appId:', appId);
    setTimeout(() => callback(true), 1000);
  },
  
  requestRewardedVideoAd: (
    zoneId: string,
    callback: {
      response: (model: TapsellAdModel) => void;
      error: (error: TapsellError) => void;
    }
  ) => {
    console.log('Mock requesting rewarded video ad for zone:', zoneId);
    setTimeout(() => {
      if (Math.random() > 0.2) { // 80% success rate
        callback.response({ responseId: `mock_response_${Date.now()}` });
      } else {
        callback.error({ message: 'Mock ad request failed' });
      }
    }, 2000);
  },
  
  showRewardedVideoAd: (
    responseId: string,
    callback: {
      onOpened: () => void;
      onClosed: () => void;
      onRewarded: () => void;
      onError: (error: TapsellError) => void;
    }
  ) => {
    console.log('Mock showing rewarded video ad:', responseId);
    setTimeout(() => callback.onOpened(), 500);
    setTimeout(() => callback.onRewarded(), 3000);
    setTimeout(() => callback.onClosed(), 3500);
  },
  
  requestInterstitialAd: (
    zoneId: string,
    callback: {
      response: (model: TapsellAdModel) => void;
      error: (error: TapsellError) => void;
    }
  ) => {
    console.log('Mock requesting interstitial ad for zone:', zoneId);
    setTimeout(() => {
      if (Math.random() > 0.3) { // 70% success rate
        callback.response({ responseId: `mock_interstitial_${Date.now()}` });
      } else {
        callback.error({ message: 'Mock interstitial ad request failed' });
      }
    }, 1500);
  },
  
  showInterstitialAd: (
    responseId: string,
    callback: {
      onOpened: () => void;
      onClosed: () => void;
      onError: (error: TapsellError) => void;
    }
  ) => {
    console.log('Mock showing interstitial ad:', responseId);
    setTimeout(() => callback.onOpened(), 500);
    setTimeout(() => callback.onClosed(), 2500);
  }
};

// Test zone IDs (replace with real ones in production)
const ZONE_IDS = {
  REWARDED_VIDEO: '687fdb3a2ca0a025aba69aa2',
  INTERSTITIAL: '687fdb632ca0a025aba69aa3',
};

const APP_ID = 'rnockoojinqgmhfgodsegdieplrmscdlhboqtsftncrtspaamofhifbnqrsjigbtgefcfo'; // Replace with real app ID

export const [TapsellAdsProvider, useTapsellAds] = createContextHook(() => {
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [rewardedAdResponseId, setRewardedAdResponseId] = useState<string | null>(null);
  const [interstitialAdResponseId, setInterstitialAdResponseId] = useState<string | null>(null);
  const [isLoadingRewardedAd, setIsLoadingRewardedAd] = useState<boolean>(false);
  const [isLoadingInterstitialAd, setIsLoadingInterstitialAd] = useState<boolean>(false);

  // Initialize Tapsell SDK
  useEffect(() => {
    if (Platform.OS !== 'web') {
      console.log('Initializing Tapsell SDK...');
      MockTapsellPlus.initialize(APP_ID, (success) => {
        setIsInitialized(success);
        if (success) {
          console.log('Tapsell SDK initialized successfully');
          // Pre-load interstitial ad for app startup
          requestInterstitialAd();
        } else {
          console.error('Failed to initialize Tapsell SDK');
        }
      });
    } else {
      // Skip ads on web
      setIsInitialized(true);
    }
  }, []);

  const requestRewardedVideoAd = () => {
    if (!isInitialized || Platform.OS === 'web') return;
    
    setIsLoadingRewardedAd(true);
    console.log('Requesting rewarded video ad...');
    
    MockTapsellPlus.requestRewardedVideoAd(ZONE_IDS.REWARDED_VIDEO, {
      response: (model) => {
        console.log('Rewarded video ad loaded:', model.responseId);
        setRewardedAdResponseId(model.responseId);
        setIsLoadingRewardedAd(false);
      },
      error: (error) => {
        console.error('Failed to load rewarded video ad:', error.message);
        setIsLoadingRewardedAd(false);
        Alert.alert(PersianTexts.error, error.message);
      }
    });
  };

  const showRewardedVideoAd = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!isInitialized || Platform.OS === 'web') {
        resolve(true); // Skip ads on web
        return;
      }

      if (!rewardedAdResponseId) {
        Alert.alert(PersianTexts.error, PersianTexts.adNotReady);
        resolve(false);
        return;
      }

      console.log('Showing rewarded video ad...');
      MockTapsellPlus.showRewardedVideoAd(rewardedAdResponseId, {
        onOpened: () => {
          console.log('Rewarded video ad opened');
        },
        onClosed: () => {
          console.log('Rewarded video ad closed');
          setRewardedAdResponseId(null);
          // Pre-load next ad
          requestRewardedVideoAd();
        },
        onRewarded: () => {
          console.log('User rewarded for watching ad');
          Alert.alert(PersianTexts.success, PersianTexts.adWatchedSuccessfully);
          resolve(true);
        },
        onError: (error) => {
          console.error('Error showing rewarded video ad:', error.message);
          Alert.alert(PersianTexts.error, error.message);
          resolve(false);
        }
      });
    });
  };

  const requestInterstitialAd = () => {
    if (!isInitialized || Platform.OS === 'web') return;
    
    setIsLoadingInterstitialAd(true);
    console.log('Requesting interstitial ad...');
    
    MockTapsellPlus.requestInterstitialAd(ZONE_IDS.INTERSTITIAL, {
      response: (model) => {
        console.log('Interstitial ad loaded:', model.responseId);
        setInterstitialAdResponseId(model.responseId);
        setIsLoadingInterstitialAd(false);
      },
      error: (error) => {
        console.error('Failed to load interstitial ad:', error.message);
        setIsLoadingInterstitialAd(false);
      }
    });
  };

  const showInterstitialAd = (): Promise<void> => {
    return new Promise((resolve) => {
      if (!isInitialized || Platform.OS === 'web') {
        resolve(); // Skip ads on web
        return;
      }

      if (!interstitialAdResponseId) {
        console.log('No interstitial ad available');
        resolve();
        return;
      }

      console.log('Showing interstitial ad...');
      MockTapsellPlus.showInterstitialAd(interstitialAdResponseId, {
        onOpened: () => {
          console.log('Interstitial ad opened');
        },
        onClosed: () => {
          console.log('Interstitial ad closed');
          setInterstitialAdResponseId(null);
          // Pre-load next ad
          requestInterstitialAd();
          resolve();
        },
        onError: (error) => {
          console.error('Error showing interstitial ad:', error.message);
          resolve();
        }
      });
    });
  };

  // Pre-load rewarded video ad when initialized
  useEffect(() => {
    if (isInitialized && !rewardedAdResponseId && !isLoadingRewardedAd) {
      requestRewardedVideoAd();
    }
  }, [isInitialized, rewardedAdResponseId, isLoadingRewardedAd]);

  return {
    isInitialized,
    rewardedAdResponseId,
    interstitialAdResponseId,
    isLoadingRewardedAd,
    isLoadingInterstitialAd,
    requestRewardedVideoAd,
    showRewardedVideoAd,
    requestInterstitialAd,
    showInterstitialAd,
  };
});
