import GlobalWrapper from '@/components/GlobalWrapper'
/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-04 20:03:28
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-18 17:42:07
 * @Description: 确认售后完成
 */
import React, { useState, useEffect } from 'react'
import { getCurrentInstance, showToast, pxTransform } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import { View, Button } from '@apps/mobile-ui'
import Router from '@/utils/router'
import { useSafeArea } from '@apps/mobile-services'
import { themeLayout } from '@/constants/theme'
import {
  getAftersalesMobileReturnGoodsGetDetailByConsumer,
  postAftersalesMobileReturnGoodsConfirmComplete,
  GetAftersalesMobileReturnGoodsGetDetailByConsumerResponse,
} from '@apps/apis'
import AsPageHeader from '../../../../afterRecords/components/AsPageHeader'
import EvaluationForm, { Values } from '../../../../afterRecords/components/EvaluationForm'
import Gap from '../../../../afterRecords/components/Gap'
import styles from './index.module.scss'
type RouteParams = {
  /**
   * 数据id
   */
  returnId: number
  /**
   * 是否可编辑的，这里用来区分是 提交/修改 操作
   */
  isEdit: boolean
  /**
   * 提交成功之后会回调的函数，通常会用作 重新请求数据
   */
  onRefresh: () => void
}
export interface DetailsData extends GetAftersalesMobileReturnGoodsGetDetailByConsumerResponse {}
const RefundSubmitFinished: React.FC = () => {
  const params = getCurrentInstance().preloadData as RouteParams
  const [details, setDetails] = useState<DetailsData>()
  const [loading, setLoading] = useState(false)
  const [evaluate, setEvaluate] = useState<Values>()
  const [submitLoading, setSubmitLoading] = useState(false)
  const { safeBottomHeight } = useSafeArea()
  const intl = useIntl()

  // eslint-disable-next-line no-undef
  let timer: NodeJS.Timeout | null = null
  const getDetails = () => {
    if (!params.returnId || loading) {
      return
    }
    setLoading(true)
    getAftersalesMobileReturnGoodsGetDetailByConsumer({
      replaceId: `${params.returnId}`,
    })
      .then((res) => {
        if (res.code === 1000) {
          setDetails(res.data)
        }
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false)
      })
  }
  useEffect(() => {
    getDetails()
    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [])
  const handleEvaluationChange = (values: Values) => {
    setEvaluate(values)
  }
  const handleSubmit = () => {
    if (!details || !params.returnId) {
      return
    }
    if (!evaluate || !evaluate.content) {
      showToast({
        title: intl.formatMessage({
          id: 'refundTodo.refundSubmitFinished.evaluate.required',
          defaultMessage: '请输入评价内容',
        }),
        icon: 'none',
      })
      return
    }
    setSubmitLoading(true)
    postAftersalesMobileReturnGoodsConfirmComplete({
      returnId: +params.returnId,
      evaluate,
    })
      .then((res) => {
        if (res.code === 1000) {
          showToast({
            title: intl.formatMessage({
              id: 'refundTodo.refundSubmitFinished.submit.success',
              defaultMessage: '提交成功',
            }),
            icon: 'none',
          })
          setSubmitLoading(false)
          if (params.onRefresh) {
            params.onRefresh()
          }
          timer = setTimeout(() => {
            Router.navigateBack()
          }, 1000)
        }
        if (res.code !== 1000 && res.message) {
          showToast({
            title: res.message,
            icon: 'none',
          })
          setSubmitLoading(false)
        }
      })
      .catch(() => {
        setSubmitLoading(false)
      })
  }
  return (
    <View className={styles['refund-submit-finished']}>
      <AsPageHeader
        title={intl.formatMessage({
          id: 'refundTodo.refundSubmitFinished.nav',
          defaultMessage: '待确认售后完成',
        })}
      >
        <EvaluationForm onChange={handleEvaluationChange} />
        <Gap />
      </AsPageHeader>
      <View
        className={styles['actions']}
        style={{
          paddingBottom: safeBottomHeight ? `${safeBottomHeight}PX` : pxTransform(themeLayout['padding-xs']),
        }}
      >
        <Button type="primary" onClick={handleSubmit} loading={submitLoading}>
          {intl.formatMessage({
            id: 'refundTodo.refundSubmitFinished.submit',
            defaultMessage: '提交评价',
          })}
        </Button>
      </View>
    </View>
  )
}
export default GlobalWrapper(RefundSubmitFinished)
