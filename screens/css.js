import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: "5%",
    backgroundColor: "white",
  },
  head: {
    marginTop: "18%",
    flexDirection: "row",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: "36%",
  },
  textBox: {
    marginTop: "10%",
  },
  textInput: {
    margin: "3%",
    fontSize: 16,
    borderBottomColor: "grey",
    borderBottomWidth: 2,
    paddingBottom: 10,
  },
  button: {
    borderWidth: 1,
    borderRadius: 9,
    alignItems: "center",
    paddingVertical: "5%",
    marginBottom: "3%",
  },
  buttonText: {
    fontSize: 15,
    fontWeight: 400,
  },
});

export default styles;
