import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const APIURL = "https://xenea-indexer-production.up.railway.app/graphql";
// const APIURL = "https://current--xenea-indexer-subgraph.apollographos.net/graphql";

export const fetchGraphQLData = async (query: string, variables?: object) => {
  const client = new ApolloClient({
    uri: APIURL,
    cache: new InMemoryCache(),
  });

  try {
    const data = await client.query({
      query: gql(query),
      variables,
    });
    console.log("GraphQL Response:", data);
    return data;
  } catch (error) {
    console.error("Error fetching GraphQL data:", error);
    throw error;
  }
};

export const filterByAddress = (address: string) => {
  return {
    filter: {
      to: {
        equalTo: address,
      },
    },
  };
};
