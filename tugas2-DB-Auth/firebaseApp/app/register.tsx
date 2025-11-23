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
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getAuth } from "../firebase";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const auth = getAuth(); 

  // handle registrasi akun baru
  const handleRegister = async () => {
    if (email === "" || password === "" || confirmPassword === "") {
      Alert.alert("Registrasi Gagal", "Semua kolom harus diisi.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Registrasi Gagal", "Password dan konfirmasi password tidak cocok.");
      return;
    }

    setLoading(true); //loading indikator
    try {
      // Buat pengguna baru di Firebase Authentication.
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Registrasi Berhasil", "Akun Anda telah dibuat. Silakan login.");
      router.back(); // Kembali ke halaman login setelah berhasil.
    } catch (error: any) { //error handling
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert("Registrasi Gagal", "Email ini sudah terdaftar.");
      } else if (error.code === 'auth/weak-password') {
        Alert.alert("Registrasi Gagal", "Password terlalu lemah. Minimal 6 karakter.");
      } else {
        Alert.alert("Registrasi Gagal", "Terjadi kesalahan. Silakan coba lagi.");
      }
    } finally {
      setLoading(false); 
    }
  };

  // Render komponen registrasi.
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.formContainer}>
        <Text style={styles.title}>Buat Akun Baru</Text>
        <Text style={styles.subtitle}>Isi data diri Anda</Text>

        {/* Input untuk email */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {/* Input untuk password */}
        <TextInput
          style={styles.input}
          placeholder="Password (min. 6 karakter)"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {/* Input untuk konfirmasi password */}
        <TextInput
          style={styles.input}
          placeholder="Konfirmasi Password"
          placeholderTextColor="#888"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        {/* Tombol untuk memicu fungsi registrasi */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Daftar</Text>
          )}
        </TouchableOpacity>

        {/* Tautan untuk kembali ke halaman login */}
        <TouchableOpacity style={styles.linkButton} onPress={() => router.back()}>
          <Text style={styles.linkButtonText}>Sudah punya akun? Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// Gunakan gaya yang sama dengan halaman login untuk konsistensi
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