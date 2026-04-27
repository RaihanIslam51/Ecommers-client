import React from 'react';

const StatsCard = ({ title, value, icon, trend, trendValue, color = "green" }) => {
    return (
        <div className="bg-white p-8 border border-gray-200 hover:border-black transition-colors duration-300">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-xs font-light text-gray-500 uppercase tracking-widest">
                        {title}
                    </p>
                    <p className="mt-4 text-4xl font-light text-black">
                        {value}
                    </p>
                    {trend && (
                        <div className="mt-4 flex items-center gap-2 text-sm">
                            <span className={`font-light ${trend === 'up' ? 'text-black' : 'text-gray-400'}`}>
                                {trend === 'up' ? '↗' : '↘'} {trendValue}
                            </span>
                            <span className="text-gray-400 font-light">vs last month</span>
                        </div>
                    )}
                </div>
                <div className="text-4xl opacity-60">
                    {icon}
                </div>
            </div>
        </div>
    );
};

export default StatsCard;
