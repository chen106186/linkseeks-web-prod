/*
 * @Description: 会员分类信息pro
 */
import React, { useEffect, useRef, useState, useImperativeHandle } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Button, Spin } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import NiceForm from '@/components/NiceForm'
import { createAsyncFormActions, FormEffectHooks, FormPath } from '@apps/formily'
import { ArrayCards, ArrayTable } from '@apps/formily'
import {
  getMemberCustomerAbilityMaintenanceDetailRecordClassify,
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
import themeConfig from '@apps/config/lingxi.theme.config'
import MellowCard, { MellowCardProps } from '@/components/MellowCard'
import { schema } from './schema'
import {
  breakUpCategory,
  CategoryItemType,
  CategoryType,
  getCategoryAllKeys,
  getCategoryPath,
  nestedCategory,
} from './utils'
import CascaderFormItem from '../CascaderFormItem'
import PayTypeFiled, { PayTypeFiledValueType } from './components/PayTypeFiled'
import TreeSelectField from './components/TreeSelectField'
import IndexField from './components/IndexField'
import styles from './index.less'
import { useWebIntl } from '@apps/locales'

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

type CategoriesBasicValueItem = {
  /**
   * 发票类型
   */
  invoiceType?: number
  /**
   * 税点，只要百分比的分子部分，不要转换为小数
   */
  taxPoint?: number
  /**
   * 预付款
   */
  advanceCharge?: number
  /**
   * 结算单据
   */
  settlementDocuments?: number
  /**
   * 付款方式
   */
  paymentType?: number
  /**
   * 品类明细
   */
  details?: string[]
}

type CategoriesValueItemType = CategoriesBasicValueItem & {
  /**
   * 结算方式
   */
  payType?: PayTypeFiledValueType
}

export type FormSubmitBasicValueType = {
  /**
   * 会员编码
   */
  code: string
  /**
   * 合作关系类型枚举
   */
  partnerType: number
  /**
   * 币别
   */
  currencyType: number
  /**
   * 备注
   */
  remark: string
}

export type AreaCodesItemType = {
  /**
   * 省编码
   */
  provinceCode: string
  /**
   * 市编码
   */
  cityCode: string
}

export type FormSubmitValueType = FormSubmitBasicValueType & {
  /**
   * 单次合作金额
   */
  maxAmount: string
  /**
   * 适用区域编码列表
   */
  areaCodes: AreaCodesItemType[]
  /**
   * 主营品类列表
   */
  categories: CategoriesValueItemType[]
  /**
   * 适用区域
   */
  classifyAreas?: string
}

type SubmitCategoriesValueType = Omit<CategoriesBasicValueItem, 'details'> & {
  payType: number
  month: number
  monthDay: number
  days: number
  details: CategoryType[]
  isDefault?: number
}

export type SubmitValueType = FormSubmitBasicValueType & {
  maxAmount: number
  /**
   * 适用区域编码列表
   */
  areaCodes: AreaCodesItemType[]
  categories: SubmitCategoriesValueType[]
}

export interface ValueType extends SubmitValueType {
  /**
   * 合作类型名称
   */
  partnerTypeName: string
  /**
   * 适用区域
   */
  classifyAreas: string[]
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

export interface MemberDocCategoryProProps extends Omit<MellowCardProps, 'onSubmit'> {
  /**
   * 值
   */
  value?: ValueType
  /**
   * 是否可审核的，默认 0
   */
  isVerify?: 0 | 1
  /**
   * 审核id
   */
  validateId?: string
  /**
   * submit触发事件
   */
  onSubmit?: (values: SubmitValueType) => void | Promise<void>
  /**
   * 点击完成触发事件
   */
  onFinish?: () => void
  /**
   * 是否可编辑的
   */
  editable?: boolean
  /**
   * 外部传入合作关系
   */
  partnerTypes?: PartnerTypesItem[]
}

export type MemberDocCategoryProRef = {
  /**
   * 触发表单 submit 事件
   */
  submit: () => void
}

const MemberDocCategoryPro: React.ForwardRefRenderFunction<MemberDocCategoryProRef, MemberDocCategoryProProps> = (
  props,
  ref,
) => {
  const { value, isVerify = 0, validateId, onSubmit, onFinish, editable, partnerTypes, ...rest } = props

  const [classifyInfo, setClassifyInfo] = useState<FormSubmitValueType>()
  const [infoLoading, setInfoLoading] = useState(false)
  const [isModify, setIsModify] = useState(false)
  const [finishing, setFinishing] = useState(false)

  const categoryTreeRef = useRef<{}>({})

  const intl = useIntl()

  const isEditable = editable || isModify
  const translate = useWebIntl()
  useEffect(() => {
    if ('value' in props && value) {
      const { categories, maxAmount, classifyAreas, ...rest } = value
      const defaultCategoriesValue = [{ categoryId: 0, children: [], level: 1, name: '全部', parentId: 0 }]
      const isDefaultFlag = categories.some((item) => item?.isDefault == 1)
      let _categories = categories?.map(({ payType, month, monthDay, days, details, isDefault = 0, ...rest }) => ({
        ...rest,
        details: getCategoryAllKeys(isDefault ? defaultCategoriesValue : details),
        payType: {
          payType,
          month: month ? `${month}` : '',
          monthDay: monthDay ? `${monthDay}` : '',
          days: days ? `${days}` : '',
        },
      }))
      //编辑时，没有'全部'则在第一条数据加上全部品类
      if (!isDefaultFlag && isEditable) {
        _categories.unshift({ details: ['0'] })
      }
      setClassifyInfo({
        maxAmount: `${maxAmount}`,
        ...rest,
        categories: _categories,
        classifyAreas: classifyAreas?.join('；'),
      })
    }
    /* 初始化有一条数据品类为'全部' */
    if (!value?.categories?.length && isEditable) {
      setClassifyInfo({ ...classifyInfo, ...{ categories: [{ details: ['0'] }] } })
    }
  }, [value, isEditable])

  useEffect(() => {
    if ('partnerTypes' in props && partnerTypes && partnerTypes.length) {
      formActions.setFieldState('partnerType', (state) => {
        FormPath.setIn(state, 'props.enum', partnerTypes)
      })
    }
  }, [partnerTypes])

  useEffect(() => {
    /* 初始化有一条数据品类为'全部' */
    if (isEditable && !value?.categories?.length) {
      setClassifyInfo({ ...classifyInfo, ...{ categories: [{ details: ['0'] }] } })
    }
  }, [isEditable, value])

  const getClassifyRecord = () => {
    if (!validateId) {
      return
    }
    setInfoLoading(true)
    getMemberCustomerAbilityMaintenanceDetailRecordClassify({
      validateId,
    })
      .then((res) => {
        if (res.code === 1000) {
          const defaultCategoriesValue = [{ categoryId: 0, children: [], level: 1, name: '全部', parentId: 0 }]
          const isDefaultFlag = res.data?.categories.some((item) => item?.isDefault == 1)
          let _categories = res.data?.categories.map(
            ({ details, payType, month, monthDay, days, taxPoint, isDefault = 0, ...rest }) => ({
              details: getCategoryAllKeys((isDefault ? defaultCategoriesValue : details) as unknown as CategoryType[]),
              payType: {
                payType,
                month: month ? `${month}` : '',
                monthDay: monthDay ? `${monthDay}` : '',
                days: days ? `${days}` : '',
              },
              taxPoint: +taxPoint * 100,
              ...rest,
            }),
          )
          //编辑时，没有'全部'则在第一条数据加上全部品类
          if (!isDefaultFlag) {
            _categories.unshift({ details: ['0'] })
          }
          setClassifyInfo({
            code: res.data?.code,
            partnerType: res.data?.partnerType,
            maxAmount: `${res.data?.maxAmount ? parseFloat(res.data?.maxAmount) : ''}`,
            areaCodes: res.data?.areaCodes,
            categories: _categories,
            currencyType: res.data?.currencyType,
            remark: res.data?.remark,
          })
          const partnerTypes = res.data?.partnerTypes.map((item) => ({
            value: item.id,
            label: item.text,
          }))
          formActions.setFieldState('partnerType', (state) => {
            FormPath.setIn(state, 'props.enum', partnerTypes)
          })
        }
      })
      .catch((err) => {
        console.warn(err)
      })
      .finally(() => {
        setInfoLoading(false)
      })
  }

  const handleSubmit = (values: FormSubmitValueType) => {
    if (onSubmit) {
      const { maxAmount, categories, ...rest } = values
      const formated = categories.map((item) => {
        const details = item.details.filter((_item) => _item != '0')
        const categoryArr = details.map((category) => getCategoryPath(category, categoryTreeRef.current))
        const genealogies = categoryArr.map((item) => nestedCategory(item))
        return {
          details: genealogies,
          payType: item.payType?.payType,
          month: item.payType?.month ? +item.payType?.month : undefined,
          monthDay: item.payType?.monthDay ? +item.payType?.monthDay : undefined,
          days: item.payType?.days ? +item.payType?.days : undefined,
          invoiceType: item.invoiceType,
          taxPoint: +item.taxPoint,
          advanceCharge: item.advanceCharge,
          settlementDocuments: item.settlementDocuments,
          paymentType: item.paymentType,
          isDefault: genealogies.length > 0 ? 0 : 1,
        }
      })
      const res = onSubmit({
        maxAmount: +maxAmount,
        categories: formated,
        ...rest,
      })
      if (res instanceof Promise) {
        setFinishing(true)
        res
          .then(() => {
            setIsModify(false)
          })
          .finally(() => {
            setFinishing(false)
          })
      }
    }
  }

  const MemberCodeDescription = isEditable ? (
    <div className={styles.description}>
      <span>
        {intl.formatMessage({
          id: 'customerAbility.management.memberPrComingClassify.drawer.form.classify.code.description-1',
          defaultMessage: '长度最多10位，不可重复',
        })}
      </span>
      <span>
        {intl.formatMessage({
          id: 'customerAbility.management.memberPrComingClassify.drawer.form.classify.code.description-2',
          defaultMessage: '不支持特殊符号(除英文"_-";下划线和中划线)',
        })}
      </span>
    </div>
  ) : null

  const MemberCypher = isEditable ? (
    <div className={styles.description}>
      <div>
        {intl.formatMessage({
          id: 'customerAbility.management.memberPrComingClassify.drawer.form.classify.maxAmount.description-1',
          defaultMessage: '允许单次采购最大金额',
        })}
      </div>
    </div>
  ) : null

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
  }

  const renderAddition = () => {
    return (
      <Button
        icon={<PlusOutlined />}
        type="dashed"
        // style={{
        //   marginTop: themeConfig['@margin-md'],
        // }}
        block
      >
        {intl.formatMessage({ id: 'common.button.addition', defaultMessage: '添加' })}
      </Button>
    )
  }

  const handleRemove = async (index: number) => {
    const mutators = await formActions.createMutators('categories')
    mutators.remove(index)
  }

  const renderRemove = (index: number) => {
    return (
      index !== 0 && (
        <Button
          type="link"
          onClick={() => handleRemove(index)}
          style={{
            width: 66,
          }}
        >
          <a>{intl.formatMessage({ id: 'common.button.delete', defaultMessage: '删除' })}</a>
        </Button>
      )
    )
  }

  const handleModify = () => {
    setIsModify(true)
    getClassifyRecord()
  }

  const handleFinish = () => {
    onFinish?.()
  }

  useImperativeHandle(ref, () => ({
    submit: () => formActions.submit(),
  }))

  return (
    <MellowCard
      title={intl.formatMessage({
        id: 'customerAbility.components.MemberDocCategory.title',
        defaultMessage: '分类信息',
      })}
      extra={
        <>
          {validateId && (
            <>
              {!isModify ? (
                <Button type="link" loading={infoLoading} onClick={handleModify}>
                  {intl.formatMessage({
                    id: 'customerAbility.components.MemberDocCategory.edit',
                    defaultMessage: '编辑',
                  })}
                </Button>
              ) : (
                <Button type="link" loading={finishing} onClick={handleFinish}>
                  {intl.formatMessage({ id: 'common.button.submit', defaultMessage: '提交' })}
                </Button>
              )}
            </>
          )}
        </>
      }
      {...rest}
    >
      <Spin spinning={infoLoading}>
        <NiceForm
          previewPlaceholder=" "
          value={classifyInfo}
          components={{
            ArrayCards,
            ArrayTable,
            CascaderFormItem,
            PayTypeFiled,
            TreeSelectField,
            IndexField,
          }}
          expressionScope={{
            MemberCodeDescription,
            MemberCypher,
            renderAddition,
            renderRemove,
          }}
          effects={($, { setFieldState, getFieldValue }) => {
            useBusinessEffects()

            onFormInit$().subscribe(() => {
              // 禁用品类'全部'
              formActions.setFieldState('categories.*.details', (state) => {
                FormPath.setIn(state, 'props.x-component-props.disabledKeys', ['0'])
              })
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
                    /* id=0——>全部，已跟后端确认，不会出现id=0的品类 */
                    const list = [
                      { checked: false, parentId: '0', id: '0', title: translate('web.common.all') },
                      ...data,
                    ]
                    // categoryTreeRef.current = data as unknown as CategoryItemType[];
                    categoryTreeRef.current = breakUpCategory(list as unknown as CategoryItemType[])
                    formActions.setFieldState('categories.*.details', (state) => {
                      FormPath.setIn(state, 'props.x-component-props.treeData', list)
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
                    const { payTypes, invoiceTypes, advanceCharges, paymentTypes, settlementDocuments, currencyTypes } =
                      res.data
                    formActions.setFieldState('categories.*.payType', (state) => {
                      FormPath.setIn(
                        state,
                        'props.enum',
                        payTypes?.map((item) => ({
                          label: item.payTypeName,
                          value: item.payType,
                        })),
                      )
                    })
                    formActions.setFieldState('categories.*.invoiceType', (state) => {
                      FormPath.setIn(
                        state,
                        'props.enum',
                        invoiceTypes?.map((item) => ({
                          label: item.invoiceTypeName,
                          value: item.invoiceType,
                        })),
                      )
                    })
                    formActions.setFieldState('categories.*.advanceCharge', (state) => {
                      FormPath.setIn(
                        state,
                        'props.enum',
                        advanceCharges?.map((item) => ({
                          label: item.advanceChargeTypeName,
                          value: item.advanceChargeType,
                        })),
                      )
                    })
                    formActions.setFieldState('categories.*.paymentType', (state) => {
                      FormPath.setIn(
                        state,
                        'props.enum',
                        paymentTypes?.map((item) => ({
                          label: item.paymentTypeName,
                          value: item.paymentType,
                        })),
                      )
                    })
                    formActions.setFieldState('categories.*.settlementDocuments', (state) => {
                      FormPath.setIn(
                        state,
                        'props.enum',
                        settlementDocuments?.map((item) => ({
                          label: item.settlementDocumentsTypeName,
                          value: item.settlementDocumentsType,
                        })),
                      )
                    })
                    formActions.setFieldState('currencyType', (state) => {
                      FormPath.setIn(
                        state,
                        'props.enum',
                        currencyTypes?.map((item) => ({
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
            })

            // 品类改变触发联动 品类禁用项
            onFieldValueChange$('categories.*.details').subscribe(async (fieldState) => {
              const categoriesValue = await getFieldValue('categories')
              const allDetailsCheckedKeys = categoriesValue.reduce((pre, now) => pre.concat(now.details), [])
              formActions.setFieldState('categories.*.details', (state) => {
                FormPath.setIn(state, 'props.x-component-props.disabledKeys', [...allDetailsCheckedKeys, '0'])
              })
            })
          }}
          actions={formActions}
          schema={schema(isEditable)}
          onSubmit={handleSubmit}
          editable={isEditable}
        />
      </Spin>
    </MellowCard>
  )
}

const MemberDocCategoryProForWard = React.forwardRef<MemberDocCategoryProRef, MemberDocCategoryProProps>(
  MemberDocCategoryPro,
)

export default MemberDocCategoryProForWard
