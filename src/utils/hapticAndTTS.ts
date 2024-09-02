// hapticAndTTS.ts
import Tts from 'react-native-tts';
import HapticFeedback from 'react-native-haptic-feedback';

// 햅틱 피드백 함수의 타입 정의
export const triggerHapticFeedback = (
  type:
    | 'impactLight'
    | 'impactMedium'
    | 'impactHeavy'
    | 'notificationSuccess'
    | 'notificationWarning'
    | 'notificationError' = 'impactLight',
): void => {
  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };
  HapticFeedback.trigger(type, options);
};

export const speakText = (text: string): void => {
  Tts.speak(text);
};

export const startRouteGuidance = (): void => {
  triggerHapticFeedback();
  speakText('경로 안내를 시작합니다.');
};

export const endRouteGuidance = (): void => {
  triggerHapticFeedback();
  speakText('경로 안내를 종료합니다.');
};

export const wideViewButtonGuidance = (): void => {
  speakText('전체 경로 보기로 전환합니다.');
};

export const narrowViewButtonGuidance = (): void => {
  speakText('현재 위치 기반 경로 보기로 전환합니다.');
};

export const expectedArrivalTimeGuidance = (arrivalTime: string): void => {
  speakText(`예상 도착 시간은 ${arrivalTime} 입니다.`);
};
