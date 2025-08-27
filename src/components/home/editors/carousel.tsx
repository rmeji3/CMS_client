import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import ImageWithDescription from './components/ImageWithDescription';

import { FaPlus } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

type CarouselProps = {
    setUnsavedChanges: (unsaved: boolean) => void;
};

const Carousel: React.FC<CarouselProps> = ({ setUnsavedChanges }) => {
    const [components, setComponents] = useState<{ id: string; hasImage: boolean; description: string }[]>(
        [{ id: uuidv4(), hasImage: false, description: "" }]
    );

    const addComponent = () => {
        if (components.some((component) => !component.hasImage || component.description.trim() === "")) {
            alert("Please upload an image and provide a description for the current component before adding a new one.");
            return;
        }
        setComponents((prev) => [...prev, { id: uuidv4(), hasImage: false, description: "" }]);
        setUnsavedChanges(true);
    };

    const removeComponent = (id: string) => {
        setComponents((prev) => prev.filter((component) => component.id !== id));
        setUnsavedChanges(true);
    };

    const updateHasImage = (id: string, hasImage: boolean) => {
        setComponents((prev) =>
            prev.map((component) =>
                component.id === id ? { ...component, hasImage } : component
            )
        );
        setUnsavedChanges(true);
    };

    const updateDescription = (id: string, description: string) => {
        setComponents((prev) =>
            prev.map((component) =>
                component.id === id ? { ...component, description } : component
            )
        );
        setUnsavedChanges(true);
    };

    const discardChanges = () => {
        const confirmDiscard = window.confirm("Are you sure you want to discard all changes?");
        if (!confirmDiscard) return;
        setComponents([{ id: uuidv4(), hasImage: false, description: "" }]);
        setUnsavedChanges(false);
    };

    return (
        <div className="flex flex-col items-center gap-5 w-full">
            {components.map(({ id }) => (
                <div key={id} className="w-full flex flex-col gap-3">
                    {components.length > 1 && (
                        <div className="flex justify-end">
                            <button
                                onClick={() => removeComponent(id)}
                                className="bg-gray-100 border border-gray-300 shadow-md rounded-full p-1 cursor-pointer"
                            >
                                <RxCross2 className="text-red-500 w-5 h-5" />
                            </button>
                        </div>
                    )}
                    <ImageWithDescription
                        uniqueId={`component-${id}`}
                        onImageChange={(hasImage) => updateHasImage(id, hasImage)}
                        onDescriptionChange={(desc: string) => updateDescription(id, desc)}
                    />
                    <hr className="my-4 border-gray-300" />
                </div>
            ))}

            <div className="flex justify-between w-full items-center">
                <button
                    onClick={addComponent}
                    className="px-6 py-2 w-[40px] h-[40px] flex justify-center items-center gap-2 font-bold rounded-lg text-white bg-gradient-to-r from-purple-500 via-blue-500 to-blue-400 bg-[length:200%_200%] bg-left transition-all duration-700 hover:bg-right shadow-lg disabled:opacity-50 cursor-pointer"
                >
                    <span className="flex items-center justify-center"><FaPlus /></span>
                </button>
                <div className="flex gap-3">
                    <button
                        onClick={discardChanges}
                        className="px-6 py-2 w-[170px] h-[40px] flex justify-center items-center gap-2 font-bold rounded-lg text-white bg-gradient-to-r from-red-500 via-pink-500 to-pink-400 bg-[length:200%_200%] bg-left transition-all duration-700 hover:bg-right shadow-lg disabled:opacity-50 cursor-pointer"
                    >
                        Discard
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 w-[170px] h-[40px] flex justify-center items-center gap-2 font-bold rounded-lg text-white bg-gradient-to-r from-purple-500 via-blue-500 to-blue-400 bg-[length:200%_200%] bg-left transition-all duration-700 hover:bg-right shadow-lg disabled:opacity-50 cursor-pointer"
                    >
                        Apply Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Carousel;