import * as FileSystem from "expo-file-system";
import { LinearGradient } from "expo-linear-gradient";
import * as MailComposer from "expo-mail-composer";
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
import { usePhotos } from "../PhotosContext";

export default function MailForm({ navigation, route }: any) {
  const { width, height } = useWindowDimensions();
  const { photos } = usePhotos();
  const photoUris = photos.map((p) => p.full);
  const mail = route.params.mail;
  const uprawnienia = route.params.uprawnienia;

  const [to, setTo] = useState(mail);
  const [subject, setSubject] = useState("Zdjęcia z aplikacji");
  const [body, setBody] = useState("");

  const sendMail = async () => {
    if (!to) return Alert.alert("Wpisz adres odbiorcy");

    let totalSize = 0;
    for (const uri of photoUris) {
      const info = await FileSystem.getInfoAsync(uri);
      if (info.exists) totalSize += info.size;
    }

    const maxTotalBytes = 25 * 1024 * 1024;
    if (totalSize > maxTotalBytes) {
      return Alert.alert(
        "Zdjęcia są zbyt duże",
        "Łączna wielkość zdjęć nie może przekraczać 25 MB."
      );
    }

    const options: MailComposer.MailComposerOptions = {
      recipients: [to],
      subject,
      body,
      attachments: photoUris.length ? photoUris : undefined,
    };

    try {
      await MailComposer.composeAsync(options);
      Alert.alert(
        "Mail otwarty",
        "Możesz teraz wysłać wiadomość w swojej poczcie."
      );
    } catch (error) {
      Alert.alert("Błąd", "Nie udało się otworzyć aplikacji pocztowej.");
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
        editable={uprawnienia === "Admin"}
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
          style={[
            styles.button,
            { backgroundColor: "white", width: width * 0.3 },
          ]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Powrót</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: "#b5b5b5ff", width: width * 0.3 },
          ]}
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
