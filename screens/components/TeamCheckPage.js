import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  FlatList,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  ImageBackground,
} from "react-native";
import {
  db,
  collection,
  addDoc,
  doc,
  getDocs,
  updateDoc,
} from "../../firebase.js";
import Modal from "react-native-modal";
import { query, orderBy, arrayRemove } from "firebase/firestore";
import React, { useEffect, useState, useRef } from "react";
import { useNavigation } from "@react-navigation/core";
import { useRoute } from "@react-navigation/native";
import { color } from "../styles/colors";
import s from "../styles/css.js";
import { AntDesign } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import * as Haptics from "expo-haptics";

const WINDOW_WIDHT = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;

export default TeamCheckPage = (props) => {
  const navigation = useNavigation();
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
  //console.log(route.params);

  //체크리스트를 전부 가지고 있는 객체 배열. 하나의 객체는 하나의 체크를 뜻한다
  //key값은 writer.
  const [checklists, setChecklists] = useState([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [isWritingNewTask, setIsWritingNewTask] = useState({});
  /*console.log(
    teamCode,
    title,
    fileColor,
    memberInfo,
    memberNames,
    assignmentName,
    assignmentId,
    dueDate
  );*/
  const pressAddBtn = (memberName) => {
    //isWritingNewTask를 순회하면서 현재 선택된 사람이 아니면 textinput을 닫는다.
    Object.keys(isWritingNewTask).forEach((name) => {
      if (name !== memberName && isWritingNewTask[name]) {
        closeTextInput(name);
      }
    });

    // 플러스 버튼을 누를 때 해당 팀 멤버에 대한 입력 창을 열도록 설정
    setIsWritingNewTask((prevIsWritingNewTask) => ({
      ...prevIsWritingNewTask,
      [memberName]: true,
    }));
  };

  const closeTextInput = (memberName) => {
    addNewTask(memberName);
    setIsWritingNewTask((prevIsWritingNewTask) => ({
      ...prevIsWritingNewTask,
      [memberName]: false,
    }));
  };

  const addNewTask = async (memberName, isSubmitedByEnter) => {
    if (newTaskText.trim() !== "") {
      const newChecklist = {
        writer: memberName,
        isChecked: false,
        content: newTaskText,
        regDate: new Date(),
        modDate: new Date(),
      };

      // 새로운 체크리스트를 현재의 체크리스트 목록에 추가
      setChecklists((prevChecklists) => [...prevChecklists, newChecklist]);

      const checkListDoc = addDoc(
        collection(
          db,
          "team",
          teamCode,
          "assignmentList",
          assignmentId,
          "memberName",
          memberName,
          "checkList"
        ),
        newChecklist
      );

      if (!isSubmitedByEnter) {
        const updatedIsWritingNewTask = { ...isWritingNewTask };
        updatedIsWritingNewTask[memberName] = false;
        setIsWritingNewTask(updatedIsWritingNewTask);
      }
      setNewTaskText("");
    } else {
      setIsWritingNewTask((prev) => ({ ...prev, [memberName]: false }));
    }
    await getCheckLists();
  };

  const handleCheckboxChange = async (writer, id, newValue) => {
    // 체크박스 상태 변경
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const updatedChecklists = checklists.map((checklist) =>
      checklist.writer === writer && checklist.id === id
        ? { ...checklist, isChecked: newValue, modDate: new Date() }
        : checklist
    );

    updatedChecklists.sort((a, b) => {
      if (a.isChecked === b.isChecked) {
        // 체크 여부가 동일하다면 타임스탬프로 정렬
        return a.regDate - b.regDate;
      } else if (a.isChecked && !b.isChecked) {
        // 체크된 항목이 뒤로 가도록 설정
        return 1;
      } else {
        // 체크되지 않은 항목이 앞으로 가도록 설정
        return -1;
      }
    });

    setChecklists(updatedChecklists);

    // Firestore에 업데이트 반영
    try {
      // 각 체크리스트에 대해 업데이트 명령 추가
      const docRef = doc(
        db,
        "team",
        teamCode,
        "assignmentList",
        assignmentId,
        "memberName",
        writer,
        "checkList",
        id // 해당 체크리스트의 ID를 사용하여 문서를 참조합니다.
      );
      await updateDoc(docRef, {
        isChecked: newValue,
        modDate: new Date(),
      });
    } catch (error) {
      console.error("Error updating documents: ", error);
    }
  };

  const getCheckLists = async () => {
    const uncheckedChecklists = [];
    const checkedChecklists = [];

    await Promise.all(
      memberNames.map(async (memberName) => {
        const querySnapshot = await getDocs(
          query(
            collection(
              db,
              "team",
              teamCode,
              "assignmentList",
              assignmentId,
              "memberName",
              memberName,
              "checkList"
            ),
            console.log("??:", memberNames, memberName),
            orderBy("regDate", "asc")
          )
        );
        querySnapshot.forEach((doc) => {
          const data = { id: doc.id, ...doc.data(), memberName };
          if (data.isChecked) {
            checkedChecklists.push(data);
          } else {
            uncheckedChecklists.push(data);
          }
        });
      })
    );

    // 체크된 항목과 체크되지 않은 항목을 합쳐서 최종적인 배열을 생성
    const combinedChecklists = [...uncheckedChecklists, ...checkedChecklists];

    setChecklists(combinedChecklists);
    // getCheckLists();
  };

  useEffect(() => {
    getCheckLists();
    console.log("[TeamCheckPage]: ", checklists);
    console.log("[TeamCheckPage]: memberNames", memberNames);
  }, []);

  const [assignmentOptionModalVisible, setAssignmentOptionModalVisible] =
    useState(false);
  {
    /* 과제 옵션 모달창 띄우고/숨기는 함수 */
  }
  const [selectedChecklist, setSelectedChecklist] = useState(null);

  const handleAssignmentOptionPress = (checklist) => {
    setAssignmentOptionModalVisible(!assignmentOptionModalVisible);
    setSelectedChecklist(checklist.content);
  };

  return (
    //헤더 부분
    <KeyboardAvoidingView
      style={s.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={s.headContainer}>
        {/* Header code */}
        <View style={s.headBtn}>
          {/* Back button */}
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <AntDesign name="left" size={20} color="black" />
          </TouchableOpacity>
        </View>
        {/* Title */}
        <Text style={s.title}>{title}</Text>
        <View style={s.titleRightBtn}></View>
      </View>
      {/* 과제 제목 부분 */}
      <ImageBackground
        style={styles.assignmentTitleContainer}
        source={require("../images/AssignmentContainer.png")}
      >
        <TouchableOpacity style={styles.assignmentTitleInfoContainer}>
          <Text style={styles.dueDateText}>{dueDate}</Text>
          <Text style={styles.assignmentTitleText}>{assignmentName}</Text>
        </TouchableOpacity>
      </ImageBackground>
      {/* 팀원 목록 부분 */}

      <View style={styles.teamMembersNamesArrayContainer}>
        {/* Display the 팀메이트 */}
        <TouchableOpacity
          style={{
            ...styles.teamMateContainer,
            backgroundColor: fileColor,
            borderColor: fileColor,
            marginRight: "2%",
          }}
        >
          <Text style={{ ...styles.teamMateText }}>팀 메이트</Text>
        </TouchableOpacity>

        <FlatList
          keyboardShouldPersistTaps="always"
          data={memberNames}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={{
                ...styles.memberNameContainer,
                borderColor: fileColor,
              }}
            >
              <Text style={styles.memberNameText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* 체크리스트 구현 부분 */}
      <View style={styles.checkContainer}>
        <FlatList
          keyboardShouldPersistTaps="handled"
          data={memberInfo}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <View style={styles.contentContainer} key={item.name}>
              <TouchableOpacity
                style={{
                  ...styles.memberNameContainerTwo,
                  borderColor: fileColor,
                }}
                onPress={() => pressAddBtn(item.name)}
              >
                <Text style={styles.memberNameTextTwo}>{item.name}</Text>
                <Image
                  source={require("../images/ListAddBtn.png")}
                  style={styles.taskAddBtn}
                />
              </TouchableOpacity>

              {/* 생성된 체크리스트 렌더링 */}

              {/* 체크리스트 항목 추가 입력 창 */}
              {checklists
                .filter((checklist) => checklist.writer === item.name)
                .map((checklist) => (
                  <View key={checklist.id} style={styles.checkBoxContainer}>
                    <Checkbox
                      value={checklist.isChecked}
                      style={styles.checkbox}
                      color={fileColor}
                      onValueChange={(newValue) =>
                        handleCheckboxChange(
                          checklist.writer,
                          checklist.id,
                          newValue
                        )
                      }
                    />
                    <Text style={styles.checkBoxContent}>
                      {checklist.content}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleAssignmentOptionPress(checklist)}
                    >
                      <Image
                        source={require("../images/icons/three_dots.png")}
                        style={styles.threeDots}
                      />
                    </TouchableOpacity>
                  </View>
                ))}

              {/* 입력창 생성 */}
              {isWritingNewTask[item.name] ? (
                <KeyboardAvoidingView style={styles.checkBoxContainer}>
                  <Checkbox style={styles.checkbox} color={fileColor} />
                  <TextInput
                    placeholder="할 일 추가..."
                    style={styles.checkBoxContent}
                    value={newTaskText}
                    autoFocus={true}
                    returnKeyType="done"
                    onChangeText={(text) => setNewTaskText(text)}
                    onSubmitEditing={() => {
                      addNewTask(item.name, true),
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                    onBlur={() => addNewTask(item.name, false)}
                    blurOnSubmit={false}
                  />
                  <TouchableOpacity>
                    <Image
                      source={require("../images/icons/three_dots.png")}
                      style={styles.threeDots}
                    />
                  </TouchableOpacity>
                </KeyboardAvoidingView>
              ) : null}
            </View>
          )}
        />
      </View>
      <Modal
        onBackButtonPress={handleAssignmentOptionPress}
        onBackdropPress={handleAssignmentOptionPress}
        isVisible={assignmentOptionModalVisible}
        swipeDirection="down"
        onSwipeComplete={handleAssignmentOptionPress}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={200}
        animationOutTiming={200}
        backdropTransitionInTiming={200}
        backdropTransitionOutTiming={0}
        style={{ justifyContent: "flex-end", margin: 0 }}
      >
        {/* 과제 설정 모달창 */}
        <View style={styles.modalView}>
          {/* 모달창 내 아이템 (텍스트, 버튼 등) 컨테이너 */}
          <View style={s.modalItemContainter}>
            {/* 모달창 상단 회색 막대 */}
            <View style={s.modalVector}></View>
            {/* 모달창 상단 과제 이름 표시 */}
            <Text style={s.modalTitle}>{selectedChecklist}</Text>
            <View flex={1}></View>
            {/* 팀 수정, 팀 삭제 버튼 컨테이너 */}
            <View style={s.modalTeamBtnContainer}>
              {/* 수정 버튼 */}
              <TouchableOpacity
                style={s.teamReviseBtn}
                onPress={() => console.log("체크리스트 수정")}
              >
                <Text style={s.teamReviseText}>수정</Text>
              </TouchableOpacity>
              {/* 삭제 버튼 */}
              <TouchableOpacity
                style={s.teamDeleteBtn}
                onPress={() => {
                  console.log("체크리스트 삭제");
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                {/* 터치 시 과제 삭제 */}
                <Text style={s.teamDeleteText}>삭제</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  // --------------과제 타이틀 영역-----------------
  assignmentTitleContainer: {
    height: WINDOW_HEIGHT > 800 ? WINDOW_HEIGHT * 0.096 : WINDOW_HEIGHT * 0.117,
    width: WINDOW_WIDHT * 0.9,
    //backgroundColor: "red",
    marginTop: "5%",
    marginBottom: "5%",
    flexDirection: "row",
    // backgroundColor: "yellow",
  },
  assignmentTitleInfoContainer: {
    flex: 1,
    marginLeft: "7%",
    justifyContent: "space-evenly",
    paddingVertical: "5%",
    // backgroundColor: "grey",
  },
  dueDateText: {
    color: color.redpink,
    fontSize: 12,
    fontFamily: "SUIT-Regular",
  },
  assignmentTitleText: {
    color: color.activated,
    fontSize: 20,
    fontFamily: "SUIT-Regular",
  },
  // --------------------중간 팀 멤버 이름 영역----------------
  teamMembersNamesArrayContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    //backgroundColor: "green",
    width: WINDOW_WIDHT,
    paddingRight: "5%",
  },
  teamMateContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 35,
    borderWidth: 1,
    borderRadius: 23,
    paddingHorizontal: 13,
  },
  teamMateText: {
    fontFamily: "SUIT-Regular",
    fontSize: 12,
  },
  memberNameContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 35,
    borderWidth: 1,
    borderRadius: 23,
    marginHorizontal: 4,
    paddingHorizontal: 13,
  },
  memberNameText: {
    fontFamily: "SUIT-Regular",
    fontSize: 12,
  },
  // ---------------------FlatList2--------------------
  //Conainer 부분
  checkContainer: {
    flex: 1,
    // backgroundColor: "grey",
    marginTop: "8%",
  },
  contentContainer: {
    flex: 1,
    // backgroundColor: "orange",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  memberNameContainerTwo: {
    flex: 1,
    // backgroundColor: "green",
    flexDirection: "row",
    borderRadius: 200,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  memberNameTextTwo: {
    fontFamily: "SUIT-Medium",
    fontSize: 12,
    // backgroundColor: "yellow",
    padding: 10,
    paddingLeft: 7,
    paddingRight: 6,
  },
  taskAddBtn: {
    width: 18,
    height: 18,
    // backgroundColor: "blue",
    marginRight: 8,
  },
  // ----------------------------체크 하나-----------------------
  checkBoxContainer: {
    flex: 0.9,
    width: "90%",
    display: "flex",
    flexDirection: "row",
    // backgroundColor: "violet",
    marginBottom: "7%",
    alignSelf: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
  },
  checkBoxContent: {
    flex: 1,
    fontFamily: "SUIT-Regular",
    fontSize: 14,
    marginLeft: 14,
    // backgroundColor: "green",
  },
  checklistTextInput: {
    fontFamily: "SUIT-Regular",
    fontSize: 14,
    marginLeft: 14,
  },
  threeDots: {
    width: 17.5,
    height: 4,
  },
  modalView: {
    backgroundColor: "white",
    paddingTop: 12,
    paddingHorizontal: 12,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    minHeight: 200, // This property determines the minimum height of the modal
  },
});
