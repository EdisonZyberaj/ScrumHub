import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const StatsCard = ({ 
    title, 
    value, 
    subtitle, 
    icon: Icon, 
    trend, 
    trendValue, 
    color = 'blue',
    onClick 
}) => {
    const colorClasses = {
        blue: {
            bg: 'bg-blue-50',
            icon: 'text-blue-500',
            value: 'text-gray-800',
            trend: 'text-blue-600'
        },
        green: {
            bg: 'bg-green-50',
            icon: 'text-green-500',
            value: 'text-gray-800',
            trend: 'text-green-600'
        },
        yellow: {
            bg: 'bg-yellow-50',
            icon: 'text-yellow-500',
            value: 'text-gray-800',
            trend: 'text-yellow-600'
        },
        red: {
            bg: 'bg-red-50',
            icon: 'text-red-500',
            value: 'text-gray-800',
            trend: 'text-red-600'
        },
        purple: {
            bg: 'bg-purple-50',
            icon: 'text-purple-500',
            value: 'text-gray-800',
            trend: 'text-purple-600'
        },
        indigo: {
            bg: 'bg-indigo-50',
            icon: 'text-indigo-500',
            value: 'text-gray-800',
            trend: 'text-indigo-600'
        }
    };

    const colors = colorClasses[color] || colorClasses.blue;

    const getTrendIcon = () => {
        if (trend === 'up') return <TrendingUp className="h-4 w-4" />;
        if (trend === 'down') return <TrendingDown className="h-4 w-4" />;
        return <Minus className="h-4 w-4" />;
    };

    const getTrendColor = () => {
        if (trend === 'up') return 'text-green-600';
        if (trend === 'down') return 'text-red-600';
        return 'text-gray-500';
    };

    return (
        <div 
            className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-200 hover:shadow-md ${onClick ? 'cursor-pointer hover:scale-105' : ''}`}
            onClick={onClick}
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 font-medium text-sm">
                    {title}
                </h3>
                <span className={`p-2 ${colors.bg} rounded-lg`}>
                    <Icon className={`h-5 w-5 ${colors.icon}`} />
                </span>
            </div>

            <p className={`text-3xl font-bold ${colors.value} mb-2`}>
                {value}
            </p>

            {subtitle && (
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                        {subtitle}
                    </span>
                    {(trend && trendValue) && (
                        <div className={`flex items-center text-sm ${getTrendColor()}`}>
                            {getTrendIcon()}
                            <span className="ml-1">{trendValue}</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default StatsCard;