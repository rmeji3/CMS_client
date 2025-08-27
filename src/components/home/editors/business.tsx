import React, { useState } from 'react';
import AboutSection from './components/AboutSection';
import SocialsSection from './components/SocialsSection';
import AddressSection from './components/AddressSection';

type BusinessProps = {
    setUnsavedChanges: (unsaved: boolean) => void;
};

const Business: React.FC<BusinessProps> = ({ setUnsavedChanges }) => {
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        about: false,
        socials: false,
        address: false,
    });
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [resetToken, setResetToken] = useState<number>(0);

    const toggleSection = (section: string) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
        // Do not mark unsaved just for expanding/collapsing
    };

    const markDirty = () => setUnsavedChanges(true);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setSelectedImage(file);
        setPreviewUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return file ? URL.createObjectURL(file) : null;
        });
        setUnsavedChanges(true);
    };

    const clearImage = () => {
        setSelectedImage(null);
        setPreviewUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return null;
        });
        setUnsavedChanges(true);
        // Reset the file input value to allow re-uploading the same file
        const fileInput = document.getElementById('image-upload') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const discardChanges = () => {
        const ok = window.confirm('Are you sure you want to discard all changes?');
        if (!ok) return;
        setExpandedSections({ about: false, socials: false, address: false });
        setSelectedImage(null);
        setPreviewUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return null;
        });
    // Force remount of section components to clear any uncontrolled inputs
    setResetToken((n) => n + 1);
        setUnsavedChanges(false);
    };

    return (
        <div className="flex flex-col items-start gap-3">
            {/* About section */}
            <AboutSection
                key={`about-${resetToken}`}
                expanded={!!expandedSections.about}
                toggle={() => toggleSection('about')}
                selectedImage={selectedImage}
                previewUrl={previewUrl}
                handleImageChange={handleImageChange}
                clearImage={clearImage}
                onDirty={markDirty}
            />

            {/* Socials section */}
            <SocialsSection
                key={`socials-${resetToken}`}
                expanded={!!expandedSections.socials}
                toggle={() => toggleSection('socials')}
                onDirty={markDirty}
            />

            {/* Address section */}
            <AddressSection
                key={`address-${resetToken}`}
                expanded={!!expandedSections.address}
                toggle={() => toggleSection('address')}
                onDirty={markDirty}
            />
            <div className="flex justify-end gap-3 w-full">
                <button
                    onClick={discardChanges}
                    className="mt-3 px-6 py-2 w-[170px] h-[40px] flex justify-center items-center gap-2 font-bold rounded-lg text-white bg-gradient-to-r from-red-500 via-pink-500 to-pink-400 bg-[length:200%_200%] bg-left transition-all duration-700 hover:bg-right shadow-lg disabled:opacity-50 cursor-pointer"
                >
                    Discard
                </button>
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