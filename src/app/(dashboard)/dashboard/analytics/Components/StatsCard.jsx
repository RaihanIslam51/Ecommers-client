import React from 'react';

const StatsCard = ({ title, value, icon, trend, trendValue, color = "green" }) => {
    const colorClasses = {
        blue: "bg-linear-to-br from-blue-500 to-blue-600",
        green: "bg-linear-to-br from-green-500 to-emerald-600",
        purple: "bg-linear-to-br from-purple-500 to-purple-600",
        orange: "bg-linear-to-br from-orange-500 to-orange-600",
        red: "bg-linear-to-br from-red-500 to-red-600"
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-200">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                        {title}
                    </p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">
                        {value}
                    </p>
                    {trend && (
                        <div className="mt-2 flex items-center text-sm">
                            <span className={`font-semibold ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                {trend === 'up' ? '↗' : '↘'} {trendValue}
                            </span>
                            <span className="ml-2 text-gray-500">vs last month</span>
                        </div>
                    )}
                </div>
                <div className={`${colorClasses[color]} p-4 rounded-full text-white text-2xl shadow-lg`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};

export default StatsCard;
