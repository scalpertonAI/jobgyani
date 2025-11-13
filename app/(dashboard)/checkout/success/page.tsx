"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Sparkles, ArrowRight } from "lucide-react";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "sprint";

  const planNames: Record<string, string> = {
    sprint: "Job Sprint",
    sprint_quarterly: "Job Sprint (Quarterly)",
    pro: "Job Sprint Pro",
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Success Message */}
      <Card className="border-2 border-green-600 bg-green-50">
        <CardHeader className="text-center pb-3">
          <div className="mx-auto w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-3xl text-green-900">
            Payment Successful!
          </CardTitle>
          <CardDescription className="text-green-700 text-lg">
            Welcome to {planNames[plan] || "JobGyani Pro"}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-green-800">
            Your subscription is now active. You have full access to all premium features!
          </p>
        </CardContent>
      </Card>

      {/* What's Next */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            What's Next?
          </CardTitle>
          <CardDescription>
            Start using your premium features right away
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <Link href="/resume-check" className="block">
              <div className="p-4 border rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-colors group">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold group-hover:text-blue-600">
                      Unlimited Resume Analysis
                    </h3>
                    <p className="text-sm text-gray-600">
                      Get AI-powered feedback on your resume
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600" />
                </div>
              </div>
            </Link>

            <Link href="/interview-gym" className="block">
              <div className="p-4 border rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-colors group">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold group-hover:text-blue-600">
                      Practice Unlimited Questions
                    </h3>
                    <p className="text-sm text-gray-600">
                      Master interviews with unlimited practice
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600" />
                </div>
              </div>
            </Link>

            <Link href="/job-decoder" className="block">
              <div className="p-4 border rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-colors group">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold group-hover:text-blue-600">
                      Decode Job Descriptions
                    </h3>
                    <p className="text-sm text-gray-600">
                      Understand what employers really want
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600" />
                </div>
              </div>
            </Link>

            <Link href="/application-tracker" className="block">
              <div className="p-4 border rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-colors group">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold group-hover:text-blue-600">
                      Track Your Applications
                    </h3>
                    <p className="text-sm text-gray-600">
                      Never miss a follow-up or deadline
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600" />
                </div>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <Link href="/dashboard" className="flex-1">
          <Button variant="outline" className="w-full">
            Go to Dashboard
          </Button>
        </Link>
        <Link href="/settings" className="flex-1">
          <Button variant="outline" className="w-full">
            Manage Subscription
          </Button>
        </Link>
      </div>

      {/* Receipt Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-sm text-gray-600">
            <p>A receipt has been sent to your email address.</p>
            <p className="mt-2">
              Need help? Contact us at{" "}
              <a href="mailto:support@jobgyani.com" className="text-blue-600 hover:underline">
                support@jobgyani.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
