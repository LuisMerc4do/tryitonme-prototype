'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Eye, Users, Package, TrendingUp, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { mockAnalytics } from '@/lib/mock-data';
import { formatTimeAgo } from '@/lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function DashboardPage() {
  const { totalTryOns, successfulTryOns, uniqueUsers, topProducts, chartData, recentActivity } =
    mockAnalytics;

  const successRate = totalTryOns > 0 ? Math.round((successfulTryOns / totalTryOns) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back! Here's your app performance.</p>
            </div>
            <div className="flex gap-3">
              <Link href="/settings">
                <Button>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </Link>
              <Link href="/store">
                <Button variant="outline">View Store</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Try-Ons</CardTitle>
              <Eye className="w-4 h-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTryOns.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-1">All time virtual try-ons</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Success Rate</CardTitle>
              <TrendingUp className="w-4 h-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{successRate}%</div>
              <p className="text-xs text-gray-500 mt-1">
                {successfulTryOns} successful completions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Unique Users</CardTitle>
              <Users className="w-4 h-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uniqueUsers}</div>
              <p className="text-xs text-gray-500 mt-1">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Top Products</CardTitle>
              <Package className="w-4 h-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{topProducts.length}</div>
              <p className="text-xs text-gray-500 mt-1">Products with activity</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Chart */}
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Try-On Activity Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="successful" fill="#6366f1" name="Successful" />
                  <Bar dataKey="failed" fill="#94a3b8" name="Failed" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between pb-3 border-b last:border-0"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.tryOns} try-ons</p>
                    </div>
                    <Badge
                      variant={
                        product.successRate > 90
                          ? 'default'
                          : product.successRate > 80
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {product.successRate}% success
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
                    <div
                      className={`rounded-full p-1 mt-1 ${
                        activity.success ? 'bg-green-100' : 'bg-red-100'
                      }`}
                    >
                      {activity.success ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">Customer {activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.product}</p>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
