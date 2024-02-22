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
  ImageBackground,
} from "react-native";
import {
  db,
  collection,
  addDoc,
  doc,
  getDocs,
  updateDoc,
  setDoc,
} from "../../firebase.js";
import Modal from "react-native-modal";
import { query, orderBy, deleteDoc, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
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
  //AssignmentItem에서 가져온 정보
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

  //firebase에서 가져온 체크리스트를 저장할 객체배열
  const [checklists, setChecklists] = useState([]);
  //체크리스트 add시 input을 받을 textinput에 사용될 text
  const [newTaskText, setNewTaskText] = useState("");
  //체크리스트 edit시 input을 받을 textinput에 사용될 text
  const [editTaskText, setEditTaskText] = useState("");
  //체크리스트 add시 textinput을 렌더링 하기 위해 boolean값을 담는 객체
  const [isWritingNewTask, setIsWritingNewTask] = useState({});

  //Read from Firebase and store in an object array
  const getCheckLists = async () => {
    console.log("[TeamcheckPage]: getCheckLists 함수 실행");
    //체크가 안된 체크리스트가 배열 앞부분에 존재하도록 함수가 작동함.
    //체크 안된 체크리스트를 담을 배열
    const uncheckedChecklists = [];
    //체크 된 체크리스트를 담을 배열
    const checkedChecklists = [];

    //firebase에서 체크리스트 정보를 가져옴
    await Promise.all(
      memberInfo.map(async (memberInfo) => {
        const querySnapshot = await getDocs(
          query(
            collection(
              db,
              "team",
              teamCode,
              "assignmentList",
              assignmentId,
              "memberEmail",
              memberInfo.email,
              "checkList"
            ),
            //시간별로
            orderBy("regDate", "asc")
          )
        );
        querySnapshot.forEach((doc) => {
          const data = { id: doc.id, ...doc.data() };
          //체크 여부에 따라 다른 배열에 넣고...
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

    //프론트에 반영하기 위해 상태 업데이트 함수 사용
    setChecklists(combinedChecklists);
  };

  //앱이 처음 렌더링 될때 getCheckList() 실행
  useEffect(() => {
    getCheckLists();
    console.log("[TeamcheckPage]: useEffect[] 실행");
  }, []);

  //add시 체크리스트 생성을 위한 입력창을 열어주는 함수
  const pressAddBtn = (email) => {
    console.log("[TeamcheckPage]: pressAddBtn 함수 실행");
    //1. 멤버 이름을 parameter로 받는다.
    //2. 이전 상태(prevIsWritingNewTask)를 받아 해당 상태를 변경한 새로운 객체를 반환한다. 이 과정에서 memberName이라는 키를 사용하여 해당 키의 값을 true로 설정하여 상태를 업데이트한다.
    setIsWritingNewTask((prevIsWritingNewTask) => ({
      ...prevIsWritingNewTask,
      [email]: true,
    }));
  };

  //Create a new checklist
  const addNewTask = async (email, isSubmitedByEnter) => {
    console.log("[TeamcheckPage]: addNewTask 함수 실행");
    //프론트 먼저 반영 후 firebase 실행 -> 어플의 속도를 높이기 위해
    //너무 빠른 연속 터치시 문제가 발생할 수 있으나, 사용자가 그런 빠른 터치를 할 상황이 거의 없다고 판단되어 일단 진행.

    //textinput창에 아무것도 입력되지 않았는데 함수가 실행되었다면, 아무것도 추가하지 않고 textinput창을 닫아버리는 (렌더링을 멈춘다) 조건문
    if (newTaskText.trim() !== "") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      //새로운 객체를 생성한다.
      //이때 이름은 파라미터로, content는 useState를 사용한다
      const newChecklist = {
        email: email,
        isChecked: false,
        content: newTaskText,
        regDate: new Date(),
        modDate: new Date(),
      };

      //만약 사용자가 엔터로 입력했을 시, 다음 항목을 계속 작성할 수 있게 설정하는 조건문
      if (!isSubmitedByEnter) {
        setIsWritingNewTask((prev) => ({ ...prev, [email]: false }));
        // console.log(updatedIsWritingNewTask);
      }
      //textinput을 비운다.
      setNewTaskText("");

      //프론트에 반영
      //새로 생성된 체크리스트를 기존에 체크리스트에 이어 붙힌다
      setChecklists((prevChecklists) => [...prevChecklists, newChecklist]);

      //team firestorage 참조
      const teamChecklistRef = collection(
        db,
        "team",
        teamCode,
        "assignmentList",
        assignmentId,
        "memberEmail",
        email,
        "checkList"
      );
      const teamChecklist = await addDoc(teamChecklistRef, newChecklist);

      //user firestorage 참조
      const userChecklistRef = doc(
        db,
        "user",
        email,
        "teamCheckList",
        teamChecklist.id
      );

      const userCheckList = await setDoc(userChecklistRef, newChecklist);
    } else {
      setIsWritingNewTask((prev) => ({ ...prev, [email]: false }));
    }
    await getCheckLists();
  };

  //Check 누를 때 상태 업데이트 하는 함수
  const handleCheckboxChange = async (email, id, newValue) => {
    console.log("[TeamcheckPage]: handleCheckBoxChange함수 실행");
    // 마찬가지로 프론트 먼저 상태 업데이트 후 백엔드 반영
    //햅틱 추가
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    //파라미터로 작성자와, 체크리스트 id(from firebase), 그리고 newValue (checkbox에서 제공)을 받는다
    //전체 객체 배열인 checklists를 순회하며 작성자와 id가 같으면
    //찾아낸 객체의 value를 바꾸고 modDate를 업데이트 한 후 updateChecklists에 넣는다
    //아니면 기존 객체를 updateChecklist에 넣는다
    const updatedChecklists = checklists.map((checklist) =>
      checklist.email === email && checklist.id === id
        ? { ...checklist, isChecked: newValue, modDate: new Date() }
        : checklist
    );

    //체크여부에 따라 정렬은 바꾼다.
    //반환 값이 음수일 경우 a가 앞에 위치
    //반환 값이 양수일 경우 b가 a보다 앞에 위치
    //0일경우 변경되지 않음
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

    //업데이트 된 체크리스트를 프론트에 반영
    setChecklists(updatedChecklists);

    //업데이트 된 체크리스트를 firestorage에 반영 -> 백엔드에서는 체크리스트가 객체배열로 되어있지 않기 때문에, 그냥 해당 문서를 참조해서 값을 바꾼다
    try {
      const teamDocRef = doc(
        db,
        "team",
        teamCode,
        "assignmentList",
        assignmentId,
        "memberEmail",
        email,
        "checkList",
        id
      );
      const userDocRef = doc(db, "user", email, "teamCheckList", id);
      await updateDoc(teamDocRef, {
        isChecked: newValue,
        modDate: new Date(),
      });
      await updateDoc(userDocRef, {
        isChecked: newValue,
        modDate: new Date(),
      });
    } catch (error) {
      console.error("Error updating documents: ", error);
    }
  };

  //체크리스트 content 업데이트 버튼을 모달에서 눌렀을따
  const pressEditBtn = () => {
    console.log("[TeamcheckPage]: pressEditBtn 함수 실행");
    //우선 모달을 닫은 후
    setAssignmentOptionModalVisible(false);
    //Textinput을 띄워주는 함수를 실행
    //이때 setTimeout은 모달이 닫는 렌더링과 textinput을 focusing하는 렌더링이 겹치지 않게 분리해주는 역할을 함
    setTimeout(() => {
      readyToUpdateTask(); // 두 번째 함수를 500ms(0.5초) 후에 실행
    }, 400);
  };

  //content를 edit하기 위한 textinput을 열어주는 함수
  const readyToUpdateTask = () => {
    console.log("[TeamcheckPage]: readyToUpdateTask 함수 실행");

    //flatlist안에 checklists배열을 filter과 map을 통해서 렌더링한다.
    //이때 flatlist는 memberInfo객체 배열 (AssignmentItem에서 route) 가져옴.
    //checklists는 firebase에서 (getCheckList를 통해) 가져옴.
    //checklists의 email과 flatlist item의 email이 같으면 map을 통해 렌더링
    //isadditing이 참일때에는 edit을 위한 textinput을 렌더링 하고
    //그렇지 않다면 해당하는 checklist를 렌더링 해준다
    const foundChecklist = checklists.find(
      //이때 seletedChecklist는 모달창을 띄울때 설정된다
      (checklist) => checklist.id === selectedChecklist.id
    );

    if (foundChecklist) {
      //isadditing을 참으로 설정하며, textinput을 열어준다.
      foundChecklist.isadditing = true;
      //원래 입력되었던 내용을 textinput에 렌더링하기 위한 작업
      setEditTaskText(foundChecklist.content);
      //checklists객체배열을 새로 만들어 업데이트 해주는 작업
      const updatedChecklists = checklists.map((checklist) =>
        checklist.id === foundChecklist.id ? foundChecklist : checklist
      );
      //프론트에 반영
      setChecklists(updatedChecklists);
    }
  };

  //사용자가 edit을 맞추었을때 실행되는 함수
  const editTask = async () => {
    console.log("[TeamcheckPage]: editTask 함수 실행");
    //프론트 먼저 반영 후 백엔드 작업
    const foundChecklist = checklists.find(
      (checklist) => checklist.id === selectedChecklist.id
    );
    if (foundChecklist) {
      if (editTaskText.trim() !== "") {
        foundChecklist.content = editTaskText;
      }
      foundChecklist.isadditing = false;
      const updatedChecklists = checklists.map((checklist) =>
        checklist.id === foundChecklist.id ? foundChecklist : checklist
      );
      setChecklists(updatedChecklists);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    try {
      const teamDocRef = doc(
        db,
        "team",
        teamCode,
        "assignmentList",
        assignmentId,
        "memberEmail",
        selectedChecklist.email,
        "checkList",
        selectedChecklist.id
      );
      const userDocRef = doc(
        db,
        "user",
        selectedChecklist.email,
        "teamCheckList",
        selectedChecklist.id
      );
      await updateDoc(teamDocRef, {
        content: editTaskText,
        modDate: new Date(),
      });
      await updateDoc(userDocRef, {
        content: editTaskText,
        modDate: new Date(),
      });
    } catch (error) {
      console.error("Error updating documents: ", error);
    }
  };

  //delete함수
  const deleteTask = async () => {
    console.log("[TeamcheckPage]: deleteTask 함수 실행");
    //모달창 닫기
    setAssignmentOptionModalVisible(false);
    //마찬가지로 프론트 반영 후 백엔드 작업
    try {
      const updatedChecklists = checklists.filter(
        (checklist) => checklist.id !== selectedChecklist.id
      );
      setChecklists(updatedChecklists);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      await deleteDoc(
        doc(
          db,
          "team",
          teamCode,
          "assignmentList",
          assignmentId,
          "memberEmail",
          selectedChecklist.email,
          "checkList",
          selectedChecklist.id
        )
      );

      await deleteDoc(
        doc(
          db,
          "user",
          selectedChecklist.email,
          "teamCheckList",
          selectedChecklist.id
        )
      );
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  //모달
  const [assignmentOptionModalVisible, setAssignmentOptionModalVisible] =
    useState(false);
  //모달창 선택시
  const [selectedChecklist, setselectedChecklist] = useState({});
  const handleAssignmentOptionPress = (checklist) => {
    console.log("[TeamcheckPage]: handleAssignmentOptionPress 함수 실행");
    setAssignmentOptionModalVisible(!assignmentOptionModalVisible);
    setselectedChecklist(checklist);
  };

  return (
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
        <View style={styles.assignmentTitleInfoContainer}>
          <Text style={styles.dueDateText}>{dueDate}</Text>
          <Text style={styles.assignmentTitleText}>{assignmentName}</Text>
        </View>
      </ImageBackground>
      {/* 팀원 목록 부분 */}

      <View style={styles.teamMembersNamesArrayContainer}>
        {/* Display the 팀메이트 */}
        <View
          style={{
            ...styles.teamMateContainer,
            backgroundColor: fileColor,
            borderColor: fileColor,
            marginRight: "2%",
          }}
        >
          <Text style={{ ...styles.teamMateText }}>팀 메이트</Text>
        </View>

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
          keyExtractor={(item) => item.email}
          renderItem={({ item }) => (
            <View style={styles.contentContainer} key={item.email}>
              <TouchableOpacity
                style={{
                  ...styles.memberNameContainerTwo,
                  borderColor: fileColor,
                }}
                onPress={() => pressAddBtn(item.email)}
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
                .filter(
                  (checklist) =>
                    checklist.email === item.email &&
                    checklist.isChecked === false
                )
                .map((checklist) =>
                  checklist.isadditing ? (
                    <View style={styles.checkBoxContainer}>
                      <Checkbox
                        value={checklist.isChecked}
                        style={styles.checkbox}
                        color={fileColor}
                      />
                      <TextInput
                        style={{
                          ...styles.checkBoxContentTextInput,
                          borderBottomColor: fileColor,
                        }}
                        value={editTaskText}
                        autoFocus={true}
                        returnKeyType="done"
                        onChangeText={(text) => setEditTaskText(text)}
                        onSubmitEditing={() => editTask()}
                        onBlur={() => editTask()}
                      />
                      <View>
                        <Image
                          source={require("../images/icons/three_dots.png")}
                          style={styles.threeDots}
                        />
                      </View>
                    </View>
                  ) : (
                    <View key={checklist.id} style={styles.checkBoxContainer}>
                      <Checkbox
                        value={checklist.isChecked}
                        style={styles.checkbox}
                        color={fileColor}
                        onValueChange={(newValue) =>
                          handleCheckboxChange(
                            checklist.email,
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
                  )
                )}

              {/* 입력창 생성 */}
              {isWritingNewTask[item.email] ? (
                <KeyboardAvoidingView style={styles.checkBoxContainer}>
                  <Checkbox style={styles.checkbox} color={fileColor} />
                  <View
                    style={{
                      ...styles.colorTextInputContainer,
                      borderColor: fileColor,
                    }}
                  >
                    <TextInput
                      placeholder="할 일 추가..."
                      style={{
                        ...styles.checkBoxContentTextInput,
                        borderBottomColor: fileColor,
                      }}
                      value={newTaskText}
                      autoFocus={true}
                      returnKeyType="done"
                      onChangeText={(text) => setNewTaskText(text)}
                      onSubmitEditing={() => addNewTask(item.email, true)}
                      onBlur={() => addNewTask(item.email, false)}
                      blurOnSubmit={false}
                    />
                  </View>
                  <TouchableOpacity>
                    <Image
                      source={require("../images/icons/three_dots.png")}
                      style={styles.threeDots}
                    />
                  </TouchableOpacity>
                </KeyboardAvoidingView>
              ) : null}

              {checklists
                .filter(
                  (checklist) =>
                    checklist.email === item.email &&
                    checklist.isChecked === true
                )
                .map((checklist) =>
                  checklist.isadditing ? (
                    <View style={styles.checkBoxContainer}>
                      <Checkbox
                        value={checklist.isChecked}
                        style={styles.checkbox}
                        color={fileColor}
                      />
                      <TextInput
                        style={{
                          ...styles.checkBoxContentTextInput,
                          borderBottomColor: fileColor,
                        }}
                        value={editTaskText}
                        autoFocus={true}
                        returnKeyType="done"
                        onChangeText={(text) => setEditTaskText(text)}
                        onSubmitEditing={() => editTask()}
                        onBlur={() => editTask()}
                      />
                      <View>
                        <Image
                          source={require("../images/icons/three_dots.png")}
                          style={styles.threeDots}
                        />
                      </View>
                    </View>
                  ) : (
                    <View key={checklist.id} style={styles.checkBoxContainer}>
                      <Checkbox
                        value={checklist.isChecked}
                        style={styles.checkbox}
                        color={fileColor}
                        onValueChange={(newValue) =>
                          handleCheckboxChange(
                            checklist.email,
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
                  )
                )}
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
            <Text style={s.modalTitle}>{selectedChecklist.content}</Text>
            <View flex={1}></View>
            {/* 팀 수정, 팀 삭제 버튼 컨테이너 */}
            <View style={s.modalTeamBtnContainer}>
              {/* 수정 버튼 */}
              <TouchableOpacity
                style={s.teamReviseBtn}
                onPress={() => pressEditBtn()}
              >
                <Text style={s.teamReviseText}>수정</Text>
              </TouchableOpacity>
              {/* 삭제 버튼 */}
              <TouchableOpacity
                style={s.teamDeleteBtn}
                onPress={() => deleteTask()}
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
    //backgroundColor: "green",
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
    //backgroundColor: "yellow",
    padding: 10,
    paddingLeft: 7,
    paddingRight: 6,
  },
  taskAddBtn: {
    width: 18,
    height: 18,
    //backgroundColor: "blue",
    marginRight: 8,
  },
  // ----------------------------체크 하나-----------------------
  checkBoxContainer: {
    width: "90%",
    display: "flex",
    flexDirection: "row",
    //backgroundColor: "violet",
    marginBottom: "6%",
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
  },
  checkBoxContentTextInput: {
    flex: 1,
    fontFamily: "SUIT-Regular",
    fontSize: 14,
    marginBottom: "2%",
  },
  threeDots: {
    width: 17.5,
    height: 4,
    marginLeft: 5,
    marginTop: 6,
  },
  colorTextInputContainer: {
    flexDirection: "row",
    //backgroundColor: "blue",
    borderBottomWidth: 1.5,
    marginBottom: "2%",
    marginLeft: "4%",
    width: "84%",
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
