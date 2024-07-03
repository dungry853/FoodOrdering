import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import Button from "@/components/Button";
import { defaultPizzaImage } from "@/components/ProductListItem";
import * as ImagePicker from "expo-image-picker";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import products from "@assets/data/products";
import {
  useDeleteProduct,
  useInsertProduct,
  useProduct,
  useUpdateProduct,
} from "@/api/products";
import { useRoute } from "@react-navigation/native";

const CreateProductScreen = () => {
  const { id: idString } = useLocalSearchParams();
  const id = Number(idString);
  const isUpdating = !!id; // !!'text' chuyển về giá trị true hoặc false
  const { data: updatingProduct, error, isLoading } = useProduct(id);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [nameErrors, setNameErrors] = useState("");
  const [priceErrors, setPriceErrors] = useState("");
  const [image, setImage] = useState("");

  const { mutate: insertProduct } = useInsertProduct();
  const { mutate: updateProduct } = useUpdateProduct();
  const { mutate: deleteProduct } = useDeleteProduct();
  const router = useRouter();
  useEffect(() => {
    if (updatingProduct) {
      setName(updatingProduct.name);
      setPrice(updatingProduct.price.toString());
      setImage(updatingProduct.image || defaultPizzaImage);
    }
  }, [updatingProduct]);

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

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  const onSubmit = () => {
    if (isUpdating) {
      onUpdate();
    } else {
      onCreate();
    }
  };
  const onCreate = () => {
    if (!validateInput()) {
      return;
    }
    console.warn("Creating Product, " + name);
    //Save in the database
    insertProduct(
      { name, price: parseFloat(price), image },
      {
        onSuccess: () => {
          resetFields();
          router.back();
        },
      }
    );
  };
  const onUpdate = () => {
    if (!validateInput()) {
      return;
    }
    console.warn("Updating Product, " + name);
    updateProduct(
      { id, name, price: parseFloat(price), image },
      {
        onSuccess: () => {
          resetFields();
          router.back();
        },
      }
    );
    //Save in the database
    //resetFields();
  };
  const onDelete = () => {
    deleteProduct(id, {
      onSuccess: () => {
        resetFields();
        router.replace("/(admin)");
      },
    });
  };
  const confirmDelete = () => {
    Alert.alert("Confirm", "Are you sure you want to delete this product?", [
      {
        text: "Cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: onDelete,
      },
    ]);
  };
  const validateInput = () => {
    let flag = true;
    if (!name) {
      setNameErrors("Name is required");
      flag = false;
    }
    if (!price) {
      setPriceErrors("Price is required");
      flag = false;
    }
    if (flag == true) {
      resetErrors();
    }
    return flag;
  };
  const resetFields = () => {
    setName("");
    setPrice("");
  };
  const resetErrors = () => {
    setNameErrors("");
    setPriceErrors("");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={Styles.container}>
        <Stack.Screen
          options={{ title: isUpdating ? "Update Product" : "Create Product" }}
        />

        <Image
          source={{
            uri: image || defaultPizzaImage,
          }}
          style={Styles.image}
        />
        <Text onPress={pickImage} style={Styles.textSelectImageButton}>
          Select Image
        </Text>
        <Text style={Styles.label}>Name</Text>
        <TextInput
          placeholder="Name"
          style={Styles.input}
          placeholderTextColor="gainsboro"
          value={name}
          onChangeText={setName}
        />
        <Text style={{ color: "red" }}>{nameErrors}</Text>

        <Text style={Styles.label}>Price ($)</Text>
        <TextInput
          placeholder="9.99"
          style={Styles.input}
          placeholderTextColor="gainsboro"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />
        <Text style={{ color: "red" }}>{priceErrors}</Text>
        <Button onPress={onSubmit} text={isUpdating ? "Update" : "Create"} />
        {isUpdating && (
          <Text onPress={confirmDelete} style={Styles.textSelectImageButton}>
            Delete
          </Text>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};
const Styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },
  image: {
    width: "50%",
    aspectRatio: 1,
    resizeMode: "contain",
    alignSelf: "center",
  },
  textSelectImageButton: {
    color: "yellow",
    alignSelf: "center",
    marginVertical: 10,
    fontWeight: "500",
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
    borderRadius: 5,
  },
});
export default CreateProductScreen;
