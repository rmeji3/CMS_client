import React, { useState } from 'react';
import AboutSection from './components/AboutSection';
import SocialsSection from './components/SocialsSection';
import AddressSection from './components/AddressSection';

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
            <AboutSection
                expanded={!!expandedSections.about}
                toggle={() => toggleSection('about')}
                selectedImage={selectedImage}
                previewUrl={previewUrl}
                handleImageChange={handleImageChange}
                clearImage={clearImage}
            />

            {/* Socials section */}
            <SocialsSection
                expanded={!!expandedSections.socials}
                toggle={() => toggleSection('socials')}
            />

            {/* Address section */}
            <AddressSection
                expanded={!!expandedSections.address}
                toggle={() => toggleSection('address')}
            />

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