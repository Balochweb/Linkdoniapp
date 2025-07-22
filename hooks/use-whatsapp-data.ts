import { useEffect, useState } from 'react';
import { WhatsAppItem } from '@/types/whatsapp';
import createContextHook from '@nkzw/create-context-hook';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://linkdoni.chbk.app/cafebazaar.json';
const SEND_LINK_URL = 'https://linkdoni.chbk.app/balebot.php';
const STORAGE_KEY = 'user_added_links';

// Mock data for fallback
const MOCK_DATA: WhatsAppItem[] = [
  {
    "name": "🌱متن های زیبا 🌱💖",
    "type": "channel",
    "link": "https://whatsapp.com/channel/0029VbB5nCM3mFY2lvHS5v0F",
    "manager": "فردوس ",
    "category": "متن",
    "description": "متن های زیبا و عاشقانه. ",
    "premium": false,
    "pending": false,
    "members": "100000",
    "imageUrl": "https://farsgraphic.com/wp-content/uploads/2020/07/%D9%85%D8%AC%D9%85%D9%88%D8%B9%D9%87-%D9%84%D9%88%DA%AF%D9%88-%D9%88%D8%A7%D8%AA%D8%B3-%D8%A7%D9%BE-3.png"
  },
  {
    "name": "شبخند ",
    "type": "channel",
    "link": "https://whatsapp.com/channel/0029VbAWrRpKLaHgVF3P360i",
    "manager": "فردوس ",
    "category": "سرگرمی ",
    "description": "بخند شاد باش 😂🤣 بیخیال غم دنیا 😂",
    "premium": false,
    "pending": false,
    "members": "9",
    "imageUrl": "https://farsgraphic.com/wp-content/uploads/2020/07/%D9%85%D8%AC%D9%85%D9%88%D8%B9%D9%87-%D9%84%D9%88%DA%AF%D9%88-%D9%88%D8%A7%D8%AA%D8%B3-%D8%A7%D9%BE-3.png"
  },
  {
    "name": "جایگاه تبلیغات شما",
    "type": "ad",
    "link": "https://wa.me/989301403428",
    "manager": "رزرو تبلیغات",
    "category": "رزرو",
    "description": "برای رزرو تبلیغات با ادمین تماس بگیرید",
    "premium": false,
    "pending": false,
    "members": "5000",
    "imageUrl": "https://farsgraphic.com/wp-content/uploads/2020/07/%D9%85%D8%AC%D9%85%D9%88%D8%B9%D9%87-%D9%84%D9%88%DA%AF%D9%88-%D9%88%D8%A7%D8%AA%D8%B3-%D8%A7%D9%BE-3.png"
  },
  {
    "name": "فوتبالیست‌ها ⚽",
    "type": "group",
    "link": "https://chat.whatsapp.com/KA84HG6MnHhEhG18VS4SNq?mode=ac_c",
    "manager": "زاهد",
    "category": "ورزشی",
    "description": "گروه مخصوص فوتبالیست ها",
    "premium": true,
    "pending": false,
    "members": "19",
    "imageUrl": "https://pps.whatsapp.net/v/t61.24694-24/491871085_2456860431365792_1909851498492629237_n.jpg?ccb=11-4&oh=01_Q5Aa1wGdyIg6_OMRyiCNOZhpF7phTzCvmkpoOuT5pZsazrJzDQ&oe=687579FB&_nc_sid=5e03e0&_nc_cat=100"
  },
  {
    "name": "🌱 روانشناسی ",
    "type": "channel",
    "link": "https://whatsapp.com/channel/0029VaJsGKO47Xe9HVHVOU2b",
    "manager": "علی شاکرنیا",
    "category": "سرگرمی",
    "description": "اینجا یاد میگیری تا به خودت اهمیت بدی",
    "premium": false,
    "pending": false,
    "members": "3595",
    "imageUrl": "https://mmg.whatsapp.net/v/t61.24694-24/408787306_701535172087550_8628187833053139701_n.jpg?ccb=1-7&_nc_sid=5a2cf7&_nc_ohc=44fun4aWzVwQ7kNvwGlPyid&_nc_oc=AdlaYqA6_ujFaupGSJN-OqGOfPz1I7-dQWwHP5Un4tr9DKtBuJvyocU9hoSaZ5Nm70g&_nc_zt=3&_nc_ht=mmg.whatsapp.net&_nc_gid=lcbW3ltbkZxQoShmIQkFsw&oh=01_Q5Aa1wHwOU87nIKzds2Yyk4zTZ10Iau-Irq8DH6Ennsw72dYMw&oe=688FB4AC"
  },
  {
    "name": "باهم بخندیم 😂",
    "type": "channel",
    "link": "https://whatsapp.com/channel/0029VbANxnhBlHpjIZ7r850S",
    "manager": "الناز",
    "category": "سرگرمی",
    "description": "با هم بخندیم به هم نخندیم 😂👌🏻🇮🇷",
    "premium": false,
    "pending": false,
    "members": "410000",
    "imageUrl": "https://mmg.whatsapp.net/m1/v/t24/An8CBNcOIYXu1bcx5BazLBhao3QzMOwUa_AlGO4yrQ-fD7lZ6QA6FjEqtHpVILYYIHHvDOp48gKtMw6CYiRN59NtcPelCVr7nKZqbzVtZCzfmVAMk_TsiFzy-KG9t8XBlCC1EFmxgPix0yF9WprF?_nc_gid=t9nkwQi6BxRB8TCh-ZW_sQ&_nc_oc=Adlu3MequrXTrmQJNflfDLUC3YIkon4fRjXwmmDQHG0g0RdcTFrOJh9kKdyMKlfShHE&ccb=10-5&oh=01_Q5Aa1wFok3cBzPF09J5cRX44GWg6l1cfRhYLFaQXlP93FLRAbQ&oe=688FB9AD&_nc_sid=471a72"
  }
];

