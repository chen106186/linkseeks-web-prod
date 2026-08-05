import { getManageContentImageFindAllByUseSceneAndPosition } from '@apps/apis'
import { useRequestApi } from '@linkseeks/hooks'
import { useEffect, useState } from 'react'

const useSceneList = () => {
  const { data, loading } = useRequestApi(getManageContentImageFindAllByUseSceneAndPosition, {
    defaultParams: [{ useScene: '1', position: '2' }],
  })

  return {
    sceneList: data || [],
    loading,
  }
}

export default useSceneList
