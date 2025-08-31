import { ReactNode } from "react";
import { DashboardLayout as DashboardLayoutComponent } from "@/components/layout/BlogLayout";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return <DashboardLayoutComponent>{children}</DashboardLayoutComponent>;
}
