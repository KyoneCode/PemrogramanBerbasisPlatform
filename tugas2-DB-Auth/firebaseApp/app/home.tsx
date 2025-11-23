import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { getAuth, getDb } from "../firebase"; 
import { useRouter, Stack } from "expo-router";
import { collection, getDocs } from "firebase/firestore";

// Definisi tipe data
interface Mahasiswa {
  id: string;
  Nama: string;
  NIM: string;
  Jurusan: string;
  Angkatan: number;
  IPK: number;
}

export default function HomePage() {
  const router = useRouter();
  //ambil instance auth dan db
  const auth = getAuth();
  const db = getDb();
  const user = auth.currentUser;
  const [mahasiswaList, setMahasiswaList] = useState<Mahasiswa[]>([]);
  const [loading, setLoading] = useState(true);

  // ngambil data dari db
  const fetchMahasiswa = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "Mahasiswa"));
      const data: Mahasiswa[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Mahasiswa, 'id'>),
      }));
      setMahasiswaList(data);
    } catch (error) {
      console.error("Error fetching data: ", error);
      Alert.alert("Error", "Gagal mengambil data mahasiswa.");
    } finally {
      setLoading(false);
    }
  };

  // fetch
  useEffect(() => {
    fetchMahasiswa();
  }, []);

  // func buat logout
  const handleLogout = async () => {
    try {
      await auth.signOut(); 
      router.replace("/"); //balik ke index(login)
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Logout Gagal", "Terjadi kesalahan saat mencoba logout.");
    }
  };

  // view
  const renderMahasiswaItem = ({ item }: { item: Mahasiswa }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemName}>{item.Nama}</Text>
      <Text style={styles.itemDetails}>NIM: {item.NIM}</Text>
      <Text style={styles.itemDetails}>Jurusan: {item.Jurusan}</Text>
      <View style={styles.itemFooter}>
        <Text style={styles.itemDetails}>Angkatan: {item.Angkatan}</Text>
        <Text style={styles.itemDetails}>IPK: {item.IPK}</Text>
      </View>
    </View>
  );

  // Render komponen
  return (
    <View style={styles.container}>
      {/* Sembunyikan header default dari Stack Navigator */}
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header kustom yang berisi judul dan tombol logout */}
      <View style={styles.header}>
        <Text style={styles.title}>Daftar Mahasiswa</Text>
        <Button title="Logout" onPress={handleLogout} color="#ff3b30" />
      </View>

      {/* Tampilkan indikator loading atau daftar mahasiswa */}
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={mahasiswaList}
          renderItem={renderMahasiswaItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          onRefresh={fetchMahasiswa} // Fungsi untuk pull-to-refresh
          refreshing={loading}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
    backgroundColor: "#f0f2f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  list: {
    paddingBottom: 20,
  },
  itemContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  itemDetails: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
  }
});