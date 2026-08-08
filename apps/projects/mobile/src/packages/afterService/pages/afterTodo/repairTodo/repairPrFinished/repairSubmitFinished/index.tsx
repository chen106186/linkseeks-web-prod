import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useState, useEffect } from 'react'
import { getCurrentInstance, showToast, pxTransform } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import { View, Button } from '@apps/mobile-ui'
import Router from '@/utils/router'
import { useSafeArea } from '@apps/mobile-services'
import { themeLayout } from '@/constants/theme'
import {
  getAftersalesMobileRepairGoodsGetDetailByConsumer,
  postAftersalesMobileRepairGoodsConfirmComplete,
  GetAftersalesMobileRepairGoodsGetDetailByConsumerResponse,
} from '@apps/apis'
import AsPageHeader from '../../../../afterRecords/components/AsPageHeader'
import EvaluationForm, { Values } from '../../../../afterRecords/components/EvaluationForm'
import Gap from '../../../../afterRecords/components/Gap'
import styles from './index.module.scss'
import { requestSubscribeMessage } from '@tarojs/taro'
import { IS_WEB } from '@/constants'
type RouteParams = {
  /**
   * 数据id
   */
  repairId: number
  /**
   * 是否可编辑的，这里用来区分是 提交/修改 操作
   */
  isEdit: boolean
  /**
   * 提交成功之后会回调的函数，通常会用作 重新请求数据
   */
  onRefresh: () => void
}
export interface DetailsData extends GetAftersalesMobileRepairGoodsGetDetailByConsumerResponse {}
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
    if (!params.repairId || loading) {
      return
    }
    setLoading(true)
    getAftersalesMobileRepairGoodsGetDetailByConsumer({
      repairId: `${params.repairId}`,
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
    if (!details || !params.repairId) {
      return
    }
    if (!evaluate || !evaluate.content) {
      showToast({
        title: intl.formatMessage({
          id: 'repairTodo.repairSubmitFinished.evaluate.required',
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
    postAftersalesMobileRepairGoodsConfirmComplete({
      repairId: params.repairId,
      evaluate,
    })
      .then((res) => {
        if (res.code === 1000) {
          showToast({
            title: intl.formatMessage({
              id: 'repairTodo.repairSubmitFinished.submit.success',
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
    <View className={styles['repair-submit-finished']}>
      <AsPageHeader
        title={intl.formatMessage({
          id: 'repairTodo.repairSubmitFinished.nav',
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
            id: 'repairTodo.repairSubmitFinished.submit',
            defaultMessage: '提交评价',
          })}
        </Button>
      </View>
    </View>
  )
}
export default GlobalWrapper(RefundSubmitFinished)
