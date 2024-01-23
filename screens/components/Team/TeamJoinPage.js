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

export default function TeamJoinPage() {
  const navigation = useNavigation();

  const [confirmBtnColor, setConfirmBtnColor] = useState(color.deactivated); //확인 버튼 색상 초기값 (회색)
  const [buttonDisabled, setButtonDisabled] = useState(true); //확인 버튼 상태 초기값 (비활성화 상태)

  //참여코드
  const [joinCode, setJoinCode] = useState("");
  //문자 입력시 확인버튼 활성화, 색상 변경

  //문자 입력시 확인버튼 활성화, 색상 변경
  const joinCodeInputChange = (text) => {
    setJoinCode(text);
    if (text.length > 0) {
      setButtonDisabled(false);
      setConfirmBtnColor(color.activated);
    } else {
      setButtonDisabled(true);
      setConfirmBtnColor(color.deactivated);
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
          <TouchableOpacity disabled={buttonDisabled} style={s.titleSendBtn}>
            <Text style={{ ...s.titleSendText }}>확인</Text>
          </TouchableOpacity>
        </View>
        <View style={s.inputContainer}>
          <TextInput
            placeholder="참여 코드"
            onChangeText={joinCodeInputChange}
            style={s.inputContainerText}
          ></TextInput>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const s = StyleSheet.create({
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
  titleSendBtn: {
    flex: 1,
    // backgroundColor: "blue",
  },
  //헤더 컨테이너 오른쪽 TouchableOpacity안 Text
  titleSendText: {
    fontWeight: "bold",
    fontSize: 16,
    alignSelf: "flex-end", // 오른쪽 정렬
  },
  //참여 코드 입력창
  inputContainer: {
    // backgroundColor: "yellow",
    marginTop: 40,
    flex: 0.08,
    display: "flex",
    justifyContent: "center",
    borderBottomWidth: 2,
  },
  inputContainerText: {
    marginLeft: 10,
  },
});
