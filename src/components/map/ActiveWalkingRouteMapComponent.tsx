import React from 'react';
import {View} from 'react-native';
import MapView, {Region} from 'react-native-maps';
// import {rederCurrentLocationMarker} from 'components/map/marker/CurrentLocationMaker';
import {renderPolylines} from 'components/map/marker/WalkPoliLine';
import {ActiveWalkRouteMarker} from 'components/map/marker/ActiveWalkRouteMarker';
import {locationState} from 'state/locationState';
import {useRecoilValue} from 'recoil';
import CurrentLocationMarker from 'components/map/marker/CurrentLocationMaker';
import {DestinationState} from 'state/RouteAtoms';

const ActiveWalkingRouteMapComponente: React.FC<{
  mapRef: React.RefObject<MapView>;
  onRegionChangeComplete: (region: Region) => void;
}> = ({mapRef, onRegionChangeComplete}) => {
  const currentLocationState = useRecoilValue(locationState);
  console.log('🚀 ~ currentLocationState222:', currentLocationState);
  const destinationState = useRecoilValue(DestinationState);

  const initialRegion = {
    latitude: currentLocationState.latitude - 0.0016,
    longitude: currentLocationState.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };
  return (
    <View style={{flex: 1}}>
      <MapView
        ref={mapRef}
        style={{flex: 1}}
        initialRegion={initialRegion}
        onRegionChangeComplete={onRegionChangeComplete}
        minZoomLevel={10}
        maxZoomLevel={20}
        zoomEnabled={true}
        scrollEnabled={true}
        pitchEnabled={true}
        rotateEnabled={true}>
        {renderPolylines()}
        {ActiveWalkRouteMarker()}
        {/* {rederCurrentLocationMarker(
          currentLocationState.latitude,
          currentLocationState.longitude,
        )} */}
        <CurrentLocationMarker />
      </MapView>
    </View>
  );
};

export default ActiveWalkingRouteMapComponente;
