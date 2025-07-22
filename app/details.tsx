import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Alert, Linking, ActivityIndicator, Platform } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Share2, Tag, User, Users, ExternalLink } from 'lucide-react-native';
import { useWhatsAppData } from '@/hooks/use-whatsapp-data';
import { useTapsellAds } from '@/hooks/use-tapsell-ads';
import { formatMembersCount } from '@/utils/formatters';
import Colors from '@/constants/colors';
import { PersianTexts } from '@/constants/persian';
import EmptyState from '@/components/EmptyState';

export default function DetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { items, sendLink } = useWhatsAppData();
  const { showRewardedVideoAd, isLoadingRewardedAd } = useTapsellAds();
  const [isSending, setIsSending] = useState(false);

  // Find the item by link
  const item = items.find(item => item.link === id);

  if (!item) {
    return <EmptyState message={PersianTexts.itemNotFound} />;
  }

  const handleSendLink = async () => {
    if (Platform.OS === 'web') {
      // Skip ads on web and send directly
      await sendLinkDirectly();
      return;
    }

    // Show reward ad first
    Alert.alert(
      PersianTexts.watchAdToSend,
      '',
      [
        {
          text: 'انصراف',
          style: 'cancel'
        },
        {
          text: 'مشاهده تبلیغ',
          onPress: async () => {
            const adWatched = await showRewardedVideoAd();
            if (adWatched) {
              await sendLinkDirectly();
            }
          }
        }
      ]
    );
  };

  const sendLinkDirectly = async () => {
    setIsSending(true);
    try {
      const success = await sendLink(item);
      if (success) {
        Alert.alert(PersianTexts.success, PersianTexts.linkSentSuccessfully);
      } else {
        Alert.alert(PersianTexts.error, PersianTexts.failedToSendLink);
      }
    } catch (error) {
      console.error('Error sending link:', error);
      Alert.alert(PersianTexts.error, PersianTexts.unexpectedError);
    } finally {
      setIsSending(false);
    }
  };

  const handleOpenLink = async () => {
    try {
      const canOpen = await Linking.canOpenURL(item.link);
      if (canOpen) {
        await Linking.openURL(item.link);
      } else {
        Alert.alert(PersianTexts.error, PersianTexts.cannotOpenLink);
      }
    } catch (error) {
      console.error('Error opening link:', error);
      Alert.alert(PersianTexts.error, PersianTexts.failedToOpenLink);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: item.name,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft color={Colors.whatsapp.background} size={24} />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: Colors.whatsapp.primary,
          },
          headerTintColor: Colors.whatsapp.background,
          headerTitleStyle: {
            fontFamily: Platform.select({
              ios: 'System',
              android: 'Roboto',
              web: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
            }),
          },
        }}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
          <Text style={styles.name}>{item.name}</Text>
          {item.premium && (
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumText}>{PersianTexts.premium}</Text>
            </View>
          )}
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <User size={20} color={Colors.whatsapp.primary} />
            <Text style={styles.infoText}>{PersianTexts.manager}: {item.manager}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Tag size={20} color={Colors.whatsapp.primary} />
            <Text style={styles.infoText}>{PersianTexts.category}: {item.category}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Users size={20} color={Colors.whatsapp.primary} />
            <Text style={styles.infoText}>{PersianTexts.members}: {formatMembersCount(item.members)}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <ExternalLink size={20} color={Colors.whatsapp.primary} />
            <Text style={styles.infoText} numberOfLines={1} ellipsizeMode="middle">
              {PersianTexts.link}: {item.link}
            </Text>
          </View>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>{PersianTexts.description}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={handleOpenLink}
            testID="open-link-button"
          >
            <ExternalLink size={20} color={Colors.whatsapp.background} />
            <Text style={styles.actionButtonText}>{PersianTexts.openLink}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, (isSending || isLoadingRewardedAd) && styles.disabledButton]} 
            onPress={handleSendLink}
            disabled={isSending || isLoadingRewardedAd}
            testID="send-link-button"
          >
            {isSending ? (
              <ActivityIndicator size="small" color={Colors.whatsapp.background} />
            ) : isLoadingRewardedAd ? (
              <>
                <ActivityIndicator size="small" color={Colors.whatsapp.background} />
                <Text style={styles.actionButtonText}>{PersianTexts.loadingAd}</Text>
              </>
            ) : (
              <>
                <Share2 size={20} color={Colors.whatsapp.background} />
                <Text style={styles.actionButtonText}>{PersianTexts.sendLink}</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whatsapp.background,
  },
  scrollContent: {
    padding: 16,
  },
  backButton: {
    marginLeft: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.whatsapp.text,
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      web: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }),
  },
  premiumBadge: {
    backgroundColor: Colors.whatsapp.premium,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  premiumText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.whatsapp.text,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      web: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }),
  },
  infoContainer: {
    backgroundColor: Colors.whatsapp.light,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: Colors.whatsapp.text,
    marginLeft: 12,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      web: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }),
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.whatsapp.text,
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      web: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }),
  },
  description: {
    fontSize: 16,
    color: Colors.whatsapp.text,
    lineHeight: 24,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      web: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }),
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.whatsapp.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 0.48,
  },
  actionButtonText: {
    color: Colors.whatsapp.background,
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      web: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }),
  },
  disabledButton: {
    opacity: 0.7,
  },
});
