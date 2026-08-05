/*
 * @Author: XieZhiXiong
 * @Date: 2021-08-17 10:22:51
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-17 19:31:55
 * @Description: 退货发货抽屉
 */
import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Drawer, Button } from 'antd'
import { createAsyncFormActions, FormEffectHooks, FormPath } from '@apps/formily'
import { ArrayTable } from '@apps/formily'
import { getLogisticsSelectListCompany } from '@apps/apis'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import NiceForm from '@/components/NiceForm'
import { useLinkageUtils } from '@/utils/formEffectUtils'
import { AddressValueType } from '@/components/AddressSelect/components/AddressRadioGroup'
import { createSchema, TYPE_NAME_MAP, FLOW_TYPE_NAME_MAP } from './schema'

const formActions = createAsyncFormActions()
const { onFieldInputChange$, onFormInit$ } = FormEffectHooks

export type ValuesType = {
  /**
   * 发货时间
   */
  deliveryTime: string
  /**
   * 物流公司
   */
  logisticsName?: number
  /**
   * 物流公司名称
   */
  logisticsNameTxt?: string
  /**
   * 物流单号
   */
  logisticsOrderNo?: string
  /**
   * 产品列表
   */
  productList: {
    /**
     * 订单号
     */
    orderNo: string
    /**
     * 商品名称
     */
    productName: string
    /**
     * 品类
     */
    category: string
    /**
     * 品牌
     */
    brand: string
    /**
     * 单位
     */
    unit: string
    /**
     * 商品id
     */
    productId: string
    /**
     * 退货数量
     */
    count: string
    /**
     * 申请单的数量，例如退货申请单，则表示退货的数量，换货申请单，则表示换货的数量
     */
    applyCount: string
    /**
     * 已发货数量
     */
    deliveryCount: string
    /**
     * 未退货发货数量
     */
    noDeliveryCount: number
    /**
     * 数据id
     */
    detailId?: number
  }[]
  /**
   * 退货发货地址
   */
  returnDeliverAddress: AddressValueType
}

type ProductListItemType = {
  /**
   * 订单号
   */
  orderNo: string
  /**
   * 商品ID
   */
  productId: string
  /**
   * 商品名称
   */
  productName: string
  /**
   * 品类
   */
  category: string
  /**
   * 品牌
   */
  brand: string
  /**
   * 单位
   */
  unit: string
  /**
   * 申请单的数量，例如退货申请单，则表示退货的数量，换货申请单，则表示换货的数量
   */
  applyCount: number
  /**
   * 已 换货 / 退货 数量
   */
  deliveryCount: number
  /**
   * 未 换货 / 退货 数量
   */
  noDeliveryCount: number
  /**
   * 已 换货 / 退货 收货数量
   */
  receiveCount: number
  /**
   * 差异数量
   */
  subCount: number
  /**
   * 退货数量
   */
  count: number
  /**
   * 数据id
   */
  detailId?: number
}

export type AfterType = 2 | 3

interface IProps {
  /**
   * 售后类型，2 换货，3 退货
   */
  afterType: AfterType
  /**
   * 流程类型，'returnDeliver' 退货发货，exchangeDeliver 换货发货
   * 换货流程包含两个退货步骤，一是 退货发货，二是 换货发货
   * 退货流程包含一个退货步骤，一是 退货发货
   */
  flowType: 'returnDeliver' | 'exchangeDeliver'
  /**
   * 是否可见
   */
  visible: boolean
  /**
   * 值
   */
  value: {
    /**
     * 商品列表
     */
    productList: ProductListItemType[]
    /**
     * 发货地址id
     */
    returnDeliverAddress?: number | string
    /**
     * 发货时间
     */
    deliveryTime?: string
    /**
     * 物流单号
     */
    logisticsOrderNo?: string
    /**
     * 物流公司id
     */
    logisticsName?: number | string
  }
  /**
   * 配送方式
   */
  deliveryType: number
  /**
   * Form 确认事件
   */
  onSubmit: (values: ValuesType) => void
  /**
   * 抽屉关闭事件
   */
  onClose: () => void
  /**
   * 确认按钮 loading
   */
  submitLoading: boolean
  /**
   * 是否可编辑商品相关，默认为 true
   */
  ediableProduct?: boolean
  /**
   * 是否可编辑物流相关，默认为 true
   */
  ediableLogistics?: boolean
}

