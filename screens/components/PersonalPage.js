import { View, Text, StyleSheet } from "react-native";

const PersonalPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Personal Page</Text>
    </View>
  );
};

export default PersonalPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: "SUIT-Regular",
    fontSize: 50,
    // fontWeight: "bold",
    marginBottom: 16,
  },
});
