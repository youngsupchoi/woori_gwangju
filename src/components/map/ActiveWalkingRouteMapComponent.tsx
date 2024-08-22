import React from 'react';
import {View} from 'react-native';
import MapView, {Region} from 'react-native-maps';
// import {rederCurrentLocationMarker} from 'components/map/marker/CurrentLocationMaker';
import {renderPolylines} from 'components/map/marker/WalkPoliLine';
import {renderMarkers} from 'components/map/marker/StartMidEndMarker';
import {locationState} from 'state/locationState';
import {useRecoilValue} from 'recoil';
import CurrentLocationMarker from 'components/map/marker/CurrentLocationMaker';

const ActiveWalkingRouteMapComponente: React.FC<{
  mapRef: React.RefObject<MapView>;
  onRegionChangeComplete: (region: Region) => void;
}> = ({mapRef, onRegionChangeComplete}) => {
  const currentLocationState = useRecoilValue(locationState);

  const initialRegion = {
    latitude: 37.556774278906374,
    longitude: 126.92164851900282,
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
        {renderMarkers()}
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
