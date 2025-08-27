'use client'
// pages/checkout.js
// pages/checkout.js
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const CARD_OPTIONS = {
    style: {
        base: {
            color: "#fff",
            fontSize: "16px",
            fontFamily: "Arial, sans-serif",
            "::placeholder": { color: "#aaa" },
        },
        invalid: {
            color: "#ff6b6b",
        },
    },
};

function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            // Step 1: Create payment intent
            const res = await fetch('/api/create-payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ billId }),
            });
            const { clientSecret, error } = await res.json();
            if (error) throw new Error(error);

            // Step 2: Confirm payment
            const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: { card: elements.getElement(CardElement) },
            });

            if (stripeError) throw new Error(stripeError.message);

            if (paymentIntent.status === 'succeeded') {
                // Step 3: Update DB
                await fetch('/api/confirm-payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ billId }),
                });
                setMessage("🎉 Payment successful!");
                onPaymentSuccess && onPaymentSuccess();
            }
        } catch (err) {
            setMessage(err.message || "Payment failed. Please try again.");
        }

        setLoading(false);
    };


    return (
        <form
            onSubmit={handleSubmit}
            style={{
                background: "#1f1f1f",
                padding: "2rem",
                borderRadius: "1rem",
                maxWidth: "400px",
                width: "100%",
                boxShadow: "0 8px 20px rgba(0,0,0,0.5)",
                display: "flex",
                flexDirection: "column",
                gap: "1.2rem",
            }}
        >
            <h2 style={{ margin: 0, fontSize: "1.5rem", color: "#fff", textAlign: "center" }}>
                Checkout
            </h2>

            <CardElement options={CARD_OPTIONS} />

            <button
                type="submit"
                disabled={!stripe || loading}
                style={{
                    background: "#6366f1",
                    color: "#fff",
                    padding: "0.75rem",
                    border: "none",
                    borderRadius: "0.5rem",
                    fontSize: "1rem",
                    cursor: "pointer",
                    transition: "background 0.3s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = "#4f46e5")}
                onMouseOut={(e) => (e.currentTarget.style.background = "#6366f1")}
            >
                {loading ? "Processing..." : "Pay $20"}
            </button>

            {message && (
                <p style={{ color: message.includes("successful") ? "#4ade80" : "#f87171", textAlign: "center" }}>
                    {message}
                </p>
            )}
        </form>
    );
}

export default function Checkout() {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                background: "#121212",
            }}
        >
            <Elements stripe={stripePromise}>
                <CheckoutForm />
            </Elements>
        </div>
    );
}
