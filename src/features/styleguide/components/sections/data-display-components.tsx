'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/components/ui/tabs';
import { Badge } from '@/ui/components/ui/badge';
import { Button } from '@/ui/components/ui/button';
import { Input } from '@/ui/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/components/ui/select';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/ui/components/ui/pagination';
import { Progress } from '@/ui/components/ui/progress';
import { Code, Search, Filter, Download, Eye } from 'lucide-react';
import { Label } from '@/ui/components/ui/label';

// Mock data for tables
const mockData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active', role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Active', role: 'User' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Inactive', role: 'User' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', status: 'Active', role: 'Moderator' },
];

export function DataDisplayComponents() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Data Display Components</h2>
        <p className="text-muted-foreground mb-6">
          Tables, charts, and data visualization components
        </p>
      </div>

      {/* Basic Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Table
          </CardTitle>
          <CardDescription>
            Basic table for displaying structured data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.id}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>
                    <Badge variant={row.status === 'Active' ? 'default' : 'secondary'}>
                      {row.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{row.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Table with Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Table with Search & Filters
          </CardTitle>
          <CardDescription>
            Advanced table with search, filtering, and pagination
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filter Bar */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
          </div>

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.id}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>
                    <Badge variant={row.status === 'Active' ? 'default' : 'secondary'}>
                      {row.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{row.role}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardContent>
      </Card>

      {/* Progress Bars */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Progress
          </CardTitle>
          <CardDescription>
            Visual indicators for progress and completion
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Upload Progress</Label>
              <span className="text-sm text-muted-foreground">75%</span>
            </div>
            <Progress value={75} className="w-full" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Task Completion</Label>
              <span className="text-sm text-muted-foreground">45%</span>
            </div>
            <Progress value={45} className="w-full" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>System Load</Label>
              <span className="text-sm text-muted-foreground">90%</span>
            </div>
            <Progress value={90} className="w-full" />
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Data Organization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Tabs
          </CardTitle>
          <CardDescription>
            Organize content into multiple views
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold">Total Users</h4>
                  <p className="text-2xl font-bold text-blue-600">1,234</p>
                  <p className="text-sm text-muted-foreground">+12% from last month</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold">Active Sessions</h4>
                  <p className="text-2xl font-bold text-green-600">567</p>
                  <p className="text-sm text-muted-foreground">+8% from last month</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold">Revenue</h4>
                  <p className="text-2xl font-bold text-purple-600">$12,345</p>
                  <p className="text-sm text-muted-foreground">+15% from last month</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="analytics" className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Analytics Data</h4>
                <p className="text-muted-foreground">Detailed analytics and metrics will be displayed here.</p>
              </div>
            </TabsContent>
            <TabsContent value="reports" className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Reports</h4>
                <p className="text-muted-foreground">Generated reports and exports will be available here.</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Data Cards */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Data Cards
          </CardTitle>
          <CardDescription>
            Compact cards for displaying key metrics and data points
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-blue-900">$45,231</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">$</span>
                </div>
              </div>
              <p className="text-xs text-blue-600 mt-2">+20.1% from last month</p>
            </div>
            
            <div className="p-4 border rounded-lg bg-gradient-to-br from-green-50 to-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Subscriptions</p>
                  <p className="text-2xl font-bold text-green-900">+2,350</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">↑</span>
                </div>
              </div>
              <p className="text-xs text-green-600 mt-2">+180.1% from last month</p>
            </div>
            
            <div className="p-4 border rounded-lg bg-gradient-to-br from-purple-50 to-purple-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Sales</p>
                  <p className="text-2xl font-bold text-purple-900">+12,234</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">📈</span>
                </div>
              </div>
              <p className="text-xs text-purple-600 mt-2">+19% from last month</p>
            </div>
            
            <div className="p-4 border rounded-lg bg-gradient-to-br from-orange-50 to-orange-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Active Users</p>
                  <p className="text-2xl font-bold text-orange-900">+573</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-orange-600 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">👥</span>
                </div>
              </div>
              <p className="text-xs text-orange-600 mt-2">+201 since last hour</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Table Components */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Advanced Table Components
          </CardTitle>
          <CardDescription>
            Specialized table components for complex data operations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-medium">Data Table with Filters</h4>
            <div className="p-4 border rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">
                The data table system includes specialized components for:
              </p>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li>• <strong>Data Table:</strong> Main table component with sorting and pagination</li>
                <li>• <strong>Column Headers:</strong> Sortable column headers with indicators</li>
                <li>• <strong>Date Filters:</strong> Date range filtering capabilities</li>
                <li>• <strong>Faceted Filters:</strong> Multi-select filtering options</li>
                <li>• <strong>Slider Filters:</strong> Numeric range filtering</li>
                <li>• <strong>Toolbar:</strong> Action buttons and bulk operations</li>
                <li>• <strong>View Options:</strong> Table display customization</li>
                <li>• <strong>Skeleton Loading:</strong> Loading states for table data</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Table Features</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 border rounded-lg">
                <h5 className="font-medium text-sm">Sorting & Filtering</h5>
                <p className="text-xs text-muted-foreground mt-1">
                  Advanced sorting algorithms and flexible filtering options
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <h5 className="font-medium text-sm">Pagination</h5>
                <p className="text-xs text-muted-foreground mt-1">
                  Efficient pagination for large datasets
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <h5 className="font-medium text-sm">Bulk Actions</h5>
                <p className="text-xs text-muted-foreground mt-1">
                  Select multiple rows for batch operations
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <h5 className="font-medium text-sm">Responsive Design</h5>
                <p className="text-xs text-muted-foreground mt-1">
                  Mobile-friendly table layouts
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chart Components */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Chart Components
          </CardTitle>
          <CardDescription>
            Data visualization and charting capabilities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground">
              The chart component provides powerful data visualization capabilities including:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>• <strong>Bar Charts:</strong> Vertical and horizontal bar visualizations</li>
              <li>• <strong>Line Charts:</strong> Trend analysis and time series data</li>
              <li>• <strong>Area Charts:</strong> Filled area visualizations</li>
              <li>• <strong>Pie Charts:</strong> Proportional data representation</li>
              <li>• <strong>Customizable:</strong> Colors, axes, legends, and interactions</li>
              <li>• <strong>Responsive:</strong> Adapts to different screen sizes</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
