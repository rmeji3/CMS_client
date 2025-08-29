import React from 'react';
import { RxCross2 } from 'react-icons/rx';
import { FaChevronDown } from 'react-icons/fa';

type Props = {
  expanded: boolean;
  toggle: () => void;
  selectedImage: File | null;
  previewUrl: string | null;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearImage: () => void;
  onDirty?: () => void;
  embedded?: boolean;
};

const AboutSection: React.FC<Props> = ({ expanded, toggle, selectedImage, previewUrl, handleImageChange, clearImage, onDirty, embedded }) => {
  const body = (
    <div className="flex flex-col w-full">
      <label className="font-semibold">Title</label>
      <input
        type="text"
        placeholder="Title"
        className="border border-gray-300 rounded-lg p-2 w-1/2"
        onChange={onDirty}
      />
      <label className="font-semibold mt-2">Description</label>
      <textarea
        placeholder="Description"
        className="border border-gray-300 rounded-lg p-2 w-full h-24 resize-none"
        onChange={onDirty}
      />

      {previewUrl && (
        <div className="relative mt-4 w-1/2">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-auto max-h-64 rounded-lg border border-gray-300 shadow-md object-contain"
          />
          <button
            onClick={clearImage}
            className="absolute top-2 right-2 bg-gray-100 border border-gray-300 shadow-md rounded-full p-1 cursor-pointer"
          >
            <RxCross2 className="text-red-500 w-5 h-5" />
          </button>
        </div>
      )}

      <div className="mt-4">
        <label className="font-semibold">Upload Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="mt-3 px-6 py-2 w-[170px] h-[40px] flex justify-center items-center gap-2 font-bold rounded-lg text-white bg-gradient-to-r from-purple-500 via-blue-500 to-blue-400 bg-[length:200%_200%] bg-left transition-all duration-700 hover:bg-right shadow-lg disabled:opacity-50 cursor-pointer"
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
  );

  if (embedded) {
    return body;
  }

  return (
    <div className="w-full border-b border-gray-300 pb-2">
      <div className="flex justify-between items-center cursor-pointer" onClick={toggle}>
        <h1 className="text-2xl font-semibold">About</h1>
        <FaChevronDown className={`transform transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
      </div>
      <div
        className={`overflow-hidden transition-[max-height] duration-300 ease-in-out`}
        style={{ maxHeight: expanded ? (previewUrl ? '700px' : '500px') : '0px' }}
      >
        <div className="flex flex-col w-full mt-2">{body}</div>
      </div>
    </div>
  );
};

export default AboutSection;
