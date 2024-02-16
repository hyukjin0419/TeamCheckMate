//수업 등록 화면
import React, { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
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
  FlatList,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { color } from "../../styles/colors";
import {
  db,
  collection,
  addDoc,
  auth,
  doc,
  setDoc,
  getDocs,
} from "../../../firebase";
import Modal from "react-native-modal";
import s from "../../styles/css";
import { useNavigation } from "@react-navigation/core";
import CategoryItem from "../CategoryItem";
import { orderBy, query } from "firebase/firestore";

const WINDOW_WIDHT = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;

export default CategoryAdd = () => {
  const navigation = useNavigation();
  //회원정보 가져오기
  const user = auth.currentUser;
  //가져온 정보에서 이메일 빼서 저장하기
  const email = user.email;

  //카테고리 등록 입력란에 문자 입력시 확인버튼 활성화, 확인버튼 터치 시 파일 아이콘 색상 확정
  const [categoryList, setCategoryList] = useState([]);

  const getCategoryList = async() => {
    try {
      const userDocRef = doc(db, "user", email);
      const userCategoryRef = collection(userDocRef, "personalCheckList");
      const querySnapshot1 = await getDocs(query(userCategoryRef, orderBy("regDate", "asc")));
      if(!querySnapshot1.empty) {
        const list = [];
        querySnapshot1.forEach((doc) => {
          list.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setCategoryList(list);
        console.log(categoryList);
      } else {
        return;
      }
    } catch (error) {
      console.error("Error getting category: ", error);
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      getCategoryList();
    }, [])
  );

  useEffect(() => {
    getCategoryList();
  }, [])

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={s.container}>
        <StatusBar style={"dark"}></StatusBar>
        {/* 뒤로가기 버튼, 카테고리 등록 헤더와 확인버튼 컨테이너 */}
        <View style={s.headContainer}>
          <View style={s.headBtn}>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
            >
              <AntDesign name="left" size={20} color="black" />
            </TouchableOpacity>
          </View>

          <Text style={{...s.title, marginRight: "10%"}}>카테고리 관리</Text>
        </View>
        <FlatList
            style={{ flexGrow: 0, marginTop: "10%" }}
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
                    onPress={() => {navigation.navigate("CategoryChange", {
                        category: item.category,
                        color: item.color,
                    })}}
                >
                    <Text style={styles.categoryText}>{item.category}</Text>
                    <Image
                    source={require("../../images/categoryAddBtn.png")}
                    style={styles.taskAddBtn}
                    />
                </TouchableOpacity>
                </View>
            )}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
    container: {
      height: "60%",
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
