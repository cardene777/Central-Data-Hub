"use client";

import { useState } from "react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LinkMetadataModal } from "~~/components/Modal/LinkMetadataModal";
import { PreMetadata } from "~~/interfaces/arweave";

export const LinkMetadata = ({ preMetadata }: { preMetadata: PreMetadata }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-secondary px-3 py-2 text-white rounded-md text-lg flex items-center justify-center"
      >
        <FontAwesomeIcon icon={faPlus} className="mr-2 font-semibold" />
        Metadata
      </button>
      <LinkMetadataModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} preMetadata={preMetadata} />
    </>
  );
};
