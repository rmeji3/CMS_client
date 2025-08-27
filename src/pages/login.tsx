import { useState, useEffect } from "react";
import { FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../services/auth";
import { useFetchProfileQuery } from "../services/profile";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading, error }] = useLoginMutation();
  const { data: profile, isFetching } = useFetchProfileQuery();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isFetching && profile) {
      navigate("/home", { replace: true }); // Redirect if already logged in
    }
  }, [profile, isFetching, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login({ email, password }).unwrap();
      navigate("/home", { replace: true });
  } catch (err: any) {}
  };

  const errorMessage = error && "data" in error ? (error.data as string) : "An error occurred";

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="absolute top-40 -left-32 w-[400px] h-[400px] bg-gradient-to-br from-purple-500 to-blue-500 rounded-full opacity-40 blur-2xl z-0" />
      <div className="absolute top-20 left-3/4 w-[300px] h-[300px] bg-gradient-to-tr from-blue-400 to-purple-400 rounded-full opacity-30 blur-2xl z-0" />
      <div className="absolute bottom-0 right-0 w-[250px] h-[250px] bg-gradient-to-tl from-purple-300 to-blue-300 rounded-full opacity-20 blur-2xl z-0" />

      <form
        onSubmit={handleLogin}
        className="relative z-10 w-[420px] h-[400px] grid content-between border border-gray-300 p-6 rounded-lg drop-shadow-lg bg-gray-100"
      >
        <div>
          <h1 className="font-bold text-center text-[25px]">Login</h1>
          <p className="text-center text-gray-400">Sign In To Manage</p>
        </div>

        {error && <p className="text-red-500 text-center">{errorMessage}</p>}

        <label className="font-bold">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="p-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          autoComplete="username"
        />

        <label className="font-bold">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="p-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          autoComplete="current-password"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="mt-3 px-6 py-2 flex justify-center items-center gap-2 font-bold rounded-lg text-white bg-gradient-to-r from-purple-500 via-blue-500 to-blue-400 bg-[length:200%_200%] bg-left transition-all duration-700 hover:bg-right shadow-lg disabled:opacity-50 cursor-pointer"
        >
          <FaLock className="h-[20px] w-[20px]" />
          {isLoading ? "Signing In..." : "Sign In"}
        </button>
      </form>
    </div>
  );
};

export default Login;
