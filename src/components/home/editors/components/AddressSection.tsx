import React from 'react';
import { FaChevronDown } from 'react-icons/fa';

type Props = {
  expanded: boolean;
  toggle: () => void;
  onDirty?: () => void;
  embedded?: boolean;
};

const AddressSection: React.FC<Props> = ({ expanded, toggle, onDirty, embedded }) => {
  const body = (
    <div className="flex flex-col w-full">
      <label className="font-semibold">Street</label>
      <input
        type="text"
        placeholder="Street"
        className="border border-gray-300 rounded-lg p-2 w-full"
        onChange={onDirty}
      />
      <div className="flex w-full mt-2">
        <div className="flex flex-col w-1/2">
          <label className="font-semibold">City</label>
          <input
            type="text"
            placeholder="City"
            className="border border-gray-300 rounded-lg p-2 w-full"
            onChange={onDirty}
          />
        </div>
        <div className="flex w-1/2 px-2 gap-2">
          <div className="flex flex-col w-1/2">
            <label className="font-semibold">State</label>
            <input
              type="text"
              placeholder="State"
              className="border border-gray-300 rounded-lg p-2 w-full"
              onChange={onDirty}
            />
          </div>
          <div className="flex flex-col w-1/2">
            <label className="font-semibold">Zip Code</label>
            <input
              type="text"
              placeholder="Zip Code"
              className="border border-gray-300 rounded-lg p-2 w-full"
              onChange={onDirty}
            />
          </div>
        </div>
      </div>
    </div>
  );

  if (embedded) {
    return body;
  }

  return (
    <div className="w-full border-b border-gray-300 pb-2">
      <div className="flex justify-between items-center cursor-pointer mt-5" onClick={toggle}>
        <h1 className="text-2xl font-semibold">Address</h1>
        <FaChevronDown className={`transform transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
      </div>
      <div className={`overflow-hidden transition-[max-height] duration-300 ease-in-out`} style={{ maxHeight: expanded ? '500px' : '0px' }}>
        <div className="flex flex-col w-full mt-2">{body}</div>
      </div>
    </div>
  );
};

export default AddressSection;
