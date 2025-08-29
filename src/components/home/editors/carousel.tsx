import React, { useState, useRef } from 'react';
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
    const [resetToken, setResetToken] = useState<number>(0);
    const lastComponentRef = useRef<HTMLDivElement | null>(null);
    const isResettingRef = useRef<boolean>(false);

    const isDirty = (items: { id: string; hasImage: boolean; description: string }[]) => {
        if (!items || items.length === 0) return false;
        if (items.length > 1) return true;
        const only = items[0];
        return !!only.hasImage || (only.description?.trim().length ?? 0) > 0;
    };

    const addComponent = () => {
        if (components.some((component) => !component.hasImage)) {
            alert("Please upload an image for the current component before adding a new one.");
            return;
        }
        setComponents((prev) => {
            const newComponents = [...prev, { id: uuidv4(), hasImage: false, description: "" }];
            setTimeout(() => {
                lastComponentRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 0);
            if (!isResettingRef.current) setUnsavedChanges(isDirty(newComponents));
            return newComponents;
        });
    };

    const removeComponent = (id: string) => {
        setComponents((prev) => {
            const newComponents = prev.filter((component) => component.id !== id);
            if (!isResettingRef.current) setUnsavedChanges(isDirty(newComponents));
            return newComponents;
        });
    };

    const updateHasImage = (id: string, hasImage: boolean) => {
        setComponents((prev) => {
            const newComponents = prev.map((component) =>
                component.id === id ? { ...component, hasImage } : component
            );
            if (!isResettingRef.current) setUnsavedChanges(isDirty(newComponents));
            return newComponents;
        });
    };

    const updateDescription = (id: string, description: string) => {
        setComponents((prev) => {
            const newComponents = prev.map((component) =>
                component.id === id ? { ...component, description } : component
            );
            if (!isResettingRef.current) setUnsavedChanges(isDirty(newComponents));
            return newComponents;
        });
    };

    const discardChanges = () => {
        const confirmDiscard = window.confirm("Are you sure you want to discard all changes?");
        if (!confirmDiscard) return;
        isResettingRef.current = true;
    // Reset children inputs and previews
    setResetToken((n) => n + 1);
    // Reset the list to a single fresh component
    setComponents([{ id: uuidv4(), hasImage: false, description: "" }]);
        setUnsavedChanges(false);
        // Allow child callbacks again on next tick
        setTimeout(() => {
            isResettingRef.current = false;
        }, 0);
    };

    return (
        <div className="flex flex-col items-center gap-5 w-full ">
            <div className="w-full flex justify-start">
                <h1 className="text-2xl font-semibold">Carousel Items</h1>
            </div>
            {components.map(({ id }, index) => (
                <div
                    key={id}
                    ref={index === components.length - 1 ? lastComponentRef : null}
                    className="w-full flex flex-col gap-3"
                >
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
                        resetToken={resetToken}
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