"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Table } from "@/components/ui/Table";
import { Grid, GridItem } from "@/components/ui/Grid";
import { Flex } from "@/components/ui/Flex";
import { Container } from "@/components/ui/Container";
import { Stack } from "@/components/ui/Stack";
import { Modal } from "@/components/ui/Modal";
import { Tooltip } from "@/components/ui/Tooltip";
import { Toast, ToastContainer } from "@/components/ui/Toast";
import {
  Loading,
  LoadingOverlay,
  LoadingButton,
} from "@/components/ui/Loading";
import {
  Users,
  TrendingUp,
  DollarSign,
  Activity,
  Plus,
  Settings,
  Bell,
  Search,
  Eye,
  Edit,
  Trash2,
  BarChart3,
  Calendar,
  Target,
} from "lucide-react";

interface DashboardStats {
  id: string;
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative";
  icon: React.ReactNode;
}

interface RecentActivity {
  id: string;
  user: string;
  action: string;
  time: string;
  status: "completed" | "pending" | "failed";
}

const DashboardPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState<any[]>([]);

  // Dashboard stats
  const stats: DashboardStats[] = [
    {
      id: "users",
      title: "Total Users",
      value: "12,543",
      change: "+12.5%",
      changeType: "positive",
      icon: <Users className="h-6 w-6" />,
    },
    {
      id: "revenue",
      title: "Revenue",
      value: "$45,231",
      change: "+20.1%",
      changeType: "positive",
      icon: <DollarSign className="h-6 w-6" />,
    },
    {
      id: "growth",
      title: "Growth Rate",
      value: "23.4%",
      change: "+5.2%",
      changeType: "positive",
      icon: <TrendingUp className="h-6 w-6" />,
    },
    {
      id: "activity",
      title: "Active Users",
      value: "8,921",
      change: "-2.1%",
      changeType: "negative",
      icon: <Activity className="h-6 w-6" />,
    },
  ];

  // Recent activity data
  const recentActivity: RecentActivity[] = [
    {
      id: "1",
      user: "John Doe",
      action: "Created new project",
      time: "2 minutes ago",
      status: "completed",
    },
    {
      id: "2",
      user: "Jane Smith",
      action: "Updated profile",
      time: "5 minutes ago",
      status: "completed",
    },
    {
      id: "3",
      user: "Bob Johnson",
      action: "Payment processed",
      time: "10 minutes ago",
      status: "pending",
    },
    {
      id: "4",
      user: "Alice Brown",
      action: "Login attempt",
      time: "15 minutes ago",
      status: "failed",
    },
  ];

  // Sample table data
  const tableData = [
    {
      id: 1,
      name: "Project Alpha",
      status: "Active",
      progress: 75,
      team: "Frontend",
    },
    {
      id: 2,
      name: "Project Beta",
      status: "Completed",
      progress: 100,
      team: "Backend",
    },
    {
      id: 3,
      name: "Project Gamma",
      status: "Planning",
      progress: 25,
      team: "Design",
    },
    {
      id: 4,
      name: "Project Delta",
      status: "Active",
      progress: 60,
      team: "QA",
    },
  ];

  const addToast = (
    type: "success" | "error" | "warning" | "info",
    message: string
  ) => {
    const newToast = {
      id: Date.now().toString(),
      type,
      message,
      duration: 5000,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const handleShowModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSimulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      addToast("success", "Operation completed successfully!");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Toast Container */}
      <ToastContainer
        toasts={toasts}
        onClose={removeToast}
        position="top-right"
      />

      {/* Header Section */}
      <div className="border-b border-border bg-surface">
        <Container size="xl" padding="lg">
          <Flex justify="between" align="center" className="py-6">
            <div>
              <h1 className="text-3xl font-bold text-fg">Dashboard</h1>
              <p className="text-fg-muted mt-1">
                Welcome back! Here&apos;s what&apos;s happening today.
              </p>
            </div>
            <Flex gap="sm">
              <Tooltip content="Search dashboard" position="bottom">
                <Button variant="outline" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </Tooltip>
              <Tooltip content="Notifications" position="bottom">
                <Button variant="outline" size="icon">
                  <Bell className="h-4 w-4" />
                </Button>
              </Tooltip>
              <Tooltip content="Settings" position="bottom">
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </Tooltip>
              <Button onClick={handleShowModal}>
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </Flex>
          </Flex>
        </Container>
      </div>

      {/* Main Content */}
      <Container size="xl" padding="lg">
        <Stack spacing="xl" className="py-6">
          {/* Stats Grid */}
          <Grid cols={4} gap="lg">
            {stats.map((stat) => (
              <GridItem key={stat.id} span={1}>
                <Card>
                  <CardHeader className="pb-2">
                    <Flex justify="between" align="center">
                      <CardTitle className="text-sm font-medium text-fg-muted">
                        {stat.title}
                      </CardTitle>
                      <div className="text-fg-muted">{stat.icon}</div>
                    </Flex>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-fg">
                      {stat.value}
                    </div>
                    <p
                      className={`text-xs mt-1 ${
                        stat.changeType === "positive"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {stat.change} from last month
                    </p>
                  </CardContent>
                </Card>
              </GridItem>
            ))}
          </Grid>

          {/* Charts and Activity Row */}
          <Grid cols={2} gap="lg">
            <GridItem span={1}>
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>
                    Key performance indicators overview
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-surface-subtle rounded-radius-2">
                      <div className="flex items-center space-x-3">
                        <BarChart3 className="h-5 w-5 text-blue-500" />
                        <span className="text-sm font-medium">
                          Conversion Rate
                        </span>
                      </div>
                      <span className="text-lg font-bold text-green-600">
                        +15.2%
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-surface-subtle rounded-radius-2">
                      <div className="flex items-center space-x-3">
                        <Target className="h-5 w-5 text-purple-500" />
                        <span className="text-sm font-medium">
                          Goal Achievement
                        </span>
                      </div>
                      <span className="text-lg font-bold text-blue-600">
                        87%
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-surface-subtle rounded-radius-2">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-green-500" />
                        <span className="text-sm font-medium">
                          Time to Market
                        </span>
                      </div>
                      <span className="text-lg font-bold text-orange-600">
                        -23%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </GridItem>
            <GridItem span={1}>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Latest user actions and updates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center justify-between p-3 bg-surface-subtle rounded-radius-2"
                      >
                        <div>
                          <p className="text-sm font-medium text-fg">
                            {activity.user}
                          </p>
                          <p className="text-xs text-fg-muted">
                            {activity.action}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-fg-muted">
                            {activity.time}
                          </p>
                          <span
                            className={`inline-block px-2 py-1 text-xs rounded-full ${
                              activity.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : activity.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {activity.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </GridItem>
          </Grid>

          {/* Projects Table */}
          <Card>
            <CardHeader>
              <CardTitle>Active Projects</CardTitle>
              <CardDescription>
                Overview of current project status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table
                data={tableData}
                columns={[
                  { key: "name", header: "Project Name" },
                  { key: "status", header: "Status" },
                  {
                    key: "progress",
                    header: "Progress",
                    render: (value) => `${value}%`,
                  },
                  { key: "team", header: "Team" },
                  {
                    key: "actions",
                    header: "Actions",
                    render: () => (
                      <Flex gap="xs">
                        <Tooltip content="View project" position="top">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Tooltip>
                        <Tooltip content="Edit project" position="top">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Tooltip>
                        <Tooltip content="Delete project" position="top">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </Tooltip>
                      </Flex>
                    ),
                  },
                ]}
              />
            </CardContent>
          </Card>

          {/* Interactive Demo Section */}
          <Card>
            <CardHeader>
              <CardTitle>Interactive Components Demo</CardTitle>
              <CardDescription>
                Test the new interactive features from Phase 6
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Stack spacing="md">
                <Flex gap="md" wrap="wrap">
                  <Tooltip content="This is a tooltip example" position="top">
                    <Button variant="outline">Hover for Tooltip</Button>
                  </Tooltip>

                  <LoadingButton
                    loading={isLoading}
                    onClick={handleSimulateLoading}
                    loadingText="Processing..."
                  >
                    Simulate Loading
                  </LoadingButton>

                  <Button
                    variant="secondary"
                    onClick={() =>
                      addToast("info", "This is an info notification!")
                    }
                  >
                    Show Info Toast
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={() =>
                      addToast("error", "This is an error notification!")
                    }
                  >
                    Show Error Toast
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() =>
                      addToast("warning", "This is a warning notification!")
                    }
                  >
                    Show Warning Toast
                  </Button>
                </Flex>

                <LoadingOverlay
                  isLoading={isLoading}
                  text="Processing your request..."
                >
                  <div className="p-6 bg-surface-subtle rounded-radius-2 border-2 border-dashed border-border">
                    <p className="text-center text-fg-muted">
                      This content will be covered by a loading overlay when you
                      click &quot;Simulate Loading&quot;
                    </p>
                  </div>
                </LoadingOverlay>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Container>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Create New Project"
        size="lg"
      >
        <Stack spacing="md">
          <div>
            <label className="block text-sm font-medium text-fg mb-2">
              Project Name
            </label>
            <Input placeholder="Enter project name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-fg mb-2">
              Description
            </label>
            <Input placeholder="Enter project description" />
          </div>
          <div>
            <label className="block text-sm font-medium text-fg mb-2">
              Team
            </label>
            <Input placeholder="Enter team name" />
          </div>
          <Flex gap="sm" justify="end">
            <Button variant="outline" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                addToast("success", "Project created successfully!");
                handleCloseModal();
              }}
            >
              Create Project
            </Button>
          </Flex>
        </Stack>
      </Modal>
    </div>
  );
};

export default DashboardPage;
