import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8 mb-16">
          <Badge className="mx-auto" variant="secondary">
            AI-Powered Job Prep Platform
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
            Get Job-Ready in{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
              10 Minutes a Day
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Practice interview questions daily, get AI-powered resume feedback,
            and access comprehensive job prep tools.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg">Start Free Today</Button>
            <Button size="lg" variant="outline">
              View Pricing
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <Card>
            <CardHeader>
              <CardTitle>Daily Practice</CardTitle>
              <CardDescription>
                Build consistency with one interview question per day
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Get AI feedback on your answers using the STAR method, track your
                streak, and build interview confidence daily.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resume Analysis</CardTitle>
              <CardDescription>
                AI-powered resume feedback and optimization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Get ATS compatibility scores, identify issues, and receive
                actionable suggestions to improve your resume.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Job Decoder</CardTitle>
              <CardDescription>
                Analyze job postings like a pro
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Decode job descriptions to identify key requirements, red flags,
                and get custom interview prep questions.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
