"use client";

import { useState, useEffect } from "react";
import { AIAgent, ContentGenerationRequest, ContentSchedule } from "@/lib/types";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";

interface AIAgentDashboardProps {
  className?: string;
}

export function AIAgentDashboard({ className = "" }: AIAgentDashboardProps) {
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [requests, setRequests] = useState<ContentGenerationRequest[]>([]);
  const [schedule, setSchedule] = useState<ContentSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API calls
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    // Mock data for now
    const mockAgents: AIAgent[] = [
      {
        id: "1",
        name: "MastroWriter",
        role: "content_creator",
        capabilities: ["gastronomy", "food culture", "recipes"],
        lastActive: new Date().toISOString(),
        dailyQuota: 3,
        contentQuality: 95,
      },
      {
        id: "2",
        name: "CulinaryCurator",
        role: "curator",
        capabilities: ["trend analysis", "content curation", "SEO"],
        lastActive: new Date().toISOString(),
        dailyQuota: 5,
        contentQuality: 88,
      },
    ];

    const mockRequests: ContentGenerationRequest[] = [
      {
        id: "1",
        prompt: "Write about traditional Slovak cuisine and its modern adaptations",
        category: "Culture & Heritage",
        targetAudience: "food enthusiasts",
        tone: "professional",
        keywords: ["Slovak cuisine", "traditional food", "modern gastronomy"],
        estimatedReadTime: 8,
        status: "completed",
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
      },
    ];

    const mockSchedule: ContentSchedule[] = [
      {
        id: "1",
        title: "Weekly Wine Guide",
        category: "Beverages",
        scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        aiAgent: "MastroWriter",
        status: "scheduled",
        priority: "high",
      },
    ];

    setAgents(mockAgents);
    setRequests(mockRequests);
    setSchedule(mockSchedule);
    setIsLoading(false);
  };

  const generateDailyContent = async () => {
    // TODO: Implement AI content generation
    // console.log("Generating daily content...");
  };

  const scheduleContent = async () => {
    // TODO: Implement content scheduling
    // console.log("Scheduling content...");
  };

  if (isLoading) {
    return (
      <div className={`animate-pulse space-y-6 ${className}`}>
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Content Dashboard</h1>
          <p className="text-gray-600">Manage your AI agents and daily content generation</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={generateDailyContent} variant="default">
            Generate Daily Content
          </Button>
          <Button onClick={scheduleContent} variant="secondary">
            Schedule Content
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{agents.length}</div>
            <div className="text-sm text-gray-600">Active AI Agents</div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {requests.filter(r => r.status === "completed").length}
            </div>
            <div className="text-sm text-gray-600">Completed Today</div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {schedule.filter(s => s.status === "scheduled").length}
            </div>
            <div className="text-sm text-gray-600">Scheduled Posts</div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {agents.reduce((sum, agent) => sum + agent.dailyQuota, 0)}
            </div>
            <div className="text-sm text-gray-600">Daily Quota</div>
          </div>
        </Card>
      </div>

      {/* AI Agents */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">AI Agents</h2>
        <div className="space-y-4">
          {agents.map((agent) => (
            <div key={agent.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {agent.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold">{agent.name}</h3>
                  <p className="text-sm text-gray-600 capitalize">{agent.role.replace('_', ' ')}</p>
                  <div className="flex space-x-2 mt-1">
                    {agent.capabilities.slice(0, 3).map((cap) => (
                      <Badge key={cap} variant="outline" className="text-xs">
                        {cap}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Quality Score</div>
                <div className="text-lg font-semibold text-green-600">{agent.contentQuality}%</div>
                <div className="text-xs text-gray-500">Quota: {agent.dailyQuota}/day</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Content Schedule */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Content Schedule</h2>
        <div className="space-y-3">
          {schedule.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.category}</p>
                <p className="text-xs text-gray-500">
                  {new Date(item.scheduledDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Badge
                  variant={item.priority === "high" ? "destructive" : "outline"}
                  className="text-xs"
                >
                  {item.priority}
                </Badge>
                <Badge
                  variant={item.status === "scheduled" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {item.status.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
