import {useState} from 'react';
import {validator} from '../utils/validator';

const constraints = {
  username: {
    presence: {
      message: 'cannot be empty',
    },
    length: {
      minimum: 3,
      message: 'must be atleast 3 chars',
    },
  },
  full_name: {
    length: {
      minimum: 3,
      message: 'must be atleast 3 chars',
    },
  },
  email: {
    presence: {
      message: 'cannot be empty',
    },
    format: {
      pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      message: 'is not valid',
    },
  },
};

const useProfileForm = (callback) => {
  const [inputs, setInputs] = useState({
    username: '',
    full_name: '',
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (name, text) => {
    setInputs((inputs) => {
      return {
        ...inputs,
        [name]: text,
      };
    });

    const error = validator(name, text, constraints);
    setErrors((errors) => {
      return {
        ...errors,
        [name]: error,
      };
    });
  };

  return {
    handleInputChange,
    inputs,
    errors,
    setInputs,
  };
};

export default useProfileForm;
