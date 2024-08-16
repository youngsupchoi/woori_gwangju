import {
  Divider,
  HStack,
  Image,
  ScrollView,
  Text,
  View,
  VStack,
} from 'native-base';
import React from 'react';

const SharedSearchListComponent = ({
  data,
  iconSource,
  highlightKeyword = '',
  title,
}: {
  data: Array<any>;
  iconSource: any;
  highlightKeyword?: string;
  title?: string;
}) => {
  const highlightText = (text: string = '', highlight: string = '') => {
    if (!highlight || !text.includes(highlight)) {
      return (
        <Text fontSize={18} fontWeight={'regular'} p={0} isTruncated>
          {text}
        </Text>
      );
    }

    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <Text
          key={index}
          fontSize={18}
          fontWeight={'regular'}
          color="blue.500"
          p={0}
          isTruncated>
          {part}
        </Text>
      ) : (
        <Text
          key={index}
          fontSize={18}
          fontWeight={'regular'}
          p={0}
          m={0}
          isTruncated>
          {part}
        </Text>
      ),
    );
  };

  return (
    <View>
      {title && (
        <Text fontSize="md" bold mb={2} ml={2} mt={2} isTruncated>
          {title}
        </Text>
      )}
      <ScrollView>
        {data.map((item, index) => (
          <VStack key={index} space={2} mb={4}>
            <HStack space={2} px={4} py={2}>
              <Image source={iconSource} alt="icon" width={'6'} height={'6'} />
              <VStack justifyContent="space-between" alignItems="flex-start">
                <HStack>
                  {highlightText(item.name, highlightKeyword)}
                  {item.distance && (
                    <View
                      px={2}
                      ml={2}
                      bg={'gray.200'}
                      borderRadius={'sm'}
                      alignItems={'center'}
                      justifyContent={'center'}>
                      <Text color="gray.500" isTruncated>
                        {item.distance}km
                      </Text>
                    </View>
                  )}
                </HStack>
                {item.newAddressList && (
                  <Text color="gray.500" isTruncated>
                    {item.newAddressList?.newAddress[0].fullAddressRoad}
                  </Text>
                )}
                {console.log(
                  item.newAddressList?.newAddress[0].fullAddressRoad,
                )}
              </VStack>
            </HStack>
            <Divider />
          </VStack>
        ))}
      </ScrollView>
    </View>
  );
};

export default SharedSearchListComponent;
