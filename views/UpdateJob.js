import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useContext, useEffect, useState} from 'react';
import {
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
import {Divider, Text} from 'react-native-elements';
import {useLocation, useMedia} from '../hooks/ApiHooks';
import {useUploadForm} from '../hooks/UploadHooks';
import {MainContext} from '../contexts/MainContext';
import LocationList from '../components/LocationList';
import GlobalStyles from '../styles/GlobalStyles';
import ListButtonElement from '../components/ListButtonElement';
import TextBoxStyles from '../styles/TextBoxStyles';
import FormTextInput from '../components/FormTextInput';
import NiceDivider from '../components/NiceDivider';
import LoadingModal from '../components/LoadingModal';

const UpdateJob = ({navigation, route}) => {
  const {file} = route.params;
  const [isUploading, setIsUploading] = useState(false);
  const [payMethod, setPayMethod] = useState([]);
  const [search, setSearch] = useState('');
  const [searchBool, setSearchBool] = useState(false);

  const {update, setUpdate} = useContext(MainContext);
  const {selectedLocation} = useContext(MainContext);

  const {updateFile} = useMedia();
  const {handleInputChange, inputs, uploadErrors, setInputs} = useUploadForm();
  const {searchLocation} = useLocation();
  const [location, setLocation] = useState({});
  const [locationArray, setLocationArray] = useState([]);

  const doUpdate = async () => {
    const otherData = {
      description: inputs.description,
      payMethod: payMethod,
      wage: inputs.wage,
      place_name: selectedLocation.place_name,
      coordinates: selectedLocation.coordinates,
      text: selectedLocation.text,
    };

    const data = {
      description: JSON.stringify(otherData),
      title: inputs.title,
    };
    console.log('data', data);
    try {
      setIsUploading(true);
      const userToken = await AsyncStorage.getItem('userToken');
      const resp = await updateFile(file.file_id, data, userToken);
      console.log('update response', resp);
      setUpdate(!update);
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Update', 'Update failed');
      console.error('update failed', error);
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const {status} = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const askReset = () => {
    Alert.alert('Confirm', 'Do you want to reset form?', [
      {text: 'Cancel'},
      {
        text: 'Reset',
        onPress: doReset,
      },
    ]);
  };

  const doReset = () => {
    setInputs({
      title: file.title,
      description: file.description,
      wage: file.wage,
      place_name: file.place_name,
    });
  };

  const fetchLocation = async (txt) => {
    try {
      const location = await searchLocation(txt);
      setLocationArray(location);
    } catch (error) {
      console.error('fetch location error', error.message);
    }
    return location;
  };
  useEffect(() => {
    console.log('search', search);
    if (search.length > 2) {
      fetchLocation(search);
    } else {
      setLocationArray([]);
    }
  }, [searchBool]);
  useEffect(() => {
    console.log('File', file);
    setInputs({
      title: file.title,
      description: file.description,
      wage: file.wage,
      payMethod: file.payMethod,
    });
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LoadingModal visible={isUploading} />
      <ScrollView contentContainerStyle={GlobalStyles.scrollView}>
        <Divider style={{height: 20, backgroundColor: '#FFF0'}} />

        <View style={[TextBoxStyles.box, TextBoxStyles.paddingBox]}>
          <Text style={[TextBoxStyles.text, TextBoxStyles.title]}>
            Job Title
          </Text>
          <FormTextInput
            autoCapitalize="words"
            placeholder="Job Title"
            value={inputs.title}
            onChangeText={(txt) => handleInputChange('title', txt)}
            errorMessage={uploadErrors.title}
          />

          <Text style={[TextBoxStyles.text, TextBoxStyles.title]}>Summary</Text>
          <FormTextInput
            placeholder="Summary Of Work"
            value={inputs.description}
            onChangeText={(txt) => handleInputChange('description', txt)}
            errorMessage={uploadErrors.description}
          />

          <Text style={[TextBoxStyles.text, TextBoxStyles.title]}>
            Payment Method
          </Text>
          <NiceDivider lineHeight={0} space={5} />
          <DropDownPicker
            defaultValue="hourlyWage"
            items={[
              {label: 'Hourly Wage', value: 'hourlyWage'},
              {label: 'Contract Salary', value: 'contractSalary'},
            ]}
            onChangeItem={(item) => {
              setPayMethod(item.value);
            }}
            containerStyle={styles.picker}
          />
          <NiceDivider lineHeight={0} space={10} />

          <Text style={[TextBoxStyles.text, TextBoxStyles.title]}>Payment</Text>
          <FormTextInput
            placeholder="0€"
            value={inputs.wage}
            onChangeText={(txt) => handleInputChange('wage', txt)}
          />

          <Text style={[TextBoxStyles.text, TextBoxStyles.title]}>
            Location
          </Text>
          <FormTextInput
            placeholder="Search for location"
            onChangeText={(txt) => {
              setSearchBool(!searchBool);
              setSearch(txt);
            }}
            value={search}
          />
          <LocationList
            content={locationArray}
            style={styles.locationList}
            myOnPress={(loc) => setLocation(loc)}
          />
          <View>
            <LocationList />
          </View>
        </View>

        <Divider style={{height: 20, backgroundColor: '#FFF0'}} />

        {/* {isUploading && <ActivityIndicator size="large" color="#0000ff" />}
        <Button
          title="Upload file"
          onPress={doUpload}
          disabled={
            uploadErrors.title !== null ||
            uploadErrors.description !== null ||
            image === null
          }
        /> */}

        <View style={TextBoxStyles.box}>
          <ListButtonElement
            text="Update job offer"
            onPress={doUpdate}
            disabled={
              uploadErrors.title !== null || uploadErrors.description !== null
            }
          />
          <NiceDivider
            space={0}
            style={{
              marginStart: 20,
              marginEnd: 20,
            }}
          />
          <ListButtonElement text="Reset form" onPress={askReset} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  add: {
    alignSelf: 'flex-end',
    backgroundColor: '#0C0F0A',
    paddingStart: 3,
    borderRadius: 5,
  },
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
  locationList: {
    position: 'relative',
    top: -20,
    marginBottom: -20,
  },
});

UpdateJob.propTypes = {
  route: PropTypes.object,
  navigation: PropTypes.object,
};

export default UpdateJob;
