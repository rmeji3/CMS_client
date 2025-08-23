import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChartLine, FaNewspaper, FaUtensils } from "react-icons/fa";
import { IoSparkles } from "react-icons/io5";

const Landing: React.FC = () => {
    const features = [
        { title: 'Analytics', description: 'View detailed analytics of your content performance.' },
        { title: 'News', description: 'Update news and announcements easily.' },
        { title: 'Specials', description: 'Manage your specials and promotions effortlessly.' },
        { title: 'Menu', description: 'Edit and update your menu items in real-time.' },
    ];
    const featureIcons = [<FaChartLine />, <FaNewspaper />, <IoSparkles />, <FaUtensils />];

    const navigate = useNavigate();
    return (
        <div className="relative min-h-screen flex flex-col gap-15 justify-center items-center overflow-hidden bg-gray-100 mt-10">
            {/* Gradient Circles Background */}
            <div className="absolute top-40 -left-32 w-[400px] h-[400px] bg-gradient-to-br from-purple-500 to-blue-500 rounded-full opacity-40 blur-2xl z-0"  aria-hidden="true" role="presentation"/>
            <div className="absolute top-20 left-3/4 w-[300px] h-[300px] bg-gradient-to-tr from-blue-400 to-purple-400 rounded-full opacity-30 blur-2xl z-0"  aria-hidden="true" role="presentation"/>
            <div className="absolute bottom-0 right-0 w-[250px] h-[250px] bg-gradient-to-tl from-purple-300 to-blue-300 rounded-full opacity-20 blur-2xl z-0" aria-hidden="true" role="presentation"/>

            {/* Intro */}
            <h1 className="text-4xl font-bold mb-4 z-10">Welcome to CMS</h1>
            <p className="text-lg mb-8 z-10">View analytics and update news, specials, and your menu—all in one elegant CMS.</p>
            <button
                className="h-[50px] w-[200px] group relative px-6 py-2 text-base rounded-lg font-semibold text-white z-1 overflow-visible 
                bg-gradient-to-r from-purple-500 via-blue-500 to-blue-400 bg-[length:200%_200%] bg-left transition-all duration-700 ease-in-out hover:bg-right shadow-lg cursor-pointer"
                onClick={() => navigate('/login')}
            >
                <span className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-purple-500 via-blue-500 to-blue-400 opacity-0 blur-2xl pointer-events-none transition-all duration-700 group-hover:opacity-40"></span>
                <span className="relative z-10">Get Started</span>
                <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500 via-blue-500 to-blue-400 opacity-70 blur-sm transition-all duration-700 ease-in-out group-hover:opacity-100 pointer-events-none"></span>
            </button>

            {/* dashboard picture */}
            <section className='bg-white rounded-md w-[900px] h-[600px] z-10'>
                {/* Placeholder for dashboard picture */}
            </section>

            {/* features cards */}
            <ul className='flex gap-8'>
            {features.map((feature, index) => (
                <li key={index} className="relative group w-[300px]">
                    {/* Glow sits behind the card */}
                    <div className="relative z-10 flex flex-col border border-gray-300 p-6 rounded-md drop-shadow-lg bg-white gap-2 transition-shadow duration-500">
                        <div className='flex items-center gap-3'>
                            <span className="text-2xl">{featureIcons[index]}</span>
                            <h2 className="text-2xl font-semibold">{feature.title}</h2>
                        </div>
                        <p className="text-lg text-gray-600">{feature.description}</p>
                    </div>
                </li>
            ))}
            </ul>

            {/* footer */}
            <footer className='flex flex-col items-center gap-6 mb-20 z-10'>
                <section className="flex flex-col text-center gap-2">
                    <p className='font-bold text-4xl'>Launch your content in minutes</p>
                    <p className='text-xl'>Log in to start managing analytics, news, specials, and menus—all from one place.</p>
                </section>
                <button
                    className="h-[50px] w-[300px] group relative px-6 py-2 text-base rounded-lg font-semibold text-white z-1 overflow-visible 
                    bg-gradient-to-r from-purple-500 via-blue-500 to-blue-400 bg-[length:200%_200%] bg-left transition-all duration-700 ease-in-out hover:bg-right shadow-lg cursor-pointer"
                    onClick={() => navigate('/login')}
                >
                    <span className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-purple-500 via-blue-500 to-blue-400 opacity-0 blur-2xl pointer-events-none transition-all duration-700 group-hover:opacity-40"></span>
                    <span className="relative z-10">Login</span>
                    <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500 via-blue-500 to-blue-400 opacity-70 blur-sm transition-all duration-700 ease-in-out group-hover:opacity-100 pointer-events-none"></span>
                </button>
            </footer>
        </div>
    );
};

export default Landing;