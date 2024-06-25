import { View, Text, Platform } from "react-native";
import React, { useContext } from "react";
import { StatusBar } from "expo-status-bar";
import { useCart } from "@/provider/CartProvider";
import { FlatList } from "react-native";
import CartListItem from "@/components/CartListItem";
import Button from "@/components/Button";
const CartScreen = () => {
  const { items, total } = useCart();
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
          <Button text="Checkout" />
        </View>

        <StatusBar style={Platform.OS == "ios" ? "light" : "auto"} />
      </View>
    );
};

export default CartScreen;
