import publicConfig from "../publicConfig";
import mainnetTokenList from "./mainnetTokenList";
import testnetTokenList from "./testnetTokenList";

export default function TokenList() {
  if (publicConfig.chainEnv == "testnet") {
    return testnetTokenList.Tokens
  }

  if (publicConfig.chainEnv == "mainnet") {
    return mainnetTokenList.Tokens
  }

  throw "Invalid chain"
}