import { View, Text, FlatList, ActivityIndicator } from "react-native";
import React, { useEffect } from "react";

import OrderListItem from "@/components/OrderListItem";
import { useMyOrdersList } from "@/api/orders";
import { useUpdateOrderSubscription } from "@/api/orders/subscriptions";

const OrdersScreen = () => {
  const { data: orders, error, isLoading } = useMyOrdersList();
  useUpdateOrderSubscription();
  if (error || !orders) {
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
    <FlatList
      data={orders}
      renderItem={({ item }) => <OrderListItem order={item} />}
      contentContainerStyle={{ gap: 10, padding: 10 }}
    />
  );
};

export default OrdersScreen;
