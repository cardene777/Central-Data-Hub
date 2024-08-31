import axios from "axios";

// export const sampleERC721TransferQuery = async (address: string) => {
//   const filter = filterByAddress(address);
//   const query = `
//     query Edges($filter: SampleErc721TransferFilter) {
//   allSampleErc721Transfers(filter: $filter) {
//     nodes {
//       from
//       to
//     }
//         }
//     }
//     `;
//   const result = await fetchGraphQLData(query, filter);
//   console.log(result);
//   return result;
// };

export const sampleERC721TransferQuery = async (address: string) => {
  const query = `
    query Edges($filter: SampleErc721TransferFilter) {
      allSampleErc721Transfers(filter: $filter) {
        nodes {
          from
          to
        }
      }
    }
  `;

  const variables = {
    filter: {
      to: {
        equalTo: address,
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

    return response.data;
  } catch (error) {
    console.error("Error fetching GraphQL data:", error);
    throw error;
  }
};
