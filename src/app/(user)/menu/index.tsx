import {
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  Text,
} from "react-native";

import ProductListItem from "@components/ProductListItem";
import { useProductlist } from "@/api/products";
export default function HomeScreen() {
  const { data: products, error, isLoading } = useProductlist();
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
  if (error) {
    return (
      <View
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        }}
      >
        <Text style={{ color: "white" }}>Failed to fetch products</Text>;
      </View>
    );
  }
  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     const { data, error } = await supabase.from("products").select("*");
  //     console.log(error);
  //     console.log(data);
  //   };
  //   fetchProducts();
  // });
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
