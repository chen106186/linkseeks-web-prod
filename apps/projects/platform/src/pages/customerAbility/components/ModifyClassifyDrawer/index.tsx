/*
 * @Author: XieZhiXiong
 * @Date: 2021-07-07 15:21:00
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-04 16:06:39
 * @Description: 修改入库分类信息 抽屉
 */
import React, { useEffect, useRef } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Drawer, Button } from 'antd'
import NiceForm from '@/components/NiceForm'
import { createAsyncFormActions, FormEffectHooks, FormPath } from '@apps/formily'
import { ArrayCards } from '@apps/formily'
import {
  getMemberCustomerAbilityMaintenanceDetailRecordClassifyCategoryItems,
  getMemberCustomerAbilityMaintenanceDetailRecordClassifyCity,
  getMemberCustomerAbilityMaintenanceDetailRecordClassifyProvince,
  getMemberCustomerDepositClassifyCategoryItems,
  getMemberCustomerDepositClassifyCity,
  getMemberCustomerDepositClassifyProvince,
} from '@apps/apis'
import { getProductCustomerGetCustomerCategoryTree } from '@apps/apis'
import {
  PAY_TYPE_CASH,
  PAY_TYPE_MONTHLY_STATEMENT,
  PAY_TYPE_PAYMENT_DAYS_DAY,
  PAY_TYPE_PAYMENT_DAYS_MONTH,
} from '@/constants/settlement'
import { schema } from './schema'
import { CategoryItemType, completeCategory } from '../../utils'
import CascaderFormItem from '../CascaderFormItem'
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
  /**
   * 预付款
   */
  advanceCharge: number
  /**
   * 结算单据
   */
  settlementDocuments: number
  /**
   * 付款方式
   */
  paymentType: number
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
   * 币别
   */
  currencyType: number
  /**
   * 备注
   */
  remark: string
  /**
   * 主营品类列表
   */
  categories: CategoriesType[]
  /**
   * 是否通过
   */
  agree?: number
  /**
   * 通过理由
   */
  reason?: string
}

export interface FormValueType extends Omit<ValueType, 'maxAmount' | 'categories' | 'agree' | 'reason'> {
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
    /**
     * 预付款
     */
    advanceCharge: number
    /**
     * 结算单据
     */
    settlementDocuments: number
    /**
     * 付款方式
     */
    paymentType: number
  }[]
}

export type PartnerTypesItem = {
  /**
   * label
   */
  label: string
  /**
   * value
   */
  value: number
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
  partnerTypes: PartnerTypesItem[]
  /**
   * 值
   */
  value?: FormValueType
  /**
   * 确认按钮 loading
   */
  submitLoading: boolean
  /**
   * 是否可审核的，默认 0
   */
  isVerify?: 0 | 1
}

const formActions = createAsyncFormActions()
const { onFormInit$, onFieldValueChange$, onFieldInputChange$ } = FormEffectHooks

// 省级接口map
const PROVINCE_API_MAP = {
  0: getMemberCustomerAbilityMaintenanceDetailRecordClassifyProvince,
  1: getMemberCustomerDepositClassifyProvince,
}
// 会员品类接口map
const CATEGORY_TREE_API_MAP = {
  0: getProductCustomerGetCustomerCategoryTree,
  1: getProductCustomerGetCustomerCategoryTree,
}
// 结算类型、发票类型接口map
const ITEMS_API_MAP = {
  0: getMemberCustomerAbilityMaintenanceDetailRecordClassifyCategoryItems,
  1: getMemberCustomerDepositClassifyCategoryItems,
}
// 城市接口map
const CITY_API_MAP = {
  0: getMemberCustomerAbilityMaintenanceDetailRecordClassifyCity,
  1: getMemberCustomerDepositClassifyCity,
}

