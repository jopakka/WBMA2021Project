import React from 'react';
import {Text, View} from 'react-native';
import PropTypes from 'prop-types';
import List from '../components/List';

const Home = ({navigation}) => {
  return (
    <View>
      <Text>Home page</Text>
      <List navigation={navigation} />
    </View>
  );
};

Home.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default Home;
