import { View, Text, Platform } from "react-native";
import React, { useContext } from "react";
import { StatusBar } from "expo-status-bar";
import { useCart } from "@/providers/CartProvider";
import { FlatList } from "react-native";
import CartListItem from "@/components/CartListItem";
import Button from "@/components/Button";
import { useSegments } from "expo-router";
const CartScreen = () => {
  const { items, total, checkout } = useCart();

  if (items.length == 0) {
    return (
      <View
        style={{
          display: "flex",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white" }}>The cart is empty now</Text>
      </View>
    );
  } else
    return (
      <View>
        <FlatList
          style={{ height: "80%" }}
          data={items}
          renderItem={({ item }) => <CartListItem cartItem={item} />}
        />
        <View
          style={{
            position: "relative",
            bottom: 0,
          }}
        >
          <Text style={{ color: "white", fontSize: 23, fontWeight: "500" }}>
            Total: ${total}
          </Text>
          <Button text="Checkout" onPress={checkout} />
        </View>

        <StatusBar style={Platform.OS == "ios" ? "light" : "auto"} />
      </View>
    );
};

export default CartScreen;
