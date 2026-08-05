import React, { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import useStores from '@/store/useStores'
import Head from './components/Head'

const HomeView = () => {
  const {
    userStore: { userInfo },
  } = useStores()
  return <Head userInfo={userInfo} />
}

export default observer(HomeView)
