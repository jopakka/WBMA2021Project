import React, {useContext} from 'react';
import {FlatList} from 'react-native';
import {useLoadMedia} from '../hooks/ApiHooks';
import ListItem from './ListItem';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';

const List = ({navigation}) => {
  const {selectedLocation} = useContext(MainContext);
  const mediaArray = useLoadMedia();

  const showSearch = () => {
    const locationArray = [];
    if (Object.keys(selectedLocation).length !== 0) {
      for (const element of mediaArray) {
        if (element.text === selectedLocation.text) {
          locationArray.push(element);
        }
      }
      return locationArray.reverse();
    } else {
      console.log(mediaArray);
      return mediaArray;
    }
  };

  // updating profile failes to reverse the list
  return (
    <FlatList
      data={showSearch()}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => (
        <ListItem navigation={navigation} singleMedia={item} />
      )}
    />
  );
};
List.propTypes = {
  navigation: PropTypes.object,
};
export default React.memo(List);
