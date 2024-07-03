import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import Button from "@/components/Button";
import { Link, Redirect } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabase";

const index = () => {
  const { session, loading } = useAuth();
  if (loading) {
    return <ActivityIndicator />;
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
      <Link href={"/(auth)/sign_in"} asChild>
        <Button text="Sign In" />
      </Link>

      <Button text="Sign Out" onPress={() => supabase.auth.signOut()} />
    </View>
  );
};

export default index;
