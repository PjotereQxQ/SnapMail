import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
  ScrollView,
  Pressable
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Picker } from "@react-native-picker/picker";

type User = {
  email: string;
  role: string;
  target_mail: string;
};

const API_URL = "https://snapmail-backend.onrender.com";

export default function UsersScreen({ navigation }: any) {
  const { width, height } = useWindowDimensions();
  const [users, setUsers] = useState<User[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("User");

  // Pobierz użytkowników z backendu
  const loadUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/users`);
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Błąd przy pobieraniu użytkowników:", error);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const addUser = async () => {
    if (!newEmail) return Alert.alert("Wpisz email");
    if (!validateEmail(newEmail))
      return Alert.alert("Nieprawidłowy format emaila");

    try {
      await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail, role: newRole, target_mail: newEmail }),
      });
      setNewEmail("");
      setNewRole("User");
      loadUsers();
    } catch (error) {
      console.error("Błąd przy dodawaniu:", error);
    }
  };

 const deleteUser = async (email: string) => {
  const adminCount = users.filter(u => u.role === "Admin").length;
  const userToDelete = users.find(u => u.email === email);

  if (userToDelete?.role === "Admin" && adminCount === 1) {
    // Jeśli jest jedyny admin
    Alert.alert(
      "Nie można usunąć",
      "Nie można usunąć jedynego admina. Tworzę domyślnego admina..."
    );
    try {
      await fetch(`${API_URL}/users/default-admin`, { method: "POST" });
      loadUsers();
    } catch (error) {
      console.error("Błąd przy tworzeniu domyślnego admina:", error);
    }
    return;
  }

  Alert.alert("Usuń użytkownika", `Czy na pewno chcesz usunąć ${email}?`, [
    { text: "Anuluj", style: "cancel" },
    {
      text: "Usuń",
      style: "destructive",
      onPress: async () => {
        try {
          await fetch(`${API_URL}/users/${email}`, { method: "DELETE" });
          loadUsers();
        } catch (error) {
          console.error("Błąd przy usuwaniu:", error);
        }
      },
    },
  ]);
};

const changeRole = async (email: string, newRole: string, target_mail: string) => {
  // Walidacja target_mail
  if (!validateEmail(target_mail)) {
    Alert.alert("Nieprawidłowy mail docelowy", "Wpisz poprawny adres email.");
    loadUsers(); // przywraca poprzednią wartość w UI
    return;
  }

  const adminCount = users.filter(u => u.role === "Admin").length;
  const userToChange = users.find(u => u.email === email);

  if (userToChange?.role === "Admin" && newRole !== "Admin" && adminCount === 1) {
    Alert.alert(
      "Nie można zmienić roli",
      "Nie można zmienić roli jedynego admina."
    );
    loadUsers(); 
    return;
  }

  try {
    await fetch(`${API_URL}/users/${email}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole, target_mail }),
    });
    loadUsers();
  } catch (error) {
    console.error("Błąd przy zmianie roli:", error);
  }
};



  return (
    <LinearGradient
      colors={["#3B82F6", "#9333EA"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.body, { paddingTop: height * 0.1 }]}
    >
      <View style={styles.header}>
        <Text style={styles.text}>Użytkownicy</Text>
      </View>

      <ScrollView style={{ width: "90%", marginBottom: 20 }}>
        {users.map((u) => (
          <View key={u.email} style={styles.userCard}>
            <Pressable
              onPress={() => Alert.alert("Pełny email", u.email)}
              style={styles.emailWrapper}
            >
              <Text style={styles.userText} numberOfLines={1} ellipsizeMode="tail">
                {u.email}
              </Text>
            </Pressable>

            <TextInput
              style={styles.destinationInput}
              value={u.target_mail || u.email}
              onChangeText={(text) =>
                setUsers(
                  users.map((x) =>
                    x.email === u.email ? { ...x, target_mail: text } : x
                  )
                )
              }
              onEndEditing={(e) => changeRole(u.email, u.role, e.nativeEvent.text)}
              placeholder="Mail docelowy"
              keyboardType="email-address"
            />

            <View style={styles.buttonsRow}>
              <View style={styles.rolePickerWrapper}>
                <Picker
                  selectedValue={u.role}
                  style={styles.rolePicker}
                  onValueChange={(itemValue) =>
                    changeRole(u.email, itemValue, u.target_mail)
                  }
                >
                  <Picker.Item label="User" value="User" />
                  <Picker.Item label="Admin" value="Admin" />
                </Picker>
              </View>

              <TouchableOpacity
                style={styles.deleteButtonCard}
                onPress={() => deleteUser(u.email)}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>Usuń</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <TextInput
        style={styles.input}
        placeholder="Email nowego użytkownika"
        value={newEmail}
        onChangeText={setNewEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View style={styles.newRoleWrapper}>
        <Picker
          selectedValue={newRole}
          style={styles.newRolePicker}
          onValueChange={(itemValue) => setNewRole(itemValue)}
        >
          <Picker.Item label="User" value="User" />
          <Picker.Item label="Admin" value="Admin" />
        </Picker>
      </View>

      <View style={[styles.buttons, { gap: width * 0.1 }]}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "white", width: width * 0.3 }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Powrót</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#10B981", width: width * 0.3 }]}
          onPress={addUser}
        >
          <Text style={styles.buttonText}>Dodaj</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

// (styles zostają takie same)

const styles = StyleSheet.create({
  body: { flex: 1, alignItems: "center", padding: 20 },
  header: { width: "100%", justifyContent: "center", alignItems: "center", marginBottom: 20 },
  text: { fontSize: 36, fontFamily: "Poppins_700Bold", color: "white", textShadowColor: "rgba(0,0,0,0.5)", textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 5 },
  userRow: { flexDirection: "row", alignItems: "center", marginBottom: 10, backgroundColor: "rgba(255,255,255,0.15)", paddingVertical: 8, paddingHorizontal: 10, borderRadius: 10 },


  deleteButton: { backgroundColor: "#EF4444", paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, marginLeft: 8 },

  input: { width: "80%", backgroundColor: "rgba(255,255,255,0.4)", padding: 12, borderRadius: 12, fontSize: 16, marginBottom: 12 },


  newRoleWrapper: { width: "80%", backgroundColor: "rgba(255,255,255,0.4)", borderRadius: 12, overflow: "hidden", marginBottom: 12 },
  newRolePicker: { width: "100%", color: "black" },
  buttons: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 20 },
  buttonText: { color: "black", fontFamily: "Poppins_700Bold", fontSize: 16 },
  button: { backgroundColor: "#FFFFFF", height: 60, justifyContent: "center", alignItems: "center", borderRadius: 18, marginBottom: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 5 },

  userCard: {
  width: "100%",
  backgroundColor: "rgba(255,255,255,0.15)",
  padding: 12,
  borderRadius: 12,
  marginBottom: 12,
},

emailWrapper: {
  marginBottom: 8,
},

userText: {
  color: "white",
  fontSize: 16,
  fontWeight: "bold",
},

destinationInput: {
  width: "100%",
  backgroundColor: "rgba(255,255,255,0.3)",
  padding: 10,
  borderRadius: 10,
  marginBottom: 12,
  fontSize: 14,
},

buttonsRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
},

rolePickerWrapper: {
  flex: 1,
  marginRight: 8,
  backgroundColor: "white",
  borderRadius: 10,
  overflow: "hidden",
  height: 50, // ta sama wysokość co przycisk
  justifyContent: "center",
},

rolePicker: {
  width: "100%",
  color: "black",
  height: 50,
},

deleteButtonCard: {
  flex: 1,
  backgroundColor: "#EF4444",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 10,
  height: 50, // ta sama wysokość co picker
},

});
