import { View, Text, Button } from "react-native";
import React from "react";
import { ScreenStack } from "react-native-screens";
import { Stack } from "expo-router";
import { supabase } from "@/lib/supabase";

const ProfileScreen = () => {
  return (
    <View>
      <Button
        title="Sign Out"
        onPress={async () => await supabase.auth.signOut()}
      />
    </View>
  );
};

export default ProfileScreen;
