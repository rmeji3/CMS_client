import React from 'react';
import Graph from './graph';
import { IoAnalyticsOutline } from "react-icons/io5";

type AnalyticsProps = {
    weeklyViews?: number[];
};

const Analytics: React.FC<AnalyticsProps> = ({ weeklyViews }) => {
    return (
        <div className="p-6 bg-gray-100 rounded-lg shadow-sm border border-gray-300 z-10 mt-10">
            <div className='flex gap-2 items-center mb-5'>
                <span className="text-3xl">{<IoAnalyticsOutline/>}</span>
                <h2 className="text-3xl font-semibold">Analytics</h2>
            </div>
            <Graph weeklyViews={weeklyViews} />
        </div>
    );
};

export default Analytics;