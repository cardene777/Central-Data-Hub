"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import axios from "axios";
import { useReadContract } from "wagmi";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { DOMAIN_CONTRACT_ADDRESS } from "~~/lib/config";
import domain from "~~/utils/Domains.json";

const AddressPage = () => {
  const { data: deployedContractData } = useDeployedContractInfo("CDH");

  const [metadata, setMetadata] = useState<any>({});

  const searchParams = useSearchParams();
  const tokenId = searchParams.get("index");
  const tba = searchParams.get("tba");

  const params = useParams();
  const { address } = params;

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
    console.log(`metadata: ${JSON.stringify(metadata)}`);
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

    const metadataJson = await fetchJsonFromUrl(metadataUrl);
    console.log(`metadataJson: ${JSON.stringify(metadataJson)}`);
    if (metadataJson) {
      setMetadata(metadataJson);
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
      <Link href="/" className="bg-secondary px-3 py-2 text-white rounded-md text-lg">
        Home
      </Link>
      <div className="flex justify-around items-start w-full">
        <div className="flex flex-col justify-start items-start w-1/2">
          <p className="font-bold text-3xl mb-2 mt-10">CDH #{tokenId}</p>
          <p className="text-gray-700 text-base">
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
              Owner
            </span>{" "}
            <span className="break-all block">{address}</span>
          </p>
          <p className="text-gray-700 text-base">
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
              TBA
            </span>{" "}
            <span className="break-all block">{tba}</span>
          </p>
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
    </div>
  );
};

export default AddressPage;
