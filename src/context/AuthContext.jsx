import React, { createContext, useReducer, useEffect, useCallback } from 'react';
import apiService from '../services/apiService';
import logger from '../services/logger';

// Auth Actions
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  REGISTER_START: 'REGISTER_START',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_FAILURE: 'REGISTER_FAILURE',
  LOGOUT: 'LOGOUT',
  SET_LOADING: 'SET_LOADING',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Initial state
const initialState = {
  user: null,
  token: null,
  isLoading: true,
  error: null,
  isAuthenticated: false,
};

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
    case AUTH_ACTIONS.REGISTER_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case AUTH_ACTIONS.LOGIN_SUCCESS:
    case AUTH_ACTIONS.REGISTER_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
        error: null,
        isAuthenticated: true,
      };
    case AUTH_ACTIONS.LOGIN_FAILURE:
    case AUTH_ACTIONS.REGISTER_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        isAuthenticated: false,
      };
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isLoading: false,
        error: null,
        isAuthenticated: false,
      };
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Create Auth Context
const AuthContext = createContext();

// useAuth hook moved to separate file for better fast refresh support
// import { useAuth } from '../hooks/useAuth';

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const checkAuthStatus = useCallback(async () => {
    let token = null;
    try {
        token = localStorage.getItem('envoyou_token');
    } catch (error) {
        console.warn('localStorage not available (incognito mode):', error);
    }
    if (!token) {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      return;
    }

    try {
      const userData = await apiService.getUserProfile();
      if (userData) {
        // Update localStorage with fresh user data
        try {
            localStorage.setItem('envoyou_user', JSON.stringify(userData));
        } catch (error) {
            console.warn('localStorage not available (incognito mode):', error);
        }
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user: userData, token },
        });
        logger.info('User session restored and updated successfully.');
      } else {
        throw new Error('Invalid user data received from server.');
      }
    } catch (error) {
      logger.error('Session restore failed. Token might be invalid or expired.', { error });
      try {
          localStorage.removeItem('envoyou_token');
          localStorage.removeItem('envoyou_user');
      } catch (error) {
          console.warn('localStorage not available (incognito mode):', error);
      }
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  }, []);

  // Login function
  const login = async (email, password) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    try {
      const data = await apiService.login({ email, password });

      if (!data.access_token || !data.user) {
        throw new Error('Login response is missing token or user data.');
      }

      localStorage.setItem('envoyou_token', data.access_token);
      localStorage.setItem('envoyou_user', JSON.stringify(data.user));

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { token: data.access_token, user: data.user },
      });
      logger.info(`User ${data.user.email} logged in successfully.`);
      return { success: true };
    } catch (error) {
      logger.error('Login failed', { error: error.message });
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: error.message || 'An unexpected error occurred during login.',
      });
      return { success: false, error: error.message };
    }
  };

  // Register function
  const register = async (userData) => {
    dispatch({ type: AUTH_ACTIONS.REGISTER_START });
    try {
      const data = await apiService.register(userData);

      // Handle new registration response format
      if (data.success) {
        // Create a temporary user object for unverified state
        const tempUser = {
          id: 'temp-' + Date.now(), // Temporary ID
          email: userData.email,
          name: userData.name,
          email_verified: false,
          company: userData.company,
          job_title: userData.job_title,
          created_at: new Date().toISOString()
        };

        // Store temporary session data
        localStorage.setItem('envoyou_temp_user', JSON.stringify(tempUser));
        localStorage.setItem('envoyou_registration_pending', 'true');

        dispatch({
          type: AUTH_ACTIONS.REGISTER_SUCCESS,
          payload: {
            token: null, // No token until verified
            user: tempUser
          },
        });

        logger.info(`New user ${userData.email} registered successfully (pending verification).`);
        return { success: true, email_sent: data.email_sent };
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (error) {
      logger.error('Registration failed', { error: error.message });
      dispatch({
        type: AUTH_ACTIONS.REGISTER_FAILURE,
        payload: error.message || 'An unexpected error occurred during registration.',
      });
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = async () => {
    const userEmail = state.user?.email;
    // Optional: Call an API endpoint to invalidate the token on the server side
    // try {
    //   await apiService.post('/auth/logout');
    //   logger.info('Server-side token invalidated.');
    // } catch (error) {
    //   logger.error('Failed to invalidate server-side token on logout.', { error });
    // }

    localStorage.removeItem('envoyou_token');
    localStorage.removeItem('envoyou_user');
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
    logger.info(`User ${userEmail || ''} logged out.`);
  };

  // Clear error function
  const clearError = useCallback(() => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  }, []);

  // Context value
  const value = {
    ...state,
    login,
    register,
    logout,
    clearError,
    checkAuthStatus,
  };

  // Load user from localStorage on app start
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Export AuthContext for advanced usage
export { AuthContext };