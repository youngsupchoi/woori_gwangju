import React from 'react';
import {View, Text} from 'react-native';
import {styled} from 'nativewind';

const StyledView = styled(View);

const SearchDetailTransportPage = () => {
  return (
    <StyledView className="flex-1 p-4">
      <Text>Transport Details</Text>
      {/* Transport detail components */}
    </StyledView>
  );
};

export default SearchDetailTransportPage;
