import { View, Text, StyleSheet } from "react-native";
import { showToast, toastConfig } from "../components/Toast";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";

const GuidancePage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Guidance Page</Text>
      <Toast
        position="bottom"
        style={styles.text}
        visibilityTime={2000}
        config={toastConfig}
        keyboardOffset={null}
      />
    </View>
  );
};

export default GuidancePage;

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
