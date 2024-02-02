import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/core";
import { useRoute } from "@react-navigation/native";
export default TeamCheckPage = (props) => {
  const navigation = useNavigation();
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

  console.log(teamCode);
  console.log("whatthe");
  console.log(memberInfo);
        console.log(memberNames);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>안녕 팀 체크 페이지에 온걸 환영해 :0</Text>
      <Text>{teamCode}</Text>
      <Text>{title}</Text>
      <Text>{fileColor}</Text>

      {/* Member is an array so we must print each value inside the array individually */}
      {memberInfo && memberInfo.length > 0 && (
        <View>
          {memberInfo.map((member) => (
            <View key={member.id}>
              <Text>{member.name}</Text>
              <Text>{member.phoneNumber}</Text>
              <Text>{member.school}</Text>
              <Text>{member.studentNumber}</Text>
            </View>
          ))}
        </View>
      )}
      {memberNames && <Text>{memberNames.join(", ")}</Text>}
      <Text>{assignmentName}</Text>
      <Text>{assignmentId}</Text>
      <Text>{dueDate}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
});
