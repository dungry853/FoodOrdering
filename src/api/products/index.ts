import { supabase } from "@/lib/supabase";
import { Product } from "@/types";
import {
  Mutation,
  Query,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useProductlist = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*");
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useProduct = (id: number) => {
  return useQuery<Product>({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};
export const useInsertProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    async mutationFn(data: any) {
      const { error, data: newProduct } = await supabase
        .from("products")
        .insert({
          name: data.name,
          price: data.price,
          image: data.image,
        })
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return newProduct;
    },
    async onSuccess() {
      await queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes("products"),
      });
    },
  });
};
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data: any) {
      const { error, data: updatedProduct } = await supabase
        .from("products")
        .update({
          name: data.name,
          price: data.price,
          image: data.image,
        })
        .eq("id", data.id)
        .select()
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return updatedProduct;
    },
    async onSuccess(_, { id }) {
      await queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes("products"),
      });
      await queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey.includes("product") && query.queryKey.includes(id),
      });
    },
  });
};
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(id: number) {
      await supabase.from("products").delete().eq("id", id);
    },
    async onSuccess() {
      await queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes("products"),
      });
    },
  });
};
