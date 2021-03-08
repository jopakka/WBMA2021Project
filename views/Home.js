import React, {useContext, useState} from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import List from '../components/List';
import {StatusBar} from 'expo-status-bar';
import {SearchBar} from 'react-native-elements';
import {MainContext} from '../contexts/MainContext';
import {useLocation} from '../hooks/ApiHooks';
import LocationList from '../components/LocationList';
import {colors} from '../utils/variables';

const Home = ({navigation}) => {
  const [search, setSearch] = useState('');
  const {setSelectedLocation} = useContext(MainContext);

  const [locationArray, setLocationArray] = useState([]);

  const {searchLocation} = useLocation();

  const fetchLocation = async (txt) => {
    try {
      const location = await searchLocation(txt);
      setLocationArray(location);
    } catch (error) {
      console.error('fetch location error', error.message);
    }
    return location;
  };

  return (
    <View>
      <SearchBar
        placeholder="Search for location"
        onChangeText={(text) => {
          setSearch(text);
          console.log('text', text);
          console.log('search', search);
          if (text.length > 2) {
            fetchLocation(text);
          }
        }}
        onClear={() => {
          setLocationArray([]);
          setSearch('');
          setSelectedLocation({});
        }}
        value={search}
      />
      <View
        style={{flex: 1, position: 'absolute', left: 0, top: 66, zIndex: 1}}
      >
        <LocationList content={locationArray} />
      </View>
      <List navigation={navigation} />
      <StatusBar style="light" backgroundColor={colors.statusbar} />
    </View>
  );
};

Home.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default Home;
