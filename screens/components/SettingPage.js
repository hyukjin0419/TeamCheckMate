import {View, Text, StyleSheet} from "react-native";

const SettingPage = () => {
    return(
        <View style={styles.container}>
            <Text style={styles.text}>Setting Page</Text>
        </View>
    );
};

export default SettingPage;

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems: "center",
        justifyContent: "center"
    },
    text: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
    }
})