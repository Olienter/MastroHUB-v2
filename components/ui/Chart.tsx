import React from "react";
import { cn } from "@/lib/utils";

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
  }[];
}

interface ChartOptions {
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  plugins?: {
    title?: {
      display?: boolean;
      text?: string;
    };
    legend?: {
      display?: boolean;
      position?: "top" | "bottom" | "left" | "right";
    };
  };
}

interface ChartProps {
  type: "line" | "bar" | "pie" | "area" | "doughnut";
  data: ChartData;
  options?: ChartOptions;
  height?: string;
  className?: string;
}

const Chart = React.forwardRef<HTMLDivElement, ChartProps>(
  ({ type, data, options = {}, height = "400px", className }, ref) => {
    // This is a placeholder chart component
    // In a real implementation, you would integrate with a charting library like Chart.js, Recharts, or D3.js

    const defaultOptions: ChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: `${type.charAt(0).toUpperCase() + type.slice(1)} Chart`,
        },
        legend: {
          display: true,
          position: "top",
        },
      },
      ...options,
    };

    const renderChartPlaceholder = () => {
      const { labels, datasets } = data;
      const maxValue = Math.max(...datasets.flatMap((d) => d.data));

      return (
        <div className="space-y-4">
          {/* Chart Title */}
          {defaultOptions.plugins?.title?.display && (
            <h3 className="text-lg font-semibold text-fg text-center">
              {defaultOptions.plugins.title.text}
            </h3>
          )}

          {/* Chart Placeholder */}
          <div className="relative bg-surface border border-border rounded-radius-2 p-4">
            <div className="flex items-end justify-center space-x-2 h-64">
              {labels.map((label, index) => {
                return (
                  <div
                    key={index}
                    className="flex flex-col items-center space-y-2"
                  >
                    <div className="flex space-x-1">
                      {datasets.map((dataset, datasetIndex) => {
                        const value = dataset.data[index] || 0;
                        const height = (value / maxValue) * 100;
                        const color =
                          dataset.backgroundColor ||
                          `hsl(${datasetIndex * 60}, 70%, 50%)`;

                        return (
                          <div
                            key={datasetIndex}
                            className="w-8 bg-surface border border-border"
                            style={{
                              height: `${height}%`,
                              backgroundColor: color,
                            }}
                            title={`${dataset.label}: ${value}`}
                          />
                        );
                      })}
                    </div>
                    <span className="text-xs text-fg-muted text-center w-16">
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          {defaultOptions.plugins?.legend?.display && (
            <div className="flex flex-wrap justify-center gap-4">
              {datasets.map((dataset, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div
                    className="w-4 h-4 rounded-radius-1"
                    style={{
                      backgroundColor:
                        dataset.backgroundColor ||
                        `hsl(${index * 60}, 70%, 50%)`,
                    }}
                  />
                  <span className="text-sm text-fg">{dataset.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    };

    return (
      <div ref={ref} className={cn("w-full", className)} style={{ height }}>
        {renderChartPlaceholder()}

        {/* Development Note */}
        <div className="mt-4 p-3 bg-surface-subtle border border-border-subtle rounded-radius-2">
          <p className="text-xs text-fg-muted text-center">
            Chart component ready for integration with Chart.js, Recharts, or
            D3.js
          </p>
        </div>
      </div>
    );
  }
);

Chart.displayName = "Chart";

export { Chart };
export type { ChartProps, ChartData, ChartOptions };
