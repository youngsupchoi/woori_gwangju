export const useCalculateArrivalTime = (durationOfTime: number) => {
  // 한국 기준 현재 시간 가져오기

  //FIXME: 한국 시간 적용이 안 됨
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  const koreaTimeDiff = 9 * 60 * 60 * 1000;
  const koreaTime = new Date(utc + koreaTimeDiff);

  // 현재 시간에 durationOfTime을 더한 시간을 arrivalTime으로 설정
  const minutes = durationOfTime / 60;
  const arrivalTime = new Date(koreaTime.getTime() + minutes * 60000);

  // 시와 분만 string으로 추출
  const hours = arrivalTime.getHours();
  const minutesOfArrival = arrivalTime.getMinutes();

  return {
    arrivalTime: `${hours}:${minutesOfArrival}`,
    minutes,
  };
};
