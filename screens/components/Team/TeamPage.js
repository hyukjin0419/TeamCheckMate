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
      <View style={styles.addBtnContainter}>
        {/* 팀 추가에 점근할 수 있는 버튼 */}
        <TouchableOpacity style={styles.addBtnContainter} onPress={handlePress}>
          <Image
            style={styles.addOrCloseBtn}
            source={require("../../images/ClassAddBtn.png")}
          ></Image>

          {/* 모달 뷰 */}
          <Modal
            style={styles.modalView}
            animationType="fade"
            transparent={true}
            visible={showModal}
          >
            <TouchableWithoutFeedback onPress={handlePress}>
              {/*백그라운드 터치시 모달창 사라지게 하는 함수를 호출*/}
              <View style={styles.modalView}>
                <View style={styles.addBtnContainter}>
                  {/* 엑스 버튼 */}
                  <TouchableOpacity
                    style={styles.addBtnContainter}
                    onPress={handlePress}
                  >
                    <Image
                      style={styles.addOrCloseBtn}
                      source={require("../../images/CloseClassAddBtn.png")}
                    ></Image>
                  </TouchableOpacity>
                </View>

                {/* 버튼 두개: 팀 등록 버튼 & 팀 참여하기 버튼 */}
                <View style={styles.TwoBtnContainer} onPress={handlePress}>
                  {/* 팀 등록 버튼: 팀등록 페이지로 넘어가는 버튼 */}
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("TeamAddPage"), setShowModal(false);
                    }}
                  >
                    <View style={styles.AddClassBtn}>
                      <Text>팀 등록</Text>
                    </View>
                  </TouchableOpacity>
                  {/* 팀 참여하기 버튼: 팀 참여하기 페이지로 넘어가는 버튼 */}
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("TeamJoinPage"), setShowModal(false);
                    }}
                  >
                    <View style={styles.JoinClassBtn}>
                      <Text>팀 참여하기</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                {/* 버튼 위치 맞추기 위한 style */}
                <View flex={1}></View>
                <View height="10%"></View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </TouchableOpacity>
      </View>

      {/* 팀 파일 렌더링하는 코드 */}
      {/* 저장된 팀 리스트를 TeamItem페이지로 보내어서 생성하여 생성된 TeamIteam들을 TeamPage화면에 렌더링*/}
      <View style={styles.classContainer}>
        {
          <FlatList
            numColumns={2}
            showsVerticalScrollIndicator={false}
            data={teamList}
            contentContainerStyle={styles.teamListContainer}
            renderItem={({ item }) => (
              <TeamItem
                title={item.title}
                id={item.id}
                fileColor={item.fileImage}
                deleteTeamItem={deleteTeamItem}
                //getTeamList={getTeamList}
              ></TeamItem>
            )}
            keyExtractor={(item) => item.id}
          />
        }
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: "5%",
    backgroundColor: "white",
  },
  classContainer: {
    flex: 2,
    //backgroundColor: "grey",
    alignItems: "center",
    flexWrap: "wrap",
  },
  teamListContainer: {
    //backgroundColor: "red",
    width: WINDOW_WIDHT * 0.9,
  },
  addBtnContainter: {
    flex: 0.3,
    //backgroundColor: "teal",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    marginBottom: "2%",
  },
  addOrCloseBtn: {
    width: 40,
    height: 40,
    marginRight: "2%",
  },
  modalView: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: "5%",
  },
  TwoBtnContainer: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "flex-start",
  },
  AddClassBtn: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 20,
    marginBottom: "2%",
  },
  AddBtnText: {
    fontSize: 14,
  },
  JoinClassBtn: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 20,
  },
});
