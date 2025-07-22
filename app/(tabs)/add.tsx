import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, Switch, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { Save, Image as ImageIcon } from 'lucide-react-native';
import { WhatsAppItem, WhatsAppItemType } from '@/types/whatsapp';
import { useWhatsAppData } from '@/hooks/use-whatsapp-data';
import Colors from '@/constants/colors';
import { PersianTexts } from '@/constants/persian';
import { LinearGradient } from 'expo-linear-gradient';

export default function AddLinkScreen() {
  const { addItem } = useWhatsAppData();
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'channel' as WhatsAppItemType,
    link: '',
    manager: '',
    category: '',
    description: '',
    premium: false,
    members: '',
    imageUrl: 'https://farsgraphic.com/wp-content/uploads/2020/07/%D9%85%D8%AC%D9%85%D9%88%D8%B9%D9%87-%D9%84%D9%88%DA%AF%D9%88-%D9%88%D8%A7%D8%AA%D8%B3-%D8%A7%D9%BE-3.png'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      Alert.alert(PersianTexts.error, PersianTexts.nameRequired);
      return false;
    }
    if (!formData.link.trim()) {
      Alert.alert(PersianTexts.error, PersianTexts.linkRequired);
      return false;
    }
    if (!formData.manager.trim()) {
      Alert.alert(PersianTexts.error, PersianTexts.managerRequired);
      return false;
    }
    if (!formData.category.trim()) {
      Alert.alert(PersianTexts.error, PersianTexts.categoryRequired);
      return false;
    }
    if (!formData.description.trim()) {
      Alert.alert(PersianTexts.error, PersianTexts.descriptionRequired);
      return false;
    }
    if (!formData.members.trim() || isNaN(Number(formData.members))) {
      Alert.alert(PersianTexts.error, PersianTexts.membersRequired);
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      const newItem: WhatsAppItem = {
        ...formData,
        pending: true,
      };
      
      await addItem(newItem);
      Alert.alert(
        PersianTexts.success,
        PersianTexts.linkAddedSuccessfully,
        [{ text: PersianTexts.ok }]
      );
      
      // Reset form
      setFormData({
        name: '',
        type: 'channel',
        link: '',
        manager: '',
        category: '',
        description: '',
        premium: false,
        members: '',
        imageUrl: 'https://farsgraphic.com/wp-content/uploads/2020/07/%D9%85%D8%AC%D9%85%D9%88%D8%B9%D9%87-%D9%84%D9%88%DA%AF%D9%88-%D9%88%D8%A7%D8%AA%D8%B3-%D8%A7%D9%BE-3.png'
      });
    } catch (error) {
      console.error('Error adding link:', error);
      Alert.alert(PersianTexts.error, PersianTexts.failedToAddLink);
    } finally {
      setIsSubmitting(false);
    }
  };

  const TypeSelector = () => (
    <View style={styles.typeContainer}>
      <Text style={styles.label}>{PersianTexts.type}</Text>
      <View style={styles.typeButtons}>
        {(['channel', 'group', 'ad'] as WhatsAppItemType[]).map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.typeButton,
              formData.type === type && styles.typeButtonActive
            ]}
            onPress={() => updateField('type', type)}
          >
            <Text style={[
              styles.typeButtonText,
              formData.type === type && styles.typeButtonTextActive
            ]}>
              {type === 'channel' ? PersianTexts.channel : 
               type === 'group' ? PersianTexts.group : PersianTexts.ad}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: PersianTexts.addNewLink,
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
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{PersianTexts.name} *</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => updateField('name', text)}
              placeholder={PersianTexts.enterName}
              placeholderTextColor={Colors.whatsapp.textSecondary}
              textAlign="right"
            />
          </View>

          <TypeSelector />

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{PersianTexts.link} *</Text>
            <TextInput
              style={styles.input}
              value={formData.link}
              onChangeText={(text) => updateField('link', text)}
              placeholder={PersianTexts.enterLink}
              placeholderTextColor={Colors.whatsapp.textSecondary}
              textAlign="left"
              keyboardType="url"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{PersianTexts.manager} *</Text>
            <TextInput
              style={styles.input}
              value={formData.manager}
              onChangeText={(text) => updateField('manager', text)}
              placeholder={PersianTexts.enterManager}
              placeholderTextColor={Colors.whatsapp.textSecondary}
              textAlign="right"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{PersianTexts.category} *</Text>
            <TextInput
              style={styles.input}
              value={formData.category}
              onChangeText={(text) => updateField('category', text)}
              placeholder={PersianTexts.enterCategory}
              placeholderTextColor={Colors.whatsapp.textSecondary}
              textAlign="right"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{PersianTexts.description} *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(text) => updateField('description', text)}
              placeholder={PersianTexts.enterDescription}
              placeholderTextColor={Colors.whatsapp.textSecondary}
              textAlign="right"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{PersianTexts.members} *</Text>
            <TextInput
              style={styles.input}
              value={formData.members}
              onChangeText={(text) => updateField('members', text)}
              placeholder={PersianTexts.enterMembers}
              placeholderTextColor={Colors.whatsapp.textSecondary}
              textAlign="right"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{PersianTexts.imageUrl}</Text>
            <TextInput
              style={styles.input}
              value={formData.imageUrl}
              onChangeText={(text) => updateField('imageUrl', text)}
              placeholder={PersianTexts.enterImageUrl}
              placeholderTextColor={Colors.whatsapp.textSecondary}
              textAlign="left"
              keyboardType="url"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.switchGroup}>
            <Text style={styles.label}>{PersianTexts.premium}</Text>
            <Switch
              value={formData.premium}
              onValueChange={(value) => updateField('premium', value)}
              trackColor={{ false: Colors.whatsapp.separator, true: Colors.whatsapp.secondary }}
              thumbColor={formData.premium ? Colors.whatsapp.primary : Colors.whatsapp.textSecondary}
            />
          </View>

          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <LinearGradient
              colors={[Colors.whatsapp.primary, Colors.whatsapp.secondary]}
              style={styles.submitGradient}
            >
              <Save size={20} color={Colors.whatsapp.background} />
              <Text style={styles.submitButtonText}>
                {isSubmitting ? PersianTexts.submitting : PersianTexts.addLink}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    padding: 16,
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.whatsapp.text,
    marginBottom: 8,
    textAlign: 'right',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      web: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }),
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.whatsapp.separator,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.whatsapp.text,
    backgroundColor: Colors.whatsapp.background,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      web: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  typeContainer: {
    marginBottom: 20,
  },
  typeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typeButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.whatsapp.separator,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    backgroundColor: Colors.whatsapp.background,
  },
  typeButtonActive: {
    backgroundColor: Colors.whatsapp.primary,
    borderColor: Colors.whatsapp.primary,
  },
  typeButtonText: {
    fontSize: 14,
    color: Colors.whatsapp.text,
    fontWeight: '500',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      web: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }),
  },
  typeButtonTextActive: {
    color: Colors.whatsapp.background,
  },
  switchGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 8,
  },
  submitButton: {
    borderRadius: 16,
    marginTop: 20,
    overflow: 'hidden',
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
  },
  submitButtonText: {
    color: Colors.whatsapp.background,
    fontSize: 18,
    fontWeight: '600',
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
