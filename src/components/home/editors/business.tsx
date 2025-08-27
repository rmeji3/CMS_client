import React, { useState } from 'react';
import { FaChevronDown } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

const Business: React.FC = () => {
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        about: false,
        socials: false,
        address: false,
    });
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const toggleSection = (section: string) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setSelectedImage(file);
        setPreviewUrl(file ? URL.createObjectURL(file) : null);
    };

    const clearImage = () => {
        setSelectedImage(null);
        setPreviewUrl(null);
        // Reset the file input value to allow re-uploading the same file
        const fileInput = document.getElementById('image-upload') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    };

    return (
        <div className="flex flex-col items-start gap-3">
            {/* About section */}
            <div className="w-full border-b border-gray-300 pb-2">
                <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleSection('about')}
                >
                    <h1 className="text-2xl font-semibold">About</h1>
                    <FaChevronDown
                        className={`transform transition-transform duration-300 ${expandedSections.about ? 'rotate-180' : ''}`}
                    />
                </div>
                <div
                    className={`overflow-hidden transition-[max-height] duration-300 ease-in-out`}
                    style={{ maxHeight: expandedSections.about ? (previewUrl ? '700px' : '500px') : '0px' }}
                >
                    <div className="flex flex-col w-full mt-2">
                        <label className="font-semibold">Title</label>
                        <input type="text" placeholder="Title" className="border border-gray-300 rounded-lg p-2 w-1/2" />
                        <label className="font-semibold mt-2">Description</label>
                        <textarea placeholder="Description" className="border border-gray-300 rounded-lg p-2 w-full h-24" />

                        {/* Image Preview */}
                        {previewUrl && (
                            <div className="relative mt-4 w-1/2">
                                <img 
                                    src={previewUrl} 
                                    alt="Preview" 
                                    className="w-full h-auto max-h-64 rounded-lg border border-gray-300 shadow-md" 
                                />
                                <button
                                    onClick={clearImage}
                                    className="absolute top-2 right-2 bg-gray-100 border border-gray-300 shadow-md rounded-full p-1 cursor-pointer"
                                >
                                    <RxCross2 className="text-red-500 w-5 h-5" />
                                </button>
                            </div>
                        )}

                        {/* Ensure Upload Button and Text Always Visible */}
                        <div className="mt-4">
                            <label className="font-semibold">Upload Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                id="image-upload"
                            />
                            <label
                                htmlFor="image-upload"
                                className="mt-3 px-6 py-2 w-[170px] h-[40px] flex justify-center items-center gap-2 font-bold rounded-lg text-white bg-gradient-to-r from-purple-500 via-blue-500 to-blue-400 bg-[length:200%_200%] bg-left transition-all duration-700 hover:bg-right shadow-lg disabled:opacity-50 cursor-pointer"
                            >
                                <span className="relative z-10">Choose Image</span>
                            </label>

                            {/* Show selected file info (uses selectedImage) */}
                            {selectedImage && (
                                <div className="mt-2 text-sm text-gray-600">
                                    <span className="font-medium">{selectedImage.name}</span>
                                    <span className="ml-2">({(selectedImage.size / 1024).toFixed(1)} KB)</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Socials section */}
            <div className="w-full border-b border-gray-300 pb-2">
                <div
                    className="flex justify-between items-center cursor-pointer mt-5"
                    onClick={() => toggleSection('socials')}
                >
                    <h1 className="text-2xl font-semibold">Socials</h1>
                    <FaChevronDown
                        className={`transform transition-transform duration-300 ${expandedSections.socials ? 'rotate-180' : ''}`}
                    />
                </div>
                <div
                    className={`overflow-hidden transition-[max-height] duration-300 ease-in-out`}
                    style={{ maxHeight: expandedSections.socials ? '500px' : '0px' }}
                >
                    <div className="flex flex-col w-full mt-2">
                        <label className="font-semibold">Email</label>
                        <input type="email" placeholder="Email" className="border border-gray-300 rounded-lg p-2 w-1/2" />
                        <label className="font-semibold mt-2">Phone</label>
                        <input type="tel" placeholder="Phone" className="border border-gray-300 rounded-lg p-2 w-1/2" />
                        <label className="font-semibold mt-2">Facebook</label>
                        <input type="text" placeholder="Facebook" className="border border-gray-300 rounded-lg p-2 w-1/2" />
                    </div>
                </div>
            </div>

            {/* Address section */}
            <div className="w-full border-b border-gray-300 pb-2">
                <div
                    className="flex justify-between items-center cursor-pointer mt-5"
                    onClick={() => toggleSection('address')}
                >
                    <h1 className="text-2xl font-semibold">Address</h1>
                    <FaChevronDown
                        className={`transform transition-transform duration-300 ${expandedSections.address ? 'rotate-180' : ''}`}
                    />
                </div>
                <div
                    className={`overflow-hidden transition-[max-height] duration-300 ease-in-out`}
                    style={{ maxHeight: expandedSections.address ? '500px' : '0px' }}
                >
                    <div className="flex flex-col w-full mt-2">
                        <label className="font-semibold">Street</label>
                        <input type="text" placeholder="Street" className="border border-gray-300 rounded-lg p-2 w-full" />
                        <div className="flex w-full mt-2">
                            <div className="flex flex-col w-1/2">
                                <label className="font-semibold">City</label>
                                <input type="text" placeholder="City" className="border border-gray-300 rounded-lg p-2 w-full" />
                            </div>
                            <div className="flex w-1/2 px-2 gap-2">
                                <div className="flex flex-col w-1/2">
                                    <label className="font-semibold">State</label>
                                    <input type="text" placeholder="State" className="border border-gray-300 rounded-lg p-2 w-full" />
                                </div>
                                <div className="flex flex-col w-1/2">
                                    <label className="font-semibold">Zip Code</label>
                                    <input type="text" placeholder="Zip Code" className="border border-gray-300 rounded-lg p-2 w-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-end w-full">
                <button
                    type="submit"
                    className="mt-3 px-6 py-2 w-[170px] h-[40px] flex justify-center items-center gap-2 font-bold rounded-lg text-white bg-gradient-to-r from-purple-500 via-blue-500 to-blue-400 bg-[length:200%_200%] bg-left transition-all duration-700 hover:bg-right shadow-lg disabled:opacity-50 cursor-pointer"
                >
                    Apply Changes
                </button>
            </div>
        </div>
    );
};

export default Business;