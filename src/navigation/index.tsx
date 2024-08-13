// src/navigation/index.tsx
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import OnboardingPage from '../screens/OnboardingPage';
import MainPage from '../screens/MainPage';
import SearchPage from '../screens/SearchPage';
import SearchResultPage from '../screens/SearchResultPage';
import SearchDetailTransportPage from '../screens/SearchDetailTransportPage';
import SearchDetailModificationPage from '../screens/SearchDetailModificationPage';
import RouteTransportPage from '../screens/RouteTransportPage';
import RouteWheelchairPage from '../screens/RouteWheelchairPage';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Onboarding"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Onboarding" component={OnboardingPage} />
        <Stack.Screen name="Main" component={MainPage} />
        <Stack.Screen name="Search" component={SearchPage} />
        <Stack.Screen name="SearchResult" component={SearchResultPage} />
        <Stack.Screen
          name="SearchDetailTransport"
          component={SearchDetailTransportPage}
        />
        <Stack.Screen
          name="SearchDetailModification"
          component={SearchDetailModificationPage}
        />
        <Stack.Screen name="RouteTransport" component={RouteTransportPage} />
        <Stack.Screen name="RouteWheelchair" component={RouteWheelchairPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