const DeliverDrawer: React.FC<IProps> = (props) => {
  const {
    afterType,
    flowType,
    visible,
    value,
    deliveryType,
    onSubmit,
    onClose,
    submitLoading,
    ediableProduct = true,
    ediableLogistics = true,
  } = props

  const intl = useIntl()

  // 获取物流公司
  const fetchLogisticsCompany = (): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      getLogisticsSelectListCompany({
        cooperateType: '2', // 1-平台物流服务商，2-商户合作物流公司
      })
        .then((res) => {
          if (res.code === 1000) {
            const options = res.data
              ? res.data.map((item) => ({
                  label: item.name,
                  value: item.id,
                }))
              : []
            resolve(options)
          }
          reject()
        })
        .catch(() => {
          reject()
        })
    })
  }

  const handleClose = () => {
    if (onClose) {
      onClose()
    }
  }

  const handleSubmit = (values: ValuesType) => {
    if (onSubmit) {
      const { productList, ...rest } = values
      onSubmit({
        ...rest,
        // 过滤掉退货数量为0的数据
        productList: productList.filter((item) => +item.deliveryCount < +item.applyCount && +item.count > 0),
      })
    }
  }

  return (
    <Drawer
      title={intl.formatMessage({ id: 'afterService.components.DeliverDrawer.title', type: TYPE_NAME_MAP[afterType] })}
      width={1100}
      onClose={handleClose}
      open={visible}
      footer={
        <div
          style={{
            textAlign: 'right',
          }}
        >
          <Button onClick={handleClose} style={{ marginRight: 16 }}>
            {intl.formatMessage({ id: 'afterService.common.cancel', defaultMessage: '取 消' })}
          </Button>
          <Button onClick={() => formActions.submit()} type="primary" loading={submitLoading}>
            {intl.formatMessage({ id: 'afterService.common.confirm', defaultMessage: '确 定' })}
          </Button>
        </div>
      }
      destroyOnClose
    >
      <NiceForm
        previewPlaceholder="' '"
        initialValues={value}
        components={{
          ArrayTable,
        }}
        effects={($, { setFieldValue, getFieldValue, setFieldState }) => {
          const linkage = useLinkageUtils()

          if (ediableLogistics) {
            useAsyncSelect('logisticsName', fetchLogisticsCompany, ['label', 'value'])
          }

          onFormInit$().subscribe(() => {
            // 自提隐藏物流编号、物流公司
            if (deliveryType === 2) {
              linkage.hide('*(logisticsOrderNo,logisticsName,logisticsNameTxt)')
            }

            // 设置禁用相关
            formActions.setFieldState('productList.*.count', (fieldState) => {
              fieldState.editable = ediableProduct
            })

            // 设置禁用相关
            formActions.setFieldState('LOGISTICS_LAYOUT.*', (fieldState) => {
              fieldState.editable = ediableLogistics
            })
          })

          onFieldInputChange$('logisticsName').subscribe((state) => {
            const { originAsyncData, value } = state
            const current = originAsyncData.find((item) => item.value === value)
            if (current) {
              setFieldValue('logisticsNameTxt', current.label)
            }
          })

          onFieldInputChange$('productList.*.count').subscribe((fieldState) => {
            const { value, name } = fieldState
            const noDeliveryCountValue = getFieldValue('noDeliveryCount')

            setFieldState(
              FormPath.transform(name, /\d/, ($1) => {
                return `productList.${$1}.count`
              }),
              (state) => {
                if (+value > +noDeliveryCountValue) {
                  state.errors = [
                    intl.formatMessage({
                      id: 'afterService.components.DeliverDrawer.overflow',
                      flow: FLOW_TYPE_NAME_MAP[flowType],
                    }),
                  ]
                } else {
                  state.errors = []
                }
              },
            )
          })
        }}
        actions={formActions}
        schema={createSchema(afterType, flowType)}
        onSubmit={(values) => handleSubmit(values)}
      />
    </Drawer>
  )
}

export default DeliverDrawer
