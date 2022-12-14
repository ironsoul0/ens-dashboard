import { providers } from "ethers";

export const GRAPH_API_URL =
  "https://api.thegraph.com/subgraphs/name/ensdomains/ens";

export const INFURA_ID = process.env.NEXT_PUBLIC_INFURA_ID;

export const chainReadProvider = new providers.StaticJsonRpcProvider(
  `https://mainnet.infura.io/v3/${INFURA_ID}`
);
