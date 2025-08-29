import React from "react";
import { Section } from "../../lib/types";

interface SectionsGridProps {
  sections: Section[];
  title?: string;
  subtitle?: string;
}

export const SectionsGrid: React.FC<SectionsGridProps> = ({
  sections,
  title,
  subtitle,
}) => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => (
            <div
              key={section.id}
              className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              {/* Icon */}
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300"
                style={{ backgroundColor: `${section.color}20` }}
              >
                {section.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {section.name}
              </h3>

              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {section.description}
              </p>

              {/* Explore Link */}
              <div className="flex items-center text-blue-600 font-medium text-sm group-hover:text-blue-700 transition-colors">
                <span>Explore {section.name}</span>
                <svg
                  className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
