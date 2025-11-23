import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getAuth } from "../firebase";

export default function Index() {
  // State untuk menyimpan email, password, dan status loading.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const auth = getAuth(); // ngambil instance otentikasi Firebase.

  // handle login
  const handleLogin = async () => {
    if (email === "" || password === "") {
      Alert.alert("Login Gagal", "Email dan password harus diisi.");
      return;
    }

    setLoading(true); //indikator loading
    try {
      // kirim permintaan login ke Firebase
      await signInWithEmailAndPassword(auth, email, password);
      // arahkan ke home kalo berhasil
      router.replace("/home");
    } catch (error: any) {
      if (error.code === 'auth/invalid-credential') {
        Alert.alert("Login Gagal", "Email atau password yang Anda masukkan salah.");
      } else {
        Alert.alert("Login Gagal", "Terjadi kesalahan. Silakan coba lagi.");
      }
    } finally {
      setLoading(false); 
    }
  };

  // Render komponen login
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.formContainer}>
        <Text style={styles.title}>Selamat Datang</Text>
        <Text style={styles.subtitle}>Masuk untuk melanjutkan</Text>

        {/* Input untuk email pengguna */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {/* Input untuk password pengguna */}
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* Tombol untuk memicu fungsi login */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        {/* Tautan untuk navigasi ke halaman registrasi */}
        <TouchableOpacity style={styles.linkButton} onPress={() => router.push('/register')}>
          <Text style={styles.linkButtonText}>Belum punya akun? Daftar di sini</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#f0f2f5",
  },
  formContainer: {
    marginHorizontal: 20,
    padding: 24,
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a1a1a",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    height: 50,
    backgroundColor: "#f7f7f7",
    borderWidth: 1,
    borderColor: '#e8e8e8',
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    height: 50,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkButtonText: {
    color: '#007AFF',
    fontSize: 14,
  }
});
