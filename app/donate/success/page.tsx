'use client'
import { useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function Success() {
  const [status, setStatus] = useState('checking')

  useEffect(() => {
    (async () => {
      const stripe = await stripePromise
      const params = new URLSearchParams(window.location.search)
      const clientSecret = params.get('payment_intent_client_secret')
      if (!stripe || !clientSecret) return
      const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret)
      setStatus(paymentIntent?.status ?? 'unknown')
    })()
  }, [])

  return (
    <div className="flex p-8">
      <h1 className="text-2xl font-bold">Thank you for your donation!</h1>
      <p className="mt-2">
        {status === 'succeeded' && '✅ Payment succeeded!'}
        {status === 'processing' && '⏳ Payment processing...'}
        {status === 'requires_payment_method' && '❌ Payment failed, please try again.'}
        {status === 'unknown' && '⚙️ Checking payment status...'}
      </p>
    </div>
  )
}