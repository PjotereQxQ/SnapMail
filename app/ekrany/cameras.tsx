import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { Image } from "expo-image";
import * as ImageManipulator from "expo-image-manipulator";
import { useRef, useState } from "react";
import {
  Button,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { usePhotos } from "../PhotosContext";

export default function CameraScreen({ navigation, route }: any) {
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>("back");
  const { photos, addPhotos } = usePhotos();
  const mail = route.params.mail;
  const uprawnienia = route.params.uprawnienia;
const targetMail = route.params.target_mail;

  if (!permission) return null;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center", color: "white", marginBottom: 20 }}>
          Potrzebne jest pozwolenie na użycie kamery
        </Text>
        <Button onPress={requestPermission} title="Daj pozwolenie" />
      </View>
    );
  }

  const takePicture = async () => {
    const photo = await ref.current?.takePictureAsync();
    if (!photo?.uri) return;

    const resizedPhoto = await ImageManipulator.manipulateAsync(
      photo.uri,
      [{ resize: { width: 1080 } }],
      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    );

    addPhotos([resizedPhoto.uri]);
  };

  const toggleFacing = () =>
    setFacing((prev) => (prev === "back" ? "front" : "back"));

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        ref={ref}
        mode="picture"
        facing={facing}
        mute={false}
        responsiveOrientationWhenOrientationLocked
      >
        <View style={{ position: "absolute", bottom: 44, width: "100%" }}>
  <View style={{justifyContent: 'center', alignItems: "center", margin: 20, marginLeft: 40 }}>
    <TouchableOpacity
      style={styles.galleryBtn}
      onPress={() => navigation.navigate("Galeria", { mail: mail, uprawnienia: uprawnienia, target_mail: targetMail, })}
    >
      <Text style={styles.galleryText}>Powrót</Text>
    </TouchableOpacity>
  </View>

  <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
    <TouchableOpacity
      onPress={() =>
        photos.length > 0 &&
        navigation.navigate("Galeria", { mail: mail, uprawnienia: uprawnienia, 
  target_mail: targetMail, })
      }
      style={styles.thumbnail}
    >
      {photos.length > 0 && (
        <Image
          source={{ uri: photos[photos.length - 1].full }}
          style={{ width: "100%", height: "100%" }}
        />
      )}
    </TouchableOpacity>

    <Pressable onPress={takePicture}>
      {({ pressed }) => (
        <View style={[styles.shutterBtn, { opacity: pressed ? 0.5 : 1 }]}>
          <View style={styles.shutterBtnInner} />
        </View>
      )}
    </Pressable>

    <Pressable onPress={toggleFacing}>
      <FontAwesome6 name="rotate-left" size={32} color="white" />
    </Pressable>
  </View>
</View>

      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", justifyContent: "center", alignItems: "center" },
  camera: { flex: 1, width: "100%" },
bottomBar: {
  position: "absolute",
  bottom: 44,
  left: 0,
  width: "100%",
  flexDirection: "column",
  alignItems: "center",
  gap: 15,
},

galleryBtn: {
  backgroundColor: "white",
  paddingHorizontal: 20,
  paddingVertical: 10,
  borderRadius: 10,
  alignSelf: "center",
  width: 120,
  justifyContent: 'center',
  alignItems: 'center',
},

  galleryBtnContainer: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: 'center'
  },
  
  galleryText: {
    color: "black",
    fontSize: 16,
    fontFamily: "Poppins_700Bold",
  },

  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "white",
    backgroundColor: "#fff",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },

  shutterBtn: {
    backgroundColor: "transparent",
    borderWidth: 5,
    borderColor: "white",
    width: 85,
    height: 85,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterBtnInner: {
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor: "white",
  },
});
