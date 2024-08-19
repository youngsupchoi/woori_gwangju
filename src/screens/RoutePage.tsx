import React, {useEffect} from 'react';
import {VStack, ScrollView, View} from 'native-base';
import {useRecoilState} from 'recoil';
import {RouteHeader} from 'components/routepage/RouteHeader';
import RouteInfoComponent from 'components/routepage/RouteInfoComponent';
import MethodFilterComponent from '../components/routepage/MethodFilterComponent';
import RouteListComponent from '../components/routepage/RouteListComponent';
import {StartPointState, SelectedMethodState} from 'state/RouteAtoms';
import {locationState} from 'state/locationState';
import axios from 'axios';
import Config from 'react-native-config';

const TMAP_API_KEY = Config.TMAP_API_KEY;

const RoutePage = () => {
  const [currentLocation] = useRecoilState(locationState);
  const [, setStartPointState] = useRecoilState(StartPointState);
  const [selectedMethodState] = useRecoilState(SelectedMethodState);

  // 위치 정보 갱신
  useEffect(() => {
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

    if (currentLocation.latitude && currentLocation.longitude) {
      fetchAddressFromCoordinates(
        currentLocation.latitude,
        currentLocation.longitude,
      );
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
          </>
        ) : (
          <>
            <MethodFilterComponent />
            <RouteListComponent />
          </>
        )}
      </ScrollView>
    </VStack>
  );
};

export default RoutePage;
