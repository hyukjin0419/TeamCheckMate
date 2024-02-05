import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  FlatList,
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
      <View style={styles.assignmentTitleContainer}>
        <View style={styles.assignmentTitleInfoContainer}>
          <Text style={styles.dueDateText}>{dueDate}</Text>
          <Text style={styles.assignmentTitleText}>{assignmentName}</Text>
        </View>
      </View>
      {/* Code for displaying team members under assignment */}

      <View style={styles.teamMembersNamesArrayContainer}>
        {/* Display the 팀메이트 */}

        <View
          style={{
            ...styles.teamMateContainer,
            backgroundColor: fileColor,
            borderColor: fileColor,
            marginRight: "3%",
          }}
        >
          <Text style={{ ...styles.teamMateText }}>팀메이트</Text>
        </View>
        {/* Display each member in the memberInfo array by using map */}

        <FlatList
          data={memberNames}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                ...styles.memberNameContainer,

                borderColor: fileColor,
              }}
            >
              <Text style={styles.memberNameText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Code for displaying name and add button to add tasks */}
      {/* <View
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
                backgroundColor: "violet",
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
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  // --------------과제 타이틀 영역-----------------
  assignmentTitleContainer: {
    width: WINDOW_WIDHT * 0.9,
    height: WINDOW_HEIGHT > 800 ? WINDOW_HEIGHT * 0.095 : WINDOW_HEIGHT * 0.12,
    //backgroundColor: "red",
    borderWidth: 1,
    borderRadius: 9,
    marginTop: "5%",
    marginBottom: "5%",
    flexDirection: "row",
    // backgroundColor: "yellow",
  },
  assignmentTitleInfoContainer: {
    flex: 1,
    marginLeft: "7%",
    justifyContent: "space-evenly",
    paddingVertical: "5%",
    // backgroundColor: "grey",
  },
  dueDateText: {
    color: color.redpink,
    fontSize: 12,
    fontFamily: "SUIT-Regular",
  },
  assignmentTitleText: {
    color: color.activated,
    fontSize: 20,
    fontFamily: "SUIT-Regular",
  },
  // --------------------중간 팀 멤버 이름 영역----------------
  teamMembersNamesArrayContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "green",
  },
  teamMateContainer: {
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 7,
    backgroundColor: "yellow",
    alignItems: "center",
    justifyContent: "center",
  },
  teamMateText: {
    padding: 9,
    paddingRight: 10,
    paddingLeft: 10,
    fontFamily: "SUIT-Medium",
    fontSize: 12,
  },
  memberNameContainer: {
    marginRight: 6,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  memberNameText: {
    padding: 9,
    paddingRight: 13,
    paddingLeft: 13,
    fontFamily: "SUIT-Medium",
    fontSize: 12,
  },
  teamNameAssignments: {
    justifyContent: "space-between",
    alignItems: "center",
    height: "45%",
    width: "40%",
    backgroundColor: "violet",
  },
});
