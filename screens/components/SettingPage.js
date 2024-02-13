import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  TouchableOpacity,
  Dimensions,
  Switch,
} from "react-native";
import { auth } from "../../firebase";
import React, { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import s from "../styles/css";
import { color } from "../styles/colors";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/core";

const WINDOW_WIDHT = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;

const SettingPage = () => {
  const navigation = useNavigation();

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  return (
    <View style={s.container}>
      <StatusBar style={"dark"}></StatusBar>
      {/* 뒤로가기 버튼, 팀 등록 헤더와 확인버튼 컨테이너 */}
      <View style={s.headContainer}>
        <View style={s.headBtn}></View>
        <Text style={s.title}>설정</Text>
        <View style={s.titleRightBtn}></View>
      </View>
      <View style={styles.container}>
        <View style={styles.optionContainer}>
          <Text style={styles.text}>알림</Text>
          <Switch
            trackColor={{ false: color.deactivated, true: color.activated }}
            thumbColor={"white"}
            ios_backgroundColor={color.deactivated}
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
        <View style={styles.optionContainer}>
          <Text style={styles.text}>이메일 변경</Text>
          <Image
            style={{ width: 7, height: 12, marginRight: "2%" }}
            source={require("../images/optionRight.png")}
          />
        </View>
        <View style={styles.optionContainer}>
          <Text style={styles.text}>비밀번호 변경</Text>
          <Image
            style={{ width: 7, height: 12, marginRight: "2%" }}
            source={require("../images/optionRight.png")}
          />
        </View>
        <View style={styles.optionContainer}>
          <Text style={styles.text}>계정 정보 수정</Text>
          <Image
            style={{ width: 7, height: 12, marginRight: "2%" }}
            source={require("../images/optionRight.png")}
          />
        </View>
        <TouchableOpacity
          style={styles.optionContainer}
          onPress={() => navigation.navigate("AppInformationPage")}
        >
          <Text style={styles.text}>앱 정보</Text>
          <Image
            style={{ width: 7, height: 12, marginRight: "2%" }}
            source={require("../images/optionRight.png")}
          />
        </TouchableOpacity>
        <View style={styles.optionContainer}>
          <Text style={styles.text}>문의하기</Text>
          <Image
            style={{ width: 7, height: 12, marginRight: "2%" }}
            source={require("../images/optionRight.png")}
          />
        </View>
        <View style={{ ...s.modalTeamBtnContainer, marginTop: 15 }}>
          <TouchableOpacity
            style={styles.logOutBtn}
            onPress={() => signOut(auth)}
          >
            <Text style={styles.logOutText}>로그아웃</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.accountDeleteBtn}>
            <Text style={styles.accountDeleteText}>탈퇴</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SettingPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  optionContainer: {
    height: 60,
    width: "95%",
    alignItems: "center",
    borderBottomWidth: 1.5,
    borderColor: color.deactivated,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  logOutBtn: {
    width: WINDOW_WIDHT * 0.41,
    height: 55,
    backgroundColor: color.activated,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  logOutText: {
    color: "white",
    fontFamily: "SUIT-Medium",
    fontSize: 14,
  },
  accountDeleteBtn: {
    width: WINDOW_WIDHT * 0.41,
    height: 55,
    backgroundColor: color.deletegrey,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  accountDeleteText: {
    color: color.redpink,
    fontFamily: "SUIT-Medium",
    fontSize: 14,
  },
  text: {
    fontSize: 14,
    fontFamily: "SUIT-Medium",
    color: color.activated,
    marginLeft: "1%",
  },
});
