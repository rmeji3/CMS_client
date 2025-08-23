import React, { useEffect, useState } from "react";

const Home: React.FC = () => {
    const [email, setEmail] = useState("");

    useEffect(() => {
        const fetchEmail = async () => {
            try {
                const token = localStorage.getItem("accessToken"); // Retrieve the access token from localStorage
                const tokenType = localStorage.getItem("tokenType") || "Bearer"; // Default to Bearer if tokenType is missing

                const response = await fetch("https://localhost:7108/Profile/me", {
                    method: "GET",
                    headers: {
                        "Authorization": `${tokenType} ${token}`,
                        "Content-Type": "application/json",
                    },
                    credentials: "include", // Include cookies if needed
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch email");
                }

                const data = await response.json();
                setEmail(data.email);
            } catch (error) {
                console.error("Error fetching email:", error);
            }
        };

        fetchEmail();
    }, []);

    return (
        <main className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
            <h1 className="text-3xl text-black font-bold mb-4">Welcome to the Home Page</h1>
            <p className="text-lg">Your email: {email}</p>
        </main>
    );
};

export default Home;
