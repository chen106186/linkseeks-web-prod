import GlobalWrapper from '@/components/GlobalWrapper'
/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-04 15:39:56
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-23 17:18:09
 * @Description: 确认退款到账
 */
import React, { useState } from 'react'
import cx from 'classnames'
import { getCurrentInstance, showModal, showToast, pxTransform } from '@apps/mobile-services/utils/taro'
import { View, ImagePicker, NoticeBar, Button } from '@apps/mobile-ui'
import { useSafeArea } from '@apps/mobile-services'
import { useIntl } from '@linkseeks/i18n'
import {
  RETURN_OUTER_STATUS_NOT_RECEIVED,
  RETURN_OUTER_STATUS_RECEIVED,
  RETURN_OUTER_STATUS_UNCONFIRMED_REFUND,
} from '@/constants/const/refund'
import { themeLayout } from '@/constants/theme'
import { postAftersalesMobileReturnGoodsConfirmRefund } from '@apps/apis'
import PageLayout from '@/components/PageLayout'
import NavBar from '@/components/NavBar'
import Empty from '@/components/Empty'
import MellowCard from '@/components/MellowCard'
import Cell from '@/components/Cell'
import Scene from '@/components/Scene'
import Gap from '../../../../afterRecords/components/Gap'
import { DetailItem } from '../../../../afterRecords/refundRecords/components/RefundList'
import RefundDetailItemCard from '../../../../afterRecords/refundRecords/components/RefundDetailItemCard'
import styles from './index.module.scss'
import { requestSubscribeMessage } from '@tarojs/taro'
import { IS_WEB } from '@/constants'
export interface DataItem extends DetailItem {}
type RouteParams = {
  /**
   * 数据
   */
  data: DataItem[]
  /**
   * 提交成功之后会回调的函数，通常会用作 重新请求数据
   */
  onRefresh: () => void
}
const RefundConfirmTransferred: React.FC = () => {
  const { data, onRefresh } = getCurrentInstance().preloadData as RouteParams
  const [list, setList] = useState<DataItem[]>(data || [])
  const [current, setCurrent] = useState<DataItem | null>(list[list.length - 1] || null)
  const [activeKey, setActiveKey] = useState<string>(list[list.length - 1] ? `${list[list.length - 1].payCount}` : '')
  const { safeBottomHeight } = useSafeArea()
  const intl = useIntl()

  /**
   * 确认退款是否到账
   * @param refundId 退款id
   * @param flag 0 未到账，1 已到账
   */
  const handleConfirm = async (refundId: number, flag: 0 | 1) => {
    if (!IS_WEB) {
      await requestSubscribeMessage({
        tmplIds: ['UKQ2Aw81Af_CyNE9HpT8apmFcR-b6IYEjzYTH8f13xo'],
        entityIds: [],
      }).catch(() => {})
    }

    showModal({
      title: '',
      confirmText: intl.formatMessage({
        id: 'confirm',
        defaultMessage: '确认',
      }),
      cancelText: intl.formatMessage({
        id: 'cancel',
        defaultMessage: '取消',
      }),
      content:
        flag === 0
          ? intl.formatMessage({
              id: 'refundTodo.refundConfirmTransferred.notReceived.tip',
              defaultMessage: '是否确认退款未到账？',
            })
          : intl.formatMessage({
              id: 'refundTodo.refundConfirmTransferred.received.tip',
              defaultMessage: '是否确认退款已到账？',
            }),
      success: (result: Taro.showModal.SuccessCallbackResult) => {
        if (result.confirm) {
          return new Promise<void>((resolve) => {
            postAftersalesMobileReturnGoodsConfirmRefund({
              refundId,
              isReceipt: flag,
            })
              .then((res) => {
                if (res.code === 1000) {
                  if (onRefresh) {
                    onRefresh()
                  }
                  const newData = [...list]
                  const index = newData.findIndex((item) => item.refundId === refundId)
                  if (index !== -1) {
                    const newItem = {
                      ...newData[index],
                      outerStatus: flag === 0 ? RETURN_OUTER_STATUS_NOT_RECEIVED : RETURN_OUTER_STATUS_RECEIVED,
                      outerStatusName:
                        flag === 0
                          ? intl.formatMessage({
                              id: 'refundTodo.refundConfirmTransferred.notReceived',
                              defaultMessage: '退款未到账',
                            })
                          : intl.formatMessage({
                              id: 'refundTodo.refundConfirmTransferred.received2',
                              defaultMessage: '退款到账',
                            }),
                    }
                    newData.splice(index, 1, newItem)
                    setCurrent(newItem)
                  }
                  setList(newData)
                }
                if (res.code !== 1000 && res.message) {
                  showToast({
                    title: intl.formatMessage({
                      id: `${res.code}`,
                      defaultMessage: res.message,
                    }),
                    icon: 'none',
                  })
                }
                resolve()
              })
              .catch(() => {
                resolve()
              })
          })
        }
      },
    })
  }

  // 选择批次信息
  const handleSelectBatch = (key: string, record: DataItem) => {
    setActiveKey(key)
    setCurrent(record)
  }
  return (
    <PageLayout
      renderHeader={
        <>
          <NavBar
            title={intl.formatMessage({
              id: 'refundTodo.refundConfirmTransferred.nav',
              defaultMessage: '确认退款到账',
            })}
          />
        </>
      }
    >
      <View className={styles['refund-confirm-transferred']}>
        <NoticeBar>
          {intl.formatMessage({
            id: 'refundTodo.refundConfirmTransferred.notice',
            defaultMessage: '请仔细核对退款金额与退款转账凭证是否一致，确认后点击下档操作进行确认',
          })}
        </NoticeBar>
        <View className={styles['refund-confirm-transferred-content']}>
          <Scene current={activeKey}>
            {list.map((item) => (
              <Scene.Item
                key={`${item.payCount}`}
                itemKey={`${item.payCount}`}
                customClassName={cx(
                  styles['refundTabWrap-item'],
                  list && list.length === 1 ? '' : styles['refundTabWrap-item-small'],
                )}
                onClick={() => handleSelectBatch(`${item.payCount}`, item)}
              >
                <RefundDetailItemCard data={item} isActive={`${item.payCount}` === activeKey} />
              </Scene.Item>
            ))}
          </Scene>
          {list.map((item) => (
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
                  marginTop: pxTransform(themeLayout['padding-xs']),
                }}
              >
                <Cell>
                  <Cell.Item
                    title={intl.formatMessage({
                      id: 'refundTodo.refundConfirmTransferred.refundTime',
                      defaultMessage: '退款时间',
                    })}
                    value={item.refundTime}
                  />
                  <Cell.Item
                    title={intl.formatMessage({
                      id: 'refundTodo.refundConfirmTransferred.fileList',
                      defaultMessage: '退款凭证',
                    })}
                    label={
                      <>
                        {!item.payProve ||
                        (item.payProve && !item.payProve.fileList) ||
                        (item.payProve &&
                          item.payProve.fileList &&
                          !item.payProve.fileList.filter((file) => file.proveUrl).length) ? (
                          <Empty description="" />
                        ) : (
                          <ImagePicker
                            files={
                              item.payProve && item.payProve.fileList
                                ? (item.payProve.fileList
                                    .map((file) =>
                                      file.proveUrl
                                        ? {
                                            url: file.proveUrl,
                                          }
                                        : null,
                                    )
                                    .filter(Boolean) as any[])
                                : []
                            }
                            showAddBtn={false}
                            length={4}
                          />
                        )}
                      </>
                    }
                  />
                </Cell>
              </MellowCard>
              <MellowCard
                bodyStyle={{
                  padding: 0,
                }}
                style={{
                  marginTop: pxTransform(themeLayout['padding-xs']),
                }}
              >
                <Cell>
                  <Cell.Item
                    title={intl.formatMessage({
                      id: 'refundTodo.refundConfirmTransferred.payAmount',
                      defaultMessage: '已付金额',
                    })}
                    value={`${intl.formatMessage({
                      id: 'currency',
                    })}${item.payAmount}`}
                  />
                  <Cell.Item
                    title={intl.formatMessage({
                      id: 'refundTodo.refundConfirmTransferred.payRatio',
                      defaultMessage: '支付比例',
                    })}
                    value={`${item.payRatio! * 100}%`}
                  />
                  <Cell.Item
                    title={intl.formatMessage({
                      id: 'refundTodo.refundConfirmTransferred.payNode',
                      defaultMessage: '支付方式',
                    })}
                    value={item.payNode}
                  />
                  <Cell.Item
                    title={intl.formatMessage({
                      id: 'refundTodo.refundConfirmTransferred.payTime',
                      defaultMessage: '支付时间',
                    })}
                    value=""
                  />
                </Cell>
              </MellowCard>
              <Gap />
            </View>
          ))}
        </View>
        {current &&
        (current.outerStatus === RETURN_OUTER_STATUS_UNCONFIRMED_REFUND ||
          current.outerStatus === RETURN_OUTER_STATUS_NOT_RECEIVED) ? (
          <View
            className={styles['actions']}
            style={{
              paddingBottom: safeBottomHeight ? `${safeBottomHeight}PX` : pxTransform(themeLayout['padding-xs']),
            }}
          >
            <View className={styles['actions-item']}>
              <Button onClick={() => handleConfirm(current?.refundId!, 0)}>
                {intl.formatMessage({
                  id: 'refundTodo.refundConfirmTransferred.notReceived',
                  defaultMessage: '退款未到账',
                })}
              </Button>
            </View>
            <View className={styles['actions-item']}>
              <Button type="primary" onClick={() => handleConfirm(current?.refundId!, 1)}>
                {intl.formatMessage({
                  id: 'refundTodo.refundConfirmTransferred.received',
                  defaultMessage: '退款已到账',
                })}
              </Button>
            </View>
          </View>
        ) : null}
      </View>
    </PageLayout>
  )
}
export default GlobalWrapper(RefundConfirmTransferred)
