
import React, { useEffect, useState } from "react";
import { useFetchProfileQuery } from "../services/profile";
import { MdOutlineAccountCircle } from "react-icons/md";
import { MdLockOutline } from "react-icons/md";

const AccountPage: React.FC = () => {
    const { data, error, refetch: fetchProfile } = useFetchProfileQuery();
    const defaultPfp = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png";
    const [pfp, setPfp] = useState<string>(defaultPfp);
    const [preview, setPreview] = useState<string | null>(null);
    const [fullName, setFullName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [currentPassword, setCurrentPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    useEffect(() => {
        if (data) {
            setFullName(`${data.firstName || ""} ${data.lastName || ""}`.trim());
            setEmail(data.email || "");
        }
    }, [data]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
                setPfp(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-2 md:px-0">
            <div className="absolute top-40 -left-32 w-[400px] h-[400px] bg-gradient-to-br from-purple-500 to-blue-500 rounded-full opacity-40 blur-2xl z-0"  aria-hidden="true" role="presentation"/>
            <div className="absolute top-20 left-3/4 w-[300px] h-[300px] bg-gradient-to-tr from-blue-400 to-purple-400 rounded-full opacity-30 blur-2xl z-0"  aria-hidden="true" role="presentation"/>
            <div className="absolute bottom-0 right-0 w-[250px] h-[250px] bg-gradient-to-tl from-purple-300 to-blue-300 rounded-full opacity-20 blur-2xl z-0" aria-hidden="true" role="presentation"/>

            <div className="max-w-2xl mx-auto relative z-10">
                {/* Profile Information Card */}
                <div className="bg-gray-100 rounded-xl shadow border border-gray-200 p-8 mb-8">
                    <div className ="flex items-center mb-6 gap-2">  
                        <span className="text-3xl">{<MdOutlineAccountCircle />}</span>
                        <h2 className="text-2xl font-semibold">Profile Information</h2>

                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-8 mb-6">
                        <div className="flex flex-col items-center">
                            <img
                                src={pfp}
                                alt="Profile"
                                className="w-24 h-24 rounded-full object-cover border border-gray-300 mb-2"
                            />
                            <button
                                type="button"
                                className="px-3 py-1 bg-gray-100 border border-gray-300 rounded text-sm font-medium hover:bg-gray-200 mb-1"
                                onClick={() => document.getElementById('pfp-upload')?.click()}
                            >
                                Change Photo
                            </button>
                            <input id="pfp-upload" type="file" accept="image/png, image/jpeg, image/gif" className="hidden" onChange={handleImageChange} />
                            <span className="text-xs text-gray-500 mt-1">JPG, PNG or GIF. Max size 2MB.</span>
                        </div>
                        <div className="flex-1 w-full">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                    value={fullName}
                                    onChange={e => setFullName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="mt-3 px-6 py-2 w-[170px] h-[40px] flex justify-center items-center gap-2 font-bold rounded-lg text-white bg-gradient-to-r from-purple-500 via-blue-500 to-blue-400 bg-[length:200%_200%] bg-left transition-all duration-700 hover:bg-right shadow-lg disabled:opacity-50 cursor-pointer"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
                {/* Security Settings Card */}
                <div className="bg-gray-100 rounded-xl shadow border border-gray-200 p-8 mb-8">
                    <div className ="flex items-center mb-6 gap-2">  
                        <span className="text-3xl">{<MdLockOutline  />}</span>
                        <h2 className="text-2xl font-semibold">Security Settings</h2>

                        </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                            <input
                                type="password"
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                value={currentPassword}
                                onChange={e => setCurrentPassword(e.target.value)}
                                placeholder="Enter current password"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                            <input
                                type="password"
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                placeholder="Enter new password"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                            <input
                                type="password"
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="mt-3 px-4 py-2 min-w-[140px] flex justify-center items-center gap-2 font-bold rounded-lg text-white bg-gradient-to-r from-red-500 via-pink-500 to-pink-400 bg-[length:200%_200%] bg-left transition-all duration-700 hover:bg-right shadow-lg disabled:opacity-50 cursor-pointer whitespace-nowrap"
                        >
                            Change Password
                        </button>
                    </div>
                </div>
                {error && <p className="text-red-500">Failed to load profile</p>}
            </div>
        </div>
    );
};

export default AccountPage;