import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import Modal from "react-native-modal";

const WINDOW_WIDHT = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;

const TeamItem = (props) => {
  const deleteItem = () => {
    props.deleteTeamItem(props.id);
  };
  const fileColor = props.fileColor;

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

  const [TeamOptionModalVisible, SetTeamOptionModalVisible] = useState(false);
  handleTeamOptionPress = () => {
    SetTeamOptionModalVisible(!TeamOptionModalVisible);
  };

  return (
    <ImageBackground style={styles.file} source={imageSource}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{props.title}</Text>
      </View>
      <View style={styles.optionContainer}>
        <TouchableOpacity
          style={styles.fileOption}
          onPress={() => deleteItem()}
        ></TouchableOpacity>
      </View>
      <Modal
        style={styles.modal}
        visible={TeamOptionModalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.background}>
          <Modal
            onSwipeComplete={() => SetTeamOptionModalVisible(false)}
            swipeDirection={"down"}
            animationType="slide"
            visible={TeamOptionModalVisible}
            onBackdropPress={handleTeamOptionPress}
            backdropOpacity={0}
            transparent={true}
          >
            <View style={styles.modalView}>
              <View style={styles.modalItemContainter}>
                <View style={styles.modalVector}></View>
                <View></View>
                <View></View>
                <View></View>
              </View>
            </View>
          </Modal>
        </View>
      </Modal>
    </ImageBackground>
  );
};

export default TeamItem;

const styles = StyleSheet.create({
  modal: {
    flex: 1,
  },
  modalVector: {
    height: 5,
    width: 50,
    backgroundColor: "#D9D9D9",
    borderRadius: 10,
    marginTop: 10,
  },
  modalItemContainter: {
    flex: 1,
    alignItems: "center",
    //justifyContent: "space-evenly",
    //backgroundColor: "red",
    marginBottom: "5%",
  },
  background: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    height: WINDOW_HEIGHT * 2,
    width: WINDOW_WIDHT * 2,
    marginHorizontal: "-50%",
    marginVertical: "-50%",
  },
  modalView: {
    //flex: 1,
    backgroundColor: "white",
    borderStartStartRadius: 20,
    borderStartEndRadius: 20,
    height: 400 /*WINDOW_HEIGHT * 0.6*/,
    alignSelf: "stretch",
    alignItems: "center",
    //marginTop: "70%",
    marginTop: "auto",
    marginHorizontal: "-5.5%",
    marginBottom: "-6%",
  },
  file: {
    width: WINDOW_WIDHT * 0.4,
    height: WINDOW_HEIGHT * 0.18,
    marginHorizontal: 10,
  },
  optionContainer: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "flex-start",
    //backgroundColor: "blue",
    marginBottom: "5%",
  },
  fileOption: {
    //backgroundColor: "red",
    width: "20%",
    height: "80%",
  },
  titleContainer: {
    flex: 1,
    paddingHorizontal: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: "30%",
    //backgroundColor: "teal",
  },
  title: {
    textAlign: "center",
    fontSize: 17,
    fontWeight: "400",
  },
});
