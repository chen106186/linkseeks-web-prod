import GlobalWrapper from '@/components/GlobalWrapper'
/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-18 17:39:00
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-18 17:39:00
 * @Description: 确认售后完成
 */
import React, { useState, useEffect } from 'react'
import { getCurrentInstance, showToast, pxTransform } from '@apps/mobile-services/utils/taro'
import { View, Button } from '@apps/mobile-ui'
import Router from '@/utils/router'
import { useSafeArea } from '@apps/mobile-services'
import { themeLayout } from '@/constants/theme'
import { useIntl } from '@linkseeks/i18n'
import {
  getAftersalesMobileReplaceGoodsGetDetailByConsumer,
  postAftersalesMobileReplaceGoodsConfirmComplete,
  GetAftersalesMobileReplaceGoodsGetDetailByConsumerResponse,
} from '@apps/apis'
import Gap from '../../../../afterRecords/components/Gap'
import EvaluationForm, { Values } from '../../../../afterRecords/components/EvaluationForm'
import AsPageHeader from '../../../../afterRecords/components/AsPageHeader'
import styles from './index.module.scss'
import { requestSubscribeMessage } from '@tarojs/taro'
import { IS_WEB } from '@/constants'
interface RouteParams {
  /**
   * 数据id
   */
  replaceId: number
  /**
   * 是否可编辑的，这里用来区分是 提交/修改 操作
   */
  isEdit: boolean
  /**
   * 提交成功之后会回调的函数，通常会用作 重新请求数据
   */
  onRefresh: () => void
}
export interface DetailsData extends GetAftersalesMobileReplaceGoodsGetDetailByConsumerResponse {}
const ExchangeSubmitFinished: React.FC = () => {
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
    if (!params.replaceId || loading) {
      return
    }
    setLoading(true)
    getAftersalesMobileReplaceGoodsGetDetailByConsumer({
      replaceId: `${params.replaceId}`,
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
  const handleSubmit = async () => {
    if (!details) {
      return
    }
    if (!evaluate || !evaluate.content) {
      showToast({
        title: intl.formatMessage({
          id: 'exchangeTodo.exchangeSubmitFinished.evaluate.required',
          defaultMessage: '请输入评价内容',
        }),
        icon: 'none',
      })
      return
    }

    if (!IS_WEB) {
      await requestSubscribeMessage({
        tmplIds: ['UKQ2Aw81Af_CyNE9HpT8apmFcR-b6IYEjzYTH8f13xo'],
        entityIds: [],
      }).catch(() => {})
    }

    setSubmitLoading(true)
    postAftersalesMobileReplaceGoodsConfirmComplete({
      replaceId: params.replaceId,
      evaluate,
    })
      .then((res) => {
        if (res.code === 1000) {
          showToast({
            title: intl.formatMessage({
              id: 'exchangeTodo.exchangeSubmitFinished.submit.success',
              defaultMessage: '提交成功',
            }),
            icon: 'none',
          })
          if (params.onRefresh) {
            params.onRefresh()
          }
          timer = setTimeout(() => {
            Router.navigateBack()
          }, 1000)
          setSubmitLoading(false)
        }
        if (res.code !== 1000 && res.message) {
          showToast({
            title: intl.formatMessage({
              id: `${res.code}`,
              defaultMessage: res.message,
            }),
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
    <View className={styles['exchange-submit-finished']}>
      <AsPageHeader
        title={intl.formatMessage({
          id: 'exchangeTodo.exchangeSubmitFinished.nav',
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
            id: 'exchangeTodo.exchangeSubmitFinished.submit',
            defaultMessage: '提交评价',
          })}
        </Button>
      </View>
    </View>
  )
}
export default GlobalWrapper(ExchangeSubmitFinished)
