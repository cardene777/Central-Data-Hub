"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const AddressPage = () => {
  const searchParams = useSearchParams();
  const address = searchParams.get("address");
  const index = searchParams.get("index");
  const tba = searchParams.get("tba");

  return (
    <div className="px-6 py-4">
      <Link href="/">
        <a className="text-gray-700 text-base">
          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
            Home
          </span>
        </a>
      </Link>
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
        <span className="break-all block">{tba}</span>
      </p>
    </div>
  );
};

export default AddressPage;
