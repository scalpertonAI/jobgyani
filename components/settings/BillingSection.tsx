"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Zap, AlertCircle } from "lucide-react";
import Link from "next/link";

interface Props {
  profile: any;
}

export default function BillingSection({ profile }: Props) {
  const subscriptionTier = profile?.subscription_tier || "free";
  const isPro = subscriptionTier === "sprint" || subscriptionTier === "pro";
  const razorpaySubscriptionId = profile?.razorpay_subscription_id;
  const subscriptionStatus = profile?.subscription_status || "inactive";

  const tierDetails = {
    free: {
      name: "Free Plan",
      icon: Check,
      color: "bg-gray-100 text-gray-800",
      features: [
        "1 daily interview question",
        "AI-powered feedback",
        "1 free resume check",
        "View question library",
      ],
    },
    sprint: {
      name: "Job Sprint",
      icon: Zap,
      color: "bg-blue-100 text-blue-800",
      price: "₹2,900/month",
      features: [
        "Everything in Free",
        "Unlimited resume analysis",
        "Unlimited interview practice",
        "Job description decoder",
        "Application tracker",
      ],
    },
    pro: {
      name: "Job Sprint Pro",
      icon: Crown,
      color: "bg-purple-100 text-purple-800",
      price: "₹4,900/month",
      features: [
        "Everything in Job Sprint",
        "Priority AI responses",
        "Advanced analytics",
        "Career coaching sessions",
        "Mock interview recordings",
      ],
    },
  };

  const currentTier = tierDetails[subscriptionTier as keyof typeof tierDetails] || tierDetails.free;
  const TierIcon = currentTier.icon;

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TierIcon className="h-5 w-5" />
                Current Plan
              </CardTitle>
              <CardDescription>
                Your subscription details and billing information
              </CardDescription>
            </div>
            <Badge className={currentTier.color}>
              {currentTier.name}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Plan Details */}
          <div>
            <div className="flex items-baseline justify-between mb-4">
              <div>
                <p className="text-2xl font-bold">{currentTier.name}</p>
                {isPro && 'price' in currentTier && (
                  <p className="text-gray-600 mt-1">{currentTier.price}</p>
                )}
              </div>
              {!isPro && (
                <Link href="/pricing">
                  <Button size="lg">
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade Now
                  </Button>
                </Link>
              )}
            </div>

            {/* Subscription Status */}
            {isPro && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-800">
                      Active Subscription
                    </p>
                    <p className="text-sm text-green-600">
                      Status: {subscriptionStatus}
                    </p>
                    {razorpaySubscriptionId && (
                      <p className="text-xs text-green-600 mt-1 font-mono">
                        ID: {razorpaySubscriptionId}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Features */}
            <div>
              <p className="font-semibold mb-2">Included Features:</p>
              <ul className="space-y-2">
                {currentTier.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Free Plan Usage */}
          {!isPro && profile?.free_resume_check_used && (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-md">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-orange-800">
                    Free Resume Check Used
                  </p>
                  <p className="text-sm text-orange-600">
                    Upgrade to get unlimited resume analysis
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t">
            {!isPro ? (
              <Link href="/pricing" className="flex-1">
                <Button className="w-full" size="lg">
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade to Pro
                </Button>
              </Link>
            ) : (
              <>
                <Button variant="outline" className="flex-1" disabled>
                  Manage Subscription
                </Button>
                <Button variant="outline" className="flex-1" disabled>
                  Cancel Subscription
                </Button>
              </>
            )}
          </div>

          {isPro && (
            <p className="text-xs text-center text-gray-500">
              To manage or cancel your subscription, please contact support
            </p>
          )}
        </CardContent>
      </Card>

      {/* Payment Method */}
      {isPro && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
            <CardDescription>
              Your default payment method for subscriptions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 p-4 border rounded-md">
              <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">CARD</span>
              </div>
              <div className="flex-1">
                <p className="font-medium">•••• •••• •••• ••••</p>
                <p className="text-sm text-gray-500">Managed by Razorpay</p>
              </div>
              <Button variant="outline" size="sm" disabled>
                Update
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Payment details are securely managed by Razorpay
            </p>
          </CardContent>
        </Card>
      )}

      {/* Billing History */}
      {isPro && (
        <Card>
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
            <CardDescription>
              View your past invoices and payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-gray-500">No billing history available yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Your invoices will appear here after your first payment
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
