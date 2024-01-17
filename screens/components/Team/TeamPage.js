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
  // 로그인한 사용자의 이메일 가져오기
  const [email, setEmail] = useState("");
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setEmail(user.email);
        console.log("현재 로그인된 사용자의 이메일:" + email);
      } else {
        console.log("사용자가 로그인되어 있지 않습니다.");
      }
    });

    return unsubscribe;
  }, []);
  const navigation = useNavigation();

  const [showModal, setShowModal] = useState(false);

  const handlePress = () => {
    if (showModal) {
      setShowModal(false);
    } else {
      setShowModal(true);
    }
  };

  const [teamList, setTeamList] = useState([]);

  // firestorage에서 team 가져오기
  const getTeamList = async () => {
    try {
      const list = [];
      const querySnapshot1 = await getDocs(
        query(collection(db, "team"), orderBy("timestamp", "desc"))
      );

      const userDocRef = doc(db, "user", email);
      const userTeamCollectionRef = collection(userDocRef, "teamList");
      const querySnapshot2 = await getDocs(query(userTeamCollectionRef));

      querySnapshot1.forEach((doc) => {
        const isDuplicated = querySnapshot2.docs.some(
          (doc2) => doc2.data().teamID === doc.id
        );
        if (isDuplicated) {
          list.push({
            id: doc.id,
            ...doc.data(),
          });
          console.log("성공??: " + doc.id, doc.data());
        }
      });
      setTeamList(list);
    } catch (error) {
      console.error("Error getting team Lsits: ", error);
    }
  };

  const deleteTeamItem = async (id) => {
    await deleteDoc(doc(db, "team", id));
    getTeamList();
  };

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
      <View style={styles.classContainer}>
        {
          <FlatList
            numColumns={2}
            data={teamList}
            contentContainerStyle={styles.teamListContainer}
            renderItem={({ item }) => (
              <TeamItem
                title={item.title}
                id={item.id}
                fileColor={item.fileImage}
                getTeamList={getTeamList}
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
