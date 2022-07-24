import Head from 'next/head'
import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";

import NavigationBar from '../components/NavigationBar'
import TokenSelector from '../components/TokenSelector'
import RecipientsInput from '../components/RecipientsInput'
import WalletConnector from '../components/WalletConnector';
import Footer from '../components/Footer';

export default function Home(props) {
  const [user, setUser] = useState({ loggedIn: null })
  useEffect(() => fcl.currentUser.subscribe(setUser), [])
  useEffect((user) => {
    setSelectedToken(null)
    setTokenBalance(0)
  }, [user])
  const [selectedToken, setSelectedToken] = useState(null)
  const [tokenBalance, setTokenBalance] = useState(0)
  const { setShowNotification, setNotificationContent } = props

  return (
    <>
      <Head>
        <title>bayou | batch token transfer tool</title>
        <meta property="og:title" content="bayou | batch token transfer tool" key="title" />
      </Head>
      <div className="container mx-auto max-w-[680px] min-w-[350px] px-8">
        <NavigationBar user={user} />
        <WalletConnector
          className="mt-12 w-full"
          user={user}
          setShowNotification={setShowNotification}
          setNotificationContent={setNotificationContent}
        />

        <div className="flex flex-col items-center justify-center">
          {
            user && user.loggedIn && (
              <>
                <TokenSelector
                  className="w-full mb-20"
                  user={user}
                  onTokenSelected={(token) => setSelectedToken(token)}
                  onBalanceFetched={(balance) => setTokenBalance(balance)}
                />
                <RecipientsInput
                  className="w-full"
                  user={user}
                  selectedToken={selectedToken}
                  tokenBalance={tokenBalance}
                  setNotificationContent={setNotificationContent}
                  setShowNotification={setShowNotification}
                />
              </>
            )
          }

        </div>
        <Footer />
      </div>
    </>
  )
}
