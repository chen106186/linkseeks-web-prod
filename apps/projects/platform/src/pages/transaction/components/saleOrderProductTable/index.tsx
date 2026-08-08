/* eslint-disable @typescript-eslint/no-shadow */
import React, { useContext, useState, useRef, useEffect, useCallback, Fragment } from 'react'
import { Table, Form, Input, Row, Col, Button, Tooltip, Space } from 'antd'
import { OrderDetailContext } from '../../_public/order/context'
import { EditOutlined, SettingOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import ModalForm from '@/components/ModalForm'
import { createFormActions } from '@apps/formily'
import MellowCard from '@/components/MellowCard'
import ModalTable from '@/components/ModalTable'
import { formatTimeString } from '@/utils'
import { OrderKindType } from '@/constants/order'
import { AddressPop } from '../../../orderAbility/components/addressPop'
import {
  getOrderVendorDetailCouponPage,
  getOrderVendorDetailPromotion,
  postOrderVendorValidateSubmitFreightUpdate,
} from '@apps/apis'
import { postLogisticsFreightTemplateCalFreightPrice } from '@apps/apis'
import { getProductPositionDeductionRecordList } from '@apps/apis'
import { usePageStatus } from '@/hooks/usePageStatus'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import { getIntl } from '@linkseeks/i18n'
import { COLUMNS_LARGE_WIDTH, COLUMNS_ACTION_WIDTH } from '@/constants/table'
import themeConfig from '@apps/config/lingxi.theme.config'
import RadioChangeButtonCard from '../radioChangeButton'
import { formatContext } from '../../../orderAbility/components/purchaseOrderPreview'
import { ALTERATION } from '../orderDetailSection'
import { PromiseTime } from '../../../orderAbility/purchaseOrder/componentSchema'

const intl = getIntl()
export interface OrderProductTableProps {}

// 订单商品cell切换
const EditableContext = React.createContext<any>({})

interface Item {
  key: string
  name: string
  age: string
  address: string
  purchaseCount: string
}

interface EditableRowProps {
  index: number
}

const RowStyle = styled((props) => (
  <Row justify="end" {...props}>
    {props.children}
  </Row>
))`
  .ant-col div:nth-child(1) {
    color: #91959b;
  }
  .ant-col div:nth-child(2) {
    color: #252d37;
  }
`
// 仓位库存扣减记录
const warehouseColumns: any[] = [
  {
    dataIndex: 'freightSpaceId',
    key: 'freightSpaceId',
    title: intl.formatMessage({ id: 'transaction_components.cangweiID' }),
    align: 'center',
  },
  {
    dataIndex: 'freightSpaceName',
    key: 'freightSpaceName',
    title: intl.formatMessage({ id: 'transaction_components.cangweimingcheng' }),
    align: 'center',
  },
  {
    dataIndex: 'warehouseName',
    key: 'warehouseName',
    title: intl.formatMessage({ id: 'transaction_components.duiyingcangku' }),
    align: 'center',
  },
  {
    dataIndex: 'goodsName',
    key: 'goodsName',
    title: intl.formatMessage({ id: 'transaction_components.duiyingwuliao' }),
    align: 'center',
  },
  {
    dataIndex: 'reductionInventory',
    key: 'reductionInventory',
    title: intl.formatMessage({ id: 'transaction_components.koujiancangweikucun' }),
    align: 'center',
    render: (t, r) => (r.type === 4 ? `-${t}` : `+${t}`),
  },
  {
    dataIndex: 'createTime',
    key: 'createTime',
    title: intl.formatMessage({ id: 'transaction_components.koujianshijian' }),
    align: 'center',
    render: (text) => formatTimeString(text),
  },
]

// 营销活动使用记录
const activityColumns: any[] = [
  {
    dataIndex: 'promotionId',
    key: 'promotionId',
    title: intl.formatMessage({ id: 'transaction_components.huodongID' }),
    align: 'center',
  },
  {
    dataIndex: 'name',
    key: 'name',
    title: intl.formatMessage({ id: 'transaction_components.huodongmingcheng' }),
    align: 'center',
  },
  {
    dataIndex: 'promotionTypeName',
    key: 'promotionTypeName',
    title: intl.formatMessage({ id: 'transaction_components.huodongleixing' }),
    align: 'center',
  },
  {
    dataIndex: 'belongTypeName',
    key: 'belongTypeName',
    title: intl.formatMessage({ id: 'transaction_components.huodongguishu' }),
    align: 'center',
  },
  {
    dataIndex: 'startTime',
    key: 'startTime',
    title: intl.formatMessage({ id: 'transaction_components.huodongyouxiaoqi' }),
    align: 'center',
    render: (t, r) => `${t}至${r.expireTime}`,
  },
]

// 优惠券使用记录
const couponColumns: any[] = [
  {
    dataIndex: 'couponId',
    key: 'couponId',
    title: intl.formatMessage({ id: 'transaction_components.juanma' }),
    align: 'center',
  },
  {
    dataIndex: 'name',
    key: 'name',
    title: intl.formatMessage({ id: 'transaction_components.youhuijuanmingcheng' }),
    align: 'center',
  },
  {
    dataIndex: 'couponTypeName',
    key: 'couponTypeName',
    title: intl.formatMessage({ id: 'transaction_components.youhuijuanleixing' }),
    align: 'center',
  },
  {
    dataIndex: 'belongTypeName',
    key: 'belongTypeName',
    title: intl.formatMessage({ id: 'transaction_components.youhuijuanguishu' }),
    align: 'center',
  },
  {
    dataIndex: 'amount',
    key: 'amount',
    title: intl.formatMessage({ id: 'transaction_components.miane' }),
    align: 'center',
    render: (t) => `${t}`,
  },
  {
    dataIndex: 'startTime',
    key: 'startTime',
    title: intl.formatMessage({ id: 'transaction_components.youxiaoqi' }),
    align: 'center',
    render: (t, r) => `${t}至${r.expireTime}`,
  },
]

const modalModifyActions = createFormActions()
// 总计金额联动框
export const MoneyTotalBox = ({ dataSource, isEditData, setCouponModalVisible, versionContext, dataBo }) => {
  const {
    formContext: { reloadFormData },
  } = useContext(OrderDetailContext)
  const { product, receiverAddressId, orderMode, orderKind } = dataSource || {}
  const creditsCommodity = orderMode === 10 || orderMode === 25 // @todo 积分或渠道积分下单模式
  const contractOrder = orderKind === OrderKindType.SRM_ORDER || orderKind === OrderKindType.REQUISITION_ORDER // 合同下单和请购单下单模式
  const { modifyPrice = false } = usePageStatus()

  const {
    productAmount,
    memberDiscount,
    freight,
    totalAmount,
    promotionAmount,
    couponAmount,
    products,
    taxes,
    deductionAmount,
  } = product
  // const modelRef = useRef<any>({})
  const modifyRef = useRef<any>({})
  const [freePrice, setFreePrice] = useState<number>(freight || 0)
  const [sum, setSum] = useState<number>(0)

  // const handleSetting = () => {
  //   modelRef.current.setVisible(true)
  // }

  const handleModify = () => {
    modifyRef.current.setVisible(true)
  }

  const [amountMoney, setAmountMoney] = useState<number>((sum * 1000 + freePrice * 1000) / 1000)

  // 总计金额
  useEffect(() => {
    // setAmountMoney(() => (sum * 1000 + freePrice * 1000) / 1000)
    setAmountMoney(() => totalAmount)
  }, [sum, freePrice, totalAmount])

  // // 待审核详情设置运费
  // const handleConfirm = () => {
  //   let free = modalPriceActions.getFieldValue('freePrice')
  //   setFreePrice(Number(free || 0))
  //   postOrderVendorValidateSubmitFreightUpdate({orderId: dataSource.orderId, freight: free}).then(res => {
  //     if(res.code === 1000) {
  //       modelRef.current.setVisible(false)
  //       reloadFormData()
  //     }
  //   })
  // }

  // 查询列表修改运费
  const handleOK = () => {
    modalModifyActions.submit().then(async ({ values }: any) => {
      setFreePrice(Number(values.price || 0))
      postOrderVendorValidateSubmitFreightUpdate({
        orderId: dataSource.orderId,
        freight: values.price,
        reason: values.reason,
      }).then((res) => {
        if (res.code === 1000) {
          modifyRef.current.setVisible(false)
          reloadFormData()
        }
      })
    })
  }

  useEffect(() => {
    // 存在商品 并且有选择收货地址，则开始计算运费
    if (products && products.length > 0 && receiverAddressId) {
      // 筛选配送方式为物流的商品并且使用了运费模板
      const logsiticsDataMaps = products.filter(
        (v) => v.logistics && v.logistics.useTemplate && v.logistics.deliveryType === 1,
      )
      if (logsiticsDataMaps.length > 0) {
        postLogisticsFreightTemplateCalFreightPrice(
          {
            orderProductList: logsiticsDataMaps.map((v) => ({
              templateId: v.templateId,
              weight: v.weight,
            })),
            receiverAddressId,
          },
          { ttl: 10 * 1000, useCache: true, ctlType: 'none' },
        ).then((res) => {
          if (res.code === 1000) {
            setFreePrice(res.data)
          }
        })
      }
    }

    const _sum = versionContext
      ? dataBo?.totalAmount
      : productAmount || products.reduce((prev, next) => prev + Number(next.amount || 0), 0)
    setSum(_sum)
  }, [products, dataBo, receiverAddressId, versionContext, productAmount])

  const handlePreivewCoupon = () => {
    setCouponModalVisible(true)
  }

  return (
    <RowStyle gutter={25}>
      <Col>
        <div>
          {creditsCommodity
            ? intl.formatMessage({ id: 'transaction_components.hejisuoxujifen', defaultMessage: '合计所需积分' })
            : intl.formatMessage({ id: 'transaction_components.commodity.amount', defaultMessage: '商品总计金额' })}
        </div>
        <div>{creditsCommodity ? sum : `${sum}`}</div>
      </Col>
      {!versionContext && (
        <Fragment>
          {!creditsCommodity && !contractOrder && (
            <Col>
              <div>
                {intl.formatMessage({ id: 'transaction_components.huiyuanzhekou', defaultMessage: '会员折扣' })}
              </div>
              <div>{`-${memberDiscount}`}</div>
            </Col>
          )}
          {!creditsCommodity && !contractOrder && (
            <Col>
              <div>{intl.formatMessage({ id: 'transaction_components.cuxiaolijian', defaultMessage: '促销立减' })}</div>
              <div>{`-${promotionAmount}`}</div>
            </Col>
          )}
          {!creditsCommodity && !contractOrder && (
            <Col>
              <div>
                {intl.formatMessage({ id: 'transaction_components.youhuidikou', defaultMessage: '优惠券抵扣' })}
              </div>
              <div>
                <Button
                  type="link"
                  onClick={handlePreivewCoupon}
                  style={{ padding: 0, height: '18px', lineHeight: '18px' }}
                >{`-${couponAmount}`}</Button>
              </div>
            </Col>
          )}
          {!creditsCommodity && (
            <Col>
              <div>{intl.formatMessage({ id: 'transaction_components.jifendikou', defaultMessage: '积分抵扣' })}</div>
              <div>{`-${deductionAmount}`}</div>
            </Col>
          )}
          {contractOrder ? null : (
            <>
              <Col>
                <div>
                  {intl.formatMessage({ id: 'transaction_components.yunfei', defaultMessage: '运费' })}
                  {/* 待审核状态下的修改 */}
                  {isEditData && !creditsCommodity && !contractOrder && (
                    <SettingOutlined style={{ marginLeft: 8 }} onClick={handleModify} />
                  )}
                  {/* 查询列表跳转的修改 */}
                  {modifyPrice && <SettingOutlined style={{ marginLeft: 8 }} onClick={handleModify} />}
                </div>
                <div>{`${freight}`}</div>
              </Col>
              <Col>
                <div>{intl.formatMessage({ id: 'transaction_components.suifei', defaultMessage: '税费' })}</div>
                <div>{taxes}</div>
              </Col>
              <Col>
                <div>
                  {creditsCommodity
                    ? intl.formatMessage({
                        id: 'transaction_components.zongjisuoxujifen',
                        defaultMessage: '总计所需积分',
                      })
                    : intl.formatMessage({ id: 'transaction_components.pay.amount', defaultMessage: '实付金额' })}
                </div>
                <div style={{ color: '#EF3346' }}>{creditsCommodity ? amountMoney : `${amountMoney}`}</div>
              </Col>
            </>
          )}
        </Fragment>
      )}
      {/* <ModalForm
      modalTitle='设置运费'
      currentRef={modelRef}
      initialValues={freePrice}
      schema={{
        type: 'object',
        properties: {
          NO_SUBMIT_LAYOUT: {
            type: 'object',
            "x-component": 'mega-layout',
            "x-component-props": {
              labelAlign: 'top'
            },
            properties: {
              freePrice: {
                type: 'string',
                title: '设置运费',
                "x-props": {
                  addonBefore: {intl.formatMessage({ id: 'common.money' })}
                },
                "x-rules": [
                  {
                    validator: value => {
                      return isNaN(value)
                    },
                    message:'请正确输入数字金额',
                  },
                  {
                    pattern: /^\d+(\.\d{1,2})?$/,
                    message: '运费仅限两位小数',
                  },
                ]
              }
            },
          }
        }
      }}
      actions={modalPriceActions}
      confirm={handleConfirm}
    >
    </ModalForm> */}
      <ModalForm
        modalTitle={intl.formatMessage({ id: 'transaction_components.xiugaiyunfei' })}
        currentRef={modifyRef}
        initialValues={freePrice}
        schema={{
          type: 'object',
          properties: {
            NO_SUBMIT_LAYOUT: {
              type: 'object',
              'x-component': 'mega-layout',
              'x-component-props': {
                labelAlign: 'top',
                labelCol: 4,
              },
              properties: {
                price: {
                  type: 'string',
                  title: intl.formatMessage({ id: 'transaction_components.yunfei' }),
                  'x-props': {
                    addonBefore: intl.formatMessage({ id: 'common.money', defaultMessage: '￥' }),
                  },
                  'x-rules': [
                    {
                      required: true,
                      message: intl.formatMessage({
                        id: 'transaction_components.qingzhengqueshuruyunfei',
                      }),
                    },
                    {
                      pattern: /^([0](\.\d{1,2}))$|^([1-9][0-9]*(\.\d{1,2})?)$|^[0]$/,
                      message: intl.formatMessage({
                        id: 'transaction_components.yunfeijinxianliangweixiaoshu',
                      }),
                    },
                    // {
                    //   validator: value => {
                    //     return isNaN(value)
                    //   },
                    // }
                  ],
                },
                reason: {
                  type: 'textarea',
                  'x-component-props': {
                    rows: 4,
                    placeholder: intl.formatMessage({
                      id: 'transaction_components.zaicishurunideyuanyin1',
                    }),
                  },
                  title: intl.formatMessage({ id: 'transaction_components.xiugaiyuanyin' }),
                  'x-rules': [
                    {
                      required: true,
                      message: intl.formatMessage({
                        id: 'transaction_components.qingshuruxiugaiyuanyin',
                      }),
                    },
                    {
                      limitByte: true,
                      maxByte: 100,
                    },
                  ],
                },
              },
            },
          },
        }}
        actions={modalModifyActions}
        confirm={handleOK}
      />
    </RowStyle>
  )
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm()
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  )
}

