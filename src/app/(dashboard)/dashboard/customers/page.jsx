'use client';
import React, { useState, useEffect, useMemo } from 'react';
import axiosInstance from '@/lib/axios';
import Swal from 'sweetalert2';
import {
    CustomerStats,
    CustomerTable,
    CustomerFilters,
    CustomerDetailsModal,
    AddCustomerModal,
    CustomerSegments,
    TopCustomers,
    Pagination
} from './Components';

const CustomersPage = () => {
    const [customers, setCustomers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({
        status: 'all',
        search: '',
        sortBy: 'joinedDate'
    });
    const itemsPerPage = 10;

    // Fetch customers and orders from API
    useEffect(() => {
        fetchCustomersAndOrders();
    }, []);

    const fetchCustomersAndOrders = async () => {
        try {
            setLoading(true);
            const [ordersResponse] = await Promise.all([
                axiosInstance.get('/orders')
            ]);

            if (ordersResponse.data && Array.isArray(ordersResponse.data)) {
                setOrders(ordersResponse.data);
                
                // Extract unique customers from orders
                const customerMap = new Map();
                
                ordersResponse.data.forEach(order => {
                    if (order.customerInfo) {
                        const email = order.customerInfo.email;
                        
                        if (!customerMap.has(email)) {
                            customerMap.set(email, {
                                id: email,
                                customerId: `CUST-${(customerMap.size + 1).toString().padStart(3, '0')}`,
                                name: order.customerInfo.name || 'N/A',
                                email: email,
                                phone: order.customerInfo.phone || 'N/A',
                                address: order.customerInfo.address || 'N/A',
                                status: 'active',
                                totalOrders: 0,
                                totalSpent: 0,
                                joinedDate: order.orderDate,
                                lastOrderDate: order.orderDate,
                                avatar: null,
                                orders: []
                            });
                        }
                        
                        const customer = customerMap.get(email);
                        customer.totalOrders += 1;
                        customer.totalSpent += order.totalAmount || 0;
                        customer.orders.push(order);
                        
                        // Update last order date
                        if (new Date(order.orderDate) > new Date(customer.lastOrderDate)) {
                            customer.lastOrderDate = order.orderDate;
                        }
                        
                        // Update joined date (earliest order)
                        if (new Date(order.orderDate) < new Date(customer.joinedDate)) {
                            customer.joinedDate = order.orderDate;
                        }
                    }
                });
                
                // Determine customer status based on activity
                const customers = Array.from(customerMap.values()).map(customer => {
                    const daysSinceLastOrder = Math.floor(
                        (new Date() - new Date(customer.lastOrderDate)) / (1000 * 60 * 60 * 24)
                    );
                    
                    let status = 'active';
                    if (customer.totalSpent > 10000) {
                        status = 'vip';
                    } else if (customer.totalOrders === 1) {
                        status = 'new';
                    } else if (daysSinceLastOrder > 90) {
                        status = 'inactive';
                    }
                    
                    return { ...customer, status };
                });
                
                setCustomers(customers);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to fetch customer data',
                icon: 'error',
                confirmButtonColor: '#3b82f6'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (customer) => {
        setSelectedCustomer(customer);
    };

    const handleEdit = (customer) => {
        console.log('Edit customer:', customer);
        // Add edit logic here
    };

    const handleDelete = async (customer) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete ${customer.name}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            // Since we're deriving customers from orders, we'd need to delete all their orders
            // For now, just show a message
            Swal.fire({
                title: 'Info',
                text: 'Customer data is derived from orders. To remove a customer, delete their orders.',
                icon: 'info',
                confirmButtonColor: '#3b82f6'
            });
        }
    };

    const handleAddCustomer = (formData) => {
        console.log('Add new customer:', formData);
        Swal.fire({
            title: 'Info',
            text: 'Customers are automatically created when orders are placed.',
            icon: 'info',
            confirmButtonColor: '#3b82f6'
        });
    };

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    const handleSearch = (query, searchType = 'all') => {
        setFilters(prev => ({
            ...prev,
            search: query,
            searchType: searchType
        }));
    };

    const handleSort = (sortBy) => {
        setFilters(prev => ({
            ...prev,
            sortBy
        }));
    };

    // Filter and sort customers
    const filteredCustomers = useMemo(() => {
        let filtered = [...customers];

        // Status filter
        if (filters.status !== 'all') {
            filtered = filtered.filter(c => c.status === filters.status);
        }

        // Search filter with type-specific search
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            const searchType = filters.searchType || 'all';
            
            filtered = filtered.filter(c => {
                switch (searchType) {
                    case 'name':
                        return c.name.toLowerCase().includes(searchLower);
                    case 'email':
                        return c.email.toLowerCase().includes(searchLower);
                    case 'phone':
                        return c.phone.toLowerCase().includes(searchLower);
                    case 'all':
                    default:
                        return c.name.toLowerCase().includes(searchLower) ||
                               c.email.toLowerCase().includes(searchLower) ||
                               c.phone.toLowerCase().includes(searchLower) ||
                               c.customerId.toLowerCase().includes(searchLower);
                }
            });
        }

        // Sort
        filtered.sort((a, b) => {
            switch (filters.sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'totalSpent':
                    return b.totalSpent - a.totalSpent;
                case 'totalOrders':
                    return b.totalOrders - a.totalOrders;
                case 'joinedDate':
                default:
                    return new Date(b.joinedDate) - new Date(a.joinedDate);
            }
        });

        return filtered;
    }, [customers, filters]);

    // Calculate stats
    const stats = useMemo(() => {
        return {
            total: customers.length,
            vip: customers.filter(c => c.status === 'vip').length,
            active: customers.filter(c => c.status === 'active').length,
            new: customers.filter(c => c.status === 'new').length,
            inactive: customers.filter(c => c.status === 'inactive').length,
            totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
            averageOrderValue: customers.length > 0 
                ? customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.reduce((sum, c) => sum + c.totalOrders, 0)
                : 0
        };
    }, [customers]);

    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
    const paginatedCustomers = filteredCustomers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-gray-50">
            {/* Page Header */}
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                            Customers Management
                            {loading && (
                                <span className="inline-block animate-spin text-blue-600">⚙️</span>
                            )}
                        </h1>
                        <p className="text-gray-600 mt-2">
                            {loading 
                                ? 'Loading customer data...' 
                                : `Managing ${customers.length} customer${customers.length !== 1 ? 's' : ''}`
                            }
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={fetchCustomersAndOrders}
                            disabled={loading}
                            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className={loading ? 'animate-spin' : ''}>🔄</span>
                            Refresh
                        </button>
                        <button className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2">
                            <span>📊</span>
                            Export
                        </button>
                        <button 
                            onClick={() => setShowAddModal(true)}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <span>➕</span>
                            Add Customer
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="mb-8">
                <CustomerStats stats={stats} loading={loading} />
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Customer Segments - 1 column */}
                <div className="lg:col-span-1">
                    <CustomerSegments customers={customers} loading={loading} />
                </div>

                {/* Top Customers - 2 columns */}
                <div className="lg:col-span-2">
                    <TopCustomers customers={customers.slice(0, 5)} loading={loading} />
                </div>
            </div>

            {/* Filters */}
            <CustomerFilters 
                filters={filters}
                onFilterChange={handleFilterChange}
                onSearch={handleSearch}
                onSort={handleSort}
            />

            {/* Customer Table */}
            <CustomerTable 
                customers={paginatedCustomers}
                loading={loading}
                onViewDetails={handleViewDetails}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                totalItems={filteredCustomers.length}
            />

            {/* Modals */}
            {selectedCustomer && (
                <CustomerDetailsModal
                    customer={selectedCustomer}
                    onClose={() => setSelectedCustomer(null)}
                />
            )}

            {showAddModal && (
                <AddCustomerModal
                    onClose={() => setShowAddModal(false)}
                    onSubmit={handleAddCustomer}
                />
            )}
        </div>
    );
};

export default CustomersPage;