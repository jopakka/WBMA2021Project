import React from 'react';
import {StyleSheet, Text} from 'react-native';
import PropTypes from 'prop-types';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Image} from 'react-native-elements';
import {uploadsUrl} from '../utils/variables';

const SingleJob = ({route}) => {
  const {file} = route.params;
  console.log(file);
  return (
    <SafeAreaView style={styles.container}>
      <Text>{file.title}</Text>
      <Image
        source={{uri: uploadsUrl + file.filename}}
        style={{width: '90%', height: '80%'}}
        resizeMode="contain"
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
  },
  description: {
    marginBottom: 10,
  },
});

SingleJob.propTypes = {
  route: PropTypes.object,
};

export default SingleJob;
