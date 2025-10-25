import React from 'react';
import StatsCard from './Components/StatsCard';
import SalesChart from './Components/SalesChart';
import RevenueChart from './Components/RevenueChart';
import RecentOrders from './Components/RecentOrders';
import TopProducts from './Components/TopProducts';
import CustomerStats from './Components/CustomerStats';
import ActivityFeed from './Components/ActivityFeed';

const page = () => {
    return (
        <div className="p-4  min-h-screen">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
                <p className="text-gray-600 mt-2">Track your business performance and insights</p>
            </div>

            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard 
                    title="Total Revenue"
                    value="$54,239"
                    icon="💰"
                    trend="up"
                    trendValue="12.5%"
                    color="blue"
                />
                <StatsCard 
                    title="Total Orders"
                    value="2,345"
                    icon="📦"
                    trend="up"
                    trendValue="8.2%"
                    color="green"
                />
                <StatsCard 
                    title="Total Customers"
                    value="1,137"
                    icon="👥"
                    trend="up"
                    trendValue="15.3%"
                    color="purple"
                />
                <StatsCard 
                    title="Avg. Order Value"
                    value="$23.12"
                    icon="📊"
                    trend="down"
                    trendValue="3.1%"
                    color="orange"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <SalesChart />
                <RevenueChart />
            </div>

            {/* Products and Customers Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-1">
                    <TopProducts />
                </div>
                <div className="lg:col-span-1">
                    <CustomerStats />
                </div>
                <div className="lg:col-span-1">
                    <ActivityFeed />
                </div>
            </div>

            {/* Recent Orders Section */}
            <div className="mb-8">
                <RecentOrders />
            </div>
        </div>
    );
};

export default page;