import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Tag color utilities
export const getTagColorClasses = (color: string) => {
  return {
    backgroundColor: `${color}20`,
    color: color,
    border: `1px solid ${color}40`,
  };
};

// Aspect ratio constants
export const ASPECT_RATIOS = {
  CARD: "aspect-[16/9]",
  HERO: "aspect-[16/9]",
  AVATAR: "aspect-square",
} as const;

// Image sizes constants
export const IMAGE_SIZES = {
  CARD: "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw",
  FEATURED: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  AVATAR_SM: "32px",
  AVATAR_MD: "40px",
} as const;
