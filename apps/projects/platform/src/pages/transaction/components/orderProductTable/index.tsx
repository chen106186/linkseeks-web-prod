import React, { useContext, useState, useRef, useEffect, Fragment } from 'react'
import { Table, Form, Input, Row, Col, Tooltip, Space } from 'antd'
import { OrderDetailContext } from '../../_public/order/context'
import { EditOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import MellowCard from '@/components/MellowCard'
import { OrderKindType } from '@/constants/order'
import { AddressPop } from '../../../orderAbility/components/addressPop'
import { getIntl } from '@linkseeks/i18n'
import { COLUMNS_LARGE_WIDTH } from '@/constants/table'
import themeConfig from '@apps/config/lingxi.theme.config'
import { ALTERATION } from '../orderDetailSection'
import { formatContext } from '../../../orderAbility/components/purchaseOrderPreview'
import RadioChangeButtonCard from '../radioChangeButton'

export interface OrderProductTableProps {
  editable: boolean
}
const intl = getIntl()
// 订单商品cell切换
const EditableContext = React.createContext<any>({})

interface Item {
  key: string
  name: string
  age: string
  address: string
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

// 总计金额联动框
export const MoneyTotalBox = ({ dataSource, versionContext, dataBo }) => {
  const { product, orderMode, orderKind } = dataSource || {}
  const {
    couponAmount,
    freight,
    productAmount,
    memberDiscount,
    promotionAmount,
    totalAmount,
    products,
    taxes,
    deductionAmount,
  } = product

  const creditsCommodity = orderMode === 10 || orderMode === 25 // @todo 积分或渠道积分下单模式
  const contractOrder = orderKind === OrderKindType.SRM_ORDER || orderKind === OrderKindType.REQUISITION_ORDER // 合同下单和请购单下单模式

  // 合计金额， 如果后端有传则用后端数据
  const sum = versionContext
    ? dataBo?.totalAmount
    : productAmount || products.reduce((prev, next) => prev + parseInt(next.amount || 0), 0)

  // 总计金额
  const amountMoney = totalAmount || sum + freight

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
              <div>{`-${couponAmount}`}</div>
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
                <div>{intl.formatMessage({ id: 'transaction_components.yunfei', defaultMessage: '运费' })}</div>
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
      values.price = parseInt(values.price)
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

const OrderProductTable: React.FC<OrderProductTableProps> = ({}) => {
  const {
    formContext: { data },
    versionContext,
  } = useContext(OrderDetailContext)
  const { product = [], orderMode, orderKind } = data || {}
  const creditsCommodity = orderMode === 10 || orderMode === 25 // @todo 积分或渠道积分下单模式
  // 合同或请购下单模式
  const contractOrder = orderKind === OrderKindType.SRM_ORDER || orderKind === OrderKindType.REQUISITION_ORDER
  const productComponents = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  }

  // 订单商品
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
      title: intl.formatMessage({ id: 'transaction_components.han', defaultMessage: '含税' }),
      dataIndex: 'tax',
      key: 'tax',
      render: (t) =>
        t
          ? intl.formatMessage({ id: 'transaction_components.shi', defaultMessage: '是' })
          : intl.formatMessage({ id: 'transaction_components.fou', defaultMessage: '否' }),
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
      title: intl.formatMessage({ id: 'transaction_components.huiyuanzhekou', defaultMessage: '会员折扣' }),
      dataIndex: 'discount',
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
      editable: true,
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
    // 隐藏掉，不需要了
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
    // 隐藏掉，不需要了
    // {
    //   title: intl.formatMessage({ id: 'transaction_components.guanliandanjv' }),
    //   dataIndex: 'requisitions',
    //   key: 'requisitions',
    //   render: (text, record) => {
    //     return (
    //       orderMode === OrderModalType.PURCHASE_REQUISITION_CONTRACT_ORDER && (
    //         <>
    //           <Button
    //             type="link"
    //             onClick={() => requisitionRef.current?.show(record.requisitions || [])}
    //           >
    //             {/* 关联请购单 */}
    //             {intl.formatMessage({ id: 'transaction_components.guanlianqinggoudan' })}
    //           </Button>
    //           <RequisitionModalTable ref={requisitionRef} />
    //         </>
    //       )
    //     )
    //   },
    //   width: 152,
    // },
    {
      title: intl.formatMessage({ id: 'transaction_components.remark' }),
      dataIndex: 'remark',
      width: 176,
    },
  ]

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
    <MellowCard
      id="orderMaterials"
      title={
        contractOrder
          ? intl.formatMessage({ id: 'transaction_components.dingdanwuliao' })
          : intl.formatMessage({ id: 'transaction_components.dingdanshangpin' })
      }
      bordered={false}
      extra={
        <Space>
          <MoneyTotalBox dataSource={data} versionContext={versionContext} dataBo={dataBo} />
          {versionContext && <RadioChangeButtonCard handleVersions={handleVersions} />}
        </Space>
      }
      bodyStyle={{
        paddingTop: themeConfig['@padding-xs'],
      }}
    >
      <Table
        columns={contractOrder ? materialInfo : productInfoColumns}
        dataSource={versionContext ? dataBo?.product : product.products}
        components={productComponents}
        rowKey="orderProductId"
        pagination={false}
        scroll={{ x: 1200 }}
      />
    </MellowCard>
  )
}

OrderProductTable.defaultProps = {}

export default OrderProductTable
