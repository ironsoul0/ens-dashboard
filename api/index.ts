import { ApolloClient, InMemoryCache } from "@apollo/client";
import { GRAPH_API_URL } from "config";

export const client = new ApolloClient({
  uri: GRAPH_API_URL,
  cache: new InMemoryCache(),
});

export * from "./queries";
