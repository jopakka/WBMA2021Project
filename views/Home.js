import React from 'react';
import {Text, View} from 'react-native';
import PropTypes from 'prop-types';
import {Button} from 'react-native-elements';
import {useContext} from 'react';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import List from '../components/List';

const Home = ({navigation}) => {
  const {setIsLoggedIn} = useContext(MainContext);
  const logout = async () => {
    setIsLoggedIn(false);
    await AsyncStorage.clear();
    navigation.navigate('Login');
  };
  return (
    <View>
      <Text>Home page</Text>
      <Button title={'logout'} onPress={logout}></Button>
      <List navigation={navigation} />
    </View>
  );
};

Home.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default Home;
