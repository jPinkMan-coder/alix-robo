import React, { useEffect, useRef } from "react";
import { Animated, Text } from "react-native";

import type { ViewStyle, StyleProp } from "react-native";

export const BeatingCircle = ({ style }: { style?: StyleProp<ViewStyle> }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.3,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [scaleAnim]);

  return (
    <Animated.View
      style={[
        {
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: "#eee",
          borderWidth: 2,
          borderColor: "#fff",
          justifyContent: "center",
          alignItems: "center",
        },
        style,
        { transform: [{ scale: scaleAnim }] },
      ]}
    >
      <Text>N</Text>
    </Animated.View>
  );
};
