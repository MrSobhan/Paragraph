import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { auth, googleProvider, githubProvider } from '../hooks/firebase';
import { signInWithPopup, signOut } from 'firebase/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const baseUrl = 'http://localhost:3000/v1'; //https://virgool.onrender.com/v1
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const setLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const getLocalStorage = (key) => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  };

  const axiosInstance = axios.create({
    baseURL: baseUrl,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  axiosInstance.interceptors.request.use(async (config) => {
    const token = getLocalStorage('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const LoginUser = async (credentials) => {
    try {
      const response = await axiosInstance.post('/auth/login', credentials);
      const { token } = response.data;

      setLocalStorage('token', token);
      await getMe();
      setIsLogin(true);

      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'خطا در ورود'
      };
    }
  };

  const RegisterUser = async (userData) => {
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      const { token } = response.data;

      setLocalStorage('token', token);
      await getMe();
      setIsLogin(true);

      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'خطا در ثبت‌نام'
      };
    }
  };

  const loginWithGoogle = async () => {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      const userData = {
        username: firebaseUser.displayName || '',
        name: firebaseUser.displayName || '',
        email: firebaseUser.email,
        avatar: firebaseUser.photoURL || '',
        phone: firebaseUser.phoneNumber || '',
        password: firebaseUser.uid
      }
      const userDataLogin = {
        email: firebaseUser.email,
        password: firebaseUser.uid
      }
      
      let response = null

      try {
         response = await axiosInstance.post('/auth/register', userData);
      } catch (error) {
        response = await axiosInstance.post('/auth/login', userDataLogin);
      }

      const { token } = response.data;

      setLocalStorage('token', token);
      await getMe();
      setIsLogin(true);

      return { success: true, data: response.data };

  };

  const loginWithGithub = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const firebaseUser = result.user;
      console.log(firebaseUser);
      
      // const token = await firebaseUser.getIdToken();

      // setLocalStorage('token', token);
      // setUser({
      //   // uid: firebaseUser.uid,
      //   email: firebaseUser.email,
      //   displayName: firebaseUser.displayName || '',
      //   photoURL: firebaseUser.photoURL || '',
      //   phone: firebaseUser.phoneNumber || ''
      // });
      // setIsLogin(true);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'خطا در ورود با گیت‌هاب'
      };
    }
  };

  const getMe = async () => {
    try {
      const response = await axiosInstance.get('/auth/me');
      setUser(response.data);
      setIsLogin(true);
      return response.data;
    } catch (error) {
      return null;
    }
  };

  const LogOutUser = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('token');
      setUser(null);
      setIsLogin(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  useEffect(() => {
    const token = getLocalStorage('token');
    if (token) {
      setIsLoading(true);
      getMe().then((data) => {
        if (!data) {
          LogOutUser();
        }
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        baseUrl,
        user,
        setLocalStorage,
        getLocalStorage,
        isLogin,
        isLoading,
        LoginUser,
        RegisterUser,
        loginWithGoogle,
        loginWithGithub,
        LogOutUser,
        getMe,
        axiosInstance,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth باید داخل AuthProvider استفاده شود');
  }
  return context;
};

export default AuthContext;