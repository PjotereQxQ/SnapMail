import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  Alert,
} from "react-native";
import { usePhotos } from "../PhotosContext";

export default function Galeria({ navigation, route }: any) {
  const { width, height } = useWindowDimensions();
  const { photos } = usePhotos();
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const mail = route.params.mail;
const uprawnienia = route.params.uprawnienia;
const targetMail = route.params.target_mail;

  const toggleSelect = (uri: string) => {
    if (selectedPhotos.includes(uri)) {
      setSelectedPhotos(selectedPhotos.filter((p) => p !== uri));
    } else {
      setSelectedPhotos([...selectedPhotos, uri]);
    }
  };

  const imageWidth = (width - 40) * 0.35;

  return (
    <LinearGradient
      colors={["#3B82F6", "#9333EA"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.body}
    >
      <View style={styles.header}>
        <Text style={styles.text}>Galeria</Text>
      </View>

      <ScrollView contentContainerStyle={styles.galery}>
        {photos.map((p, index) => (
          <TouchableOpacity key={index} onPress={() => toggleSelect(p.full)}>
            <Image
              source={{ uri: p.thumb }}
              style={{
                width: imageWidth,
                height: imageWidth,
                marginBottom: 20,
                marginRight: 20,
                borderRadius: 10,
                borderWidth: selectedPhotos.includes(p.full) ? 7 : 0,
                borderColor: "#10B981",
              }}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={[styles.buttons]}>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: "#F3F4F6", width: width * 0.3 },
          ]}
          onPress={() =>
            navigation.navigate("Home", {
              mail: mail,
              uprawnienia: uprawnienia,
  target_mail: targetMail,
            })
          }
        >
          <Text style={styles.buttonText}>Powrót</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.send}
          onPress={() =>
            navigation.navigate("Cameras", {
              mail: mail,
              uprawnienia: uprawnienia,
  target_mail: targetMail,
            })
          }
        >
          <MaterialCommunityIcons
            name="camera-plus"
            size={32}
            color="#000000"
          />
        </TouchableOpacity>
        <TouchableOpacity
  style={[
    styles.button,
    { backgroundColor: "#10B981", width: width * 0.3 },
  ]}
  onPress={() => {
    if (uprawnienia === "Gosc") {
      Alert.alert("Brak dostępu", "Gość nie może wysyłać maili.");
      return;
    }

    if (selectedPhotos.length === 0) {
      Alert.alert(
        "Brak zdjęć",
        "Musisz wybrać przynajmniej jedno zdjęcie, aby wysłać maila."
      );
      return;
    }

    navigation.navigate("Email", {
      photos: selectedPhotos,
      mail,
      uprawnienia,
      target_mail: targetMail
    });
  }}
>
  <Text style={[styles.buttonText]}>Wyślij</Text>
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
    paddingTop: 50,
    gap: 20,
  },
  galery: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingBottom: 20,
  },
  buttons: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 20,
  },
  header: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
  },
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
  buttonText: { color: "black", fontFamily: "Poppins_700Bold", fontSize: 16 },
  send: {
    width: 80,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
    aspectRatio: 1,
    borderRadius: 9999,
    backgroundColor: "#5898ff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  text: {
    width: "100%",
    textAlign: "center",
    fontSize: 50,
    fontFamily: "Poppins_700Bold",
    color: "white",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
});
