import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  Image,
  Alert,
  FlatList,
  ScrollView,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import Modal from "react-native-modal";
import { useNavigation } from "@react-navigation/core";
import { color } from "../../styles/colors";
import * as Clipboard from "expo-clipboard";
import s from "../../styles/css";
import { Feather } from "@expo/vector-icons";
import { db, doc, getDoc, getDocs, collection } from "../../../firebase";
import * as Haptics from "expo-haptics";

//반응형 디자인을 위한 스크린의 높이, 넓이 설정
const WINDOW_WIDHT = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;

const TeamItem = (props) => {
  const navigation = useNavigation();
  /* 팀 이름과 파일 아이콘 색상 */
  const [title, setTitle] = useState(props.title);
  const [fileColor, setFileColor] = useState(props.fileColor);
  const [teamCode, setTeamCode] = useState(props.id);
  //멤버 정보 객체 배열
  const [memberInfo, setMemberInfo] = useState([]);
  //멤버 이름 문자 배열
  const [memberNames, setMemberNames] = useState([]);
  //멤버 전화번호 문자 배열
  const [memberPhoneNumbers, setMemberPhoneNumbers] = useState([]);
  //멤버 학교 문자 배열
  const [memberSchools, setMemberSchools] = useState([]);
  //멤버 학번 문자 배열
  const [memberStudentNumbers, setMemberStudentNumbers] = useState([]);
  //멤버 학번 문자 배열
  const [memberEmails, setMemberEmails] = useState([]);
  //터치시 팀 나가는 함수
  const leavingtheTeam = () => {
    props.leaveTeam(props.id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  //팀 이름 혹은 파일 아이콘 색상이 변경되었을 때 리-렌더링
  useEffect(() => {
    setTitle(props.title);
  }, [props.title]);
  useEffect(() => {
    setFileColor(props.fileColor);
  }, [props.fileColor]);

  //이미지 주소 저장하기
  const [imageSource, setImageSource] = useState(
    require("../../images/FileColor/9CB1BB.png")
  ); // Set default image source

  useEffect(() => {
    if (fileColor === "#9CB1BB") {
      setImageSource(require("../../images/FileColor/9CB1BB.png"));
    } else if (fileColor === "#AFA7FF") {
      setImageSource(require("../../images/FileColor/AFA7FF.png"));
    } else if (fileColor === "#C0D4DF") {
      setImageSource(require("../../images/FileColor/C0D4DF.png"));
    } else if (fileColor === "#D7D2FF") {
      setImageSource(require("../../images/FileColor/D7D2FF.png"));
    } else if (fileColor === "#CCEEFF") {
      setImageSource(require("../../images/FileColor/CCEEFF.png"));
    } else if (fileColor === "#9AE1FF") {
      setImageSource(require("../../images/FileColor/9AE1FF.png"));
    } else if (fileColor === "#FF8C39") {
      setImageSource(require("../../images/FileColor/FF8C39.png"));
    } else if (fileColor === "#F7D5FC") {
      setImageSource(require("../../images/FileColor/F7D5FC.png"));
    } else if (fileColor === "#5BEC61") {
      setImageSource(require("../../images/FileColor/5BEC61.png"));
    } else if (fileColor === "#3FBFFF") {
      setImageSource(require("../../images/FileColor/3FBFFF.png"));
    } else if (fileColor === "#FFE600") {
      setImageSource(require("../../images/FileColor/FFE600.png"));
    } else if (fileColor === "#FF6262") {
      setImageSource(require("../../images/FileColor/FF6262.png"));
    } else if (fileColor === "#6B8BD0") {
      setImageSource(require("../../images/FileColor/6B8BD0.png"));
    } else if (fileColor === "#C898D7") {
      setImageSource(require("../../images/FileColor/C898D7.png"));
    } else if (fileColor === "#D3FF8A") {
      setImageSource(require("../../images/FileColor/D3FF8A.png"));
    } else if (fileColor === "#89E9E7") {
      setImageSource(require("../../images/FileColor/89E9E7.png"));
    } else if (fileColor === "#F7FF99") {
      setImageSource(require("../../images/FileColor/F7FF99.png"));
    } else if (fileColor === "#FF6AA9") {
      setImageSource(require("../../images/FileColor/FF6AA9.png"));
    } else if (fileColor === "#A8EC9A") {
      setImageSource(require("../../images/FileColor/A8EC9A.png"));
    } else if (fileColor === "#8D8BFF") {
      setImageSource(require("../../images/FileColor/8D8BFF.png"));
    } else if (fileColor === "#55CFC0") {
      setImageSource(require("../../images/FileColor/55CFC0.png"));
    } else if (fileColor === "#FFADD9") {
      setImageSource(require("../../images/FileColor/FFADD9.png"));
    } else if (fileColor === "#FF97CF") {
      setImageSource(require("../../images/FileColor/FF97CF.png"));
    } else if (fileColor === "#FFCFE0") {
      setImageSource(require("../../images/FileColor/FFCFE0.png"));
    } else if (fileColor === "#9FC29D") {
      setImageSource(require("../../images/FileColor/9FC29D.png"));
    } else if (fileColor === "#8CBE74") {
      setImageSource(require("../../images/FileColor/8CBE74.png"));
    } else if (fileColor === "#559F76") {
      setImageSource(require("../../images/FileColor/559F76.png"));
    } else if (fileColor === "#1FC671") {
      setImageSource(require("../../images/FileColor/1FC671.png"));
    } else if (fileColor === "#CCFF61") {
      setImageSource(require("../../images/FileColor/CCFF61.png"));
    } else if (fileColor === "#5DC947") {
      setImageSource(require("../../images/FileColor/5DC947.png"));
    } else if (fileColor === "#86C3D0") {
      setImageSource(require("../../images/FileColor/86C3D0.png"));
    } else if (fileColor === "#F2CCCC") {
      setImageSource(require("../../images/FileColor/F2CCCC.png"));
    } else if (fileColor === "#BAF6EF") {
      setImageSource(require("../../images/FileColor/BAF6EF.png"));
    } else if (fileColor === "#E9CFB6") {
      setImageSource(require("../../images/FileColor/E9CFB6.png"));
    } else if (fileColor === "#C2A88F") {
      setImageSource(require("../../images/FileColor/C2A88F.png"));
    } else if (fileColor === "#9A8265") {
      setImageSource(require("../../images/FileColor/9A8265.png"));
    }
  }, [fileColor]);

  const [teamOptionModalOpacity, setTeamOptionModalOpacity] = useState(0.7);

  //팀 파일 아이콘 옵션 버튼 터치시 팀 설정 모달창 띄우기
  const [teamOptionModalVisible, setTeamOptionModalVisible] = useState(false);
  handleTeamOptionPress = () => {
    setTeamOptionModalVisible(!teamOptionModalVisible);
  };

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
    if (teamMateModalVisible == true) {
      setTeamOptionModalOpacity(0.7);
    } else {
      setTeamOptionModalOpacity(0);
    }
  };

  const copyToClipboard = async (teamCode) => {
    await Clipboard.setStringAsync(teamCode);
    Alert.alert(
      "참여코드가 클립보드에 복사 되었습니다!\n" + "(" + props.id + ")"
    );
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    console.log(teamCode);
  };

  //모달창에 넣을 팀원정보 할당할기
  const getMembers = async () => {
    try {
      const teamRef = doc(db, "team", teamCode);
      const teamDoc = await getDoc(teamRef);

      if (teamDoc.exists()) {
        const memberRef = collection(teamRef, "members");
        const memberSnapshot = await getDocs(memberRef);

        const memberList = memberSnapshot.docs.map((doc) => {
          const data = doc.data();
          const name = data.name;
          const email = data.email;
          const phoneNumber = data.phoneNumber || null;
          const school = data.school || null;
          const studentNumber = data.studentNumber || null;

          return {
            id: doc.id,
            name,
            phoneNumber,
            school,
            studentNumber,
            email,
          };
        });

        // 상태 업데이트
        setMemberInfo(memberList);
        //멤버 이름
        const memberNameList = memberList.map((member) => member.name || null);
        setMemberNames(memberNameList);
        //멤버 전화번호
        const memberPhoneNumberList = memberList.map(
          (member) => member.phoneNumber || null
        );
        setMemberPhoneNumbers(memberPhoneNumberList);
        //멤버 학교
        const memberSchoolList = memberList.map(
          (member) => member.school || null
        );
        setMemberSchools(memberSchoolList);
        //멤버 학번
        const memberStudentNumberList = memberList.map(
          (member) => member.studentNumber || null
        );
        setMemberStudentNumbers(memberStudentNumberList);
        //멤버 이메일
        const memberEmailList = memberList.map(
          (member) => member.email || null
        );
        setMemberEmails(memberEmailList);

        // 이제 memberInfo에는 members 컬렉션에 있는 문서들이 객체 배열로 저장되어 있습니다.
        // console.log(memberInfo);
        // console.log(memberNames);
      } else {
        console.log("팀 문서가 존재하지 않습니다.");
        throw new Error("팀 문서가 존재하지 않습니다."); // 또는 다른 적절한 처리
      }
    } catch (error) {
      console.error("데이터를 불러오는 중 오류가 발생했습니다.", error);
      throw error;
    }
  };

  useEffect(() => {
    getMembers();
    // console.log(memberInfo);
    // console.log(memberNames);
  }, []);

  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = () => {
    setIsPressed(true);
  };

  const handlePressOut = () => {
    setIsPressed(false);
  };

  const [askingModalVisible, setaskingModalVisible] = useState(false);
  handleAskingModalPress = () => {
    setaskingModalVisible(!askingModalVisible);
  };

  return (
    <Pressable
      onLongPress={handleTeamOptionPress}
      delayLongPress={800}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={({ pressed }) => ({
        opacity: pressed ? 0.2 : 1,
      })}
      onPress={() => {
        navigation.navigate("AssignmentPage", {
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
      }}
    >
      <ImageBackground style={styles.file} source={imageSource}>
        <Text numberOfLines={2} style={styles.title}>
          {title}
        </Text>
        {/* 팀 파일 아이콘 옵션 버튼 */}
        <View style={styles.optionContainer}>
          {/* 터치 시 모달창 팀 설정 띄우기 */}
          <TouchableOpacity
            style={styles.fileOption}
            onPress={handleTeamOptionPress}
          ></TouchableOpacity>
        </View>
        {/* 팀 설정 모달창 */}
        <Modal
          onBackButtonPress={handleTeamOptionPress}
          onBackdropPress={handleTeamOptionPress}
          isVisible={teamOptionModalVisible}
          swipeDirection="down"
          onSwipeComplete={handleTeamOptionPress}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          animationInTiming={200}
          animationOutTiming={200}
          backdropTransitionInTiming={0}
          backdropTransitionOutTiming={0}
          propagateSwipe={true} //모달 내에서 수행한 스와이프 동작이 모달 외부의 스와이프 동작에 영향을 주지 않도록 함
          backdropColor="black"
          backdropOpacity={teamOptionModalOpacity}
          style={{ justifyContent: "flex-end", margin: 0 }}
        >
          {/* 팀 설정 모달창 */}
          <View style={s.modalView}>
            {/* 모달창 내 아이템 (텍스트, 버튼 등) 컨테이너 */}
            <View style={styles.modalItemContainter}>
              {/* 모달창 상단 회색 막대 */}
              <View style={s.modalVector}></View>
              {/* 모달창 상단 팀 이름 표시 */}
              <Text style={s.modalTitle}>{title}</Text>
              {/* 참여 코드 */}
              <TouchableOpacity onPress={() => copyToClipboard(props.id)}>
                <View style={styles.joinCode}>
                  <Text style={styles.joinCodeText}>참여 코드 복사하기 </Text>
                  <Feather name="copy" size={15} color="black" />
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.teamMateAddContainer}>
              <Text style={styles.teamMateAddText}>팀 메이트</Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("TeamUpdateAddMemberPage", {
                    teamId: props.id,
                  });
                  handleTeamOptionPress();
                }}
              >
                <Image
                  style={styles.teamInviteBtn}
                  source={require("../../images/ClassAddBtn.png")}
                ></Image>
              </TouchableOpacity>
            </View>
            <ScrollView
              style={{
                width: WINDOW_WIDHT,
                alignSelf: "center",
                marginLeft: "10%",
              }}
              scrollEnabled={false}
            >
              <FlatList
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                data={memberNames}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    style={{
                      ...styles.teamMateBtn,
                      borderColor: props.fileColor,
                    }}
                    onPress={() => handleTeamMateLabelPress(index)}
                  >
                    <Text style={styles.teamMateBtnText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </ScrollView>
            {/* 팀 수정, 팀 삭제 버튼 컨테이너 */}
            <View style={s.modalTeamBtnContainer}>
              {/* 팀 수정 버튼 */}
              <TouchableOpacity
                style={s.teamReviseBtn}
                onPress={() => {
                  {
                    /* 터치 시 팀 수정 화면으로 이동 (팀 이름, 색상, id까지 함꼐 전송) */
                  }
                  navigation.navigate("TeamUpdatePage", {
                    title: title,
                    fileColor: fileColor,
                    id: props.id,
                  });
                  {
                    /* 모달 숨기기 */
                  }
                  handleTeamOptionPress();
                }}
              >
                <Text style={s.teamReviseText}>팀 수정</Text>
              </TouchableOpacity>
              {/* 팀 삭제 버튼 */}
              <TouchableOpacity
                style={s.teamDeleteBtn}
                onPress={() => handleAskingModalPress()}
              >
                {/* 터치 시 팀 삭제 */}
                <Text style={s.teamDeleteText}>팀 나가기</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Modal
            onBackdropPress={handleAskingModalPress}
            isVisible={askingModalVisible}
            animationIn="zoomIn"
            animationOut="zoomOut"
            animationInTiming={300}
            animationOutTiming={200}
            backdropTransitionInTiming={0}
            backdropTransitionOutTiming={0}
          >
            <View style={s.askingModal}>
              <View marginTop="5%">
                <Text style={s.askingModalText}>팀을 나가시겠습니까?</Text>
              </View>
              <View style={s.askingModalBtnContainer}>
                <TouchableOpacity
                  style={s.askingModalCancelBtn}
                  onPress={() => handleAskingModalPress()}
                >
                  <Text style={s.askingModalCancelText}>취소</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={s.askingModalConfirmBtn}
                  onPress={() => {
                    handleAskingModalPress();
                    leavingtheTeam();
                  }}
                >
                  <Text style={s.askingModalConfirmText}>나가기</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
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
                  source={require("../../images/modalXBtn.png")}
                ></Image>
              </TouchableOpacity>
              {/* 선택된 팀원의 이름을 표시합니다. */}
              <View
                style={{
                  ...styles.teamMateBtn,
                  borderColor: props.fileColor,
                  alignSelf: "center",
                  marginTop: 15,
                }}
                onPress={() => handleTeamMateLabelPress(index)}
              >
                <Text style={styles.teamMateBtnText}>
                  {selectedTeamMateName}
                </Text>
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
        </Modal>
      </ImageBackground>
    </Pressable>
  );
};

export default TeamItem;

const styles = StyleSheet.create({
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
  teamMateBtn: {
    alignItems: "center",
    justifyContent: "center",
    height: 35,
    borderWidth: 1,
    borderRadius: 23,
    marginHorizontal: 4,
    paddingHorizontal: 15,
    marginTop: 10,
  },
  teamMateBtnText: {
    fontFamily: "SUIT-Regular",
    fontSize: 12,
  },
  teamMateAddContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 5,
    marginHorizontal: 20,
  },
  teamMateAddText: {
    fontFamily: "SUIT-Medium",
    fontSize: 12,
  },
  teamInviteBtn: {
    width: 25,
    height: 25,
  },
  joinCode: {
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: color.deletegrey,
    padding: 8,
    borderRadius: 20,
  },
  joinCodeText: {
    fontFamily: "SUIT-Regular",
    fontSize: 11,
  },
  optionContainer: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "flex-start",
  },
  fileOption: {
    width: "20%",
    height: "100%",
  },
  file: {
    width: WINDOW_WIDHT * 0.45,
    height: WINDOW_HEIGHT > 700 ? WINDOW_HEIGHT * 0.15 : WINDOW_HEIGHT * 0.19,
    marginTop: "8%",
  },
  title: {
    textAlign: "center",
    fontSize: 17,
    fontFamily: "SUIT-Medium",
    alignSelf: "center",
    paddingHorizontal: "30%",
    marginTop: WINDOW_HEIGHT > 700 ? "22.5%" : "25%",
  },
  modalItemContainter: {
    flex: 1,
    alignItems: "center",
    marginBottom: "10%",
  },
});
