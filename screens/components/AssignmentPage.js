import { StatusBar } from "expo-status-bar";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  FlatList,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/core";
import React, { useState, useEffect } from "react";
import { color } from "../styles/colors";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import {
  db,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  collection,
  addDoc,
  auth,
} from "../../firebase";
import AssignmentItem from "./AssignmentItem";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

//반응형 디자인을 위한 스크린의 높이, 넓이 구하는 코드
const WINDOW_WIDHT = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;

const AssignmentPage = () => {
  const navigation = useNavigation();
  //회원정보 가져오기
  const user = auth.currentUser;

  //TeamItem에서 정보 가져오기
  const route = useRoute();
  const { title, fileColor, teamid } = route.params;

  const [openedFileImage, setOpenedFileImage] = useState(
    require("../images/OpenedFileColor/9CB1BB.png")
  ); // Set default image source
  useEffect(() => {
    console.log("Title:", title);
    if (fileColor === "#9CB1BB") {
      setOpenedFileImage(require("../images/OpenedFileColor/9CB1BB.png"));
    } else if (fileColor === "#AFA7FF") {
      setOpenedFileImage(require("../images/OpenedFileColor/AFA7FF.png"));
    } else if (fileColor === "#C0D4DF") {
      setOpenedFileImage(require("../images/OpenedFileColor/C0D4DF.png"));
    } else if (fileColor === "#D7D2FF") {
      setOpenedFileImage(require("../images/OpenedFileColor/D7D2FF.png"));
    } else if (fileColor === "#CCEEFF") {
      setOpenedFileImage(require("../images/OpenedFileColor/CCEEFF.png"));
    } else if (fileColor === "#9AE1FF") {
      setOpenedFileImage(require("../images/OpenedFileColor/9AE1FF.png"));
    } else if (fileColor === "#FF8C39") {
      setOpenedFileImage(require("../images/OpenedFileColor/FF8C39.png"));
    } else if (fileColor === "#F7D5FC") {
      setOpenedFileImage(require("../images/OpenedFileColor/F7D5FC.png"));
    } else if (fileColor === "#5BEC61") {
      setOpenedFileImage(require("../images/OpenedFileColor/5BEC61.png"));
    } else if (fileColor === "#3FBFFF") {
      setOpenedFileImage(require("../images/OpenedFileColor/3FBFFF.png"));
    } else if (fileColor === "#FFE600") {
      setOpenedFileImage(require("../images/OpenedFileColor/FFE600.png"));
    } else if (fileColor === "#FF6262") {
      setOpenedFileImage(require("../images/OpenedFileColor/FF6262.png"));
    } else if (fileColor === "#6B8BD0") {
      setOpenedFileImage(require("../images/OpenedFileColor/6B8BD0.png"));
    } else if (fileColor === "#C898D7") {
      setOpenedFileImage(require("../images/OpenedFileColor/C898D7.png"));
    } else if (fileColor === "#D3FF8A") {
      setOpenedFileImage(require("../images/OpenedFileColor/D3FF8A.png"));
    } else if (fileColor === "#89E9E7") {
      setOpenedFileImage(require("../images/OpenedFileColor/89E9E7.png"));
    } else if (fileColor === "#F7FF99") {
      setOpenedFileImage(require("../images/OpenedFileColor/F7FF99.png"));
    } else if (fileColor === "#FF6AA9") {
      setOpenedFileImage(require("../images/OpenedFileColor/FF6AA9.png"));
    } else if (fileColor === "#A8EC9A") {
      setOpenedFileImage(require("../images/OpenedFileColor/A8EC9A.png"));
    } else if (fileColor === "#8D8BFF") {
      setOpenedFileImage(require("../images/OpenedFileColor/8D8BFF.png"));
    } else if (fileColor === "#55CFC0") {
      setOpenedFileImage(require("../images/OpenedFileColor/55CFC0.png"));
    } else if (fileColor === "#FFADD9") {
      setOpenedFileImage(require("../images/OpenedFileColor/FFADD9.png"));
    } else if (fileColor === "#FF97CF") {
      setOpenedFileImage(require("../images/OpenedFileColor/FF97CF.png"));
    } else if (fileColor === "#FFCFE0") {
      setOpenedFileImage(require("../images/OpenedFileColor/FFCFE0.png"));
    } else if (fileColor === "#9FC29D") {
      setOpenedFileImage(require("../images/OpenedFileColor/9FC29D.png"));
    } else if (fileColor === "#8CBE74") {
      setOpenedFileImage(require("../images/OpenedFileColor/8CBE74.png"));
    } else if (fileColor === "#559F76") {
      setOpenedFileImage(require("../images/OpenedFileColor/559F76.png"));
    } else if (fileColor === "#1FC671") {
      setOpenedFileImage(require("../images/OpenedFileColor/1FC671.png"));
    } else if (fileColor === "#CCFF61") {
      setOpenedFileImage(require("../images/OpenedFileColor/CCFF61.png"));
    } else if (fileColor === "#5DC947") {
      setOpenedFileImage(require("../images/OpenedFileColor/5DC947.png"));
    } else if (fileColor === "#86C3D0") {
      setOpenedFileImage(require("../images/OpenedFileColor/86C3D0.png"));
    } else if (fileColor === "#F2CCCC") {
      setOpenedFileImage(require("../images/OpenedFileColor/F2CCCC.png"));
    } else if (fileColor === "#BAF6EF") {
      setOpenedFileImage(require("../images/OpenedFileColor/BAF6EF.png"));
    } else if (fileColor === "#E9CFB6") {
      setOpenedFileImage(require("../images/OpenedFileColor/E9CFB6.png"));
    } else if (fileColor === "#C2A88F") {
      setOpenedFileImage(require("../images/OpenedFileColor/C2A88F.png"));
    } else if (fileColor === "#9A8265") {
      setOpenedFileImage(require("../images/OpenedFileColor/9A8265.png"));
    }
  }, [title, fileColor]);

  const [assignmentList, setAssignmentList] = useState([]);

  const getAssignmentList = async () => {
    try {
      // "team" collection에 접근
      const teamCollectionRef = collection(db, "team");
      // "team" collection에 있는 document에 접근
      const teamDocumentRef = doc(teamCollectionRef, teamid);
      // "과제List" collection에 접근하여 모든 문서 가져오기
      const querySnapshot = await getDocs(
        collection(teamDocumentRef, "과제 list")
      );
      // 가져온 문서를 배열로 변환하여 state 업데이트
      const assignmentData = [];
      querySnapshot.forEach((doc) => {
        assignmentData.push({
          id: doc.id,
          assignmentId: doc.id,
          ...doc.data(),
        });
      });
      setAssignmentList(assignmentData);
    } catch (error) {
      console.error("데이터 불러오기 중 오류 발생:", error);
    }
  };

  //AssigmentPage에 들어올 시 getAssignmentList 함수 작동 (새로고침 함수)
  useFocusEffect(
    React.useCallback(() => {
      getAssignmentList();
    }, [])
  );

  return (
    <View style={styles.container}>
      <StatusBar style={"dark"}></StatusBar>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("TeamPage");
          }}
        >
          <AntDesign name="left" size={20} color="black"></AntDesign>
        </TouchableOpacity>
        <ImageBackground source={openedFileImage} style={styles.openedFile}>
          <Text>{title}</Text>
        </ImageBackground>
      </View>
      <View style={styles.teamMate}>
        <Text style={styles.teamMateText}>팀 메이트: </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("AssignmentAddPage", {
              title: title,
              fileColor: fileColor,
              teamid: teamid,
            });
          }}
        >
          <AntDesign
            style={styles.plusBtn}
            name="plus"
            size={20}
            color="white"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.assignment}>
        {
          <FlatList
            data={assignmentList}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <AssignmentItem
                assignmentName={item.assignmentName}
                dueDate={item.dueDate}
                teamid={teamid}
                title={title}
                fileColor={fileColor}
                assignmentId={item.assignmentId}
                getAssignmentList={getAssignmentList}
              ></AssignmentItem>
            )}
            keyExtractor={(item) => item.id}
          />
        }
      </View>
    </View>
  );
};

export default AssignmentPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: "5%",
  },
  openedFile: {
    position: "absolute",
    top: "25%",
    left: WINDOW_WIDHT * 0.22,
    right: WINDOW_WIDHT * 0.22,
    alignItems: "center",
    justifyContent: "center",
    width: 180,
    height: 155,
    marginBottom: "15%",
  },
  headerContainer: {
    marginTop: "5%",
    marginBottom: "5%",
    flex: 0.15,
    alignItems: "center",
    flexDirection: "row",
    //backgroundColor: "red",
    alignSelf: "flex-start",
  },
  teamMate: {
    flexDirection: "row",
    alignItems: "center",
    height: WINDOW_HEIGHT > 800 ? "4%" : "5%",
    marginTop: WINDOW_HEIGHT > 800 ? "20%" : "30%",
    backgroundColor: color.activated,
    width: WINDOW_WIDHT,
    justifyContent: "space-between",
  },
  teamMateText: {
    color: "white",
    paddingLeft: "3%",
  },
  plusBtn: {
    paddingRight: "3%",
  },
  assignment: {
    flex: 0.85,
    //backgroundColor: "red",
  },
});
