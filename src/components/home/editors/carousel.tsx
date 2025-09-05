import React, { useState, useRef } from 'react';
import { useFetchCarouselQuery, usePatchCarouselMutation, useUploadCarouselImageMutation } from '../../../services/carousel/carousel';

import ImageWithDescription from './components/carousel/Carousel';
import type { CarouselEntity } from '../../../services/types';

import { RxCross2 } from "react-icons/rx";

type CarouselProps = {
    setUnsavedChanges: (unsaved: boolean) => void;
};

const Carousel: React.FC<CarouselProps> = ({ setUnsavedChanges }) => {
    // Instead of managing separate components state, work directly with carousel data
    const { data: carouselData, isLoading, error, refetch } = useFetchCarouselQuery();
    const [patchCarousel, { isLoading: isPatching }] = usePatchCarouselMutation();
    const [uploadCarouselImage] = useUploadCarouselImageMutation();
    const [patchError, setPatchError] = useState<string | null>(null);
    
    // Track selected files and local descriptions for items
    const selectedFilesRef = useRef<Record<number | string, File | null>>({});
    const localDescriptionsRef = useRef<Record<number | string, string>>({});
    const [resetToken, setResetToken] = useState<number>(0);
    const [deletedItemIds, setDeletedItemIds] = useState<Set<number>>(new Set());

    // Resolve image URLs (same as About section)
    const resolveImageUrl = (url: string | undefined) => {
        if (!url?.trim()) return null;
        if (/^https?:\/\//i.test(url)) return url;
        const HOST = 'https://localhost:7108';
        return `${HOST}${url.startsWith('/') ? '' : '/'}${url}`;
    };

    // Get the items to render (existing + one empty slot for new item)
    const itemsToRender = React.useMemo(() => {
        const existing = carouselData?.items || [];
        // Filter out deleted items and sort by ID to maintain consistent order
        const activeItems = existing
            .filter(item => !deletedItemIds.has(item.id))
            .sort((a, b) => a.id - b.id);
        // Always have one slot at the end for adding a new item
        return [...activeItems, null]; // null represents the "add new" slot
    }, [carouselData, deletedItemIds]);

    const isDirty = () => {
        // Check if we have any selected files, changed descriptions, or deleted items
        const hasFiles = Object.keys(selectedFilesRef.current).length > 0;
        
        const hasChangedDescriptions = Object.entries(localDescriptionsRef.current).some(
            ([itemId, description]) => {
                // Handle new items
                if (itemId === 'new') {
                    // New items with description are always considered changed
                    const isChanged = description.trim() !== '';
                    return isChanged;
                }
                
                // Handle existing items
                const originalItem = carouselData?.items?.find(item => item.id === parseInt(itemId));
                const originalDesc = originalItem?.description || '';
                const isChanged = originalDesc !== description;
                return isChanged;
            }
        );
        const hasDeletedItems = deletedItemIds.size > 0;
        return hasFiles || hasChangedDescriptions || hasDeletedItems;
    };

    const handleFileSelected = (itemId: number | string, file: File | null) => {
        selectedFilesRef.current[itemId] = file;
        // Call isDirty() after the ref is updated
        setTimeout(() => setUnsavedChanges(isDirty()), 0);
    };

    const handleDescriptionChanged = (itemId: number | string, description: string) => {
        localDescriptionsRef.current[itemId] = description;
        // Call isDirty() after the ref is updated
        setTimeout(() => {
            const dirty = isDirty();
            setUnsavedChanges(dirty);
        }, 0);
    };

    const handleDeleteItem = (itemId: number) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this carousel item?");
        if (!confirmDelete) return;
        
        setDeletedItemIds(prev => new Set([...prev, itemId]));
        setUnsavedChanges(true);
    };

    const handleApplyChanges = async () => {
        setPatchError(null);
        try {
            // First, upload all newly selected images to get URLs
            const uploadedUrls: Record<number | string, string> = {};
            
            for (const [itemId, file] of Object.entries(selectedFilesRef.current)) {
                if (file) {
                    const result = await uploadCarouselImage(file).unwrap();
                    uploadedUrls[itemId] = result.imageUrl;
                }
            }
            
            // Build the payload: existing items (excluding deleted) + new items from uploads
            const existingItems = carouselData?.items || [];
            const newItems = [];
            
            // Add existing items that haven't been deleted, with potentially updated descriptions and images
            for (const item of existingItems) {
                if (!deletedItemIds.has(item.id)) {
                    // Check if this item has a new uploaded image
                    const newImageUrl = uploadedUrls[item.id];
                    newItems.push({
                        id: 0, // Let backend assign new IDs
                        imageUrl: newImageUrl || item.imageUrl, // Use new image if uploaded, otherwise keep existing
                        description: localDescriptionsRef.current[item.id] || item.description || '',
                        carouselEntityId: carouselData?.id ?? 0,
                    });
                }
            }
            
            // Add new items from uploads
            for (const [itemId, imageUrl] of Object.entries(uploadedUrls)) {
                // Only add items that were uploaded in the "new" slot
                if (itemId === 'new') {
                    newItems.push({
                        id: 0, // Let backend assign new IDs
                        imageUrl,
                        description: localDescriptionsRef.current['new'] || '', // Use description entered for new item
                        carouselEntityId: carouselData?.id ?? 0,
                    });
                }
            }
            
            const payload: CarouselEntity = {
                id: carouselData?.id ?? 0,
                tenantId: carouselData?.tenantId ?? '',
                items: newItems,
            };
            
            await patchCarousel(payload).unwrap();
            await refetch();
            setUnsavedChanges(false);
            // Clear stored files and descriptions after successful save
            selectedFilesRef.current = {};
            localDescriptionsRef.current = {};
            setDeletedItemIds(new Set());
            // Only reset the "new" slot to clear it for next use
            setResetToken(prev => prev + 1);
            alert('Carousel updated successfully');
        } catch (err: any) {
            setPatchError(err?.message || 'Failed to update carousel');
            console.error('Carousel update failed:', err);
        }
    };

    const discardChanges = () => {
        const confirmDiscard = window.confirm("Are you sure you want to discard all changes?");
        if (!confirmDiscard) return;
        
        selectedFilesRef.current = {};
        localDescriptionsRef.current = {};
        setDeletedItemIds(new Set());
        setResetToken(prev => prev + 1);
        setUnsavedChanges(false);
    };

    return (
        <div className="flex flex-col items-center gap-5 w-full ">
            {isLoading && <div>Loading carousel...</div>}
            {error && <div className="text-red-500">Error loading carousel</div>}
            {patchError && <div className="text-red-500 mt-2">{patchError}</div>}
            <div className="w-full flex justify-start">
                <h1 className="text-2xl font-semibold">Carousel Items</h1>
            </div>
            
            {/* Render existing items + one "add new" slot */}
            {itemsToRender.map((item) => {
                const isNewSlot = item === null;
                const itemId = isNewSlot ? 'new' : item.id;
                // Use stable keys for existing items, but include reset token for new slot only
                const key = isNewSlot ? `new-item-${resetToken}` : `item-${item.id}`;
                
                return (
                    <div key={key} className="w-full flex flex-col gap-3">
                        {!isNewSlot && (carouselData?.items?.length || 0) >= 1 && (
                            <div className="flex justify-end">
                                <button
                                    onClick={() => handleDeleteItem(item.id)}
                                    className="bg-gray-100 border border-gray-300 shadow-md rounded-full p-1 cursor-pointer"
                                >
                                    <RxCross2 className="text-red-500 w-5 h-5" />
                                </button>
                            </div>
                        )}
                        <ImageWithDescription
                            uniqueId={`carousel-${key}`}
                            onImageChange={(_hasImage, file) => handleFileSelected(itemId, file || null)}
                            onDescriptionChange={(desc) => {
                                if (!isNewSlot && item) {
                                    handleDescriptionChanged(item.id, desc);
                                } else {
                                    handleDescriptionChanged('new', desc);
                                }
                            }}
                            resetToken={isNewSlot ? resetToken : undefined}
                            initialImageUrl={isNewSlot ? null : resolveImageUrl(item.imageUrl)}
                            initialDescription={isNewSlot ? '' : (localDescriptionsRef.current[item.id] || item.description || '')}
                        />
                        <hr className="my-4 border-gray-300" />
                    </div>
                );
            })}

            <div className="flex justify-between w-full items-center">
                <div className="text-sm text-gray-500">
                    Add images and descriptions, then click Apply Changes to save.
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={discardChanges}
                        className="px-6 py-2 w-[170px] h-[40px] flex justify-center items-center gap-2 font-bold rounded-lg text-white bg-gradient-to-r from-red-500 via-pink-500 to-pink-400 bg-[length:200%_200%] bg-left transition-all duration-700 hover:bg-right shadow-lg disabled:opacity-50 cursor-pointer"
                    >
                        Discard
                    </button>
                    <button
                        type="button"
                        className="px-6 py-2 w-[170px] h-[40px] flex justify-center items-center gap-2 font-bold rounded-lg text-white bg-gradient-to-r from-purple-500 via-blue-500 to-blue-400 bg-[length:200%_200%] bg-left transition-all duration-700 hover:bg-right shadow-lg disabled:opacity-50 cursor-pointer"
                        onClick={handleApplyChanges}
                        disabled={isPatching}
                    >
                        {isPatching ? 'Saving…' : 'Apply Changes'}
                    </button>
                </div>
            </div>
            {patchError && <div className="text-red-500 mt-2">{patchError}</div>}
        </div>
    );
};

export default Carousel;
