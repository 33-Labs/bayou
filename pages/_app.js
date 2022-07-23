import { useState } from 'react'
import BasicNotification from '../components/BasicNotification'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  const [showNotification, setShowNotification] = useState(false)
  const [notificationContent, setNotificationContent] = useState({})

  return (
    <div className="bg-white text-black bg-[url('/bg.png')] bg-cover bg-center min-h-screen">
      <Component {...pageProps} 
        setShowNotification={setShowNotification}
        setNotificationContent={setNotificationContent} />

      <BasicNotification
        type={notificationContent.type}
        title={notificationContent.title}
        detail={notificationContent.detail}
        show={showNotification}
        setShow={setShowNotification}
      />
    </div>
  )
}

export default MyApp
