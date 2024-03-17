import { View, Text , StyleSheet, TouchableOpacity, Image, TextInput, FlatList, KeyboardAvoidingView, Alert } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { auth, collection, db, doc, setDoc, updateDoc, listCollections } from '../../firebase';
import Checkbox from 'expo-checkbox';
import * as Haptics from "expo-haptics";
import s from "../styles/css.js"
import moment from 'moment';
import Modal from "react-native-modal";
import { addDoc, deleteDoc, getDoc, getDocs, onSnapshot, orderBy, query } from 'firebase/firestore';

export default CategoryItem = ({getCheckMap, ...props}) => {
    // get categoryCode map and set it to categoryList to render categories
    const [categoryList, setCategoryList] = useState(props.categoryCode);
    const [teamList, setTeamList] = useState(props.teamCode);
    // variable to store tasks and render them
    const [checklists, setChecklists] = useState([]);
    // text input for new tasks
    const [newTaskText, setNewTaskText] = useState("");
    // to check current writing state of current task
    const [isWritingNewTask, setIsWritingNewTask] = useState({});
    // edit task text string
    const [editTaskText, setEditTaskText] = useState("");
    // combined list for both personal and team tasks
    const [combineList, setCombineList] = useState([...teamList, ...categoryList]);
    const [date, setDate] = useState(props.sendDate);
    const [load, setLoad] = useState(true);
    const[allList, setAllList] = useState([]);
    let selectedDateCompare = "";
    // get user information
    const user = auth.currentUser;

    const pressAddBtn = async(id, assignmentId) => {
      console.log("[TeamcheckPage]: pressAddBtn 함수 실행");
      // if teamCode does not exist meaning it is personal task
      //1. 멤버 이름을 parameter로 받는다.
      //2. 이전 상태(prevIsWritingNewTask)를 받아 해당 상태를 변경한 새로운 객체를 반환한다. 이 과정에서 memberName이라는 키를 사용하여 해당 키의 값을 true로 설정하여 상태를 업데이트한다.
      if(!assignmentId) {
        setIsWritingNewTask((prevIsWritingNewTask) => ({
          ...prevIsWritingNewTask,
          [id]: true,
        }));
      }
      else {
        Alert.alert("개인화면에서 팀 타스크 추가 할 수 없습니다")
      }
    };
  
    // when user wants to add new task
    const addNewTask = async(id, color, isSubmitedByEnter) => {
      // if the task is not an empty string
      if (newTaskText.trim() !== "") {
        // create new Checklist to render front end first
        const newChecklist = {
          category: id,
          isChecked: false,
          color: color,
          content: newTaskText,
          regDate: new Date(),
          modDate: new Date(),
        };
        
        // Add the new checklist into checklists array
        setLoad(false);
        setChecklists((prevChecklists) => [...prevChecklists, newChecklist]);

        //만약 사용자가 엔터로 입력했을 시, 다음 항목을 계속 작성할 수 있게 설정하는 조건문
        if (!isSubmitedByEnter) {
          setIsWritingNewTask((prev) => ({ ...prev, [id]: false }));
          // console.log(updatedIsWritingNewTask);
        }
        //textinput을 비운다.
        setNewTaskText("");

        // add the information of new task into firebase
        const checkListDoc = addDoc(
          collection(
            db,
            "user",
            user.email,
            "personalCheckList",
            id,
            "tasks",
          ),
          newChecklist
        );
      } else {
        setIsWritingNewTask((prev) => ({ ...prev, [id]: false }));
      }
      await fetchTaskData();
    };
  
    const handleCheckboxChange = async (checklist, category, id, newValue) => {
      // 마찬가지로 프론트 먼저 상태 업데이트 후 백엔드 반영
      //햅틱 추가
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  
      //파라미터로 작성자와, 체크리스트 id(from firebase), 그리고 newValue (checkbox에서 제공)을 받는다
      //전체 객체 배열인 checklists를 순회하며 작성자와 id가 같으면
      //찾아낸 객체의 value를 바꾸고 modDate를 업데이트 한 후 updateChecklists에 넣는다
      //아니면 기존 객체를 updateChecklist에 넣는다
      const updatedChecklists = checklists.map((checklist) =>
        checklist.category === category && checklist.id === id
          ? { ...checklist, isChecked: newValue, modDate: new Date() }
          : checklist
      );
      // Update the selected task in allList list 
      const updatedCheckLists = allList.map((checklist) =>
        checklist.category === category && checklist.id === id
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
      // update new values into setAllList
      setAllList(updatedCheckLists);
      createCheckMap(updatedCheckLists);
          
  
      //업데이트 된 체크리스트를 firestorage에 반영 -> 백엔드에서는 체크리스트가 객체배열로 되어있지 않기 때문에, 그냥 해당 문서를 참조해서 값을 바꾼다
      try {
        const docRef = doc(
          db,
          "user",
          user.email,
          "personalCheckList",
          category,
          "tasks",
          id
        );
        const checkExistSnapshot = await getDoc(docRef);
        if(checkExistSnapshot.exists()){
          await updateDoc(docRef, {
            isChecked: newValue,
            modDate: new Date(),
          });
        } else {
          const personalTeamDocRef = doc(
            db,
            "user",
            user.email,
            "teamCheckList",
            id,
          );

          const teamDocRef = doc(
            db,
            "team",
            checklist.teamCode,
            "assignmentList",
            checklist.assignmentId,
            "memberEmail",
            user.email,
            "checkList",
            id,
          );

          await updateDoc(personalTeamDocRef, {
            isChecked: newValue,
            modDate: new Date(),
          });

          await updateDoc(teamDocRef, {
            isChecked: newValue,
            modDate: new Date(),
          });
        }
      } catch (error) {
        console.error("Error updating documents: ", error);
      }
    };

    // when user presses 수정 in modal
    const pressEditBtn = () => {
      // set visibility of modal to false
      setTaskOptionModalVisible(false);

      // set timer to update task after 4 milliseconds
      setTimeout(() => {
        readyToUpdateTask();
      }, 400);
    }

    const readyToUpdateTask = () => {
      const findCheckList = checklists.find(
        // check to see if checklists contains information about the task we are about to edit
        (checklist) => checklist.id === selectedChecklist.id
      );

      if (findCheckList) {

        findCheckList.isadditing = true;

        // set the text when user is editing to the current title before update
        setEditTaskText(findCheckList.content);

        const updatedChecklists = checklists.map((checklist) =>
          checklist.id === findCheckList.id ? findCheckList : checklist
        );
        setChecklists(updatedChecklists);
      }
    };

    const editTask = async () => {
      console.log("[TeamcheckPage]: editTask 함수 실행");
      // Update front end before adding to database for proper render
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
        // path for personal task
        const taskDocRef = doc(
          db,
          "user",
          user.email,
          "personalCheckList",
          selectedChecklist.category,
          "tasks",
          selectedChecklist.id
        );
        
        // check to see if selected task is a personal one
        const checkExistSnapshot = await getDoc(taskDocRef);
        // if it is a personal task update it
        if(checkExistSnapshot.exists()) {
          await updateDoc(taskDocRef, {
            content: editTaskText,
            modDate: new Date(),
          });
        }
        else { // if it is a team task, update on team page as well
          const teamTaskDocRef = doc(
            db,
            "user",
            user.email,
            "teamCheckList",
            selectedChecklist.id
          );

          const teamPageTaskDocRef = doc(
            db,
            "team",
            selectedChecklist.teamCode,
            "assignmentList",
            selectedChecklist.assignmentId,
            "memberEmail",
            user.email,
            "checkList",
            selectedChecklist.id,
          );

          await updateDoc(teamTaskDocRef, {
            content: editTaskText,
            modDate: new Date(),
          });

          await updateDoc(teamPageTaskDocRef, {
            content: editTaskText,
            modDate: new Date(),
          });
        }
      } catch (error) {
        console.error("Error updating documents: ", error);
      }
    };

     //delete함수
  const deleteTask = async () => {
    console.log("[TeamcheckPage]: deleteTask 함수 실행");
    //모달창 닫기
    setTaskOptionModalVisible(false);
    //마찬가지로 프론트 반영 후 백엔드 작업
    try {
      const updatedChecklists = checklists.filter(
        (checklist) => checklist.id !== selectedChecklist.id
      );
      setChecklists(updatedChecklists);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const taskDocRef = doc(
        db,
        "user",
        user.email,
        "personalCheckList",
        selectedChecklist.category,
        "tasks",
        selectedChecklist.id
      );

      const checkExistSnapshot = await getDoc(taskDocRef);

      if(checkExistSnapshot.exists()) {
        await deleteDoc(taskDocRef);
      } else {
        const teamtaskRef = doc(
          db,
          "user",
          user.email,
          "teamCheckList",
          selectedChecklist.id,
        );
        await deleteDoc(teamtaskRef);
      }
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };
    
    const fetchTaskData = async (value) => {
      if(value) {
        const list = [];
        const tempList = []

        // First get information on tasks for team
        const querySnapshot1 = await getDocs(
          query(
            collection(
              db,
              "user",
              user.email,
              "teamCheckList"
            ),
            orderBy("regDate", "asc")
          )
        );

        // add the data into list
        if(!querySnapshot1.empty) {
          querySnapshot1.forEach((child) => {
            const data = { id: child.id, ...child.data() };
            data.regDate = child.data().regDate.toDate();
            data.modDate = child.data().modDate.toDate();
            // temporary variable to get modDate
            const getDate = child.data().modDate.toDate();
            // change to yyyy-mm-dd format for modDate for easier comparison
            const compareDate = getDate.toISOString().split('T')[0];
            // if user selected date is less than or equal to data's last modified date
            if(compareDate >= selectedDateCompare) {
              // add to list
              list.push(data);
            }
            // if task is not checked, add to list
            else if(!data.isChecked) {
              list.push(data);
            }
            // temporary list to show dots
            tempList.push(data);
          })
        }
        
        // Get information for personal tasks
        await Promise.all(
          categoryList.map(async(code) => {
            const querySnapshot = await getDocs(
              query(
                collection(
                  db,
                  "user",
                  user.email,
                  "personalCheckList",
                  code.id,
                  "tasks"
                ),
                orderBy("regDate", "asc")
              )
            );
            // add it to list
            if(!querySnapshot.empty){
              querySnapshot.forEach((doc) => {
                const data = { id: doc.id, ...doc.data() };
                data.regDate = doc.data().regDate.toDate();
                data.modDate = doc.data().modDate.toDate();
                // temporary variable to get modDate
                const getDate = doc.data().modDate.toDate();
                // change to yyyy-mm-dd format for modDate for easier comparison
                const compareDate = getDate.toISOString().split('T')[0];
                // if user selected date is less than or equal to data's last modified date
                if(data.isChecked) {
                  if(compareDate >= selectedDateCompare) {
                    // add to list
                    list.push(data);
                  }
                }
                // if task is not checked
                else if(data.isChecked === false) {
                  list.push(data);
                }
                // temporary list to show dots
                tempList.push(data);
              })
            }
          })
        )
        setChecklists(list);
        setAllList(tempList);
        createCheckMap(tempList);
      }
    }

    // Function to pass data to display dots
    const createCheckMap = (checklists) => {
      let dateMap = new Map()
      // add all the dates of tasks being checked into new map
      for (let i = 0; i < checklists.length; i++) {
        if(checklists[i].isChecked) {
          let checkedDate = moment(checklists[i].modDate).format('YYYY-MM-DD').toString();
          if (dateMap.has(checkedDate)) {
              let checkArr = dateMap.get(checkedDate)
              checkArr.push(checklists[i])
              dateMap.set(checkedDate, checkArr) 
          } else {
              dateMap.set(checkedDate, [checklists[i]])
          }
        }
      }
      getCheckMap(dateMap);
    }

    useEffect(() => {
      // setCategoryList(props.categoryCode);
      // Load all tasks inside categories that are saved in firebase
      setDate(props.sendDate);
      selectedDateCompare = date.toISOString().split('T')[0];
      fetchTaskData(load);
    }, [props.sendDate, date]);


    // visual state for modal
    const [taskOptionModalVisible, setTaskOptionModalVisible] = useState(false);
    // after user selects modal
    const [selectedChecklist, setSelectedChecklist] = useState({});

    const handleTaskOptionPress = (checklist) => {
      setTaskOptionModalVisible(!taskOptionModalVisible);
      setSelectedChecklist(checklist);
    };

  return (
    <KeyboardAvoidingView 
      style={{...styles.container}}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* 체크리스트 구현 부분 */}
      <View style={styles.checkContainer}>
        <FlatList
          data={combineList}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.contentContainer}>
              <TouchableOpacity
                style={{
                  ...styles.categoryContainer,
                  backgroundColor: item.color,
                }}
                onPress={() => pressAddBtn(item.id, item.assignmentId)}
              >
                <Text style={styles.categoryText}>{item.category}</Text>
                <Image
                  source={require("../images/categoryAddBtn.png")}
                  style={styles.taskAddBtn}
                />
              </TouchableOpacity>

              {/* 생성된 체크리스트 렌더링 */}

              {/* 체크리스트 항목 추가 입력 창 */}
              {checklists
                .filter((checklist) => checklist.category === item.id 
                && checklist.isChecked === false)
                .map((checklist, index) => checklist.isadditing ? (
                  <View key={index} style={styles.checkBoxContainer}>
                    <Checkbox
                      value={checklist.isChecked}
                      style={styles.checkbox}
                      color={item.color}
                      onValueChange={(newValue) =>
                        handleCheckboxChange(checklist, checklist.category, checklist.id, newValue)
                      }
                    />
                    <TextInput
                        style={{
                          ...styles.checkBoxContentTextInput,
                          borderBottomColor: item.color,
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
                        color={item.color}
                        onValueChange={(newValue) =>
                          handleCheckboxChange(
                            checklist,
                            checklist.category,
                            checklist.id,
                            newValue
                          )
                        }
                      />
                      <Text style={styles.checkBoxContent}>
                        {checklist.content}
                      </Text>
                      <TouchableOpacity
                        onPress={() => handleTaskOptionPress(checklist)}
                      >
                        <Image
                          source={require("../images/icons/three_dots.png")}
                          style={styles.threeDots}
                        />
                      </TouchableOpacity>
                    </View>
                  )
                )
              }

              {/* 입력창 생성 */}
              {isWritingNewTask[item.id] ? (
                <KeyboardAvoidingView style={styles.checkBoxContainer}>
                  <Checkbox style={styles.checkbox} color={item.color} />
                  <TextInput
                    placeholder="할 일 추가..."
                    style={{
                      ...styles.checkBoxContentTextInput,
                      borderBottomColor: item.color,
                    }}
                    value={newTaskText}
                    autoFocus={true}
                    returnKeyType="done"
                    onChangeText={(text) => setNewTaskText(text)}
                    onSubmitEditing={() => addNewTask(item.id, item.color, true)}
                    onBlur={() => addNewTask(item.id, item.color, false)}
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
              {checklists
                .filter((checklist) => checklist.category === item.id
                && checklist.isChecked === true)
                .map((checklist, index) => checklist.isadditing ? (
                  <View key={index} style={styles.checkBoxContainer}>
                    <Checkbox
                      value={checklist.isChecked}
                      style={styles.checkbox}
                      color={item.color}
                      onValueChange={(newValue) =>
                        handleCheckboxChange(checklist, checklist.category, checklist.id, newValue)
                      }
                    />
                     <TextInput
                        style={{
                          ...styles.checkBoxContentTextInput,
                          borderBottomColor: item.color,
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
                      color={item.color}
                      onValueChange={(newValue) =>
                        handleCheckboxChange(
                          checklist,
                          checklist.category,
                          checklist.id,
                          newValue
                        )
                      }
                    />
                    <Text style={styles.checkBoxContent}>
                      {checklist.content}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleTaskOptionPress(checklist)}
                    >
                      <Image
                        source={require("../images/icons/three_dots.png")}
                        style={styles.threeDots}
                      />
                    </TouchableOpacity>
                  </View>
                )
                )
              }
            </View>
          )}
        />
      </View>

      <Modal
        onBackButtonPress={handleTaskOptionPress}
        onBackdropPress={handleTaskOptionPress}
        isVisible={taskOptionModalVisible}
        swipeDirection="down"
        onSwipeComplete={handleTaskOptionPress}
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
  )
}

const styles = StyleSheet.create({
  container: {
    height: "55%",
    backgroundColor: "white",
    paddingHorizontal: "5%",
  },
  checkText: {
    marginLeft: "3%",
    fontFamily: "SUIT-Regular",
    borderBottomWidth: 1,
    width: "60%"
  },
  checkContainer: {
    flex: 1,
    marginTop: "3%",
  },
  contentContainer: {
    flex: 1,
    // backgroundColor: "orange",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  categoryContainer: {
    flex: 1,
    // backgroundColor: "green",
    flexDirection: "row",
    borderRadius: 200,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  categoryText: {
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
  checkBoxContentTextInput: {
    flex: 1,
    fontFamily: "SUIT-Regular",
    fontSize: 14,
    marginLeft: 14,
    marginRight: 14,
    borderBottomWidth: 1, // 테두리 두께
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
