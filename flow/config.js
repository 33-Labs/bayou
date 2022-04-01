import { config } from "@onflow/fcl";
import publicConfig from "../publicConfig";

config({
  "accessNode.api": publicConfig.accessNodeAPI, // Mainnet: "https://mainnet.onflow.org"
  "discovery.wallet": publicConfig.walletDiscovery, // Mainnet: "https://fcl-discovery.onflow.org/authn"
})