import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Platform } from 'react-native';
import { ChevronRight, Radio, Users } from 'lucide-react-native';
import { WhatsAppItem } from '@/types/whatsapp';
import Colors from '@/constants/colors';
import { PersianTexts } from '@/constants/persian';
import { formatMembersCount, truncateText } from '@/utils/formatters';

interface WhatsAppListItemProps {
  item: WhatsAppItem;
  onPress: (item: WhatsAppItem) => void;
}

export default function WhatsAppListItem({ item, onPress }: WhatsAppListItemProps) {
  const getTypeIcon = () => {
    if (item.type === 'channel') {
      return <Radio size={16} color={Colors.whatsapp.primary} />;
    } else if (item.type === 'group') {
      return <Users size={16} color={Colors.whatsapp.primary} />;
    }
    return null;
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => onPress(item)}
      activeOpacity={0.7}
      testID={`whatsapp-item-${item.type}-${item.name}`}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: item.imageUrl }} 
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.typeIndicator}>
          {getTypeIcon()}
        </View>
      </View>
      
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {item.name}
          </Text>
        </View>
        
        <View style={styles.detailsContainer}>
          <Text style={styles.members} numberOfLines={1}>
            {formatMembersCount(item.members)} {PersianTexts.members}
          </Text>
          <View style={styles.separator} />
          <Text style={styles.category} numberOfLines={1}>
            {item.category}
          </Text>
        </View>
        
        <Text style={styles.description} numberOfLines={2}>
          {truncateText(item.description, 50)}
        </Text>
      </View>
      
      <ChevronRight size={20} color={Colors.whatsapp.textSecondary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: Colors.whatsapp.background,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  image: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  typeIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: Colors.whatsapp.background,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.whatsapp.text,
    flex: 1,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      web: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }),
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  members: {
    fontSize: 13,
    color: Colors.whatsapp.primary,
    fontWeight: '600',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      web: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }),
  },
  separator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.whatsapp.textSecondary,
    marginHorizontal: 8,
  },
  category: {
    fontSize: 13,
    color: Colors.whatsapp.textSecondary,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      web: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }),
  },
  description: {
    fontSize: 14,
    color: Colors.whatsapp.textSecondary,
    lineHeight: 20,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      web: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }),
  },
});
