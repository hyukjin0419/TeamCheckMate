import { useNavigation } from "@react-navigation/core";
import React, { useState, useEffect } from "react";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";
import { Alert } from "react-native";
import styles from "./css.js";

export default function SignInPage() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("User signed in: ", user.email);
        navigation.replace("InitialPage");
      }
    });

    return unsubscribe;
  }, []);

  //회원가입 관련 함수
  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log("Registered with: " + user.email);
      })
      .catch((error) => Alert.alert(error.message));
  };

  //로그인 관련 함수
  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log("Logged in with: " + user.email);
      })
      .catch((error) => Alert.alert(error.message));
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      {/*head 부분*/}
      <View style={styles.head}>
        <TouchableOpacity onPress={() => navigation.navigate("InitialPage")}>
          <AntDesign name="left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>가입하기</Text>
      </View>

      {/*입력창*/}
      <View style={styles.textBox}>
        {/*이메일 입력창*/}
        <TextInput
          placeholder="이메일"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.textInput}
          keyboardType="email-address"
        />
        {/*이메일 입력창*/}
        <TextInput
          placeholder="비밀번호"
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={styles.textInput}
          secureTextEntry
        />
      </View>
      <View>
        <TouchableOpacity
          onPress={handleSignUp}
          style={{ ...styles.button, backgroundColor: "#050026" }}
        >
          <Text style={{ ...styles.buttonText, color: "white" }}>가입하기</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
