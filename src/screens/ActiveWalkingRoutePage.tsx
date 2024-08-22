import React from 'react';
import {Box, VStack} from 'native-base';
import {SafeAreaView} from 'react-native';
import ActiveWalkingRouteMapComponente from 'components/map/ActiveWalkingRouteMapComponent';
import ActiveWalkingRouteBottomSheetComponent from 'components/routepage/ActiveWalkingRouteBottomSheetComponent';
import {useCurrentLocationMapController} from 'hooks/mapController/useCurrentLocationMapController';

export default function ActiveWalkingRoutePage() {
  const {mapRef, setMapToCurrentLocation, onRegionChangeComplete} =
    useCurrentLocationMapController();

  return (
    <SafeAreaView style={{flex: 1}}>
      <VStack flex={1} position="relative">
        <ActiveWalkingRouteMapComponente
          mapRef={mapRef}
          onRegionChangeComplete={onRegionChangeComplete}
        />
        <Box position="absolute" bottom={0} left={0} right={0}>
          <ActiveWalkingRouteBottomSheetComponent
            setMapToCurrentLocation={setMapToCurrentLocation}
          />
        </Box>
      </VStack>
    </SafeAreaView>
  );
}
