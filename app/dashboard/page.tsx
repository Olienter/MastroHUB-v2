"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/BlogLayout";
import { AIAgentDashboard } from "@/components/dashboard/AIAgentDashboard";
import { ContentGenerationForm } from "@/components/forms/ContentGenerationForm";
import { ContentGenerationRequest } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'generate' | 'schedule'>('overview');
  const [recentRequests, setRecentRequests] = useState<ContentGenerationRequest[]>([]);

  const handleContentGeneration = async (request: Omit<ContentGenerationRequest, 'id' | 'status' | 'createdAt'>) => {
    // TODO: Implement actual AI content generation
    const newRequest: ContentGenerationRequest = {
      id: Date.now().toString(),
      ...request,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setRecentRequests(prev => [newRequest, ...prev.slice(0, 4)]);
    
    // Simulate AI processing
    setTimeout(() => {
      setRecentRequests(prev => 
        prev.map(req => 
          req.id === newRequest.id 
            ? { ...req, status: 'generating' }
            : req
        )
      );
    }, 1000);

    setTimeout(() => {
      setRecentRequests(prev => 
        prev.map(req => 
          req.id === newRequest.id 
            ? { ...req, status: 'completed' }
            : req
        )
      );
    }, 5000);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'generate', label: 'Generate Content', icon: '✍️' },
    { id: 'schedule', label: 'Schedule', icon: '📅' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'generating': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-bold text-gray-900">Content Management Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage your AI agents, generate daily content, and schedule blog posts
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'overview' | 'generate' | 'schedule')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-[600px]">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <AIAgentDashboard />
              
              {/* Recent Content Requests */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Recent Content Requests</h2>
                {recentRequests.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No content requests yet. Start by generating some content!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {recentRequests.map((request) => (
                      <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{request.prompt.substring(0, 60)}...</h4>
                          <p className="text-sm text-gray-600">{request.category} • {request.targetAudience}</p>
                          <div className="flex space-x-2 mt-2">
                            {request.keywords.slice(0, 3).map((keyword) => (
                              <Badge key={keyword} variant="outline" className="text-xs">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(request.status)}>
                            {request.status}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          )}

          {activeTab === 'generate' && (
            <div className="max-w-2xl">
              <ContentGenerationForm onSubmit={handleContentGeneration} />
            </div>
          )}

          {activeTab === 'schedule' && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Content Scheduling</h2>
              <p className="text-gray-600 mb-6">
                Schedule your AI-generated content for automatic publishing. This feature is coming soon!
              </p>
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Advanced Scheduling</h3>
                <p className="text-gray-600">
                  Soon you&apos;ll be able to schedule content weeks in advance, 
                  set publishing times, and automate your entire content calendar.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
