"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import {
  BookOpen,
  Brain,
  FileText,
  Home,
  LogOut,
  Settings,
  CreditCard,
  Target,
  Briefcase,
  Zap,
} from "lucide-react";

interface DashboardNavProps {
  user: User;
  profile: any;
}

export default function DashboardNav({ user, profile }: DashboardNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home, free: true },
    {
      href: "/daily-practice",
      label: "Daily Practice",
      icon: Target,
      free: true,
    },
    {
      href: "/resume-check",
      label: "Resume Check",
      icon: FileText,
      free: true,
    },
    {
      href: "/question-library",
      label: "Question Library",
      icon: BookOpen,
      free: true,
    },
    {
      href: "/interview-gym",
      label: "Interview Gym",
      icon: Brain,
      free: false,
    },
    {
      href: "/job-decoder",
      label: "Job Decoder",
      icon: Zap,
      free: false,
    },
    {
      href: "/application-tracker",
      label: "Applications",
      icon: Briefcase,
      free: false,
    },
  ];

  const isPro = profile?.subscription_tier === "sprint" || profile?.subscription_tier === "pro";

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">J</span>
            </div>
            <span className="font-bold text-xl">JobGyani</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              const canAccess = item.free || isPro;

              return (
                <Link
                  key={item.href}
                  href={canAccess ? item.href : "/pricing"}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  } ${!canAccess ? "opacity-60" : ""}`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  {!item.free && !isPro && (
                    <Badge variant="secondary" className="text-xs">
                      Pro
                    </Badge>
                  )}
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {!isPro && (
              <Link href="/pricing">
                <Button size="sm" variant="default">
                  Upgrade to Pro
                </Button>
              </Link>
            )}

            {isPro && (
              <Badge variant="success" className="text-xs">
                {profile.subscription_tier === "sprint" ? "Sprint" : "Pro"}
              </Badge>
            )}

            <div className="flex items-center space-x-2">
              <Link href="/settings">
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </Link>

              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden py-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            const canAccess = item.free || isPro;

            return (
              <Link
                key={item.href}
                href={canAccess ? item.href : "/pricing"}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                } ${!canAccess ? "opacity-60" : ""}`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
                {!item.free && !isPro && (
                  <Badge variant="secondary" className="text-xs ml-auto">
                    Pro
                  </Badge>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
