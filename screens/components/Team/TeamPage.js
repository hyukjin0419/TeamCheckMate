import { useNavigation } from "@react-navigation/core";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  FlatList,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { useState, useEffect } from "react";
import * as Font from "expo-font";
import s from "../../styles/css";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import TeamItem from "./TeamItem";
import {
  db,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  collection,
  addDoc,
  auth,
} from "../../../firebase";
import { query, orderBy } from "firebase/firestore";
import * as React from "react";

const WINDOW_WIDHT = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;

export default TeamPage = () => {
  const navigation = useNavigation();
  //회원정보 가져오기
  const user = auth.currentUser;
  console.log("이걸로도 갖올 수 있는겨?" + user.email);
  //플러스 버튼 터치시 팀 등록|팀 참여하기 버튼 모달창 띄우기|숨기기 함수
  const [showModal, setShowModal] = useState(false);
  const handlePress = () => {
    setShowModal(!showModal);
  };

  const [teamList, setTeamList] = useState([]);

  // firestorage에서 team 비교하여 내 팀 가져와 리스트에 저장하기
  const getTeamList = async () => {
    try {
      const querySnapshot1 = await getDocs(
        query(collection(db, "team"), orderBy("timestamp", "desc"))
      );

      const userDocRef = doc(db, "user", user.email);
      const userTeamCollectionRef = collection(userDocRef, "teamList");
      const querySnapshot2 = await getDocs(query(userTeamCollectionRef));
      const list = [];
      querySnapshot2.forEach((doc2) => {
        console.log("TeamID in querySnapshot2:", doc2.data().teamID);
      });

      querySnapshot1.forEach((doc) => {
        const isDuplicated = querySnapshot2.docs.some(
          (doc2) => doc2.data().teamID === doc.id
        );
        if (isDuplicated) {
          list.push({
            id: doc.id,
            ...doc.data(),
          });
          console.log("성공: " + doc.id, doc.data());
        }
      });
      setTeamList(list);
    } catch (error) {
      console.error("Error getting team Lsits: ", error);
    }
  };

  //팀 삭제 코드
  const deleteTeamItem = async (id) => {
    await deleteDoc(doc(db, "team", id));
    await deleteDoc(doc(doc(db, "user", user.email), "teamList", id));
    getTeamList();
  };

  //TeamPage에 들어올 시 getTeamList 함수 작동 (새로고침 함수)
  useFocusEffect(
    React.useCallback(() => {
      getTeamList();
    }, [])
  );

  return (
    <View style={styles.container}>
      <StatusBar style={"dark"}></StatusBar>
      <View style={s.headContainer}></View>
      {/* 팀 추가에 점근할 수 있는 버튼 */}
      <TouchableOpacity style={styles.AddBtnContainer} onPress={handlePress}>
        <Image
          style={styles.addOrCloseBtn}
          source={require("../../images/ClassAddBtn.png")}
        ></Image>

        {/* 모달 뷰 */}
        <Modal
          style={styles.modalView}
          // animationType="fade"
          transparent={true}
          visible={showModal}
          animationInTiming={20} // 애니메이션 속도 조절 (단위: 밀리초)
          animationOutTiming={20}
        >
          <TouchableWithoutFeedback onPress={handlePress}>
            {/*백그라운드 터치시 모달창 사라지게 하는 함수를 호출*/}
            <View style={styles.modalView}>
              <View style={s.headContainer}></View>
              {/* 엑스 버튼 */}
              <TouchableOpacity
                style={styles.AddBtnContainer}
                onPress={handlePress}
              >
                <Image
                  style={styles.addOrCloseBtn}
                  source={require("../../images/CloseClassAddBtn.png")}
                ></Image>
              </TouchableOpacity>
              {/* 버튼 두개: 팀 등록 버튼 & 팀 참여하기 버튼 */}
              <View style={styles.twoBtnContainer} onPress={handlePress}>
                {/* 팀 등록 버튼: 팀등록 페이지로 넘어가는 버튼 */}
                <TouchableOpacity
                  style={styles.addClassBtn}
                  onPress={() => {
                    navigation.navigate("TeamAddPage"), setShowModal(false);
                  }}
                >
                  <Text style={styles.addClassBtnText}>팀 등록</Text>
                  <Image
                    source={require("../../images/icons/teamAdd_plus.png")}
                    style={{ width: 16, height: 16 }}
                  />
                </TouchableOpacity>
                {/* 팀 참여하기 버튼: 팀 참여하기 페이지로 넘어가는 버튼 */}
                <TouchableOpacity
                  style={styles.joinClassBtn}
                  onPress={() => {
                    navigation.navigate("TeamJoinPage"), setShowModal(false);
                  }}
                >
                  <Text style={styles.addClassBtnText}>팀 참여</Text>
                  <Image
                    source={require("../../images/icons/teamJoin.png")}
                    style={{ width: 16, height: 16 }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("TeamJoinPage"), setShowModal(false);
                  }}
                ></TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </TouchableOpacity>
      {/* 팀 파일 렌더링하는 코드 */}
      {/* 저장된 팀 리스트를 TeamItem페이지로 보내어서 생성하여 생성된 TeamIteam들을 TeamPage화면에 렌더링*/}
      <FlatList
        numColumns={2}
        showsVerticalScrollIndicator={false}
        data={teamList}
        contentContainerStyle={styles.teamListContainer}
        columnWrapperStyle={{
          justifyContent: "space-between",
        }}
        renderItem={({ item }) => (
          <TeamItem
            title={item.title}
            id={item.id}
            fileColor={item.fileImage}
            deleteTeamItem={deleteTeamItem}
          ></TeamItem>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  teamListContainer: {
    //backgroundColor: "red",
    width: WINDOW_WIDHT * 0.92,
    alignSelf: "center",
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
  addClassBtnText: {
    fontFamily: "SUIT-Regular",
    fontSize: 14,
    paddingHorizontal: 1,
    marginRight: 3,
  },
  joinClassBtn: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },
});
