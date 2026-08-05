/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-24 17:47:32
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-03 17:52:44
 * @Description: 审核Form抽屉
 */
import React, { useEffect, useRef } from 'react'
import { Drawer, Button } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import NiceForm from '@/components/NiceForm'
import { createFormActions, createAsyncFormActions, FormEffectHooks, FormPath } from '@apps/formily'
import {
  getMemberSupplierDepositClassifyCategoryItems,
  getMemberSupplierDepositClassifyCity,
  getMemberSupplierDepositClassifyProvince,
} from '@apps/apis'
import { getProductCustomerGetCustomerCategoryTree } from '@apps/apis'
import { useLinkageUtils } from '@/utils/formEffectUtils'
import {
  PAY_TYPE_CASH,
  PAY_TYPE_PAYMENT_DAYS_DAY,
  PAY_TYPE_PAYMENT_DAYS_MONTH,
  PAY_TYPE_MONTHLY_STATEMENT,
} from '@/constants/settlement'
import { ArrayCards } from '@apps/formily'
import { schema } from './schema'
import { CategoryItemType, completeCategory } from '../../../../utils'
import CascaderFormItem from '../../../../components/CascaderFormItem'
import styles from './index.less'

type CategoriesType = {
  /**
   * 品类明细
   */
  details: {
    /**
     * 层级
     */
    level: number
    /**
     * 品类id
     */
    categoryId: number
    /**
     * 品类名称
     */
    name: string
  }[]
  /**
   * 结算方式
   */
  payType: number
  /**
   * 月份数
   */
  month?: number
  /**
   * 结算日
   */
  monthDay?: number
  /**
   * 天数
   */
  days?: number
  /**
   * 发票类型
   */
  invoiceType: number
  /**
   * 税点，只要百分比的分子部分，不要转换为小数
   */
  taxPoint: number
}

export type ValueType = {
  /**
   * 合作关系类型枚举
   */
  partnerType: number
  /**
   * 单次合作金额
   */
  maxAmount: number
  /**
   * 适用区域编码列表
   */
  areaCodes: {
    /**
     * 省编码
     */
    provinceCode: string
    /**
     * 市编码
     */
    cityCode: string
  }[]
  /**
   * 主营品类列表
   */
  categories: CategoriesType[]
}

interface FormValueType extends Omit<ValueType, 'maxAmount' | 'categories'> {
  /**
   * 会员编码
   */
  code: string
  /**
   * 单次合作金额
   */
  maxAmount: string
  /**
   * 主营品类列表
   */
  categories: {
    /**
     * 已选品类，id string[]
     */
    category: string[]
    /**
     * 结算方式
     */
    payType: number
    /**
     * 月份数
     */
    month?: string
    /**
     * 结算日
     */
    monthDay?: string
    /**
     * 天数
     */
    days?: string
    /**
     * 发票类型
     */
    invoiceType: number
    /**
     * 税点，只要百分比的分子部分，不要转换为小数
     */
    taxPoint: number
  }[]
}

type CategoryType = {
  /**
   * label
   */
  label: string
  /**
   * 值
   */
  value: string
  /**
   * 子元素
   */
  children: CategoryType[]
}

function recursionCategoryData(dataSource: CategoryItemType[]): CategoryType[] {
  const ret: CategoryType[] = []

  dataSource.forEach((item) => {
    const ele: CategoryType = {
      label: item.title,
      value: item.id,
      children: null,
    }
    if (item.children && item.children.length) {
      ele.children = recursionCategoryData(item.children)
    }
    ret.push(ele)
  })
  return ret
}

interface IProps {
  /**
   * 是否可见
   */
  visible: boolean
  /**
   * Form 确认事件
   */
  onSubmit: (values: ValueType) => void
  /**
   * 抽屉关闭事件
   */
  onClose: () => void
  /**
   * 合作关系
   */
  partnerTypes: {
    /**
     * label
     */
    label: string
    /**
     * value
     */
    value: number
  }[]
  /**
   * 确认按钮 loading
   */
  submitLoading: boolean
}

const formActions = createAsyncFormActions()
const { onFormInit$, onFieldValueChange$, onFieldInputChange$ } = FormEffectHooks

