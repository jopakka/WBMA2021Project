import React, {useContext, useState} from 'react';
import {FlatList} from 'react-native';
import {useLoadMedia} from '../hooks/ApiHooks';
import ListItem from './ListItem';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';

const List = ({navigation, location = {}}) => {
  const mediaArray = useLoadMedia();

  const {update, setUpdate} = useContext(MainContext);

  const [refreshing, setRefreshing] = useState(false);

  const showSearch = () => {
    if (Object.keys(location).length !== 0) {
      const locationArray = [];
      for (const element of mediaArray) {
        if (element.text === location.text) {
          locationArray.push(element);
        }
      }
      return locationArray;
    } else {
      // console.log(mediaArray);
      return mediaArray;
    }
  };

  return (
    <FlatList
      onRefresh={() => {
        setRefreshing(true);
        setUpdate(!update);
        setRefreshing(false);
      }}
      refreshing={refreshing}
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
  location: PropTypes.object,
};
export default React.memo(List);
