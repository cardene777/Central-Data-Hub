"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useReadContract } from "wagmi";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";

const AddressPage = () => {
  const { data: deployedContractData } = useDeployedContractInfo("CDH");

  const [metadata, setMetadata] = useState({});

  const searchParams = useSearchParams();
  const tokenId = searchParams.get("index");
  console.log(`tokenId: ${tokenId}`);
  const tba = searchParams.get("tba");

  const params = useParams();
  const { address } = params;

  const { refetch, error } = useReadContract({
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

  const getMetadata = useCallback(async () => {
    const metadata = await refetch();
    const encodedData = await metadata.data;
    const decodeBase64 = (base64: string) => {
      try {
        const base64String = base64.split(",")[1];
        const jsonStr = Buffer.from(base64String, "base64").toString("utf-8");
        return JSON.parse(jsonStr);
      } catch (e) {
        console.error("Failed to decode base64 data", e);
        return null;
      }
    };
    const metadataJson = decodeBase64(encodedData as string);
    console.log(`metadataJson: ${JSON.stringify(metadataJson)}`);
    if (metadataJson) {
      setMetadata(metadataJson);
    }
  }, [refetch]);

  useEffect(() => {
    getMetadata();
  }, [deployedContractData, getMetadata, tokenId]);

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
      <div className="flex justify-around items-center w-full">
        <div className="">
          <div className="font-bold text-3xl mb-2 mt-10">CDH #{tokenId}</div>
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
              CVCDNS
            </span>{" "}
            <span className="break-all block">CrossValueChainDomainNameService ...</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddressPage;
