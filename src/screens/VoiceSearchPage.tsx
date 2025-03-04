import React, {useState, useEffect} from 'react';
import {VStack, Text, Spinner, Button, Image, View} from 'native-base';
import FastImage from 'react-native-fast-image'; // FastImage 사용
import Voice from '@react-native-voice/voice';
import {useRecoilState} from 'recoil';
import {searchKeywordState} from 'state/SearchAtoms';
import {useNavigation} from '@react-navigation/native';
import voiceAnimation from 'assets/gif/Waiting2.gif';
import loadingAnimation from 'assets/gif/LoadingAnimation.gif';
import closeIcon from 'assets/images/closeIcon.png';
import micBtn from 'assets/images/micBtn.png';

const VoiceSearchPage = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recognizedText, setRecognizedText] = useState<string>('');
  const [, setSearchKeyword] = useRecoilState(searchKeywordState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigation = useNavigation();

  const startRecording = () => {
    setIsRecording(true);
    setIsLoading(true);
    Voice.start('ko-KR'); // 한국어 음성 인식 시작
  };

  const stopRecording = () => {
    setIsRecording(false);
    Voice.stop();
  };

  useEffect(() => {
    // 음성 인식 이벤트 리스너 등록
    Voice.onSpeechStart = () => {
      setIsLoading(true);
      setRecognizedText('');
    };

    Voice.onSpeechEnd = () => {
      setIsLoading(false);
    };

    Voice.onSpeechResults = (event: any) => {
      const text = event.value[0];
      setRecognizedText(text);
      setSearchKeyword(text);
      setIsLoading(false);

      // 2초 후 검색 결과 페이지로 이동
      setTimeout(() => {
        setRecognizedText('');
        navigation.navigate('Search');
        stopRecording();
      }, 2000);
    };

    Voice.onSpeechError = (event: any) => {
      console.error('Speech Recognition Error:', event.error);
      setIsLoading(false);

      // 오류 발생 시 타임아웃 오류를 처리하고 다시 음성 인식 시작
      if (event.error?.code === '203') {
        // 타임아웃 발생 시 음성 인식을 재시작
        setTimeout(() => {
          startRecording();
        }, 1000);
      } else {
        // 다른 오류 처리
        alert('음성 인식 오류가 발생했습니다. 다시 시도해주세요.');
      }
    };

    Voice.onSpeechVolumeChanged = (event: any) => {
      console.log('Speech volume changed:', event.value);
    };

    // 컴포넌트 마운트 시 음성 인식 시작
    // startRecording();

    return () => {
      // 컴포넌트 언마운트 시 리스너 제거
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  useEffect(() => {
    console.log('recognizedText:', recognizedText);
  }, [recognizedText]);

  return (
    <VStack flex={1} alignItems="center" justifyContent="center" bg="#1C2024">
      {/* 음성 인식 결과에 따라 다른 화면 렌더링 */}
      {recognizedText === '' ? (
        <VStack
          alignItems="center"
          w={'100%'}
          flex={5}
          justifyContent={'center'}
          borderBottomRadius={20}
          pt={16}
          bg={'#fff'}>
          <FastImage
            source={voiceAnimation}
            style={{width: 260, height: 260}} // 스타일로 크기 설정
            resizeMode={FastImage.resizeMode.contain} // 크기에 맞게 조정
          />
          <Text
            fontFamily={'mono'}
            fontSize="24px"
            fontWeight="semibold"
            color="#1A1A1A">
            목적지를 말씀해주세요
          </Text>
          <Text
            fontFamily={'mono'}
            fontSize="36px"
            fontWeight="bold"
            color="#3D7BF6"
            mt={2}>
            "광주광역시청"
          </Text>
          {isLoading ? (
            <View>
              <FastImage
                source={loadingAnimation}
                style={{width: 60, height: 60}} // 스타일로 크기 설정
                resizeMode={FastImage.resizeMode.contain} // 크기에 맞게 조정
              />
            </View>
          ) : (
            <Button
              variant={'ghost'}
              onPress={isRecording ? stopRecording : startRecording}
              justifyContent="center"
              alignItems="center">
              <Image
                source={isRecording ? micBtn : micBtn}
                alt="mic"
                size="lg"
              />
            </Button>
          )}
        </VStack>
      ) : isLoading ? (
        <VStack
          alignItems="center"
          w={'100%'}
          flex={5}
          justifyContent={'center'}
          borderBottomRadius={20}
          bg={'#34383B'}>
          <Text
            fontFamily={'mono'}
            fontSize="36px"
            fontWeight="bold"
            color="#FFFFFF"
            mb={4}>
            {recognizedText}
          </Text>

          <Image
            source={loadingAnimation}
            alt="cancel"
            size=""
            w={'60px'}
            h={'60px'}
          />
        </VStack>
      ) : (
        <VStack
          alignItems="center"
          w={'100%'}
          flex={5}
          justifyContent={'center'}
          borderBottomRadius={20}
          bg={'#34383B'}>
          <Text
            fontFamily={'mono'}
            fontSize="30px"
            fontWeight="bold"
            color="#8EC8F6"
            mb={4}>
            "{recognizedText}"
          </Text>
          <Text
            fontFamily={'mono'}
            fontSize="20px"
            fontWeight="semibold"
            color="#FFFFFF">
            으로 검색 중이에요
          </Text>

          <Image
            source={loadingAnimation}
            alt="cancel"
            size=""
            w={'60px'}
            h={'60px'}
          />
          <Text
            fontFamily={'mono'}
            fontSize="24px"
            fontWeight="semibold"
            color="#FFFFFF"
            mt={2}>
            잠시만 기다려주세요
          </Text>
        </VStack>
      )}

      {/* 하단 취소 버튼 */}
      <View flex={1}>
        <Button
          onPress={() => {
            stopRecording();
            navigation.goBack();
          }}
          borderRadius="full"
          bg="#ffffff"
          justifyContent="center"
          alignItems="center"
          _pressed={{backgroundColor: 'transparent'}}
          mt={8}>
          <Image
            source={closeIcon}
            alt="cancel"
            size="lg"
            w={'20px'}
            h={'20px'}
          />
        </Button>
      </View>
    </VStack>
  );
};

export default VoiceSearchPage;
