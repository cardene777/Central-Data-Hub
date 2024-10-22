"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useReadContract } from "wagmi";
import { Contract, ContractName } from "~~/utils/scaffold-eth/contract";

export const Card = ({
  deployedContractData,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ownDomainName,
}: {
  deployedContractData: Contract<ContractName>;
  ownDomainName: string[];
}) => {
  const router = useRouter();
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
    <div className="flex flex-col justify-center items-center w-full mt-16 ">
      <h1 className="text-center text-2xl font-bold">CDH NFTs</h1>
      <div className="flex flex-wrap -mx-2 w-full mt-10">
        {addresses.map((address, index) => (
          <div key={index} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 px-2 mb-4">
            <button
              onClick={() => changeAddressInfoPage(index, address, tbaAccounts[index])}
              className="w-full text-left max-w-sm rounded overflow-hidden shadow-lg flex flex-col items-start"
            >
              <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">CDH #{index}</div>
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
                  <span className="break-all block">{tbaAccounts[index]}</span>
                </p>
                <p className="text-gray-700 text-base">
                  <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                    CVCDNS
                  </span>{" "}
                  {/* {Array.isArray(ownDomainName) && ownDomainName.length > 0 ? (
                    <span className="break-all block">{ownDomainName}</span>
                  ) : (
                    <span className="break-all block">...</span>
                  )} */}
                  <span className="break-all block">...</span>
                </p>
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
