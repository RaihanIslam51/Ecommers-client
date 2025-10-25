import React from 'react';

const StatsCard = ({ title, value, icon, trend, trendValue, color = "blue" }) => {
    const colorClasses = {
        blue: "bg-blue-500",
        green: "bg-green-500",
        purple: "bg-purple-500",
        orange: "bg-orange-500",
        red: "bg-red-500"
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                        {title}
                    </p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">
                        {value}
                    </p>
                    {trend && (
                        <div className="mt-2 flex items-center text-sm">
                            <span className={`font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                {trend === 'up' ? '↑' : '↓'} {trendValue}
                            </span>
                            <span className="ml-2 text-gray-500">from last month</span>
                        </div>
                    )}
                </div>
                <div className={`${colorClasses[color]} p-4 rounded-full text-white text-2xl`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};

export default StatsCard;
