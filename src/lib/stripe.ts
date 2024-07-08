import { Alert } from "react-native";
import { supabase } from "./supabase";
import { FunctionsHttpError } from '@supabase/supabase-js'
import { initPaymentSheet, presentPaymentSheet } from "@stripe/stripe-react-native";
const fetchPaymentSheetParams = async (amount: number) => {
    const { data, error } = await supabase.functions.invoke('payment-sheet', {
      body: { amount }
    });
    if (data) {
      console.log(data);
      return data;
    }
    Alert.alert(`Error: ${error?.message ?? 'no data'}` );
    return {};
  };
export const initializePaymentSheet = async(amount:number) => {
    console.log('Initializing payment sheet, for: ',amount);
    
    const {paymentIntent,publishableKey} = await fetchPaymentSheetParams(amount);
    
    if(!paymentIntent || !publishableKey) return;

    await initPaymentSheet({
      merchantDisplayName:"zunxhoof.dev",
      paymentIntentClientSecret: paymentIntent,
      defaultBillingDetails:{
        name: 'Jane Doe'
      }
    })
}
 

export const openPaymentSheet = async()=>{
  const {error} = await presentPaymentSheet();
  if(error){
    Alert.alert(error.message);
    return false;
  }
  return true;
}