import React, {useContext, useEffect} from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import PropTypes from 'prop-types';
import {colors} from '../utils/variables';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser} from '../hooks/ApiHooks';
import {StatusBar} from 'expo-status-bar';

const SplashScreen = ({navigation}) => {
  const {setIsLoggedIn, setUser, setFirstLoad} = useContext(MainContext);
  const {checkToken} = useUser();

  const getToken = async () => {
    const startTime = Date.now();
    const minWait = 2000;
    const userToken = await AsyncStorage.getItem('userToken');
    console.log('token', userToken);
    if (userToken) {
      try {
        const userData = await checkToken(userToken);
        await wait(minWait, startTime);
        console.log('time', Date.now() - startTime);
        setIsLoggedIn(true);
        setUser(userData);
      } catch (error) {
        console.log('token check failed', error.message);
      } finally {
        setFirstLoad(false);
      }
    } else {
      await wait(minWait, startTime);
      setFirstLoad(false);
    }
  };

  const wait = (minWait, startTime) => {
    const elapsedTime = Date.now() - startTime;
    if (minWait > elapsedTime) {
      return new Promise((resolve) =>
        setTimeout(resolve, minWait - elapsedTime)
      );
    }
  };

  useEffect(() => {
    wait();
    getToken();
  }, []);

  return (
    <View style={styles.centered}>
      <Text style={styles.title}>Officium</Text>
      <ActivityIndicator size={60} color={colors.accent} />
      <StatusBar style="light" backgroundColor={colors.statusbar} />
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  title: {
    fontSize: 60,
    color: 'white',
  },
});

SplashScreen.propTypes = {
  navigation: PropTypes.object,
};

export default SplashScreen;
