import React, { useState, useCallback } from 'react';
import { StyleSheet, FlatList, View, ActivityIndicator, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Search, Filter } from 'lucide-react-native';
import { WhatsAppItem } from '@/types/whatsapp';
import { useWhatsAppData } from '@/hooks/use-whatsapp-data';
import WhatsAppListItem from '@/components/WhatsAppListItem';
import PremiumWhatsAppCard from '@/components/PremiumWhatsAppCard';
import SearchBar from '@/components/SearchBar';
import EmptyState from '@/components/EmptyState';
import ErrorState from '@/components/ErrorState';
import FilterModal from '@/components/FilterModal';
import Colors from '@/constants/colors';
import { PersianTexts } from '@/constants/persian';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const router = useRouter();
  const { items, isLoading, error, fetchData, searchItems } = useWhatsAppData();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
  const [isFilterVisible, setIsFilterVisible] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const getFilteredItems = () => {
    let filteredItems = searchQuery.trim() ? searchItems(searchQuery) : items;
    
    if (selectedFilter !== 'all') {
      filteredItems = filteredItems.filter(item => {
        if (selectedFilter === 'premium') return item.premium;
        if (selectedFilter === 'channels') return item.type === 'channel';
        if (selectedFilter === 'groups') return item.type === 'group';
        return true;
      });
    }
    
    // Sort premium items first
    return filteredItems.sort((a, b) => {
      if (a.premium && !b.premium) return -1;
      if (!a.premium && b.premium) return 1;
      return 0;
    });
  };

  const handleItemPress = useCallback((item: WhatsAppItem) => {
    router.push({
      pathname: '/details',
      params: { id: item.link }
    });
  }, [router]);

  const renderItem = useCallback(({ item }: { item: WhatsAppItem }) => {
    if (item.premium) {
      return <PremiumWhatsAppCard item={item} onPress={handleItemPress} />;
    }
    return <WhatsAppListItem item={item} onPress={handleItemPress} />;
  }, [handleItemPress]);

  const renderHeader = useCallback(() => (
    <View style={styles.headerContainer}>
      <LinearGradient
        colors={[Colors.whatsapp.primary, Colors.whatsapp.secondary]}
        style={styles.welcomeCard}
      >
        <View style={styles.welcomeContent}>
          <View style={styles.welcomeText}>
            <View style={styles.welcomeTitle}>
              <View style={styles.titleText}>
                {PersianTexts.welcomeTitle}
              </View>
            </View>
            <View style={styles.welcomeSubtitle}>
              {PersianTexts.welcomeSubtitle}
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  ), []);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.whatsapp.primary} />
      </View>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchData} />;
  }

  const filteredItems = getFilteredItems();

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <View style={styles.headerButtons}>
              <Search 
                color={Colors.whatsapp.background} 
                size={24} 
                style={styles.headerIcon} 
                onPress={() => setIsSearchVisible(!isSearchVisible)}
              />
              <Filter 
                color={Colors.whatsapp.background} 
                size={24} 
                style={styles.headerIcon}
                onPress={() => setIsFilterVisible(true)}
              />
            </View>
          ),
        }}
      />

      {isSearchVisible && (
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery('')}
          placeholder={PersianTexts.searchAll}
        />
      )}

      {filteredItems.length === 0 ? (
        <EmptyState message={PersianTexts.noItemsFound} />
      ) : (
        <FlatList
          data={filteredItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.link}
          ListHeaderComponent={!searchQuery ? renderHeader : null}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          testID="items-list"
        />
      )}

      <FilterModal
        visible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginHorizontal: 10,
  },
  headerContainer: {
    padding: 16,
  },
  welcomeCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 8,
  },
  welcomeContent: {
    alignItems: 'center',
  },
  welcomeText: {
    alignItems: 'center',
  },
  welcomeTitle: {
    marginBottom: 8,
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.whatsapp.background,
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      web: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }),
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: Colors.whatsapp.background,
    textAlign: 'center',
    opacity: 0.9,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      web: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }),
  },
});
