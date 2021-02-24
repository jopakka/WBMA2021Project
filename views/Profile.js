import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import PropTypes from 'prop-types';
import {
  Button,
  Card,
  CheckBox,
  Divider,
  Image,
  ListItem,
  Text,
} from 'react-native-elements';
import {useContext} from 'react';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StatusBar} from 'expo-status-bar';
import {
  TouchableHighlight,
  TouchableNativeFeedback,
} from 'react-native-gesture-handler';

const Profile = ({navigation}) => {
  const {user, setIsLoggedIn} = useContext(MainContext);
  const [loading, setLoading] = useState(false);

  const doLogout = async () => {
    setLoading(true);
    setIsLoggedIn(false);
    await AsyncStorage.clear();
    navigation.navigate('Login');
    setLoading(false);
  };

  const doUpdate = () => {
    navigation.navigate('Update Profile');
  };

  useEffect(() => {
    console.log('profile', user);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <Image
        source={{uri: 'http://placekitten.com/300'}}
        containerStyle={styles.img}
      />
      <Divider style={{height: 10}} />
      <Text h4 style={styles.name}>
        {user.full_name}
      </Text>
      <Divider style={{height: 25}} />
      <View style={[styles.box, styles.info]}>
        <Text style={[styles.infoText, styles.infoTitle]}>Username</Text>
        <Text style={[styles.infoText, styles.infoDesc]}>{user.username}</Text>
        <Divider style={{height: 10, backgroundColor: '#FFF0'}} />
        <Divider style={{height: 1, backgroundColor: '#FFF'}} />
        <Divider style={{height: 10, backgroundColor: '#FFF0'}} />
        <Text style={[styles.infoText, styles.infoTitle]}>Email</Text>
        <Text style={[styles.infoText, styles.infoDesc]}>{user.email}</Text>
      </View>

      <Divider style={{height: 20, backgroundColor: '#FFF0'}} />

      <View style={styles.box}>
        <TouchableNativeFeedback onPress={doUpdate}>
          <ListItem containerStyle={styles.buttonContainer}>
            <ListItem.Content>
              <ListItem.Title style={styles.buttonText}>
                Update Profile
              </ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron color="white" size={24} />
          </ListItem>
        </TouchableNativeFeedback>
        <Divider
          style={{
            height: 1,
            backgroundColor: '#FFF',
            marginStart: 20,
            marginEnd: 20,
          }}
        />
        <TouchableNativeFeedback onPress={doLogout}>
          <ListItem containerStyle={styles.buttonContainer}>
            <ListItem.Content>
              <ListItem.Title style={styles.buttonText}>Logout</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron color="white" size={24} />
          </ListItem>
        </TouchableNativeFeedback>
      </View>

      <StatusBar style="light" backgroundColor="#998650" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    padding: 20,
    alignItems: 'center',
  },
  img: {
    width: 200,
    height: 200,
    borderRadius: 5,
  },
  name: {
    textAlign: 'center',
  },
  box: {
    width: '100%',
    backgroundColor: '#75B09C',
    borderRadius: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  info: {
    padding: 20,
  },
  infoText: {
    color: 'white',
    fontSize: 15,
  },
  infoTitle: {
    textTransform: 'uppercase',
  },
  infoDesc: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    backgroundColor: '#FFF0',
    padding: 20,
  },
  buttonText: {
    color: 'white',
  },
});

Profile.propTypes = {
  navigation: PropTypes.object,
};

export default Profile;
