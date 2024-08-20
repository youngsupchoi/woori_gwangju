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
import useCurrentLocation from 'hooks/currentLocation/useCurrentLocation';
import VoiceSearchPage from 'screens/VoiceSearchPage';
import RoutePage from 'screens/RoutePage';
import ActiveWalkingRoutePage from 'screens/ActiveWalkingRoutePage';

const Stack = createStackNavigator();

const AppNavigator = () => {
  useCurrentLocation();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Route"
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
        <Stack.Screen name="VoiceSearch" component={VoiceSearchPage} />
        {/* VoiceSearchPage 추가 */}
        <Stack.Screen
          name="SearchDetailModification"
          component={SearchDetailModificationPage}
        />
        <Stack.Screen name="Route" component={RoutePage} />
        <Stack.Screen name="RouteTransport" component={RouteTransportPage} />
        <Stack.Screen
          name="ActiveWalkingRoutePage"
          component={ActiveWalkingRoutePage}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
