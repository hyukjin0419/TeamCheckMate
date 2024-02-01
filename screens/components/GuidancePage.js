import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image,
} from "react-native";

const YourComponent = () => {
  const [rotationValue] = useState(new Animated.Value(0));

  const rotateButton = () => {
    Animated.timing(rotationValue, {
      toValue: 45,
      duration: 700,
      useNativeDriver: false,
    }).start();
  };

  const rotateStyle = rotationValue.interpolate({
    inputRange: [0, 45],
    outputRange: ["0deg", "45deg"],
  });

  return (
    <View style={styles.container}>
      {/* 회전 애니메이션을 적용할 부모 View */}
      <View style={styles.centeredContainer}>
        <Animated.View
          style={{
            transform: [{ rotate: rotateStyle }],
          }}
        >
          {/* 자식 View (버튼) */}
          <TouchableOpacity
            style={styles.rotatableButton}
            onPress={rotateButton}
          >
            <View>
              {/* 버튼 내용 */}
              <Image source={require("../images/ClassAddBtn.png")} />
              {/* 버튼 내용을 여기에 추가 */}
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  rotatableButton: {
    width: 100,
    height: 40,
    backgroundColor: "blue", // 버튼의 배경색을 원하는 색으로 지정
    justifyContent: "center",
    alignItems: "center",
  },
});

export default YourComponent;
