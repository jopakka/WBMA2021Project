import axios from 'axios';
import {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import {appID, baseUrl} from '../utils/variables';

// general function for fetching (options default value is empty object)
const doFetch = async (url, options = {}) => {
  const response = await fetch(url, options);
  const json = await response.json();
  if (json.error) {
    // if API response contains error message (use Postman to get further details)
    throw new Error(json.message + ': ' + json.error);
  } else if (!response.ok) {
    // if API response does not contain error message, but there is some other error
    throw new Error('doFetch failed');
  } else {
    // if all goes well
    return json;
  }
};

const useLoadMedia = () => {
  const [mediaArray, setMediaArray] = useState([]);
  const {update} = useContext(MainContext);

  const loadMedia = async (limit = 5) => {
    try {
      const listJson = await doFetch(baseUrl + 'tags/' + appID);

      const media = await Promise.all(
        listJson.map(async (item) => {
          let fileJson = await doFetch(baseUrl + 'media/' + item.file_id);
          // console.log('media file data', fileJson);
          try {
            const otherData = JSON.parse(fileJson.description);
            delete fileJson.description;
            fileJson = {
              ...fileJson,
              ...otherData,
            };
            // console.log('media file data', fileJson);
          } catch (e) {
            console.warn('Not valid json string');
          }
          return fileJson;
        })
      );
      // console.log('media array data', media);

      setMediaArray(media);
    } catch (error) {
      console.error('loadmedia error', error.message);
    }
  };

  useEffect(() => {
    loadMedia();
  }, [update]);
  return mediaArray;
};

const useLogin = () => {
  const postLogin = async (userCredentials) => {
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(userCredentials),
    };
    try {
      const userData = await doFetch(baseUrl + 'login/', options);
      return userData;
    } catch (error) {
      throw new Error(error.message);
    }
  };
  return {postLogin};
};

const useUser = () => {
  const postRegister = async (inputs) => {
    console.log('trying to create user', inputs);
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputs),
    };
    try {
      const json = await doFetch(baseUrl + 'users', fetchOptions);
      console.log('register resp', json);
      return json;
    } catch (e) {
      throw new Error(e.message);
    }
  };

  const checkToken = async (token) => {
    const options = {
      method: 'GET',
      headers: {'x-access-token': token},
    };
    try {
      let userData = await doFetch(baseUrl + 'users/user', options);
      const otherData = JSON.parse(userData.full_name);
      delete userData.full_name;
      userData = {
        ...userData,
        ...otherData,
      };
      return userData;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const getUser = async (id, token) => {
    const options = {
      method: 'GET',
      headers: {'x-access-token': token},
    };
    try {
      const userData = await doFetch(baseUrl + 'users/' + id, options);
      return userData;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const checkIsUserAvailable = async (username) => {
    try {
      const result = await doFetch(baseUrl + 'users/username/' + username);
      return result.available;
    } catch (error) {
      throw new Error('apihooks checkIsUserAvailable', error.message);
    }
  };

  const updateUser = async (data, token) => {
    const options = {
      method: 'put',
      headers: {
        'x-access-token': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    try {
      const result = await doFetch(baseUrl + 'users', options);
      return result;
    } catch (e) {
      throw new Error('apiHooks updateUser: ' + e);
    }
  };

  return {postRegister, checkToken, checkIsUserAvailable, getUser, updateUser};
};

const useTag = () => {
  const postTag = async (tag, token) => {
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'x-access-token': token},
      body: JSON.stringify(tag),
    };
    try {
      const result = await doFetch(baseUrl + 'tags', options);
      return result;
    } catch (error) {
      throw new Error('postTag error:', error.message);
    }
  };

  return {postTag};
};

const useMedia = () => {
  const upload = async (fd, token) => {
    const options = {
      method: 'POST',
      headers: {'x-access-token': token},
      data: fd,
      url: baseUrl + 'media',
    };
    console.log('apihooks upload', options);
    try {
      const response = await axios(options);
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  };
  return {upload};
};

export {useLogin, useUser, useLoadMedia, useMedia, useTag};
