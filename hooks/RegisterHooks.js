import {useState} from 'react';
import {validator} from '../utils/validator';
import {useUser} from './ApiHooks';

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
  password: {
    presence: {
      message: 'cannot be empty',
    },
    length: {
      minimum: 5,
      message: 'must be atleast 5 chars',
    },
  },
  confirmPassword: {
    equality: 'password',
  },
  email: {
    presence: {
      message: 'cannot be empty',
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
  },
  full_name: {
    length: {
      minimum: 3,
      message: 'must be atleast 3 chars',
    },
  },
};

const useSignUpForm = (callback) => {
  const [registerErrors, setRegisterErrors] = useState({});
  const {checkIsUserAvailable} = useUser();
  const [inputs, setInputs] = useState({
    username: '',
    password: '',
    email: '',
    full_name: '',
  });

  const handleInputChange = (name, text) => {
    setInputs((inputs) => {
      return {
        ...inputs,
        [name]: text,
      };
    });
  };

  const handleInputEnd = (name, text) => {
    if (text === '') text = null;
    let error;
    if (name === 'confirmPassword') {
      error = validator(
        name,
        {
          password: inputs.password,
          confirmPassword: text,
        },
        constraints
      );
    } else {
      error = validator(name, text, constraints);
    }
    setRegisterErrors((registerErrors) => {
      return {
        ...registerErrors,
        [name]: error,
      };
    });
  };

  const checkUserAvailable = async (event) => {
    // console.log('username input', event.nativeEvent.text);
    try {
      const result = await checkIsUserAvailable(event.nativeEvent.text);
      if (!result) {
        setRegisterErrors((registerErrors) => {
          return {
            ...registerErrors,
            username: 'Username already in use.',
          };
        });
      }
    } catch (error) {
      console.log('reg checkUserAvailable', error);
    }
  };

  const validateOnSend = () => {
    const usernameError = validator('username', inputs.username, constraints);
    const passwordError = validator('password', inputs.password, constraints);
    const confirmError = validator(
      'confirmPassword',
      {
        password: inputs.password,
        confirmPassword: inputs.confirmPassword,
      },
      constraints
    );
    const emailError = validator('email', inputs.email, constraints);
    const fullnameError = validator('full_name', inputs.full_name, constraints);

    setRegisterErrors((registerErrors) => {
      return {
        ...registerErrors,
        username: usernameError,
        password: passwordError,
        confirmPassword: confirmError,
        email: emailError,
        full_name: fullnameError,
      };
    });
    if (
      usernameError !== null ||
      passwordError !== null ||
      confirmError !== null ||
      emailError !== null ||
      fullnameError !== null
    ) {
      return false;
    }

    return true;
  };

  return {
    handleInputChange,
    handleInputEnd,
    inputs,
    checkUserAvailable,
    registerErrors,
    validateOnSend,
  };
};

export default useSignUpForm;
