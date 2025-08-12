
const Login: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-white">
            <h2 className="text-2xl font-bold mb-6">Login</h2>
            <form className="flex flex-col gap-3 w-72">
                <input type="text" placeholder="Username" className="p-2 text-base border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
                <input type="password" placeholder="Password" className="p-2 text-base border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
                <button type="submit" className="px-6 py-2 text-base rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors mt-2">
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
