import React, {useContext, useEffect} from 'react';
import PropTypes from 'prop-types';
import {Avatar, ListItem as RNEListItem} from 'react-native-elements';
import moment from 'moment';
import {MainContext} from '../contexts/MainContext';
import {Alert} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useComments} from '../hooks/ApiHooks';

const CommentListItem = ({singleComment}) => {
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
    <RNEListItem>
      <Avatar source={{uri: singleComment.user.avatar}} rounded size="medium" />
      <RNEListItem.Content>
        <RNEListItem.Title>{singleComment.comment}</RNEListItem.Title>
        <RNEListItem.Subtitle>
          Posted by: {singleComment.user.full_name}
        </RNEListItem.Subtitle>
        <RNEListItem.Subtitle>
          Posted at: {moment(singleComment.time_added).format('D.M.Y h:mm a')}
        </RNEListItem.Subtitle>
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
};

export default CommentListItem;
