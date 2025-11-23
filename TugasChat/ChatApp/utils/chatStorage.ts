import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAT_HISTORY_KEY = 'chat_history';

export type ChatMessage = {
  id: string;
  text: string;
  user: string;
  createdAt: { seconds: number; nanoseconds: number } | null;
  type?: "text" | "image";
  imageBase64?: string;
};

export const saveChatHistory = async (messages: ChatMessage[]) => {
  try {
    const jsonValue = JSON.stringify(messages);
    await AsyncStorage.setItem(CHAT_HISTORY_KEY, jsonValue);
  } catch (error) {
    console.error('Error saving chat history:', error);
  }
};

export const loadChatHistory = async (): Promise<ChatMessage[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(CHAT_HISTORY_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error loading chat history:', error);
    return [];
  }
};

export const clearChatHistory = async () => {
  try {
    await AsyncStorage.removeItem(CHAT_HISTORY_KEY);
  } catch (error) {
    console.error('Error clearing chat history:', error);
  }
};