import { Tabs, withLayoutContext } from "expo-router";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { SafeAreaView } from "react-native-safe-area-context"; // là 1 thành phần của React Native được sử dụng để đảm bảo nội dung của ứng dụng không bị che khuất
// edges={["top"]} cho phép chỉ định các cạnh (ở đây là cạnh trên) của màn hình cần áp dụng SafeAreaView, đảm bảo rằng nội dung không bị che khuất bởi các phần tử giao diện hệ thống ở cạnh trên
const TopTab = withLayoutContext(createMaterialTopTabNavigator().Navigator);
export default function OrderListNavigator() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <TopTab>
        <TopTab.Screen name="index" options={{ title: "Active" }} />
      </TopTab>
    </SafeAreaView>
  );
}
