"use client";

import React from "react";
import { ApolloProvider } from "@apollo/client";
import { client } from "~~/lib/apollo";

export const WithApolloProvider = ({ children }: React.PropsWithChildren) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
