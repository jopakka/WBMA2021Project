import React from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import {StatusBar} from 'expo-status-bar';
import FavouriteList from '../components/FavouriteList';

const Favourite = ({navigation}) => {
  return (
    <View>
      <FavouriteList navigation={navigation} />
      <StatusBar style="light" backgroundColor="#998650" />
    </View>
  );
};

Favourite.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default Favourite;
