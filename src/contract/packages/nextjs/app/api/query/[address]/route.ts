import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export const POST = async (req: NextRequest, { params }: { params: { address: string } }) => {
  console.log(`POST params.address: ${params.address}`);
  const query = `
      query Edges($filter: SampleErc721TransferFilter) {
        allSampleErc721Transfers(filter: $filter) {
          nodes {
            from
            to
            tokenId
            contractAddress
          }
        }
      }
    `;
  const variables = {
    filter: {
      to: {
        equalTo: params.address.toLowerCase(),
      },
    },
  };

  try {
    const response = await axios.post(
      "https://current--xenea-indexer-subgraph.apollographos.net/graphql",
      {
        query,
        variables,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    console.log(`response.data: ${JSON.stringify(response.data)}`);

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error("Error fetching GraphQL data:", error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
};
