"use client";

import { useState } from "react";
import { ContentGenerationRequest } from "@/lib/types";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";

interface ContentGenerationFormProps {
  onSubmit: (request: Omit<ContentGenerationRequest, 'id' | 'status' | 'createdAt'>) => void;
  className?: string;
}

export function ContentGenerationForm({ onSubmit, className = "" }: ContentGenerationFormProps) {
  const [formData, setFormData] = useState({
    prompt: "",
    category: "",
    targetAudience: "",
    tone: "professional" as "professional" | "casual" | "academic" | "conversational",
    keywords: [] as string[],
    estimatedReadTime: 5,
  });

  const [newKeyword, setNewKeyword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      keywords: formData.keywords.filter(k => k.trim() !== ""),
    });
    
    // Reset form
    setFormData({
      prompt: "",
      category: "",
      targetAudience: "",
      tone: "professional",
      keywords: [],
      estimatedReadTime: 5,
    });
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !formData.keywords.includes(newKeyword.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()],
      }));
      setNewKeyword("");
    }
  };

  const removeKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword),
    }));
  };

  const categories = [
    "Gastronomy & Food",
    "Wine & Beverages",
    "Restaurant Reviews",
    "Culinary Culture",
    "Recipes & Cooking",
    "Food Trends",
    "Chef Interviews",
    "Travel & Food",
  ];

  const audiences = [
    "food enthusiasts",
    "professional chefs",
    "home cooks",
    "wine connoisseurs",
    "food bloggers",
    "restaurant owners",
    "culinary students",
    "general audience",
  ];

  const tones = [
    { value: "professional", label: "Professional", description: "Academic, authoritative" },
    { value: "casual", label: "Casual", description: "Friendly, conversational" },
    { value: "academic", label: "Academic", description: "Research-based, detailed" },
    { value: "conversational", label: "Conversational", description: "Personal, engaging" },
  ];

  return (
    <Card className={`p-6 ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">AI Content Generation Request</h2>
          <p className="text-gray-600">Describe the content you want AI to create for your blog</p>
        </div>

        {/* Content Prompt */}
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
            Content Description *
          </label>
          <textarea
            id="prompt"
            value={formData.prompt}
            onChange={(e) => setFormData(prev => ({ ...prev, prompt: e.target.value }))}
            placeholder="Describe the article you want AI to write. Be specific about the topic, angle, and key points to cover..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            required
          />
        </div>

        {/* Category and Audience */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700 mb-2">
              Target Audience *
            </label>
            <select
              id="targetAudience"
              value={formData.targetAudience}
              onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select target audience</option>
              {audiences.map((audience) => (
                <option key={audience} value={audience}>{audience}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tone Selection */}
        <div>
          <div className="block text-sm font-medium text-gray-700 mb-3">
            Writing Tone *
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tones.map((tone) => (
              <div key={tone.value} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  id={`tone-${tone.value}`}
                  name="tone"
                  value={tone.value}
                  checked={formData.tone === tone.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, tone: e.target.value as "professional" | "casual" | "academic" | "conversational" }))}
                  className="mr-3"
                />
                <label htmlFor={`tone-${tone.value}`} className="flex-1 cursor-pointer">
                  <div className="font-medium">{tone.label}</div>
                  <div className="text-sm text-gray-600">{tone.description}</div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Keywords */}
        <div>
          <label htmlFor="newKeyword" className="block text-sm font-medium text-gray-700 mb-2">
            SEO Keywords
          </label>
          <div className="flex space-x-2 mb-3">
            <input
              id="newKeyword"
              type="text"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              placeholder="Add a keyword..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addKeyword())}
            />
            <Button type="button" onClick={addKeyword} variant="secondary" className="px-4">
              Add
            </Button>
          </div>
          {formData.keywords.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.keywords.map((keyword) => (
                <Badge key={keyword} variant="outline" className="flex items-center space-x-1">
                  <span>{keyword}</span>
                  <button
                    type="button"
                    onClick={() => removeKeyword(keyword)}
                    className="ml-1 text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Read Time */}
        <div>
          <label htmlFor="readTime" className="block text-sm font-medium text-gray-700 mb-2">
            Estimated Read Time: {formData.estimatedReadTime} minutes
          </label>
          <input
            id="readTime"
            type="range"
            min="2"
            max="15"
            value={formData.estimatedReadTime}
            onChange={(e) => setFormData(prev => ({ ...prev, estimatedReadTime: parseInt(e.target.value) }))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>2 min</span>
            <span>15 min</span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" variant="default" className="px-8">
            Generate Content
          </Button>
        </div>
      </form>
    </Card>
  );
}
