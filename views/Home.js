import React from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import List from '../components/List';
import {StatusBar} from 'expo-status-bar';
import {colors} from '../utils/variables';

const Home = ({navigation}) => {
  return (
    <View>
      <List navigation={navigation} />
      <StatusBar style="light" backgroundColor={colors.statusbar} />
    </View>
  );
};

Home.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default Home;
