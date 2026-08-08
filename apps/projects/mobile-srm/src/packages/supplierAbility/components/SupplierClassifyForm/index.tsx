/*
 * @Description: 供应商入库分类 Form
 */
import React, { useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { pxTransform, showLoading, hideLoading, showToast } from '@apps/mobile-services/utils/taro'
import { View } from '@apps/mobile-ui'
import { themeLayout } from '@/constants/theme'
import { limitByte } from '@/utils'
import { PATTERN_MAPS } from '@/constants/regExp'
import {
  getMemberMobileDepositClassifyCategoryItems,
  GetMemberMobileDepositClassifyCategoryItemsResponse,
} from '@apps/apis'
import MellowCard from '@/components/MellowCard'
import Select from '@/components/Select'
import { TAX_POINT_OPTIONS } from './const'
import Form from '../Form'
import { validateFields } from '../Form/utils/validateUtil'
import { RuleObject } from '../Form/typings'
import CustomInput from '../CustomInput'
import AreaSelectList, { AreaSelectListValueType } from '../AreaSelectList'
import ClassifyPayType, { ClassifyValueType } from '../ClassifyPayType'
import './index.scss'

export type FisishValuesType = {
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
  /**
   * 单次合作金额
   */
  maxAmount: string
  /**
   * 适用区域编码列表
   */
  areaCodes: AreaSelectListValueType
  /**
   * 主营品类列表
   */
  categories: ClassifyValueType
}

export type SupplierClassifySubmitValuesType = Omit<FisishValuesType, 'maxAmount'> & {
  /**
   * 单次合作金额
   */
  maxAmount: number
}

export type PartnerTypes = {
  /**
   * label
   */
  label: string
  /**
   * value
   */
  value: number
}[]

export interface SupplierClassifyFormProps {
  /**
   * 值，待定
   */
  value?: any
  /**
   * 表单触发finish回调
   */
  onFinishCallback?: (values: SupplierClassifySubmitValuesType) => void
  /**
   * 外部传入合作关系，一般是在入库分类操作时
   */
  partnerTypes?: PartnerTypes
}

export type SupplierClassifyFormRef = {
  /**
   * 触发Form submit事件
   */
  submit: () => void
}

const SupplierClassifyForm: React.ForwardRefRenderFunction<SupplierClassifyFormRef, SupplierClassifyFormProps> = (
  props: SupplierClassifyFormProps,
  ref,
) => {
  const { value, onFinishCallback, partnerTypes } = props

  const [partnerTypeOptions, setPartnerTypeOptions] = useState<PartnerTypes>([])
  const [depositClassifyItems, setDepositClassifyItems] =
    useState<GetMemberMobileDepositClassifyCategoryItemsResponse | null>(null)

  const [form] = Form.useForm()

  const rules = useRef<Map<string, RuleObject[]>>(
    new Map([
      [
        'code',
        [
          {
            required: true,
            message: '请输入会员编码',
          },
          {
            pattern: /^[a-zA-Z0-9_-]{1,10}$/,
            message: '请输入数字、英文、_-，最多支持10个字符',
          },
        ],
      ],
      [
        'partnerType',
        [
          {
            required: true,
            message: '请选择合作关系',
          },
        ],
      ],
      [
        'maxAmount',
        [
          {
            required: true,
            message: '请输入单次合作金额',
          },
          {
            pattern: PATTERN_MAPS.money,
            message: '请输入两位小数或整数的单次合作金额',
          },
        ],
      ],
      [
        'currencyType',
        [
          {
            required: true,
            message: '请选择币别',
          },
        ],
      ],
      [
        'remark',
        [
          {
            validator: (_, value) => {
              const resMsg = limitByte(value || '', { maxByte: 200 })
              if (resMsg) {
                return Promise.reject(new Error(`备注${resMsg}`))
              }
              return Promise.resolve()
            },
          },
        ],
      ],
      [
        'areaCodes',
        [
          {
            required: true,
            message: '请选择适用区域',
          },
          {
            validator: (_, value) => {
              const emptys = value?.filter((item) => !item || !item.provinceCode)
              if (emptys && emptys.length) {
                return Promise.reject(new Error('存在未选择的适用区域数据'))
              }
              return Promise.resolve()
            },
          },
        ],
      ],
      [
        'categories',
        [
          {
            required: true,
            message: '请添加结算方式',
          },
        ],
      ],
    ]),
  )

  useEffect(() => {
    if ('partnerTypes' in props) {
      setPartnerTypeOptions(partnerTypes || [])
    }
  }, [partnerTypes])

  const fetchDepositClassifyCategoryItems = () => {
    showLoading({ title: '正在加载...', mask: true })
    getMemberMobileDepositClassifyCategoryItems()
      .then((res) => {
        if (res.code === 1000) {
          setDepositClassifyItems(res.data)
          hideLoading()
        }
      })
      .finally(() => {
        // 在真机如果出现了 Toast 会消失的很快
        // hideLoading();
      })
  }

  useEffect(() => {
    fetchDepositClassifyCategoryItems()
  }, [])

  const handleFinish = async (values: FisishValuesType) => {
    const valueErrors = await validateFields(values, rules.current)
    if (valueErrors.length) {
      showToast({ title: valueErrors[0].errors?.[0], icon: 'none' })
      return
    }
    onFinishCallback?.({
      ...values,
      maxAmount: +values.maxAmount,
    })
  }

  const currencyTypes = useMemo(() => {
    if (!depositClassifyItems || !depositClassifyItems.currencyTypes || !depositClassifyItems.currencyTypes.length) {
      return []
    }
    return depositClassifyItems.currencyTypes.map((item) => ({
      label: item.currencyTypeName,
      value: item.currencyType,
    }))
  }, [depositClassifyItems])

  const advanceCharges = useMemo(() => {
    if (!depositClassifyItems || !depositClassifyItems.advanceCharges || !depositClassifyItems.advanceCharges.length) {
      return []
    }
    return depositClassifyItems.advanceCharges.map((item) => ({
      label: item.advanceChargeTypeName,
      value: item.advanceChargeType,
    }))
  }, [depositClassifyItems])

  const payTypes = useMemo(() => {
    if (!depositClassifyItems || !depositClassifyItems.payTypes || !depositClassifyItems.payTypes.length) {
      return []
    }
    return depositClassifyItems.payTypes.map((item) => ({
      label: item.payTypeName,
      value: item.payType,
    }))
  }, [depositClassifyItems])

  const settlementDocuments = useMemo(() => {
    if (
      !depositClassifyItems ||
      !depositClassifyItems.settlementDocuments ||
      !depositClassifyItems.settlementDocuments.length
    ) {
      return []
    }
    return depositClassifyItems.settlementDocuments.map((item) => ({
      label: item.settlementDocumentsTypeName,
      value: item.settlementDocumentsType,
    }))
  }, [depositClassifyItems])

  const paymentTypes = useMemo(() => {
    if (!depositClassifyItems || !depositClassifyItems.paymentTypes || !depositClassifyItems.paymentTypes.length) {
      return []
    }
    return depositClassifyItems.paymentTypes.map((item) => ({
      label: item.paymentTypeName,
      value: item.paymentType,
    }))
  }, [depositClassifyItems])

  const invoiceTypes = useMemo(() => {
    if (!depositClassifyItems || !depositClassifyItems.invoiceTypes || !depositClassifyItems.invoiceTypes.length) {
      return []
    }
    return depositClassifyItems.invoiceTypes.map((item) => ({
      label: item.invoiceTypeName,
      value: item.invoiceType,
    }))
  }, [depositClassifyItems])

  const taxPoints = useMemo(() => TAX_POINT_OPTIONS, [])

  useImperativeHandle(ref, () => ({
    submit: () => form.submit(),
  }))

  return (
    <View className="supplier-deposit">
      <Form form={form} onFinish={handleFinish}>
        <MellowCard
          title="分类信息"
          headStyle={{
            paddingRight: 0,
            paddingLeft: 0,
            marginRight: pxTransform(themeLayout['margin-s']),
            marginLeft: pxTransform(themeLayout['margin-s']),
          }}
          bodyStyle={{
            paddingTop: 0,
            paddingBottom: 0,
          }}
        >
          <Form.Item label="会员编码" name="code" description='长度最多10位；不可重复，支持英文"_-"下划线和中划线'>
            <CustomInput placeholder="点击输入" />
          </Form.Item>
          <Form.Item label="合作关系" name="partnerType">
            <Select title="选择合作关系" placeholder="请选择" options={partnerTypeOptions} contentAlign="right" />
          </Form.Item>
          <Form.Item label="单次合作金额" name="maxAmount" description="允许单次采购最大金额" labelWidth={100}>
            <CustomInput placeholder="点击输入" maxlength={8} />
          </Form.Item>
          <Form.Item label="币别" name="currencyType">
            <Select title="选择币别" placeholder="请选择" options={currencyTypes} contentAlign="right" />
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <CustomInput placeholder="(选填)最长200个字符，100个汉字" />
          </Form.Item>
        </MellowCard>
        <Form.Item
          name="areaCodes"
          customContentStyle={{
            paddingTop: 0,
            paddingBottom: 0,
          }}
        >
          <AreaSelectList
            customStyle={{
              marginTop: pxTransform(themeLayout['padding-xs']),
            }}
          />
        </Form.Item>
        {/* 结算方式于主营品类 */}
        <Form.Item
          name="categories"
          customContentStyle={{
            padding: 0,
          }}
        >
          <ClassifyPayType
            customStyle={{
              marginTop: pxTransform(themeLayout['padding-xs']),
            }}
            payTypes={payTypes}
            advanceCharges={advanceCharges}
            settlementDocuments={settlementDocuments}
            paymentTypes={paymentTypes}
            invoiceTypes={invoiceTypes}
            taxPoints={taxPoints}
            editable
          />
        </Form.Item>
      </Form>
    </View>
  )
}

const SupplierClassifyFormForWard = React.forwardRef<SupplierClassifyFormRef, SupplierClassifyFormProps>(
  SupplierClassifyForm,
)

export default SupplierClassifyFormForWard
