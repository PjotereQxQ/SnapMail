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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as FileSystem from "expo-file-system";

type User = { email: string; role: string };

export default function UsersScreen({ route, navigation }: any) {
  const { width, height } = useWindowDimensions();
  const [users, setUsers] = useState<User[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("User");

  const path = FileSystem.documentDirectory + "users.json";

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const exists = await FileSystem.getInfoAsync(path);
        if (!exists.exists) {
          const defaultUsers = {
            "ziemblapiotr1@gmail.com": "Admin",
          };
          await FileSystem.writeAsStringAsync(path, JSON.stringify(defaultUsers));
        }

        const content = await FileSystem.readAsStringAsync(path);
        const obj = JSON.parse(content) as Record<string, string>;
        setUsers(
          Object.entries(obj).map(([email, role]): User => ({
            email,
            role: role as string,
          }))
        );
      } catch (error) {
        console.error("Błąd przy wczytywaniu users.json:", error);
      }
    };

    loadUsers();
  }, []);

  const saveUsersToFile = async (updatedUsers: User[]) => {
    const objToSave: Record<string, string> = {};
    updatedUsers.forEach(u => (objToSave[u.email] = u.role));
    try {
      await FileSystem.writeAsStringAsync(path, JSON.stringify(objToSave));
    } catch (error) {
      console.error("Błąd przy zapisie users.json:", error);
      Alert.alert("Błąd przy zapisie użytkowników");
    }
  };

  const addUser = async () => {
    if (!newEmail) return Alert.alert("Wpisz email");
    if (users.find(u => u.email === newEmail)) return Alert.alert("Użytkownik już istnieje");

    const updatedUsers = [...users, { email: newEmail, role: newRole == "Admin" ? 'Admin' : 'User' }];
    setUsers(updatedUsers);
    await saveUsersToFile(updatedUsers);
    setNewEmail("");
    setNewRole("User");
  };

  const changeRole = async (email: string, newRoleValue: string) => {
  const role = newRoleValue === "Admin" ? "Admin" : "User"; 
  const updatedUsers = users.map(u =>
    u.email === email ? { ...u, role } : u
  );
  setUsers(updatedUsers);
  await saveUsersToFile(updatedUsers);
};

const deleteUser = (email: string) => {
  Alert.alert(
    "Usuń użytkownika",
    `Czy na pewno chcesz usunąć ${email}?`,
    [
      { text: "Anuluj", style: "cancel" },
      {
        text: "Usuń",
        style: "destructive",
        onPress: async () => {
          let updatedUsers = users.filter(u => u.email !== email);

          const hasAdmin = updatedUsers.some(u => u.role === "Admin");

          if (!hasAdmin) {
            updatedUsers.push({ email: "ziemblapiotr1@gmail.com", role: "Admin" });
            Alert.alert(
              "Uwaga",
              "Nie było żadnego admina - dodano użytkownika domyślnego."
            );
          }

          setUsers(updatedUsers);
          await saveUsersToFile(updatedUsers);
        }
      }
    ]
  );
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
  {users.map(u => (
    <View key={u.email} style={styles.userRow}>
      <Text style={styles.userText}>{u.email}</Text>

      <TextInput
        style={styles.roleInput}
        value={u.role}
        onChangeText={text => {
          setUsers(users.map(x => x.email === u.email ? { ...x, role: text } : x));
        }}
        onEndEditing={e => {
          changeRole(u.email, e.nativeEvent.text);
        }}
      />

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteUser(u.email)}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Usuń</Text>
      </TouchableOpacity>
    </View>
  ))}
</ScrollView>


      <TextInput
        style={styles.input}
        placeholder="Email nowego użytkownika"
        value={newEmail}
        onChangeText={setNewEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Rola (User/Admin)"
        value={newRole}
        onChangeText={setNewRole}
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
                  { backgroundColor: "#10B981", width: width * 0.3 },
                ]}
                onPress={addUser}
              >
                <Text style={styles.buttonText}>Dodaj</Text>
              </TouchableOpacity>
            </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: "center",
    padding: 20,
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
  userRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 8,
    borderRadius: 10,
  },
  userText: {
    color: "white",
    flex: 1,
  },
  roleInput: {
    width: 80,
    backgroundColor: "white",
    padding: 5,
    borderRadius: 6,
    marginHorizontal: 5,
    textAlign: "center",
  },
  deleteButton: {
    backgroundColor: "#EF4444",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  input: {
    width: "80%",
    backgroundColor: "rgba(255,255,255,0.4)",
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 10,
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
