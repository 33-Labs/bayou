import * as fcl from "@onflow/fcl";
import { useEffect } from "react";
import config from "../flow/config.js"
import publicConfig from "../publicConfig.js";

export default function WalletConnector(props) {
  const user = props.user

  useEffect(() => {
    window.addEventListener("message", async (d) => {
      if ((d.data.type === "FCL:VIEW:RESPONSE" && d.data.status === "APPROVED" && (d.data.data.network && d.data.data.network !== publicConfig.chainEnv))
        || (d.data.type === "LILICO:NETWORK" && typeof d.data.network === "string" && d.data.network != publicConfig.chainEnv)) {
        props.setShowNotification(true)
        props.setNotificationContent({ type: "exclamation", title: "WRONG NETWORK", detail: null })
        await new Promise(r => setTimeout(r, 2))
        fcl.unauthenticate()
      }
    })
  }, [])

  const AuthedState = () => {
    return (
      <div >
        <label className="whitespace-pre block font-flow text-md leading-10">
        {"Logged in as "}
        <a 
          href={`${publicConfig.flowscanURL}/account/${user?.addr ?? "No Address"}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-flow text-lg leading-10 underline decoration-flow-green decoration-2">{user?.addr ?? "No Address"}
        </a>
        </label>
        <button
          type="button"
          className="h-14 mt-8 mb-20 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium shadow-md text-black bg-flow-green hover:bg-flow-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-flow-green"
          onClick={fcl.unauthenticate}
          >
            Disconnect
        </button>
      </div>
    )
  }

  const UnauthenticatedState = () => {
    return (
      <div>
        <label className="block font-flow text-md leading-10">
          Connect to wallet and start <span className="font-flow font-bold text-sm">Batch Transfer</span>
        </label>
        <button
          type="button"
          className="h-14 mt-8 mb-20 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium shadow-md text-black bg-flow-green hover:bg-flow-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-flow-green"
          onClick={fcl.logIn}
          >
          Connect Wallet
        </button>
      </div>
    )
  }

  return (
    <div className={props.className}>
      <label className="block text-2xl font-bold font-flow">
      Connect to Wallet
      </label>
      {user.loggedIn
        ? <AuthedState />
        : <UnauthenticatedState />
      }
    </div>
  )
}