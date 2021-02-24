import React from 'react';
import {View, Text} from 'react-native';
import PropTypes from 'prop-types';

const SingleJob = ({route}) => {
  const {file} = route.params;
  return (
    <View>
      <Text></Text>
    </View>
  );
};

SingleJob.propTypes = {
  route: PropTypes.object,
};

export default SingleJob;
