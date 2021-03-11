import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import List from '../components/List';
import {StatusBar} from 'expo-status-bar';
import {SearchBar} from 'react-native-elements';
import {useLocation} from '../hooks/ApiHooks';
import LocationList from '../components/LocationList';
import {colors} from '../utils/variables';

const Home = ({navigation}) => {
  const [search, setSearch] = useState('');
  const [searchBool, setSearchBool] = useState(false);
  const [location, setLocation] = useState({});
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
    // console.log('search', search);
    if (search === undefined) return;
    if (search.length > 2) {
      fetchLocation(search);
    } else {
      setLocationArray([]);
    }
  }, [searchBool]);

  useEffect(() => {
    setSearch(location.text);
  }, [location]);

  return (
    <View style={{flex: 1}}>
      <SearchBar
        placeholder="Search job by location"
        onChangeText={(text) => {
          setSearch(text);
          setSearchBool(!searchBool);
        }}
        onClear={() => {
          setLocationArray([]);
          setSearch('');
          setLocation({});
        }}
        inputContainerStyle={{backgroundColor: colors.primary}}
        leftIconContainerStyle={{backgroundColor: colors.primary}}
        inputStyle={{backgroundColor: colors.primary, color: 'white'}}
        containerStyle={{
          backgroundColor: 'white',
          borderTopWidth: 0,
          borderBottomWidth: 0,
        }}
        searchIcon={{color: 'white'}}
        round={true}
        placeholderTextColor={'white'}
        clearIcon={{color: 'white'}}
        value={search}
      />
      <List navigation={navigation} location={location} />
      <View
        style={{
          flex: 1,
          position: 'absolute',
          left: 0,
          top: 59,
          zIndex: 100,
        }}
      >
        <LocationList
          content={locationArray}
          myOnPress={(loc) => setLocation(loc)}
        />
      </View>
      <StatusBar style="light" backgroundColor={colors.statusbar} />
    </View>
  );
};

Home.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default Home;
