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
import { db, doc, getDocs, collection, auth, getDoc } from "../../firebase";
import React, { useState, useEffect } from "react";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import s from "../styles/css";
import { color } from "../styles/colors";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/core";
import Modal from "react-native-modal";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const WINDOW_WIDHT = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;

const SettingPage = () => {
  const navigation = useNavigation();

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const [askingModalVisible, setaskingModalVisible] = useState(false);
  handleAskingModalPress = () => {
    setaskingModalVisible(!askingModalVisible);
  };

  const user = auth.currentUser;
  const email = user.email;
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [school, setSchool] = useState("");
  const [studentNumber, setStudentNumber] = useState("");

  const sendResetEmail = () => {
    if (user) {
      sendPasswordResetEmail(auth, email)
        .then(() => {
          // Password reset email sent!
          // ..
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // ..
        });
    }
  };

  const getUserInfo = async () => {
    try {
      // "user" collection에 접근
      const userCollection = collection(db, "user");

      // 특정 문서에 접근하기 위해 getDoc 사용 (email이 문서 ID인 경우)
      const userDoc = await getDoc(doc(userCollection, email));

      if (userDoc.exists()) {
        // 문서가 존재하는 경우 데이터 가져오기
        const userData = {
          name: userDoc.data().name,
          phoneNumber: userDoc.data().phoneNumber,
          school: userDoc.data().school,
          studentNumber: userDoc.data().studentNumber,
          // ... 기타 필드들
        };
        setName(userDoc.data().name);
        setPhoneNumber(userDoc.data().phoneNumber);
        setSchool(userDoc.data().school);
        setStudentNumber(userDoc.data().studentNumber);
      } else {
        console.log("해당 사용자의 문서가 존재하지 않습니다.");
      }
    } catch (error) {
      console.error("데이터 불러오기 중 오류 발생:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getUserInfo();
    }, [])
  );

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
            style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
            value={isEnabled}
          />
        </View>
        <TouchableOpacity
          style={styles.optionContainer}
          onPress={() => {
            navigation.navigate("PasswordResetPage");
            sendResetEmail();
          }}
        >
          <Text style={styles.text}>비밀번호 변경</Text>
          <Image
            style={{ width: 7, height: 12, marginRight: "2%" }}
            source={require("../images/optionRight.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionContainer}
          onPress={() => {
            navigation.navigate("UserInfoUpdatePage", {
              email: email,
              name: name,
              phoneNumber: phoneNumber,
              school: school,
              studentNumber: studentNumber,
            });
          }}
        >
          <Text style={styles.text}>계정 정보</Text>
          <Image
            style={{ width: 7, height: 12, marginRight: "2%" }}
            source={require("../images/optionRight.png")}
          />
        </TouchableOpacity>
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
            <Text style={s.askingModalCancelText}>로그아웃</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.accountDeleteBtn}
            onPress={() => {
              handleAskingModalPress();
              console.log("계정 탈퇴");
            }}
          >
            <Text style={s.askingModalConfirmText}>탈퇴</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        onBackdropPress={handleAskingModalPress}
        isVisible={askingModalVisible}
        animationIn="zoomIn"
        animationOut="zoomOut"
        animationInTiming={300}
        animationOutTiming={200}
        backdropTransitionInTiming={0}
        backdropTransitionOutTiming={0}
      >
        <View style={s.askingModal}>
          <View marginTop="5%">
            <Text style={s.askingModalText}>
              탈퇴 시 계정 정보가 모두 사라집니다.
            </Text>
            <Text style={s.askingModalText}>정말 탈퇴하실 건가요?</Text>
          </View>
          <View style={s.askingModalBtnContainer}>
            <TouchableOpacity
              style={s.askingModalCancelBtn}
              onPress={() => handleAskingModalPress()}
            >
              <Text style={s.askingModalCancelText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={s.askingModalConfirmBtn}
              onPress={() => {
                handleAskingModalPress();
                console.log("계정 탈퇴 확인");
              }}
            >
              <Text style={s.askingModalConfirmText}>탈퇴</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    borderBottomWidth: 1,
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
  accountDeleteBtn: {
    width: WINDOW_WIDHT * 0.41,
    height: 55,
    backgroundColor: color.deletegrey,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 14,
    fontFamily: "SUIT-Medium",
    color: color.activated,
    marginLeft: "1%",
  },
});
