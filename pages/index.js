import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import NavigationBar from '../components/NavigationBar'
import TokenSelector from '../components/TokenSelector'
import RecipientsInput from '../components/RecipientsInput'

export default function Home() {
  return (
    <div className="container mx-auto max-w-screen-sm min-w-[350px]">
      <NavigationBar />

      <div className="flex flex-col items-center justify-center">
        <TokenSelector className="w-full mt-8 mb-20"/>
        <RecipientsInput className="w-full mb-20" />
      </div>
    </div>
  )
}
