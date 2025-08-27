import React, { useEffect, useState } from 'react';

import Business from './editors/business';
import Carousel from './editors/carousel';

type EditorProps = {
    buttonLabels?: string[];
};
const Editor: React.FC<EditorProps> = ({ buttonLabels = [] }) => {
    const [selectedButton, setSelectedButton] = useState<string>(buttonLabels[0]);
    const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);

    // Broadcast unsaved state to the app (Navbar listens and warns on logout)
    useEffect(() => {
        const evt = new CustomEvent<boolean>('unsaved-changes', { detail: unsavedChanges });
        window.dispatchEvent(evt);
    }, [unsavedChanges]);

    // Warn on refresh/close, back/forward, and internal link navigation when there are unsaved changes
    useEffect(() => {
        if (!unsavedChanges) return;

        const beforeUnloadHandler = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            // Required for Chrome to show the prompt
            e.returnValue = '';
        };

        const popstateHandler = () => {
            const ok = window.confirm('You have unsaved changes. If you leave this page, they will be lost. Continue?');
            if (!ok) {
                // Revert the history change
                window.history.go(1);
            }
        };

        const clickHandler = (e: Event) => {
            const target = (e.target as HTMLElement)?.closest('a');
            if (!target) return;
            const anchor = target as HTMLAnchorElement;
            // Ignore new tab/download/external links
            if (anchor.target === '_blank' || anchor.hasAttribute('download')) return;
            const href = anchor.getAttribute('href');
            if (!href || href.startsWith('#')) return;
            try {
                const url = new URL(href, window.location.href);
                const isSameOrigin = url.origin === window.location.origin;
                if (isSameOrigin) {
                    const ok = window.confirm('You have unsaved changes. If you leave this page, they will be lost. Continue?');
                    if (!ok) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }
            } catch {
                // If URL parsing fails, do nothing
            }
        };

        window.addEventListener('beforeunload', beforeUnloadHandler);
        window.addEventListener('popstate', popstateHandler);
        document.addEventListener('click', clickHandler, true);

        return () => {
            window.removeEventListener('beforeunload', beforeUnloadHandler);
            window.removeEventListener('popstate', popstateHandler);
            document.removeEventListener('click', clickHandler, true);
        };
    }, [unsavedChanges]);

    const handleButtonClick = (button: string) => {
        if (unsavedChanges) {
            const confirmSwitch = window.confirm(
                'You have unsaved changes. If you leave this page, they will be lost. Continue?'
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