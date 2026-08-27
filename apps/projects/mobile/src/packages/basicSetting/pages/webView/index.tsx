import GlobalWrapper from '@/components/GlobalWrapper'
import React from 'react'
import { View } from '@apps/mobile-ui'
import { useRouter } from '@apps/mobile-services/utils/taro'
import { IS_WEB } from '@/constants'
import Empty from '@/components/Empty'
import useWebView from './services/hooks/useWebView'
import styles from './index.module.scss'
const tagStyle = {
  video: 'width: 100%;',
}

/* 外部网页 */
const WebInfo = () => {
  const {
    params: { id, type, columnType, title, isMember, memberId, roleId },
  } = useRouter()
  const { columnTypeList } = useWebView(
    id,
    type,
    columnType,
    title,
    isMember
      ? {
          memberId,
          roleId,
        }
      : undefined,
  )
  return (
    <View className={styles['html']}>
      {columnTypeList?.content ? (
        IS_WEB ? (
          <View
            className={styles['taro_html']}
            dangerouslySetInnerHTML={{
              __html: columnTypeList?.content,
            }}
          ></View>
        ) : (
          <parser html={columnTypeList?.content} tag-style={tagStyle} />
        )
      ) : (
        <Empty />
      )}
    </View>
  )
}
export default GlobalWrapper(WebInfo)
