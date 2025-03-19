import { View, StyleSheet } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Provider as PaperProvider } from 'react-native-paper'; 

export default function _layout() {
  return (
    <PaperProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarShowLabel: false,
        }}
      >
         <Tabs.Screen
          name="ElectionScreen"
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={[styles.iconContainer, focused && styles.iconActive]}>
                <Ionicons name="home" size={24} color={focused ? 'white' : '#4a3b47'} />
                
              </View>
            ),
          }}
        />

        <Tabs.Screen
          name="HomeScreen"
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={[styles.iconContainer, focused && styles.iconActive]}>
                <Ionicons name="add-circle-outline" size={24} color={focused ? 'white' : '#4a3b47'} />
              </View>
            ),
          }}
        />
       
        <Tabs.Screen
          name="ComplainsScreen"
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={[styles.iconContainer, focused && styles.iconActive]}>
                <Ionicons name="document-text-outline" size={24} color={focused ? 'white' : '#4a3b47'} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="Settings"
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={[styles.iconContainer, focused && styles.iconActive]}>
                <Ionicons name="settings-outline" size={24} color={focused ? 'white' : '#4a3b47'} />
              </View>
            ),
          }}
        />
      </Tabs>
    </PaperProvider> 
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#fdeef4',
    height: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  iconContainer: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  iconActive: {
    backgroundColor: '#800080',
  },
});
