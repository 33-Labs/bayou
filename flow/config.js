import { config } from "@onflow/fcl";
import publicConfig from "../publicConfig";

config({
  "accessNode.api": publicConfig.accessNodeAPI,
  "discovery.wallet": publicConfig.walletDiscovery,
})