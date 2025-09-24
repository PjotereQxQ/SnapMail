import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { usePhotos } from "../PhotosContext";

export default function MailForm({ route, navigation }: any) {
  const { width, height } = useWindowDimensions();
  const { photos, clearPhotos } = usePhotos();
const targetMail = route.params.target_mail || "";
const uprawnienia = route.params.uprawnienia;
  const [to, setTo] = useState(targetMail);
  const [subject, setSubject] = useState("Zdjęcia z aplikacji");
  const [body, setBody] = useState("");

  const sendMail = async () => {
    if (!to) return Alert.alert("Wpisz adres odbiorcy");
    if (photos.length === 0) return Alert.alert("Brak zdjęć do wysłania");

    const formData = new FormData();
    formData.append("email", to);
    formData.append("subject", subject);
    formData.append("body", body);

  photos.forEach((p) => {
  const filename = p.full.split("/").pop(); 
  formData.append("photos", { uri: p.full, name: filename, type: "image/jpeg" } as any);
});


    try {
      const response = await fetch(
        "https://snapmail-backend.onrender.com/send-mail",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      if (data.success) {
        Alert.alert("Mail wysłany!");
        clearPhotos();
        navigation.navigate("Galeria", { mail: to });
      } else {
        Alert.alert("Błąd", data.message || "Nie udało się wysłać maila");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Błąd", "Nie udało się wysłać maila");
    }
  };

  return (
    <LinearGradient
      colors={["#3B82F6", "#9333EA"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.body, { paddingTop: height * 0.15 }]}
    >
      <View style={styles.header}>
        <Text style={styles.text}>Wyślij Emaila</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Do"
        value={to}
        onChangeText={setTo}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={uprawnienia !== "User"}
      />
      <TextInput
        style={styles.input}
        placeholder="Temat"
        value={subject}
        onChangeText={setSubject}
      />
      <TextInput
        style={[styles.input, { height: 200, marginBottom: 50 }]}
        placeholder="Treść wiadomości"
        value={body}
        onChangeText={setBody}
        multiline
      />

      <View style={[styles.buttons, { gap: width * 0.1 }]}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "white", width: width * 0.3 }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Powrót</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#10B981", width: width * 0.3 }]}
          onPress={sendMail}
        >
          <Text style={styles.buttonText}>Wyślij</Text>
        </TouchableOpacity>
      </View>
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
  input: {
    width: "80%",
    backgroundColor: "rgba(255,255,255,0.4)",
    height: 70,
    padding: 15,
    borderRadius: 18,
    fontSize: 16,
    marginBottom: 20,
    fontFamily: "Poppins_700Bold",
  },
  header: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  text: {
    fontSize: 40,
    fontFamily: "Poppins_700Bold",
    color: "white",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: { color: "black", fontFamily: "Poppins_700Bold", fontSize: 16 },
  button: {
    backgroundColor: "#FFFFFF",
    height: 60,
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
});
