import { useState } from "react";
import { PreMetadata } from "~~/interfaces/arweave";
import { uploadMetadata } from "~~/lib/arweave";

export const LinkMetadataModal = ({
  isModalOpen,
  setIsModalOpen,
  preMetadata,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  preMetadata: PreMetadata;
}) => {
  const [fieldId, setFieldId] = useState("");
  const [link, setLink] = useState<string>("");

  const linkMetadata = async () => {
    await uploadMetadata(preMetadata, fieldId, link);
  };

  if (!isModalOpen) return null;
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="mt-10 flex flex-col justify-center items-center">
            <div className="flex flex-col -mx-2 w-full justify-center items-center">
              <h1 className="text-center text-2xl font-bold mb-4">Link Metadata</h1>
              <input
                type="text"
                value={fieldId}
                onChange={e => setFieldId(e.target.value)}
                placeholder="Enter Field Number"
                className="px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none text-neutral"
              />
              <input
                type="text"
                value={link}
                onChange={e => setLink(e.target.value)}
                placeholder="Enter metadata link"
                className="px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none text-neutral"
              />
              <button
                onClick={linkMetadata}
                className="bg-secondary px-8 py-2 text-white rounded-md text-lg mt-2 font-semibold"
              >
                Register
              </button>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-secondary text-base font-medium text-white hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-none sm:ml-3 sm:w-auto sm:text-sm"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
