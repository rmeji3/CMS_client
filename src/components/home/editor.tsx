import React, { useState } from 'react';

import Business from './editors/business';
import Carousel from './editors/carousel';

type EditorProps = {
    buttonLabels?: string[];
};
const Editor: React.FC<EditorProps> = ({ buttonLabels = [] }) => {
    const [selectedButton, setSelectedButton] = useState<string>(buttonLabels[0]);
    const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);

    const handleButtonClick = (button: string) => {
        if (unsavedChanges) {
            const confirmSwitch = window.confirm(
                "You have unsaved changes. Do you want to discard them and switch?"
            );
            if (!confirmSwitch) return;
            setUnsavedChanges(false);
        }
        setSelectedButton(button);
    };

    return (
        <div className="w-[1000px] flex flex-col z-10 mt-10 items-start gap-3">
            <div className="flex items-center justify-between gap-2 bg-gray-200 h-[50px] rounded-lg p-2">
                {buttonLabels.map((label) => (
                    <button
                        key={label}
                        className={`rounded-lg p-2 cursor-pointer font-semibold ${selectedButton === label ? 'bg-gray-100' : ''} ${selectedButton !== label ? 'text-gray-500' : ''}`}
                        onClick={() => handleButtonClick(label)}
                    >
                        {label}
                    </button>
                ))}
            </div>
            <div className='flex gap-2 items-center mb-5'>
                <div className="bg-gray-100 w-[1000px] rounded-lg shadow-md border border-gray-300 p-5">
                    {selectedButton === 'Carousel' ? (
                        <Carousel setUnsavedChanges={setUnsavedChanges} />
                    ) : (
                        <Business setUnsavedChanges={setUnsavedChanges} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Editor;