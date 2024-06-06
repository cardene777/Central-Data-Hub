"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWriteContract } from "wagmi";
import { Contract, ContractName } from "~~/utils/scaffold-eth/contract";


export const Card = ({ deployedContractData }: { deployedContractData: Contract<ContractName> }) => {
  const router = useRouter();
  const { data: result, isPending, writeContractAsync } = useWriteContract();
  const [addresses, setAddresses] = useState<string[]>([]);
  const [tbaAccounts, setTbaAccounts] = useState<string[]>([]);

  const getOwnersAddresses = useCallback(async () => {
    const addressList = await refetch();
    if (addressList && addressList?.data) setAddresses([...addressList.data[0]]);
    if (addressList && addressList?.data) setTbaAccounts([...addressList.data[1]]);
  }, [refetch]);

  useEffect(() => {
    if (deployedContractData && addresses.length === 0) getOwnersAddresses();
  }, [addresses, deployedContractData, getOwnersAddresses, tbaAccounts]);

  const changeAddressInfoPage = (index: number, address: string, tba: string) => {
    router.push(`/address/${address}?tba=${tba}&index=${index}`);
  };

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  return (
    <div className="flex flex-wrap -mx-2 w-full">
      <h1 className="text-center text-2xl font-bold">Get CDH NFT</h1>
      <button className="bg-secondary px-8 py-2 text-white rounded-md text-lg mt-2 font-semibold">Mint</button>
    </div>
  );
};
