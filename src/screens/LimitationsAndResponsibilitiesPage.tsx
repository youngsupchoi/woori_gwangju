import React from 'react';
import {Button, Text, Image, HStack, Box, VStack} from 'native-base';
import LeftChevron from 'assets/images/leftChevron.png';
import {useNavigation} from '@react-navigation/native';
const LimitationsAndResponsibilitiesPage = () => {
  const navigation = useNavigation();
  return (
    <VStack>
      <HStack
        px={4}
        h={'56px'}
        alignItems="center"
        justifyContent="space-between"
        bg="white"
        borderBottomWidth={1}
        borderBottomColor="gray.200">
        <Button
          variant="ghost"
          onPress={() => navigation.goBack()}
          _pressed={{bg: 'white'}}>
          <Image
            source={LeftChevron}
            alt="back"
            width={'24px'}
            height={'24px'}
          />
        </Button>
        <Text
          fontSize="18"
          bold
          isTruncated
          maxWidth="80%"
          textAlign="center"
          flex={1}>
          정보 제공의 한계 및 책임
        </Text>
        <Box width="24px" />
      </HStack>
      <Box bgColor={'white'} padding={'24px'} height={'full'}>
        <Text>
          {`플랫폼 '우리, 광주'에서는 사용자 편의를 돕기 위해 도보 정보를 수집하고 이를 분석하여 가장 적합한 경로를 추천하고 있습니다.\n\n또한 장애인 분들이 안전하게 이동할 수 있는 세상을 꿈꾸며 끊임없이 노력하고 있습니다. 그러나 '이동'이라는 것은 실시간 움직임이기에 '완전한 안전'을 보장할 수는 없습니다. \n\n이와 관련하여 본 서비스에서 제공한 정보에 의해 발생하는 사고 등에 대해 당사는 법적 책임을 지지 않습니다.\n\n 횡단보도가 설치되지 않은 도로에서 최단 거리로 신속하게횡단 가능하나 자동차 전용도로, 기타 안전표지 등에 의해 금지된 경우에는 횡단 하실 수 없습니다.\n\n 목적지까지 현장 상황을 중요하게 생각하시며 안전한 이동 하시기 바랍니다.\n\n 장애인 분들이 더욱 마음 편히 이동할 수 있는 그날을 위해 저희 플랫폼이 최선을 다해 노력하겠습니다.\n\n 감사합니다.`}
        </Text>
      </Box>
    </VStack>
  );
};

export default LimitationsAndResponsibilitiesPage;
