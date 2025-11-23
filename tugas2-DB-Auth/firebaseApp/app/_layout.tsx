import { Stack, SplashScreen, useRouter } from "expo-router";
import { initializeFirebase } from "../firebaseConfig";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getAuth } from "../firebase";

// Mencegah splash screen hilang
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);
  const router = useRouter();

  //inisialisasi Firebase saat aplikasi dimuat.
  useEffect(() => {
    const init = async () => {
      try {
        initializeFirebase();
        setFirebaseInitialized(true);
      } catch (e) {
        console.error("Error initializing Firebase", e);
      }
    };
    init();
  }, []);

  // handler sesi
  useEffect(() => {
    if (!firebaseInitialized) {
      return;
    }

    //auth login logout
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      router.replace(user ? "/home" : "/");
      SplashScreen.hideAsync();
    });

    // Hapus listener pas komponen dilepas
    return () => unsubscribe();
  }, [firebaseInitialized]);

  // nahan splashscreen sampe load selesai
  if (!firebaseInitialized) {
    return null;
  }

  // Render tumpukan navigasi utama aplikasi.
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="home" options={{ headerShown: false }} />
    </Stack>
  );
}
