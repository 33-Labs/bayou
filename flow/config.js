import { config } from "@onflow/fcl";
import publicConfig from "../publicConfig";
import {send as httpSend} from "@onflow/transport-http";

config({
  "accessNode.api": publicConfig.accessNodeAPI,
  "discovery.wallet": publicConfig.walletDiscovery,
  "sdk.transport": httpSend,
  "app.detail.title": "Bayou",
  "app.detail.icon": "https://bayou.vercel.app/_next/image?url=%2Fbayou.png&w=128&q=100"
})