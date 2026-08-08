/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-01 15:12:58
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-05 16:14:19
 * @Description: 评价记录
 * @Todo 加入图片预览功能
 */
import React, { useEffect, useState } from 'react'
import { View, Text, Icons, Rate, Image } from '@apps/mobile-ui'
import { GetMemberMobileCommentMallTradeHistoryPageResponseDetail } from '@apps/apis'
import classNames from 'classnames'
import ImageBox from '@/components/ImageBox'
import { createSelectorQuery } from '@apps/mobile-services/utils/taro'
import './index.scss'
import { useMobileIntl } from '@apps/locales'

interface EvaluateRecordProps {
  /**
   * 数据
   */
  data: GetMemberMobileCommentMallTradeHistoryPageResponseDetail
  /**
   * 评价内容是否省略的，默认 true
   */
  elliptical?: boolean
}

const EvaluateRecord: React.FC<EvaluateRecordProps> = (props: EvaluateRecordProps) => {
  const { data, elliptical } = props
  const [isOverflow, setIsOverflow] = useState<boolean>(false)
  const [isCollapsed, setIsCollapsed] = useState<boolean>(elliptical || false)

  const translate = useMobileIntl()

  useEffect(() => {
    const query = createSelectorQuery()
    let textHeight = 0
    let wrapperHeight = 0

    query.select(`#text-wrap-${data.id}`).boundingClientRect((data: any) => {
      wrapperHeight = data?.height || 0
    })
    query.select(`#text-${data.id}`).boundingClientRect((data: any) => {
      textHeight = data?.height || 0
    })
    query.exec(() => {
      if (textHeight > wrapperHeight) {
        setIsOverflow(true)
      } else {
        setIsOverflow(false)
      }
    })
  }, [])

  return (
    <View className="evaluate">
      <View className="evaluate-head">
        <View className="evaluate-avatar">
          {data?.logo ? (
            <Image src={`${data?.logo}`} className="evaluate-avatar-img" />
          ) : (
            <Icons name="Mine" size={20} color="#FFFFFF" />
          )}
        </View>
        <View className="evaluate-nameWrap">
          <Text className="evaluate-name">{data.memberName}</Text>
        </View>
        <View className="evaluate-rateWrap">
          <Rate value={data.star} size={16} className="evaluate-rate" />
        </View>
      </View>
      <View
        id={`text-wrap-${data.id}`}
        className={classNames('evaluate-content-wrap', { 'evaluate-content-wrap__elliptical': isCollapsed })}
      >
        <Text id={`text-${data.id}`} className={classNames('evaluate-content')}>
          {data.comment}
        </Text>
      </View>
      {isOverflow && (
        <View className="evaluate-collapsed" onClick={() => setIsCollapsed(!isCollapsed)}>
          <Text>{isCollapsed ? translate('mobile.common.zhankai') : translate('mobile.common.shouqi')}</Text>
        </View>
      )}
      {data.pics && data.pics.length ? (
        <View className="evaluate-picture">
          {data.pics &&
            data.pics.map((item, index) => (
              <View className="evaluate-picture-item" key={index}>
                <View className="evaluate-picture-item-content">
                  <ImageBox source={item} className="evaluate-picture-item-img" resizeMode="aspectFill" />
                </View>
              </View>
            ))}
        </View>
      ) : null}
    </View>
  )
}

EvaluateRecord.defaultProps = {
  elliptical: true,
}

export default EvaluateRecord
