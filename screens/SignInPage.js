import { useNavigation } from "@react-navigation/core";
import React, { useState } from "react";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

export default function SignInPage() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.head}>
        <TouchableOpacity
          style={styles.headBtn}
          onPress={() => navigation.navigate("InitialPage")}
        >
          <AntDesign name="left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>가입하기</Text>
      </View>

      <View style={styles.textBox}>
        <TextInput
          placeholder="이메일"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.textInput}
          keyboardType="email-address"
        />
        <TextInput
          placeholder="비밀번호"
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={styles.textInput}
          secureTextEntry
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: "5%",
    backgroundColor: "white",
  },
  head: {
    marginTop: "18%",
    flexDirection: "row",
  },
  headBtn: {},
  title: {
    fontWeight: "bold",
    fontSize: 16,
    left: "630%",
  },
  textBox: {
    marginTop: "10%",
  },
  textInput: {
    margin: "3%",
    fontSize: 16,
    borderBottomColor: "grey",
    borderBottomWidth: 2,
    paddingBottom: 10,
  },
});
