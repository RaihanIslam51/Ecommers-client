import React from 'react';

const TopProducts = () => {
    const products = [
        { name: 'Wireless Headphones', sales: 1234, revenue: '$45,678', image: '🎧' },
        { name: 'Smart Watch', sales: 982, revenue: '$38,920', image: '⌚' },
        { name: 'Laptop Stand', sales: 876, revenue: '$26,280', image: '💻' },
        { name: 'USB-C Cable', sales: 745, revenue: '$14,900', image: '🔌' },
        { name: 'Phone Case', sales: 654, revenue: '$9,810', image: '📱' }
    ];

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Selling Products</h3>
            <div className="space-y-4">
                {products.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="flex items-center gap-4 flex-1">
                            <div className="text-3xl">{product.image}</div>
                            <div className="flex-1">
                                <h4 className="text-sm font-semibold text-gray-800">{product.name}</h4>
                                <p className="text-xs text-gray-500">{product.sales} sales</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-bold text-gray-900">{product.revenue}</p>
                            <p className="text-xs text-green-600">+{(index + 1) * 5}%</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopProducts;
