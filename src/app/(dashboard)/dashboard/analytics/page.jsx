'use client';

import React, { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import Swal from 'sweetalert2';
import StatsCard from './Components/StatsCard';
import SalesChart from './Components/SalesChart';
import RevenueChart from './Components/RevenueChart';
import RecentOrders from './Components/RecentOrders';
import TopProducts from './Components/TopProducts';
import CustomerStats from './Components/CustomerStats';
import ActivityFeed from './Components/ActivityFeed';
import { Spinner } from '../Components';


const Page = () => {
    const [loading, setLoading] = useState(true);
    const [analyticsData, setAnalyticsData] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchAnalyticsData();
    }, []);

    const fetchAnalyticsData = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/analytics/stats');
            
            if (response.data.success) {
                setAnalyticsData(response.data.stats);
            }
        } catch (error) {
            console.error('Error fetching analytics data:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to fetch analytics data',
                icon: 'error',
                confirmButtonColor: '#3b82f6'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchAnalyticsData();
        setTimeout(() => setRefreshing(false), 1000);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Spinner size="lg" />
                    <p className="mt-4 text-gray-600">Loading analytics data...</p>
                </div>
            </div>
        );
    }

    if (!analyticsData) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <p className="text-gray-600">No analytics data available</p>
                    <button 
                        onClick={fetchAnalyticsData}
                        className="mt-4 px-4 py-2 border border-gray-200 bg-gray-50 text-black rounded-lg hover:bg-gray-100"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-black antialiased">
            <div className="container mx-auto py-3">
                {/* Page Header */}
                <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center ">
                    <div>
                        <h1 className="text-3xl font-bold text-black">Analytics Dashboard</h1>
                        <p className="text-sm text-gray-600 mt-2">Track your business performance and insights</p>
                    </div>
                    <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="px-4 py-2 border border-gray-200 bg-gray-50 text-black rounded-lg hover:bg-gray-100 disabled:opacity-50 flex items-center gap-2"
                    >
                        <span className={refreshing ? 'animate-spin' : ''}>🔄</span>
                        Refresh
                    </button>
                </div>

            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard 
                    title="Total Revenue"
                    value={`$${analyticsData.totalRevenue.toLocaleString()}`}
                    icon="💰"
                    trend={analyticsData.revenueTrend >= 0 ? "up" : "down"}
                    trendValue={`${Math.abs(analyticsData.revenueTrend)}%`}
                    color="neutral"
                />
                <StatsCard 
                    title="Total Orders"
                    value={analyticsData.totalOrders.toLocaleString()}
                    icon="📦"
                    trend={analyticsData.ordersTrend >= 0 ? "up" : "down"}
                    trendValue={`${Math.abs(analyticsData.ordersTrend)}%`}
                    color="neutral"
                />
                <StatsCard 
                    title="Total Customers"
                    value={analyticsData.totalCustomers.toLocaleString()}
                    icon="👥"
                    trend="up"
                    trendValue="15.3%"
                    color="neutral"
                />
                <StatsCard 
                    title="Avg. Order Value"
                    value={`$${analyticsData.avgOrderValue.toFixed(2)}`}
                    icon="📊"
                    trend={analyticsData.avgOrderValue > 20 ? "up" : "down"}
                    trendValue="3.1%"
                    color="neutral"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <SalesChart data={analyticsData.salesTrend} />
                <RevenueChart data={analyticsData.revenueChartData} />
            </div>

            {/* Products and Customers Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-1">
                    <TopProducts 
                        products={analyticsData.topProducts}
                        categoryData={analyticsData.categoryDistribution}
                    />
                </div>
                <div className="lg:col-span-1">
                    <CustomerStats 
                        segments={analyticsData.customerSegments}
                        statusData={analyticsData.orderStatusDistribution}
                    />
                </div>
                <div className="lg:col-span-1">
                    <ActivityFeed orders={analyticsData.recentOrders} />
                </div>
            </div>

            {/* Recent Orders Section */}
            <div className="mb-8">
                <RecentOrders orders={analyticsData.recentOrders} />
            </div>
            </div>
        </div>
    );
};

export default Page;