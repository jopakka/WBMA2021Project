import React, {useEffect, useState} from 'react';
import {Text, Platform, View, Alert, ScrollView} from 'react-native';
import PropTypes from 'prop-types';
import {Button, Card, Input} from 'react-native-elements';
import {useContext} from 'react';
import {MainContext} from '../contexts/MainContext';
import {StyleSheet} from 'react-native';
import useProfileForm from '../hooks/ProfileHooks';
import * as ImagePicker from 'expo-image-picker';
import {useUser} from '../hooks/ApiHooks';

const UpdateProfile = ({navigation}) => {
  const {user} = useContext(MainContext);
  const [loading, setLoading] = useState(false);
  const {inputs, handleInputChange, errors, setInputs} = useProfileForm();
  const [file, setFile] = useState();
  const {checkIsUserAvailable} = useUser();

  const pickFile = async (library) => {
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

  const doUpdate = () => {
    Alert.alert(
      'Update',
      'This should update profile and redirect user back to profile page'
    );
  };

  useEffect(() => {
    console.log('UpdateProfile', user);
    setInputs({
      full_name: user.full_name,
    });
    setFile({uri: 'http://placekitten.com/150'});
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
        <View style={styles.buttons}>
          <Button
            containerStyle={styles.btn}
            buttonStyle={styles.btnCancel}
            title="Cancel"
            onPress={doCancel}
          />
          <Button
            containerStyle={styles.btn}
            buttonStyle={styles.btnUpdate}
            title="Update"
            onPress={doUpdate}
          />
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  cardInfo: {
    flexDirection: 'row',
    marginBottom: 15,
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
  },
  btn: {
    flexGrow: 1,
  },
  btnCancel: {
    backgroundColor: 'red',
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  btnUpdate: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
});

UpdateProfile.propTypes = {
  navigation: PropTypes.object,
};

export default UpdateProfile;
