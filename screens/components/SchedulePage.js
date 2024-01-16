import {View, Text, StyleSheet} from "react-native";

const SchedulePage = () => {
    return(
        <View style={styles.container}>
            <Text style={styles.text}>Schedule Page</Text>
        </View>
    );
};

export default SchedulePage;

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