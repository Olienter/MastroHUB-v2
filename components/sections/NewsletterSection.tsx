"use client";

import React, { useState } from "react";
import { Button } from "../ui/Button";

interface NewsletterSectionProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export const NewsletterSection: React.FC<NewsletterSectionProps> = ({
  title = "Stay Updated",
  subtitle = "Get the latest gastronomy insights, exclusive interviews, and culinary trends delivered to your inbox.",
  className = "",
}) => {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSubscribing(true);
    setError("");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubscribing(false);
    setIsSubscribed(true);
    setEmail("");
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError("");
  };

  return (
    <section
      className={`relative bg-gradient-to-r from-red-600 to-red-700 rounded-3xl p-8 md:p-12 text-center text-white overflow-hidden ${className}`}
    >
      {/* Background overlay with subtle animation */}
      <div className="absolute inset-0 bg-black/20 rounded-3xl" />

      {/* Floating elements for visual interest */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16 blur-2xl animate-pulse" />
      <div
        className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-x-12 translate-y-12 blur-xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Success state */}
        {isSubscribed ? (
          <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-green-100">
              Successfully Subscribed!
            </h2>
            <p className="text-lg text-red-100 mb-6">
              Welcome to our community! You&apos;ll receive our latest updates
              soon.
            </p>
            <button
              onClick={() => setIsSubscribed(false)}
              className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              Subscribe Another Email
            </button>
          </div>
        ) : (
          <>
            {/* Title and subtitle */}
            <h2 className="text-3xl md:text-4xl font-bold mb-4 transform hover:scale-105 transition-transform duration-300">
              {title}
            </h2>
            <p className="text-lg text-red-100 mb-8 leading-relaxed">
              {subtitle}
            </p>

            {/* Newsletter form */}
            <form onSubmit={handleSubscribe} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <div className="flex-1 relative">
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Enter your email"
                    className={`w-full px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-700 transition-all duration-300 ${
                      error
                        ? "ring-2 ring-red-300 ring-offset-2 ring-offset-red-700"
                        : ""
                    }`}
                    aria-label="Email address for newsletter"
                    disabled={isSubscribing}
                  />
                  {error && (
                    <div className="absolute -bottom-6 left-0 text-red-200 text-sm animate-in slide-in-from-top-2 duration-300">
                      {error}
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubscribing}
                  className={`px-6 py-3 bg-white text-red-700 rounded-lg font-semibold transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-700 ${
                    isSubscribing
                      ? "opacity-75 cursor-not-allowed"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {isSubscribing ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-red-700 border-t-transparent rounded-full animate-spin" />
                      <span>Subscribing...</span>
                    </div>
                  ) : (
                    "Subscribe"
                  )}
                </Button>
              </div>
            </form>

            {/* Additional info */}
            <p className="text-sm text-red-200 mt-6 opacity-80">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </>
        )}
      </div>
    </section>
  );
};
