"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useReadContract, useWriteContract } from "wagmi";
import ArweaveModal from "~~/components/ArweaveModal";
import CDNModal from "~~/components/CDNModal";
import { useTransactor } from "~~/hooks/scaffold-eth";
import { uploadMetadata } from "~~/lib/arweave";
import { DOMAIN_CONTRACT_ADDRESS } from "~~/lib/config";
import domain from "~~/utils/Domains.json";
import { Contract, ContractName } from "~~/utils/scaffold-eth/contract";

export const CDHMint = ({
  deployedContractData,
  address,
  ownDomainName,
  getOwnerDomains,
}: {
  deployedContractData: Contract<ContractName>;
  address: any;
  ownDomainName: string[];
  getOwnerDomains: () => void;
}) => {
  const router = useRouter();
  const writeTxn = useTransactor();

  const [tokenId, setTokenId] = useState<number | null>(null);
  const [tba, setTba] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [uri, setUri] = useState<string>("");
  const [metadataUri, setMetadataUri] = useState<string>("");
  const [showCDNModal, setShowModal] = useState(false);
  const [showArweaveModal, setShowArweaveModal] = useState(false);
  const [domainName, setDomainName] = useState<string>("");
  const [domainRegisterYear, setDomainRegisterYear] = useState<number>(1);

  const { data: result, writeContractAsync } = useWriteContract();
  const { refetch: tokenIdRefetch } = useReadContract({
    address: deployedContractData?.address,
    functionName: "eoaToTokenId",
    abi: deployedContractData?.abi,
    args: [address],
    chainId: 5555,
    query: {
      enabled: false,
      retry: false,
    },
  });
  const { refetch: tbaRefetch } = useReadContract({
    address: deployedContractData?.address,
    functionName: "eoaToTbaAccount",
    abi: deployedContractData?.abi,
    args: [address],
    chainId: 5555,
    query: {
      enabled: false,
      retry: false,
    },
  });
  const { refetch: metadataRefetch } = useReadContract({
    address: deployedContractData?.address,
    functionName: "tokenURI",
    abi: deployedContractData?.abi,
    args: [BigInt(tokenId ?? 0)],
    chainId: 5555,
    query: {
      enabled: false,
      retry: false,
    },
  });

  const { refetch: getPrice } = useReadContract({
    address: DOMAIN_CONTRACT_ADDRESS,
    functionName: "price",
    abi: domain.abi,
    args: [domainName, domainRegisterYear],
    chainId: 5555,
    query: {
      enabled: true,
      retry: true,
    },
  });

  const handleWrite = async () => {
    if (writeContractAsync) {
      try {
        const metadataUri = await uploadMetadata(name, uri);
        const makeWriteWithParams = () =>
          writeContractAsync({
            address: deployedContractData?.address,
            functionName: "safeMint",
            abi: deployedContractData?.abi,
            args: [address, metadataUri],
          });
        await writeTxn(makeWriteWithParams);
      } catch (e: any) {
        console.error("⚡️ ~ file: WriteOnlyFunctionForm.tsx:handleWrite ~ error", e);
      }
    }
  };

  const handleCDNWrite = async () => {
    if (writeContractAsync) {
      try {
        const price = await getPrice();
        const makeWriteWithParams = () =>
          writeContractAsync({
            address: DOMAIN_CONTRACT_ADDRESS,
            functionName: "register",
            abi: domain?.abi,
            args: [domainName, domainRegisterYear],
            value: BigInt(price.data as any),
          });
        await writeTxn(makeWriteWithParams);
        getOwnerDomains();
      } catch (e: any) {
        console.error("⚡️ ~ file: WriteOnlyFunctionForm.tsx:handleWrite ~ error", e);
      }
    }
  };

  const getTokenId = useCallback(async () => {
    const tokenId = await tokenIdRefetch();
    setTokenId(tokenId.data !== null ? Number(tokenId.data) : null);
  }, [tokenIdRefetch]);

  const getMetadata = useCallback(async () => {
    const metadata = await metadataRefetch();
    setMetadataUri(metadata.data ?? "");
  }, [metadataRefetch]);

  const getTbaAccount = useCallback(async () => {
    const tba = await tbaRefetch();
    setTba(tba.data && tba.data !== "0x0000000000000000000000000000000000000000" ? tba.data : "");
  }, [tbaRefetch]);

  // const checkCdn = useCallback(async () => {
  //   if (domains.length === 0) {
  //     try {
  //       console.log("start checkCdn");
  //       const _domains = await getOwnerDomains();
  //       console.log(`_domains: ${_domains}`);
  //       setDomains(_domains.data ? _domains.data : []);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }
  // }, [domains, getOwnerDomains]);

  const changeAddressInfoPage = (index: number, address: string, tba: string) => {
    router.push(`/address/${address}?tba=${tba}&index=${index}`);
  };

  useEffect(() => {
    if (deployedContractData) getTokenId();
    if (deployedContractData) getTbaAccount();
    if (deployedContractData) getMetadata();
    getOwnerDomains();
  }, [
    address,
    deployedContractData,
    getMetadata,
    getOwnerDomains,
    getTokenId,
    getTbaAccount,
    tokenId,
    tba,
    result,
    metadataUri,
  ]);

  return (
    <div className="flex flex-wrap -mx-2 w-full justify-center items-center">
      <CDNModal
        showModal={showCDNModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleCDNWrite}
        domainName={domainName}
        setDomainName={setDomainName}
        domainRegisterYear={domainRegisterYear}
        setDomainRegisterYear={setDomainRegisterYear}
      />
      <ArweaveModal
        showModal={showArweaveModal}
        onClose={() => setShowArweaveModal(false)}
        name={name}
        setName={setName}
        imageUrl={uri}
        setImageUrl={setUri}
      />
      {tokenId !== null && tba ? (
        <div className="flex flex-col justify-center items-center space-y-10">
          <h1 className="text-center text-2xl font-bold">Your CDH NFT</h1>
          <button
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            onClick={() => changeAddressInfoPage(tokenId!, address, tba)}
            className="w-full text-left max-w-sm rounded overflow-hidden shadow-lg flex flex-col items-start mt-4"
          >
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">CDH #{tokenId}</div>
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
                  Metadata
                </span>{" "}
                <span className="break-all block">{metadataUri}</span>
              </p>
              {(ownDomainName as any) && (
                <p className="text-gray-700 text-base">
                  <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                    CDN
                  </span>{" "}
                  <span className="break-all block">{String(ownDomainName) || ""}</span>
                </p>
              )}
            </div>
          </button>
          {Array.isArray(ownDomainName) && ownDomainName.length > 0 ? (
            <></>
          ) : (
            <div className="flex flex-row space-x-5">
              <button
                onClick={() => setShowModal(true)}
                className="bg-secondary px-8 py-2 text-white rounded-md text-lg font-semibold"
              >
                Mint CDN
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          <h1 className="text-center text-2xl font-bold">Get CDH NFT</h1>
          <input
            type="text"
            value={uri}
            onChange={e => setUri(e.target.value)}
            placeholder="Enter Image URI"
            className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none text-neutral"
          />
          <button
            onClick={handleWrite}
            className="bg-secondary px-8 py-2 text-white rounded-md text-lg mt-2 font-semibold"
          >
            Mint
          </button>
        </>
      )}
    </div>
  );
};
