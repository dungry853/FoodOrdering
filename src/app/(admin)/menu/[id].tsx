import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import React from "react";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import products from "@assets/data/products";
import { defaultPizzaImage } from "@/components/ProductListItem";
import { useState } from "react";
import Button from "@/components/Button";
import { useCart } from "@/provider/CartProvider";
import { PizzaSize } from "@/types";
import FontAwesome from "@expo/vector-icons/FontAwesome";
const ProductDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const product = products.find((p) => p.id.toString() == id);
  const sizes: PizzaSize[] = ["S", "M", "L", "XL"];
  const [selectedSize, setSelectedSize] = useState<PizzaSize>("S");
  const { addItem } = useCart();
  if (!product) {
    return <Text>Product Not Found!!!</Text>;
  }
  const addToCart = () => {
    if (!product) return;
    addItem(product, selectedSize);
    console.warn("Added to Cart, size: ", selectedSize);
  };
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
      <Image
        source={{ uri: product.image || defaultPizzaImage }}
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
