"use client";

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { useReadContract } from "wagmi";
import { CDHMint } from "~~/components/CDHMint";
import { Card } from "~~/components/Card";
import { Address } from "~~/components/scaffold-eth";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { DOMAIN_CONTRACT_ADDRESS } from "~~/lib/config";
import domain from "~~/utils/Domains.json";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const { data: deployedContractData } = useDeployedContractInfo("CDH");

  const { data: ownDomainName, refetch: getOwnerDomains } = useReadContract({
    address: DOMAIN_CONTRACT_ADDRESS,
    functionName: "getDomainsByOwner",
    abi: domain.abi,
    args: [connectedAddress],
    chainId: 5555,
    query: {
      enabled: true,
      retry: true,
    },
  });

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
          {deployedContractData && connectedAddress && (
            <CDHMint
              deployedContractData={deployedContractData}
              address={connectedAddress}
              ownDomainName={ownDomainName as string[]}
              getOwnerDomains={getOwnerDomains}
            />
          )}
        </div>
        {deployedContractData && (
          <Card deployedContractData={deployedContractData} ownDomainName={ownDomainName as string[]} />
        )}
      </div>
    </>
  );
};

export default Home;
