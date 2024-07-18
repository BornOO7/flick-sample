import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CameraScreen from './src/screens/CameraScreen';
import FeedScreen from './src/screens/FeedScreen';
import { Text, StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();

const TabBarLabel = ({ focused, title }: { focused: boolean, title: string }) => (
  <Text style={[styles.tabBarLabel, focused && styles.tabBarLabelFocused]}>{title}</Text>
);

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarLabel: ({ focused }) => (
            <TabBarLabel focused={focused} title={route.name} />
          ),
        })}
      >
        <Tab.Screen name="Camera" component={CameraScreen} />
        <Tab.Screen name="Feed" component={FeedScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBarLabel: {
    fontSize: 12,
    color: 'gray',
  },
  tabBarLabelFocused: {
    color: 'goldenrod',
  },
});

export default App;
