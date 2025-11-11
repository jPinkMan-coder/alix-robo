import { Tabs } from "expo-router";
import { Chrome as Home, Map } from "lucide-react-native";
import { Dimensions, View, StyleSheet, Platform } from "react-native";
import { BlurView } from "expo-blur";

const { width } = Dimensions.get("window");
const isTablet = width >= 768;
const tabWidth = isTablet ? 240 : 240;
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          bottom: isTablet ? 30 : 30,
          alignSelf: "center", // this centers horizontally
          width: tabWidth,
          marginLeft: "38%",
          backgroundColor: "rgba(30, 41, 59, 0.9)",
          borderRadius: isTablet ? 70 : 35,
          borderTopWidth: 0,
          paddingVertical: 4,
          paddingHorizontal: 4,
          minHeight: isTablet ? 55 : 55,
          height: isTablet ? 55 : 45,
          justifyContent: "center",
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.4,
          shadowRadius: 25,
          elevation: 15,
          borderWidth: 1,
          borderColor: "rgba(51, 65, 85, 0.5)",
          zIndex: 1000,
        },
        tabBarItemStyle: {
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: isTablet ? 5 : 12,
          minWidth: isTablet ? 80 : 70,
          height: isTablet ? 45 : 35,
          borderRadius: isTablet ? 25 : 20,
          marginHorizontal: isTablet ? 5 : 6,
          position: "relative",
        },
        tabBarLabelStyle: {
          fontSize: isTablet ? 14 : 12,
          fontWeight: "600",
          marginTop: isTablet ? 6 : 4,
          textAlign: "center",
          marginBottom: 0,
        },
        tabBarIconStyle: {
          marginBottom: 0,
          marginTop: isTablet ? 6 : 1,
        },
        tabBarActiveTintColor: "#3b82f6",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarBackground: () => (
          <View
            style={[
              StyleSheet.absoluteFillObject,
              {
                borderRadius: isTablet ? 70 : 35,
                overflow: "hidden",
              },
            ]}
          >
            {Platform.OS === "web" ? (
              <View
                style={[
                  StyleSheet.absoluteFillObject,
                  {
                    backgroundColor: "rgba(30, 41, 59, 0.9)",
                  },
                ]}
              />
            ) : (
              <BlurView
                intensity={80}
                tint="dark"
                style={StyleSheet.absoluteFillObject}
              />
            )}
            {/* Separator line between buttons */}
            <View
              style={{
                position: "absolute",
                left: "50%",
                top: "20%",
                bottom: "20%",
                width: 1,
                backgroundColor: "rgba(148, 163, 184, 0.3)",
                transform: [{ translateX: -0.5 }],
              }}
            />
          </View>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Control",
          tabBarIcon: ({ size, color }) => (
            <Home size={isTablet ? 24 : 20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Map",
          tabBarIcon: ({ size, color }) => (
            <Map size={isTablet ? 24 : 20} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
