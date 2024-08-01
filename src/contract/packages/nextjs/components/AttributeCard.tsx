"use client";

import { useState } from "react";
import { AttributeCardModal } from "./AttributeCardModal";

const filedName: { [key: string]: string } = {
  "0": "Central Data Hab",
};

export const AttributeCard = ({ attributes }: { attributes: any }) => {
  const [selectedAttribute, setSelectedAttribute] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (attribute: any) => {
    setSelectedAttribute(attribute);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedAttribute(null);
    setIsModalOpen(false);
  };
  return (
    <div className="flex flex-col justify-center items-center w-full">
      <div className="flex flex-wrap -mx-2 w-full mt-10">
        {attributes.map((attribute: any, index: any) => (
          <div key={index} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 px-2 mb-4">
            <button
              onClick={() => openModal(attribute)}
              className="w-full text-left max-w-sm rounded overflow-hidden shadow-lg flex flex-col items-start"
            >
              <div className="px-6 py-4">
                <p className="text-gray-700 text-base">
                  <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                    Trait Type
                  </span>{" "}
                  <span className="break-all block">
                    {filedName[attribute.trait_type]}({attribute.trait_type})
                  </span>
                </p>
                <p className="text-gray-700 text-base">
                  <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                    Value
                  </span>{" "}
                  <span className="break-all block">{attribute.value}</span>
                </p>
              </div>
            </button>
          </div>
        ))}
      </div>
      <AttributeCardModal
        isModalOpen={isModalOpen}
        selectedAttribute={selectedAttribute}
        fieldName={filedName[selectedAttribute?.trait_type] || ""}
        closeModal={closeModal}
      />
    </div>
  );
};