const ComingClassifyDrawer: React.FC<IProps> = (props: IProps) => {
  const { visible, onSubmit, onClose, partnerTypes, submitLoading } = props

  const categoryTreeRef = useRef<CategoryItemType[]>([])

  const intl = useIntl()

  useEffect(() => {
    if (partnerTypes && partnerTypes.length) {
      formActions.setFieldState('partnerType', (state) => {
        FormPath.setIn(state, 'props.enum', partnerTypes)
      })
    }
  }, [partnerTypes])

  const handleClose = () => {
    if (onClose) {
      onClose()
    }
  }

  const handleSubmit = (values: FormValueType) => {
    if (onSubmit) {
      const { maxAmount, categories, ...rest } = values
      const formated = categories.map((item) => {
        const categoryArr = completeCategory(item.category, categoryTreeRef.current)
        return {
          details: categoryArr.map((category, level) => ({
            level: level + 1,
            categoryId: +category.id,
            name: category.title,
          })),
          payType: item.payType,
          month: item.month ? +item.month : undefined,
          monthDay: item.monthDay ? +item.monthDay : undefined,
          days: item.days ? +item.days : undefined,
          invoiceType: item.invoiceType,
          taxPoint: +item.taxPoint,
        }
      })
      onSubmit({
        maxAmount: +maxAmount,
        categories: formated,
        ...rest,
      })
    }
  }

  const MemberCodeDescription = (
    <div className={styles.description}>
      <div>
        {intl.formatMessage({ id: 'member.management.memberPrComingClassify.drawer.form.classify.code.description-1' })}
      </div>
      <div>
        {intl.formatMessage({ id: 'member.management.memberPrComingClassify.drawer.form.classify.code.description-2' })}
      </div>
    </div>
  )

  const MemberCypher = (
    <div className={styles.description}>
      <div>
        {intl.formatMessage({
          id: 'member.management.memberPrComingClassify.drawer.form.classify.maxAmount.description-1',
        })}
      </div>
    </div>
  )

  const useBusinessEffects = () => {
    // 省级改变时，，请求出对应的市级数据
    onFieldInputChange$('areaCodes.*.provinceCode').subscribe((fieldState) => {
      formActions.setFieldState(
        FormPath.transform(fieldState.name, /\d/, ($1) => `areaCodes.${$1}.cityCode`),
        (state) => {
          FormPath.setIn(state, 'value', undefined)
        },
      )
    })

    // 省级改变时，，请求出对应的市级数据
    onFieldValueChange$('areaCodes.*.provinceCode').subscribe((fieldState) => {
      if (fieldState.value === undefined) {
        return
      }

      formActions.setFieldState(
        FormPath.transform(fieldState.name, /\d/, ($1) => `areaCodes.${$1}.cityCode`),
        (state) => {
          FormPath.setIn(state, 'props.x-props.hasFeedback', true)
          FormPath.setIn(state, 'loading', true)
        },
      )

      getMemberSupplierDepositClassifyCity({
        provinceCode: fieldState.value,
      })
        .then((res) => {
          if (res.code === 1000) {
            const { data = [] } = res
            const options = data.map((item) => ({ label: item.name, value: item.code }))
            formActions.setFieldState(
              FormPath.transform(fieldState.name, /\d/, ($1) => `areaCodes.${$1}.cityCode`),
              (state) => {
                FormPath.setIn(state, 'props.enum', options)
              },
            )
          }
        })
        .catch((err) => {
          console.warn(err)
        })
        .finally(() => {
          formActions.setFieldState(
            FormPath.transform(fieldState.name, /\d/, ($1) => `areaCodes.${$1}.cityCode`),
            (state) => {
              FormPath.setIn(state, 'loading', false)
            },
          )
        })
    })

    // 结算方式改变，联动显示对应的 FormItem
    onFieldValueChange$('categories.*.payType').subscribe((fieldState) => {
      formActions.setFieldState(
        FormPath.transform(
          fieldState.name,
          /\d/,
          ($1) => `categories.${$1}.*(PAYMENT_DAYS_MONTH_WRAP,PAYMENT_DAYS_DAY_WRAP,MONTHLY_TATEMENT_WRAP)`,
        ),
        (state) => {
          FormPath.setIn(state, 'visible', false)
        },
      )

      switch (fieldState.value) {
        case PAY_TYPE_CASH: {
          break
        }
        case PAY_TYPE_PAYMENT_DAYS_DAY: {
          formActions.setFieldState(
            FormPath.transform(fieldState.name, /\d/, ($1) => `categories.${$1}.PAYMENT_DAYS_MONTH_WRAP`),
            (state) => {
              FormPath.setIn(state, 'visible', true)
            },
          )
          break
        }
        case PAY_TYPE_PAYMENT_DAYS_MONTH: {
          formActions.setFieldState(
            FormPath.transform(fieldState.name, /\d/, ($1) => `categories.${$1}.PAYMENT_DAYS_DAY_WRAP`),
            (state) => {
              FormPath.setIn(state, 'visible', true)
            },
          )
          break
        }
        case PAY_TYPE_MONTHLY_STATEMENT: {
          formActions.setFieldState(
            FormPath.transform(fieldState.name, /\d/, ($1) => `categories.${$1}.MONTHLY_TATEMENT_WRAP`),
            (state) => {
              FormPath.setIn(state, 'visible', true)
            },
          )
          break
        }
        default:
          break
      }
    })
  }

  return (
    <Drawer
      title={intl.formatMessage({ id: 'member.management.memberPrComingClassify.drawer.title' })}
      width={620}
      onClose={handleClose}
      visible={visible}
      footer={
        <div
          style={{
            textAlign: 'right',
          }}
        >
          <Button onClick={handleClose} style={{ marginRight: 16 }}>
            {intl.formatMessage({ id: 'member.actions.cancel' })}
          </Button>
          <Button onClick={() => formActions.submit()} type="primary" loading={submitLoading}>
            {intl.formatMessage({ id: 'member.actions.confirm' })}
          </Button>
        </div>
      }
    >
      <NiceForm
        previewPlaceholder="' '"
        components={{
          ArrayCards,
          CascaderFormItem,
        }}
        expressionScope={{
          MemberCodeDescription,
          MemberCypher,
        }}
        effects={($, { setFieldState }) => {
          useBusinessEffects()

          onFormInit$().subscribe(() => {
            // 请求省级数据
            getMemberSupplierDepositClassifyProvince()
              .then((res) => {
                if (res.code === 1000) {
                  const { data = [] } = res
                  const options = data.map((item) => ({ label: item.name, value: item.code }))
                  formActions.setFieldState('areaCodes.*.provinceCode', (state) => {
                    FormPath.setIn(state, 'props.enum', options)
                  })
                }
              })
              .catch((err) => {
                console.warn(err)
              })

            // 请求会员品类数据
            getProductCustomerGetCustomerCategoryTree()
              .then((res) => {
                if (res.code === 1000) {
                  const { data = [] } = res
                  categoryTreeRef.current = data as CategoryItemType[]
                  formActions.setFieldState('categories.*.category', (state) => {
                    FormPath.setIn(state, 'props.x-component-props.options', data)
                  })
                }
              })
              .catch((err) => {
                console.warn(err)
              })

            // 请求结算方式与发票类型数据
            getMemberSupplierDepositClassifyCategoryItems()
              .then((res) => {
                if (res.code === 1000 && res.data) {
                  const { payTypes = [], invoiceTypes } = res.data
                  formActions.setFieldState('categories.*.payType', (state) => {
                    FormPath.setIn(
                      state,
                      'props.enum',
                      payTypes.map((item) => ({
                        label: item.payTypeName,
                        value: item.payType,
                      })),
                    )
                  })
                  formActions.setFieldState('categories.*.invoiceType', (state) => {
                    FormPath.setIn(
                      state,
                      'props.enum',
                      invoiceTypes.map((item) => ({
                        label: item.invoiceTypeName,
                        value: item.invoiceType,
                      })),
                    )
                  })
                }
              })
              .catch((err) => {
                console.warn(err)
              })
          })

          onFieldValueChange$('agree').subscribe((fieldState) => {
            setFieldState('reason', (state) => {
              state.title =
                fieldState.value === 0
                  ? intl.formatMessage({ id: 'member.management.common.form.reason.noPass' })
                  : intl.formatMessage({ id: 'member.management.common.form.reason.pass' })
              state.required = fieldState.value === 0
              setTimeout(() => {
                formActions.validate('reason')
              }, 0)
            })
          })
        }}
        actions={formActions}
        schema={schema}
        onSubmit={(values) => handleSubmit(values)}
      />
    </Drawer>
  )
}

export default ComingClassifyDrawer
