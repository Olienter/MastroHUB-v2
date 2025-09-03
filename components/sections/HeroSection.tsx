"use client";

import React, { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { Container } from "../ui/Container";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  description,
  ctaText,
  backgroundImage,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      data-testid="hero"
      role="banner"
      className="relative min-h-[60vh] lg:min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10 dark:opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-orange-500/20 to-yellow-500/20 animate-pulse" />
        <div className="absolute top-0 left-0 w-72 h-72 bg-red-500/10 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-orange-500/10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-yellow-500/10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />
      </div>

      {/* Background Image with enhanced effects */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-out"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          transform: isHovered ? "scale(1.05)" : "scale(1)",
          opacity: isLoaded ? 0.3 : 0,
        }}
      >
        {/* Gradient overlay */}
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.8) 0%, rgba(31, 41, 55, 0.9) 50%, rgba(234, 88, 12, 0.8) 100%)',
          }}
        />
        <div className="absolute inset-0 bg-black/20 transition-opacity duration-500" />
      </div>

      {/* Content with enhanced animations */}
      <Container
        variant="no-padding"
        className="relative z-10 text-center text-white px-4"
      >
        <div className="max-w-5xl mx-auto space-y-6 lg:space-y-8">
          {/* Subtitle with enhanced animation */}
          <div
            className={`inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 transition-all duration-1000 ${
              isVisible
                ? "translate-y-0 opacity-100 scale-100"
                : "translate-y-8 opacity-0 scale-95"
            }`}
            style={{ transitionDelay: "0ms" }}
          >
            <span className="text-sm lg:text-base font-medium text-white">
              {subtitle}
            </span>
            <div className="ml-3 w-2 h-2 bg-red-400 rounded-full animate-ping" />
          </div>

          {/* Main Title with enhanced typography */}
          <h1
            className={`font-bold leading-tight transition-all duration-1000 text-white ${
              isVisible
                ? "translate-y-0 opacity-100 scale-100"
                : "translate-y-12 opacity-0 scale-95"
            }`}
            style={{
              transitionDelay: "200ms",
              fontSize: "clamp(2.5rem, 8vw, 5rem)",
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              textShadow: "0 4px 8px rgba(0,0,0,0.3)",
            }}
          >
            {title}
          </h1>

          {/* Description with enhanced styling */}
          <p
            className={`text-white/90 max-w-4xl mx-auto leading-relaxed transition-all duration-1000 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
            style={{
              transitionDelay: "400ms",
              fontSize: "clamp(1.1rem, 3vw, 1.5rem)",
              textShadow: "0 2px 4px rgba(0,0,0,0.2)",
            }}
          >
            {description}
          </p>

          {/* CTA Buttons with enhanced styling */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 lg:gap-6 transition-all duration-1000 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: "600ms" }}
          >
            <Button
              variant="premium"
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white shadow-2xl hover:shadow-red-500/25 transform hover:scale-105 transition-all duration-200"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              }
              iconPosition="right"
            >
              {ctaText}
            </Button>
            
            <Button
              variant="ghost"
              size="lg"
              className="w-full sm:w-auto text-white hover:bg-white/10 border border-white/20 backdrop-blur-sm"
            >
              Watch Demo
            </Button>
          </div>

          {/* Stats Section */}
          <div
            className={`grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mt-12 lg:mt-16 transition-all duration-1000 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: "800ms" }}
          >
            {[
              { label: "Premium Articles", value: "500+" },
              { label: "Expert Chefs", value: "50+" },
              { label: "Global Readers", value: "100K+" },
              { label: "Awards Won", value: "25+" },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center group cursor-pointer"
              >
                <div className="text-2xl lg:text-3xl font-bold text-white mb-1 group-hover:text-red-300 transition-colors duration-200">
                  {stat.value}
                </div>
                <div className="text-sm lg:text-base text-white/80 group-hover:text-white/90 transition-colors duration-200">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>

      {/* Scroll Indicator */}
      <div
        className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 ${
          isVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-8 opacity-0"
        }`}
        style={{ transitionDelay: "1000ms" }}
      >
        <div className="flex flex-col items-center space-y-2 text-white/60 hover:text-white/80 transition-colors duration-200 cursor-pointer">
          <span className="text-sm font-medium">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce" />
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-4 h-4 bg-red-400 rounded-full animate-ping opacity-75" />
        <div className="absolute top-40 right-20 w-3 h-3 bg-orange-400 rounded-full animate-ping opacity-75 animation-delay-1000" />
        <div className="absolute bottom-40 left-20 w-2 h-2 bg-yellow-400 rounded-full animate-ping opacity-75 animation-delay-2000" />
      </div>
    </section>
  );
};
