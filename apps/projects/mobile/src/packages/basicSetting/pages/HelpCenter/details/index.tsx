import GlobalWrapper from '@/components/GlobalWrapper'
import { RichText, View, WebView } from '@tarojs/components'
import React, { useEffect, useState } from 'react'
import { useRouter } from '@apps/mobile-services/utils/taro'
import { getCommodityShopHelpInfoDetail } from '@apps/apis'
import styles from './index.module.scss'
const Details = () => {
  const { params } = useRouter()
  const [information, setInformation] = useState<{
    id
    skipType
    skipUrl
    helpTitle
    helpContent
  }>()
  useEffect(() => {
    getCommodityShopHelpInfoDetail({
      id: String(params.id),
    }).then((res) => {
      if (res.data) {
        setInformation(res.data)
      }
    })
  }, [])
  const processRichText = (content: string) =>
    content.replace(/<img/gi, '<img style="max-width:100%;height:auto;display:block"')
  return (
    <>
      {information && (
        <>
          {information?.skipType === 1 && (
            <View className={styles['help_details']}>
              <View className={styles['help_title']}>{information.helpTitle}</View>
              <RichText nodes={processRichText(information.helpContent)} />
            </View>
          )}
          {information?.skipType === 2 && information.skipUrl && <WebView src={information.skipUrl} />}
        </>
      )}
    </>
  )
}
export default GlobalWrapper(Details)
