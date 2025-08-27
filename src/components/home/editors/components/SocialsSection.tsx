import React from 'react';
import { FaChevronDown } from 'react-icons/fa';

type Props = {
  expanded: boolean;
  toggle: () => void;
  onDirty?: () => void;
};

const SocialsSection: React.FC<Props> = ({ expanded, toggle, onDirty }) => {
  return (
    <div className="w-full border-b border-gray-300 pb-2">
      <div
        className="flex justify-between items-center cursor-pointer mt-5"
        onClick={toggle}
      >
        <h1 className="text-2xl font-semibold">Socials</h1>
        <FaChevronDown
          className={`transform transition-transform duration-300 ${
            expanded ? 'rotate-180' : ''
          }`}
        />
      </div>
      <div
        className={`overflow-hidden transition-[max-height] duration-300 ease-in-out`}
        style={{ maxHeight: expanded ? '500px' : '0px' }}
      >
        <div className="flex flex-col w-full mt-2">
          <label className="font-semibold">Email</label>
          <input
            type="email"
            placeholder="Email"
            className="border border-gray-300 rounded-lg p-2 w-1/2"
            onChange={onDirty}
          />
          <label className="font-semibold mt-2">Phone</label>
          <input
            type="tel"
            placeholder="Phone"
            className="border border-gray-300 rounded-lg p-2 w-1/2"
            onChange={onDirty}
          />
          <label className="font-semibold mt-2">Facebook</label>
          <input
            type="text"
            placeholder="Facebook"
            className="border border-gray-300 rounded-lg p-2 w-1/2"
            onChange={onDirty}
          />
        </div>
      </div>
    </div>
  );
};

export default SocialsSection;
