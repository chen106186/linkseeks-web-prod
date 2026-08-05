import GlobalWrapper from '@/components/GlobalWrapper'
/*
 * @Author: XieZhiXiong
 * @Date: 2021-09-07 17:34:24
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-11 16:43:31
 * @Description: 相关凭证
 */
import React, { useState } from 'react'
import { getCurrentInstance, pxTransform } from '@apps/mobile-services/utils/taro'
import { View } from '@apps/mobile-ui'
import { getOssUrlPath } from '@apps/constants'
import { useIntl } from '@linkseeks/i18n'
import PageLayout from '@/components/PageLayout'
import NavBar from '@/components/NavBar'
import { THEME_COLORS } from '@/constants/theme'
import ImageBox from '@/components/ImageBox'
import styles from './index.module.scss'
export type VoucherListItem = string
type IconItemType = {
  name: string
  color: string
  bgColor: string
}
interface RouteParams {
  /**
   * 数据源
   */
  dataSource: VoucherListItem[]
}
const ICON_NAME_MAP: {
  [key: string]: IconItemType
} = {
  '.doc': {
    name: getOssUrlPath('/Images/doc.png'),
    color: '#2266EE',
    bgColor: '#E9F3FF',
  },
  '.docx': {
    name: getOssUrlPath('/Images/doc.png'),
    color: '#2266EE',
    bgColor: '#E9F3FF',
  },
  '.xls': {
    name: getOssUrlPath('/Images/xls.png'),
    color: THEME_COLORS.primary,
    bgColor: THEME_COLORS.primarySoft,
  },
  '.xlsx': {
    name: getOssUrlPath('/Images/xls.png'),
    color: THEME_COLORS.primary,
    bgColor: THEME_COLORS.primarySoft,
  },
  '.pdf': {
    name: getOssUrlPath('/Images/pdf.png'),
    color: '#F4EFFE',
    bgColor: '#F4EFFE',
  },
}
const VoucherList: React.FC = () => {
  const params = getCurrentInstance().preloadData as RouteParams
  const [fileList] = useState<string[]>(params.dataSource || [])
  const intl = useIntl()
  return (
    <PageLayout
      renderHeader={
        <NavBar
          title={intl.formatMessage({
            id: 'refundRecords.refundDetails.faultFileList',
            defaultMessage: '相关凭证',
          })}
        />
      }
    >
      <View className={styles['voucher-list']}>
        {fileList.map((item) => {
          const split = item.split('/')
          const fileName = split && split.length ? split[split.length - 1] : ''
          const suffix = fileName.slice(fileName.indexOf('.'))
          const isImg = /\.(png|jpg|gif|jpeg|webp)$/.test(item)
          return (
            <View key={item} className={styles['voucher-list-item']}>
              <View className={styles['voucher-list-item-left']}>
                <View className={styles['voucher-list-item-imgWrap']}>
                  {isImg ? (
                    <ImageBox width="100%" height="100%" source={item} className={styles['voucher-list-item-img']} />
                  ) : (
                    <>
                      {ICON_NAME_MAP[suffix] ? (
                        <View
                          className={styles['voucher-list-item-iconWrap']}
                          style={{
                            backgroundColor: ICON_NAME_MAP[suffix].bgColor,
                          }}
                        >
                          <ImageBox
                            width={pxTransform(28)}
                            height={pxTransform(28)}
                            source={ICON_NAME_MAP[suffix].name}
                          />
                        </View>
                      ) : (
                        <View className={styles['voucher-list-item-iconWrap']}>
                          <ImageBox
                            width={pxTransform(28)}
                            height={pxTransform(28)}
                            source={getOssUrlPath(`/Images/file.png`)}
                          />
                        </View>
                      )}
                    </>
                  )}
                </View>
              </View>
              <View className={styles['voucher-list-item-right']}>
                <View className={styles['voucher-list-item-fileName']}>{fileName}</View>
              </View>
            </View>
          )
        })}
      </View>
    </PageLayout>
  )
}
export default GlobalWrapper(VoucherList)
