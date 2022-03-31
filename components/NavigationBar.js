
import "../flow/config";
import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";

export default function NavigationBar(props) {
  const user = props.user

  const AuthedState = () => {
    return (
      <div className="absolute right-0">
        <button
          type="button"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium shadow-sm text-black bg-flow-green hover:bg-flow-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-flow-green"
          onClick={fcl.unauthenticate}
          >
          {user?.addr ?? "No Address"}
        </button>
      </div>
    )
  }

  const UnauthenticatedState = () => {
    return (
      <div className="absolute right-0">
        <button
          type="button"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium shadow-sm text-black bg-flow-green hover:bg-flow-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-flow-green"
          onClick={fcl.logIn}
          >
          Connect Wallet
        </button>
      </div>
    )
  }
  return (
    <>
      <div className="relative flex items-center bg-white h-48">
        <label className="absolute font-flow font-bold text-4xl">
          Bayou
        </label>
        {user.loggedIn
          ? <AuthedState />
          : <UnauthenticatedState />
        }
      </div>
    </>
  )
}