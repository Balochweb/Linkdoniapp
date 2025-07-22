import { Tabs } from "expo-router";
import { Home, Plus } from "lucide-react-native";
import React from "react";
import { Platform } from "react-native";
import Colors from "@/constants/colors";
import { PersianTexts } from "@/constants/persian";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.whatsapp.primary,
        headerShown: true,
        headerStyle: {
          backgroundColor: Colors.whatsapp.primary,
        },
        headerTintColor: Colors.whatsapp.background,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontFamily: Platform.select({
            ios: 'System',
            android: 'Roboto',
            web: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
          }),
        },
        tabBarStyle: {
          borderTopColor: Colors.whatsapp.separator,
          backgroundColor: Colors.whatsapp.background,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3.84,
        },
        tabBarLabelStyle: {
          fontFamily: Platform.select({
            ios: 'System',
            android: 'Roboto',
            web: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
          }),
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: PersianTexts.whatsapp,
          tabBarLabel: PersianTexts.home,
          tabBarIcon: ({ color }) => <Home color={color} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: PersianTexts.addNewLink,
          tabBarLabel: PersianTexts.addLink,
          tabBarIcon: ({ color }) => <Plus color={color} />,
        }}
      />
    </Tabs>
  );
}
