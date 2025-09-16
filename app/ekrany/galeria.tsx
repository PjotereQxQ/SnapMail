import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { usePhotos } from "../PhotosContext";

export default function Galeria({ navigation, route }: any) {
  const { width, height } = useWindowDimensions();
  const { photos } = usePhotos();
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const mail = route.params.mail;
  const uprawnienia = route.params.uprawnienia;


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
                borderWidth: selectedPhotos.includes(p.full) ? 3 : 0,
                borderColor: "green",
              }}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.send,
          {
            width: height * 0.1,
            aspectRatio: 1,
            bottom: height * 0.2,
            right: height * 0.07,
          },
        ]}
        onPress={() => navigation.navigate("Cameras", {mail: mail, uprawnienia: uprawnienia})}
      >
        <Text style={styles.sendText}>+</Text>
      </TouchableOpacity>

      <View style={[styles.buttons, { gap: width * 0.1 }]}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "white", width: width * 0.3 }]}
          onPress={() => navigation.navigate("Home", {mail: mail, uprawnienia: uprawnienia})}
        >
          <Text style={styles.buttonText}>Powrót</Text>
        </TouchableOpacity>

        <TouchableOpacity
  style={[
    styles.button,
    {
      backgroundColor: uprawnienia === "Gosc" ? "#888888" : "#b5b5b5ff", 
      width: width * 0.3,
      opacity: uprawnienia === "Gosc" ? 0.6 : 1,
    },
  ]}
  disabled={uprawnienia === "Gosc"} 
  onPress={() => navigation.navigate("Email", { photos: selectedPhotos, mail: mail, uprawnienia: uprawnienia })}
>
  <Text style={styles.buttonText}>Wyślij</Text>
</TouchableOpacity>

      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, justifyContent: "flex-start", alignItems: "center", padding: 20, paddingTop: 50, gap: 20 },
  galery: { width: "100%", flexDirection: "row", flexWrap: "wrap", justifyContent: "center", paddingBottom: 20,},
  buttons: { width: "100%", justifyContent: "center", alignItems: "center", flexDirection: "row", marginBottom: 20 },
  header: { width: "100%", justifyContent: "center", alignItems: "center", margin: 20 },
  button: { backgroundColor: "#FFFFFF", height: 60, justifyContent: "center", alignItems: "center", borderRadius: 18, marginBottom: 20, 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5, },
  buttonText: { color: "black", fontFamily: "Poppins_700Bold", fontSize: 16 },
  send: { position: "absolute", borderRadius: 9999, backgroundColor: "#4285F4", justifyContent: "center", alignItems: "center" },
  sendText: { fontSize: 50, fontWeight: "bold", color: "white", },
  text: { width: "100%", textAlign: "center", fontSize: 50, fontFamily: "Poppins_700Bold", color: "white", 
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5, },
});
