"use client";

import React, { useCallback, useEffect, useState } from "react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { useReadContract } from "wagmi";
import { CDHMint } from "~~/components/CDHMint";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";


const Field: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const { data: deployedContractData } = useDeployedContractInfo("CDH");

  const { refetch, error } = useReadContract({
    address: deployedContractData?.address,
    functionName: "getFields",
    abi: deployedContractData?.abi,
    args: [100n, 0n],
    chainId: 5555,
    query: {
      enabled: false,
      retry: false,
    },
  });
  const [fields, setFields] = useState<{ name: string; number: number; owner: string }[]>([]);

  const getFields = useCallback(async () => {
    const fields = await refetch();
      if (fields && Array.isArray(fields.data)) {
        console.log(`fields.data: ${fields.data}`);
      setFields([...fields.data]);
    } else {
      console.error("Expected fields.data to be an array, but got:", fields.data);
    }
  }, [refetch]);

  useEffect(() => {
    if (deployedContractData && fields.length === 0) getFields();
  }, [fields, deployedContractData, getFields]);

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10 mx-24">
        <div className="px-5">
          <h1 className="text-center ">
            <span className="block text-4xl font-bold">Metadata Field</span>
          </h1>
        </div>
        <div className="mt-10 flex flex-col justify-center items-center">
          {deployedContractData && connectedAddress && (
            <CDHMint deployedContractData={deployedContractData} address={connectedAddress} />
          )}
        </div>
        <div className="flex flex-col justify-center items-center w-full mt-16 ">
          <h1 className="text-center text-2xl font-bold">CDH Fields</h1>
          <div className="flex flex-wrap -mx-2 w-full mt-10">
            {fields.map((field, index) => (
              <div key={index} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 px-2 mb-4">
                <div className="w-full text-left max-w-sm rounded overflow-hidden shadow-lg flex flex-col items-start">
                  <div className="px-6 py-4">
                    <p className="font-bold text-xl mb-2">field number {field.number.to}</p>
                    <p className="font-bold text-xl mb-2">field name {field.name}</p>
                    <p className="font-bold text-xl mb-2">field owner {field.owner}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Field;
