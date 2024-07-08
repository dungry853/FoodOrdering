import { CartItem } from "@/types";
import { PropsWithChildren, createContext, useContext, useState } from "react";
import { randomUUID as cryptoRandomUUID } from "expo-crypto";
import { Tables } from "@/database.types";
import { useInsertOrder } from "@/api/orders";
import { useRouter } from "expo-router";
import { useInsertOrderItems } from "@/api/order-items";
import { initializePaymentSheet, openPaymentSheet } from "@/lib/stripe";
type Product = Tables<"products">;

//Define Type Of Cart
type CartType = {
  items: CartItem[];
  addItem: (product: Product, size: CartItem["size"]) => void;
  updateQuantity: (itemId: string, amount: -1 | 1) => void;
  total: number;
  checkout: () => void;
};

//Declare Context
export const CartContext = createContext<CartType>({
  items: [],
  addItem: () => {},
  updateQuantity: () => {},
  total: 0,
  checkout: () => {},
});

//Component
const CartProvider = ({ children }: PropsWithChildren) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const { mutate: insertOrder } = useInsertOrder();
  const { mutate: insertOrderItems } = useInsertOrderItems();
  const router = useRouter();
  //Add Item
  const addItem = (product: Product, size: CartItem["size"]) => {
    //If already in cart, increament Quantity
    const existingItem = items.find(
      (item) => item.product == product && item.size == size
    );
    if (existingItem) {
      updateQuantity(existingItem.id, 1);
      return;
    }
    const newCartItem: CartItem = {
      id: cryptoRandomUUID(), //generate
      product,
      product_id: product.id,
      size,
      quantity: 1,
    };

    setItems([newCartItem, ...items]);
  };

  //Update Quantity
  const updateQuantity = (itemId: string, amount: -1 | 1) => {
    setItems(
      items
        .map((item) =>
          item.id != itemId
            ? item
            : { ...item, quantity: item.quantity + amount }
        )
        .filter((item) => item.quantity > 0)
    );
  };

  //Set Total of Cart
  const total = items.reduce(
    (sum, item) => (sum += item.product.price * item.quantity),
    0
  );
  const clearCart = () => {
    setItems([]);
  };
  //Checkout Method
  const checkout = async () => {
    await initializePaymentSheet(Math.floor(total * 100));
    const payed = await openPaymentSheet();
    if (!payed) {
      return;
    }
    insertOrder(
      { total },
      {
        onSuccess: saveOrderItems,
      }
    );
  };

  //Save Order Items
  const saveOrderItems = (order: Tables<"orders">) => {
    const orderItems = items.map((cartItem) => ({
      order_id: order.id,
      product_id: cartItem.product_id,
      size: cartItem.size,
      quantity: cartItem.quantity,
    }));
    insertOrderItems(orderItems, {
      onSuccess() {
        console.warn("Checkout Successfully");
        clearCart();
        router.push(`/(user)/orders/${order.id}`);
      },
    });
    //
  };
  //updateQuantity
  return (
    <CartContext.Provider
      value={{ items, addItem, updateQuantity, total, checkout }}
    >
      {children}
    </CartContext.Provider>
  );
};
export default CartProvider;
export const useCart = () => useContext(CartContext);
