"use client";

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { Card } from "~~/components/Card";
import { CDHMint } from "~~/components/CDHMint";
import { Address } from "~~/components/scaffold-eth";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const { data: deployedContractData } = useDeployedContractInfo("CDH");

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10 mx-24">
        <div className="px-5">
          <h1 className="text-center ">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Central Data Hub</span>
          </h1>
          <div className="flex justify-center items-center space-x-2">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>
        </div>
        <div className="mt-10 flex flex-col justify-center items-center">
          {deployedContractData && <CDHMint deployedContractData={deployedContractData} address={connectedAddress} />}
        </div>
        <div className="flex justify-center items-center w-full mt-16 ">
          {deployedContractData && <Card deployedContractData={deployedContractData} />}
        </div>
      </div>
    </>
  );
};

export default Home;
