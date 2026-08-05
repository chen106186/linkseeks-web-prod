import GlobalWrapper from '@/components/GlobalWrapper'
/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-04 15:10:23
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-04 18:50:27
 * @Description: 查看退款凭证
 */
import React from 'react'
import { getCurrentInstance, previewImage } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import { View } from '@apps/mobile-ui'
import PageLayout from '@/components/PageLayout'
import NavBar from '@/components/NavBar'
import ImageBox from '@/components/ImageBox'
import { FileListItem } from '../../../../afterRecords/refundRecords/components/RefundList'
import styles from './index.module.scss'
interface RouteParams {
  /**
   * 数据
   */
  data: FileListItem[]
}
const CheckVoucher: React.FC = () => {
  const { data } = getCurrentInstance().preloadData as RouteParams
  const intl = useIntl()
  const handlePreview = (cur: string) => {
    previewImage({
      current: cur,
      urls: data.map((file) => file.proveUrl),
    })
  }
  return (
    <PageLayout
      renderHeader={
        <>
          <NavBar
            title={intl.formatMessage({
              id: 'refundTodo.checkVoucher.nav',
              defaultMessage: '查看退款凭证',
            })}
          />
        </>
      }
    >
      <View className={styles['check-voucher']}>
        {data.map((item, index) => (
          <View key={index}>
            {item.proveUrl ? (
              <View onClick={() => handlePreview(item.proveUrl)}>
                <ImageBox
                  className={styles['check-voucher-item']}
                  source={item.proveUrl}
                  resizeMode="widthFix"
                  borderRadius={0}
                />
              </View>
            ) : null}
          </View>
        ))}
      </View>
    </PageLayout>
  )
}
export default GlobalWrapper(CheckVoucher)
