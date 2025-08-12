

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';


const Navbar: React.FC = () => {
    const navigate = useNavigate();
	return (
		<nav className="flex justify-between items-center px-8 py-4 top-0 bg-gray-100">
			<div className="font-bold text-xl">
				<Link to="/" className="no-underline">
					CMS Client
				</Link>
			</div>
			<div className="flex justify-center items-center gap-6">
				<Link to="/" className="no-underline font-medium hover:underline">
					Home
				</Link>
            <button
                className="h-[40px] w-[100px] group relative px-6 py-2 text-base rounded-lg font-semibold text-white z-10 overflow-visible bg-gradient-to-r from-purple-500 via-blue-500 to-blue-400 bg-[length:200%_200%] bg-left transition-all duration-700 ease-in-out hover:bg-right shadow-lg cursor-pointer"
                onClick={() => navigate('/login')}
            >
                <span className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-purple-500 via-blue-500 to-blue-400 opacity-0 blur-2xl pointer-events-none transition-all duration-700 group-hover:opacity-40"></span>
                <span className="relative z-10">Login</span>
                <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500 via-blue-500 to-blue-400 opacity-70 blur-sm transition-all duration-700 ease-in-out group-hover:opacity-100 pointer-events-none"></span>
            </button>
			</div>
		</nav>
	);
};

export default Navbar;
