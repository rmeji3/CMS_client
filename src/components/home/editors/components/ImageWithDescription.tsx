import React, { useEffect, useState } from 'react';

type ImageWithDescriptionProps = {
    uniqueId: string;
    onImageChange: (hasImage: boolean) => void;
    onDescriptionChange: (description: string) => void;
    /**
     * When this token changes, the component clears its internal state.
     */
    resetToken?: number;
};

const ImageWithDescription: React.FC<ImageWithDescriptionProps> = ({ uniqueId, onImageChange, onDescriptionChange, resetToken }) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [description, setDescription] = useState<string>('');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setSelectedImage(file);
        // Revoke previous URL if any to prevent leaks
        setPreviewUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return file ? URL.createObjectURL(file) : null;
        });
        onImageChange(!!file);
    };

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newDescription = event.target.value;
        setDescription(newDescription);
        onDescriptionChange(newDescription);
    };

    // Cleanup object URL on unmount
    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
        // We only care on unmount; do not add previewUrl as dep to avoid revoking new urls
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // External reset: clear internal state and notify parent
    useEffect(() => {
        if (resetToken === undefined) return;
        setSelectedImage(null);
        setPreviewUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return null;
        });
        setDescription('');
        onImageChange(false);
        onDescriptionChange('');
    }, [resetToken]);

    return (
        <div className="flex flex-col items-center gap-4 w-full">
            <div className="flex gap-4 w-full">
                <div className="flex flex-col gap-4 w-1/2">
                    <textarea
                        value={description}
                        onChange={handleDescriptionChange}
                        placeholder="Enter a description..."
                        className="border border-gray-300 rounded-lg h-full w-full"
                        rows={4}
                    />
                    <div className="flex items-center justify-between w-full">
                        <input
                            id={`image-upload-${uniqueId}`}
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                        <label
                            htmlFor={`image-upload-${uniqueId}`}
                            className="px-6 py-2 w-[200px] h-[40px] flex justify-center items-center gap-2 font-bold rounded-lg text-white bg-gradient-to-r from-purple-500 via-blue-500 to-blue-400 bg-[length:200%_200%] bg-left transition-all duration-700 hover:bg-right shadow-lg disabled:opacity-50 cursor-pointer"
                        >
                            <span className="relative z-10">Choose Image</span>
                        </label>
                        {selectedImage && (
                            <div className="mt-2 text-sm text-gray-600">
                                <span className="font-medium">{selectedImage.name}</span>
                                <span className="ml-2">({(selectedImage.size / 1024).toFixed(1)} KB)</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="relative w-1/2">
                    {previewUrl ? (
                        <div className="w-full flex flex-col items-center">
                            <img src={previewUrl} alt="Selected" className=" h-auto max-h-64 rounded-lg border border-gray-300 shadow-md object-contain" />
                        </div>
                    ) : (
                        <div className="w-full h-64 flex w-full items-center justify-center border border-dashed border-gray-300 rounded-lg bg-gray-100">
                            <span className="text-gray-500">No image selected</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageWithDescription;
