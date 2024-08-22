import axios, {AxiosInstance} from 'axios';

import Config from 'react-native-config';

const TMAP_API_KEY = Config.TMAP_API_KEY;

const sktAxiosInstance: AxiosInstance = axios.create({
  baseURL: 'https://apis.openapi.sk.com', // API의 기본 URL 설정
  timeout: 10000, // 요청 타임아웃 설정 (10초)
  headers: {
    'Content-Type': 'application/json', // 모든 요청에 적용될 Content-Type
    Accept: 'application/json', // 모든 요청에 적용될 Accept 헤더
    appKey: 'ag6eZGH9bZ7CwrJTriDUY4gMjtTWHf9qjsdliHs9', // API 인증을 위한 앱 키
  },
});

// 요청 인터셉터
sktAxiosInstance.interceptors.request.use(
  config => {
    console.log('Sending request to:', config.url);
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// 응답 인터셉터
sktAxiosInstance.interceptors.response.use(
  response => {
    console.log('Received response:', response);
    return response;
  },
  error => {
    console.error('Response error pede:', error);
    return Promise.reject(error);
  },
);

export default sktAxiosInstance;
