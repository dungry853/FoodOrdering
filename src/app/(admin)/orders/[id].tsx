import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React, { useEffect } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";

import OrderListItem from "@/components/OrderListItem";
import OrderItemListItem from "@/components/OrderItemListItem";
import { OrderStatusList } from "@/types";
import { useOrderDetails, useUpdateOrder } from "@/api/orders";
import { supabase } from "@/lib/supabase";
import { notifyUserAboutOrderUpdate } from "@/lib/notifications";
import { useAuth } from "@/providers/AuthProvider";

const OrderDetailsScreen = () => {
  const { id: idString } = useLocalSearchParams();
  const id = Number(idString);
  const { data: order, error, isLoading } = useOrderDetails(id);
  const { mutate: updateOrder } = useUpdateOrder();
  const updateStatus = async (status: string) => {
    await updateOrder({
      id: id,
      updatedField: { status },
    });
    if (order) {
      await notifyUserAboutOrderUpdate({ ...order, status });
    }
  };

  if (error || !order) {
    return (
      <View
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        }}
      >
        <Text style={{ color: "white" }}>Order Not Found</Text>
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
      <Stack.Screen options={{ title: `Order #${order.id}` }} />

      <FlatList
        data={order.order_items}
        renderItem={({ item }) => <OrderItemListItem item={item} />}
        contentContainerStyle={{ gap: 10 }}
        ListHeaderComponent={() => <OrderListItem order={order} />}
        ListFooterComponent={() => (
          <>
            <Text style={{ fontWeight: "bold", color: "white" }}>Status</Text>
            <View style={{ flexDirection: "row", gap: 5 }}>
              {OrderStatusList.map((status) => (
                <Pressable
                  key={status}
                  onPress={() => {
                    updateStatus(status);
                  }}
                  style={{
                    borderColor: "rgb(250, 177, 42)",
                    borderWidth: 1,
                    padding: 10,
                    borderRadius: 5,
                    marginVertical: 10,
                    backgroundColor:
                      order.status === status
                        ? "rgb(250, 177, 42)"
                        : "transparent",
                  }}
                >
                  <Text
                    style={{
                      color:
                        order.status === status ? "white" : "rgb(250, 177, 42)",
                    }}
                  >
                    {status}
                  </Text>
                </Pressable>
              ))}
            </View>
          </>
        )}
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
