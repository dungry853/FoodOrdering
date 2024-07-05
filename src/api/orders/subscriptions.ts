import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export const useInsertOrderSubscription = () => {
  const queryClient = useQueryClient();
  useEffect(() => {
    const ordersSubscription = supabase
      .channel("custom-insert-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          queryClient.invalidateQueries({
            predicate: (query) => query.queryKey.includes("orders"),
          });
        }
      )
      .subscribe();
    return () => {
      ordersSubscription.unsubscribe();
    };
  }, []);
};
export const useUpdateOrderSubscriptionByID = (id: Number) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const ordersSubscription = supabase
      .channel("custom-update-channel")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${id}`,
        },
        (payload) => {
          queryClient.invalidateQueries({
            predicate: (query) =>
              query.queryKey.includes("orders") && query.queryKey.includes(id),
          });
        }
      )
      .subscribe();
    return () => {
      ordersSubscription.unsubscribe();
    };
  });
};

export const useUpdateOrderSubscription = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const ordersSubscription = supabase
      .channel("custom-update-channel")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
        },
        (payload) => {
          queryClient.invalidateQueries({
            predicate: (query) => query.queryKey.includes("orders"),
          });
        }
      )
      .subscribe();
    return () => {
      ordersSubscription.unsubscribe();
    };
  });
};
