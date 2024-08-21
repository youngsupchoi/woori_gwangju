import {useEffect} from 'react';
import {useRecoilState} from 'recoil';
import {RouteListState} from 'state/RouteAtoms';
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

const useFetchSubwayArrivalData = () => {
  const [routeList, setRouteList] = useRecoilState(RouteListState);

  useEffect(() => {
    const fetchAndUpdateSubwayData = async () => {
      const updatedRouteList = await Promise.all(
        routeList.map(async route => {
          const updatedLegs = await Promise.all(
            route.legs.map(async leg => {
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
              return leg;
            }),
          );

          return {
            ...route,
            legs: updatedLegs,
          };
        }),
      );

      setRouteList(updatedRouteList);
    };

    fetchAndUpdateSubwayData();
  }, []);
};

export default useFetchSubwayArrivalData;
