"use client";

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { CDHMint } from "~~/components/CDHMint";
import { Card } from "~~/components/Card";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";

const Field: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const { data: deployedContractData } = useDeployedContractInfo("CDH");

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
        {deployedContractData && <Card deployedContractData={deployedContractData} />}
      </div>
    </>
  );
};

export default Field;
