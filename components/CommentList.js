import React from 'react';
import CommentListItem from './CommentListItem';
import PropTypes from 'prop-types';
import {Text} from 'react-native';

const CommentList = ({comments = []}) => {
  return (
    <>
      {comments.length !== 0 ? (
        comments.map((element, index) => {
          return (
            <CommentListItem
              key={index}
              singleComment={element}
              bottomDivider={index !== comments.length - 1}
            />
          );
        })
      ) : (
        <Text>No comments</Text>
      )}
    </>
  );
};

CommentList.propTypes = {
  comments: PropTypes.array,
};

export default CommentList;