interface EditableCellProps {
  title: React.ReactNode
  editable: boolean
  children: React.ReactNode
  dataIndex: string
  record: Item
  handleSave: (record: Item) => void
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false)
  const inputRef = useRef<any>({})
  const form = useContext(EditableContext)

  useEffect(() => {
    if (editing) {
      inputRef.current.focus()
    }
  }, [editing])

  const toggleEdit = () => {
    setEditing(!editing)
    form.setFieldsValue({ [dataIndex]: record[dataIndex] })
  }
  const save = async () => {
    try {
      const values = await form.validateFields()
      values.price = Number(values.price)
      values.money = (Number(values.price) * 1000 * parseInt(record.purchaseCount)) / 1000 // 计算金额
      toggleEdit()
      handleSave({ ...record, ...values })
    } catch (errInfo) {
      console.log('Save failed:', errInfo)
    }
  }

  let childNode = children

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0, width: 140 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: intl.formatMessage({ id: 'transaction_components.cixiangweibitianxiang' }),
          },
          {
            pattern: /^\d+(\.\d{1,3})?$/,
            message: intl.formatMessage({
              id: 'transaction_components.shuzhijinxiansanweixiaoshu',
            }),
          },
        ]}
      >
        <Input type="number" ref={inputRef} onBlur={save} onPressEnter={save} />
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
        {children}
        <EditOutlined />
      </div>
    )
  }

  return <td {...restProps}>{childNode}</td>
}

