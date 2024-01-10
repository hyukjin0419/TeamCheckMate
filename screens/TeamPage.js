import { useNavigation } from "@react-navigation/core";
import { View, Text } from "react-native";
import React from "react";
import { auth } from "../firebase";

export default function TeamPage() {
  const navigation = useNavigation();

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("SignInPage");
      })
      .catch((error) => alert(error.message));
  };

  return (
    <View>
      <Text>TeamPage</Text>
    </View>
  );
}
