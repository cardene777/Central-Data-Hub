"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useReadContract, useWriteContract } from "wagmi";
import { useTransactor } from "~~/hooks/scaffold-eth";
import { Contract, ContractName } from "~~/utils/scaffold-eth/contract";

export const CDHMint = ({
  deployedContractData,
  address,
}: {
  deployedContractData: Contract<ContractName>;
  address: string;
}) => {
  const router = useRouter();
  const writeTxn = useTransactor();
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

  const [tokenId, setTokenId] = useState<number | null>(null);
  const [tba, setTba] = useState<string>("");
  const [uri, setUri] = useState<string>("");

  const handleWrite = async () => {
    if (writeContractAsync) {
      try {
        const makeWriteWithParams = () =>
          writeContractAsync({
            address: deployedContractData?.address,
            functionName: "safeMint",
            abi: deployedContractData?.abi,
            args: [address, uri],
          });
        await writeTxn(makeWriteWithParams);
      } catch (e: any) {
        console.error("⚡️ ~ file: WriteOnlyFunctionForm.tsx:handleWrite ~ error", e);
      }
    }
  };

  const getTokenId = useCallback(async () => {
    const tokenId = await tokenIdRefetch();
    setTokenId(tokenId.data !== null ? Number(tokenId.data) : null);
  }, [tokenIdRefetch]);

  const getTbaAccount = useCallback(async () => {
    const tba = await tbaRefetch();
    setTba(tba.data && tba.data !== "0x0000000000000000000000000000000000000000" ? tba.data : "");
  }, [tbaRefetch]);

  const changeAddressInfoPage = (index: number, address: string, tba: string) => {
    router.push(`/address/${address}?tba=${tba}&index=${index}`);
  };

  useEffect(() => {
    if (deployedContractData) getTokenId();
    if (deployedContractData) getTbaAccount();
  }, [address, deployedContractData, getTokenId, getTbaAccount, tokenId, tba, result]);

  return (
    <div className="flex flex-wrap -mx-2 w-full justify-center items-center">
      {tokenId !== null && tba ? (
        <>
          <h1 className="text-center text-2xl font-bold">Your CDH NFT</h1>
          <button
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            onClick={() => changeAddressInfoPage(tokenId!, address, tba)}
            className="w-full text-left max-w-sm rounded overflow-hidden shadow-lg flex flex-col items-start mt-4"
          >
            {/* <Image className="w-full" src="/img/card-top.jpg" alt="Sunset in the mountains" /> */}
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
                  CVCDNS
                </span>{" "}
                <span className="break-all block">CrossValueChainDomainNameService ...</span>
              </p>
            </div>
          </button>
        </>
      ) : (
        <>
          <h1 className="text-center text-2xl font-bold">Get CDH NFT</h1>
          <input
            type="text"
            value={uri}
            onChange={e => setUri(e.target.value)}
            placeholder="Enter URI"
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