import React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { SearchX } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface EmptyStateProps {
  message: string;
  icon?: React.ReactNode;
}

export default function EmptyState({ 
  message, 
  icon = <SearchX size={50} color={Colors.whatsapp.textSecondary} />
}: EmptyStateProps) {
  return (
    <View style={styles.container} testID="empty-state">
      {icon}
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  message: {
    fontSize: 16,
    color: Colors.whatsapp.textSecondary,
    textAlign: 'center',
    marginTop: 16,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      web: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }),
  },
});
