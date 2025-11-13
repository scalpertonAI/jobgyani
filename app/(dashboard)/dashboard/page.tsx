import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { Flame, Target, FileText, TrendingUp } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Get user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Get streak data
  const { data: streak } = await supabase
    .from("user_streaks")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // Get today's question
  const today = new Date().toISOString().split("T")[0];
  const { data: todayQuestion } = await supabase
    .from("daily_questions")
    .select("*, interview_questions(*)")
    .eq("user_id", user.id)
    .eq("assigned_date", today)
    .single();

  // Get total practice sessions count
  const { count: practiceCount } = await supabase
    .from("daily_questions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("answered", true);

  const isPro = profile?.subscription_tier === "sprint" || profile?.subscription_tier === "pro";

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {profile?.full_name || "there"}!
          </h1>
          <p className="text-gray-600 mt-1">
            Let's continue your interview prep journey
          </p>
        </div>
        {!isPro && (
          <Link href="/pricing">
            <Button>Upgrade to Pro</Button>
          </Link>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Current Streak
            </CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{streak?.current_streak || 0} days</div>
            <p className="text-xs text-gray-500 mt-1">
              Longest: {streak?.longest_streak || 0} days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Questions Answered
            </CardTitle>
            <Target className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{practiceCount || 0}</div>
            <p className="text-xs text-gray-500 mt-1">Total practice sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Resume Checks
            </CardTitle>
            <FileText className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {profile?.free_resume_check_used ? "1" : "0"} / 1
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {isPro ? "Unlimited with Pro" : "Free tier limit"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Subscription
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {profile?.subscription_tier || "Free"}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {isPro ? "Active subscription" : "Upgrade for more"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Question Card */}
      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Today's Interview Question</CardTitle>
              <CardDescription>
                {todayQuestion?.answered
                  ? "You've completed today's question!"
                  : "Answer to maintain your streak"}
              </CardDescription>
            </div>
            {todayQuestion && (
              <Badge variant={todayQuestion.answered ? "success" : "default"}>
                {todayQuestion.answered ? "Completed" : "Pending"}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {todayQuestion ? (
            <>
              {!todayQuestion.answered ? (
                <div className="space-y-4">
                  <p className="text-gray-700 font-medium">
                    Ready to practice? Click below to get started.
                  </p>
                  <Link href="/daily-practice">
                    <Button size="lg">Start Today's Practice</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-green-600 font-medium">
                    Great job! Come back tomorrow for your next question.
                  </p>
                  <p className="text-sm text-gray-600">
                    Check out the Question Library to practice more, or upload a
                    resume for analysis.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-700">
                No question assigned yet. Questions are assigned daily at midnight.
              </p>
              <Link href="/question-library">
                <Button variant="outline">Browse Question Library</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Resume Analysis</CardTitle>
            <CardDescription>
              Get AI-powered feedback on your resume
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!profile?.free_resume_check_used || isPro ? (
              <Link href="/resume-check">
                <Button className="w-full">
                  {profile?.free_resume_check_used
                    ? "Upload Another Resume"
                    : "Get Free Resume Check"}
                </Button>
              </Link>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  You've used your free resume check.
                </p>
                <Link href="/pricing">
                  <Button className="w-full">Upgrade for Unlimited</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Question Library</CardTitle>
            <CardDescription>
              Browse 100+ interview questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/question-library">
              <Button variant="outline" className="w-full">
                Explore Questions
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Interview Gym</CardTitle>
            <CardDescription>
              Unlimited practice with AI feedback
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isPro ? (
              <Link href="/interview-gym">
                <Button variant="outline" className="w-full">
                  Start Practicing
                </Button>
              </Link>
            ) : (
              <div className="space-y-3">
                <Badge variant="secondary">Pro Feature</Badge>
                <Link href="/pricing">
                  <Button className="w-full">Unlock Feature</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
