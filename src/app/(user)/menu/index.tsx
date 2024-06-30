import { StyleSheet, View, FlatList } from "react-native";

import products from "@assets/data/products";
import ProductListItem from "@components/ProductListItem";
export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <ProductListItem product={item}></ProductListItem>
        )}
        numColumns={2}
        contentContainerStyle={{ gap: 10, padding: 10 }} //Tạo khoảng cách trên dưới giữa các component
        columnWrapperStyle={{ gap: 10 }} //tạo khoảng cách trái phải giữa các component
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
