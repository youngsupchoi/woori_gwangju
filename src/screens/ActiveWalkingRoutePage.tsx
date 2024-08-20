import React from 'react';
import {Box, VStack} from 'native-base';
import {SafeAreaView} from 'react-native';
import ActiveWalkingRouteMapComponente from 'components/map/ActiveWalkingRouteMapComponent';
import ActiveRouteInfoBottomSheet from 'screens/RouteWheelchairPage';

export default function ActiveWalkingRoutePage() {
  return (
    <SafeAreaView style={{flex: 1}}>
      <VStack flex={1} position="relative">
        <ActiveWalkingRouteMapComponente />
        <Box position="absolute" bottom={0} left={0} right={0}>
          <ActiveRouteInfoBottomSheet />
        </Box>
      </VStack>
    </SafeAreaView>
  );
}
