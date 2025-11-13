import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, CheckCircle2, Sparkles } from "lucide-react";

interface Props {
  feature: string;
  description: string;
  benefits: string[];
}

export default function UpgradePrompt({ feature, description, benefits }: Props) {
  return (
    <div className="max-w-3xl mx-auto">
      <Card className="border-2 border-blue-600 bg-gradient-to-br from-blue-50 to-purple-50">
        <CardHeader className="text-center pb-3">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <Crown className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-3xl flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 text-yellow-500" />
            Unlock {feature}
            <Sparkles className="h-6 w-6 text-yellow-500" />
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold text-lg mb-4">What you'll get:</h3>
            <ul className="space-y-3">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-blue-600 text-white rounded-lg p-6">
            <div className="flex items-baseline justify-between mb-4">
              <div>
                <p className="text-sm opacity-90">Starting at</p>
                <p className="text-4xl font-bold">₹2,900</p>
                <p className="text-sm opacity-90">per month</p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-90">Or save with</p>
                <p className="text-2xl font-bold">₹7,900</p>
                <p className="text-sm opacity-90">quarterly</p>
              </div>
            </div>
            <Link href="/checkout?plan=sprint">
              <Button size="lg" className="w-full bg-white text-blue-600 hover:bg-gray-100">
                <Crown className="h-5 w-5 mr-2" />
                Upgrade to Job Sprint
              </Button>
            </Link>
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              ✓ 7-day free trial • ✓ Cancel anytime • ✓ No hidden fees
            </p>
            <Link href="/pricing">
              <Button variant="link" className="text-blue-600">
                View all pricing plans →
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
