import React, {useEffect} from 'react';
import {VStack, ScrollView, View} from 'native-base';
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
import WalkRouteComponent from 'components/routepage/WalkRouteComponent';

const TMAP_API_KEY = Config.TMAP_API_KEY;

const RoutePage = () => {
  const [currentLocation] = useRecoilState(locationState);
  const [startPointState, setStartPointState] = useRecoilState(StartPointState);
  const [destinationState] = useRecoilState(DestinationState);
  const [selectedMethodState] = useRecoilState(SelectedMethodState);
  const [routeList, setRouteList] = useRecoilState(RouteListState);

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
        console.log(address);
      }
    } catch (error) {
      console.error('Error fetching address from coordinates:', error);
    }
  };

  const fetchRoutes = async () => {
    try {
      console.log(
        startPointState.longitude,
        startPointState.latitude,
        destinationState.longitude,
        destinationState.latitude,
      );
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

      console.log(response.data.metaData);
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
    if (currentLocation.latitude && currentLocation.longitude) {
      // 첫 번째 API 호출
      fetchAddressFromCoordinates(
        currentLocation.latitude,
        currentLocation.longitude,
      );

      // 3초 지연 후 두 번째 API 호출
      setTimeout(() => {
        fetchRoutes();
      }, 10000);
    }
  }, [currentLocation, setStartPointState]);

  return (
    <VStack flex={1} bg="white">
      <RouteHeader />
      <RouteInfoComponent />
      <ScrollView flex={1}>
        {selectedMethodState === '휠체어' ? (
          <>
            <MethodFilterComponent />
            <WalkRouteComponent />
          </>
        ) : (
          <>
            <MethodFilterComponent />
            {/* 경로 리스트 렌더링 */}
            {console.log(routeList)}
            <RouteListComponent />
          </>
        )}
      </ScrollView>
    </VStack>
  );
};

export default RoutePage;
