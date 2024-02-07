//과제 추가 화면
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { color } from "../styles/colors";
import { db, collection, addDoc } from "../../firebase";
import { useNavigation } from "@react-navigation/core";
import s from "../styles/css";
import DateTimePicker from "@react-native-community/datetimepicker";

const WINDOW_WIDHT = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;

export default AssignmentAddPage = () => {
  const navigation = useNavigation();

  {
    /* AssignmentPage에서 팀 이름, 파일 아이콘 색상, 팀 id 불러오기 */
  }
  const route = useRoute();
  const {
    teamCode: teamCode,
    title: title,
    fileColor: fileColor,
    memberInfo: memberInfo,
    memberNames: memberNames,
  } = route.params;
  {
    /* 과제추가 확인버튼 상태 변경 코드 */
  }
  const [confirmBtnColor, setConfirmBtnColor] = useState(color.deactivated); //확인버튼 색상 (초기값: 비활성화)
  const [buttonDisabled, setButtonDisabled] = useState(true); //확인버튼 상태 (초기값: 비활성화)

  {
    /*과제 이름, 제출기한*/
  }
  const [assignmentName, setAssignmentName] = useState("");

  const [dueDateValid, setDueDateValid] = useState(false);
  const [assignmentValid, setAssignmentValid] = useState(false);
  const [maxLength, setMaxLength] = useState(40); // 기본값은 영어일 때의 maxLength

  {
    /* 과제이름, 제출기한 둘 다 valid input인 경우 확인버튼 활성화 */
  }

  const handleNameChange = (text) => {
    setAssignmentName(text);
    if (text.length > 0 && dueDateValid == true) {
      setButtonDisabled(false);
      setConfirmBtnColor(color.activated);
      setAssignmentValid(true);
    } else {
      setButtonDisabled(true);
      setConfirmBtnColor(color.deactivated);
    }
    const isKorean = /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(text);
    setMaxLength(isKorean ? 20 : 40);
  };
  //제출기한
  const [date, setDate] = useState(new Date());
  const [dueDate, setDueDate] = useState("제출 기한");

  //날짜, 시간 선택 시 정보 저장
  const onChange = (e, selectedDate) => {
    setDate(selectedDate);

    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");
    const weekday = new Intl.DateTimeFormat("ko-KR", {
      weekday: "short",
    }).format(selectedDate);
    const hour = String(selectedDate.getHours() % 12 || 12).padStart(2, "0");
    const minute = String(selectedDate.getMinutes()).padStart(2, "0");
    const ampm = selectedDate.getHours() >= 12 ? "오후" : "오전";

    //제출기한 string
    const formattedDate = `${year}.${month}.${day}.(${weekday}) ${ampm} ${hour}:${minute}`;
    {
      /* dueDate에 제출기한 string 저장 */
    }
    setDueDate(formattedDate);
    setTextStyle(styles.dueDateTextAfterSelectingDate);
    setDueDateValid(true);

    // 제출날짜와 시간의 길이 체크, valid input인지 판별
    if (assignmentName.length > 0 && formattedDate.length > 0) {
      setButtonDisabled(false);
      setConfirmBtnColor(color.activated);
      setAssignmentValid(true);
    } else {
      setButtonDisabled(true);
      setConfirmBtnColor(color.deactivated);
      setAssignmentValid(false);
    }
  };

  {
    /* 제출기한 입력창 터치 시 캘린더 화면에 표시 */
  }
  const [show, setShow] = useState(false);
  const handleDueDatePress = () => {
    setShow(!show);
  };

  const [textStyle, setTextStyle] = useState(
    styles.dueDateTextBeforeSelectingDate
  );

  {
    /* 과제 추가 함수 */
  }
  const addAssignment = async () => {
    try {
      const teamCollectionRef = collection(db, "team", teamCode, "과제 list");
      const assignmentDocRef = await addDoc(teamCollectionRef, {
        assignmentName: assignmentName,
        dueDate: dueDate,
        regDate: new Date(),
        modDate: null,
      });

      console.log(
        "과제가 성공적으로 추가되었습니다. 문서 ID:",
        assignmentDocRef.id,
        "과제이름:",
        assignmentName
      );

      // assignmentDocRef.id 값이 정상적으로 존재할 때에만 navigation.navigate 호출
      if (assignmentDocRef.id) {
        navigation.navigate("AssignmentPage", {
          teamCode: teamCode,
          title: title,
          fileColor: fileColor,
          memberInfo: memberInfo,
          memberNames: memberNames,
        });
      } else {
        console.error("assignmentDocRef.id 값이 유효하지 않습니다.");
      }
    } catch (error) {
      console.error("과제 추가 중 오류 발생:", error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={s.container}>
        <StatusBar style={"dark"}></StatusBar>
        {/* 헤더 (뒤로가기 버튼, 과제추가 헤더, 확인버튼) */}
        <View style={s.headContainer}>
          {/* 뒤로가기 버튼 */}
          <TouchableOpacity
            style={s.headBtn}
            onPress={() => {
              navigation.navigate("AssignmentPage", {
                teamCode: teamCode,
                title: title,
                fileColor: fileColor,
                memberInfo: memberInfo,
                memberNames: memberNames,
              });
            }}
          >
            <AntDesign name="left" size={20} color="black" />
          </TouchableOpacity>

          <Text style={s.title}>과제 추가</Text>

          {/* 확인 버튼 */}
          <TouchableOpacity
            style={s.titleRightBtn}
            disabled={buttonDisabled}
            onPress={() => {
              addAssignment();
            }}
          >
            <Text style={{ ...s.titleRightText, color: confirmBtnColor }}>
              확인
            </Text>
          </TouchableOpacity>
        </View>

        {/* 과제이름 입력란 */}

        <View style={s.inputContainer}>
          <View style={s.textInputContainer}>
            <TextInput
              placeholder="과제 이름"
              onChangeText={handleNameChange}
              maxLength={maxLength}
              value={assignmentName}
              style={s.textInput}
            ></TextInput>
          </View>
          {/* 제출기한 입력창 (터치 시 date time picker 표시) */}
          <TouchableOpacity
            style={styles.dueDateTextInputBox}
            onPress={handleDueDatePress}
          >
            <Text style={textStyle}>{dueDate}</Text>
          </TouchableOpacity>
          {/* DatePicker */}
          {show && (
            <View style={styles.pickerContainer}>
              <DateTimePicker
                value={date}
                mode="datetime"
                display="inline"
                style={styles.dueDateBox}
                onChange={onChange}
                themeVariant="light"
              />
            </View>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  dueDateTextInputBox: {
    height: 60,
    borderBottomWidth: 1.5,
    justifyContent: "center",
  },
  dueDateTextBeforeSelectingDate: {
    color: color.placeholdergrey,
    fontSize: 16,
    fontFamily: "SUIT-Regular",
    marginTop: "5%",
    marginLeft: "1%",
  },
  dueDateTextAfterSelectingDate: {
    color: "black",
    fontSize: 16,
    fontFamily: "SUIT-Regular",
    marginTop: "5%",
    marginLeft: "1%",
  },
  pickerContainer: {
    marginTop: "5%",
    alignItems: "center",
    //flexDirection: "row",
    justifyContent: "center",
    //backgroundColor: "red",
    width: "100%",
  },
  dueDateBox: {
    //backgroundColor: "skyblue",
    textDecorationColor: "red",
    width: "100%",
    height: "100%",
  },
});
