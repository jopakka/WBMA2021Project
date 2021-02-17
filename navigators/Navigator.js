import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {
  getFocusedRouteNameFromRoute,
  NavigationContainer,
} from '@react-navigation/native';
import Home from '../views/Home';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabScreen = () => {
  return (
    <Tab.Navigator
      // screenOptions={({route}) => ({
      //   tabBarIcon: ({focused, color, size}) => {
      //     let iconName;
      //     if (route.name === 'Home') {
      //       iconName = focused ? 'home' : 'home-outline';
      //     } else if (route.name === 'Profile') {
      //       iconName = focused ? 'person' : 'person-outline';
      //     } else if (route.name === 'Upload') {
      //       iconName = focused ? 'cloud-upload' : 'cloud-upload-outline';
      //     } else if (route.name === 'My Files') {
      //       iconName = focused ? 'images' : 'images-outline';
      //     }
      //     return <Ionicons name={iconName} size={size} color={color} />;
      //   },
      // })}
      tabBarOptions={{
        activeTintColor: 'orange',
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name="Home" component={Home} />
    </Tab.Navigator>
  );
};

const StackScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={TabScreen}
        options={({route}) => ({
          headerTitle: getFocusedRouteNameFromRoute(route),
        })}
      />
    </Stack.Navigator>
  );
};

const Navigator = () => {
  return (
    <NavigationContainer>
      <StackScreen />
    </NavigationContainer>
  );
};

export default Navigator;
