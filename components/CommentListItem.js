import React, {useContext, useEffect} from 'react';
import PropTypes from 'prop-types';
import {Avatar, ListItem as RNEListItem} from 'react-native-elements';
import moment from 'moment';
import {MainContext} from '../contexts/MainContext';
import {Alert, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {TouchableOpacity} from 'react-native';
import {useComments} from '../hooks/ApiHooks';

const CommentListItem = ({singleComment, bottomDivider}) => {
  const {user, updateComments, setUpdateComments} = useContext(MainContext);
  const {deleteComment} = useComments();

  const doAskDelete = () => {
    Alert.alert('Are you sure', 'Do you really want to delete this comment?', [
      {
        text: 'Cancel',
      },
      {
        text: 'Delete',
        onPress: doDeleteComment,
      },
    ]);
  };

  const doDeleteComment = async () => {
    // console.log('Trying to delete comment: ' + singleComment.comment_id);
    try {
      const response = await deleteComment(singleComment.comment_id);
      console.log('deleteComment response', response);
      setUpdateComments(!updateComments);
    } catch (e) {
      console.error('Error while deleting comment', e.message);
    }
  };

  useEffect(() => {
    // console.log('comment', singleComment);
  }, []);

  return (
    <RNEListItem bottomDivider={bottomDivider} style={{marginBottom: 2}}>
      <Avatar source={{uri: singleComment.user.avatar}} rounded size="medium" />
      <RNEListItem.Content>
        <RNEListItem.Title>{singleComment.comment}</RNEListItem.Title>
        <View style={{flexDirection: 'row', paddingTop: 5}}>
          <RNEListItem.Subtitle style={{flex: 1}}>
            <Ionicons name={'person-outline'} />
            {` ${singleComment.user.full_name}`}
          </RNEListItem.Subtitle>
          <RNEListItem.Subtitle style={{flex: 1}}>
            <Ionicons name={'time-outline'} />
            {` ${moment(singleComment.time_added).format('MMM D, h:mm')}`}
          </RNEListItem.Subtitle>
        </View>
      </RNEListItem.Content>
      {user.user_id === singleComment.user_id && (
        <TouchableOpacity onPress={doAskDelete}>
          <Ionicons name="trash-outline" size={25} color="red" />
        </TouchableOpacity>
      )}
    </RNEListItem>
  );
};

CommentListItem.propTypes = {
  singleComment: PropTypes.object,
  bottomDivider: PropTypes.bool,
};

export default CommentListItem;
