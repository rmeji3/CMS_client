import React from 'react';
import Graph from './graph';
import { IoAnalyticsOutline } from "react-icons/io5";

type AnalyticsProps = {
    weeklyViews?: number[];
};

const Analytics: React.FC<AnalyticsProps> = ({ weeklyViews }) => {
    return (
       <div className="p-6 bg-gray-100 rounded-lg shadow-sm border border-gray-300 z-10 mt-5">
            <div className='flex gap-2 items-center mb-5'>
                <span className="text-3xl">{<IoAnalyticsOutline/>}</span>
                <div className="flex items-center justify-between w-full">
                    <h2 className="text-3xl font-semibold">Analytics</h2>
                    <div className="flex items-center justify-center gap-2 bg-gray-200 h-[50px] w-[170px] rounded-lg p-2 text-gray-500 font-semibold">
                        Weekly Views: {weeklyViews?.reduce((a, b) => a + b, 0)}
                    </div>
                </div>
            </div>
            <Graph weeklyViews={weeklyViews} />
        </div>
    );
};

export default Analytics;