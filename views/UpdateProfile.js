import React, {useEffect, useState} from 'react';
import {Text, Platform, View, Alert, ScrollView, Switch} from 'react-native';
import PropTypes from 'prop-types';
import {Button, Card, Input} from 'react-native-elements';
import {useContext} from 'react';
import {MainContext} from '../contexts/MainContext';
import {StyleSheet} from 'react-native';
import useProfileForm from '../hooks/ProfileHooks';
import * as ImagePicker from 'expo-image-picker';
import {useUser} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UpdateProfile = ({navigation}) => {
  const {user, setUser} = useContext(MainContext);
  const {updateUser} = useUser();
  const {inputs, handleInputChange, errors, setInputs} = useProfileForm();
  const [file, setFile] = useState();
  const [employer, setEmployer] = useState(false);
  const [loading, setLoading] = useState(false);

  const pickFile = async () => {
    const options = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      aspect: [1, 1],
    };

    let result = null;

    try {
      const perm = await askMedia();
      if (!perm) return;
      result = await ImagePicker.launchImageLibraryAsync(options);
    } catch (e) {
      console.error('pickImage', e.message);
    }

    // console.log('result', result);

    if (!result.cancelled) {
      setFile(result);
      console.log('file', result);
    }
  };

  const askMedia = async () => {
    if (Platform.OS !== 'web') {
      const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Sorry, we need camera roll permissons to make this work!');
        return false;
      }
    }
    return true;
  };

  const doCancel = () => {
    navigation.pop();
  };

  const doUpdate = async () => {
    setLoading(true);
    const otherData = {
      employer: employer,
      full_name: inputs.full_name,
    };

    const data = {
      full_name: JSON.stringify(otherData),
    };

    const newUser = {
      ...user,
      ...otherData,
    };

    // console.log('new user', newUser);

    try {
      const token = await AsyncStorage.getItem('userToken');
      const result = await updateUser(data, token);
      console.log('doUpdate', result);
      setUser(newUser);
      navigation.pop();
    } catch (e) {
      console.error('doUpdate', e.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleEmployer = () => setEmployer(!employer);

  useEffect(() => {
    // console.log('UpdateProfile', user);
    setInputs({
      full_name: user.full_name,
    });
    setFile({uri: 'http://placekitten.com/150'});
    setEmployer(user.employer);
  }, []);

  return (
    <ScrollView>
      <Card>
        <View style={styles.imgHolder}>
          {file && (
            <Card.Image
              source={{uri: file.uri}}
              style={styles.img}
              onPress={pickFile}
            />
          )}
        </View>
        <Text style={styles.desc}>Username</Text>
        <Text style={styles.userInfo}>{user.username}</Text>
        <Text style={styles.desc}>Full name</Text>
        <Input
          value={inputs.full_name}
          placeholder="Min. 3 characters"
          onChangeText={(txt) => handleInputChange('full_name', txt)}
          errorMessage={errors.full_name}
        />
        <View style={styles.switchGroup}>
          <Text style={styles.desc}>Employer</Text>
          <Switch value={employer} onValueChange={toggleEmployer} />
        </View>

        <Card.Divider style={styles.divider} />
        <Button
          buttonStyle={styles.btnCancel}
          title="Cancel"
          onPress={doCancel}
        />
        <Button title="Update" onPress={doUpdate} loading={loading} />
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  cardInfo: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  divider: {
    marginTop: 15,
  },
  img: {
    height: 150,
    width: 150,
    aspectRatio: 1,
    borderRadius: 75,
  },
  imgHolder: {
    alignItems: 'center',
  },
  desc: {
    fontWeight: 'bold',
  },
  userInfo: {
    fontSize: 20,
    marginBottom: 10,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  btn: {
    flexGrow: 1,
  },
  btnCancel: {
    backgroundColor: 'red',
    marginBottom: 10,
  },
  switchGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

UpdateProfile.propTypes = {
  navigation: PropTypes.object,
};

export default UpdateProfile;
