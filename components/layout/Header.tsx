"use client";

import { useState } from "react";
import Link from "next/link";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-surface border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-brand rounded-full flex items-center justify-center">
                <span className="text-brand-fg font-bold text-sm">MH</span>
              </div>
              <span className="text-step-2 font-bold text-brand">
                MastroHUB
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/dashboard"
              className="text-fg hover:text-brand transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/docs"
              className="text-fg hover:text-brand transition-colors"
            >
              Documentation
            </Link>
            <Link
              href="/about"
              className="text-fg hover:text-brand transition-colors"
            >
              About
            </Link>
            <Link
              href="/login"
              className="bg-brand text-brand-fg px-4 py-2 rounded-radius-2 hover:bg-brand/90 transition-colors"
            >
              Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-fg hover:text-brand transition-colors"
              aria-label="Toggle mobile menu"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              data-testid="mobile-menu-toggle"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div
            id="mobile-menu"
            role="menu"
            className="md:hidden border-t border-border"
            data-testid="mobile-menu"
          >
            <div className="py-4 space-y-4">
              <Link
                href="/dashboard"
                className="block text-fg hover:text-brand transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/docs"
                className="block text-fg hover:text-brand transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Documentation
              </Link>
              <Link
                href="/about"
                className="block text-fg hover:text-brand transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/login"
                className="block bg-brand text-brand-fg px-4 py-2 rounded-radius-2 hover:bg-brand/90 transition-colors text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
