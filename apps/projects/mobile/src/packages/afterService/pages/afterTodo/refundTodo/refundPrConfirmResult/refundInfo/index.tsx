import GlobalWrapper from '@/components/GlobalWrapper'
/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-04 14:29:06
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-23 18:43:44
 * @Description: 退款信息
 */
import React, { useState } from 'react'
import cx from 'classnames'
import { pxTransform, getCurrentInstance, preload } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import { View } from '@apps/mobile-ui'
import Router from '@/utils/router'
import PageLayout from '@/components/PageLayout'
import NavBar from '@/components/NavBar'
import Cell from '@/components/Cell'
import MellowCard from '@/components/MellowCard'
import Scene from '@/components/Scene'
import { DetailItem } from '../../../../afterRecords/refundRecords/components/RefundList'
import RefundDetailItemCard from '../../../../afterRecords/refundRecords/components/RefundDetailItemCard'
import styles from './index.module.scss'
type RouteParams = {
  /**
   * 数据
   */
  data: DetailItem[]
}
const RefundInfo: React.FC = () => {
  const { data } = getCurrentInstance().preloadData as RouteParams
  const [activeKey, setActiveKey] = useState<string>(data[0] ? `${data[0].payCount}` : '')
  const intl = useIntl()
  const handleJumpRecords = (record: DetailItem) => {
    preload({
      data: record.payProve && record.payProve.fileList ? record.payProve.fileList : [],
    })
    Router.navigateTo('afterService/afterTodo/refundPrConfirmResult/checkVoucher')
  }

  // 选择批次信息
  const handleSelectBatch = (key: string) => {
    setActiveKey(key)
  }
  return (
    <PageLayout
      renderHeader={
        <>
          <NavBar
            title={intl.formatMessage({
              id: 'refundTodo.refundInfo.nav',
              defaultMessage: '退款信息',
            })}
          />
        </>
      }
    >
      <View className={styles['refund-info']}>
        <Scene current={activeKey}>
          {data.map((item) => (
            <Scene.Item
              key={`${item.payCount}`}
              itemKey={`${item.payCount}`}
              customClassName={cx(
                styles['refundTabWrap-item'],
                data && data.length === 1 ? '' : styles['refundTabWrap-item-small'],
              )}
              onClick={() => handleSelectBatch(`${item.payCount}`)}
            >
              <RefundDetailItemCard data={item} isActive={`${item.payCount}` === activeKey} />
            </Scene.Item>
          ))}
        </Scene>
        {data.map((item) => (
          <View
            key={`${item.payCount}`}
            style={{
              display: `${item.payCount}` === activeKey ? 'block' : 'none',
            }}
          >
            <MellowCard
              bodyStyle={{
                padding: 0,
              }}
              style={{
                marginTop: pxTransform(8),
              }}
            >
              <Cell>
                <Cell.Item
                  title={intl.formatMessage({
                    id: 'refundTodo.refundInfo.refundTime',
                    defaultMessage: '退款时间',
                  })}
                  value={item.refundTime}
                />
              </Cell>
            </MellowCard>
            <MellowCard
              bodyStyle={{
                padding: 0,
              }}
              style={{
                marginTop: pxTransform(8),
              }}
            >
              <Cell>
                <Cell.Item
                  title={intl.formatMessage({
                    id: 'refundTodo.refundInfo.payAmount',
                    defaultMessage: '已付金额',
                  })}
                  value={item.payAmount}
                />
                <Cell.Item
                  title={intl.formatMessage({
                    id: 'refundTodo.refundInfo.payRatio',
                    defaultMessage: '支付比例',
                  })}
                  value={`${item.payRatio! * 100}%`}
                />
                <Cell.Item
                  title={intl.formatMessage({
                    id: 'refundTodo.refundInfo.payWayName',
                    defaultMessage: '支付方式',
                  })}
                  value={item.payWayName}
                />
                {item.payProve && item.payProve.fileList && item.payProve.fileList.length > 0 ? (
                  <Cell.Item
                    icon="Link"
                    iconSize={14}
                    title={intl.formatMessage({
                      id: 'refundTodo.refundInfo.fileList',
                      defaultMessage: '查看退款凭证',
                    })}
                    onPress={() => handleJumpRecords(item)}
                    hasArrow
                    clickable
                  />
                ) : null}
              </Cell>
            </MellowCard>
          </View>
        ))}
      </View>
    </PageLayout>
  )
}
export default GlobalWrapper(RefundInfo)
