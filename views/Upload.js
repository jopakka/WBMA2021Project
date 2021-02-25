import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import * as ImagePicker from 'expo-image-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import {
  Button,
  Card,
  Image,
  Input,
  SearchBar,
  Text,
} from 'react-native-elements';
import {useMedia, useTag} from '../hooks/ApiHooks';
import {useUploadForm} from '../hooks/UploadHooks';
import {MainContext} from '../contexts/MainContext';
import {appID} from '../utils/variables';

const Upload = ({navigation}) => {
  const [image, setImage] = useState(null);
  const [filetype, setFiletype] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [payMethod, setPayMethod] = useState([]);
  const [search, setSearch] = useState('');

  const {setUpdate} = useContext(MainContext);

  const {upload} = useMedia();
  const {postTag} = useTag();
  const {handleInputChange, inputs, uploadErrors, reset} = useUploadForm();

  const doUpload = async () => {
    const formData = new FormData();
    const otherData = {
      description: inputs.description,
      payMethod: payMethod,
      wage: inputs.wage,
    };

    formData.append('title', inputs.title);
    formData.append('description', JSON.stringify(otherData));

    const filename = image.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    let type = match ? `${filetype}/${match[1]}` : filetype;
    if (type === 'image/jpg') type = 'image/jpeg';
    formData.append('file', {
      uri: image,
      name: filename,
      type: type,
    });

    console.log('Formdata information', formData);

    try {
      setIsUploading(true);
      const userToken = await AsyncStorage.getItem('userToken');
      const resp = await upload(formData, userToken);
      console.log('upload response', resp);

      const tagResponse = await postTag(
        {file_id: resp.file_id, tag: appID},
        userToken
      );
      console.log('posting appID', tagResponse);
      Alert.alert(
        'Upload',
        'File is uploaded successfully',
        [
          {
            text: 'OK',
            onPress: () => {
              setUpdate(true);
              doReset();
              navigation.navigate('Home');
            },
          },
        ],
        {cancelable: false}
      );
    } catch (error) {
      Alert.alert('Upload', 'Upload failed');
      console.error('upload failed', error);
    } finally {
      setIsUploading(false);
    }
  };
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const {
          status,
        } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const pickImage = async (library) => {
    let result = null;

    const options = {
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    };

    if (library) {
      result = await ImagePicker.launchImageLibraryAsync(options);
    } else {
      result = await ImagePicker.launchCameraAsync(options);
    }

    console.log(result);

    if (!result.cancelled) {
      setFiletype(result.type);
      setImage(result.uri);
    }
  };

  const doReset = () => {
    setImage(null);
    reset();
  };

  return (
    <ScrollView>
      <KeyboardAvoidingView behavior="position" enabled>
        <Card>
          <Text h4 style={styles.title}>
            Post a Job Offer
          </Text>
          <Image source={{uri: image}} style={styles.image} />
          <Card.Divider />
          <Input
            placeholder="Job Title"
            value={inputs.title}
            onChangeText={(txt) => handleInputChange('title', txt)}
            errorMessage={uploadErrors.title}
          />
          <Input
            placeholder="Summary Of Work"
            value={inputs.description}
            onChangeText={(txt) => handleInputChange('description', txt)}
            errorMessage={uploadErrors.description}
          />
          <Text style={{textAlign: 'center'}}>Choose the type of salary</Text>
          <View style={styles.payment}>
            <View style={{flex: 1}}>
              <DropDownPicker
                placeholder="Choose payment method"
                items={[
                  {label: 'Hourly Wage', value: 'hourlyWage'},
                  {label: 'Contract Salary', value: 'contractSalary'},
                ]}
                onChangeItem={(item) => {
                  setPayMethod(item.value);
                }}
              />
            </View>
            <View style={{flex: 1}}>
              <Input
                placeholder="0$"
                value={inputs.wage}
                onChangeText={(txt) => handleInputChange('wage', txt)}
              />
            </View>
          </View>
          <SearchBar
            placeholder="Search for location"
            onChangeText={() => {}}
            value={search}
          />
          <Button title="Choose from library" onPress={() => pickImage(true)} />
          {isUploading && <ActivityIndicator size="large" color="#0000ff" />}
          <Button
            title="Upload file"
            onPress={doUpload}
            disabled={
              uploadErrors.title !== null ||
              uploadErrors.description !== null ||
              image === null
            }
          />
          <Button title="Reset" />
        </Card>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
    width: '50%',
    aspectRatio: 1,
    borderRadius: 100,
  },
  imageText: {
    flex: 2,
  },
  scrollview: {
    padding: 20,
  },
  title: {
    textAlign: 'center',
    paddingBottom: 30,
  },
  addImage: {
    flexDirection: 'row',
    padding: 20,
  },
  payment: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 40,
  },
});

Upload.propTypes = {
  navigation: PropTypes.object,
};

export default Upload;
