"use client";

import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Sidebar } from "../sidebar/Sidebar";
import { Container } from "../ui/Container";

interface BlogLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
  className?: string;
}

export function BlogLayout({ children, showSidebar = true, className = "" }: BlogLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main role="main" className="relative">
        <Container variant="wide" className={`py-8 ${className}`}>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {children}
            </div>
            
            {/* Sidebar */}
            {showSidebar && (
              <div className="lg:col-span-1">
                <Sidebar />
              </div>
            )}
          </div>
        </Container>
      </main>
      
      <Footer />
    </div>
  );
}

// Specialized layouts for different content types
export function MagazineLayout({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />
      
      <main role="main" className="relative">
        <Container variant="wide" className={`py-12 ${className}`}>
          <div className="max-w-4xl mx-auto">
            {children}
          </div>
        </Container>
      </main>
      
      <Footer />
    </div>
  );
}

export function DashboardLayout({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main role="main" className="relative">
        <Container variant="wide" className={`py-8 ${className}`}>
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </Container>
      </main>
      
      <Footer />
    </div>
  );
}
