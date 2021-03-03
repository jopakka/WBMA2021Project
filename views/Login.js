import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
  ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser} from '../hooks/ApiHooks';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import {Card, ListItem, Text} from 'react-native-elements';
import GlobalStyles from '../styles/GlobalStyles';
import NiceDivider from '../components/NiceDivider';
import TextBoxStyles from '../styles/TextBoxStyles';
import ListButtonElement from '../components/ListButtonElement';
import {StatusBar} from 'expo-status-bar';
import {colors} from '../utils/variables';

const Login = ({navigation}) => {
  const {setIsLoggedIn, setUser, setUserToken} = useContext(MainContext);
  const [formToggle, setFormToggle] = useState(true);
  const {checkToken} = useUser();

  const getToken = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    console.log('token', userToken);
    if (userToken) {
      try {
        const userData = await checkToken(userToken);
        setUserToken(userToken);
        setIsLoggedIn(true);
        setUser(userData);
        navigation.navigate('Home');
      } catch (error) {
        console.log('token check failed', error.message);
      }
    }
  };

  const formToggleAction = () => setFormToggle(!formToggle);

  useEffect(() => {
    getToken();
  }, []);

  return (
    <KeyboardAvoidingView
      style={GlobalStyles.droidSafeArea}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      enabled
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={GlobalStyles.scrollView}>
          <View style={styles.appTitle}>
            <Text h2>Officium</Text>
          </View>
          {formToggle ? (
            <LoginForm navigation={navigation} formToggle={formToggleAction} />
          ) : (
            <RegisterForm
              navigation={navigation}
              formToggle={formToggleAction}
            />
          )}
        </ScrollView>
      </TouchableWithoutFeedback>
      <StatusBar style="light" backgroundColor={colors.statusbar} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    padding: 12,
    flex: 1,
    justifyContent: 'space-around',
  },
  appTitle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    flex: 6,
  },
  text: {
    alignSelf: 'center',
    padding: 20,
  },
});

Login.propTypes = {
  navigation: PropTypes.object,
};

export default Login;
