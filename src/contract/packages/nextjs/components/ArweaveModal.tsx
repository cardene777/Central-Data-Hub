import React from "react";
import { uploadMetadata } from "~~/lib/arweave";

interface ModalProps {
  showModal: boolean;
  onClose: () => void;
  name: string;
  setName: (name: string) => void;
  imageUrl: string;
  setImageUrl: (url: string) => void;
}

const ArweaveModal: React.FC<ModalProps> = ({ showModal, onClose, name, setName, imageUrl, setImageUrl }) => {
  const handleSubmit = async () => {
    await uploadMetadata(name, imageUrl);
    onClose();
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg">
        <h2 className="text-xl font-bold mb-4">Register Metadata</h2>
        <span>Name</span>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter Name"
          className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none text-neutral"
        />
        <span>Image URL</span>
        <input
          type="text"
          value={imageUrl}
          onChange={e => setImageUrl(e.target.value)}
          placeholder="Enter Image URL"
          className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none text-neutral"
        />
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

export default ArweaveModal;
