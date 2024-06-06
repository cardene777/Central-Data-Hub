"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useReadContract } from "wagmi";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";


const AddressPage = () => {
  const { data: deployedContractData } = useDeployedContractInfo("CDH");

  const [metadata, setMetadata] = useState("");

  const searchParams = useSearchParams();
  const tokenId = searchParams.get("index");
  const tba = searchParams.get("tba");

  const params = useParams();
  const { address } = params;

  const { refetch } = useReadContract({
    address: deployedContractData?.address,
    functionName: "tokenURI",
    abi: deployedContractData?.abi,
    args: [tokenId],
    chainId: 5555,
    query: {
      enabled: false,
      retry: false,
    },
  });

  return (
    <div className="px-6 py-4 mt-10">
      <Link href="/" className="bg-secondary px-3 py-2 text-white rounded-md text-lg">
        Home
      </Link>
      <div className="font-bold text-3xl mb-2 mt-10">CDH #{index}</div>
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
        <span className="break-all block">{tba}</span>
      </p>
      <p className="text-gray-700 text-base">
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          CVCDNS
        </span>{" "}
        <span className="break-all block">CrossValueChainDomainNameService ...</span>
      </p>
    </div>
  );
};

export default AddressPage;
