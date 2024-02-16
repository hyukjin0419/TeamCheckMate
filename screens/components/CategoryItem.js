import { View, Text , StyleSheet, TouchableOpacity, Image, TextInput, FlatList, KeyboardAvoidingView } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { auth, collection, db, doc, setDoc, updateDoc, listCollections } from '../../firebase';
import Checkbox from 'expo-checkbox';
import * as Haptics from "expo-haptics";
import s from "../styles/css.js"
import moment from 'moment';
import { addDoc, getDoc, getDocs, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';

export default CategoryItem = (props) => {
    const [categoryList, setCategoryList] = useState(props.categoryCode);
    const [checklists, setChecklists] = useState([]);
    const [newTaskText, setNewTaskText] = useState("");
    const [isWritingNewTask, setIsWritingNewTask] = useState({});
    const [checkColor, setCheckColor] = useState([]);
    const [checkMap, setCheckMap] = useState(undefined)
    const TextInputRef = useRef(null);
    const [categoryCode, setCategoryCode] = useState([]);
    const user = auth.currentUser;

    const pressAddBtn = (category) => {
      console.log("[TeamcheckPage]: pressAddBtn 함수 실행");
      //1. 멤버 이름을 parameter로 받는다.
      //2. 이전 상태(prevIsWritingNewTask)를 받아 해당 상태를 변경한 새로운 객체를 반환한다. 이 과정에서 memberName이라는 키를 사용하여 해당 키의 값을 true로 설정하여 상태를 업데이트한다.
      setIsWritingNewTask((prevIsWritingNewTask) => ({
        ...prevIsWritingNewTask,
        [category]: true,
      }));
    };
  
    const addNewTask = async(code, isSubmitedByEnter) => {
      if (newTaskText.trim() !== "") {
        const newChecklist = {
          category: code,
          isChecked: false,
          task: newTaskText,
          regDate: new Date(),
          modDate: new Date(),
        };
        
        setChecklists((prevChecklists) => [...prevChecklists, newChecklist]);

        const checkListDoc = addDoc(
          collection(
            db,
            "user",
            user.email,
            "personalCheckList",
            code,
            "tasks",
          ),
          newChecklist
        );
  
        //만약 사용자가 엔터로 입력했을 시, 다음 항목을 계속 작성할 수 있게 설정하는 조건문
        if (!isSubmitedByEnter) {
          setIsWritingNewTask((prev) => ({ ...prev, [code]: false }));
          // console.log(updatedIsWritingNewTask);
        }
        //textinput을 비운다.
        setNewTaskText("");
      } else {
        setIsWritingNewTask((prev) => ({ ...prev, [code]: false }));
      }
      await fetchTaskData();
    };
  
    const handleCheckboxChange = async (category, id, newValue) => {
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
        const docRef = doc(
          db,
          "user",
          user.email,
          "personalCheckList",
          category,
          "tasks",
          id
        );
        await updateDoc(docRef, {
          isChecked: newValue,
          modDate: new Date(),
        });
      } catch (error) {
        console.error("Error updating documents: ", error);
      }
    };

    // //Show the check mark if all category is checked
    // const showCheck = async(list, category, index) => {
    //   const updateList = [...list];
    //   // Get the specific category
    //   const checklistToUpdate = updateList.find(
    //     (checklist) => checklist.category === category && checklist.index === index
    //   );
    //   try {
    //     const userRef = doc(db, "user", user.email);
    //     const userCheckListRef = collection(userRef, "personalCheckList");
    //     const userCategoryRef = doc(userCheckListRef, checklistToUpdate.category);
    //     const userTaskRef = collection(userCategoryRef, "tasks");

    //     const checkColorList = [...checkColor];
    //     const querySnapshot = await getDocs(userTaskRef);
    //       if(!querySnapshot.empty) {
    //         for (const child of querySnapshot.docs) {
    //           const childModDate = child.data().modDate.toDate();

    //           if(child.data().isChecked) {
    //             // get the color of the category
    //             const colorData = await getDoc(userCategoryRef);
    //             if (colorData.exists()) {
    //               // add the color and set id to id of category
    //               const colorAdd = {
    //                 id: child.id,
    //                 checkColor: colorData.data().color,
    //                 regDate: childModDate,
    //               };
              
    //               // Check if id is already in the array
    //               const index = checkColorList.findIndex(item => item.id === colorAdd.id);

    //               if (index !== -1) {
    //                 // Update existing entry
    //                 if (checkColorList[index].checkColor !== colorAdd.checkColor) {
    //                   // Update existing entry with the new color
    //                   const updatedCheckColorList = [...checkColorList];
    //                   updatedCheckColorList[index] = colorAdd;
    //                   setCheckColor(updatedCheckColorList);
    //                 }
    //               } else {
    //                 // Add a new entry
    //                 const updatedCheckColorList = [...checkColorList, colorAdd];
    //                 setCheckColor(updatedCheckColorList);
    //               }
    //             }
    //           } 
    //           // if not all checkboxes are checked, remove the category info from array
    //           else {
    //             if (checkColorList.some(item => item.id === child.id)) {
    //               const updatedCheckColorList = checkColorList.filter(item => item.id !== child.id);
    //               setCheckColor(updatedCheckColorList);
    //             }
    //           } 
    //         }
    //       }
    //       let dateMap = new Map()
    //       // add all the dates of tasks being checked into new map
    //       for (let i = 0; i < checkColor.length; i++) {
    //           let checkedDate = moment(checkColor[i].regDate).format('YYYY-MM-DD').toString()
    //           if (dateMap.has(checkedDate)) {
    //               let checkArr = dateMap.get(checkedDate)
    //               checkArr.push(checkColor[i])
    //               dateMap.set(checkedDate, checkArr) 
    //           } else {
    //               dateMap.set(checkedDate, [checkColor[i]])
    //           }
    //       } 
    //       setCheckMap(dateMap);  
    //   } catch (e) {
    //     console.log(e.message);
    //   }
    // };
    
    const fetchTaskData = async () => {
      const list = []

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
          querySnapshot.forEach((doc) => {
            const data = { id: doc.id, ...doc.data() };
            list.push(data);
          })
        })
      )
      console.log("test", list);
      setChecklists(list);
      console.log(checklists);
      // showCheck(categoryList, )
    }

    useEffect(() => {
      // setCategoryList(props.categoryCode);
      // Load all tasks inside categories that are saved in firebase
      fetchTaskData();
      props.getCategoryList(categoryList)
    }, [props.categoryList]);

    // useEffect(() => {
    //   props.checkEvent(checkMap);
    // }, [checkMap]);

  return (
    <KeyboardAvoidingView 
      style={{...styles.container}}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* 체크리스트 구현 부분 */}
      <View style={styles.checkContainer}>
        <FlatList
          data={categoryList}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.contentContainer}>
              <TouchableOpacity
                style={{
                  ...styles.categoryContainer,
                  backgroundColor: item.color,
                }}
                onPress={() => pressAddBtn(item.id)}
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
                .filter((checklist) => checklist.category === item.id)
                .map((checklist, index) => (
                  <View key={index} style={styles.checkBoxContainer}>
                    <Checkbox
                      value={checklist.isChecked}
                      style={styles.checkbox}
                      color={item.color}
                      onValueChange={(newValue) =>
                        handleCheckboxChange(checklist.category, checklist.id, newValue)
                      }
                    />
                    <Text style={styles.checkBoxContent}>
                      {checklist.task}
                    </Text>
                    <TouchableOpacity>
                      <Image
                          source={require("../images/icons/three_dots.png")}
                          style={styles.threeDots}
                      />
                    </TouchableOpacity>
                  </View>
                ))}

              {/* 입력창 생성 */}
              {isWritingNewTask[item.category] ? (
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
                    onSubmitEditing={() => addNewTask(item.category, true)}
                    onBlur={() => addNewTask(item.category, false)}
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
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    height: "70%",
    backgroundColor: "white",
    marginLeft: "4%",
  },
  addClassBtnText: {
    fontFamily: "SUIT-Regular",
    fontSize: 14,
    paddingHorizontal: 1,
    marginRight: 3,
  },
  checkText: {
    marginLeft: "3%",
    fontFamily: "SUIT-Regular",
    borderBottomWidth: 1,
    width: "60%"
  },
  optionSelect: {
    marginRight: "6%",
    fontSize: 18,
    position: "absolute",
    right: 0,
    top: -7
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
});
