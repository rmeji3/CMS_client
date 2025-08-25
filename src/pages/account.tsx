import React, { useEffect } from "react";
import { useFetchProfileQuery } from "../services/profile";

const AccountPage: React.FC = () => {
    const { data, error, refetch: fetchProfile } = useFetchProfileQuery();
    const defaultPfp = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png";

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    return (
        <div style={{ maxWidth: 400, margin: '40px auto', padding: 24, border: '1px solid #eee', borderRadius: 8 }}>
            <h2>Account</h2>
            {error && <p className="text-red-500">Failed to load profile</p>}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <img
                    src={defaultPfp}
                    alt="Profile"
                    style={{ width: 150, height: 150, borderRadius: '50%', objectFit: 'cover', border: '2px solid #007bff' }}
                />
            </div>
            <div>
                <strong>Name:</strong> {data?.firstName || "N/A"} {data?.lastName || "N/A"}
            </div>
            <div>
                <strong>Email:</strong> {data?.email || "N/A"}
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