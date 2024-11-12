import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import BooksList from './screens/BooksList';
import BookDetail from './screens/BookDetail';
import Borrowed from './screens/Borrowed';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="BooksList" component={BooksList} options={{ title: 'Books List' }} />
      <Stack.Screen name="BookDetail" component={BookDetail} options={{ title: 'Book Detail' }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'book' : 'book-outline';
            } else if (route.name === 'Borrowed') {
              iconName = focused ? 'bookmark' : 'bookmark-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#FF5733',
          tabBarInactiveTintColor: '#888',
          tabBarStyle: {
            backgroundColor: '#ffffff',
            borderTopWidth: 0,
            elevation: 10,
            height: 60,
            paddingVertical: 8,
          },
          tabBarLabelStyle: {
            fontSize: 13,
            fontWeight: '600',
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Borrowed" component={Borrowed} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
