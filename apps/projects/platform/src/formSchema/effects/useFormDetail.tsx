import { useEffect, useState } from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import { FormEffectHooks, ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'

/**
 * 带锚点跳转式schema表单 hook
 * @returns
 */

export const useFormDetail = () => {
  // 表单数据
  const [formData, setFormData] = useState<any>(null)
  // 完成度
  const [formProcess, setFormProcess] = useState<string | number>()
  // 总交互字段数
  const [amount, setAomunt] = useState<number>(0)
  // 输入数
  const [inputAmount, setInputAomunt] = useState<number>(0)
  // 有效统计字段
  const effectFields = []
  // 用于收集 schema表单内置组件Form表单的校验error
  const [innerFormErrors, setInnerFormErrors] = useState<number>(0)

  // 需要统计条目数和对应schema title的映射
  const [countAmountMap, setCountAmountMap] = useState<any>()

  useEffect(() => {
    if (amount > 0) {
      setFormProcess(() => (inputAmount / amount).toFixed(2))
    }
  }, [amount, inputAmount])

  /**
   * 收集表单完成度逻辑
   * 若需要统计表单有效字段完成度，需要把此函数注入到NiceForm的effects里面
   * @param ctx FormActions
   */
  const useAttachmentChangeForContext = (ctx: ISchemaFormActions | ISchemaFormAsyncActions) => {
    FormEffectHooks.onFormMount$().subscribe(() => {
      setFormProcess(0) // 表单初始化至0
      const fieldTree = ctx.getFormGraph()
      let fieldAmount = 0
      for (let item in fieldTree) {
        const value = fieldTree[item]
        if (value['displayName'] === 'FieldState' && value['visible'] && value['display']) {
          ++fieldAmount
          effectFields.push(value['name'])
        }
      }
      setAomunt(fieldAmount)
    })

    FormEffectHooks.onFormValuesChange$().subscribe((values) => {
      // @todo 若输入再清除 其实表单值存在 只不过为''或者undefined
      // 编辑的时候 初始值可能会有很多 过滤有效字段数
      setInputAomunt(() => {
        let inputNumber = 0
        Object.keys(values.values).forEach((item) => {
          if (effectFields.includes(item)) {
            ++inputNumber
          }
        })
        return inputNumber
      })
    })
  }

  /**
   * 收集表单数组类型数据长度，生成长度数值和crad title字字符映射
   * 若需要统计表单数组类型数据长度，同时把长度值更新至Anchor title上面，则需要把此函数注入到NiceForm的effects里面
   * @param ctx FormActions
   * @param keys String[]
   */
  const useAnchorCountChangeForContext = (ctx: ISchemaFormActions | ISchemaFormAsyncActions, keys: string[]) => {
    if (Array.isArray(keys)) {
      keys.forEach((element) => {
        FormEffectHooks.onFieldValueChange$(element).subscribe((state) => {
          // 过滤出title字符串
          const _graphKeys = Object.keys(ctx.getFormGraph())
          const _hasKeyIndex = _graphKeys.findIndex((item) => item.indexOf(element) !== -1)
          if (_hasKeyIndex >= 0) {
            setCountAmountMap(() => ({
              ...countAmountMap,
              [_graphKeys[_hasKeyIndex].split('.')[0]]: state['value']['length'],
            }))
          }
        })
      })
    }
  }

  // 需共享的状态
  const formContext = {
    data: formData,
    formProcess,
    innerFormErrors,
    countAmountMap,
    ctl: {
      setFormData,
      setFormProcess,
      setInnerFormErrors,
    },
    useAttachmentChangeForContext,
    useAnchorCountChangeForContext,
  }

  return {
    formContext,
    // id,
  }
}
