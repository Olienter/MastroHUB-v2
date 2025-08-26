"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { TrendingUp, Users, DollarSign, MoreVertical, Plus } from "lucide-react"

export default function DashboardPage() {
  const [clickCount, setClickCount] = useState(0)

  const handleButtonClick = () => {
    setClickCount(prev => prev + 1)
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-fg">Welcome to MastroHUB</h1>
          <p className="text-fg-muted mt-2">Setup-B Implementation Complete - UI Components Active</p>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <MoreVertical className="h-4 w-4 mr-2" />
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Plus className="mr-2 h-4 w-4" />
              <span>Add New</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <TrendingUp className="mr-2 h-4 w-4" />
              <span>View Reports</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-fg">Total Users</CardTitle>
            <Users className="h-4 w-4 text-fg-muted" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-fg">1,234</div>
            <p className="text-xs text-fg-muted">+20.1% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-fg">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-fg-muted" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-fg">$45,231</div>
            <p className="text-xs text-fg-muted">+180.1% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-fg">Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-fg-muted" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-fg">+573</div>
            <p className="text-xs text-fg-muted">+201 since last hour</p>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Section */}
      <Card>
        <CardHeader>
          <CardTitle>Interactive Demo</CardTitle>
          <CardDescription>Test the Button component and see the click counter</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Button onClick={handleButtonClick} variant="default">
              Click Me!
            </Button>
            <Button variant="outline" onClick={handleButtonClick}>
              Outline Button
            </Button>
            <Button variant="secondary" onClick={handleButtonClick}>
              Secondary
            </Button>
          </div>
          <p className="mt-4 text-sm text-fg-muted">
            Button clicked: <span className="font-semibold text-fg">{clickCount}</span> times
          </p>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-fg-muted">
            Setup-B: Button, Card, and DropdownMenu components are working with token-based styling
          </p>
        </CardFooter>
      </Card>

      {/* Dark Mode Test Instructions */}
      <Card className="bg-surface-subtle border-border-subtle">
        <CardHeader>
          <CardTitle className="text-fg">Dark Mode Test</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-fg-muted text-sm">
            To test dark mode: add <code className="bg-surface px-2 py-1 rounded-radius-1 text-code-fg">class=&quot;dark&quot;</code> to the &lt;html&gt; tag in browser dev tools.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
