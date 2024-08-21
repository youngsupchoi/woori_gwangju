import {useEffect} from 'react';
import {useRecoilState} from 'recoil';
import {RouteListState} from 'state/RouteAtoms';
import axios from 'axios';

const TAGO_API_KEY =
  'XF6TR4JT8oOCoXwVPiqzRFQ5lWsUmoqTp88Kln0ndIS6dJJtrDMQb8ZI2aE4tZKumyT+2wGF1bWesMrsguh9kg=='.replace(
    /\+/g,
    '%2B',
  );

// 각 API 호출을 위한 함수 정의
const fetchBusStopNodeId = async nodeNm => {
  const serviceKey = TAGO_API_KEY;
  const cityCode = '24';
  const nodeNmString = encodeURIComponent(String(nodeNm));

  try {
    const response = await axios.get(
      `http://apis.data.go.kr/1613000/BusSttnInfoInqireService/getSttnNoList?serviceKey=${serviceKey}&pageNo=1&numOfRows=100&_type=json&cityCode=${cityCode}&nodeNm=${nodeNmString}`,
    );

    const data = response.data;

    if (!data.response.body.items.item) {
      throw new Error('No bus stop found with the given name');
    }

    return Array.isArray(data.response.body.items.item)
      ? data.response.body.items.item
      : [data.response.body.items.item];
  } catch (error) {
    console.error('Error fetching bus stop node ID:', error);
    return [];
  }
};

const fetchBusRoutesAtStop = async nodeId => {
  const serviceKey = TAGO_API_KEY;
  const cityCode = 24;
  try {
    const response = await axios.get(
      `http://apis.data.go.kr/1613000/BusSttnInfoInqireService/getSttnThrghRouteList?serviceKey=${serviceKey}&pageNo=1&numOfRows=100&_type=json&cityCode=${cityCode}&nodeid=${nodeId}`,
    );
    const data = response.data;

    return Array.isArray(data.response.body.items.item)
      ? data.response.body.items.item
      : [data.response.body.items.item];
  } catch (error) {
    console.error('Error fetching bus routes at stop:', error);
    return [];
  }
};

const fetchBusArrivalInfo = async (nodeId, routeId) => {
  const serviceKey = TAGO_API_KEY;
  const cityCode = 24;
  try {
    const response = await axios.get(
      `http://apis.data.go.kr/1613000/ArvlInfoInqireService/getSttnAcctoSpcifyRouteBusArvlPrearngeInfoList?serviceKey=${serviceKey}&pageNo=1&numOfRows=100&_type=json&cityCode=${cityCode}&nodeId=${nodeId}&routeId=${routeId}`,
    );
    const data = response.data;
    const arrivalInfo = data.response.body.items.item;
    console.log('3', arrivalInfo);

    return Array.isArray(arrivalInfo) ? arrivalInfo : [arrivalInfo];
  } catch (error) {
    console.error('Error fetching bus arrival info:', error);
    return [];
  }
};

// 임시 스크립트
const useFetchBusArrivalData = () => {
  const [routeList, setRouteList] = useRecoilState(RouteListState);

  useEffect(() => {
    const fetchAndUpdateBusData = async () => {
      const updatedRouteList = await Promise.all(
        routeList.map(async route => {
          const updatedLegs = await Promise.all(
            route.legs.map(async leg => {
              if (leg.mode === 'BUS') {
                const busStops = await fetchBusStopNodeId(leg.start.name);

                if (busStops.length > 0) {
                  // 모든 정류소를 순회하면서 처리
                  for (const stop of busStops) {
                    const nodeId = stop.nodeid;

                    const busRoutes = await fetchBusRoutesAtStop(nodeId);

                    const legRouteNumber = leg.route?.match(/\d+/)?.[0]; // 경로에서 숫자만 추출

                    console.log(
                      busRoutes.map(busRoute => busRoute.routeno),
                      legRouteNumber,
                    );

                    const matchedRoutes = busRoutes.filter(route => {
                      const routeno = route.routeno;
                      const routeNumberInRouteNo = routeno.match(/\d+/)?.[0]; // routeno에서 숫자만 추출

                      // 숫자만 추출한 값이 legRouteNumber와 일치하는지 확인
                      return routeNumberInRouteNo === legRouteNumber;
                    });

                    console.log(matchedRoutes);

                    for (const matchedRoute of matchedRoutes) {
                      const arrivalDataArray = await fetchBusArrivalInfo(
                        nodeId,
                        matchedRoute.routeid,
                      );

                      // 도착 정보를 처리하여 조건에 맞는 데이터를 반환
                      for (const arrivalData of arrivalDataArray) {
                        if (arrivalData) {
                          return {
                            ...leg,
                            arrprevstationcnt: arrivalData.arrprevstationcnt,
                            arrtime: arrivalData.arrtime,
                            vehicletp: arrivalData.vehicletp,
                          };
                        }
                      }
                    }
                  }
                }
              }
              // 만약 'BUS'가 아니라면 leg를 그대로 반환
              return leg;
            }),
          );

          return {
            ...route,
            legs: updatedLegs,
          };
        }),
      );

      console.log(updatedRouteList);

      // 업데이트된 routeList를 Recoil 상태로 반영
      setRouteList(updatedRouteList);
    };

    fetchAndUpdateBusData();
  }, []);
};

export default useFetchBusArrivalData;
