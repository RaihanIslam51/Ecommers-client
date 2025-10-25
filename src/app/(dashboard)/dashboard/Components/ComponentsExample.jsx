'use client';

import React, { useState } from 'react';
import {
  Button,
  Badge,
  Card,
  Avatar,
  Alert,
  ProgressBar,
  Stat,
  Table,
  IconBox,
  Tooltip,
  Input,
  Spinner,
  Dropdown,
  EmptyState,
} from './index';
import {
  ShoppingCart,
  DollarSign,
  Users,
  Package,
  CheckCircle,
  AlertTriangle,
  Search,
  Plus,
  Download,
  TrendingUp,
} from 'lucide-react';

/**
 * Example usage of all reusable dashboard components
 * This file demonstrates how to use each component
 */
const ComponentsExample = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('today');
  const [searchValue, setSearchValue] = useState('');

  // Dropdown options
  const timeframeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' },
  ];

  // Table data
  const tableColumns = [
    { key: 'id', label: 'Order ID' },
    { key: 'customer', label: 'Customer' },
    { key: 'amount', label: 'Amount' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => {
        const variant = row.status === 'Completed' ? 'success' : 
                       row.status === 'Processing' ? 'info' : 'warning';
        return <Badge variant={variant} dot>{row.status}</Badge>;
      },
    },
  ];

  const tableData = [
    { id: '#12345', customer: 'John Doe', amount: '$299', status: 'Completed' },
    { id: '#12346', customer: 'Jane Smith', amount: '$499', status: 'Processing' },
    { id: '#12347', customer: 'Bob Johnson', amount: '$79', status: 'Pending' },
  ];

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard Components Library</h1>
        <p className="text-gray-600">Reusable components for building modern dashboards</p>
      </div>

      {/* Buttons Section */}
      <Card title="Buttons" subtitle="Different button variants and sizes">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
              Primary
            </Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="success">Success</Button>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button size="xs">Extra Small</Button>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button loading>Loading</Button>
            <Button disabled>Disabled</Button>
            <Button fullWidth>Full Width</Button>
          </div>
        </div>
      </Card>

      {/* Badges Section */}
      <Card title="Badges" subtitle="Status and label indicators">
        <div className="flex flex-wrap gap-3">
          <Badge variant="success" dot>Active</Badge>
          <Badge variant="warning">Pending</Badge>
          <Badge variant="danger">Failed</Badge>
          <Badge variant="info">Processing</Badge>
          <Badge variant="neutral">Draft</Badge>
          <Badge variant="purple">Premium</Badge>
          <Badge variant="pink" icon={<TrendingUp className="w-3 h-3" />}>
            Trending
          </Badge>
        </div>
      </Card>

      {/* Alerts Section */}
      <Card title="Alerts" subtitle="Notification messages">
        <div className="space-y-3">
          <Alert
            type="success"
            title="Success!"
            message="Your changes have been saved successfully."
            icon={<CheckCircle className="w-5 h-5" />}
            dismissible
          />
          <Alert
            type="warning"
            title="Warning"
            message="Low stock alert: 15 products need restock."
            icon={<AlertTriangle className="w-5 h-5" />}
          />
          <Alert
            type="info"
            message="3 pending customer reviews to moderate."
            dismissible
          />
        </div>
      </Card>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat
          title="Total Revenue"
          value="$45,231"
          change="+20.1%"
          trend="up"
          icon={DollarSign}
          color="from-blue-500 to-cyan-500"
          bgColor="from-blue-50 to-cyan-50"
          description="vs last period"
        />
        <Stat
          title="Total Orders"
          value="2,345"
          change="+15.3%"
          trend="up"
          icon={ShoppingCart}
          color="from-purple-500 to-pink-500"
          bgColor="from-purple-50 to-pink-50"
          description="new this month"
        />
        <Stat
          title="Customers"
          value="12,234"
          change="+8.2%"
          trend="up"
          icon={Users}
          color="from-green-500 to-emerald-500"
          bgColor="from-green-50 to-emerald-50"
          description="active users"
        />
        <Stat
          title="Products"
          value="1,234"
          change="-2.4%"
          trend="down"
          icon={Package}
          color="from-orange-500 to-red-500"
          bgColor="from-orange-50 to-red-50"
          description="in stock"
        />
      </div>

      {/* Progress Bars Section */}
      <Card title="Progress Bars" subtitle="Visual progress indicators">
        <div className="space-y-4">
          <ProgressBar value={75} color="blue" showLabel label="Sales Target" />
          <ProgressBar value={60} color="green" showLabel label="Customer Satisfaction" />
          <ProgressBar value={45} color="purple" showLabel label="Marketing Campaign" />
          <ProgressBar value={90} color="orange" showLabel label="Stock Level" />
        </div>
      </Card>

      {/* Avatars Section */}
      <Card title="Avatars" subtitle="User profile images">
        <div className="flex flex-wrap gap-4 items-end">
          <Avatar initials="JD" size="xs" />
          <Avatar initials="JS" size="sm" status="online" />
          <Avatar initials="BJ" size="md" status="away" />
          <Avatar initials="AB" size="lg" status="busy" />
          <Avatar initials="MW" size="xl" status="offline" />
          <Avatar initials="KL" size="lg" shape="square" />
        </div>
      </Card>

      {/* Inputs Section */}
      <Card title="Form Inputs" subtitle="Input fields with icons">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Search Products"
            placeholder="Search..."
            icon={<Search className="w-4 h-4" />}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            fullWidth
          />
          <Dropdown
            label="Select Timeframe"
            options={timeframeOptions}
            value={selectedTimeframe}
            onChange={setSelectedTimeframe}
          />
        </div>
      </Card>

      {/* Table Section */}
      <Card title="Data Table" subtitle="Recent orders overview">
        <Table columns={tableColumns} data={tableData} hoverable />
      </Card>

      {/* Icon Boxes Section */}
      <Card title="Icon Boxes" subtitle="Decorative icon containers">
        <div className="flex flex-wrap gap-4">
          <IconBox
            icon={<ShoppingCart className="w-5 h-5" />}
            size="md"
            color="from-blue-500 to-cyan-500"
            bgColor="from-blue-50 to-cyan-50"
          />
          <IconBox
            icon={<DollarSign className="w-6 h-6" />}
            size="lg"
            color="from-green-500 to-emerald-500"
            bgColor="from-green-50 to-emerald-50"
            shape="circle"
          />
          <IconBox
            icon={<Users className="w-8 h-8" />}
            size="xl"
            color="from-purple-500 to-pink-500"
            bgColor="from-purple-50 to-pink-50"
          />
        </div>
      </Card>

      {/* Tooltips Section */}
      <Card title="Tooltips" subtitle="Hover over buttons to see tooltips">
        <div className="flex flex-wrap gap-3">
          <Tooltip content="Add new product" position="top">
            <Button icon={<Plus className="w-4 h-4" />}>Add Product</Button>
          </Tooltip>
          <Tooltip content="Download report" position="bottom">
            <Button icon={<Download className="w-4 h-4" />} variant="outline">
              Download
            </Button>
          </Tooltip>
        </div>
      </Card>

      {/* Spinner Section */}
      <Card title="Loading Spinners" subtitle="Different spinner sizes and colors">
        <div className="flex flex-wrap gap-6 items-center">
          <Spinner size="xs" color="blue" />
          <Spinner size="sm" color="green" />
          <Spinner size="md" color="purple" />
          <Spinner size="lg" color="red" />
          <Spinner size="xl" color="blue" />
        </div>
      </Card>

      {/* Empty State Section */}
      <Card>
        <EmptyState
          icon={<Package className="w-16 h-16" />}
          title="No products found"
          description="Start by adding your first product to your inventory"
          action={
            <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
              Add Product
            </Button>
          }
        />
      </Card>
    </div>
  );
};

export default ComponentsExample;
