"use client";

import React, { useEffect, useState } from "react";
import { useWriteContract } from "wagmi";
import { useTransactor } from "~~/hooks/scaffold-eth";
import { Contract, ContractName } from "~~/utils/scaffold-eth/contract";

export const CDhMint = ({
  deployedContractData,
  address,
  uri,
}: {
  deployedContractData: Contract<ContractName>;
  address: string;
  uri: string;
}) => {
  const writeTxn = useTransactor();
  const { data: result, isPending, writeContractAsync } = useWriteContract();

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

  return (
    <div className="flex flex-wrap -mx-2 w-full">
      <h1 className="text-center text-2xl font-bold">Get CDH NFT</h1>
      <button onClick={handleWrite} className="bg-secondary px-8 py-2 text-white rounded-md text-lg mt-2 font-semibold">
        Mint
      </button>
    </div>
  );
};