/**
 * 销售订单详情相关商品table编辑 特说明
 * 商品单价和订单运费可编辑情况：
 * 1. 销售订单内部状态为待提交审核下 即data.innerStatusName === '待提交审核'
 * 2. 销售订单查询列表操作 修改订单价格按钮跳转 即url的modifyPirce === true
 * @param props
 * @returns
 */

const modifyPriceActions = createFormActions()

const SaleOrderProductTable: React.FC<OrderProductTableProps> = () => {
  const {
    formContext: { data, reloadFormData },
    versionContext,
  } = useContext(OrderDetailContext)
  const { product, orderMode, orderKind, orderId, innerStatus } = data || {}
  const creditsCommodity = orderMode === 10 || orderMode === 25 // @todo 积分或渠道积分下单模式
  // 合同下单模式
  const contractOrder = orderKind === OrderKindType.SRM_ORDER || orderKind === OrderKindType.REQUISITION_ORDER
  const [warehouseVisible, setWarehouseVisible] = useState(false)
  const [activityVisible, setActivityVisible] = useState(false)
  const [couponVisible, setCouponVisible] = useState(false)
  const [checkProduct, setCheckProduct] = useState<any>({}) // 选中的商品id
  const warehouseRef = useRef<any>({})
  const activityRef = useRef<any>({})
  const couponRef = useRef<any>({})
  const { modifyPrice = false, lastTypeParams } = usePageStatus()
  const modifyPriceRef = useRef<any>({})
  const { run: runPrice, loading } = useHttpRequest(postOrderVendorValidateSubmitFreightUpdate)

  // 判断是否可操作当前表格
  const isEditData = data.innerStatusName === intl.formatMessage({ id: 'transaction_components.daitijiaoshenhe' })

  const productComponents = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  }

  const handleSave = () => {
    // const newData = [...product.products];
    // const index = newData.findIndex(item => row.orderProductId === item.orderProductId);
    // const item = newData[index];
    // newData.splice(index, 1, {
    //   ...item,
    //   ...row,
    // });
    // // 执行修改订单价格
    // postOrderVendorValidateSubmitFreightUpdate({orderId: data.orderId, prices: [{ orderProductId: row.orderProductId, price: row.price }]}).then(res=>{
    //   if(res.code === 1000) {
    //     reloadFormData()
    //   }
    // })
    // ctl.setData({
    //   ...data,
    //   product: {
    //     ...data.product,
    //     products: newData.sort((a, b) => a.orderProductId - b.orderProductId)
    //   },
    // })
  }

  const handlePreviewWarehouse = (record) => {
    setCheckProduct(record)
    setWarehouseVisible(true)
  }

  const handlePreviewActivity = (record) => {
    setCheckProduct(record)
    setActivityVisible(true)
  }

  const handleModifyPrice = (record) => {
    modifyPriceRef.current.setVisible(true)
    modifyPriceActions.setFieldValue('orderProductId', record.orderProductId)
  }

  // 提交修改价格
  const handleSubmitModifyPrice = () => {
    modifyPriceActions.submit().then(async ({ values }: any) => {
      values.orderId = data.orderId
      values.prices = [{ orderProductId: values.orderProductId, price: values.price, reason: values.reason }]
      const result = await runPrice(values)
      if (result.code === 1000) {
        modifyPriceActions.reset()
        modifyPriceRef.current.setVisible(false)
        setTimeout(() => {
          reloadFormData()
        }, 800)
      }
    })
  }

  // 订单商品列
  const productInfoColumns: any[] = [
    {
      title: 'ID',
      dataIndex: 'skuId',
      key: 'skuId',
      width: 80,
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.shangpinmingcheng' }),
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      width: COLUMNS_LARGE_WIDTH,
      render: (t, r) => <Tooltip title={`${t}/${r.spec}`}>{`${t}/${r.spec}`}</Tooltip>,
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.pinlei' }),
      dataIndex: 'category',
      key: 'category',
      width: 152,
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.pinpai' }),
      dataIndex: 'brand',
      key: 'brand',
      width: 128,
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.danwei' }),
      dataIndex: 'unit',
      key: 'unit',
      width: 80,
    },
    {
      title: intl.formatMessage({ id: 'order.orderProductPosition' }),
      dataIndex: 'orderProductPositionVOS',
      key: 'orderProductPositionVOS',
      width: 160,
      render: (text, record) => (
        <div>
          {record?.orderProductPositionVOS?.map((_item, _index) => (
            <div key={`${record.skuId}_${_index}`}>
              {_item.positionName}：{_item.positionQuantity}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: creditsCommodity
        ? intl.formatMessage({ id: 'transaction_components.suoxujifen', defaultMessage: '所需积分' })
        : intl.formatMessage({ id: 'transaction_components.shangpinjiage', defaultMessage: '商品价格' }),
      dataIndex: 'price',
      align: 'left',
      key: 'price',
      width: 128,
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.han' }),
      dataIndex: 'tax',
      key: 'tax',
      render: (t) =>
        t
          ? intl.formatMessage({ id: 'transaction_components.shi' })
          : intl.formatMessage({ id: 'transaction_components.fou' }),
      width: 96,
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.shuil' }),
      dataIndex: 'taxRate',
      key: 'taxRate',
      render: (t) => (t ? `${t}%` : null),
      width: 96,
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.huiyuanzhekou' }),
      dataIndex: 'discount',
      align: 'center',
      key: 'discount',
      // render: (text, record) => record.isMemberPrice ? (text * 10000 / 100 + '%') : null
      render: (text) => text + '%',
      width: 96,
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.refPrice', defaultMessage: '到手价' }),
      dataIndex: 'refPrice',
      key: 'refPrice',
      width: 96,
    },
    {
      title: creditsCommodity
        ? intl.formatMessage({ id: 'transaction_components.duihuanshuliang', defaultMessage: '兑换数量' })
        : intl.formatMessage({ id: 'transaction_components.caigoushuliang', defaultMessage: '采购数量' }),
      dataIndex: 'quantity',
      key: 'quantity',
      width: 96,
    },
    {
      title: creditsCommodity
        ? intl.formatMessage({ id: 'transaction_components.suoxujifenxiaoji' })
        : intl.formatMessage({ id: 'transaction_components.jine' }),
      dataIndex: 'amount',
      key: 'amount',
      width: 160,
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.peisongfangshi' }),
      dataIndex: 'deliverType',
      key: 'deliverType',
      render: (text, record) =>
        text && text === 2 ? (
          <AddressPop pickInfo={record}>{record.deliverTypeName || record?.deliveryTypeName}</AddressPop>
        ) : (
          record.deliverTypeName || record?.deliveryTypeName
        ),
      width: 96,
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.caozuo' }),
      dataIndex: 'opeartion',
      align: 'center',
      key: 'opeartion',
      render: (_, record) => (
        <>
          {(modifyPrice || isEditData) && (
            <Button type="link" onClick={() => handleModifyPrice(record)}>
              {intl.formatMessage({ id: 'transaction_components.xiugaidanjia' })}
            </Button>
          )}
          <Button type="link" onClick={() => handlePreviewWarehouse(record)}>
            {intl.formatMessage({ id: 'transaction_components.zhakankucunjilu' })}
          </Button>
          <Button type="link" onClick={() => handlePreviewActivity(record)}>
            {intl.formatMessage({ id: 'transaction_components.zhakanhuodongjilu' })}
          </Button>
        </>
      ),
      fixed: 'right',
      width: COLUMNS_ACTION_WIDTH,
    },
  ]

  // 订单物料
  const materialInfo: any[] = [
    {
      title: '行号',
      dataIndex: 'lineNumber',
      key: 'lineNumber',
      width: 60,
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.wuliaobianhao' }),
      dataIndex: 'productNo',
      key: 'productNo',
      width: 80,
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.wuliaomingchengguige' }),
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      width: COLUMNS_LARGE_WIDTH,
      render: (t, r) => <Tooltip title={`${t}/${r.spec}`}>{`${t}/${r.spec}`}</Tooltip>,
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.pinlei' }),
      dataIndex: 'category',
      key: 'category',
      width: 152,
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.pinpai' }),
      dataIndex: 'brand',
      key: 'brand',
      width: 128,
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.danwei' }),
      dataIndex: 'unit',
      key: 'unit',
      width: 80,
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.guanlianbaojiashangpinIDming' }),
      dataIndex: 'quotedSkuId',
      key: 'quotedSkuId',
      ellipsis: true,
      width: COLUMNS_LARGE_WIDTH,
      render: (t, r) =>
        t ? (
          <Tooltip title={`${t}/${r.quotedName}/${r.quotedCategory}/${r.quotedBrand}`}>
            {`${t}/${r.quotedName}/${r.quotedCategory}/${r.quotedBrand}`}
          </Tooltip>
        ) : (
          ''
        ),
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.danjiayuan' }),
      dataIndex: 'price',
      align: 'left',
      key: 'price',
      width: 128,
    },
    // {
    //   title: '供方库存',
    //   dataIndex: 'stock',
    //   key: 'stock',
    // },
    {
      title: intl.formatMessage({ id: 'transaction_components.caigoushuliang' }),
      dataIndex: 'quantity',
      key: 'quantity',
      width: 96,
    },
    {
      title: '期望交期',
      dataIndex: 'expectedDelivery',
      key: 'expectedDelivery',
      width: 142,
    },
    {
      title: '承诺交期',
      dataIndex: 'promisedDeliveryDate',
      key: 'promisedDeliveryDate',
      width: 142,
      render: (text, record) =>
        lastTypeParams === '/detail' && innerStatus === 101 ? (
          <PromiseTime record={record} orderId={orderId} times={text} />
        ) : (
          text
        ),
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.han' }),
      dataIndex: 'tax',
      key: 'tax',
      render: (t) =>
        t
          ? intl.formatMessage({ id: 'transaction_components.shi' })
          : intl.formatMessage({ id: 'transaction_components.fou' }),
      width: 96,
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.shuil' }),
      dataIndex: 'taxRate',
      key: 'taxRate',
      render: (t) => (t ? `${t}%` : null),
      width: 96,
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.jine' }),
      dataIndex: 'amount',
      key: 'amount',
      width: 160,
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.peisongfangshi' }),
      dataIndex: 'deliverType',
      key: 'deliverType',
      render: (text, record) =>
        text && text === 2 ? (
          <AddressPop pickInfo={record}>{record.deliverTypeName || record?.deliveryTypeName}</AddressPop>
        ) : (
          record.deliverTypeName || record?.deliveryTypeName
        ),
      width: 96,
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.remark' }),
      dataIndex: 'remark',
      width: 176,
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.cangweikucunkoujianjilu' }),
      dataIndex: 'record',
      key: 'record',
      render: (_, record) => (
        <Button type="link" onClick={() => handlePreviewWarehouse(record)}>
          {intl.formatMessage({ id: 'transaction_components.zhakan' })}
        </Button>
      ),
      fixed: 'right',
      width: COLUMNS_ACTION_WIDTH,
    },
  ]

  const fetchWarehouseData = useCallback(
    async (params) => {
      const { data, code } = await getProductPositionDeductionRecordList({
        ...params,
        productId: String(checkProduct?.skuId),
        stockId: checkProduct?.stockId,
      })
      return code === 1000 ? data : []
    },
    [checkProduct],
  )

  const fetchActivityData = useCallback(
    async (params) => {
      const { data, code } = await getOrderVendorDetailPromotion({
        ...params,
        orderProductId: String(checkProduct?.orderProductId),
      })
      return code === 1000 ? data : []
    },
    [checkProduct],
  )

  const fetchCouponData = async (params) => {
    const { data, code } = await getOrderVendorDetailCouponPage({
      ...params,
      orderId: String(orderId),
    })
    return code === 1000 ? data : []
  }

  const columns = productInfoColumns.map((col) => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: handleSave,
      }),
    }
  })

  const [dataBo, setDataBo] = useState<any>({})

  const handRenderValue = (value) => {
    const { totalAmountChangeStatus, totalAmount } = formatContext(versionContext, value)

    const _product = formatContext(versionContext, value)?.product

    setDataBo({
      product: _product,
      totalAmountChangeStatus,
      totalAmount,
    })
  }

  const handleVersions = (e) => {
    const { value } = e.target
    if (value === ALTERATION.BEFORE_ALTERATION) {
      handRenderValue('before')
    } else {
      handRenderValue('after')
    }
  }

  useEffect(() => {
    if (versionContext) {
      // setAlteation(ALTERATION.AFTER_ALTERATION)
      handRenderValue('after')
    }
  }, [versionContext])

  return (
    <>
      <MellowCard
        title={
          contractOrder
            ? intl.formatMessage({ id: 'transaction_components.dingdanwuliao' })
            : intl.formatMessage({ id: 'transaction_components.dingdanshangpin' })
        }
        bordered={false}
        id="orderMaterials"
        extra={
          <Space>
            <MoneyTotalBox
              dataSource={data}
              isEditData={isEditData}
              versionContext={versionContext}
              dataBo={dataBo}
              setCouponModalVisible={setCouponVisible}
            />
            {versionContext && <RadioChangeButtonCard handleVersions={handleVersions} />}
          </Space>
        }
        bodyStyle={{
          paddingTop: themeConfig['@padding-xs'],
        }}
      >
        <Table
          columns={contractOrder ? materialInfo : columns}
          dataSource={versionContext ? dataBo?.product : product.products}
          components={productComponents}
          rowKey="orderProductId"
          pagination={false}
          scroll={{ x: 1200 }}
        />

        <ModalTable
          columns={warehouseColumns}
          modalTitle={intl.formatMessage({ id: 'transaction_components.cangweikucunkoujianjilu' })}
          visible={warehouseVisible}
          cancel={() => setWarehouseVisible(false)}
          currentRef={warehouseRef}
          confirm={() => setWarehouseVisible(false)}
          fetchTableData={(params) => fetchWarehouseData(params)}
          resetModal={{
            destroyOnClose: true,
          }}
        />

        <ModalTable
          columns={activityColumns}
          modalTitle={intl.formatMessage({
            id: 'transaction_components.yingxiaohuodongshiyongjilu',
          })}
          visible={activityVisible}
          cancel={() => setActivityVisible(false)}
          currentRef={activityRef}
          confirm={() => setActivityVisible(false)}
          fetchTableData={(params) => fetchActivityData(params)}
          resetModal={{
            destroyOnClose: true,
          }}
        />

        <ModalTable
          columns={couponColumns}
          modalTitle={intl.formatMessage({ id: 'transaction_components.youhuijuanshiyongjilu' })}
          visible={couponVisible}
          cancel={() => setCouponVisible(false)}
          currentRef={couponRef}
          confirm={() => setCouponVisible(false)}
          fetchTableData={(params) => fetchCouponData(params)}
          resetModal={{
            destroyOnClose: true,
          }}
        />
      </MellowCard>
      {/* 修改单价 */}
      <ModalForm
        modalTitle={intl.formatMessage({ id: 'transaction_components.xiugaidanjia' })}
        currentRef={modifyPriceRef}
        confirm={handleSubmitModifyPrice}
        actions={modifyPriceActions}
        schema={{
          type: 'object',
          properties: {
            NO_SUBMIT: {
              type: 'object',
              'x-component': 'mega-layout',
              'x-component-props': {
                labelAlign: 'top',
                labelCol: 4,
              },
              properties: {
                orderProductId: {
                  type: 'number',
                  title: intl.formatMessage({
                    id: 'transaction_components.dangqiandingdanshangpinid',
                  }),
                  display: false,
                },
                price: {
                  title: intl.formatMessage({ id: 'transaction_components.danjia' }),
                  type: 'string',
                  // 'x-props': {
                  //   addonBefore: intl.formatMessage({ id: 'common.money', defaultMessage: '￥' }),
                  // },
                  'x-rules': [
                    {
                      required: true,
                      message: intl.formatMessage({
                        id: 'transaction_components.qingtianxiedanjia',
                      }),
                    },
                    {
                      pattern: /^\d+(\.\d{1,3})?$/,
                      message: intl.formatMessage({
                        id: 'transaction_components.danjiajinxiansanweixiaoshu',
                      }),
                    },
                  ],
                },
                reason: {
                  type: 'textarea',
                  'x-component-props': {
                    rows: 4,
                    placeholder: intl.formatMessage({
                      id: 'transaction_components.zaicishurunideyuanyin1',
                    }),
                  },
                  title: intl.formatMessage({ id: 'transaction_components.xiugaiyuanyin' }),
                  'x-rules': [
                    {
                      required: true,
                      message: intl.formatMessage({
                        id: 'transaction_components.qingshuruxiugaiyuanyin',
                      }),
                    },
                    {
                      limitByte: true,
                      maxByte: 100,
                    },
                  ],
                },
              },
            },
          },
        }}
        modalProps={{ confirmLoading: loading, forceRender: true }}
      />
    </>
  )
}

SaleOrderProductTable.defaultProps = {}

export default SaleOrderProductTable
