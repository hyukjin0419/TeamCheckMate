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

export default PersonalPage = () => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [checkMap, setCheckMap] = useState(new Map());
  const [teamCode, setTeamCode] = useState([]);
  const [categoryCode, setCategoryCode] = useState([]);
  const [load, setLoad] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [sendData, setSendData] = useState(false);
  const email = auth.currentUser.email;

  const getCategoryCode = async() => {
    const userDocRef = doc(db, "user", email);
    const userDoc = await getDoc(userDocRef)
    if(userDoc.exists()){
      // first get information for teamCheckList
      const teamCheckListRef = collection(userDocRef, "teamCheckList");
      // order the tasks in date order
      const categorySnapshot1 = await getDocs(query(teamCheckListRef, orderBy("regDate", "asc")));
      const teamCodeList = [];
      // iterate through each element in categorySnapshot1 map
      const teamCodeMap = categorySnapshot1.docs.map((doc) => {
        // set variables to save our data
        const data = doc.data();
        const category = data.category;
        const color = data.color;
        const regDate = data.regDate;
        const assignmentId = data.assignmentId;
        const teamCode = data.teamCode
        

        return {
          id: doc.data().category,
          category,
          color,
          regDate,
          assignmentId,
          teamCode,
        }; 
      });

      // Check to see if team name already exists
      // We only need to have one team name saved as a category
      teamCodeMap.forEach((item) => {
        const existingItem = teamCodeList.find((i) => i.id === item.id);
        // if the team name dos not exist in list, then push it to teamCodeList
        if (!existingItem) {
          teamCodeList.push(item);
        }
      });

      // then get information for personal categories
      const userCheckListRef = collection(userDocRef, "personalCheckList");
      const categorySnapshot2 = await getDocs(query(userCheckListRef, orderBy("regDate", "asc")));

      // iterate through categorySnapshot2 and save the value into categoryCode
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

  const showList = (map) => {
    setCheckMap(map);
    setSendData(true);
  };
  

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
    setSendData(false);
    getCategoryCode();
  }, [userEmail]);


  return (
    <View style={styles.container}>
      <Text style={styles.titleHeader}>{userName} 님,{"\n"}오늘도 파이팅!</Text>
      <WeeklyCalendar 
        getSelectedDate={(date) => setSelectedDate(date)}
        checkMap={sendData ? checkMap : new Map()} 
        style={{marginBottom: "5%"}}
      />
      {load && 
             <CategoryItem
             getCheckMap={showList}
             categoryCode={categoryCode}
             teamCode={teamCode}
             sendDate={selectedDate}
         />
           } 
      <PersonalPageBtn />
    </View>
  );
};

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
