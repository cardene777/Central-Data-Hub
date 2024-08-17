"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { faCheck, faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import { useReadContract } from "wagmi";
import { AttributeCard } from "~~/components/AttributeCard";
import { LinkMetadata } from "~~/components/LinkMetadata";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { DOMAIN_CONTRACT_ADDRESS } from "~~/lib/config";
import domain from "~~/utils/Domains.json";

const AddressPage = () => {
  const { data: deployedContractData } = useDeployedContractInfo("CDH");
  // const { data: sampleERC721ContractData } = useDeployedContractInfo("SampleERC721");
  // const { data: sampleERC1155ContractData } = useDeployedContractInfo("SampleERC1155");

  const [metadata, setMetadata] = useState<any>({});
  const [copiedText, setCopiedText] = useState<{ [key: string]: boolean }>({});

  const searchParams = useSearchParams();
  const tokenId = searchParams.get("index");
  const tba = searchParams.get("tba");

  const params = useParams();
  const { address } = params;

  const handleCopy = (key: string) => {
    toast.success(`${key} copied to clipboard!`);
    setCopiedText(prevState => ({ ...prevState, [key]: true }));
    setTimeout(() => setCopiedText(prevState => ({ ...prevState, [key]: false })), 1500); // 1.5秒後に元に戻す
  };

  const { data, refetch, error } = useReadContract({
    address: deployedContractData?.address,
    functionName: "tokenURI",
    abi: deployedContractData?.abi,
    args: [tokenId],
    chainId: 5555,
    query: {
      enabled: false,
      retry: false,
    },
  });

  const { data: ownDomainName, refetch: getOwnerDomains } = useReadContract({
    address: DOMAIN_CONTRACT_ADDRESS,
    functionName: "getDomainsByOwner",
    abi: domain.abi,
    args: [address],
    chainId: 5555,
    query: {
      enabled: true,
      retry: true,
    },
  });

  const getMetadata = useCallback(async () => {
    const metadata = await refetch();
    const metadataUrl = metadata.data as string;

    const fetchJsonFromUrl = async (url: string) => {
      try {
        const response = await axios.get(url);
        return response.data;
      } catch (e) {
        console.error("Failed to fetch JSON data from URL", e);
        return null;
      }
    };
    if (metadataUrl) {
      const metadataJson = await fetchJsonFromUrl(metadataUrl);
      if (metadataJson) {
        setMetadata(metadataJson);
      }
    }
  }, [refetch]);

  useEffect(() => {
    getMetadata();
    getOwnerDomains();
  }, [deployedContractData, getMetadata, getOwnerDomains, tokenId]);

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  return (
    <div className="px-6 py-4 mt-10">
      <div className="flex justify-between items-start">
        <Link href="/" className="bg-secondary px-3 py-2 text-white rounded-md text-lg">
          Home
        </Link>
        <LinkMetadata preMetadata={metadata} preMetadataId={data as string} />
      </div>
      <div className="flex flex-col justify-center items-center w-full">
        <div className="flex justify-around items-start w-full">
          <div className="flex flex-col justify-start items-start w-1/2">
            <p className="font-bold text-3xl mb-2 mt-10">CDH #{tokenId}</p>
            <div className="text-gray-700 text-base">
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                Owner
              </span>
              <p className="flex items-center justify-center space-x-2">
                <span className="break-all block cursor-pointer">{address}</span>
                <CopyToClipboard text={address as string} onCopy={() => handleCopy("Owner")}>
                  <span className="cursor-pointer">
                    <FontAwesomeIcon icon={copiedText["Owner"] ? faCheck : faCopy} />
                  </span>
                </CopyToClipboard>
              </p>
            </div>
            <div className="text-gray-700 text-base">
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                TBA
              </span>
              <p className="flex items-center justify-center space-x-2">
                <span className="break-all block cursor-pointer">{tba}</span>
                <CopyToClipboard text={tba as string} onCopy={() => handleCopy("TBA")}>
                  <span className="cursor-pointer">
                    <FontAwesomeIcon icon={copiedText["TBA"] ? faCheck : faCopy} />
                  </span>
                </CopyToClipboard>
              </p>
            </div>

            <p className="text-gray-700 text-base">
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                Token URI
              </span>{" "}
              <Link
                target="_blank"
                className="break-all block w-2/3 text-blue-500 underline"
                href={(data as string) ?? ""}
              >
                {(data as string) ?? ""}
              </Link>
            </p>
            <p className="text-gray-700 text-base">
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                DNS
              </span>{" "}
              <span className="break-all block">{ownDomainName as any}</span>
            </p>
          </div>
          <div className="flex flex-col justify-start items-start w-1/2">
            <p className="font-bold text-3xl mb-2 mt-10">{metadata.description}</p>
            {metadata.image && <Image src={metadata.image} alt={metadata.name} width={500} height={500} />}
          </div>
        </div>
        <div className="flex flex-col justify-start items-start w-full mt-10">
          <p className="font-bold text-3xl mb-2 mt-10">TBA Hold NFT</p>
          <div className="flex flex-row justify-start items-start w-full mt-10 space-x-2">
            <div className="relative">
              <Image
                src="https://res.cloudinary.com/dplp5wtzk/image/upload/v1721314823/monster/0.png"
                alt={metadata.name}
                width={200}
                height={200}
              />
              <div className="absolute top-0 right-0 bg-black bg-opacity-30 text-white p-1">SampleERC721</div>
            </div>
            <div className="relative">
              <Image
                src="https://res.cloudinary.com/dplp5wtzk/image/upload/v1721314823/monster/6.png"
                alt={metadata.name}
                width={200}
                height={200}
              />
              <div className="absolute top-0 right-0 bg-black bg-opacity-30 text-white p-1">SampleERC1155</div>
            </div>
            <div className="relative">
              <Image
                src="https://res.cloudinary.com/dplp5wtzk/image/upload/v1721314823/monster/6.png"
                alt={metadata.name}
                width={200}
                height={200}
              />
              <div className="absolute top-0 right-0 bg-black bg-opacity-30 text-white p-1">SampleERC1155</div>
            </div>
          </div>
        </div>
        {metadata.attributes && (
          <div className="flex flex-col justify-start items-start w-full mt-10">
            <p className="font-bold text-3xl mb-2 mt-10">Attribute</p>
            <AttributeCard attributes={metadata.attributes} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressPage;
