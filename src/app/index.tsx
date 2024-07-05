import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import Button from "@/components/Button";
import { Link, Redirect } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabase";

const index = () => {
  const { session, loading } = useAuth();
  if (loading) {
    return <ActivityIndicator />; //ActivityIndicator là 1 thành phần được sử dụng để hiển thị vòng tròn khi dữ liệu đang tải
  }
  if (!session) {
    return <Redirect href={"/sign_in"} />;
  }
  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 10 }}>
      <Link href={"/(user)"} asChild>
        <Button text="User" />
      </Link>
      <Link href={"/(admin)"} asChild>
        <Button text="Admin" />
      </Link>

      <Button text="Sign Out" onPress={() => supabase.auth.signOut()} />
    </View>
  );
};

export default index;
