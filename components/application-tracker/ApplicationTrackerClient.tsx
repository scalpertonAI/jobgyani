"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  Plus,
  Calendar,
  Building2,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
} from "lucide-react";

interface Application {
  id: string;
  company_name: string;
  job_title: string;
  job_description: string | null;
  status: string;
  applied_date: string | null;
  follow_up_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface Props {
  applications: Application[];
}

export default function ApplicationTrackerClient({ applications: initialApplications }: Props) {
  const [applications, setApplications] = useState(initialApplications);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    company_name: "",
    job_title: "",
    job_description: "",
    status: "applied",
    applied_date: new Date().toISOString().split("T")[0],
    follow_up_date: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  const statuses = [
    { value: "applied", label: "Applied", icon: FileText, color: "bg-blue-100 text-blue-800" },
    { value: "screening", label: "Screening", icon: Clock, color: "bg-yellow-100 text-yellow-800" },
    {
      value: "interviewing",
      label: "Interviewing",
      icon: AlertCircle,
      color: "bg-purple-100 text-purple-800",
    },
    { value: "offer", label: "Offer", icon: CheckCircle2, color: "bg-green-100 text-green-800" },
    { value: "rejected", label: "Rejected", icon: XCircle, color: "bg-red-100 text-red-800" },
    { value: "withdrawn", label: "Withdrawn", icon: XCircle, color: "bg-gray-100 text-gray-800" },
  ];

  const filteredApplications = selectedStatus
    ? applications.filter((app) => app.status === selectedStatus)
    : applications;

  const handleAddApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/applications/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to add application");
      }

      setApplications([result.application, ...applications]);
      setShowAddForm(false);
      setFormData({
        company_name: "",
        job_title: "",
        job_description: "",
        status: "applied",
        applied_date: new Date().toISOString().split("T")[0],
        follow_up_date: "",
        notes: "",
      });
    } catch (err: any) {
      alert(err.message || "Failed to add application");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appId: string, newStatus: string) => {
    try {
      const response = await fetch("/api/applications/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: appId, status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      setApplications(
        applications.map((app) =>
          app.id === appId ? { ...app, status: newStatus } : app
        )
      );
    } catch (err: any) {
      alert(err.message || "Failed to update status");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusInfo = statuses.find((s) => s.value === status);
    if (!statusInfo) return null;

    const Icon = statusInfo.icon;
    return (
      <Badge className={statusInfo.color}>
        <Icon className="h-3 w-3 mr-1" />
        {statusInfo.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {statuses.map((status) => {
          const count = applications.filter((app) => app.status === status.value).length;
          const Icon = status.icon;
          return (
            <Card
              key={status.value}
              className={`cursor-pointer transition-all ${
                selectedStatus === status.value ? "ring-2 ring-blue-600" : ""
              }`}
              onClick={() =>
                setSelectedStatus(selectedStatus === status.value ? null : status.value)
              }
            >
              <CardContent className="pt-6 text-center">
                <Icon className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-xs text-gray-600">{status.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add Application Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {selectedStatus
            ? `${statuses.find((s) => s.value === selectedStatus)?.label} Applications`
            : "All Applications"}
        </h2>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Application
        </Button>
      </div>

      {/* Add Application Form */}
      {showAddForm && (
        <Card className="border-2 border-blue-600">
          <CardHeader>
            <CardTitle>Add New Application</CardTitle>
            <CardDescription>Track a new job application</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddApplication} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Company Name *</label>
                  <Input
                    value={formData.company_name}
                    onChange={(e) =>
                      setFormData({ ...formData, company_name: e.target.value })
                    }
                    placeholder="e.g., Google, Microsoft"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Job Title *</label>
                  <Input
                    value={formData.job_title}
                    onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                    placeholder="e.g., Senior Software Engineer"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Job Description (Optional)</label>
                <Textarea
                  value={formData.job_description}
                  onChange={(e) =>
                    setFormData({ ...formData, job_description: e.target.value })
                  }
                  placeholder="Paste the job description here..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    {statuses.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Applied Date</label>
                  <Input
                    type="date"
                    value={formData.applied_date}
                    onChange={(e) => setFormData({ ...formData, applied_date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Follow-up Date</label>
                  <Input
                    type="date"
                    value={formData.follow_up_date}
                    onChange={(e) => setFormData({ ...formData, follow_up_date: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Add any notes about this application..."
                  className="min-h-[80px]"
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Adding..." : "Add Application"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Applications List */}
      {filteredApplications.length > 0 ? (
        <div className="grid gap-4">
          {filteredApplications.map((app) => (
            <Card key={app.id} className="hover:border-blue-200 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Building2 className="h-5 w-5 text-gray-600" />
                      <CardTitle className="text-xl">{app.company_name}</CardTitle>
                    </div>
                    <CardDescription className="text-base">{app.job_title}</CardDescription>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    {getStatusBadge(app.status)}
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      className="text-xs px-2 py-1 border rounded"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {statuses.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  {app.applied_date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Applied:{" "}
                        {new Date(app.applied_date).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  )}
                  {app.follow_up_date && (
                    <div className="flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>
                        Follow-up:{" "}
                        {new Date(app.follow_up_date).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  )}
                </div>

                {app.notes && (
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-gray-700">{app.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {selectedStatus
                ? `No ${statuses.find((s) => s.value === selectedStatus)?.label} applications`
                : "No applications yet"}
            </h3>
            <p className="text-gray-600 mb-4">
              {selectedStatus
                ? "Try selecting a different status or add a new application"
                : "Start tracking your job applications to stay organized"}
            </p>
            {!showAddForm && (
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Application
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
