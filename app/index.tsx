import { Poppins_700Bold, useFonts } from "@expo-google-fonts/poppins";
import {
  NavigationContainer,
  NavigationIndependentTree,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

import CameraScreen from "./ekrany/cameras";
import Email from "./ekrany/email";
import Galeria from "./ekrany/galeria";
import Home from "./ekrany/home";
import Login from "./ekrany/login";
import { PhotosProvider } from "./PhotosContext";
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationIndependentTree>
      <PhotosProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Start"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Start" component={StartScreen} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Galeria" component={Galeria} />
            <Stack.Screen name="Cameras" component={CameraScreen} />
            <Stack.Screen name="Email" component={Email} />
          </Stack.Navigator>
        </NavigationContainer>
      </PhotosProvider>
    </NavigationIndependentTree>
  );
}

function StartScreen({ navigation }: any) {
  const { width, height } = useWindowDimensions();
  const isPortrait = height >= width;
  let [fontsLoaded] = useFonts({
    Poppins_700Bold,
  });
  return (
    <LinearGradient
      colors={["#3B82F6", "#9333EA"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.body, { paddingTop: height * 0.2 }]}
    >
      <View style={styles.header}>
        <Text style={styles.text}>SnapMail</Text>
      </View>
      <Image source={require("./obrazki/kamera.png")} style={styles.logo} />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Login")}
      >
        <Text
          style={{
            width: "100%",
            textAlign: "center",
            fontSize: 24,
            fontFamily: "Poppins_700Bold",
          }}
        >
          Zaloguj
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
  logo: {
    width: 200,
    height: 200,
    marginBottom: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    backgroundColor: "#FFFFFF",
    height: 80,
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 18,
    marginBottom: 30,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
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
});
