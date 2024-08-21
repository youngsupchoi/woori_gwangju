import {useEffect} from 'react';
import {useRecoilState} from 'recoil';
import {RouteListState} from 'state/RouteAtoms';
import axios from 'axios';
import subwayStations from '../../subwayDatabase/subwayStation.json';
import subwaySchedule from '../../subwayDatabase/subwaySchedule.json';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// dayjs 플러그인 초기화
dayjs.extend(utc);
dayjs.extend(timezone);

// 한국 표준 시간대 설정
const KST = 'Asia/Seoul';

const TAGO_API_KEY =
  'XF6TR4JT8oOCoXwVPiqzRFQ5lWsUmoqTp88Kln0ndIS6dJJtrDMQb8ZI2aE4tZKumyT+2wGF1bWesMrsguh9kg=='.replace(
    /\+/g,
    '%2B',
  );

// 버스 정류소 Node ID를 가져오는 함수
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

// 정류소별 버스 노선을 가져오는 함수
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

// 버스 도착 정보를 가져오는 함수
const fetchBusArrivalInfo = async (nodeId, routeId) => {
  const serviceKey = TAGO_API_KEY;
  const cityCode = 24;
  try {
    const response = await axios.get(
      `http://apis.data.go.kr/1613000/ArvlInfoInqireService/getSttnAcctoSpcifyRouteBusArvlPrearngeInfoList?serviceKey=${serviceKey}&pageNo=1&numOfRows=100&_type=json&cityCode=${cityCode}&nodeId=${nodeId}&routeId=${routeId}`,
    );
    const data = response.data;
    const arrivalInfo = data.response.body.items.item;

    return Array.isArray(arrivalInfo) ? arrivalInfo : [arrivalInfo];
  } catch (error) {
    console.error('Error fetching bus arrival info:', error);
    return [];
  }
};

// 현재 요일을 반환하는 함수
const getCurrentDayType = (): string => {
  const dayOfWeek = dayjs().tz(KST).day(); // 한국 시간 기준으로 요일 계산
  if (dayOfWeek === 6) return '토요일';
  if (dayOfWeek === 0) return '휴일';
  return '평일';
};

// 가장 가까운 지하철 시간을 반환하는 함수
const findNearestSubwayTime = (
  startStationCode: string,
  direction: number,
): string | null => {
  const currentDayType = getCurrentDayType();
  const currentTime = dayjs().tz(KST); // 한국 시간 기준으로 현재 시간 계산

  const relevantSchedules = subwaySchedule.filter(row => {
    return (
      row.요일 === currentDayType &&
      row.역사코드 === startStationCode &&
      parseInt(row['방향(상_하행)'], 10) === direction
    );
  });

  if (relevantSchedules.length === 0) {
    return null;
  }

  // 현재 시간 이후의 가장 가까운 지하철 시간 찾기
  const nearestSchedule = relevantSchedules.reduce((nearest, current) => {
    const currentArrivalTime = dayjs(
      `${dayjs().format('YYYY-MM-DD')} ${current.도착시간}`,
      'YYYY-MM-DD HH:mm',
    ).tz(KST);
    const nearestArrivalTime = dayjs(
      `${dayjs().format('YYYY-MM-DD')} ${nearest.도착시간}`,
      'YYYY-MM-DD HH:mm',
    ).tz(KST);

    if (
      currentArrivalTime.isAfter(currentTime) &&
      (nearestArrivalTime.isBefore(currentTime) ||
        currentArrivalTime.isBefore(nearestArrivalTime))
    ) {
      return current;
    }
    return nearest;
  }, relevantSchedules[0]);

  return nearestSchedule.도착시간;
};

// 남은 시간을 초 단위로 계산하는 함수
const calculateRemainingTimeInSeconds = (nearestSubwayTime: string): number => {
  const currentTime = dayjs().tz(KST);
  const subwayArrivalTime = dayjs(
    `${dayjs().format('YYYY-MM-DD')} ${nearestSubwayTime}`,
    'YYYY-MM-DD HH:mm',
  ).tz(KST);

  return subwayArrivalTime.diff(currentTime, 'second');
};

