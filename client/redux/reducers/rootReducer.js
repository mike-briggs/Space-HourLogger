import {userConstants} from '../../constants.js';

const initState = {
    credentials:{
        authKey: null
    },
    authenticated:false
}

const rootReducer = (state = initState, action) => {
    switch (action.type) {
        case userConstants.LOGIN_REQUEST:
          return {
            loggingIn: true,
            user: action.user
          };
        case userConstants.LOGIN_SUCCESS:
          return {
            loggedIn: true,
            user: action.user
          };
        case userConstants.LOGIN_FAILURE:
          return {};
        case userConstants.LOGOUT:
          return {};
        default:
          return state
      }
}

export default rootReducer;