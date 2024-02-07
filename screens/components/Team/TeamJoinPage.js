//팀 참여하기 화면
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/core";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { color } from "../../styles/colors";
import s from "../../styles/css";
import {
  db,
  collection,
  auth,
  doc,
  setDoc,
  getDocs,
  getDoc,
  updateDoc,
} from "../../../firebase";
import { arrayUnion } from "firebase/firestore";
import { showToast, toastConfig } from "../Toast";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";

export default function TeamJoinPage() {
  const navigation = useNavigation();
  //회원정보 가져오기
  const user = auth.currentUser;
  //가져온 정보에서 이메일 빼서 저장하기
  const email = user.email;
  //확인 버튼 색상 초기값 (회색)
  const [confirmBtnColor, setConfirmBtnColor] = useState(color.placeholdergrey);
  //확인 버튼 상태 초기값 (비활성화 상태)
  const [buttonDisabled, setButtonDisabled] = useState(true);
  //참여코드
  const [teamCode, setTeamCode] = useState("");
  //확인 버튼 한번 누르면, 다음부터는 안눌릴 수 있도록 하기 위한 변수
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  //문자 입력시 확인버튼 활성화, 색상 변경
  const activatedHeadBtn = (text) => {
    setTeamCode(text);
    if (text.length > 0) {
      setButtonDisabled(false);
      setConfirmBtnColor(color.activated);
    } else {
      setButtonDisabled(true);
      setConfirmBtnColor(color.placeholdergrey);
    }
  };

  //확인 버튼 누르면 팀 코드가, 자신의 teamList 문서에 추가된다
  const pressHeadBtn = async () => {
    try {
      Keyboard.dismiss();

      const teamRef = doc(db, "team", teamCode);
      const teamDoc = await getDoc(teamRef);

      if (teamDoc.exists()) {
        const userRef = doc(db, "user", email);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const membersRef = collection(teamRef, "members");

          const existingMemberDoc = await getDoc(doc(membersRef, email));

          console.log("IsAlready?", existingMemberDoc);
          if (existingMemberDoc.exists()) {
            setTimeout(
              () => showToast("success", "  이미 참여중인 팀입니다"),
              300
            );
            console.log("이미 참여 완료된 팀입니다.");
            return;
          } else {
            const memberObject = {
              name: userData.name || "undefined",
              email: email || "undefined",
              phoneNumber: userData.phoneNumber || "undefined",
              school: userData.school || "undefined",
              studentNumber: userData.studentNumber || "undefined",
              joinedTime: new Date(),
              updateTime: null,
            };

            const memberDocRef = doc(collection(teamRef, "members"), email);
            await setDoc(memberDocRef, memberObject);

            // 팀코드 -> 유저 페이지에 추가

            const teamListCollectionRef = collection(userRef, "teamList");
            await setDoc(doc(teamListCollectionRef, teamCode), {
              teamID: teamCode,
            });

            console.log("Member added to the team successfully.");
            navigation.navigate("TeamPage");
            showToast(
              "success",
              " ✓  팀 참여 완료! 이번 팀플도 파이팅하세요 :)"
            );
          }
        } else {
          console.log("사용자 문서가 존재하지 않습니다.");
          showToast(
            "success",
            "  그럴리는 없지만 등록되지 않은 사용자 입니다."
          );
        }
      } else {
        console.log("팀 문서가 존재하지 않습니다.");
        setTimeout(() => showToast("success", "  등록되지 않은 팀입니다"), 300);
      }
    } catch (e) {
      console.error("[TeamJoinPage]", e);
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <KeyboardAvoidingView style={s.container}>
        {/* 헤더부분 */}
        <View style={s.headContainer}>
          <TouchableOpacity
            style={s.headBtn}
            onPress={() => navigation.goBack()}
          >
            <AntDesign name="left" size={20} color="black" />
          </TouchableOpacity>
          <Text style={s.title}>팀 참여</Text>
          <TouchableOpacity
            disabled={buttonDisabled}
            style={s.titleRightBtn}
            onPress={() => {
              pressHeadBtn();
            }}
          >
            <Text style={{ ...s.titleRightText, color: confirmBtnColor }}>
              확인
            </Text>
          </TouchableOpacity>
        </View>
        <View style={s.inputContainer}>
          <View style={s.textInputContainer}>
            <TextInput
              placeholder="참여 코드"
              onChangeText={activatedHeadBtn}
              style={s.textInput}
            ></TextInput>
          </View>
        </View>
        <Toast
          position="bottom"
          visibilityTime={800}
          config={toastConfig}
          keyboardOffset={null}
        />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  //화면 전체 컨테이너
  container: {
    flex: 1,
    paddingHorizontal: "5%",
    // backgroundColor: "teal",
  },
  //화면 상단 헤드 컨테이너
  headContainer: {
    display: "flex",
    marginTop: "18%",
    flexDirection: "row",
    marginBottom: "2%",
    // backgroundColor: "violet",
  },
  //헤더 컨테이너 안 왼쪽 버튼
  headBtn: {
    flex: 1,
    alignSelf: "flex-start", // 왼쪽 정렬
    // backgroundColor: "red",
  },
  //헤더 컨테이너 가운데 텍스트
  title: {
    flex: 2,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
    // backgroundColor: "yellow",
  },
  //헤더 컨테이너 오른쪽 TouchableOpacity
  titleRightBtn: {
    flex: 1,
    // backgroundColor: "blue",
  },
  //헤더 컨테이너 오른쪽 TouchableOpacity안 Text
  titleRightText: {
    fontWeight: "bold",
    fontSize: 16,
    alignSelf: "flex-end", // 오른쪽 정렬
  },
  //참여 코드 입력창
  inputContainer: {
    // backgroundColor: "yellow",
    marginTop: 20,
    flex: 0.08,
    display: "flex",
    justifyContent: "center",
    borderBottomWidth: 2,
  },
  inputContainerText: {
    marginLeft: 10,
  },
});
