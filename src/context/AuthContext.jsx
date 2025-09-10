import React, { createContext, useReducer, useEffect, useCallback } from 'react';
import apiService from '../services/apiService';
import getSupabaseClient from '../services/supabaseClient';
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
    try {
      const supabase = getSupabaseClient();
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Error getting session:', error);
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        return;
      }

      if (session?.user) {
        // Get user profile from your API
        try {
          const userData = await apiService.getUserProfile();

          // Store both Supabase session and API token
          localStorage.setItem('envoyou_token', session.access_token);
          localStorage.setItem('envoyou_user', JSON.stringify(userData || session.user));

          dispatch({
            type: AUTH_ACTIONS.LOGIN_SUCCESS,
            payload: {
              token: session.access_token,
              user: userData || {
                id: session.user.id,
                email: session.user.email,
                name: session.user.user_metadata?.name || session.user.user_metadata?.full_name,
                avatar_url: session.user.user_metadata?.avatar_url,
                email_verified: session.user.email_confirmed_at ? true : false
              }
            },
          });
          logger.info('User session restored successfully.');
        } catch (apiError) {
          console.error('Error fetching user profile:', apiError);
          // Fallback to Supabase user data
          localStorage.setItem('envoyou_token', session.access_token);
          localStorage.setItem('envoyou_user', JSON.stringify(session.user));

          dispatch({
            type: AUTH_ACTIONS.LOGIN_SUCCESS,
            payload: {
              token: session.access_token,
              user: {
                id: session.user.id,
                email: session.user.email,
                name: session.user.user_metadata?.name || session.user.user_metadata?.full_name,
                avatar_url: session.user.user_metadata?.avatar_url,
                email_verified: session.user.email_confirmed_at ? true : false
              }
            },
          });
        }
      } else {
        // Clear any stored data if no session
        localStorage.removeItem('envoyou_token');
        localStorage.removeItem('envoyou_user');
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
      }
    } catch (error) {
      console.error('Auth status check failed:', error);
      localStorage.removeItem('envoyou_token');
      localStorage.removeItem('envoyou_user');
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

  // Social Login functions using Supabase
  const googleLogin = async () => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    try {
      const supabase = getSupabaseClient();

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        throw error;
      }

      // OAuth redirect will happen automatically
      return { success: true };
    } catch (error) {
      logger.error('Google login failed', { error: error.message });
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: error.message || 'An unexpected error occurred during Google login.',
      });
      return { success: false, error: error.message };
    }
  };

  const githubLogin = async () => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    try {
      const supabase = getSupabaseClient();

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        throw error;
      }

      // OAuth redirect will happen automatically
      return { success: true };
    } catch (error) {
      logger.error('GitHub login failed', { error: error.message });
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: error.message || 'An unexpected error occurred during GitHub login.',
      });
      return { success: false, error: error.message };
    }
  };

  // Handle OAuth callback
  const handleAuthCallback = useCallback(async () => {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        throw error;
      }

      if (data.session) {
        await checkAuthStatus(); // This will handle the login success
        return { success: true };
      } else {
        throw new Error('No session found after OAuth callback');
      }
    } catch (error) {
      logger.error('OAuth callback failed', { error: error.message });
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: error.message || 'Authentication failed',
      });
      return { success: false, error: error.message };
    }
  }, [checkAuthStatus]);

  // Logout function
  const logout = async () => {
    const userEmail = state.user?.email;
    try {
      const supabase = getSupabaseClient();
      await supabase.auth.signOut();
    } catch (error) {
      logger.error('Supabase logout failed', { error });
    }

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
    googleLogin,
    githubLogin,
    handleAuthCallback,
    logout,
    clearError,
    checkAuthStatus,
  };

  // Load user from localStorage on app start and listen for auth changes
  useEffect(() => {
    checkAuthStatus();

    // Listen for auth state changes
    const supabase = getSupabaseClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Supabase auth state changed:', event, session?.user?.email);

      if (event === 'SIGNED_IN' && session) {
        await checkAuthStatus();
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem('envoyou_token');
        localStorage.removeItem('envoyou_user');
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [checkAuthStatus]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Export AuthContext for advanced usage
export { AuthContext };