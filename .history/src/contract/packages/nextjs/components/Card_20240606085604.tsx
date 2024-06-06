"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useReadContract } from "wagmi";
import { Contract, ContractName } from "~~/utils/scaffold-eth/contract";

export const Card = ({ deployedContractData }: { deployedContractData: Contract<ContractName> }) => {
  const { refetch, error } = useReadContract({
    address: deployedContractData?.address,
    functionName: "getOwners",
    abi: deployedContractData?.abi,
    args: [10n, 0n],
    chainId: 5555,
    query: {
      enabled: false,
      retry: false,
    },
  });
  const [addresses, setAddresses] = useState<string[]>([]);
  const [tbaAccounts, setTbaAccounts] = useState<string[]>([]);

  const getOwnersAddresses = useCallback(async () => {
    console.log(`refetching...`);
    const addressList = await refetch();
    console.log(`addressList: ${JSON.stringify(addressList)}`);
    if (addressList && addressList?.data) setAddresses([...addressList.data[0]]);
    if (addressList && addressList?.data) setTbaAccounts([...addressList.data[1]]);
  }, [refetch]);

  useEffect(() => {
    if (deployedContractData && addresses.length === 0) getOwnersAddresses();
  }, [addresses, deployedContractData, getOwnersAddresses, tbaAccounts]);

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  return (
    <div className="flex flex-wrap mt-16 -mx-2 w-full">
      {addresses.map((address, index) => (
        <div key={index} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 px-2 mb-4">
          <div className="max-w-sm rounded overflow-hidden shadow-lg">
            {/* <Image className="w-full" src="/img/card-top.jpg" alt="Sunset in the mountains" /> */}
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">CDH #{index}</div>
              <p className="text-gray-700 text-base">
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                  Owner
                </span>{" "}
                <span className="break-all">{address}</span>
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
