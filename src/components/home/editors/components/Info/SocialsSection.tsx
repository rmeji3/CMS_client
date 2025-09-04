import React from 'react';
import { FaChevronDown } from 'react-icons/fa';


type Props = {
  expanded: boolean;
  toggle: () => void;
  onDirty?: () => void;
  embedded?: boolean;
  email: string;
  phone: string;
  facebook: string;
  onFieldChange: (field: string, value: string) => void;
};


const SocialsSection: React.FC<Props> = ({
  expanded,
  toggle,
  onDirty,
  embedded,
  email,
  phone,
  facebook,
  onFieldChange,
}) => {
  const body = (
    <div className="flex flex-col w-full">
      <label className="font-semibold">Email</label>
      <input
        type="email"
        placeholder="Email"
        className="border border-gray-300 rounded-lg p-2 w-1/2"
        value={email}
        onChange={e => { onFieldChange('email', e.target.value); onDirty?.(); }}
      />
      <label className="font-semibold mt-2">Phone</label>
      <input
        type="tel"
        placeholder="Phone"
        className="border border-gray-300 rounded-lg p-2 w-1/2"
        value={phone}
        onChange={e => { onFieldChange('phone', e.target.value); onDirty?.(); }}
      />
      <label className="font-semibold mt-2">Facebook</label>
      <input
        type="text"
        placeholder="www.facebook.com/yourprofile"
        className="border border-gray-300 rounded-lg p-2 w-1/2"
        value={facebook}
        onChange={e => { onFieldChange('facebook', e.target.value); onDirty?.(); }}
        onBlur={e => {
          const val = e.target.value.trim();
          if (val && !/^https?:\/\//i.test(val)) {
            onFieldChange('facebook', 'https://' + val);
          }
        }}
      />
    </div>
  );

  if (embedded) {
    return body;
  }

  return (
    <div className="w-full border-b border-gray-300 pb-2">
      <div className="flex justify-between items-center cursor-pointer mt-5" onClick={toggle}>
        <h1 className="text-2xl font-semibold">Socials</h1>
        <FaChevronDown className={`transform transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
      </div>
      <div className={`overflow-hidden transition-[max-height] duration-300 ease-in-out`} style={{ maxHeight: expanded ? '500px' : '0px' }}>
        <div className="flex flex-col w-full mt-2">{body}</div>
      </div>
    </div>
  );
};

export default SocialsSection;
