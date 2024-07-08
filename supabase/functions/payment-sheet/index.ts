// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts"
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { stripe } from "../_utils/stripe.ts";
import { createOrRetrieveProfile } from "../_utils/supabase.ts";


console.log("Hello from Functions!")

serve(async (req: Request) => {
  try {
    const { amount } = await req.json();
    const customer = await createOrRetrieveProfile(req);
    //Tạo một ephermeralKey để Stripe SDK có thể truy xuất các phương thức thanh toán đã lưu của khách hàng.
    const ephemeralKey = await stripe.ephemeralKeys.create({
      customer:customer
    },{
      apiVersion: "2020-08-27"
    });
    // Create a PaymentIntent so that the SDK can charge the logged in customer.
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      customer: customer,
    });



    const res = {
      publishableKey: Deno.env.get('EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY'),
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer,
    };
    return new Response(JSON.stringify(res), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify(error), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/payment-sheet' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"amount":1150}'


    ///
    $headers = @{
    "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"
    "Content-Type" = "application/json"
}

$body = @{
    "amount" = 1150
} | ConvertTo-Json

Invoke-RestMethod -Uri 'http://127.0.0.1:54321/functions/v1/payment-sheet' -Method Post -Headers $headers -Body $body


 $headers = @{
    "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxoeGlnZ2RoeWZmbHNtcWRta3Z5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTk5MjU3MTMsImV4cCI6MjAzNTUwMTcxM30.TePq1enW1uY-SPY4PYBLHBRXd8R8llk6puHZzR5a200"
    "Content-Type" = "application/json"
}

$body = @{
    "amount" = 1150
} | ConvertTo-Json

Invoke-RestMethod -Uri 'https://lhxiggdhyfflsmqdmkvy.supabase.co/functions/v1/payment-sheet' -Method Post -Headers $headers -Body $body


  curl -i --location --request POST 'https://lhxiggdhyfflsmqdmkvy.supabase.co/functions/v1/payment-sheet' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxoeGlnZ2RoeWZmbHNtcWRta3Z5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTk5MjU3MTMsImV4cCI6MjAzNTUwMTcxM30.TePq1enW1uY-SPY4PYBLHBRXd8R8llk6puHZzR5a200' \
    --header 'Content-Type: application/json' \
    --data '{"amount":1150}'


*/
