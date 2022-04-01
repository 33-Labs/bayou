import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";

import NavigationBar from '../components/NavigationBar'
import TokenSelector from '../components/TokenSelector'
import RecipientsInput from '../components/RecipientsInput'
import WalletConnector from '../components/WalletConnector';

export default function Home() {
  const [user, setUser] = useState({loggedIn: null})
  useEffect(() => fcl.currentUser.subscribe(setUser), [])
  useEffect((user) => {
    setSelectedToken(null)
    setTokenBalance(0)
  }, [user])
  const [selectedToken, setSelectedToken] = useState(null)
  const [tokenBalance, setTokenBalance] = useState(0)

  return (
    <div className="container mx-auto max-w-[680px] min-w-[350px] px-8">
      <NavigationBar user={user} />
      <WalletConnector className="mt-12 w-full" user={user} />

      <div className="flex flex-col items-center justify-center">

        {
          user && user.loggedIn && (
            <>
              <TokenSelector 
                className="w-full mt-8 mb-20" 
                user={user}
                onTokenSelected={(token) => setSelectedToken(token)} 
                onBalanceFetched={(balance) => setTokenBalance(balance)} 
              />
              <RecipientsInput 
                className="w-full" 
                user={user}
                selectedToken={selectedToken}
                tokenBalance={tokenBalance}
              />
            </>

          )
        }

      </div>
      <footer className={styles.footer}>
        <a
          href="https://github.com/33-Labs"
          target="_blank"
          rel="noopener noreferrer"
          className="font-flow text-sm whitespace-pre"
        >
          Made by <span className="underline font-bold decoration-flow-green decoration-2">33Lab</span> with ❤️
        </a>
      </footer>
    </div>
  )
}
