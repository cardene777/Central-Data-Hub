"use client";

import React, { useCallback, useEffect, useState } from "react";
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
  const writeTxn = useTransactor();
  const { data: result, writeContractAsync } = useWriteContract();
  const { refetch: tokenIdRefetch, error } = useReadContract({
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

  const [tokenId, setTokenId] = useState<number | null>(null);
  const [tba, setTokenId] = useState<number | null>(null);
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
    setTokenId(tokenId.data ? Number(tokenId.data) : null);
  }, [tokenIdRefetch]);

  useEffect(() => {
    if (deployedContractData && !tokenId) getTokenId();
  }, [address, deployedContractData, getTokenId, tokenId]);

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  return (
    <div className="flex flex-wrap -mx-2 w-full">
      <h1 className="text-center text-2xl font-bold">Get CDH NFT</h1>
      <input
        type="text"
        value={uri}
        onChange={e => setUri(e.target.value)}
        placeholder="Enter URI"
        className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none text-neutral"
      />
      <button onClick={handleWrite} className="bg-secondary px-8 py-2 text-white rounded-md text-lg mt-2 font-semibold">
        Mint
      </button>
    </div>
  );
};
