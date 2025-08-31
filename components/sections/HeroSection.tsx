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
  ctaLink,
  backgroundImage,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section
      data-testid="hero"
      role="banner"
      className="relative min-h-[250px] md:min-h-[300px] lg:min-h-[350px] flex items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #dc2626 0%, #1f2937 50%, #374151 100%)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image with enhanced hover effects */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 ease-out"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          transform: isHovered ? "scale(1.05)" : "scale(1)",
        }}
      >
        {/* Fallback gastro gradient using hardcoded colors */}
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            background: 'linear-gradient(135deg, #dc2626 0%, #1f2937 50%, #ea580c 100%)',
          }}
        />
        <div className="absolute inset-0 bg-black/30 transition-opacity duration-500" />
      </div>

      {/* Content with staggered animations */}
      <Container
        variant="no-padding"
        className="relative z-10 text-center text-white"
      >
        <div className="max-w-4xl mx-auto space-y-4 px-4">
          {/* Subtitle with slide-in animation */}
          <div
            className={`inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 transition-all duration-700 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: "0ms" }}
          >
            <span className="text-sm font-medium text-white">{subtitle}</span>
          </div>

          {/* Main Title with fade-in and scale animation */}
          <h1
            className={`font-bold leading-tight transition-all duration-1000 text-white ${
              isVisible
                ? "translate-y-0 opacity-100 scale-100"
                : "translate-y-12 opacity-0 scale-95"
            }`}
            style={{
              transitionDelay: "200ms",
              fontSize: "clamp(2.5rem, 8vw, 4.5rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </h1>

          {/* Description with slide-up animation */}
          <p
            className={`text-white/90 max-w-3xl mx-auto leading-relaxed transition-all duration-700 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
            style={{
              transitionDelay: "400ms",
              fontSize: "clamp(1.125rem, 2.5vw, 1.25rem)",
              fontWeight: 400,
              lineHeight: 1.6,
            }}
          >
            {description}
          </p>

          {/* CTA Button with bounce animation */}
          <div
            className={`pt-4 transition-all duration-700 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: "600ms" }}
          >
            <a href={ctaLink} className="inline-block">
              <Button
                variant="primary"
                size="lg"
                className="transform hover:scale-105 hover:shadow-2xl transition-all duration-300"
                style={{
                  backgroundColor: '#ffffff',
                  color: '#dc2626',
                }}
              >
                {ctaText}
              </Button>
            </a>
          </div>
        </div>
      </Container>

      {/* Enhanced Scroll Indicator with pulse animation */}
      <div
        className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 transition-all duration-1000 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
        style={{ transitionDelay: "800ms" }}
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center group cursor-pointer hover:border-white/80 transition-colors duration-300">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse group-hover:bg-white transition-colors duration-300" />
        </div>
      </div>
    </section>
  );
};
