// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts"
import { serve } from "https://deno.land/std/http/server.ts"
import { stripe } from "../_utils/stripe.ts"
import { json } from "stream/consumers"
console.log("Hello from Functions!")

serve(async (req: Request) => {
  try{
    const {amount} = await req.json();
  
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1099,
      currency: 'usd'
    })
    
    const res = {
      paymentIntent: paymentIntent.client_serect,
      publishableKey: Deno.env.get('EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY')
    }
    
    return new Response(
      JSON.stringify(res),
      { headers: { "Content-Type": "application/json" } },
    )
  }catch(error){
    return new Response(JSON.stringify(error),{
      headers:{'Content-type':'application/json'},
      status:400
    })
  }

})

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


*/
