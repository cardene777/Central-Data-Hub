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

  const getOwnersAddresses = useCallback(async () => {
    const addressList = await refetch();
    console.log(`addressList: ${JSON.stringify(addressList)}`);
    if (addressList && addressList?.data) setAddresses([...addressList.data]);
  }, [refetch]);

  useEffect(() => {
    if (deployedContractData && !addresses) getOwnersAddresses();
  }, [addresses, deployedContractData, getOwnersAddresses]);

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg mt-16">
      {/* <Image className="w-full" src="/img/card-top.jpg" alt="Sunset in the mountains" /> */}
      <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">CDH #{index}</div>
        <p className="text-gray-700 text-base">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis
          eaque, exercitationem praesentium nihil.
        </p>
      </div>
      <div className="px-6 pt-4 pb-2">
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          #photography
        </span>
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          #travel
        </span>
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          #winter
        </span>
      </div>
    </div>
  );
};
