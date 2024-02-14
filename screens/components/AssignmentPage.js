import { StatusBar } from "expo-status-bar";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/core";
import React, { useState, useEffect } from "react";
import { color } from "../styles/colors";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { db, doc, getDocs, collection, auth, getDoc } from "../../firebase";
import AssignmentItem from "./AssignmentItem";
import Modal from "react-native-modal";
import s from "../styles/css";
import { orderBy, query } from "firebase/firestore";

//반응형 디자인을 위한 스크린의 높이, 넓이 구하는 코드
const WINDOW_WIDHT = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;

const AssignmentPage = () => {
  const navigation = useNavigation();
  //회원정보 가져오기
  const user = auth.currentUser;

  //TeamItem에서 정보 가져오기
  const route = useRoute();
  const {
    title: title,
    fileColor: fileColor,
    teamCode: teamCode,
    memberNames: memberNames,
    memberInfo: memberInfo,
  } = route.params;

  // console.log(
  //   "[AssignmentPage]: ",
  //   memberNames,
  //   memberInfo,
  //   teamCode,
  //   title,
  //   fileColor,
  //   memberInfo,
  //   memberNames
  // );

  const [extractedInfoArray, setExtractedInfoArray] = useState([]);
  //멤버 이메일 문자 배열
  const [memberEmails, setMemberEmails] = useState([]);
  //멤버 학교 문자 배열
  const [memberSchools, setMemberSchools] = useState([]);
  //멤버 학번 문자 배열
  const [memberStudentNumbers, setMemberStudentNumbers] = useState([]);
  //멤버 전화번호 문자 배열
  const [memberPhoneNumbers, setMemberPhoneNumbers] = useState([]);

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

  //팀메이트 정보 모달창
  const [teamMateModalVisible, setTeamMateModalVisible] = useState(false);
  const [selectedTeamMateName, setSelectedTeamMateName] = useState("");
  const [selectedTeamMatePhoneNumber, setSelectedTeamMatePhoneNumber] =
    useState("");
  const [selectedTeamMateSchool, setSelectedTeamMateSchool] = useState("");
  const [selectedTeamMateStudentNumber, setSelectedTeamMateStudentNumber] =
    useState("");
  const [selectedTeamMateEmail, setSelectedTeamMateEmail] = useState("");

  const handleTeamMateLabelPress = (index) => {
    setSelectedTeamMateName(memberNames[index]);
    setSelectedTeamMatePhoneNumber(memberPhoneNumbers[index]);
    setSelectedTeamMateSchool(memberSchools[index]);
    setSelectedTeamMateStudentNumber(memberStudentNumbers[index]);
    setSelectedTeamMateEmail(memberEmails[index]);
    setTeamMateModalVisible(!teamMateModalVisible);
  };

  const getAssignmentList = async () => {
    const assignmentData = [];

    try {
      // "team" collection에 접근
      const teamCollectionRef = collection(db, "team");
      // "team" collection에 있는 document에 접근
      const teamDocumentRef = doc(teamCollectionRef, teamCode);
      // "과제List" collection에 접근하여 모든 문서 가져오기
      const querySnapshot = await getDocs(
        collection(teamDocumentRef, "assignmentList")
      );
      // 가져온 문서를 배열로 변환하여 state 업데이트

      querySnapshot.forEach((doc) => {
        assignmentData.push({
          id: doc.id,
          assignmentId: doc.id,
          ...doc.data(),
        });
      });
      setAssignmentList(assignmentData);
      // console.log(
      //   "[AssignmentPage] : ",
      //   JSON.stringify(assignmentData, null, 2)
      // );
    } catch (error) {
      console.error("데이터 불러오기 중 오류 발생:", error);
    }
  };

  //memberInfo객체에서 정보 배열로 할당
  const extractInfo = (memberInfo) => {
    if (memberInfo && Array.isArray(memberInfo)) {
      const extractedInfo = memberInfo.map((member) => ({
        email: member.email,
        school: member.school,
        studentId: member.studentNumber,
        phoneNumber: member.phoneNumber,
      }));
      setExtractedInfoArray(extractedInfo);
      setMemberEmails(extractedInfo.map((info) => info.email));
      setMemberSchools(extractedInfo.map((info) => info.school));
      setMemberStudentNumbers(extractedInfo.map((info) => info.studentId));
      setMemberPhoneNumbers(extractedInfo.map((info) => info.phoneNumber));
    }
  };

  //AssigmentPage에 들어올 시 getAssignmentList 함수 작동 (새로고침 함수)
  useFocusEffect(
    React.useCallback(() => {
      getAssignmentList();
    }, [])
  );

  useEffect(() => {
    extractInfo(memberInfo);
  }, []);

  //플러스 버튼 터치시 팀 등록|팀 참여하기 버튼 모달창 띄우기|숨기기 함수
  const [showModal, setShowModal] = useState(false);
  const handlePress = () => {
    setShowModal(!showModal);
  };

  return (
    <View
      style={{
        ...styles.container,
        alignItems: "center",
      }}
    >
      <StatusBar style={"dark"}></StatusBar>

      <View
        style={{
          ...s.headContainer,
          alignItems: "center",
          alignSelf: "flex-start",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("TeamPage");
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
        <ImageBackground source={openedFileImage} style={styles.openedFile}>
          <Text numberOfLines={2} ellipsizeMode="tail" style={styles.title}>
            {title}
          </Text>
        </ImageBackground>
      </View>
      <Modal
        isVisible={showModal}
        animationIn="fadeIn"
        animationOut="fadeOut"
        animationInTiming={100}
        animationOutTiming={100}
        backdropTransitionInTiming={0}
        backdropTransitionOutTiming={0}
        backdropOpacity={0.6}
      >
        {/*백그라운드 터치시 모달창 사라지게 하는 함수를 호출*/}
        <View style={styles.modalView}>
          <TouchableWithoutFeedback onPress={handlePress}>
            <View style={s.modalInsideView}>
              {/* 버튼 두개: 과제추가 버튼 & 팀원추가 버튼 */}
              <View style={s.BtnContainer} onPress={handlePress}>
                {/* 과제추가 버튼: 과제추가 페이지로 넘어가는 버튼 */}
                <TouchableOpacity
                  style={s.addClassBtn}
                  onPress={() => {
                    navigation.navigate("AssignmentAddPage", {
                      title: title,
                      fileColor: fileColor,
                      teamCode: teamCode,
                      memberInfo: memberInfo,
                      memberNames: memberNames,
                      memberPhoneNumbers: memberPhoneNumbers,
                      memberEmails: memberEmails,
                      memberSchools: memberSchools,
                      memberStudentNumbers: memberStudentNumbers,
                    });
                    handlePress();
                  }}
                >
                  <Text style={s.addClassBtnText}>과제 추가</Text>
                  <Image
                    source={require("../images/icons/AssignmentAdd.png")}
                    style={{ width: 20, height: 20 }}
                  />
                </TouchableOpacity>
                {/* 팀원추가: 팀원추가 페이지로 넘어가는 버튼 */}
                <TouchableOpacity
                  style={s.joinClassBtn}
                  onPress={() => {
                    navigation.navigate("TeamUpdateAddMemberPage", {
                      teamId: teamCode,
                    }),
                      setShowModal(false);
                  }}
                >
                  <Text style={s.addClassBtnText}>팀원 추가</Text>
                  <Image
                    source={require("../images/icons/TeamMateAdd.png")}
                    style={{ width: 20, height: 20 }}
                  />
                </TouchableOpacity>
              </View>
              {/* 엑스 버튼 */}
              <TouchableOpacity
                style={styles.closeBtnContainer}
                onPress={handlePress}
                activeOpacity={1}
              >
                <Image
                  style={styles.addOrCloseBtn}
                  source={require("../images/CloseClassAddBtn.png")}
                ></Image>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Modal>
      <ScrollView
        alignSelf="center"
        scrollEnabled={false}
        style={{
          marginLeft: 20,
          marginTop: 140,
          width: WINDOW_WIDHT,
        }}
      >
        <View style={styles.teamMembersNamesArrayContainer}>
          <View
            style={{
              ...styles.teamMateBtn,
              borderColor: fileColor,
              backgroundColor: fileColor,
              marginRight: "1%",
            }}
          >
            <Text style={styles.teamMateBtnText}>팀 메이트</Text>
          </View>
          <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            data={memberNames}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={{
                  ...styles.teamMateBtn,
                  borderColor: fileColor,
                }}
                onPress={() => handleTeamMateLabelPress(index)}
              >
                <Text style={styles.teamMateBtnText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </ScrollView>
      <Modal
        onBackdropPress={handleTeamMateLabelPress}
        isVisible={teamMateModalVisible}
        animationIn="zoomIn"
        animationOut="zoomOut"
        animationInTiming={300}
        animationOutTiming={200}
        backdropTransitionInTiming={0}
        backdropTransitionOutTiming={0}
      >
        <View style={styles.teamMateModal}>
          <TouchableOpacity onPress={handleTeamMateLabelPress}>
            <Image
              style={styles.teamModalXBtn}
              source={require("../images/modalXBtn.png")}
            ></Image>
          </TouchableOpacity>
          {/* 선택된 팀원의 이름을 표시합니다. */}
          <View
            style={{
              ...styles.teamMateBtn,
              borderColor: fileColor,
              alignSelf: "center",
              marginTop: 15,
            }}
            onPress={() => handleTeamMateLabelPress(index)}
          >
            <Text style={styles.teamMateBtnText}>{selectedTeamMateName}</Text>
          </View>
          <View marginTop="5%">
            <Text style={styles.teamMateDataText}>
              이메일: {selectedTeamMateEmail}
            </Text>
            <Text style={styles.teamMateDataText}>
              학교: {selectedTeamMateSchool}
            </Text>
            <Text style={styles.teamMateDataText}>
              학번: {selectedTeamMateStudentNumber}
            </Text>
            <Text style={styles.teamMateDataText}>
              전화번호: {selectedTeamMatePhoneNumber}
            </Text>
          </View>
        </View>
      </Modal>
      {/* Parent View for both FlatLists */}
      <View style={{ flex: 25 }}>
        {/* 과제 리스트 */}
        <FlatList
          data={assignmentList}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View>
              <AssignmentItem
                teamCode={teamCode}
                title={title}
                fileColor={fileColor}
                memberInfo={memberInfo}
                memberNames={memberNames}
                assignmentName={item.assignmentName}
                assignmentId={item.assignmentId}
                dueDate={item.dueDate}
                getAssignmentList={getAssignmentList}
              ></AssignmentItem>
            </View>
          )}
          keyExtractor={(item) => item.id}
        ></FlatList>
      </View>
      {/* 팀 추가에 점근할 수 있는 버튼 */}
      <TouchableOpacity style={styles.addBtnContainer} onPress={handlePress}>
        <Image
          style={styles.addOrCloseBtn}
          source={require("../images/ClassAddBtn.png")}
        ></Image>
      </TouchableOpacity>
    </View>
  );
};

export default AssignmentPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: "5%",
    backgroundColor: "white",
  },
  modalView: {
    flexDirection: "column",
    width: WINDOW_WIDHT,
    height: WINDOW_HEIGHT,
    alignSelf: "center",
  },
  addBtnContainer: {
    position: "absolute",
    right: "1%",
    bottom: 10,
    zIndex: 1,
  },
  closeBtnContainer: {
    position: "absolute",
    bottom: 10,
    right: "1%",
  },
  addOrCloseBtn: {
    width: 80,
    height: 80,
  },
  teamMateBtn: {
    alignItems: "center",
    justifyContent: "center",
    height: 35,
    borderWidth: 1,
    borderRadius: 23,
    marginHorizontal: 2,
    paddingHorizontal: 13,
    marginTop: 10,
    marginLeft: 5,
  },
  teamMateBtnText: {
    fontFamily: "SUIT-Regular",
    fontSize: 12,
  },
  openedFile: {
    position: "absolute",
    top: "25%",
    alignItems: "center",
    justifyContent: "center",
    width: 180,
    height: 155,
    left: "50%",
    marginLeft: -90,
    marginBottom: "10%",
  },
  title: {
    textAlign: "center",
    fontSize: 17,
    fontFamily: "SUIT-Medium",
    alignSelf: "center",
    paddingHorizontal: "30%",
    marginTop: WINDOW_HEIGHT > 700 ? "10%" : "10.5%",
  },
  teamMateModal: {
    backgroundColor: "white",
    borderRadius: 20,
    minHeight: 210,
    marginBottom: "10%",
  },
  teamModalXBtn: {
    position: "absolute",
    right: 12,
    top: 12,
    width: 30,
    height: 30,
  },
  teamMateDataText: {
    fontFamily: "SUIT-Regular",
    fontSize: 14,
    marginHorizontal: "10%",
    marginBottom: "3%",
  },
  teamMembersNamesArrayContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    //backgroundColor: "green",
    width: WINDOW_WIDHT,
    paddingRight: "2.5%",
  },
});
