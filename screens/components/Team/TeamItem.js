import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  Image,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import Modal from "react-native-modal";
import { useNavigation } from "@react-navigation/core";
import { color } from "../../styles/colors";
import * as Clipboard from "expo-clipboard";

//반응형 디자인을 위한 스크린의 높이, 넓이 설정
const WINDOW_WIDHT = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;

const TeamItem = (props) => {
  const navigation = useNavigation();
  /* 팀 이름과 파일 아이콘 색상 */
  const [title, setTitle] = useState(props.title);
  const [fileColor, setFileColor] = useState(props.fileColr);
  //터치시 팀 삭제하는 함수
  const deleteItem = () => {
    props.deleteTeamItem(props.id);
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

  //팀 파일 아이콘 옵션 버튼 터치시 팀 설정 모달창 띄우기
  const [TeamOptionModalVisible, SetTeamOptionModalVisible] = useState(false);
  handleTeamOptionPress = () => {
    SetTeamOptionModalVisible(!TeamOptionModalVisible);
  };

  const copyToClipboard = async (teamCode) => {
    await Clipboard.setStringAsync(teamCode);
    Alert.alert("참여코드가 클립보드에 복사 되었습니다.");
  };

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("AssignmentPage", {
          title: title,
          fileColor: fileColor,
          teamid: props.id,
        });
      }}
    >
      <ImageBackground style={styles.file} source={imageSource}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
        </View>
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
          isVisible={TeamOptionModalVisible}
          swipeDirection="down"
          onSwipeComplete={handleTeamOptionPress}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          animationInTiming={200}
          animationOutTiming={200}
          backdropTransitionInTiming={200}
          backdropTransitionOutTiming={0}
          style={{ justifyContent: "flex-end", margin: 0 }}
        >
          {/* 팀 설정 모달창 */}
          <View style={styles.modalView}>
            {/* 모달창 내 아이템 (텍스트, 버튼 등) 컨테이너 */}
            <View style={styles.modalItemContainter}>
              {/* 모달창 상단 회색 막대 */}
              <View style={styles.modalVector}></View>
              {/* 모달창 상단 팀 이름 표시 */}
              <Text style={styles.modalTitle}>{title}</Text>
              {/* 참여 코드 */}
              <TouchableOpacity onPress={() => copyToClipboard(props.id)}>
                <View style={styles.joinCode}>
                  <Text>참여 코드: {props.id}</Text>
                </View>
              </TouchableOpacity>
              <View flex={1}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("TeamMemberAddPage", {
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
              {/* 팀 수정, 팀 삭제 버튼 컨테이너 */}
              <View style={styles.modalTeamBtnContainer}>
                {/* 팀 수정 버튼 */}
                <TouchableOpacity
                  style={styles.teamReviseBtn}
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
                    SetTeamOptionModalVisible(false);
                  }}
                >
                  <Text style={styles.teamReviseText}>팀 수정</Text>
                </TouchableOpacity>
                {/* 팀 삭제 버튼 */}
                <TouchableOpacity
                  style={styles.teamDeleteBtn}
                  onPress={deleteItem}
                >
                  {/* 터치 시 팀 삭제 */}
                  <Text style={styles.teamDeleteText}>팀 삭제</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default TeamItem;

const styles = StyleSheet.create({
  modalTeamBtnContainer: {
    width: WINDOW_WIDHT,
    //backgroundColor: "yellow",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    height: WINDOW_HEIGHT * 0.13,
  },
  teamReviseBtn: {
    width: WINDOW_WIDHT * 0.4,
    height: WINDOW_HEIGHT * 0.07,
    backgroundColor: color.activated,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  teamReviseText: {
    color: "white",
    fontFamily: "SUIT-Medium",
  },
  teamDeleteBtn: {
    width: WINDOW_WIDHT * 0.4,
    height: WINDOW_HEIGHT * 0.07,
    backgroundColor: color.deletegrey,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  teamDeleteText: {
    color: color.redpink,
    fontFamily: "SUIT-Medium",
  },
  modalVector: {
    height: 5,
    width: 50,
    backgroundColor: color.deactivated,
    borderRadius: 10,
    marginTop: 10,
  },
  modalTitle: {
    marginTop: 30,
    fontFamily: "SUIT-Medium",
    fontSize: 16,
  },
  joinCode: {
    marginTop: 15,
    backgroundColor: color.deletegrey,
    padding: 10,
    borderRadius: 20,
    marginBottom: "2%",
  },
  teamInviteBtn: {
    width: 40,
    height: 40,
    marginRight: "2%",
  },
  modalItemContainter: {
    flex: 1,
    alignItems: "center",
    marginBottom: "5%",
  },
  modalView: {
    backgroundColor: "white",
    paddingTop: 12,
    paddingHorizontal: 12,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    minHeight: "40%", // This property determines the minimum height of the modal
    paddingBottom: 20,
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
    height: WINDOW_HEIGHT > 700 ? WINDOW_HEIGHT * 0.15 : WINDOW_HEIGHT * 0.2,
    // marginHorizontal: WINDOW_WIDHT > 376 ? "1.6%" : "1.7%",
    marginTop: "8%",
  },
  titleContainer: {
    flex: 1,
    paddingHorizontal: WINDOW_WIDHT > 376 ? 60 : 50,
    marginTop: WINDOW_HEIGHT > 700 ? "20.5%" : "22%",
    //backgroundColor: "teal",
  },
  title: {
    textAlign: "center",
    fontSize: 17,
    fontFamily: "SUIT-Medium",
  },
});
