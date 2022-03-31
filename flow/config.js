import { config } from "@onflow/fcl";

config({
  "accessNode.api": "https://testnet.onflow.org", // Mainnet: "https://mainnet.onflow.org"
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn", // Mainnet: "https://fcl-discovery.onflow.org/authn"
  "FungibleToken": "0x9a0766d93b6608b7", // Mainnet: "0xf233dcee88fe0abe"
  "FUSD": "0xe223d8a629e49c68" // Mainnet: "0x3c5959b568896393"
})