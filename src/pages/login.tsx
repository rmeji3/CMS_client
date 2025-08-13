import {Lock} from 'lucide-react';
const Login: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
             {/* Gradient Circles Background */}
            <div className="absolute top-40 -left-32 w-[400px] h-[400px] bg-gradient-to-br from-purple-500 to-blue-500 rounded-full opacity-40 blur-2xl z-0" />
            <div className="absolute top-20 left-3/4 w-[300px] h-[300px] bg-gradient-to-tr from-blue-400 to-purple-400 rounded-full opacity-30 blur-2xl z-0" />
            <div className="absolute bottom-0 right-0 w-[250px] h-[250px] bg-gradient-to-tl from-purple-300 to-blue-300 rounded-full opacity-20 blur-2xl z-0" />
            {/* login box  */}
            <form className="flex flex-col gap-2 w-[420px] h-[400px] justify-evenly relative z-10 flex flex-col border border-gray-300 p-6 rounded-md drop-shadow-lg bg-gray-100 gap-2 transition-shadow duration-500 ">
             <h1 className = "font-bold flex justify-center  text-[25px]">Login</h1>
             <p className = "flex justify-center text-gray-400">Sign In To Manage</p>
             <p className ="font-bold p-1/.09 "> Email </p>
                <input type="text" placeholder="Username" className=" p-2 text-base border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
                 <p className ="font-bold p-1/.09"> Password </p>
                <input type="password" placeholder="Password" className="p-2 text-base border  border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
              
                    <button type="submit" className="px-6 py-2 flex justify-center items-center gap-2 text-base font-bold rounded text-white bg-gradient-to-r from-purple-500 via-blue-500 to-blue-400 bg-[length:200%_200%] bg-left transition-all duration-700 ease-in-out hover:bg-right shadow-lg cursor-pointer">
                     <span > <Lock className = "h-[20px] w-[20px]"/></span>
                    Sign In 
                    </button>
            </form>
        </div>
    );
};

export default Login;
