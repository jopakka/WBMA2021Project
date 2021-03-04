import React, {useContext} from 'react';
import {FlatList} from 'react-native';
import {useLoadMedia} from '../hooks/ApiHooks';
import ListItem from './ListItem';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';

const List = ({navigation}) => {
  const {selectedLocation} = useContext(MainContext);
  console.log('selectedLocation', selectedLocation);
  const mediaArray = useLoadMedia();

  const showSearch = () => {
    const joku = [];
    if (Object.keys(selectedLocation).length !== 0) {
      for (const element of mediaArray) {
        if (element.text === selectedLocation.text) {
          joku.push(element);
        }
      }
      console.log('array', joku);
      return joku.reverse();
    } else {
      return mediaArray.reverse();
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
export default List;
