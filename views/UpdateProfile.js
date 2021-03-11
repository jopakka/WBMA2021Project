import React, {useEffect, useState} from 'react';
import {
  Text,
  Platform,
  View,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import PropTypes from 'prop-types';
import {CheckBox, Divider, Image} from 'react-native-elements';
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
import {appID, colors, uploadsUrl} from '../utils/variables';
import GlobalStyles from '../styles/GlobalStyles';
import TextBoxStyles from '../styles/TextBoxStyles';
import FormStyles from '../styles/FormStyles';
import FormTextInput from '../components/FormTextInput';
import LoadingModal from '../components/LoadingModal';
import NiceDivider from '../components/NiceDivider';

const UpdateProfile = ({navigation}) => {
  const {user, setUser} = useContext(MainContext);
  const {update, setUpdate} = useContext(MainContext);
  const {updateUser} = useUser();
  const {upload, getFile} = useMedia();
  const {postTag} = useTag();
  const {inputs, handleInputChange, errors} = useProfileForm();
  const [file, setFile] = useState();
  const [employer, setEmployer] = useState(false);
  const [loading, setLoading] = useState(false);

  const pickFile = async (library = true) => {
    const options = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      aspect: [1, 1],
    };

    let result = null;

    try {
      const perm = await askMedia(library);
      if (!perm) return;
      if (library) {
        result = await ImagePicker.launchImageLibraryAsync(options);
      } else {
        result = await ImagePicker.launchCameraAsync(options);
      }
    } catch (e) {
      console.error('pickImage', e.message);
    }

    // console.log('result', result);

    if (!result.cancelled) {
      setFile(result);
    }
  };

  // Check if has permission to use media library
  const askMedia = async (library) => {
    if (Platform.OS !== 'web') {
      if (library) {
        const {
          status,
        } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Sorry, we need camera roll permissons to make this work!'
          );
          return false;
        }
      } else {
        const {status} = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Sorry, we need camera permisson to make this work!');
          return false;
        }
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

    try {
      const token = await AsyncStorage.getItem('userToken');

      // If there is a file, try to upload it
      if (file) {
        const formData = new FormData();

        // Append file to formdata
        const filename = file.uri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        let type = match ? `${file.type}/${match[1]}` : file.type;
        if (type === 'image/jpg') type = 'image/jpeg';
        formData.append('file', {
          uri: file.uri,
          name: filename,
          type: type,
        });

        // Append title to formdata
        formData.append('title', `avatar_${user.user_id}`);

        // Upload file
        const fileUpload = await upload(formData, token);

        // Add tag to file
        await postTag(
          {file_id: fileUpload.file_id, tag: `${appID}_avatar_${user.user_id}`},
          token
        );

        // Get info from uploaded file
        const fileResp = await getFile(fileUpload.file_id);
        newUser.avatar = `${uploadsUrl}${fileResp.filename}`;
      }

      // Updating user
      await updateUser(data, token);
      setUser(newUser);
      navigation.pop();
    } catch (e) {
      Alert.alert('Error while updating user', e.message);
    } finally {
      setLoading(false);
      setUpdate(!update);
    }
  };

  // Toggle employer status
  const toggleEmployer = () => setEmployer(!employer);

  useEffect(() => {
    handleInputChange('full_name', user.full_name);
    handleInputChange('email', user.email);
    setFile();
    setEmployer(user.employer);
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LoadingModal visible={loading} />
      <ScrollView contentContainerStyle={GlobalStyles.scrollView}>
        <Image
          source={{
            uri: file ? file.uri : user.avatar,
          }}
          containerStyle={GlobalStyles.profileImage}
          onPress={pickFile}
        />

        <Divider style={{height: 25}} />

        <View style={TextBoxStyles.box}>
          <ListButtonElement
            text="Choose image from library"
            onPress={() => pickFile(true)}
          />
          <NiceDivider
            space={0}
            style={{
              marginStart: 20,
              marginEnd: 20,
            }}
          />
          <ListButtonElement
            text="Take a picture"
            onPress={() => pickFile(false)}
          />
        </View>

        <Divider style={{height: 20, backgroundColor: '#FFF0'}} />

        <View style={[TextBoxStyles.box, TextBoxStyles.paddingBox]}>
          <Text style={[TextBoxStyles.text, TextBoxStyles.title]}>
            Full name
          </Text>
          <FormTextInput
            autoCapitalize="words"
            placeholder="Full Name"
            value={inputs.full_name}
            onChangeText={(text) => {
              handleInputChange('full_name', text);
              console.log('errors', errors);
            }}
            errorMessage={errors.full_name}
          />

          <Text style={[TextBoxStyles.text, TextBoxStyles.title]}>Email</Text>
          <FormTextInput
            value={inputs.email}
            placeholder="Email"
            onChangeText={(text) => handleInputChange('email', text)}
            errorMessage={errors.email}
          />

          <CheckBox
            checked={employer}
            title="Employer"
            onPress={toggleEmployer}
            textStyle={FormStyles.checkText}
            containerStyle={FormStyles.check}
            checkedColor={colors.accent}
          />
        </View>

        <Divider style={{height: 20, backgroundColor: '#FFF0'}} />

        <View style={TextBoxStyles.box}>
          <ListButtonElement
            text="Update"
            onPress={doUpdate}
            disabled={errors.email !== null || errors.full_name !== null}
          />
        </View>

        <StatusBar style="light" backgroundColor={colors.statusbar} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

UpdateProfile.propTypes = {
  navigation: PropTypes.object,
};

export default UpdateProfile;
