import { useEffect, useState } from 'react'
import { ConfigType } from '@apps/design-react'

const useBrickAsync = () => {
  const [brickConfig, setBrickConfig] = useState<ConfigType | null>(null)

  useEffect(() => {
    import(/* webpackChunkName: 'BrickConfigChunk' */ '../configs').then(({ default: configData }) => {
      setBrickConfig(configData)
    })
  }, [])

  return brickConfig
}

export default useBrickAsync
