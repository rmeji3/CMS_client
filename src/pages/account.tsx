import React, { useEffect, useState } from "react";

const AccountPage: React.FC = () => {
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [profilePicture, setProfilePicture] = useState("");
    const defaultPfp = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png";
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("accessToken"); // Retrieve the access token from localStorage
                const tokenType = localStorage.getItem("tokenType") || "Bearer"; // Default to Bearer if tokenType is missing

                const response = await fetch("https://localhost:7108/Profile/me", {
                    method: "GET",
                    headers: {
                        "Authorization": `${tokenType} ${token}`,
                        "Content-Type": "application/json",
                    },
                    credentials: "include", // Include cookies
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch user data");
                }

                const data = await response.json();
                setEmail(data.email);
                setFirstName(data.firstName);
                setLastName(data.lastName);
                setProfilePicture(data.profilePicture);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, []);
    return (
        <div style={{ maxWidth: 400, margin: '40px auto', padding: 24, border: '1px solid #eee', borderRadius: 8 }}>
            <h2>Account</h2>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <img
                    src={profilePicture || defaultPfp}
                    alt="Profile"
                    style={{ width: 150, height: 150, borderRadius: '50%', objectFit: 'cover', border: '2px solid #007bff' }}
                />
            </div>
            <div>
                <strong>Name:</strong> {firstName} {lastName}
            </div>
            <div>
                <strong>Email:</strong> {email}
            </div>
            <div style={{ marginTop: 24 }}>
                <button style={{ padding: '8px 16px', borderRadius: 4, border: 'none', background: '#007bff', color: '#fff' }}>
                    Edit Profile
                </button>
            </div>
        </div>
    );
};

export default AccountPage;