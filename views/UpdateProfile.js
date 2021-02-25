import React, {useEffect, useState} from 'react';
import {Text, Platform, View, Alert, ScrollView, Switch} from 'react-native';
import PropTypes from 'prop-types';
import {CheckBox, Divider, Image, Input} from 'react-native-elements';
import {useContext} from 'react';
import {MainContext} from '../contexts/MainContext';
import {StyleSheet} from 'react-native';
import useProfileForm from '../hooks/ProfileHooks';
import * as ImagePicker from 'expo-image-picker';
import {useUser} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ListButtonElement from '../components/ListButtonElement';
import {StatusBar} from 'expo-status-bar';
import {useMedia, useTag} from '../hooks/ApiHooks';
import {appID, uploadsUrl} from '../utils/variables';

const UpdateProfile = ({navigation}) => {
  const {user, setUser} = useContext(MainContext);
  const {updateUser} = useUser();
  const {upload, getFile} = useMedia();
  const {postTag} = useTag();
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

  const doUpdate = async () => {
    setLoading(true);

    const otherData = {
      employer: employer,
      full_name: inputs.full_name,
    };

    const data = {
      email: inputs.email,
      full_name: JSON.stringify(otherData),
    };

    const newUser = {
      ...user,
      email: inputs.email,
      ...otherData,
    };

    // console.log('new user', newUser);

    try {
      const token = await AsyncStorage.getItem('userToken');

      console.log('file', file);

      if (file) {
        const formData = new FormData();
        const filename = file.uri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        let type = match ? `${file.type}/${match[1]}` : file.type;
        if (type === 'image/jpg') type = 'image/jpeg';
        formData.append('file', {
          uri: file.uri,
          name: filename,
          type: type,
        });
        formData.append('title', `avatar_${user.user_id}`);
        const fileUpload = await upload(formData, token);
        // console.log('fileUpload', fileUpload);
        const tagResponse = await postTag(
          {file_id: fileUpload.file_id, tag: `${appID}_avatar_${user.user_id}`},
          token
        );
        const fileResp = await getFile(fileUpload.file_id);
        newUser.avatar = `${uploadsUrl}${fileResp.filename}`;
      }

      // console.log('tagResponse', tagResponse);
      const result = await updateUser(data, token);
      // console.log('doUpdate', result);
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
      email: user.email,
    });
    setFile();
    setEmployer(user.employer);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <Image
        source={{
          uri: file ? file.uri : user.avatar,
        }}
        containerStyle={styles.img}
        onPress={pickFile}
      ></Image>
      <Divider style={{height: 25}} />
      <View style={[styles.box, styles.info]}>
        <Text style={[styles.infoText, styles.infoTitle]}>Full name</Text>
        <Input
          value={inputs.full_name}
          onChangeText={(text) => handleInputChange('full_name', text)}
          inputContainerStyle={styles.inputContainer}
          inputStyle={styles.input}
          errorMessage={errors.full_name}
          errorStyle={{fontSize: 14, color: 'white'}}
        />
        <Text style={[styles.infoText, styles.infoTitle]}>Email</Text>
        <Input
          value={inputs.email}
          onChangeText={(text) => handleInputChange('email', text)}
          inputContainerStyle={styles.inputContainer}
          inputStyle={styles.input}
          errorMessage={errors.email}
          errorStyle={{fontSize: 14, color: 'white'}}
        />
        <CheckBox
          checked={employer}
          title="Employer"
          onPress={toggleEmployer}
          textStyle={styles.checkText}
          containerStyle={styles.check}
          checkedColor="#E0BE36"
        />
      </View>

      <Divider style={{height: 20, backgroundColor: '#FFF0'}} />

      <View style={styles.box}>
        <ListButtonElement
          text="Update"
          onPress={doUpdate}
          disabled={loading}
        />
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
  inputContainer: {
    borderColor: '#E0BE36',
    borderBottomWidth: 3,
  },
  input: {
    color: 'white',
  },
  checkText: {
    textTransform: 'uppercase',
    color: 'white',
  },
  check: {
    backgroundColor: '#FFF0',
    borderWidth: 0,
    padding: 0,
    paddingHorizontal: 0,
  },
});

UpdateProfile.propTypes = {
  navigation: PropTypes.object,
};

export default UpdateProfile;
