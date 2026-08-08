/*
 * @Author: XieZhiXiong
 * @Date: 2020-10-22 17:31:08
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2020-11-24 10:40:03
 * @Description: 联动逻辑相关
 */
import { FormEffectHooks, FormPath } from '@apps/formily'
import { useLinkageUtils } from '@/utils/formEffectUtils'
import { getOrderCommonPayChannels } from '@apps/apis'

const { onFieldInputChange$, onFieldValueChange$, onFormMount$ } = FormEffectHooks

export const useBusinessEffects = (context, actions) => {
  const { getFieldValue, setFieldValue, getFieldState, setFieldState } = actions
  const linkage = useLinkageUtils()

  // 初始化时获取默认的支付渠道
  onFormMount$().subscribe(() => {
    const getInitialPayChannels = async () => {
      try {
        const billInfo = context.billInfo || {}

        const res = await getOrderCommonPayChannels({
          payType: '2', // 默认使用线下支付
          memberId: `${billInfo.memberId}`,
          roleId: `${billInfo.memberRoleId}`,
        })

        if (res.code === 1000) {
          let options = res.data
            ? res.data.map((item) => ({
                label: item.payChannelName,
                value: item.payChannel,
              }))
            : []

          // 检查当前选择的支付方式，如果是通联支付则应用过滤
          const currentTradeType = getFieldValue('tradeType')
          if (currentTradeType === 6) {
            options = options.filter((item) => [11, 12, 15].includes(item.value))
          }

          // 使用setFieldState更新props.enum
          setFieldState('tradeChannel', (fieldState) => {
            fieldState.props = fieldState.props || {}
            fieldState.props.enum = options
          })
        }
      } catch (error) {
        setFieldState('tradeChannel', (fieldState) => {
          fieldState.props = fieldState.props || {}
          fieldState.props.enum = []
        })
      }
    }

    getInitialPayChannels()
  })

  // 还款金额 联动 滑块条
  onFieldInputChange$('repayQuota').subscribe((fieldState) => {
    linkage.value('amountSlide', +fieldState.value)
  })

  // 滑块条 联动 还款金额
  onFieldInputChange$('amountSlide').subscribe((fieldState) => {
    linkage.value('repayQuota', `${fieldState.value}`)
  })

  // 支付方式 联动 支付渠道
  onFieldValueChange$('tradeType').subscribe((fieldState) => {
    const { value } = fieldState

    if (value === 2) {
      linkage.hide('tradeChannel')
      // 清空支付渠道的值
      setFieldValue('tradeChannel', undefined)
    } else {
      // 显示支付渠道字段
      linkage.show('tradeChannel')

      // 根据选择的支付方式动态获取支付渠道
      const getPayChannels = async () => {
        try {
          // 从context中获取billInfo
          const billInfo = context.billInfo || {}

          const res = await getOrderCommonPayChannels({
            payType: `${value}`,
            memberId: `${billInfo.memberId}`,
            roleId: `${billInfo.memberRoleId}`,
          })

          if (res.code === 1000) {
            let options = res.data
              ? res.data.map((item) => ({
                  label: item.payChannelName,
                  value: item.payChannel,
                }))
              : []

            // 如果是通联支付（值为6），只保留payChannel为11、12、15的选项
            if (value === 6) {
              options = options.filter((item) => [11, 12, 15].includes(item.value))
            }

            // 先清空之前选择的支付渠道
            setFieldValue('tradeChannel', undefined)

            // 使用setFieldState更新props.enum
            setFieldState('tradeChannel', (fieldState) => {
              fieldState.props = fieldState.props || {}
              fieldState.props.enum = options
            })
          }
        } catch (error) {
          // 获取失败时，清空支付渠道选项
          setFieldValue('tradeChannel', undefined)
          setFieldState('tradeChannel', (fieldState) => {
            fieldState.props = fieldState.props || {}
            fieldState.props.enum = []
          })
        }
      }

      // 调用获取支付渠道的函数
      getPayChannels()
    }
  })
}