// 상하행 구분 함수
const removeWhitespace = (text: string): string => text.replace(/\s+/g, '');

const getSubwayDirection = (
  startStation: string,
  endStation: string,
): number => {
  const startStationFormatted = removeWhitespace(startStation);
  const endStationFormatted = removeWhitespace(endStation);

  const startIndex = subwayStations.findIndex(station =>
    removeWhitespace(station.name).includes(startStationFormatted),
  );

  const endIndex = subwayStations.findIndex(station =>
    removeWhitespace(station.name).includes(endStationFormatted),
  );

  if (startIndex === -1 || endIndex === -1) {
    throw new Error('Invalid station name');
  }

  return startIndex < endIndex ? 1 : 2; // 1: 상행 (녹동 -> 평동), 2: 하행 (평동 -> 녹동)
};

const useFetchArrivalData = () => {
  const [routeList, setRouteList] = useRecoilState(RouteListState);

  useEffect(() => {
    const fetchAndUpdateArrivalData = async () => {
      const updatedRouteList = await Promise.all(
        routeList.map(async route => {
          const tempLegs = await Promise.all(
            route.legs.map(async leg => {
              // SUBWAY 모드일 때 처리
              if (leg.mode === 'SUBWAY') {
                const startStation =
                  leg.passStopList?.stationList[0].stationName;
                const endStation =
                  leg.passStopList?.stationList[
                    leg.passStopList?.stationList.length - 1
                  ].stationName;

                console.log(startStation, endStation);

                // 상하행 구분
                const direction = getSubwayDirection(startStation, endStation);

                // 시작 역 코드 찾기
                const startStationData = subwayStations.find(station =>
                  removeWhitespace(station.name).includes(
                    removeWhitespace(startStation),
                  ),
                );
                const startStationCode = startStationData?.code;

                if (startStationCode) {
                  // 가장 가까운 지하철 도착 시간 찾기
                  const nearestSubwayTime = findNearestSubwayTime(
                    startStationCode,
                    direction,
                  );
                  console.log(
                    '가장 가까운 지하철 도착 시간:',
                    nearestSubwayTime,
                  );

                  if (nearestSubwayTime) {
                    // 남은 시간을 초 단위로 계산
                    const remainingTimeInSeconds =
                      calculateRemainingTimeInSeconds(nearestSubwayTime);
                    console.log('남은 시간(초):', remainingTimeInSeconds);

                    // 도착 시간을 업데이트한 leg 반환
                    return {
                      ...leg,
                      arrtime: remainingTimeInSeconds,
                      direction,
                    };
                  }
                }
              }

              // BUS 모드일 때 처리
              if (leg.mode === 'BUS') {
                const busStops = await fetchBusStopNodeId(leg.start.name);

                if (busStops.length > 0) {
                  for (const stop of busStops) {
                    const nodeId = stop.nodeid;

                    const busRoutes = await fetchBusRoutesAtStop(nodeId);

                    const legRouteNumber = leg.route?.match(/\d+/)?.[0]; // 경로에서 숫자만 추출

                    const matchedRoutes = busRoutes.filter(route => {
                      const routeno = route.routeno;
                      const routeNumberInRouteNo = routeno.match(/\d+/)?.[0]; // routeno에서 숫자만 추출

                      return routeNumberInRouteNo === legRouteNumber;
                    });

                    for (const matchedRoute of matchedRoutes) {
                      const arrivalDataArray = await fetchBusArrivalInfo(
                        nodeId,
                        matchedRoute.routeid,
                      );

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

              // SUBWAY나 BUS 모드가 아닌 경우, 기존 leg 그대로 반환
              return leg;
            }),
          );

          // 각 route의 legs를 업데이트한 결과 반환
          return {
            ...route,
            legs: tempLegs,
          };
        }),
      );

      // 업데이트된 routeList를 Recoil 상태로 반영
      setRouteList(updatedRouteList);
    };

    fetchAndUpdateArrivalData();
  }, []);
};

export default useFetchArrivalData;
