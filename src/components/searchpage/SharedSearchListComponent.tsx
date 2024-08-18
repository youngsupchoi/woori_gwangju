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
import {TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

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
  const navigation = useNavigation();

  const handlePress = (item: any) => {
    navigation.navigate('SearchResult', {
      latitude: item.frontLat,
      longitude: item.frontLon,
      name: item.name,
      address: item.newAddressList?.newAddress[0].fullAddressRoad,
    } as {latitude: any; longitude: any; name: any; address: any});
  };

  const highlightText = (text: string = '', highlight: string = '') => {
    if (!highlight || !text.includes(highlight)) {
      return (
        <View>
          <Text fontSize={18} fontWeight={'regular'} p={0} isTruncated>
            {text}
          </Text>
        </View>
      );
    }

    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <Text
          key={index}
          fontSize={'18px'}
          fontWeight={'regular'}
          color="blue.500"
          p={0}
          isTruncated>
          {part}
        </Text>
      ) : (
        <Text
          key={index}
          fontSize={'18px'}
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
            <TouchableOpacity onPress={() => handlePress(item)}>
              <HStack space={2} px={4} py={2} alignItems={'flex-start'}>
                <Image
                  source={iconSource}
                  alt="icon"
                  width={'20px'}
                  height={'20px'}
                />
                <VStack
                  justifyContent="space-between"
                  alignItems="flex-start"
                  flex={1}
                  w={'100%'}>
                  <HStack
                    flex={1}
                    maxW={'100%'}
                    _text={{overflow: 'hidden', ellipsizeMode: 'tail'}}>
                    <View maxW={'80%'} flexDir={'row'} overflow={'hidden'}>
                      {highlightText(item.name, highlightKeyword)}
                    </View>
                    {item.distance && (
                      <View
                        px={2}
                        ml={2}
                        bg={'#F1F3F5'}
                        borderRadius={'sm'}
                        alignItems={'center'}
                        justifyContent={'center'}>
                        <Text
                          color="gray.500"
                          fontWeight={'semibold'}
                          fontSize={'12px'}
                          isTruncated>
                          {item.distance}km
                        </Text>
                      </View>
                    )}
                  </HStack>
                  {item.newAddressList && (
                    <Text color="#889096" isTruncated>
                      {item.newAddressList?.newAddress[0].fullAddressRoad}
                    </Text>
                  )}
                </VStack>
              </HStack>
            </TouchableOpacity>
            <Divider />
          </VStack>
        ))}
      </ScrollView>
    </View>
  );
};

export default SharedSearchListComponent;
