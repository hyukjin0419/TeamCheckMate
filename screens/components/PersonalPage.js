import { View, Button, StyleSheet, Text, TouchableOpacity } from "react-native";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { EvilIcons } from "@expo/vector-icons";
import { showToast, toastConfig } from "../components/Toast";
import Modal from "react-native-modal";
import { useState } from "react";

const PersonalPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const openModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  return (
    <View style={styles.container}>
      <Button title="Open Modal" onPress={openModal} />

      <Modal
        onBackButtonPress={() => setIsModalVisible(false)}
        onBackdropPress={() => setIsModalVisible(false)}
        isVisible={isModalVisible}
        swipeDirection="down"
        onSwipeComplete={openModal}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={200}
        animationOutTiming={200}
        backdropTransitionInTiming={200}
        backdropTransitionOutTiming={200}
        style={{ justifyContent: "flex-end", margin: 0 }}
      >
        <View style={styles.modalContent}>
          <View style={styles.center}>
            <View style={styles.barIcon} />
            <Text style={styles.text}>Hello</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 50,
              alignItems: "center",
            }}
          >
            <TouchableOpacity style={styles.tbutton}>
              <Text style={styles.buttonText}>수정</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sbutton}>
              <Text style={{ ...styles.buttonText, color: "red" }}>
                팀 나가기
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PersonalPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: "#161616",
    paddingTop: 12,
    paddingHorizontal: 12,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    minHeight: "40%", // This property determines the minimum height of the modal
    paddingBottom: 20,
  },
  center: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  // color of bar on top of modal
  barIcon: {
    width: 60,
    height: 5,
    backgroundColor: "#bbb",
    borderRadius: 3,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#bbb",
    fontSize: 24,
    marginTop: 50,
  },
  tbutton: {
    borderRadius: 9,
    alignItems: "center",
    paddingVertical: "5%",
    marginBottom: "3%",
    marginTop: "11%",
    backgroundColor: "#050026",
    width: 170,
    height: 70,
  },
  sbutton: {
    borderRadius: 9,
    alignItems: "center",
    paddingVertical: "5%",
    marginBottom: "3%",
    marginTop: "11%",
    backgroundColor: "#EFEFEF",
    width: 170,
    height: 70,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: 400,
    color: "white",
  },
});
