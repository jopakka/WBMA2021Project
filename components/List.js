import React, {useContext} from 'react';
import {FlatList, Text} from 'react-native';
import {useLoadMedia} from '../hooks/ApiHooks';
import ListItem from './ListItem';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import TextBoxStyles from '../styles/TextBoxStyles';

const List = ({navigation, location = {}, myFilesOnly}) => {
  const mediaArray = useLoadMedia(myFilesOnly);

  const {update, setUpdate} = useContext(MainContext);
  const {refresh, setRefresh} = useContext(MainContext);

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
        setRefresh(true);
        setUpdate(!update);
      }}
      ListEmptyComponent={
        <Text style={[TextBoxStyles.text, {margin: 20}]}>
          This place seems to be empty, how about posting something
        </Text>
      }
      refreshing={refresh}
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
  myFilesOnly: PropTypes.bool,
};
export default React.memo(List);
