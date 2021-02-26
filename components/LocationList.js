import React, {useContext} from 'react';
import {FlatList} from 'react-native';
import LocationListItem from './LocationListItem';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';

const LocationList = ({navigation}) => {
  const {locationArray} = useContext(MainContext);

  return (
    <FlatList
      data={locationArray}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => (
        <LocationListItem navigation={navigation} singleLocation={item} />
      )}
    />
  );
};
LocationList.propTypes = {
  navigation: PropTypes.object,
};
export default LocationList;
