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
import Checkbox from "expo-checkbox";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { EvilIcons } from "@expo/vector-icons";
import { showToast, toastConfig } from "../components/Toast";
import Modal from "react-native-modal";
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import s from "../styles/css.js";
import PersonalPageBtn from "./PersonalPageFolder/PersonalPageBtn";
import WeeklyCalendar from "./PersonalPageFolder/WeeklyCalendar";
import CategoryItem from "./CategoryItem";

const PersonalPage = () => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [teamCode, setTeamCode] = useState([]);
  const [categoryCode, setCategoryCode] = useState([]);
  const [load, setLoad] = useState(false);
  const email = auth.currentUser.email;

  const getCategoryCode = async() => {
    const userDocRef = doc(db, "user", email);
    const userDoc = await getDoc(userDocRef)
    if(userDoc.exists()){
      const teamCheckListRef = collection(userDocRef, "teamCheckList");
      const categorySnapshot1 = await getDocs(query(teamCheckListRef, orderBy("regDate", "asc")));
      const teamCodeList = [];
      const teamCodeMap = categorySnapshot1.docs.map((doc) => {
        const data = doc.data();
        const category = data.category;
        const color = data.color;
        const regDate = data.regDate;
        

        return {
          id: doc.data().category,
          category,
          color,
          regDate,
        }; 
      });

      teamCodeMap.forEach((item) => {
        const existingItem = teamCodeList.find((i) => i.id === item.id);
        if (!existingItem) {
          teamCodeList.push(item);
        }
      });

      const userCheckListRef = collection(userDocRef, "personalCheckList");
      const categorySnapshot2 = await getDocs(query(userCheckListRef, orderBy("regDate", "asc")));

      const categoryCode = categorySnapshot2.docs.map((doc) => {
        const data = doc.data();
        const allCheckedConfirm = data.allCheckedConfirm;
        const category = data.category;
        const color = data.color;
        const regDate = data.regDate;

        return {
          id: doc.id,
          allCheckedConfirm,
          category,
          color,
          regDate,
        }; 
      });
      
      setTeamCode(teamCodeList);
      setCategoryCode(categoryCode);
      setLoad(true);
    }
  };

  const showList = (list) => {
    setCategoryList(list);
  }

  useFocusEffect( 
    React.useCallback(() => {
    //   getCategoryList(selectedDate);
        setLoad(false);
        getCategoryCode();
    }, [])
  ); 

  useEffect(() => {
    const user = auth.currentUser;
    setUserEmail(user.email);
    const fetchUserData = async () => {
      try {
        // Reference users collection and userEmail document
        const userDocRef = doc(db, "user", userEmail);

        // Fetch document snapshot
        const docSnap = await getDoc(userDocRef);

        // If data exists
        if (docSnap.exists()) {
          //setUserName to name user chose
          setUserName(docSnap.data().name);
        } else {
          console.log("Document does not exist");
        }
      } catch (error) {
        console.log("Error retrieving document");
      }
    };
    fetchUserData();
    setLoad(false);
    getCategoryCode();
  }, [userEmail]);

  return (
    <View style={styles.container}>
      {/* <View style={{marginTop: 18, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
        <Text style={{marginTop: 100, marginLeft: 20, fontSize: 20}}>{userName} 님 환영합니다</Text>
        <PersonalPageBtn />
      </View> */}
      <Text style={styles.titleHeader}>{userName} 님 오늘도 파이팅!</Text>
      <WeeklyCalendar style={{marginBottom: "5%"}}/>
      {load && 
             <CategoryItem
             // categoryList={categoryList}
             // checkEvent={handleCheckEvent}
             getCategoryList={showList}
             categoryCode={categoryCode}
             teamCode={teamCode}
         />
           } 
      <PersonalPageBtn />
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
    fontSize: 20,
  },
});
