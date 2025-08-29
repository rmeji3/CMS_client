import React, { useRef, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import AboutSection from './components/AboutSection';
import SocialsSection from './components/SocialsSection';
import AddressSection from './components/AddressSection';

type InfoProps = {
    setUnsavedChanges: (unsaved: boolean) => void;
};

const Info: React.FC<InfoProps> = ({ setUnsavedChanges }) => {
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        about: false,
        socials: false,
        address: false,
    });
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [resetToken, setResetToken] = useState<number>(0);
    const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({
        about: null,
        socials: null,
        address: null,
    });

    const toggleSection = (section: string) => {
        setExpandedSections((prev) => {
            const willExpand = !prev[section];
            // schedule scroll when expanding
            if (willExpand) {
                setTimeout(() => {
                    sectionRefs.current[section]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 0);
            }
            return {
                ...prev,
                [section]: willExpand,
            };
        });
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
        const fileInput = document.getElementById('image-upload') as HTMLInputElement | null;
        if (fileInput) fileInput.value = '';
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
        setResetToken((n) => n + 1);
        setUnsavedChanges(false);
    };

    return (
        <div className="flex flex-col items-center gap-5 w-full">
            {/* About card */}
            <div
                className="w-full border border-gray-200 rounded-lg shadow-sm bg-white"
                ref={(el: HTMLDivElement | null) => {
                    sectionRefs.current['about'] = el;
                }}
            >
                <button
                    onClick={() => toggleSection('about')}
                    className="w-full flex items-center justify-between px-4 py-3 cursor-pointer"
                >
                    <span className="text-lg font-semibold">About</span>
                    <FaChevronDown className={`transition-transform duration-300 ${expandedSections.about ? 'rotate-180' : 'rotate-0'}`} />
                </button>
                <div
                    className={`overflow-hidden transition-[max-height,opacity,transform] duration-500 ease-in-out ${
                        expandedSections.about ? 'max-h-[3000px] opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-2'
                    }`}
                >
                    <div className="px-4 pb-4">
                        <AboutSection
                            key={`about-${resetToken}`}
                            expanded={!!expandedSections.about}
                            toggle={() => toggleSection('about')}
                            selectedImage={selectedImage}
                            previewUrl={previewUrl}
                            handleImageChange={handleImageChange}
                            clearImage={clearImage}
                            onDirty={markDirty}
                            embedded
                        />
                    </div>
                </div>
            </div>

            {/* Socials card */}
            <div
                className="w-full border border-gray-200 rounded-lg shadow-sm bg-white"
                ref={(el: HTMLDivElement | null) => {
                    sectionRefs.current['socials'] = el;
                }}
            >
                <button
                    onClick={() => toggleSection('socials')}
                    className="w-full flex items-center justify-between px-4 py-3 cursor-pointer"
                >
                    <span className="text-lg font-semibold">Socials</span>
                    <FaChevronDown className={`transition-transform duration-300 ${expandedSections.socials ? 'rotate-180' : 'rotate-0'}`} />
                </button>
                <div
                    className={`overflow-hidden transition-[max-height,opacity,transform] duration-500 ease-in-out ${
                        expandedSections.socials ? 'max-h-[3000px] opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-2'
                    }`}
                >
                    <div className="px-4 pb-4">
                        <SocialsSection
                            key={`socials-${resetToken}`}
                            expanded={!!expandedSections.socials}
                            toggle={() => toggleSection('socials')}
                            onDirty={markDirty}
                            embedded
                        />
                    </div>
                </div>
            </div>

            {/* Address card */}
            <div
                className="w-full border border-gray-200 rounded-lg shadow-sm bg-white"
                ref={(el: HTMLDivElement | null) => {
                    sectionRefs.current['address'] = el;
                }}
            >
                <button
                    onClick={() => toggleSection('address')}
                    className="w-full flex items-center justify-between px-4 py-3 cursor-pointer"
                >
                    <span className="text-lg font-semibold">Address</span>
                    <FaChevronDown className={`transition-transform duration-300 ${expandedSections.address ? 'rotate-180' : 'rotate-0'}`} />
                </button>
                <div
                    className={`overflow-hidden transition-[max-height,opacity,transform] duration-500 ease-in-out ${
                        expandedSections.address ? 'max-h-[3000px] opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-2'
                    }`}
                >
                    <div className="px-4 pb-4">
                        <AddressSection
                            key={`address-${resetToken}`}
                            expanded={!!expandedSections.address}
                            toggle={() => toggleSection('address')}
                            onDirty={markDirty}
                            embedded
                        />
                    </div>
                </div>
            </div>

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

export default Info;