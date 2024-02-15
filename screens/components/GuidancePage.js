import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { View, TouchableOpacity, StyleSheet, Image, Text } from "react-native";
import s from "../styles/css";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/core";

const YourComponent = () => {
  const navigation = useNavigation();

  return (
    <View style={s.container}>
      <StatusBar style={"dark"}></StatusBar>
      {/* 뒤로가기 버튼, 팀 등록 헤더와 확인버튼 컨테이너 */}
      <View style={s.headContainer}>
        <View style={s.headBtn}></View>
        <Text style={s.title}>길라잡이</Text>
        <View style={s.titleRightBtn}></View>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "10%",
        }}
      >
        <Image
          style={styles.noPostIcon}
          source={require("../images/GuidancePageNoPost.png")}
        ></Image>
        <Text style={styles.noPostText}>등록된 내용이 없어요.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  noPostIcon: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  noPostText: {
    fontFamily: "SUIT-Medium",
    fontSize: 14,
    textAlign: "center",
    color: "#797979",
    marginTop: "3%",
  },
});

export default YourComponent;
