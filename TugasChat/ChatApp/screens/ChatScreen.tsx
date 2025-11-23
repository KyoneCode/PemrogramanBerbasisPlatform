import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    FlatList,
    StyleSheet,
    Alert,
    TouchableOpacity,
    SafeAreaView,
} from "react-native";
import {
    addDoc,
    serverTimestamp,
    query,
    orderBy,
    onSnapshot,
} from "../firebase";
import { messagesCollection } from "../firebase";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

type MessageType = {
    id: string;
    text: string;
    user: string;
    createdAt: { seconds: number; nanoseconds: number } | null;
};
type Props = NativeStackScreenProps<RootStackParamList,
"Chat">;
const ChatScreen = ({ route }: Props) => {
  const { name } = route.params;
    const [message, setMessage] = useState<string>("");
    const [messages, setMessages] = useState<MessageType[]>([]);


useEffect(() => {
    const q = query(messagesCollection, orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snapshot) => {
    const list: MessageType[] = [];
    snapshot.forEach((doc) => {
        list.push({
        id: doc.id,
    ...(doc.data() as Omit<MessageType, "id">),
    });
    });
    setMessages(list);
    });
    return () => unsub();
    }, []);
    const sendMessage = async () => {
    if (!message.trim()) return;
    await addDoc(messagesCollection, {
    text: message,
    user: name,
    createdAt: serverTimestamp(),
    });
    setMessage("");
    };
    const renderItem = ({ item }: { item: MessageType }) => (
    <View
    style={[
    styles.msgBox,
    item.user === name ? styles.myMsg : styles.otherMsg,
    ]}
    >
    <Text style={styles.sender}>{item.user}</Text>
    <Text>{item.text}</Text>
    </View>
    );

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Apakah Anda yakin ingin keluar?",
      [
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
      ]
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
    renderItem={renderItem}
    contentContainerStyle={{ padding: 10 }}
    />
    <View style={styles.inputRow}>
    <TextInput
    style={styles.input}
    placeholder="Ketik pesan..."
    value={message}
    onChangeText={setMessage}
    />
    <Button title="Kirim" onPress={sendMessage} />
    </View>
    </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    msgBox: {
    padding: 10,
    marginVertical: 6,
    borderRadius: 6,
    maxWidth: "80%",},
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
    inputRow: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
    },
    input: {
    flex: 1,
    borderWidth: 1,
    marginRight: 10,
    padding: 8,
    borderRadius: 6,
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
});

export default ChatScreen;