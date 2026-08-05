import GlobalWrapper from '@/components/GlobalWrapper'
import { View } from '@apps/mobile-ui'
import { RichText } from '@tarojs/components'
import { useRouter } from '@apps/mobile-services/utils/taro'
import { IS_WEB } from '@/constants'
import Empty from '@/components/Empty'
import useWebView from './services/hooks/useWebView'
import styles from './index.module.scss'
import React, { useState } from 'react'

const tagStyle = {
  video: 'width: 100%;',
}

/* 外部网页 */
const WebInfo = (props) => {
  const { id, type = 'sign', columnType, isMember, memberId, roleId } = props
  const { columnTypeList } = useWebView(
    id,
    type,
    columnType,
    isMember
      ? {
          memberId,
          roleId,
        }
      : undefined,
  )
  return (
    <View className={styles['html']}>
      {/* <View style={{ fontSize: '20px', textAlign: 'center', padding: '20px', fontWeight: 'bold' }}>认养协议</View> */}
      {columnTypeList?.content ? (
        IS_WEB ? (
          <View
            className={styles['taro_html']}
            dangerouslySetInnerHTML={{
              __html: columnTypeList?.content,
            }}
          ></View>
        ) : (
          <RichText nodes={columnTypeList?.content} space="nbsp" tag-style={tagStyle} />
        )
      ) : (
        <Empty />
      )}
    </View>
  )
}
export default React.memo(WebInfo)
