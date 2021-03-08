import React, {useContext, useEffect, useState} from 'react';
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
  useEffect(() => {
    console.log('search', search);
    if (search.length > 2) {
      fetchLocation(search);
    } else {
      setLocationArray([]);
    }
  }, [search]);

  return (
    <View style={{flex: 1}}>
      <SearchBar
        placeholder="Search for location"
        onChangeText={(text) => {
          setSearch(text);
        }}
        onClear={() => {
          setLocationArray([]);
          setSearch('');
          setSelectedLocation({});
        }}
        value={search}
      />
      <List navigation={navigation} />
      <View
        style={{flex: 1, position: 'absolute', left: 0, top: 66, zIndex: 100}}
      >
        <LocationList content={locationArray} />
      </View>
      <StatusBar style="light" backgroundColor={colors.statusbar} />
    </View>
  );
};

Home.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default Home;
