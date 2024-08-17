import Image from "next/image";
import Link from "next/link";

export const AttributeCardModal = ({
  isModalOpen,
  selectedAttribute,
  fieldName,
  closeModal,
}: {
  isModalOpen: boolean;
  selectedAttribute: any;
  fieldName: string;
  closeModal: () => void;
}) => {
  const isImageUrl = (url: string) => {
    return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url);
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
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left">
                <p className="font-bold text-3xl mb-2">{fieldName}</p>
                <div className="mt-2">
                  <p className="text-gray-700 text-base">
                    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                      Trait Type
                    </span>{" "}
                    <span className="break-all block">{selectedAttribute.trait_type}</span>
                  </p>
                  <p className="text-gray-700 text-base">
                    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                      Value
                    </span>{" "}
                    <Link
                      href={selectedAttribute.value}
                      target="_blank"
                      className="break-all block underline text-blue-500"
                    >
                      {selectedAttribute.value}
                    </Link>
                    {isImageUrl(selectedAttribute.value) ? (
                      <Image
                        src={selectedAttribute.value}
                        alt="Attribute Value"
                        className="mt-2 max-w-full h-auto"
                        width={500}
                        height={500}
                      />
                    ) : (
                      <span className="break-all block">{selectedAttribute.value}</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-secondary text-base font-medium text-white hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-none sm:ml-3 sm:w-auto sm:text-sm"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
