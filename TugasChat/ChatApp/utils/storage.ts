import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();

export const StorageKeys = {
  USER_EMAIL: 'user_email',
  USER_PASSWORD: 'user_password',
  AUTO_LOGIN: 'auto_login',
};

export const saveLoginCredentials = (email: string, password: string) => {
  storage.set(StorageKeys.USER_EMAIL, email);
  storage.set(StorageKeys.USER_PASSWORD, password);
  storage.set(StorageKeys.AUTO_LOGIN, true);
};

export const getLoginCredentials = () => {
  const email = storage.getString(StorageKeys.USER_EMAIL);
  const password = storage.getString(StorageKeys.USER_PASSWORD);
  const autoLogin = storage.getBoolean(StorageKeys.AUTO_LOGIN);
  
  return { email, password, autoLogin };
};

export const clearLoginCredentials = () => {
  storage.delete(StorageKeys.USER_EMAIL);
  storage.delete(StorageKeys.USER_PASSWORD);
  storage.delete(StorageKeys.AUTO_LOGIN);
};