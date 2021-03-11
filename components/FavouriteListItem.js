import React, {useContext, useState} from 'react';
import PropTypes from 'prop-types';
import {colors, uploadsUrl} from '../utils/variables';
import {Avatar, ListItem as RNEListItem, Text} from 'react-native-elements';
import {TouchableOpacity} from 'react-native';
import {useFavourite} from '../hooks/ApiHooks';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import {View} from 'react-native';
import {MainContext} from '../contexts/MainContext';

const FavouriteListItem = ({singleMedia, navigation}) => {
  const [iconStatus, setIconStatus] = useState(singleMedia.favourite);

  const {user} = useContext(MainContext);

  const {postFavourite, deleteFavourite} = useFavourite();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Job Offer', {file: singleMedia});
      }}
    >
      <RNEListItem bottomDivider>
        <Avatar
          size="large"
          rounded
          source={{uri: uploadsUrl + singleMedia.thumbnails.w160}}
        />
        <RNEListItem.Content>
          <RNEListItem.Title h4>
            <Text>{singleMedia.title}</Text>
            {singleMedia.job && (
              <>
                {singleMedia.payMethod === 'contractSalary' ? (
                  <Text style={{fontSize: 18, color: '#7C7C79'}}>
                    {!user.employer ? ` (${singleMedia.wage}$)` : ''}
                  </Text>
                ) : (
                  <Text style={{fontSize: 18, color: '#7C7C79'}}>
                    {!user.employer ? ` (${singleMedia.wage}$/h)` : ''}
                  </Text>
                )}
              </>
            )}
          </RNEListItem.Title>
          <RNEListItem.Subtitle>
            {singleMedia.userinfo.full_name}
          </RNEListItem.Subtitle>
          <View style={{flexDirection: 'row', paddingTop: 5}}>
            <RNEListItem.Subtitle style={{flex: 1}}>
              <Ionicons name={'location-outline'} />
              {` ${singleMedia.text}`}
            </RNEListItem.Subtitle>
            <RNEListItem.Subtitle style={{flex: 1}}>
              <Ionicons name={'time-outline'} />
              {` ${moment(singleMedia.time_added).format('MMM D, h:mm')}`}
            </RNEListItem.Subtitle>
          </View>
        </RNEListItem.Content>

        <TouchableOpacity
          onPress={async () => {
            if (singleMedia.favourite === true) {
              try {
                const favourite = await deleteFavourite(singleMedia.file_id);
                singleMedia.favourite = false;
                setIconStatus(false);
                // console.log('favourite deleted', favourite);
              } catch (error) {
                console.error(error.message);
              }
            } else {
              try {
                const favourite = await postFavourite({
                  file_id: singleMedia.file_id,
                });
                singleMedia.favourite = true;
                setIconStatus(true);
                // console.log('favourite posted', favourite);
              } catch (error) {
                console.error(error.message);
              }
            }
          }}
        >
          <Ionicons
            name={iconStatus ? 'star' : 'star-outline'}
            size={25}
            color={colors.primary}
          />
        </TouchableOpacity>
      </RNEListItem>
    </TouchableOpacity>
  );
};

FavouriteListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
};

export default FavouriteListItem;
