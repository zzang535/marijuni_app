import React, { useRef, useEffect } from 'react'
import { Alert } from 'react-native'
import WebviewContainer from './src/WebviewContainer' // webview component
import messaging from '@react-native-firebase/messaging' // fcm
import dynamicLinks from '@react-native-firebase/dynamic-links' // fdl

//App.js
const App = () => {

  // fdl - foreground
  const handleDynamicLink = link => {
    // Handle dynamic link inside your own application
    console.log('foreground link')
    console.log(link)
    if (link.url === 'https://marijuni.com') {
      console.log('link listen success')
    }
  }
  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink)
    // When the component is unmounted, remove the listener
    return () => unsubscribe()
  }, [])

  // fdl - background, quit
  useEffect(() => {
    dynamicLinks().getInitialLink().then(link => {
      console.log('background, quit link')
      console.log(link)
      if (link.url === 'https://marijuni.com') {
        console.log('link listen success')
      }
    })
  }, [])

  // fcm - background, quit
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    //  여기에 로직을 작성한다.
    console.log('background, quit push')
    //  remoteMessage.data로 메세지에 접근가능
    //  remoteMessage.from 으로 topic name 또는 message identifier
    //  remoteMessage.messageId 는 메시지 고유값 id
    //  remoteMessage.notification 메시지와 함께 보내진 추가 데이터
    //  remoteMessage.sentTime 보낸시간
  })

  // fcm - forground
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('foreground push')
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage))
    })
    return unsubscribe
  })

  // 웹뷰와 rn과의 소통은 아래의 ref 값을 이용하여 이루어집니다.
  let webviewRef = useRef()

  /** 웹뷰 ref */
  const handleSetRef = _ref => { webviewRef = _ref }

  /** webview 로딩 완료시 */
  const handleEndLoading = e => {
    console.log("handleEndLoading");
    /** rn에서 웹뷰로 정보를 보내는 메소드 */
    webviewRef.postMessage("로딩 완료시 webview로 정보를 보내는 곳")
  }

  console.log('app started')

  return (
    <WebviewContainer
      webviewRef={webviewRef}
      handleSetRef={handleSetRef}
      handleEndLoading={handleEndLoading}
    />
  )
}



export default App