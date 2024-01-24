import { View, Text, StyleSheet } from "react-native";
import * as Font from "expo-font";
import { useEffect } from "react";

const PersonalPage = () => {
  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        "SUIT-Regular": require("../../assets/fonts/SUIT-Regular.ttf"),
      });
    };
    loadFonts();
  }, []);
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
