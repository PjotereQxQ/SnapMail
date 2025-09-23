import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { usePhotos } from "../PhotosContext";

type Props = NativeStackScreenProps<any>;

export default function HomeScreen({ navigation, route }: Props) {
  const { width, height } = useWindowDimensions();
  const { clearPhotos } = usePhotos();
  const mail = route.params?.mail || "Anonimowy";
  const [uprawnienia, setUprawnienia] = useState(route.params?.role || "Gosc");
  const targetMail = route.params?.target_mail || "";

useEffect(() => {
  const fetchUser = async () => {
    try {
      if (mail === "Anonimowy") return;

      const res = await fetch(`https://snapmail-backend.onrender.com/users/${mail}`);
      if (!res.ok) throw new Error("Nie znaleziono użytkownika");

      const data = await res.json();
      setUprawnienia(data.role || "Gosc"); 
    } catch (error) {
      console.error("Błąd przy pobieraniu użytkownika:", error);
      setUprawnienia("Gosc");
    }
  };

  fetchUser();
}, [mail]);


  const roleDisplay: Record<string, string> = {
    Admin: "Adminie",
    User: "Użytkowniku",
    Gosc: "Gościu",
  };

  return (
    <LinearGradient
      colors={["#3B82F6", "#9333EA"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.body, { paddingTop: height * 0.2 }]}
    >
      <View style={styles.header}>
        <Text style={styles.text}>Start</Text>
      </View>
      <Text style={styles.title}>
        Witaj, {roleDisplay[uprawnienia] + (mail === "Anonimowy" ? "" : ": \n")}
        {mail === "Anonimowy" ? "" : mail + "!"}
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate("Galeria", { mail, uprawnienia, target_mail: targetMail })

        }
      >
        <Text style={styles.buttonLabel}>Galeria</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate("Cameras", { mail, uprawnienia, target_mail: targetMail })

        }
      >
        <Text style={styles.buttonLabel}>Zrób Zdjęcie</Text>
      </TouchableOpacity>

      {uprawnienia === "Admin" && (
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate("Roles", { mail, uprawnienia, target_mail: targetMail })

          }
        >
          <Text style={styles.buttonLabel}>Użytkownicy</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.goback}
        onPress={() => {
          clearPhotos();
          navigation.navigate("Start");
        }}
      >
        <Text style={styles.logout}>Wyloguj</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
  },
  goback: {
    height: 60,
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    marginBottom: 40,
    color: "white",
    fontFamily: "Poppins_700Bold",
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  button: {
    backgroundColor: "#FFFFFF",
    height: 60,
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 18,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonLabel: { color: "black", fontSize: 18, fontFamily: "Poppins_700Bold" },
  header: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    margin: 50,
  },
  text: {
    fontSize: 50,
    fontFamily: "Poppins_700Bold",
    color: "white",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  logout: {
    color: "#CBCBCB",
    fontSize: 20,
    textDecorationLine: "underline",
    fontFamily: "Poppins_700Bold",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
});
