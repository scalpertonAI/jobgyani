"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const plan = searchParams.get("plan") || "sprint";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const plans: Record<string, any> = {
    sprint: {
      name: "Job Sprint",
      price: 2900,
      displayPrice: "₹2,900",
      period: "month",
      features: [
        "Unlimited resume analysis",
        "Unlimited interview practice",
        "Job description decoder",
        "Application tracker",
        "AI follow-up emails",
        "Priority support",
      ],
    },
    sprint_quarterly: {
      name: "Job Sprint (Quarterly)",
      price: 7900,
      displayPrice: "₹7,900",
      period: "quarter",
      savings: "Save ₹800",
      features: [
        "Everything in Job Sprint",
        "3 months access",
        "Best value for money",
      ],
    },
    pro: {
      name: "Job Sprint Pro",
      price: 4900,
      displayPrice: "₹4,900",
      period: "month",
      features: [
        "Everything in Job Sprint",
        "Mock interview sessions",
        "1-on-1 career coaching",
        "Premium support",
      ],
    },
  };

  const selectedPlan = plans[plan] || plans.sprint;

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    if (!scriptLoaded) {
      setError("Payment system is loading. Please try again.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create order
      const response = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: plan,
          amount: selectedPlan.price,
        }),
      });

      const orderData = await response.json();

      if (!response.ok) {
        throw new Error(orderData.error || "Failed to create order");
      }

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "JobGyani",
        description: `${selectedPlan.name} Subscription`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          // Verify payment
          try {
            const verifyResponse = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                plan: plan,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok) {
              throw new Error(verifyData.error || "Payment verification failed");
            }

            // Redirect to success page
            router.push("/checkout/success?plan=" + plan);
          } catch (err: any) {
            setError(err.message || "Payment verification failed");
            setLoading(false);
          }
        },
        prefill: {
          email: orderData.email,
          contact: orderData.phone || "",
        },
        theme: {
          color: "#2563eb",
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err: any) {
      setError(err.message || "Failed to initiate payment");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        <p className="text-gray-600 mt-1">
          Complete your subscription to unlock premium features
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Plan Summary */}
        <Card className="border-2 border-blue-600">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{selectedPlan.name}</CardTitle>
                <CardDescription>Your selected plan</CardDescription>
              </div>
              {selectedPlan.savings && (
                <Badge className="bg-green-600">{selectedPlan.savings}</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-t pt-4">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold">{selectedPlan.displayPrice}</span>
                <span className="text-gray-600">per {selectedPlan.period}</span>
              </div>
            </div>

            <div>
              <p className="font-semibold mb-3">Included features:</p>
              <ul className="space-y-2">
                {selectedPlan.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Subtotal</span>
                <span>{selectedPlan.displayPrice}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Tax (18% GST)</span>
                <span>₹{Math.round(selectedPlan.price * 0.18)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span>₹{selectedPlan.price + Math.round(selectedPlan.price * 0.18)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
              <CardDescription>
                Secure payment powered by Razorpay
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">
                      7-Day Free Trial
                    </p>
                    <p className="text-sm text-blue-600">
                      You won't be charged for the first 7 days. Cancel anytime.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Accepted Payment Methods:</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Credit Card</Badge>
                  <Badge variant="outline">Debit Card</Badge>
                  <Badge variant="outline">UPI</Badge>
                  <Badge variant="outline">Net Banking</Badge>
                  <Badge variant="outline">Wallets</Badge>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Error</p>
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                </div>
              )}

              <Button
                onClick={handlePayment}
                disabled={loading || !scriptLoaded}
                className="w-full"
                size="lg"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Processing..." : `Pay ${selectedPlan.displayPrice}`}
              </Button>

              <p className="text-xs text-center text-gray-500">
                By continuing, you agree to our Terms of Service and Privacy Policy.
                Your payment is processed securely by Razorpay.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>Cancel anytime, no questions asked</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>Instant access to all features</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>30-day money-back guarantee</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
