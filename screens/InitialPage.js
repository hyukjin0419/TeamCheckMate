//시작 화면
import { useNavigation } from "@react-navigation/core";
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import commonStyles from "./css.js";
import { auth } from "../firebase.js";

export default function InitialPage() {
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("User signed in: ", user.email);
        navigation.replace("TeamPage");
      }
    });

    return unsubscribe;
  }, []);

  return (
    <View style={commonStyles.container}>
      <StatusBar style={"dark"} />
      <View style={styles.logoContainter}>
        <Image
          style={styles.logoImage}
          source={require("./images/logo.png")}
        ></Image>
      </View>
      <View style={styles.imgContainer}>
        <Image
          style={styles.logInImage}
          source={require("./images/LoginImages.gif")}
        ></Image>
        <Text style={styles.description}>
          무임승차를 방지하기 위한 최적의 방법
        </Text>
      </View>
      <View style={styles.BtnContainter}>
        <TouchableOpacity
          onPress={() => navigation.navigate("LogInPage")}
          style={{ ...commonStyles.button, backgroundColor: "#050026" }}
        >
          <Text style={commonStyles.buttonText}>로그인</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("SignInPage")}
          style={commonStyles.subButton}
        >
          <Text style={commonStyles.subButtonText}>가입하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  logoContainter: {
    flex: 1.2,
    //backgroundColor: "teal",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "7%",
  },
  imgContainer: {
    flex: 2,
    //backgroundColor: "gray",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logInImage: {
    height: 270,
    width: 290,
  },
  logoImage: {
    height: 107,
    width: 115,
  },
  description: {
    color: "#050026",
    fontSize: 16,
    fontWeight: 400,
    alignSelf: "center",
    marginBottom: "11%",
  },
  BtnContainter: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
    marginBottom: "8%",
  },
});
