import { useEffect, useMemo } from 'react'
import { useProductForm, validateSpecsAttr } from '@apps/services/commodity'
import { Form } from '@linkseeks/ui'

// 重新理一下思路

export const useSpecsFormData = () => {
  const { transformAttr, isSingleSpecs } = useProductForm()
  const formInstance = Form.useFormInstance()
  // 通过form开始校验所有的规格属性
  // 无论是必填还是非必填的都会触发校验，如果非必填则无事发生

  // 判断必填的商品规格是否都选中了
  // 这里利用antd的Form收集了 所有的动态规格属性字段，如果有必填的字段，则会触发校验
  const handleCheckRequired = async () => {
    if (isSingleSpecs) {
      // 单规格情况下直接返回
      return {}
    }
    try {
      const target = await validateSpecsAttr(formInstance, true)
      // 过滤掉value是 undefined的值，代表那些不是必填的项不需要参与已选中的规格属性
      return target ? transformAttr(target) : null
    } catch (error) {
      console.log(error)
      return null
    }
  }

  return {
    handleCheckRequired,
  }
}
