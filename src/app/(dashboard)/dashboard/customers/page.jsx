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
    Pagination,
    SendEmailModal
} from './Components';

const CustomersPage = () => {
    const [customers, setCustomers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [selectedCustomers, setSelectedCustomers] = useState([]);
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

            // Server returns: { success: true, message: "...", orders: [...] }
            if (ordersResponse.data && ordersResponse.data.orders) {
                const ordersData = ordersResponse.data.orders;
                setOrders(ordersData);
                
                // Extract unique customers from orders
                const customerMap = new Map();
                
                ordersData.forEach(order => {
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

    // Handle customer selection
    const handleSelectCustomer = (email) => {
        setSelectedCustomers(prev => {
            if (prev.includes(email)) {
                return prev.filter(e => e !== email);
            } else {
                return [...prev, email];
            }
        });
    };

    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedCustomers(paginatedCustomers.map(c => c.email));
        } else {
            setSelectedCustomers([]);
        }
    };

    const handleSendEmail = () => {
        if (selectedCustomers.length === 0) {
            Swal.fire({
                title: 'No Customers Selected',
                text: 'Please select at least one customer to send email',
                icon: 'warning',
                confirmButtonColor: '#3b82f6'
            });
            return;
        }
        setShowEmailModal(true);
    };

    const handleSendToAll = () => {
        const allEmails = filteredCustomers.map(c => c.email);
        setSelectedCustomers(allEmails);
        setShowEmailModal(true);
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
        <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-white text-black">
            {/* Page Header */}
            <div className="mb-12">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-4xl lg:text-5xl font-light text-black mb-3 tracking-tight flex items-center gap-3">
                            Customers Management
                            {loading && (
                                <span className="inline-block animate-spin text-black">⚙️</span>
                            )}
                        </h1>
                        <p className="text-gray-600 font-light">
                            {loading 
                                ? 'Loading customer data...' 
                                : `Managing ${customers.length} customer${customers.length !== 1 ? 's' : ''}`
                            }
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={fetchCustomersAndOrders}
                            disabled={loading}
                            className="px-6 py-3 bg-white border border-gray-200 text-black hover:border-black hover:bg-black hover:text-white transition-all font-light flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className={loading ? 'animate-spin' : ''}>🔄</span>
                            Refresh
                        </button>
                        <button 
                            onClick={handleSendToAll}
                            disabled={loading || customers.length === 0}
                            className="px-6 py-3 bg-white border border-gray-200 text-black hover:border-black hover:bg-black hover:text-white transition-all font-light flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span>📧</span>
                            Email All
                        </button>
                        <button 
                            onClick={handleSendEmail}
                            disabled={loading || selectedCustomers.length === 0}
                            className="px-6 py-3 bg-black text-white hover:bg-gray-900 transition-all font-light flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed relative"
                        >
                            <span>📤</span>
                            Send Email
                            {selectedCustomers.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-6 h-6 flex items-center justify-center font-light border border-white">
                                    {selectedCustomers.length}
                                </span>
                            )}
                        </button>
                        <button className="px-6 py-3 bg-white border border-gray-200 text-black hover:border-black hover:bg-black hover:text-white transition-all font-light flex items-center gap-2">
                            <span>📊</span>
                            Export
                        </button>
                        <button 
                            onClick={() => setShowAddModal(true)}
                            className="px-6 py-3 bg-black text-white hover:bg-gray-900 transition-all font-light flex items-center gap-2"
                        >
                            <span>➕</span>
                            Add Customer
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="mb-12">
                <CustomerStats stats={stats} loading={loading} />
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
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

            {/* Selection Info */}
            {selectedCustomers.length > 0 && (
                <div className="bg-white border border-gray-200 p-6 mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="text-2xl opacity-60">✅</span>
                        <div>
                            <p className="font-light text-black">
                                {selectedCustomers.length} customer{selectedCustomers.length > 1 ? 's' : ''} selected
                            </p>
                            <p className="text-sm text-gray-600 font-light">
                                Ready to send email to selected customers
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleSendEmail}
                            className="px-6 py-3 bg-black text-white hover:bg-gray-900 transition-all font-light flex items-center gap-2"
                        >
                            <span>📤</span>
                            Send Email
                        </button>
                        <button
                            onClick={() => setSelectedCustomers([])}
                            className="px-6 py-3 bg-white border border-gray-200 text-black hover:border-black hover:bg-black hover:text-white transition-all font-light"
                        >
                            Clear Selection
                        </button>
                    </div>
                </div>
            )}

            {/* Customer Table */}
            <CustomerTable 
                customers={paginatedCustomers}
                loading={loading}
                onViewDetails={handleViewDetails}
                onEdit={handleEdit}
                onDelete={handleDelete}
                selectedCustomers={selectedCustomers}
                onSelectCustomer={handleSelectCustomer}
                onSelectAll={handleSelectAll}
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

            {showEmailModal && (
                <SendEmailModal
                    onClose={() => {
                        setShowEmailModal(false);
                        setSelectedCustomers([]);
                    }}
                    recipients={selectedCustomers}
                    recipientNames={selectedCustomers.map(email => {
                        const customer = customers.find(c => c.email === email);
                        return customer ? customer.name : email;
                    })}
                />
            )}
        </div>
    );
};

export default CustomersPage;