import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: themeColors.primary,
        headerShown: false,
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
        tabBarStyle: {
          height: 80,
          paddingBottom: 10,
          paddingTop: 10,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          position: 'absolute',
          overflow: 'hidden',
          backgroundColor: themeColors.background,
          elevation: 8,
          shadowColor: '#000',
          shadowOpacity: colorScheme === 'dark' ? 0.3 : 0.1,
          shadowRadius: 6,
        },
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Beranda',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={26}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="event"
        options={{
          title: 'Event',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'calendar' : 'calendar-outline'}
              size={26}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="gallery"
        options={{
          title: 'Galeri',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'images' : 'images-outline'}
              size={26}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={26}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
