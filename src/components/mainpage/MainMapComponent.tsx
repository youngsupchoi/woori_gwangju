import {View} from 'native-base';
import React from 'react';

const MainMapComponent = () => {
  return (
    <View
      flex={1}
      position={'absolute'}
      top={0}
      left={0}
      right={0}
      bottom={0}
      zIndex={-1}
      bg="gray.300"
      opacity={0.5}
    />
  );
};

export default MainMapComponent;
