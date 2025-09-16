import { Poppins_400Regular, Poppins_700Bold, useFonts } from "@expo-google-fonts/poppins";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions
} from "react-native";
import users from "../users.json";
type Props = NativeStackScreenProps<any>;

export default function LoginScreen({ navigation }: Props) {
  const [Email, setEmail] = useState("");
  const { width, height } = useWindowDimensions();
  let [fontsLoaded] = useFonts({
    Poppins_700Bold,
    Poppins_400Regular
  });
  return (
    <LinearGradient
      colors={["#3B82F6", "#9333EA"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.body, { paddingTop: height * 0.2 }]}
    >
      <View style={styles.header}>
        <Text style={styles.text}>Zaloguj</Text>
      </View>

      <View style={{ width: "100%" }}>
        <TextInput
          style={styles.input}
          placeholder="Adres E-mail"
          value={Email}
          onChangeText={setEmail}
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => { if(Email in users){ navigation.navigate("Home", { mail: Email, })} else{Alert.alert("Błąd", "Nie znaleziono podanego maila", [
        { text: "Pomiń logowanie", onPress: () => navigation.navigate("Home") },
        { text: "OK", }
      ],
      { cancelable: true });}}}
      >
        <Text
          style={{
            color: "black",
            fontSize: 18,
            fontFamily: "Poppins_700Bold",
          }}
        >
          Zaloguj
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.goback}
        onPress={() => navigation.navigate("Home")}
      >
        <Text
          style={{
            color: "#CBCBCB",
            fontSize: 20,
            textDecorationLine: "underline",
            fontFamily: "Poppins_700Bold",
            textShadowColor: "rgba(0,0,0,0.5)",
            textShadowOffset: { width: 2, height: 2 },
            textShadowRadius: 5,
          }}
        >
          Pomiń logowanie
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.goback}
        onPress={() => navigation.navigate("Start")}
      >
        <Text
          style={{
            color: "#CBCBCB",
            fontSize: 16,
            textDecorationLine: "underline",
            fontFamily: "Poppins_400Regular",
            textShadowColor: "rgba(0,0,0,0.5)",
            textShadowOffset: { width: 2, height: 2 },
            textShadowRadius: 5,
            width: 100,
            textAlign: 'center'
          }}
        >
          Wróć
        </Text>
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
  input: {
    width: "80%",
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.4)",
    height: 70,
    padding: 15,
    borderWidth: 1,
    borderRadius: 18,
    fontSize: 16,
    marginBottom: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    color: "black",
    fontFamily: "Poppins_700Bold",
  },
  goback: {
    height: 60,
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    margin: 50,
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
});
