import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { signOut } from "firebase/auth";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { saveChatHistory, loadChatHistory } from "../utils/chatStorage";
import { launchImageLibrary } from "react-native-image-picker";
import RNFS from "react-native-fs";

type MessageType = {
  id: string;
  text: string;
  user: string;
  createdAt: { seconds: number; nanoseconds: number } | null;
  type?: "text" | "image";
  imageBase64?: string;
};

type Props = NativeStackScreenProps<RootStackParamList, "Chat">;

const ChatScreen = ({ route }: Props) => {
  const { name } = route.params;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const loadOfflineMessages = async () => {
      const offlineMessages = await loadChatHistory();
      if (offlineMessages.length > 0) {
        setMessages(offlineMessages);
      }
    };

    loadOfflineMessages();

    const q = query(collection(db, "messages"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: MessageType[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        text: doc.data().text || "",
        user: doc.data().user,
        createdAt: doc.data().createdAt,
        type: doc.data().type || "text",
        imageBase64: doc.data().imageBase64,
      }));
      setMessages(msgs);
      saveChatHistory(msgs);
    });

    return () => unsubscribe();
  }, []);

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      await addDoc(collection(db, "messages"), {
        text: message,
        user: name,
        type: "text",
        createdAt: serverTimestamp(),
      });
      setMessage("");
    } catch (error) {
      Alert.alert("Error", "Gagal mengirim pesan");
    }
  };

  const pickImageFromGallery = async () => {
    const result = await launchImageLibrary({
      mediaType: "photo",
      quality: 0.3,
      maxWidth: 600,
      maxHeight: 600,
      selectionLimit: 1,
    });

    if (result.didCancel) return;
    if (result.errorCode) {
      Alert.alert("Error", "Gagal memilih gambar");
      return;
    }

    const asset = result.assets?.[0];
    if (!asset?.uri) return;

    const fileSize = asset.fileSize || 0;
    if (fileSize > 400000) {
      Alert.alert("Error", "Ukuran gambar terlalu besar (max 400KB)");
      return;
    }

    setUploading(true);
    try {
      const base64 = await RNFS.readFile(asset.uri, "base64");
      const base64String = `data:image/jpeg;base64,${base64}`;

      await addDoc(collection(db, "messages"), {
        text: "",
        user: name,
        type: "image",
        imageBase64: base64String,
        createdAt: serverTimestamp(),
      });

      Alert.alert("Sukses", "Foto berhasil dikirim!");
    } catch (error) {
      Alert.alert("Error", "Gagal mengirim foto");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Apakah Anda yakin ingin keluar?", [
      {
        text: "Batal",
        style: "cancel",
      },
      {
        text: "Keluar",
        onPress: async () => {
          try {
            await signOut(auth);
          } catch (error) {
            Alert.alert("Error", "Gagal logout");
          }
        },
        style: "destructive",
      },
    ]);
  };

  const renderMessage = ({ item }: { item: MessageType }) => {
    const isMyMessage = item.user === name;

    return (
      <View
        style={[
          styles.msgBox,
          isMyMessage ? styles.myMsg : styles.otherMsg,
        ]}
      >
        {!isMyMessage && <Text style={styles.sender}>{item.user}</Text>}
        
        {item.type === "image" && item.imageBase64 ? (
          <Image
            source={{ uri: item.imageBase64 }}
            style={styles.messageImage}
            resizeMode="cover"
          />
        ) : (
          <Text>{item.text}</Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chat Room</Text>
        <Text style={styles.headerSubtitle}>Welcome, {name}</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
      />

      <View style={styles.inputRow}>
        <TouchableOpacity
          style={styles.imageButton}
          onPress={pickImageFromGallery}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.imageButtonText}>🖼️</Text>
          )}
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type message..."
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 15,
    backgroundColor: "#007AFF",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#fff",
    marginTop: 5,
  },
  logoutButton: {
    position: "absolute",
    right: 15,
    top: 15,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  logoutText: {
    color: "#007AFF",
    fontWeight: "600",
  },
  msgBox: {
    padding: 10,
    marginVertical: 6,
    marginHorizontal: 10,
    borderRadius: 6,
    maxWidth: "80%",
  },
  myMsg: {
    backgroundColor: "#d1f0ff",
    alignSelf: "flex-end",
  },
  otherMsg: {
    backgroundColor: "#eee",
    alignSelf: "flex-start",
  },
  sender: {
    fontWeight: "bold",
    marginBottom: 2,
    fontSize: 12,
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginTop: 5,
  },
  inputRow: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
  },
  imageButton: {
    padding: 10,
    marginRight: 10,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  imageButtonText: {
    fontSize: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    marginRight: 10,
    padding: 8,
    borderRadius: 6,
    borderColor: "#ccc",
  },
});

export default ChatScreen;