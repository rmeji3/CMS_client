import React, { useEffect, useRef, useState } from "react";

type MenuItemProps = {
  uniqueId: string;
  resetToken?: number;
  onImageChange?: (hasImage: boolean) => void;
  onImageFileChange?: (file: File | null) => void;
  onNameChange?: (name: string) => void;
  onPriceChange?: (price: string) => void;
  onDescriptionChange?: (desc: string) => void;
  // Initial values for existing items
  initialName?: string;
  initialPrice?: string;
  initialDescription?: string;
  initialImageUrl?: string;
};

const MenuItem: React.FC<MenuItemProps> = ({
  uniqueId,
  resetToken,
  onImageChange,
  onImageFileChange,
  onNameChange,
  onPriceChange,
  onDescriptionChange,
  initialName = "",
  initialPrice = "",
  initialDescription = "",
  initialImageUrl,
}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImageUrl || null);

  const [name, setName] = useState<string>(initialName);
  const [price, setPrice] = useState<string>(initialPrice);
  const [description, setDescription] = useState<string>(initialDescription);

  const objectUrlRef = useRef<string | null>(null);
  const initializedIdRef = useRef<string | null>(null);
  // Track per-field user edits to stop syncing from props once user changes a field
  const nameDirtyRef = useRef<boolean>(false);
  const priceDirtyRef = useRef<boolean>(false);
  const descDirtyRef = useRef<boolean>(false);
  const imageDirtyRef = useRef<boolean>(false);

  const revokeUrl = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  };

  useEffect(() => {
    return () => revokeUrl();
  }, []);

  // Sync from props until the user edits (per-field dirty flags). Always reset on uniqueId change.
  useEffect(() => {
    const isNewItem = initializedIdRef.current !== uniqueId;
    if (isNewItem) {
      // New item: initialize all fields from props and clear dirty flags
      setName(initialName || "");
      nameDirtyRef.current = false;
      setPrice(initialPrice || "");
      priceDirtyRef.current = false;
      setDescription(initialDescription || "");
      descDirtyRef.current = false;
      revokeUrl();
      setSelectedImage(null);
      setPreviewUrl(initialImageUrl || null);
      imageDirtyRef.current = false;
      initializedIdRef.current = uniqueId;
      return;
    }

    // Existing item: update any field that hasn't been edited yet
    if (!nameDirtyRef.current) {
      const next = initialName || "";
      if (name !== next) setName(next);
    }
    if (!priceDirtyRef.current) {
      const next = initialPrice || "";
      if (price !== next) setPrice(next);
    }
    if (!descDirtyRef.current) {
      const next = initialDescription || "";
      if (description !== next) setDescription(next);
    }
    if (!imageDirtyRef.current && !selectedImage) {
      const next = initialImageUrl || null;
      if (previewUrl !== next) {
        revokeUrl();
        setPreviewUrl(next);
      }
    }
  }, [uniqueId, initialName, initialPrice, initialDescription, initialImageUrl, name, price, description, previewUrl, selectedImage]);

  useEffect(() => {
    if (resetToken === undefined) return;
    setSelectedImage(null);
    setName("");
    setPrice("");
    setDescription("");
    revokeUrl();
    setPreviewUrl(null);
  // Force next effect run to treat as new and clear dirty flags
  initializedIdRef.current = null;
  nameDirtyRef.current = false;
  priceDirtyRef.current = false;
  descDirtyRef.current = false;
  imageDirtyRef.current = false;
  }, [resetToken]);

  const handleImageChange = (file: File | null) => {
    setSelectedImage(file);
    revokeUrl();
    if (file) {
      const url = URL.createObjectURL(file);
      objectUrlRef.current = url;
      setPreviewUrl(url);
      onImageChange?.(true);
      onImageFileChange?.(file);
    } else {
      setPreviewUrl(null);
      onImageChange?.(false);
      onImageFileChange?.(file);
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
          nameDirtyRef.current = true;
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
          priceDirtyRef.current = true;
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
        descDirtyRef.current = true;
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
