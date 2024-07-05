import { View, Text, StyleSheet, FlatList } from "react-native";
import React from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import OrderListItem from "@/components/OrderListItem";
import OrderItemListItem from "@/components/OrderItemListItem";
import { useOrderDetails } from "@/api/orders";
import { useUpdateOrderSubscriptionByID } from "@/api/orders/subscriptions";

const OrderDetailsScreen = () => {
  const { id: idString } = useLocalSearchParams();
  const id = Number(idString);
  useUpdateOrderSubscriptionByID(id);
  const { data: order, error, isLoading } = useOrderDetails(id);
  if (!order) {
    return (
      <Text style={{ color: "white", alignSelf: "center" }}>
        Order not found !!!
      </Text>
    );
  }
  return (
    <View style={Styles.container}>
      <Stack.Screen options={{ title: `Order #${order.id}` }} />
      <OrderListItem order={order} />

      <FlatList
        data={order.order_items}
        renderItem={({ item }) => <OrderItemListItem item={item} />}
        contentContainerStyle={{ gap: 10 }}
      />
    </View>
  );
};

export default OrderDetailsScreen;
const Styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    gap: 10,
  },
});
