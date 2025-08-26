import Image from "next/image";
import { Card, CardHeader, CardContent } from "./components/ui/Card";

export default function Page() {
  return (
    <main className="min-h-screen bg-bg text-fg">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand/10 to-brand/5 p-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="text-step-5 font-bold text-brand mb-4">
              MastroHUB v2
            </h1>
            <p className="text-step-2 text-fg-subtle max-w-2xl mx-auto">
              Advanced AI-powered quality monitoring and development platform
            </p>
          </div>

          {/* Logo placeholder */}
          <div className="flex justify-center mb-8">
            <div className="w-32 h-32 bg-brand/20 rounded-full flex items-center justify-center">
              <span className="text-step-3 font-bold text-brand">MH</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="p-8">
        <div className="container mx-auto max-w-4xl">
          {/* Email Form */}
          <Card className="mb-8">
            <CardHeader>
              <h2 className="text-step-3 font-semibold text-fg">Get Started</h2>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-step-1 font-medium text-fg mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 border border-border rounded-radius-2 bg-bg text-fg focus:outline-none focus:ring-2 focus:ring-focus focus:border-transparent transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-brand text-brand-fg px-6 py-3 rounded-radius-2 font-medium hover:bg-brand/90 transition-colors"
                >
                  Continue
                </button>
              </form>
            </CardContent>
          </Card>

          {/* Feature Grid */}
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            data-testid="feature-grid"
          >
            <Card data-testid="feature-card-ai-powered">
              <CardContent>
                <h3 className="text-step-2 font-semibold text-fg mb-2">
                  AI-Powered
                </h3>
                <p className="text-step-1 text-fg-subtle">
                  Advanced AI algorithms for quality monitoring
                </p>
              </CardContent>
            </Card>
            <Card data-testid="feature-card-real-time">
              <CardContent>
                <h3 className="text-step-2 font-semibold text-fg mb-2">
                  Real-time
                </h3>
                <p className="text-step-1 text-fg-subtle">
                  Instant feedback and monitoring
                </p>
              </CardContent>
            </Card>
            <Card data-testid="feature-card-secure">
              <CardContent>
                <h3 className="text-step-2 font-semibold text-fg mb-2">
                  Secure
                </h3>
                <p className="text-step-1 text-fg-subtle">
                  Enterprise-grade security and compliance
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