const ComingClassifyDrawer: React.FC<IProps> = (props: IProps) => {
  const { visible, onSubmit, onClose, partnerTypes, value, submitLoading, isVerify = 0 } = props

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
          advanceCharge: item.advanceCharge,
          settlementDocuments: item.settlementDocuments,
          paymentType: item.paymentType,
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
        {intl.formatMessage({
          id: 'customerAbility.management.memberPrComingClassify.drawer.form.classify.code.description-1',
        })}
      </div>
      <div>
        {intl.formatMessage({
          id: 'customerAbility.management.memberPrComingClassify.drawer.form.classify.code.description-2',
        })}
      </div>
    </div>
  )

  const MemberCypher = (
    <div className={styles.description}>
      <div>
        {intl.formatMessage({
          id: 'customerAbility.management.memberPrComingClassify.drawer.form.classify.maxAmount.description-1',
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

      CITY_API_MAP[isVerify]({
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
      title={intl.formatMessage({ id: 'customerAbility.management.memberPrComingClassify.drawer.title' })}
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
            {intl.formatMessage({ id: 'customerAbility.actions.cancel' })}
          </Button>
          <Button onClick={() => formActions.submit()} type="primary" loading={submitLoading}>
            {intl.formatMessage({ id: 'customerAbility.actions.confirm' })}
          </Button>
        </div>
      }
    >
      <NiceForm
        previewPlaceholder="' '"
        initialValues={value}
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
            PROVINCE_API_MAP[isVerify]()
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
            CATEGORY_TREE_API_MAP[isVerify]()
              .then((res) => {
                if (res.code === 1000) {
                  const { data = [] } = res
                  categoryTreeRef.current = data as unknown as CategoryItemType[]
                  formActions.setFieldState('categories.*.category', (state) => {
                    FormPath.setIn(state, 'props.x-component-props.options', data)
                  })
                }
              })
              .catch((err) => {
                console.warn(err)
              })

            // 请求结算方式与发票类型数据
            ITEMS_API_MAP[isVerify]()
              .then((res) => {
                if (res.code === 1000 && res.data) {
                  const {
                    payTypes = [],
                    invoiceTypes = [],
                    advanceCharges = [],
                    paymentTypes = [],
                    settlementDocuments = [],
                    currencyTypes = [],
                  } = res.data
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
                  formActions.setFieldState('categories.*.advanceCharge', (state) => {
                    FormPath.setIn(
                      state,
                      'props.enum',
                      advanceCharges.map((item) => ({
                        label: item.advanceChargeTypeName,
                        value: item.advanceChargeType,
                      })),
                    )
                  })
                  formActions.setFieldState('categories.*.paymentType', (state) => {
                    FormPath.setIn(
                      state,
                      'props.enum',
                      paymentTypes.map((item) => ({
                        label: item.paymentTypeName,
                        value: item.paymentType,
                      })),
                    )
                  })
                  formActions.setFieldState('categories.*.settlementDocuments', (state) => {
                    FormPath.setIn(
                      state,
                      'props.enum',
                      settlementDocuments.map((item) => ({
                        label: item.settlementDocumentsTypeName,
                        value: item.settlementDocumentsType,
                      })),
                    )
                  })
                  formActions.setFieldState('currencyType', (state) => {
                    FormPath.setIn(
                      state,
                      'props.enum',
                      currencyTypes.map((item) => ({
                        label: item.currencyTypeName,
                        value: item.currencyType,
                      })),
                    )
                  })
                }
              })
              .catch((err) => {
                console.warn(err)
              })

            if (isVerify === 0) {
              setFieldState('VERIFY_APPLY', (state) => {
                state.visible = false
              })
            }
          })

          onFieldValueChange$('agree').subscribe((fieldState) => {
            setFieldState('reason', (state) => {
              state.title =
                fieldState.value === 0
                  ? intl.formatMessage({ id: 'customerAbility.management.common.form.reason.noPass' })
                  : intl.formatMessage({ id: 'customerAbility.management.common.form.reason.pass' })
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
