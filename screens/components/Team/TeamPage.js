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
import { useState } from "react";
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
} from "../../../firebase";
import * as React from "react";

const WINDOW_WIDHT = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;

export default TeamPage = () => {
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

  // read data
  const getTeamList = async () => {
    const querySnapshot = await getDocs(collection(db, "team"));
    setTeamList(
      querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        fileColor: doc.fileImage,
      }))
    );
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
        <TouchableOpacity style={styles.addBtnContainter} onPress={handlePress}>
          <Image
            style={styles.addBtn}
            source={require("../../images/ClassAddBtn.png")}
          ></Image>
          <Modal
            style={styles.modalView}
            animationType="fade"
            transparent={true}
            visible={showModal}
          >
            <TouchableWithoutFeedback onPress={handlePress}>
              <View style={styles.modalView}>
                <View style={styles.addBtnContainter}>
                  <TouchableOpacity
                    style={styles.addBtnContainter}
                    onPress={handlePress}
                  >
                    <Image
                      style={styles.addBtn}
                      source={require("../../images/CloseClassAddBtn.png")}
                    ></Image>
                  </TouchableOpacity>
                </View>
                <View style={styles.TwoBtnContainer} onPress={handlePress}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("TeamAddPage"), setShowModal(false);
                    }}
                  >
                    <View style={styles.AddClassBtn}>
                      <Text>팀 등록</Text>
                    </View>
                  </TouchableOpacity>
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
                <View flex={1}></View>
                <View height="10%"></View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </TouchableOpacity>
      </View>
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
                deleteTeamItem={deleteTeamItem}
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
  addBtn: {
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
