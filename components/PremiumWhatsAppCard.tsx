import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Platform } from 'react-native';
import { ChevronRight, Crown, CheckCircle } from 'lucide-react-native';
import { WhatsAppItem } from '@/types/whatsapp';
import Colors from '@/constants/colors';
import { PersianTexts } from '@/constants/persian';
import { formatMembersCount, truncateText } from '@/utils/formatters';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

interface PremiumWhatsAppCardProps {
  item: WhatsAppItem;
  onPress: (item: WhatsAppItem) => void;
}

export default function PremiumWhatsAppCard({ item, onPress }: PremiumWhatsAppCardProps) {
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => onPress(item)}
      activeOpacity={0.8}
      testID={`premium-whatsapp-item-${item.type}-${item.name}`}
    >
      <LinearGradient
        colors={['#FFD700', '#FFA500', '#FF8C00']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientContainer}
      >
        <View style={styles.premiumHeader}>
          <Crown size={16} color="#FFF" />
          <Text style={styles.premiumLabel}>{PersianTexts.premium}</Text>
        </View>
        
        <View style={styles.content}>
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: item.imageUrl }} 
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.premiumBadge}>
              <Crown size={12} color="#FFD700" />
            </View>
          </View>
          
          <View style={styles.textContent}>
            <View style={styles.titleContainer}>
              <Text style={styles.title} numberOfLines={1}>
                {item.name}
              </Text>
              <CheckCircle size={18} color="#00C851" style={styles.verifyBadge} />
            </View>
            
            <View style={styles.detailsContainer}>
              <Text style={styles.members} numberOfLines={1}>
                {formatMembersCount(item.members)} {PersianTexts.members}
              </Text>
              <Text style={styles.type}>
                {item.type === 'channel' ? PersianTexts.channel : PersianTexts.group}
              </Text>
            </View>
            
            <Text style={styles.description} numberOfLines={2}>
              {truncateText(item.description, 60)}
            </Text>
          </View>
          
          <View style={styles.arrowContainer}>
            <ChevronRight size={24} color="#FFF" />
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#FFD700',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  gradientContainer: {
    padding: 16,
  },
  premiumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  premiumLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFF',
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      web: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }),
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#FFF',
  },
  premiumBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#FFF',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  textContent: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    marginRight: 8,
    flex: 1,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      web: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }),
  },
  verifyBadge: {
    marginLeft: 4,
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  members: {
    fontSize: 14,
    color: '#FFF',
    marginRight: 12,
    fontWeight: '600',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      web: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }),
  },
  type: {
    fontSize: 12,
    color: '#FFF',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    fontWeight: '500',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      web: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }),
  },
  description: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.9,
    lineHeight: 20,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      web: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }),
  },
  arrowContainer: {
    marginLeft: 12,
  },
});
