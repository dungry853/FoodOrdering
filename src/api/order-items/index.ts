import { Tables } from "@/database.types";
import { supabase } from "@/lib/supabase";
import { InsertTables } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type OrderItem = Tables<"order_items">;

export const useInsertOrderItems = () => {
  return useMutation({
    async mutationFn(items: InsertTables<"order_items">[]) {
      const { error, data: newProduct } = await supabase
        .from("order_items")
        .insert(items)
        .select();
      if (error) {
        throw new Error(error.message);
      }
      return newProduct;
    },
  });
};
