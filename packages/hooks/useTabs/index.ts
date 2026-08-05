import { useState } from 'react'

const useTabs = <D>(defaultTabKey: D) => {
  const [activeTabKey, setActiveTabKey] = useState<D>(defaultTabKey)

  return {
    activeTabKey,
    setActiveTabKey,
  }
}

export default useTabs
