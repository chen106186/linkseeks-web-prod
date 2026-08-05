import React, { useContext, useRef, useState } from 'react'
import { Tabs, Table, Button, Space, Modal, List, Progress } from 'antd'
import { Card } from '@linkseeks/ui'
import { OrderDetailContext } from '../../_public/order/context'
import MellowCard from '@/components/MellowCard'
import { OrderKindType } from '@/constants/order'
import { useLocation } from '@linkseeks/router-core'
import { getIntl } from '@linkseeks/i18n'
import OverflowText from '@/components/OverflowText'
import { postOrderVendorValidateReceiptConfirm, postOrderVendorValidateVerify } from '@apps/apis'
import ModalForm from '@/components/ModalForm'
import { createFormActions } from '@apps/formily'
import themeConfig from '@apps/config/lingxi.theme.config'
import style from './index.less'
import cx from 'classnames'
import BigNumber from 'bignumber.js'
import { getWebIntl } from '@apps/locales'

export interface OrderSaleRecordProps {}
const intl = getIntl()
const translate = getWebIntl()
const checkoutActions = createFormActions()

// 订单发货记录
const OrderSaleRecord: React.FC<OrderSaleRecordProps> = () => {
  const { pathname } = useLocation()
  const isPreview = pathname.lastIndexOf('/detail') !== -1
  // 是否是确认发货页
  const isDeleved = pathname.indexOf('readyConfirmDelevedOrder') !== -1
  // 是否是确认回单页
  const isReturn = pathname.indexOf('readyConfirmReturnOrder') !== -1
  // 是否待核销页
  const isCheckout = pathname.indexOf('readyCheckoutOrder') !== -1
  const [disabled, setDisabled] = useState<boolean>(false)
  const [visible, setVisible] = useState<boolean>(false)
  const [transData, setTransData] = useState<string[]>([])
  const [currentRecord, setCurrentRecord] = useState<any>()
  const [loading, setLoading] = useState<boolean>(false)
  // 用于储存已经修改过的订单id
  const dataRef = useRef<any>([])
  const checkoutRef = useRef<any>({})
  const {
    formContext: { data, reloadFormData },
  } = useContext(OrderDetailContext)
  const { deliveries, deliveryDetails, orderMode, externalState, orderKind, orderId } = data
  const contractOrder = orderKind === OrderKindType.SRM_ORDER || orderKind === OrderKindType.REQUISITION_ORDER
  const creditsCommodity = orderMode === 10 || orderMode === 25 // @todo 积分或渠道积分下单模式

  const contractModeTouBiao = orderMode === 13
  /*change收发货信息布局*/
  const LOGSTATESTYPE = {
    /** 订单收发货统计 */
    EXTERNALSTATES: 1,
    /** 订单收发货明细 */
    INTERIORSTATES: 2,
  }
  /*批次类型*/
  // 1-合格 2-部分合格 3-让步接收 4-拒收
  const batchJudgmentType = {
    '1': intl.formatMessage({ id: 'eightD.hege', defaultMessage: '合格' }),
    '2': intl.formatMessage({ id: 'eightD.rangbujieshou', defaultMessage: '部分合格' }),
    '3': intl.formatMessage({ id: 'eightD.jushou', defaultMessage: '让步接收' }),
    '4': intl.formatMessage({ id: 'eightD.jushou', defaultMessage: '拒收' }),
  }
  const [logStatus, setLogStatus] = useState<number>(LOGSTATESTYPE.EXTERNALSTATES)
  /*分页*/
  const [, setPage] = useState<number>(1)

  /*收发货进度*/
  const numberInt = (leftCount, delivered) => {
    const allcount = new BigNumber(+leftCount).plus(delivered).toNumber()
    if (leftCount == 0) return 100
    if (delivered == 0) return 0
    const data = (delivered / allcount) * 100
    return data
  }
  const outOrderCols: any[] = [
    {
      title: intl.formatMessage({ id: 'transaction_components.shangpinID' }),
      dataIndex: 'skuId',
      align: 'center',
      key: 'skuId',
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.shangpinmingcheng' }),
      dataIndex: 'name',
      align: 'center',
      key: 'name',
      render: (t, r) => `${t}/${r.spec}`,
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.pinlei' }),
      dataIndex: 'category',
      align: 'center',
      key: 'category',
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.pinpai' }),
      dataIndex: 'brand',
      align: 'center',
      key: 'brand',
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.danwei' }),
      dataIndex: 'unit',
      align: 'center',
      key: 'unit',
    },
    {
      title: creditsCommodity
        ? intl.formatMessage({ id: 'transaction_components.suoxujifen' })
        : intl.formatMessage({ id: 'transaction_components.danjia' }),
      dataIndex: 'price',
      align: 'center',
      key: 'price',
    },
    {
      title: creditsCommodity
        ? intl.formatMessage({ id: 'transaction_components.duihuanshuliang' })
        : intl.formatMessage({ id: 'transaction_components.caigoushuliang' }),
      dataIndex: 'quantity',
      align: 'center',
      key: 'quantity',
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.hanshui' }),
      dataIndex: 'tax',
      align: 'center',
      key: 'tax',
      render: (text) =>
        text
          ? intl.formatMessage({ id: 'transaction_components.shi' })
          : intl.formatMessage({ id: 'transaction_components.fou' }),
    },
    {
      title: creditsCommodity
        ? intl.formatMessage({ id: 'transaction_components.suoxujifenxiaoji' })
        : intl.formatMessage({ id: 'transaction_components.jine' }),
      dataIndex: 'amount',
      align: 'center',
      key: 'amount',
      render: (t) => (creditsCommodity ? t : `${t}`),
    },
    // {
    //   title: intl.formatMessage({ id: 'transaction_components.yifahuo' }),
    //   dataIndex: 'delivered',
    //   align: 'center',
    //   key: 'delivered',
    // },
    {
      title: `${intl.formatMessage({
        id: 'transaction_components.yifahuo',
      })}/${intl.formatMessage({ id: 'transaction_components.weifahuo' })}`,
      dataIndex: 'leftCount',
      align: 'center',
      key: 'leftCount',
      render: (t, s) => (
        <>
          <div>
            <p>
              {s.delivered}/{t}
            </p>
            <Progress
              percent={numberInt(t, s.delivered)}
              showInfo={false}
              size="small"
              status="normal"
              strokeColor="#686D75"
            />
          </div>
        </>
      ),
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.yishouhuo' }),
      dataIndex: 'received',
      align: 'center',
      key: 'received',
    },
    // 这个几个字段是跟质检验收相关，有需要才放开注释
    // {
    //   title: intl.formatMessage({ id: 'transaction_components.yunxushuliang' }),
    //   dataIndex: 'acceptanceCount',
    //   align: 'center',
    //   key: 'acceptanceCount',
    // },
    // {
    //   title: intl.formatMessage({ id: 'transaction_components.rangbujieshoushuliang' }),
    //   dataIndex: 'concessionToReceiveCount',
    //   align: 'center',
    //   key: 'concessionToReceiveCount',
    // },
    // {
    //   title: intl.formatMessage({ id: 'transaction_components.jushoushuliang' }),
    //   dataIndex: 'rejectCount',
    //   align: 'center',
    //   key: 'rejectCount',
    // },
    {
      title: intl.formatMessage({ id: 'transaction_components.chayishuliang' }),
      dataIndex: 'differCount',
      align: 'center',
      key: 'differCount',
    },
  ]

  const outerMaterialCols: any[] = [
    {
      title: 'ID',
      dataIndex: 'productId',
      align: 'center',
      key: 'productId',
      className: 'commonHide',
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.wuliaobianhao' }),
      dataIndex: 'productNo',
      align: 'center',
      key: 'productNo',
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.wuliaomingchengguige' }),
      dataIndex: 'name',
      align: 'center',
      key: 'name',
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.pinlei' }),
      dataIndex: 'category',
      align: 'center',
      key: 'category',
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.pinpai' }),
      dataIndex: 'brand',
      align: 'center',
      key: 'brand',
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.danwei' }),
      dataIndex: 'unit',
      align: 'center',
      key: 'unit',
    },
    // {
    //   title: intl.formatMessage({id: 'transaction_components.guanlianbaojiashangpinIDming'}),
    //   dataIndex: 'quotedSkuId',
    //   align: 'center',
    //   key: 'quotedSkuId',
    //   render: (t, r) => t ? `${t}/${r.quotedName || ''}/${r.quotedCategory || ''}/${r.quotedBrand || ''}` : ''
    // },
    {
      title: intl.formatMessage({ id: 'transaction_components.caigoushuliang' }),
      dataIndex: 'quantity',
      align: 'center',
      key: 'quantity',
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.hanshui' }),
      dataIndex: 'tax',
      align: 'center',
      key: 'tax',
      render: (text, r) => (
        <>
          {text
            ? intl.formatMessage({ id: 'transaction_components.shi' })
            : intl.formatMessage({ id: 'transaction_components.fou' })}
          {r?.taxRate && '/' + r.taxRate + '%'}
        </>
      ),
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.jine' }),
      dataIndex: 'amount',
      align: 'center',
      key: 'amount',
      render: (t) => `${t}`,
    },
    // {
    //   title: intl.formatMessage({id: 'transaction_components.yifahuo'}),
    //   dataIndex: 'delivered',
    //   align: 'center',
    //   key: 'delivered',
    // },
    {
      title: `${intl.formatMessage({
        id: 'transaction_components.yifahuo',
      })}/${intl.formatMessage({ id: 'transaction_components.weifahuo' })}`,
      dataIndex: 'leftCount',
      align: 'center',
      key: 'leftCount',
      render: (t, s) => (
        <>
          <div>
            <p>
              {s.delivered}/{t}
            </p>
            <Progress
              percent={numberInt(t, s.delivered)}
              showInfo={false}
              size="small"
              status="normal"
              strokeColor="#686D75"
            />
          </div>
        </>
      ),
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.yishouhuo' }),
      dataIndex: 'received',
      align: 'center',
      key: 'received',
    },
    // 这个几个字段是跟质检验收相关，有需要才放开注释
    // {
    // 	title: intl.formatMessage({ id: 'transaction_components.yunxushuliang' }),
    // 	dataIndex: 'acceptanceCount',
    // 	align: 'center',
    // 	key: 'acceptanceCount',
    // },
    // {
    // 	title: intl.formatMessage({ id: 'transaction_components.rangbujieshoushuliang' }),
    // 	dataIndex: 'concessionToReceiveCount',
    // 	align: 'center',
    // 	key: 'concessionToReceiveCount',
    // },
    // {
    // 	title: intl.formatMessage({ id: 'transaction_components.jushoushuliang' }),
    // 	dataIndex: 'rejectCount',
    // 	align: 'center',
    // 	key: 'rejectCount',
    // },
    {
      title: intl.formatMessage({ id: 'transaction_components.chayishuliang' }),
      dataIndex: 'differCount',
      align: 'center',
      key: 'differCount',
    },
  ]

  const sideChildrenCols: any[] = [
    {
      title: intl.formatMessage({ id: 'transaction_components.shangpinID' }),
      dataIndex: 'skuId',
      align: 'center',
      key: 'skuId',
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.shangpinmingcheng' }),
      dataIndex: 'name',
      align: 'center',
      key: 'name',
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.pinlei' }),
      dataIndex: 'category',
      align: 'center',
      key: 'category',
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.pinpai' }),
      dataIndex: 'brand',
      align: 'center',
      key: 'brand',
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.danwei' }),
      dataIndex: 'unit',
      align: 'center',
      key: 'unit',
    },
    {
      title: creditsCommodity
        ? intl.formatMessage({ id: 'transaction_components.duihuanshuliang' })
        : intl.formatMessage({ id: 'transaction_components.caigoushuliang' }),
      dataIndex: 'quantity',
      align: 'center',
      key: 'quantity',
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.fahuoshuliang' }),
      dataIndex: 'delivered',
      align: 'center',
      key: 'delivered',
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.shouhuoshuliang' }),
      dataIndex: 'received',
      align: 'center',
      key: 'received',
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.picipanding' }),
      dataIndex: 'batchJudgmentType',
      align: 'center',
      key: 'batchJudgmentType',
      render: (t) => (t ? batchJudgmentType[t] : null),
    },
    // 这个几个字段是跟质检验收相关，有需要才放开注释
    // {
    // 	title: intl.formatMessage({ id: 'transaction_components.yunxushuliang' }),
    // 	dataIndex: 'acceptanceCount',
    // 	align: 'center',
    // 	key: 'acceptanceCount',
    // },
    // {
    // 	title: intl.formatMessage({ id: 'transaction_components.rangbujieshoushuliang' }),
    // 	dataIndex: 'concessionToReceiveCount',
    // 	align: 'center',
    // 	key: 'concessionToReceiveCount',
    // },
    // {
    // 	title: intl.formatMessage({ id: 'transaction_components.jushoushuliang' }),
    // 	dataIndex: 'rejectCount',
    // 	align: 'center',
    // 	key: 'rejectCount',
    // },
    {
      title: intl.formatMessage({ id: 'transaction_components.chayishuliang' }),
      dataIndex: 'differCount',
      align: 'center',
      key: 'differCount',
    },
  ]

  const sideChildrenMaterialCols: any[] = [
    {
      title: 'ID',
      dataIndex: 'productId',
      align: 'center',
      key: 'productId',
      className: 'commonHide',
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.wuliaobianhao' }),
      dataIndex: 'productNo',
      align: 'center',
      key: 'productNo',
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.wuliaomingchengguige' }),
      dataIndex: 'name',
      align: 'center',
      key: 'name',
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.pinlei' }),
      dataIndex: 'category',
      align: 'center',
      key: 'category',
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.pinpai' }),
      dataIndex: 'brand',
      align: 'center',
      key: 'brand',
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.danwei' }),
      dataIndex: 'unit',
      align: 'center',
      key: 'unit',
    },
    // {
    //   title: intl.formatMessage({id: 'transaction_components.guanlianbaojiashangpinIDming'}),
    //   dataIndex: 'quotedSkuId',
    //   align: 'center',
    //   key: 'quotedSkuId',
    //   render: (t, r) => t ? `${t}/${r.quotedName || ''}/${r.quotedCategory || ''}/${r.quotedBrand || ''}` : ''
    // },
    {
      title: intl.formatMessage({ id: 'transaction_components.caigoushuliang' }),
      dataIndex: 'quantity',
      align: 'center',
      key: 'quantity',
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.fahuoshuliang' }),
      dataIndex: 'delivered',
      align: 'center',
      key: 'delivered',
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.shouhuoshuliang' }),
      dataIndex: 'received',
      align: 'center',
      key: 'received',
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.picipanding' }),
      dataIndex: 'batchJudgmentType',
      align: 'center',
      key: 'batchJudgmentType',
      render: (t) => (t ? batchJudgmentType[t] : null),
    },
    // 这个几个字段是跟质检验收相关，有需要才放开注释
    // {
    //   title: intl.formatMessage({ id: 'transaction_components.yunxushuliang' }),
    //   dataIndex: 'acceptanceCount',
    //   align: 'center',
    //   key: 'acceptanceCount',
    // },
    // {
    //   title: intl.formatMessage({ id: 'transaction_components.rangbujieshoushuliang' }),
    //   dataIndex: 'concessionToReceiveCount',
    //   align: 'center',
    //   key: 'concessionToReceiveCount',
    // },
    // {
    //   title: intl.formatMessage({ id: 'transaction_components.jushoushuliang' }),
    //   dataIndex: 'rejectCount',
    //   align: 'center',
    //   key: 'rejectCount',
    // },
    {
      title: intl.formatMessage({ id: 'transaction_components.chayishuliang' }),
      dataIndex: 'differCount',
      align: 'center',
      key: 'differCount',
    },
  ]

  const handlePreviewReturn = (record) => {
    if (record?.receiveBill) {
      setTransData([record.receiveBill])
    }
    setVisible(true)
  }

  const handleCheckout = (record) => {
    setCurrentRecord(record)
    checkoutRef.current.setVisible(true)
  }

  // 确认发货
  const handleConfirm = async () => {
    // const params = {
    //   orderId: record.orderId,
    //   id: record.id
    // }
    // setDisabled(true)
    // const { code } = await postOrderConfirmShipmentOrder(params)
    // if (code === 1000) {
    //   dataRef.current.push(record.id)
    //   reloadFormData && reloadFormData()
    //   setDisabled(false)
    // } else {
    //   setDisabled(false)
    // }
  }

  // 确认回单
  const handleReturn = async (record) => {
    const params = {
      orderId: record.orderId,
      batchNo: record.batchNo,
    }
    setDisabled(true)
    const { code } = await postOrderVendorValidateReceiptConfirm(params)
    if (code === 1000) {
      dataRef.current.push(record.id)
      reloadFormData && reloadFormData()
      setDisabled(false)
    } else {
      setDisabled(false)
    }
  }

  // 核销自提码
  const handleSubmitCheckout = () => {
    setLoading(true)
    checkoutActions.submit().then(async ({ values }: any) => {
      console.log(values, currentRecord)
      postOrderVendorValidateVerify({
        orderId: orderId,
        batchNo: currentRecord.batchNo,
        selfCode: values.code,
      })
        .then(({ code }) => {
          if (code === 1000) {
            checkoutRef.current.setVisible(false)
            reloadFormData && reloadFormData()
          }
        })
        .finally(() => {
          setLoading(false)
        })
    })
  }

  // 确认全部发货单已收到回单
  const handelReciveReturnOrder = async () => {
    // const res = await getOrderIsDeliveryCompleted({id: data.id}, {ctlType: "none"})
    // let tip = ''
    // if(res.data)
    //   tip = '是否确认本单全部发货单已收到回单？'
    // else
    //   tip = '您还有未发货的商品，是否确认全部发货都已完成？'
    // confirm({
    //   title: '提示',
    //   icon: <ExclamationCircleOutlined />,
    //   content: tip,
    //   onOk() {
    //     handleSubmit()
    //   },
    // });
  }

  // 继续发货
  const handleContinueDeliver = async () => {
    // const res = await getOrderIsDeliveryCompleted({id: data.id},  {ctlType: 'none'})
    // let tip = ''
    // if(res.data)
    //   tip = '您商品都已发货．是否确认还需要继续发货？'
    // else
    //   tip = '是否继续发货？'
    // confirm({
    //   title: '提示',
    //   icon: <ExclamationCircleOutlined />,
    //   content: tip,
    //   onOk() {
    //     postOrderReceiptOrderContinueShipping({orderId: data.id}).then(res => {
    //       if(res.code === 1000) {
    //         setTimeout(() => {
    //           history.goBack()
    //         }, 1000)
    //       }
    //     })
    //   },
    // });
  }
  /*修改ui*/
  const LogStatusFn = (e) => {
    setLogStatus(e)
  }
  const onChange = () => {}
  /*ItwmList*/
  const listItem = (record) => (
    <div className={style.listItem}>
      <div className={style.label}>
        <p>{intl.formatMessage({ id: 'contract.guanlian' })}</p>
        <p>
          {contractModeTouBiao
            ? intl.formatMessage({ id: 'contract.baojiashangpin' })
            : intl.formatMessage({ id: 'contract.baojiashangpin' })}
        </p>
      </div>
      <div className={style.text}>
        <p>
          {intl.formatMessage({ id: 'contract.shangpinID' })}：{record.skuId}
        </p>
        <p className={style.nowrap}>
          {intl.formatMessage({ id: 'contract.shangpinmingcheng' })}：{record.name}
        </p>
      </div>
      <div className={style.text}>
        <p>
          {intl.formatMessage({ id: 'contract.guige' })}：{record.spec}
        </p>
        <p>
          {intl.formatMessage({ id: 'contract.pinlei' })}：{record.category}
        </p>
      </div>
      <div className={style.text}>
        <p>
          {intl.formatMessage({ id: 'contract.pinpai' })}：{record.brand}
        </p>
      </div>
    </div>
  )
  /*订单明细*/
  const DeliverlyItem = ({ record }) => {
    return (
      <div className={[style.deliverlyItem].join('')}>
        <div style={{ flex: 1 }}>
          <p className={style.text}>
            {intl.formatMessage({ id: 'contract.fahuodanhao' })}：{record.deliveryNo}
          </p>
          <p className={style.nowrap}>
            {intl.formatMessage({ id: 'contract.fahuoshijian' })}：{record.createTime}
          </p>
        </div>
        <div style={{ flex: 1 }}>
          <p className={style.text}>
            {intl.formatMessage({ id: 'contract.wuliudanhao' })}：{record.logisticsNo}
          </p>
          <p>
            {intl.formatMessage({ id: 'contract.wuliugongsi' })}：{record.company}
          </p>
        </div>
        <div style={{ flex: 1 }}>
          <p className={style.text}>
            {intl.formatMessage({ id: 'contract.shouhuodanhao' })}：{record.receiptNo}
          </p>
          <p>
            {intl.formatMessage({ id: 'contract.shouhuoshijian' })}：{record.receiptTime}
          </p>
        </div>
      </div>
    )
  }
  return (
    <Space direction="vertical" style={{ display: 'flex', width: '100%' }} size={16}>
      <Card
        id="shippingStatistics"
        className={cx(style.recordLyout, 'deleveBox')}
        title={translate('web.resource.order.fahuotongji')}
      >
        {deliveries?.length > 0 && (
          <>
            <Table
              columns={contractOrder ? outerMaterialCols : outOrderCols}
              dataSource={deliveries}
              pagination={false}
              rowKey={(i, key) => {
                return String(i.productId) + String(key)
              }}
              expandable={
                contractOrder
                  ? {
                      expandedRowRender: (record) => listItem(record),
                    }
                  : undefined
              }
            />
          </>
        )}
      </Card>
      <Card
        id="shippingDetails"
        className={cx(style.recordLyout, 'deleveBox')}
        title={translate('web.resource.order.fahuomingxi')}
      >
        {deliveryDetails?.length > 0 &&
          deliveryDetails
            .sort((a, b) => (b.batchNo > a.batchNo ? 1 : -1))
            ?.map((item) => {
              return (
                <div className={style['deliveryDetailsBox']}>
                  <div className={style['deliveryDetailsBox-title']}>
                    <b className={style['deliveryDetailsBox-batchNo']}>
                      {translate('web.resource.transaction.dinpici', { n: item?.batchNo })}
                    </b>
                    <div className={cx(style['deliveryDetailsBox-tag'], item.receiptTime && style.primary)}>
                      {item.innerStatusName}
                    </div>
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                      {!isPreview && isReturn && item.showReply && (
                        <Button type="primary" disabled={disabled} onClick={() => handleReturn(item)}>
                          {intl.formatMessage({ id: 'transaction_components.querenhuidan' })}
                        </Button>
                      )}
                      {!isPreview && isDeleved && item.showDelivery && (
                        <Button type="primary" disabled={disabled} onClick={() => handleConfirm()}>
                          {intl.formatMessage({ id: 'transaction_components.querenfahuo' })}
                        </Button>
                      )}
                      {isPreview && item.receiptTime && (
                        <Button type="primary" disabled={disabled} onClick={() => handlePreviewReturn(item)}>
                          {intl.formatMessage({ id: 'transaction_components.zhakanshouhuohuidan' })}
                        </Button>
                      )}
                      {isCheckout && item.showVerify && (
                        <Button type="primary" onClick={() => handleCheckout(item)}>
                          {intl.formatMessage({ id: 'transaction_components.hexiaozitidingdan' })}
                        </Button>
                      )}
                    </div>
                  </div>
                  <DeliverlyItem record={item} />
                  <Table
                    columns={contractOrder ? sideChildrenMaterialCols : sideChildrenCols}
                    rowKey={(i, key) => {
                      return String(i.productId) + String(key)
                    }}
                    expandable={
                      contractOrder
                        ? {
                            expandedRowRender: (record) => listItem(record),
                          }
                        : undefined
                    }
                    dataSource={item?.products}
                    style={{
                      width: '100%',
                    }}
                    pagination={false}
                  />
                  {externalState === 11 && !isPreview && isReturn && (
                    <Space style={{ marginTop: 18, display: 'flex', justifyContent: 'flex-end' }}>
                      <Button type="primary" onClick={handelReciveReturnOrder}>
                        {intl.formatMessage({
                          id: 'transaction_components.querenbendanquanbufahuo',
                        })}
                      </Button>
                      <Button type="primary" onClick={handleContinueDeliver}>
                        {intl.formatMessage({ id: 'transaction_components.jixufahuo' })}
                      </Button>
                    </Space>
                  )}
                </div>
              )
            })}
      </Card>
      <Modal
        title={intl.formatMessage({ id: 'transaction_components.zhakanshouhuohuidan' })}
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <List
          itemLayout="horizontal"
          dataSource={transData || []}
          renderItem={(item: string) => (
            <List.Item
              style={{ fontSize: 12 }}
              extra={
                <a href={item} target="_blank" rel="noreferrer">
                  {intl.formatMessage({ id: 'transaction_components.yulan' })}
                </a>
              }
            >
              <OverflowText style={{ flex: '.9' }}>{item}</OverflowText>
            </List.Item>
          )}
        />
      </Modal>
      {/* 核销自提订单 */}
      <ModalForm
        modalTitle="核销自提订单"
        currentRef={checkoutRef}
        confirm={handleSubmitCheckout}
        actions={checkoutActions}
        schema={{
          type: 'object',
          properties: {
            NO_SUBMIT: {
              type: 'object',
              'x-component': 'mega-layout',
              'x-component-props': {
                labelAlign: 'top',
              },
              properties: {
                orderProductId: {
                  type: 'number',
                  title: intl.formatMessage({
                    id: 'transaction_components.dangqiandingdanshangpinid',
                  }),
                  visible: false,
                },
                code: {
                  title: '自提码',
                  type: 'string',
                  'x-component-props': {
                    placeholder: '请输入自提码',
                  },
                  // 'x-rules': [
                  //   {
                  //     required: true,
                  //     message: intl.formatMessage({ id: 'transaction_components.qingtianxiedanjia' })
                  //   },
                  //   {
                  //     pattern: /^\d+(\.\d{1,3})?$/,
                  //     message: intl.formatMessage({ id: 'transaction_components.danjiajinxiansanweixiaoshu' })
                  //   }
                  // ]
                },
              },
            },
          },
        }}
        modalProps={{ confirmLoading: loading }}
      />
    </Space>
  )
}

OrderSaleRecord.defaultProps = {}

export default OrderSaleRecord
