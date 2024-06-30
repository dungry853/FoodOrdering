import {
  Image,
  StyleSheet,
  Platform,
  Text,
  View,
  Pressable,
} from "react-native";
import { Product } from "../types";
import { Link, useSegments } from "expo-router";
type ProductListItemProps = {
  product: Product;
};
export const defaultPizzaImage =
  "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/peperoni.png";
const ProductListItem = ({ product }: ProductListItemProps) => {
  const segments = useSegments();

  return (
    <Link href={`/${segments[0]}/menu/${product.id}`} asChild>
      <Pressable style={styles.product_container}>
        <Image
          source={{ uri: product.image || defaultPizzaImage }}
          style={styles.image}
        />
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.price}>${product.price}</Text>
        {/* <Link href={"/product"}> Go to details</Link>//Cách 1: để dẫn đến trang detail Sản Phẩm, Cách 2: Dùng Link kết hợp thư viện Pressable để có sự kiện onPress*/}
      </Pressable>
    </Link>
  );
};

export default ProductListItem;

const styles = StyleSheet.create({
  product_container: {
    flexDirection: "column",
    backgroundColor: "rgb(250, 177, 42)",
    height: "auto",
    padding: 10,
    flex: 1,
    // margin: 5,//Có thể dùng thuộc tính margin để custom khoảng cách giữa các component với nhau
    borderRadius: 10,
    maxWidth: "50%",
  },
  title: {
    fontSize: 20,
    color: "white",
    fontWeight: "700",
    marginVertical: 10,
    marginBottom: 10,
    height: 48,
  },
  price: { color: "#141A46" },
  image: { width: "100%", aspectRatio: 1, resizeMode: "contain" },
});
