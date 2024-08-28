import React, {useEffect} from 'react';
import {VStack, ScrollView, View, Box} from 'native-base';
import {useRecoilState} from 'recoil';
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
import {useRoute} from '@react-navigation/native'; // route 사용을 위해 추가

const TMAP_API_KEY = Config.TMAP_API_KEY;

const RoutePage = () => {
  const [currentLocation] = useRecoilState(locationState);
  const [startPointState, setStartPointState] = useRecoilState(StartPointState);
  const [destinationState] = useRecoilState(DestinationState);
  const [selectedMethodState] = useRecoilState(SelectedMethodState);
  const [routeList, setRouteList] = useRecoilState(RouteListState);
  const route = useRoute(); // route 사용을 위해 추가

  // 전달받은 startPoint 파라미터
  const {startPoint} = route.params || {};

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

  // 대중 교통 경로 가져오기
  const fetchRoutes = async () => {
    try {
      console.log(startPointState, destinationState);
      const response = await axios.post(
        'https://apis.openapi.sk.com/transit/routes',
        {
          startX: startPointState.longitude,
          startY: startPointState.latitude,
          endX: destinationState.longitude,
          endY: destinationState.latitude,
          count: 10,
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

  // 위치 정보 갱신
  useEffect(() => {
    if (startPoint) {
      // startPoint 파라미터가 있는 경우 이를 사용
      setStartPointState(startPoint);
    } else if (currentLocation.latitude && currentLocation.longitude) {
      // startPoint 파라미터가 없는 경우 현재 위치를 사용
      fetchAddressFromCoordinates(
        currentLocation.latitude,
        currentLocation.longitude,
      );
    }
  }, []);

  useEffect(() => {
    fetchRoutes();
  }, [startPointState, destinationState]);

  useFetchArrivalData();

  const {mapRef, setMapToCurrentLocation, onRegionChangeComplete} =
    useCurrentLocationMapController();

  return (
    <VStack flex={1} bg="white">
      <RouteHeader />
      <RouteInfoComponent />

      {selectedMethodState === '휠체어' ? (
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
