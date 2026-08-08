import { useShareHomePage } from '@/hooks/useShareHomePage'
import React from 'react'

const GlobalWrapper = (Wrapper) => {
  return () => {
    useShareHomePage()
    return <Wrapper />
  }
}

export default GlobalWrapper
