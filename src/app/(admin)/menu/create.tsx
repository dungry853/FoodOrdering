import { View, Text, StyleSheet, TextInput } from "react-native";
import React from "react";
import Button from "@/components/Button";
const CreateProductScreen = () => {
  return (
    <View style={Styles.container}>
      <Text style={Styles.label}>Name</Text>
      <TextInput
        placeholder="Name"
        style={Styles.input}
        placeholderTextColor="gainsboro"
      />
      <Text style={Styles.label}>Price ($)</Text>
      <TextInput
        placeholder="9.99"
        style={Styles.input}
        placeholderTextColor="gainsboro"
        keyboardType="numeric"
      />
      <Button text="Create" />
    </View>
  );
};
const Styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },
  label: {
    color: "white",
    fontSize: 18,
  },
  input: {
    backgroundColor: "black",
    color: "white",
    borderColor: "orange",
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
  },
});
export default CreateProductScreen;
