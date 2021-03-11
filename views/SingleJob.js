import React, {useContext, useEffect, useState} from 'react';
import {Alert, Linking, ScrollView, StyleSheet, View} from 'react-native';
import PropTypes from 'prop-types';
import {
  Button,
  Card,
  Divider,
  Input,
  Text,
  ListItem as RNEListItem,
  Avatar,
} from 'react-native-elements';
import {uploadsUrl} from '../utils/variables';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser, useComments, useMedia} from '../hooks/ApiHooks';
import {parse} from '../utils/helpers';
import CommentList from '../components/CommentList';
import {MainContext} from '../contexts/MainContext';
import {TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ListButtonElement from '../components/ListButtonElement';
import GlobalStyles from '../styles/GlobalStyles';
import NiceDivider from '../components/NiceDivider';
import openMap from 'react-native-open-maps';
import moment from 'moment';

const SingleJob = ({route, navigation}) => {
  const {file} = route.params;
  const {getUser} = useUser();
  const {deleteFile} = useMedia();
  const {
    updateComments,
    setUpdateComments,
    user,
    update,
    setUpdate,
  } = useContext(MainContext);
  const {getCommentsByFile, postComment} = useComments();
  const [owner, setOwner] = useState({});
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  // console.log(owner);
  const fetchOwner = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      let userData = await getUser(file.user_id, userToken);
      userData = parse(userData, 'full_name');
      // console.log('userData', userData);
      setOwner(userData);
    } catch (error) {
      console.error('fetchOwner error in SingleJob', error.message);
    }
  };

  const fetchComments = async () => {
    try {
      const commentResponse = await getCommentsByFile(file.file_id);
      setComments(commentResponse);
    } catch (e) {
      console.error(e.message);
    }
  };

  const doSendComment = async () => {
    const tempComment = comment.trim();
    if (tempComment.length === 0) return;
    try {
      const response = await postComment(file.file_id, tempComment);
      console.log('doSendComment', response);
      setUpdateComments(!updateComments);
      setComment('');
    } catch (e) {
      console.error('doSendComment', e.message);
    }
  };

  const askDelete = () => {
    Alert.alert('Are you sure?', 'Do you want to delete this job offer?', [
      {text: 'Cancel'},
      {text: 'Delete', onPress: doDelete},
    ]);
  };

  const doDelete = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    try {
      await deleteFile(file.file_id, userToken);
      setUpdate(!update);
      navigation.pop();
    } catch (e) {
      Alert.alert('Error while deleting Post', e.message);
    }
  };

  const mailTo = () => {
    Linking.openURL(`mailto:${owner.email}`);
  };

  const contactEmp = () => {
    Alert.alert('Contact employer', 'Do you want to email?', [
      {text: 'Cancel'},
      {text: 'Email', onPress: mailTo},
    ]);
  };

  useEffect(() => {
    console.log('SingleFile', file);
    fetchOwner();
  }, []);

  useEffect(() => {
    fetchComments();
  }, [updateComments]);

  return (
    <>
      <ScrollView
        contentContainerStyle={[
          GlobalStyles.scrollView,
          {alignItems: 'stretch'},
        ]}
      >
        <RNEListItem containerStyle={{paddingVertical: 20}}>
          <Avatar
            size="large"
            rounded
            source={{uri: uploadsUrl + file.thumbnails.w160}}
          />
          <RNEListItem.Content>
            <RNEListItem.Title h4>
              <Text>{file.title}</Text>
            </RNEListItem.Title>
            <RNEListItem.Subtitle>
              {file.userinfo.full_name}
            </RNEListItem.Subtitle>
            <View style={{flexDirection: 'row', paddingTop: 5}}>
              <RNEListItem.Subtitle style={{flex: 1}}>
                <Ionicons name={'location-outline'} />
                {` ${file.text}`}
              </RNEListItem.Subtitle>
              <RNEListItem.Subtitle style={{flex: 1}}>
                <Ionicons name={'time-outline'} />
                {` ${moment(file.time_added).format('MMM D, h:mm')}`}
              </RNEListItem.Subtitle>
            </View>
          </RNEListItem.Content>
        </RNEListItem>

        {file.job && (
          <>
            <NiceDivider color="#FFF0" />

            <RNEListItem
              bottomDivider
              containerStyle={{justifyContent: 'space-between'}}
            >
              <Text style={[styles.desc, styles.descTitle]}>Salary Type</Text>
              <Text style={styles.desc}>
                {file.payMethod === 'contractSalary' ? 'Contract' : 'Hourly'}
              </Text>
            </RNEListItem>
            <RNEListItem containerStyle={{justifyContent: 'space-between'}}>
              <Text style={[styles.desc, styles.descTitle]}>Salary</Text>
              <Text style={styles.desc}>
                {file.wage} {file.payMethod === 'contractSalary' ? '$' : '$/h'}
              </Text>
            </RNEListItem>
          </>
        )}

        <NiceDivider color="#FFF0" />

        <RNEListItem
          containerStyle={{flexDirection: 'column', alignItems: 'flex-start'}}
        >
          <Text style={[styles.desc, styles.descTitle, styles.descTitleBottom]}>
            Summary
          </Text>
          <Text style={styles.desc}>{file.description}</Text>
        </RNEListItem>

        <NiceDivider color="#FFF0" />

        <RNEListItem
          containerStyle={{
            flexDirection: 'column',
            alignItems: 'stretch',
          }}
        >
          <Text style={[styles.desc, styles.descTitle]}>Comments</Text>
          <CommentList comments={comments} />
        </RNEListItem>

        <NiceDivider color="#FFF0" />

        <View style={styles.box}>
          {user.user_id === file.user_id ? (
            <>
              <ListButtonElement
                text="Update Job Offer"
                onPress={() => {
                  navigation.push('Update Job', {file});
                }}
              />
              <NiceDivider
                space={0}
                style={{
                  marginStart: 20,
                  marginEnd: 20,
                }}
              />
              <ListButtonElement text="Delete Job Offer" onPress={askDelete} />
            </>
          ) : (
            <>
              {file.job && (
                <>
                  <ListButtonElement
                    text="Show Driving Directions"
                    onPress={() => {
                      openMap({
                        end: file.place_name,
                      });
                    }}
                  />
                  <NiceDivider
                    space={0}
                    style={{
                      marginStart: 20,
                      marginEnd: 20,
                    }}
                  />
                </>
              )}
              <ListButtonElement
                text={
                  file.job ? 'Send email to employer' : 'Send email to employee'
                }
                onPress={contactEmp}
              />
            </>
          )}
        </View>
      </ScrollView>
      {user !== null && (
        <Input
          placeholder="Enter comment here"
          containerStyle={{backgroundColor: 'white'}}
          inputContainerStyle={{borderBottomWidth: 0}}
          renderErrorMessage={false}
          value={comment}
          onChangeText={(text) => setComment(text)}
          rightIcon={() => (
            <TouchableOpacity onPress={doSendComment}>
              <Ionicons name="send-outline" size={30} />
            </TouchableOpacity>
          )}
        />
      )}
    </>
  );
};
const styles = StyleSheet.create({
  desc: {
    fontSize: 16,
  },
  descTitle: {
    fontWeight: 'bold',
  },
  descTitleBottom: {
    marginBottom: 8,
  },
  box: {
    width: '100%',
    backgroundColor: '#75B09C',
    borderRadius: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
});

SingleJob.propTypes = {
  singleMedia: PropTypes.object,
  route: PropTypes.object,
  navigation: PropTypes.object,
};

export default SingleJob;
