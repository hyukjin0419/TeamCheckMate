import { 
  View,
  Button, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  Image,
  TouchableWithoutFeedback,
  TextInput,
  FlatList,
 } from "react-native";
import * as React from "react";
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import Checkbox from "expo-checkbox"
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { EvilIcons } from "@expo/vector-icons";
import { showToast, toastConfig } from "../components/Toast";
import Modal from "react-native-modal";
import { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import { auth, db } from "../../firebase";
import s from "../styles/css.js"
import PersonalPageBtn from "./PersonalPageFolder/PersonalPageBtn";
import WeeklyCalendar from "./PersonalPageFolder/WeeklyCalendar";
import CategoryItem from "./CategoryItem";


const PersonalPage = () => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const email = auth.currentUser.email;

    // Visibility of modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const toggleModal = () => {
    // toggle the visibility of modal
    setIsModalVisible(!isModalVisible);
  };

  const getCategoryList = async() => {
    try {
      const userDocRef = doc(db, "user", email);
      const userCategoryRef = collection(userDocRef, "personalCheckList");
      const querySnapshot1 = await getDocs(query(userCategoryRef));
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
    const user = auth.currentUser;
    setUserEmail(user.email)
    const fetchUserData = async () => {
      try {
        // Reference users collection and userEmail document
        const userDocRef = doc(db, "user", userEmail);
  
        // Fetch document snapshot
        const docSnap = await getDoc(userDocRef);
  
        // If data exists
        if(docSnap.exists()) {
          //setUserName to name user chose
          setUserName(docSnap.data().name)
        }
        else {
          console.log("Document does not exist");
        }
      } catch(error){
        console.log("Error retrieving document");
      }
    }
    fetchUserData();
    getCategoryList();
  }, [userEmail]);

  return(
    <View style={styles.container}>
      {/* <View style={{marginTop: 18, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
        <Text style={{marginTop: 100, marginLeft: 20, fontSize: 20}}>{userName} 님 환영합니다</Text>
        <PersonalPageBtn />
      </View> */}
      <Text style={styles.titleHeader}>{userName} 님 환영합니다</Text>
      <WeeklyCalendar style={{marginBottom: "5%"}}/>

      {/* Go to CategoryItem.js and pass the categoryList value to it */}
      <CategoryItem
        categoryList={categoryList}
      />

      <PersonalPageBtn />

      {/* modal code */}
      <Modal
        onBackdropPress={() => setIsModalVisible(false)}
        isVisible={isModalVisible}
        swipeDirection="down"
        onSwipeComplete={toggleModal}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={200}
        animationOutTiming={200}  
        backdropTransitionInTiming={200} 
        backdropTransitionOutTiming={0}
        style={{justifyContent: "flex-end", margin: 0, flex: 1}}
        > 
          {/* Modal content container */}
          <View style={styles.modalContent}>
            {/* Center Text */}
            <View style={styles.center}>
              {/* Style for the bar on top of modal */}
              <View style={styles.barIcon} />
                <Text style={styles.text}>그래프 1 완성</Text>
            </View>
            {/* Container for 2 buttons */}
            <View style={{flexDirection: "row", justifyContent: "space-between", marginTop: 50, alignItems: "center"}}>
              {/* 수정 button */}
              <TouchableOpacity style={styles.tbutton} >
                <Text style={styles.buttonText}>수정</Text>
              </TouchableOpacity>
              {/* 팀 나가기 button */}
              <TouchableOpacity style={styles.sbutton}>
                <Text style={{...styles.buttonText, color: "red"}}>팀 나가기</Text>
              </TouchableOpacity>
            </View>
          </View>
      </Modal>
    </View>
  );
};

export default PersonalPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  titleHeader: {
    marginTop: 100, 
    marginLeft: 20, 
    fontFamily: "SUIT-Regular",
    fontSize: 20
  },
  AddBtnContainer: {
    alignItems: "flex-end",
    paddingBottom: "2%",
    paddingHorizontal: "5%",
  },
  addOrCloseBtn: {
    width: 40,
    height: 40,
    marginRight: "2%",
  },
  modalView: {
    flex: 1,
    marginLeft: "15%",
  },
  twoBtnContainer: {
    paddingHorizontal: "6%",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  addClassBtn: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 12,
    marginTop: "2%",
  },
  joinClassBtn: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },
    modalContent: {
    backgroundColor: "white",
    paddingTop: 12,
    paddingHorizontal: 12,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    minHeight: "30%", // This property determines the minimum height of the modal
    paddingBottom: 20,
  },
  center: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  // color of bar on top of modal
  barIcon: {
    width: 60,
    height: 5,
    backgroundColor: "#bbb",
    borderRadius: 3,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "black",
    fontSize: 17,
    marginTop: "10%",
  },
  tbutton: {
    borderRadius: 9,
    alignItems: "center",
    paddingVertical: "5%",
    marginBottom: "3%",
    backgroundColor: "#050026",
    width: 170,
    height: "90%",
  },
  sbutton: {
    borderRadius: 9,
    alignItems: "center",
    paddingVertical: "5%",
    marginBottom: "3%",
    backgroundColor: "#EFEFEF",
    width: 170,
    height: "90%",
  },
  buttonText: {
    fontSize: 17,
    fontWeight: 400,
    color: "white",
  },
});