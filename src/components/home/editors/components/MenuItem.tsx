import React, { useEffect, useRef, useState } from "react";

type MenuItemProps = {
  uniqueId: string;
  resetToken?: number;
  onImageChange?: (hasImage: boolean) => void;
  onNameChange?: (name: string) => void;
  onPriceChange?: (price: string) => void;
  onDescriptionChange?: (desc: string) => void;
};

const MenuItem: React.FC<MenuItemProps> = ({
  uniqueId,
  resetToken,
  onImageChange,
  onNameChange,
  onPriceChange,
  onDescriptionChange,
}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const objectUrlRef = useRef<string | null>(null);

  const revokeUrl = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  };

  useEffect(() => {
    return () => revokeUrl();
  }, []);

  useEffect(() => {
    if (resetToken === undefined) return;
    setSelectedImage(null);
    setName("");
    setPrice("");
    setDescription("");
    revokeUrl();
    setPreviewUrl(null);
    onImageChange?.(false);
    onNameChange?.("");
    onPriceChange?.("");
    onDescriptionChange?.("");
  }, [resetToken]);

  const handleImageChange = (file: File | null) => {
    setSelectedImage(file);
    revokeUrl();
    if (file) {
      const url = URL.createObjectURL(file);
      objectUrlRef.current = url;
      setPreviewUrl(url);
      onImageChange?.(true);
    } else {
      setPreviewUrl(null);
      onImageChange?.(false);
    }
  };

  return (
    <div className="w-full flex flex-row gap-4">
        <div className="w-1/2 flex flex-col gap-3">
            <input
                type="text"
                value={name}
                onChange={(e) => {
                    const v = e.target.value;
                    setName(v);
                    onNameChange?.(v);
                }}
                placeholder="Item name"
                className="p-2 border border-gray-300 rounded"
            />
            <input
                type="text"
                value={price}
                onChange={(e) => {
                    const v = e.target.value;
                    setPrice(v);
                    onPriceChange?.(v);
                }}
                placeholder="Price (e.g., 9.99)"
                className="p-2 border border-gray-300 rounded"
            />
            <textarea
                value={description}
                onChange={(e) => {
                const v = e.target.value;
                setDescription(v);
                onDescriptionChange?.(v);
            }}
                placeholder="Item description"
                rows={4}
                className="p-2 border border-gray-300 rounded resize-none"
            />
            {/* Hidden file input and visible button to choose image */}
            <input
                id={`image-upload-${uniqueId}`}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageChange(e.target.files?.[0] ?? null)}
            />
            <label
                htmlFor={`image-upload-${uniqueId}`}
                className="px-6 py-2 w-[200px] h-[40px] flex justify-center items-center gap-2 font-bold rounded-lg text-white bg-gradient-to-r from-purple-500 via-blue-500 to-blue-400 bg-[length:200%_200%] bg-left transition-all duration-700 hover:bg-right shadow-lg disabled:opacity-50 cursor-pointer"
            >
                <span className="relative z-10">Choose Image</span>
            </label>
        </div>

        <div className="w-1/2">
            {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="object-contain max-h-full rounded" />
            ) : (
                <div className="block w-full h-64 border-2 border-dashed border-gray-300 rounded flex items-center justify-center overflow-hidden bg-gray-100">
                    <span className="text-gray-500">No image selected</span>
                </div>
            )}
            {selectedImage && (
            <div className="text-xs text-gray-500 mt-2">
                {selectedImage.name} ({Math.round(selectedImage.size / 1024)} KB)
            </div>
            )}
        </div>
    </div>
  );
};

export default MenuItem;
