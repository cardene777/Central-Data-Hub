import React from "react";

interface ModalProps {
  showModal: boolean;
  onClose: () => void;
  onSubmit: () => void;
  domainName: string;
  setDomainName: (name: string) => void;
  domainRegisterYear: number;
  setDomainRegisterYear: (year: number) => void;
}

const Modal: React.FC<ModalProps> = ({
  showModal,
  onClose,
  onSubmit,
  domainName,
  setDomainName,
  //   domainRegisterYear,
  //   setDomainRegisterYear,
}) => {
  const handleSubmit = () => {
    onSubmit();
    onClose();
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg">
        <h2 className="text-xl font-bold mb-4">Mint CDN</h2>
        <span>Register Name</span>
        <input
          type="text"
          value={domainName}
          onChange={e => setDomainName(e.target.value)}
          placeholder="Enter Domain Name"
          className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none text-neutral"
        />
        {/* <span>Register Year</span>
        <input
          type="number"
          value={domainRegisterYear}
          onChange={e => setDomainRegisterYear(Number(e.target.value))}
          placeholder="Enter Register Year"
          className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none text-neutral"
        /> */}
        <button
          onClick={handleSubmit}
          className="bg-secondary px-8 py-2 text-white rounded-md text-lg mt-2 font-semibold"
        >
          Register
        </button>

        <button
          onClick={onClose}
          className="bg-gray-500 px-8 py-2 text-white rounded-md text-lg mt-2 font-semibold ml-2"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Modal;
