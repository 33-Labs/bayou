import * as fcl from "@onflow/fcl";
import config from "../flow/config.js"

export default function WalletConnector(props) {
  const user = props.user

  const AuthedState = () => {
    return (
      <div >
        <label className="block font-flow text-md leading-10">
        Logged in as 
        <label className="whitespace-pre font-flow text-lg leading-10"> {user?.addr ?? "No Address"}    </label>
        </label>
        <button
          type="button"
          className="mt-8 mb-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium shadow-sm text-black bg-flow-green hover:bg-flow-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-flow-green"
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
          Start to transfer tokens after wallet connected
        </label>
        <button
          type="button"
          className="mt-8 mb-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium shadow-sm text-black bg-flow-green hover:bg-flow-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-flow-green"
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