export const [WhatsAppDataProvider, useWhatsAppData] = createContextHook(() => {
  const [items, setItems] = useState<WhatsAppItem[]>([]);
  const [userAddedItems, setUserAddedItems] = useState<WhatsAppItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load user added items from storage
  const loadUserAddedItems = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedItems = JSON.parse(stored);
        setUserAddedItems(parsedItems);
      }
    } catch (err) {
      console.error('Error loading user added items:', err);
    }
  };

  // Save user added items to storage
  const saveUserAddedItems = async (items: WhatsAppItem[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.error('Error saving user added items:', err);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching WhatsApp data from:', API_URL);
      
      // Add timeout and better error handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(API_URL, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Successfully fetched data:', data.length, 'items');
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching WhatsApp data:', err);
      
      // Use mock data as fallback, especially for web
      if (Platform.OS === 'web' || (err as Error).name === 'AbortError') {
        console.log('Using mock data as fallback');
        setItems(MOCK_DATA);
        setError(null);
      } else {
        setError('Failed to load WhatsApp data. Using offline data.');
        setItems(MOCK_DATA);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = async (newItem: WhatsAppItem) => {
    try {
      const updatedUserItems = [...userAddedItems, newItem];
      setUserAddedItems(updatedUserItems);
      await saveUserAddedItems(updatedUserItems);
      console.log('Item added successfully:', newItem.name);
    } catch (err) {
      console.error('Error adding item:', err);
      throw err;
    }
  };

  const sendLink = async (item: WhatsAppItem) => {
    try {
      console.log('Sending link for item:', item.name);
      
      const params = new URLSearchParams({
        name: item.name,
        type: item.type,
        members: item.members,
        link: item.description
      });
      
      const url = `${SEND_LINK_URL}?${params.toString()}`;
      console.log('Send link URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'text/plain',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to send link: ${response.status} ${response.statusText}`);
      }
      
      console.log('Link sent successfully');
      return true;
    } catch (err) {
      console.error('Error sending link:', err);
      return false;
    }
  };

  // Combine server items with user added items
  const getAllItems = () => {
    return [...items, ...userAddedItems];
  };

  const getChannels = () => {
    return getAllItems().filter(item => item.type === 'channel');
  };

  const getGroups = () => {
    return getAllItems().filter(item => item.type === 'group');
  };

  const getAds = () => {
    return getAllItems().filter(item => item.type === 'ad');
  };

  const searchItems = (query: string) => {
    if (!query.trim()) return getAllItems();
    
    const lowerQuery = query.toLowerCase();
    return getAllItems().filter(
      item => 
        item.name.toLowerCase().includes(lowerQuery) ||
        item.description.toLowerCase().includes(lowerQuery) ||
        item.category.toLowerCase().includes(lowerQuery) ||
        item.manager.toLowerCase().includes(lowerQuery)
    );
  };

  useEffect(() => {
    const initializeData = async () => {
      await loadUserAddedItems();
      await fetchData();
    };
    
    initializeData();
  }, []);

  return {
    items: getAllItems(),
    isLoading,
    error,
    fetchData,
    addItem,
    sendLink,
    getChannels,
    getGroups,
    getAds,
    searchItems,
  };
});

export default useWhatsAppData;
