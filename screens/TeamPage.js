import { useNavigation } from "@react-navigation/core";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { auth } from "../firebase";

export default function TeamPage() {
  const navigation = useNavigation();

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("InitialPage");
      })
      .catch((error) => alert(error.message));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleSignOut} style={styles.logInBtn}>
          <Text style={styles.logInText}>로그아웃</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("AddMembers")} style={styles.logInBtn}>
          <Text style={styles.logInText}>Add Members</Text>
      </TouchableOpacity>
     </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  logInBtn: {
    backgroundColor: "#050026",
    borderRadius: 9,
    alignItems: "center",
    paddingVertical: "5%",
    marginBottom: "3%",
  },
  logInText: {
    color: "white",
    fontSize: 18,
    fontWeight: 400,
  },
});