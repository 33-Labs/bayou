import Head from 'next/head'
import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";

import NavigationBar from '../components/NavigationBar'
import TokenSelector from '../components/TokenSelector'
import RecipientsInput from '../components/RecipientsInput'

export default function Home() {
  const [user, setUser] = useState({loggedIn: null})
  useEffect(() => fcl.currentUser.subscribe(setUser), [])
  const [selectedToken, setSelectedToken] = useState(null)
  const [tokenBalance, setTokenBalance] = useState(0)

  return (
    <div className="container mx-auto max-w-screen-sm min-w-[350px]">
      <NavigationBar user={user} />

      <div className="flex flex-col items-center justify-center">
        <TokenSelector 
          className="w-full mt-8 mb-20" 
          user={user}
          onTokenSelected={(token) => setSelectedToken(token)} 
          onBalanceFetched={(balance) => setTokenBalance(balance)} 
        />
        <RecipientsInput 
          className="w-full" 
          selectedToken={selectedToken}
          tokenBalance={tokenBalance}
        />
      </div>
    </div>
  )
}
