import React, {useEffect} from 'react';
import {VStack, ScrollView, View, Box} from 'native-base';
import {useRecoilState, useRecoilValue} from 'recoil';
import {RouteHeader} from 'components/routepage/RouteHeader';
import RouteInfoComponent from 'components/routepage/RouteInfoComponent';
import MethodFilterComponent from '../components/routepage/MethodFilterComponent';
import RouteListComponent from '../components/routepage/RouteListComponent';
import {
  StartPointState,
  SelectedMethodState,
  RouteListState,
  DestinationState,
} from 'state/RouteAtoms';
import {locationState} from 'state/locationState';
import axios from 'axios';
import Config from 'react-native-config';
import useFetchArrivalData from 'hooks/arrivalData/useArrivalData';
import WalkingRouteBottmeSheetComponent from 'components/routepage/WalkingRouteBottomSheetComponent';
import ActiveWalkingRouteMapComponente from 'components/map/ActiveWalkingRouteMapComponent';
import {useCurrentLocationMapController} from 'hooks/mapController/useCurrentLocationMapController';
import CurrentLocationButtonComponent from 'components/map/CurrentLocationButtonComponent';
import {walkingRouteAtom} from 'state/activeWalkingRouteAtom';
import ConstraintWalkingRouteComponent from 'components/routepage/ConstraintWalkingRouteComponent';
const TMAP_API_KEY = Config.TMAP_API_KEY;

// 광주광역시의 경계값
const GWANGJU_LAT_MAX = 35.259235;
const GWANGJU_LAT_MIN = 34.958768;
const GWANGJU_LON_MIN = 126.644836;
const GWANGJU_LON_MAX = 127.028952;

const RoutePage = () => {
  const [currentLocation] = useRecoilState(locationState);
  const [startPointState, setStartPointState] = useRecoilState(StartPointState);
  const [destinationState, setDestinationState] =
    useRecoilState(DestinationState);
  const [selectedMethodState, setSelectedMethodState] =
    useRecoilState(SelectedMethodState);
  const [routeList, setRouteList] = useRecoilState(RouteListState);
  const walkingRouteState = useRecoilValue(walkingRouteAtom);

  const isOutsideGwangju = (latitude, longitude) => {
    return (
      latitude < GWANGJU_LAT_MIN ||
      latitude > GWANGJU_LAT_MAX ||
      longitude < GWANGJU_LON_MIN ||
      longitude > GWANGJU_LON_MAX
    );
  };

  const canDisplayWalkingRoute = () => {
    return !(
      walkingRouteState.features.length === 0 ||
      isOutsideGwangju(startPointState.latitude, startPointState.longitude) ||
      isOutsideGwangju(destinationState.latitude, destinationState.longitude)
    );
  };

  const fetchAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://apis.openapi.sk.com/tmap/geo/reversegeocoding?version=1&lat=${latitude}&lon=${longitude}&appKey=${TMAP_API_KEY}&format=json`,
      );
      const address = response.data?.addressInfo?.fullAddress;
      if (address) {
        setStartPointState(prevState => ({
          ...prevState,
          latitude,
          longitude,
          address,
        }));
      }
    } catch (error) {
      console.error('Error fetching address from coordinates:', error);
    }
  };

  const fetchRoutes = async () => {
    try {
      const response = await axios.post(
        'https://apis.openapi.sk.com/transit/routes',
        {
          startX: startPointState.longitude,
          startY: startPointState.latitude,
          endX: destinationState.longitude,
          endY: destinationState.latitude,
          count: 1,
          lang: 0,
          format: 'json',
        },
        {
          headers: {
            accept: 'application/json',
            appKey: TMAP_API_KEY,
            'content-type': 'application/json',
          },
        },
      );

      if (
        response.data.metaData &&
        response.data.metaData.plan &&
        response.data.metaData.plan.itineraries
      ) {
        setRouteList(response.data.metaData.plan.itineraries);
      } else {
        console.error('No route data found');
      }
    } catch (error) {
      console.error('Error fetching route data:', error);
    }
  };

  useEffect(() => {
    if (currentLocation.latitude && currentLocation.longitude) {
      fetchAddressFromCoordinates(
        currentLocation.latitude,
        currentLocation.longitude,
      );

      setTimeout(() => {
        fetchRoutes();
      }, 10000);
    }
  }, [currentLocation, setStartPointState]);

  useFetchArrivalData();

  const {mapRef, setMapToCurrentLocation, onRegionChangeComplete} =
    useCurrentLocationMapController();

  return (
    <VStack flex={1} bg="white">
      <RouteHeader />
      <RouteInfoComponent />

      {selectedMethodState === '휠체어' ? (
        canDisplayWalkingRoute() ? (
          <>
            <ActiveWalkingRouteMapComponente
              mapRef={mapRef}
              onRegionChangeComplete={onRegionChangeComplete}
            />
            <CurrentLocationButtonComponent
              onPressFunction={setMapToCurrentLocation}
              upPosition={160}
            />
            <Box position="absolute" bottom={0} left={0} right={0}>
              <WalkingRouteBottmeSheetComponent />
            </Box>
          </>
        ) : (
          <ConstraintWalkingRouteComponent />
        )
      ) : (
        <ScrollView flex={1}>
          <>
            <MethodFilterComponent />
            <RouteListComponent />
          </>
        </ScrollView>
      )}
    </VStack>
  );
};

export default RoutePage;
