// Navigation configuration for MastroHUB Header
export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
}

export interface NavigationSection {
  id: string;
  items: NavigationItem[];
}

export interface HeaderConfig {
  topNavigation: NavigationItem[];
  mainNavigation: NavigationItem[];
  subNavigation: NavigationItem[];
  showWeather?: boolean;
  showSearch?: boolean;
  showLogin?: boolean;
}

// Default navigation configuration
export const defaultHeaderConfig: HeaderConfig = {
  topNavigation: [
    { id: "gastronomy", label: "GASTRONOMY", href: "/gastronomy" },
    { id: "hospitality", label: "HOSPITALITY", href: "/hospitality" },
    { id: "chefs", label: "CHEFS", href: "/chefs" },
    { id: "recipes", label: "RECIPES", href: "/recipes" },
    { id: "trends", label: "TRENDS", href: "/trends" },
  ],
  mainNavigation: [
    { id: "fine-dining", label: "FINE DINING", href: "/fine-dining" },
    { id: "street-food", label: "STREET FOOD", href: "/street-food" },
    { id: "wine-spirits", label: "WINE & SPIRITS", href: "/wine-spirits" },
    { id: "hotels", label: "HOTELS", href: "/hotels" },
    {
      id: "chef-interviews",
      label: "CHEF INTERVIEWS",
      href: "/chef-interviews",
    },
    { id: "food-trends", label: "FOOD TRENDS", href: "/food-trends" },
  ],
  subNavigation: [
    { id: "latest", label: "Latest News", href: "/latest" },
    { id: "featured", label: "Featured", href: "/featured" },
    { id: "exclusive", label: "Exclusive", href: "/exclusive" },
    { id: "podcast", label: "Podcast", href: "/podcast" },
    { id: "video", label: "Video", href: "/video" },
  ],
  showWeather: true,
  showSearch: true,
  showLogin: true,
};

// Utility function to get current weather (placeholder)
export const getCurrentWeather = () => {
  return {
    temperature: "22°C",
    location: "Bratislava",
    icon: "🌤️",
  };
};

// Utility function to get current date
export const getCurrentDate = () => {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
};
