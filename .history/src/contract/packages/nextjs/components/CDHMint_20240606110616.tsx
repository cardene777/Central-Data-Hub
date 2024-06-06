"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useReadContract, useWriteContract } from "wagmi";
import { useTransactor } from "~~/hooks/scaffold-eth";
import { Contract, ContractName } from "~~/utils/scaffold-eth/contract";

export const CDhMint = ({
  deployedContractData,
  address,
}: {
  deployedContractData: Contract<ContractName>;
  address: string;
  uri: string;
}) => {
  const writeTxn = useTransactor();
  const { data: result, writeContractAsync } = useWriteContract();
  const { refetch, error } = useReadContract({
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
    const tokenId = await refetch();
    setTokenId(tokenId.data ? Number(tokenId.data) : null);
  }, [refetch]);

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
      <button onClick={handleWrite} className="bg-secondary px-8 py-2 text-white rounded-md text-lg mt-2 font-semibold">
        Mint
      </button>
    </div>
  );
};
