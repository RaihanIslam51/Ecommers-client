import React from 'react';
import CustomerAvatar from './CustomerAvatar';

const TopCustomers = () => {
    const topCustomers = [
        {
            id: 1,
            name: 'Ahmed Hassan',
            email: 'ahmed@example.com',
            totalSpent: 12450,
            orders: 45,
            avatar: null
        },
        {
            id: 2,
            name: 'Fatima Rahman',
            email: 'fatima@example.com',
            totalSpent: 10230,
            orders: 38,
            avatar: null
        },
        {
            id: 3,
            name: 'Karim Ali',
            email: 'karim@example.com',
            totalSpent: 9875,
            orders: 32,
            avatar: null
        },
        {
            id: 4,
            name: 'Nadia Islam',
            email: 'nadia@example.com',
            totalSpent: 8640,
            orders: 29,
            avatar: null
        },
        {
            id: 5,
            name: 'Rafiq Khan',
            email: 'rafiq@example.com',
            totalSpent: 7890,
            orders: 25,
            avatar: null
        }
    ];

    return (
        <div className="bg-white border border-gray-200 p-8">
            <h2 className="text-2xl font-light text-black mb-8 tracking-wide">Top Customers</h2>
            
            <div className="space-y-1">
                {topCustomers.map((customer, idx) => (
                    <div
                        key={customer.id}
                        className={`flex items-center justify-between p-6 ${idx !== topCustomers.length - 1 ? 'border-b border-gray-200' : ''} hover:bg-gray-50 transition-colors`}
                    >
                        {/* Customer Info */}
                        <div className="flex items-center gap-4 flex-1">
                            <div className="flex-shrink-0">
                                <CustomerAvatar name={customer.name} image={customer.avatar} size="md" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-light text-black">{customer.name}</h3>
                                <p className="text-xs text-gray-500 font-light">{customer.email}</p>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="hidden sm:flex items-center gap-8 text-right">
                            <div>
                                <p className="text-xs text-gray-500 font-light uppercase tracking-widest">Orders</p>
                                <p className="text-lg font-light text-black">{customer.orders}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-light uppercase tracking-widest">Total Spent</p>
                                <p className="text-lg font-light text-black">${customer.totalSpent.toLocaleString()}</p>
                            </div>
                        </div>

                        {/* Rank Badge */}
                        <div className="ml-4 text-right">
                            <span className="inline-flex items-center justify-center w-8 h-8 bg-black text-white text-xs font-light rounded">
                                #{idx + 1}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* View All Link */}
            <div className="mt-6 pt-6 border-t border-gray-200">
                <button className="text-xs font-light text-black hover:text-gray-600 uppercase tracking-widest transition-colors">
                    View All Top Customers →
                </button>
            </div>
        </div>
    );
};

export default TopCustomers;
