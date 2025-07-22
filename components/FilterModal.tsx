import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, Platform } from 'react-native';
import { X, Check } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { PersianTexts } from '@/constants/persian';
import { BlurView } from 'expo-blur';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

const filterOptions = [
  { key: 'all', label: 'همه' },
  { key: 'premium', label: 'ویژه' },
  { key: 'channels', label: 'کانال‌ها' },
  { key: 'groups', label: 'گروه‌ها' },
];

export default function FilterModal({ 
  visible, 
  onClose, 
  selectedFilter, 
  onFilterChange 
}: FilterModalProps) {
  const handleFilterSelect = (filter: string) => {
    onFilterChange(filter);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <BlurView intensity={20} style={styles.blurOverlay}>
          <TouchableOpacity 
            style={styles.backdrop} 
            onPress={onClose}
            activeOpacity={1}
          />
          
          <View style={styles.modal}>
            <View style={styles.header}>
              <Text style={styles.title}>{PersianTexts.filter}</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={24} color={Colors.whatsapp.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.options}>
              {filterOptions.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.option,
                    selectedFilter === option.key && styles.selectedOption
                  ]}
                  onPress={() => handleFilterSelect(option.key)}
                >
                  <Text style={[
                    styles.optionText,
                    selectedFilter === option.key && styles.selectedOptionText
                  ]}>
                    {option.label}
                  </Text>
                  {selectedFilter === option.key && (
                    <Check size={20} color={Colors.whatsapp.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </BlurView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurOverlay: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modal: {
    backgroundColor: Colors.whatsapp.background,
    borderRadius: 20,
    padding: 20,
    width: '80%',
    maxWidth: 300,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.whatsapp.text,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      web: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }),
  },
  closeButton: {
    padding: 4,
  },
  options: {
    gap: 12,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
  },
  selectedOption: {
    backgroundColor: Colors.whatsapp.light,
    borderWidth: 1,
    borderColor: Colors.whatsapp.primary,
  },
  optionText: {
    fontSize: 16,
    color: Colors.whatsapp.text,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      web: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }),
  },
  selectedOptionText: {
    color: Colors.whatsapp.primary,
    fontWeight: '600',
  },
});
