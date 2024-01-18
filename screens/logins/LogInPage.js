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
  signOut,
} from "firebase/auth";
import { auth } from "../../firebase";
import { Alert } from "react-native";
import styles from "../styles/css";

export default function LogInPage() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        if (user.emailVerified) {
          console.log("LogInPage -> User signed in: ", user.email);
        } else {
          alert("Email not verified");
          signOut(auth);
        }
      }
    });

    return unsubscribe;
  }, []);

  //로그인 관련 함수
  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log("Logged in with: " + user.email);
      })
      .catch((error) => {
        if (error.code === "auth/invalid-credential") {
          alert("You have entered the wrong email or password");
        }
      });
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.head}>
        <TouchableOpacity
          style={styles.headBtn}
          onPress={() => navigation.navigate("InitialPage")}
        >
          <AntDesign name="left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>로그인</Text>
      </View>

      <View style={styles.textBox}>
        <TextInput
          placeholder="이메일"
          autoCapitalize="none"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.textInput}
        />
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
          onPress={handleLogin}
          style={{ ...styles.button, backgroundColor: "#050026" }}
        >
          <Text style={{ ...styles.buttonText, color: "white" }}>Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
