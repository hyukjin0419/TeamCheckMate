import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/core";
import { useRoute } from "@react-navigation/native";
import { color } from "../styles/colors";
import s from "../styles/css.js";
import { AntDesign } from "@expo/vector-icons";

const WINDOW_WIDHT = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;

export default TeamCheckPage = (props) => {
  const navigation = useNavigation();
  const [inputTask, setInputTask] = useState("");
  const [tasks, setTasks] = useState([""]);
  const route = useRoute();
  const {
    teamCode,
    title,
    fileColor,
    memberInfo,
    memberNames,
    assignmentName,
    assignmentId,
    dueDate,
  } = route.params;

  const addTasks = () => {
    // Add new input into array
    setTasks([...tasks, ""]);
  };

  const updateTasks = (text, index) => {
    // newEmailInputs will contain all the currently added emails
    const newTasks = [...tasks];
    // The new index position of the newEmailInputs array will include newly added email
    newTasks[index] = text;
    // update emailInputs
    setTasks(newTasks);
  };

  console.log(teamCode);
  return (
    <View style={s.container}>
      <View style={s.headContainer}>
        {/* Header code */}
        <View style={s.headBtn}>
          {/* Back button */}
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <AntDesign name="left" size={20} color="black" />
          </TouchableOpacity>
        </View>
        {/* Title */}
        <Text style={s.title}>{title}</Text>
        <View style={s.titleRightBtn}></View>
      </View>
      {/* Code that shows the assignment that user selected */}
      <View style={styles.assignmentBox}>
        <View style={styles.assignmentDataContainer}>
          <Text style={styles.dueDateText}>{dueDate}</Text>
          <Text style={styles.assignmentNameText}>{assignmentName}</Text>
        </View>
      </View>
      {/* Code for displaying team members under assignment */}
      <View style={styles.teamNameContainer}>
        {/* Display the 팀메이트 */}
        <View
          style={{
            ...styles.teamCircle,
            ...styles.teamNameContainer,
            backgroundColor: fileColor,
            borderColor: fileColor,
            marginRight: "3%",
          }}
        >
          <Text style={{ ...styles.teamName }}>팀메이트</Text>
        </View>
        {/* Display each member in the memberInfo array by using map */}
        {memberInfo.map((member) => (
          <View
            key={member.id}
            style={{
              ...styles.teamCircle,
              ...styles.teamNameContainer,
              marginRight: "3%",
              borderColor: fileColor,
            }}
          >
            <Text style={styles.teamName}>{member.name}</Text>
          </View>
        ))}
      </View>

      {/* Code for displaying name and add button to add tasks */}
      <View
        style={{
          position: "absolute",
          marginTop: "70%",
          marginLeft: "5%",
          left: 0,
        }}
      >
        {memberInfo.map((member) => (
          <TouchableOpacity>
            <View
              key={member.id}
              style={{
                ...styles.teamCircle,
                ...styles.teamNameAssignments,
                flexDirection: "row",
                borderColor: fileColor,
              }}
            >
              <Text style={{ ...styles.teamName, marginLeft: "10%" }}>
                {member.name}
              </Text>
              <Image
                source={require("../images/ClassAddBtn.png")}
                style={{ width: 20, height: 20, marginRight: "10%" }}
              />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  assignmentDataContainer: {
    flex: 1,
    marginLeft: "7%",
    justifyContent: "space-evenly",
    paddingVertical: "5%",
  },
  dueDateText: {
    color: color.redpink,
    fontSize: 12,
    fontFamily: "SUIT-Regular",
  },
  assignmentNameText: {
    color: color.activated,
    fontSize: 20,
    fontFamily: "SUIT-Regular",
  },
  assignmentBox: {
    width: WINDOW_WIDHT * 0.9,
    height: WINDOW_HEIGHT > 800 ? WINDOW_HEIGHT * 0.095 : WINDOW_HEIGHT * 0.12,
    //backgroundColor: "red",
    borderWidth: 1,
    borderRadius: 9,
    marginBottom: "5%",
    flexDirection: "row",
  },
  teamNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  teamNameAssignments: {
    justifyContent: "space-between",
    alignItems: "center",
    height: "45%",
    width: "40%",
  },
  teamName: {
    fontFamily: "SUIT-Regular",
    fontSize: 12,
  },
  teamCircle: {
    width: "15%",
    height: "150%",
    borderRadius: 30,
    borderWidth: 1,
    backgroundColor: "blue",
  },
});
