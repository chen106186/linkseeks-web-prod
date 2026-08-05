import React, { useEffect, useState } from 'react'
import { getCommodityShopListShopByReq } from '@apps/apis'
import { MallInfoType } from '@/pages/h5/download/view'
import ImageBox from '@apps/components/src/web/ImageBox'
import { useWebIntl } from '@apps/locales'
import './index.less'

interface Iprops {
  onJump: () => void
}

const ToApp: React.FC<Iprops> = (props: Iprops) => {
  const { onJump } = props
  const [appInfo, setAppInfo] = useState<MallInfoType>()
  const translate = useWebIntl()

  const getAppInfo = async () => {
    const res = await getCommodityShopListShopByReq({ environment: '4', type: '1' })
    if (res.code === 1000 && res.data && res.data.length > 0) {
      setAppInfo(res.data[0])
    }
  }

  useEffect(() => {
    getAppInfo()
  }, [])

  const handleClick = () => {
    onJump?.()
  }

  return (
    <div className="toApp">
      <ImageBox className="app-icon" src={appInfo?.logoUrl} alt="" />
      <div className="app-info">
        <span className="app-name">{appInfo?.name}</span>
      </div>
      <div className="open-app" onMouseDown={handleClick} aria-hidden="true">
        {translate('web.common.dakaiapp')}
      </div>
    </div>
  )
}

export default ToApp
