import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import React from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import products from "@assets/data/products";
import { defaultPizzaImage } from "@/components/ProductListItem";
import { useState } from "react";
import Button from "@/components/Button";
import { useCart } from "@/provider/CartProvider";
import { PizzaSize } from "@/types";
function ProductDetailScreen() {
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
      <Stack.Screen options={{ title: product?.name }} />
      <Image
        source={{ uri: product.image || defaultPizzaImage }}
        style={Styles.image}
      />
      <Text style={Styles.sizeTitle}>Select Size</Text>
      <View style={Styles.sizes}>
        {sizes.map((size) => (
          <Pressable
            onPress={() => {
              setSelectedSize(size);
            }}
            style={[
              Styles.size,
              {
                backgroundColor:
                  selectedSize == size ? "rgb(250, 177, 42)" : "white",
              },
            ]}
            key={size}
          >
            <Text
              style={[
                Styles.sizeText,
                { color: selectedSize == size ? "white" : "gray" },
              ]}
            >
              {size}
            </Text>
          </Pressable>
        ))}
      </View>
      <View style={Styles.price}>
        <Text style={Styles.priceTitle}>Price: </Text>
        <Text style={Styles.priceText}>${product.price}</Text>
      </View>

      <Button onPress={addToCart} text="Add To Cart" />
    </View>
  );
}

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
  sizeTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
  },
  sizes: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
    marginBottom: 90,
  },
  size: {
    backgroundColor: "gainsboro",
    width: 50,
    aspectRatio: 1,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  sizeText: {
    color: "black",
    fontSize: 20,
    fontWeight: "500",
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
