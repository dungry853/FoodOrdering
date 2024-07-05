import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import products from "@assets/data/products";
import { defaultPizzaImage } from "@/components/ProductListItem";
import { useState } from "react";
import Button from "@/components/Button";
import { useCart } from "@/providers/CartProvider";
import { PizzaSize } from "@/types";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useProduct } from "@/api/products";
import RemoteImage from "@/components/RemoteImage";
const ProductDetailScreen = () => {
  const { id: idString } = useLocalSearchParams();
  const id = Number(idString);
  const { data: product, error, isLoading } = useProduct(id);
  if (error || !product) {
    return (
      <View
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        }}
      >
        <Text style={{ color: "white" }}>Product Not Found</Text>
      </View>
    );
  }
  if (isLoading) {
    return (
      <ActivityIndicator
        style={{
          display: "flex",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      />
    );
  }
  return (
    <View style={Styles.container}>
      <Stack.Screen
        options={{
          title: product?.name,
          headerRight: () => (
            <Link href={`/(admin)/menu/create?id=${id}`} asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="pencil"
                    size={25}
                    color="white"
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <RemoteImage
        path={product.image}
        fallback={defaultPizzaImage}
        style={Styles.image}
      />
      <Text style={Styles.name}>{product.name}</Text>
      <View style={Styles.price}>
        <Text style={Styles.priceTitle}>Price: </Text>
        <Text style={Styles.priceText}>${product.price}</Text>
      </View>
    </View>
  );
};

const Styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    resizeMode: "contain",
    height: "auto",
  },
  name: {
    color: "white",
    fontSize: 25,
    fontWeight: "500",
    marginVertical: 10,
  },
  price: {
    display: "flex",
    flexDirection: "row",
  },
  priceTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
  },
  priceText: {
    color: "rgb(250, 177, 42)",
    fontSize: 20,
    fontWeight: "700",
  },
});

export default ProductDetailScreen;

const styles = StyleSheet.create({});
