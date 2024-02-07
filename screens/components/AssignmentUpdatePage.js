//과제 추가 화면
import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { color } from "../styles/colors";
import { db, collection, doc, updateDoc } from "../../firebase";
import { useNavigation } from "@react-navigation/core";
import DateTimePicker from "@react-native-community/datetimepicker";
import s from "../styles/css";

const WINDOW_WIDHT = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;

export default AssignmentUpdatePage = () => {
  const navigation = useNavigation();

  {
    /* 팀 이름, 파일 아이콘 색상, 팀 id 불러오기 */
  }
  const route = useRoute();
  const {
    teamCode,
    title,
    fileColor,
    memberInfo,
    memberNames,
    assignmentName,
    assignmentId,
    dueDate,
  } = route.params;
  {
    /* 과제 추가 확인 버튼 상태 변경 코드 */
  }
  const [confirmBtnColor, setConfirmBtnColor] = useState(color.placeholdergrey); //확인 버튼 색상 (초기값: 비활성화)
  const [buttonDisabled, setButtonDisabled] = useState(true); //확인 버튼 상태 (초기값:비활성화 상태)

  {
    /*과제 이름, Duedate*/
  }
  const [name, setAssignmentName] = useState(assignmentName);
  const [date, setDate] = useState(new Date()); // Assuming 'dueDate' is a valid date string

  const [dueDateTime, setDueDateTime] = useState(dueDate);

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
    setDueDateTime(formattedDate);
    setTextStyle(styles.dueDateTextAfterSelectingDate);

    // 제출날짜와 시간의 길이 체크, valid input인지 판별
    if (assignmentName.length > 0 && formattedDate.length > 0) {
      setButtonDisabled(false);
      setConfirmBtnColor(color.activated);
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
      setConfirmBtnColor(color.placeholdergrey);
      setButtonDisabled(true);
    }
  };

  {
    /* 과제이름, Duedate가 둘 다 valid input인 경우 확인버튼 활성화 */
  }
  const [maxLength, setMaxLength] = useState(30); // 영어일 때의 maxLength
  //과제이름
  const AssignmentNameInputChange = (text) => {
    setAssignmentName(text);
    if (text.length > 0) {
      setButtonDisabled(false);
      setConfirmBtnColor(color.activated);
    } else {
      setButtonDisabled(true);
      setConfirmBtnColor(color.placeholdergrey);
    }
    const isKorean = /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(text);
    setMaxLength(isKorean ? 16 : 28);
  };

  const handleUpdate = async () => {
    try {
      // Reference to the "team" collection and the specific assignment document
      const teamDocumentRef = doc(collection(db, "team"), teamCode);
      const assignmentListCollectionRef = collection(
        teamDocumentRef,
        "과제 list"
      );
      const assignmentDocRef = doc(assignmentListCollectionRef, assignmentId);

      // Update document with new values
      await updateDoc(assignmentDocRef, {
        assignmentName: name,
        dueDate: dueDateTime,
      });

      // Navigate back after successful update
      navigation.goBack();
    } catch (error) {
      console.error("Error updating assignment:", error);
    }
  };

  const [show, setShow] = useState(false);
  const handleDueDatePress = () => {
    setShow(!show);
  };

  const [textStyle, setTextStyle] = useState(
    styles.dueDateTextBeforeSelectingDate
  );

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
            <Image
              style={{
                width: 8,
                height: 14,
              }}
              source={require("../images/backBtn.png")}
            />
          </TouchableOpacity>

          <Text style={s.title}>과제 수정</Text>

          {/* 확인 버튼 */}
          <TouchableOpacity
            style={s.titleRightBtn}
            disabled={buttonDisabled}
            onPress={() => {
              handleUpdate();
            }}
          >
            <Text style={{ ...s.titleRightText, color: confirmBtnColor }}>
              확인
            </Text>
          </TouchableOpacity>
        </View>
        {/* 과제이름 입력란 */}
        <View style={styles.inputContainer}>
          <View style={styles.TextInputContainer}>
            <TextInput
              placeholder={assignmentName}
              onChangeText={AssignmentNameInputChange}
              maxLength={maxLength}
              value={name}
              style={styles.TextInput}
            ></TextInput>
          </View>
          {/* 제출기한 입력창 (터치 시 date time picker 표시) */}
          <TouchableOpacity
            style={styles.dueDateTextInputBox}
            onPress={handleDueDatePress}
          >
            <Text style={textStyle}>{dueDateTime}</Text>
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
  container: {
    flex: 1,
    paddingHorizontal: "5%",
    backgroundColor: "white",
  },
  inputContainer: {
    flex: 1,
    justifyContent: "flex-start",
  },
  TextInput: {
    height: 50,
    fontSize: 16,
    fontFamily: "SUIT-Regular",
    marginLeft: "1%",
    marginTop: "5%",
    paddingTop: "2%",
  },
  TextInputContainer: {
    borderBottomWidth: 1.5,
  },
  dueDateTextInputBox: {
    height: 60,
    borderBottomWidth: 2,
    justifyContent: "center",
  },
  dueDateTextBeforeSelectingDate: {
    color: color.placeholdergrey,
    fontSize: 16,
    fontFamily: "SUIT-Regular",
    marginTop: "4%",
    marginLeft: "1%",
  },
  dueDateTextAfterSelectingDate: {
    color: "black",
    fontSize: 16,
    fontFamily: "SUIT-Regular",
    marginTop: "4%",
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
    width: "100%",
    height: "100%",
  },
});
