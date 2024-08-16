import React from 'react';
import {
  createStackNavigator,
  StackCardInterpolationProps,
} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import OnboardingPage from '../screens/OnboardingPage';
import MainPage from '../screens/MainPage';
import SearchPage from '../screens/SearchPage';
import SearchResultPage from '../screens/SearchResultPage';
import SearchDetailTransportPage from '../screens/SearchDetailTransportPage';
import SearchDetailModificationPage from '../screens/SearchDetailModificationPage';
import RouteTransportPage from '../screens/RouteTransportPage';
import RouteWheelchairPage from '../screens/RouteWheelchairPage';
import useCurrentLocation from 'hooks/currentLocation/useCurrentLocation';

const Stack = createStackNavigator();

const AppNavigator = () => {
  useCurrentLocation();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Main"
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator: ({current}: StackCardInterpolationProps) => ({
            cardStyle: {
              opacity: current.progress,
            },
          }),
        }}>
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
