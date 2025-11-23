import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAT_HISTORY_KEY = 'chat_history';
const PENDING_MESSAGES_KEY = 'pending_messages';

export type ChatMessage = {
  id: string;
  text: string;
  user: string;
  createdAt: { seconds: number; nanoseconds: number } | null;
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

export const savePendingMessage = async (message: {
  text: string;
  user: string;
}) => {
  try {
    const pending = await loadPendingMessages();
    pending.push({ ...message, timestamp: Date.now() });
    await AsyncStorage.setItem(PENDING_MESSAGES_KEY, JSON.stringify(pending));
  } catch (error) {
    console.error('Error saving pending message:', error);
  }
};

export const loadPendingMessages = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(PENDING_MESSAGES_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    return [];
  }
};

export const clearPendingMessages = async () => {
  try {
    await AsyncStorage.removeItem(PENDING_MESSAGES_KEY);
  } catch (error) {
    console.error('Error clearing pending messages:', error);
  }
};