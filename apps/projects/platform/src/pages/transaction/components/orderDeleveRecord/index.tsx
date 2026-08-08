import React, { useCallback, useContext, useRef, useState } from 'react'
import { Card } from '@linkseeks/ui'
import { Tabs, Table, Button, Modal, List, Radio, Progress, Space, message, Upload } from 'antd'
import { OrderDetailContext } from '../../_public/order/context'
import MellowCard from '@/components/MellowCard'
import { OrderKindType } from '@/constants/order'
import { useLocation } from '@linkseeks/router-core'
import { getIntl } from '@linkseeks/i18n'
import ModalForm from '@/components/ModalForm'
import { createFormActions } from '@apps/formily'
import { authService } from '@apps/services'
import { UPLOAD_TYPE } from '@/constants'
import OverflowText from '@/components/OverflowText'
import { postOrderBuyerValidateReceiveConfirm } from '@apps/apis'
import themeConfig from '@apps/config/lingxi.theme.config'
import style from './index.less'
import BigNumber from 'bignumber.js'
import cx from 'classnames'
import { usePageStatus } from '@/hooks/usePageStatus'
import { getWebIntl } from '@apps/locales'

const intl = getIntl()
const translate = getWebIntl()
const receiveActions = createFormActions()

// 订单发货记录
const OrderDeleveRecord: React.FC = () => {
  const { batchNo = null } = usePageStatus()
  const { pathname } = useLocation()
  const isPreview = pathname.lastIndexOf('/detail') !== -1
  // 是否是确认收货页
  const isReceived = pathname.indexOf('readyReceiveOrder') !== -1
  // 是否是确认回单页
  const isReturn = pathname.indexOf('readyConfirmReturnOrder') !== -1
  // 用于储存已经修改过的订单id
  const dataRef = useRef<any>([])
  const receiveParams = useRef<any>({})
  const receiveRef = useRef<any>({})
  const [disabled, setDisabled] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const { accessToken } = authService.getAuth() || {}
  const [visible, setVisible] = useState<boolean>(false)
  const [transData, setTransData] = useState<string[]>([])

  const {
    formContext: { data, reloadFormData, ctl },
  } = useContext(OrderDetailContext)
  const { deliveries, deliveryDetails, orderMode, orderKind } = data

  const contractOrder = orderKind === OrderKindType.SRM_ORDER || orderKind === OrderKindType.REQUISITION_ORDER

  const creditsCommodity = orderMode === 10 || orderMode === 25 // 积分或渠道积分下单模式

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
  const [logStatus, setLogStatus] = useState<number>(
    batchNo ? LOGSTATESTYPE.INTERIORSTATES : LOGSTATESTYPE.EXTERNALSTATES,
  )
  /*分页*/
  const [, setPage] = useState<number>(1)

  /*收发货进度*/
  const numberInt = (leftCount, delivered) => {
    const allcount = new BigNumber(+leftCount).plus(delivered).toNumber()
    if (leftCount == 0) return 100
    if (delivered == 0) return 0
    const _data = (delivered / allcount) * 100
    return _data
  }
  // useEffect(()=>{

  // })
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
            {s.delivered}/{t}
          </div>
          <Progress
            percent={numberInt(t, s.delivered)}
            showInfo={false}
            size="small"
            status="normal"
            strokeColor="#686D75"
          />
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
    //   title:intl.formatMessage({ id: 'transaction_components.guanlianbaojiashangpinIDming' }),
    //   dataIndex: 'quotedSkuId',
    //   align: 'center',
    //   key: 'quotedSkuId',
    //   render: (t, r) => t ? `${t}/${r.quotedName || ''}/${r.quotedCategory || ''}/${r.quotedBrand || ''}` : ''
    // },
    {
      title: intl.formatMessage({ id: 'transaction_components.guanlianbaojiashangpinIDming' }),
      dataIndex: 'quotedSkuId',
      align: 'center',
      key: 'quotedSkuId',
      render: (t, r) => (t ? `${t}/${r.quotedName || ''}/${r.quotedCategory || ''}/${r.quotedBrand || ''}` : ''),
    },
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
            {s.delivered}/{t}
          </div>
          <Progress
            percent={numberInt(t, s.delivered)}
            showInfo={false}
            size="small"
            status="normal"
            strokeColor="#686D75"
          />
        </>
      ),
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.yishouhuo' }),
      dataIndex: 'received',
      align: 'center',
      key: 'received',
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.yunxushuliang' }),
      dataIndex: 'acceptanceCount',
      align: 'center',
      key: 'acceptanceCount',
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.weifahuo' }),
      dataIndex: 'leftCount',
      align: 'center',
      key: 'concessionToReceiveCount',
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.yishouhuo' }),
      dataIndex: 'received',
      align: 'center',
      key: 'rejectCount',
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.chayishuliang' }),
      dataIndex: 'differCount',
      align: 'center',
      key: 'differCount',
    },
  ]
  /*采购订单-待新增订单*/
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
      title: intl.formatMessage({ id: 'transaction_components.yishouhuoshuliang' }),
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
  /*采购订单-待新增订单*/
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
      title: intl.formatMessage({ id: 'transaction_components.wuliaoguigexinghao' }),
      dataIndex: 'spec',
      align: 'center',
      key: 'spec',
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
    //   title: intl.formatMessage({ id: 'transaction_components.guanlianbaojiashangpinIDming' }),
    //   dataIndex: 'quotedSkuId',
    //   align: 'center',
    //   key: 'quotedSkuId',
    //   render: (t, r) => t ? `${t}/${r.quotedName || ''}/${r.quotedCategory || ''}/${r.quotedBrand || ''}` : ''
    // },
    {
      title: intl.formatMessage({ id: 'transaction_components.guanlianbaojiashangpinIDming' }),
      dataIndex: 'quotedSkuId',
      align: 'center',
      key: 'quotedSkuId',
      render: (t, r) => (t ? `${t}/${r.quotedName || ''}/${r.quotedCategory || ''}/${r.quotedBrand || ''}` : ''),
    },
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
      title: intl.formatMessage({ id: 'transaction_components.chayishuliang' }),
      dataIndex: 'differCount',
      align: 'center',
      key: 'differCount',
    },
  ]

  const handlePreviewSelfCode = (record) => {
    Modal.info({
      title: intl.formatMessage({ id: 'transaction_components.chakanzitima' }),
      content: record.selfCode,
    })
  }

  const handlePreviewReturn = (record) => {
    if (record?.receiveBill) {
      setTransData([record.receiveBill])
    }
    setVisible(true)
  }

  // 确认收货
  const handleConfirm = async (record) => {
    const orderWarehousingTable = document.querySelector('#orderWarehousingTable') as any
    if (orderWarehousingTable) {
      const _data = { ...data }
      _data.autoEnterBatchNo = record.batchNo
      ctl?.setData(_data)
      document.querySelector('main.ant-layout-content').scrollTo(0, orderWarehousingTable.offsetTop)
      return
    }
    // const params = {
    //   orderId: data.orderId,
    //   batchNo: record.batchNo
    // }
    setDisabled(true)
    // const { code } = await postOrderBuyerValidateReceiveConfirm(params)
    // if (code === 1000) {
    //   dataRef.current.push(record.id)
    //   reloadFormData && reloadFormData()
    //   setDisabled(false)
    // } else {
    //   setDisabled(false)
    // }
    receiveParams.current = {
      orderId: data.orderId,
      batchNo: record.batchNo,
    }
    receiveActions.setFieldValue('orderId', data.orderId)
    receiveActions.setFieldValue('batchNo', record.batchNo)
    receiveRef.current.setVisible(true)
  }

  // 提交凭证
  const handleSubmit = useCallback(() => {
    receiveActions.submit().then(async ({ values }: any) => {
      if (values.receiveBill && values.receiveBill[0]) {
        values.receiveBill = values.receiveBill[0].data
      }
      if (receiveParams.current?.orderId) {
        values.orderId = receiveParams.current.orderId
        values.batchNo = receiveParams.current.batchNo
      }
      if (data.warehousingOrderProductDetailVOS) {
        values.warehousingOrderProductDetailVOS = data.warehousingOrderProductDetailVOS
        for (const key in data.warehousingOrderProductDetailVOS) {
          if (
            data.warehousingOrderProductDetailVOS[key].inboundWarehouseId &&
            !data.warehousingOrderProductDetailVOS[key].goodsId
          ) {
            return message.error('请选择关联物料')
          }
        }
      }
      setLoading(true)
      const result = await postOrderBuyerValidateReceiveConfirm(values)
      if (result.code === 1000) {
        receiveActions.reset()
        setLoading(false)
        receiveRef.current.setVisible(false)
        setTimeout(() => {
          reloadFormData && reloadFormData()
          setDisabled(false)
        }, 800)
      } else {
        setLoading(false)
        setDisabled(false)
      }
    })
  }, [data])

  // 确认回单
  const handleReturn = async () => {
    // const params = {
    //   orderId: record.orderId,
    //   id: record.id
    // }
    // setDisabled(true)
    // const { code } = await postOrderReceiptOrderConfirmed(params)
    // if (code === 1000) {
    //   dataRef.current.push(record.id)
    //   reloadFormData && reloadFormData()
    //   setDisabled(false)
    // } else {
    //   setDisabled(false)
    // }
  }

  //
  const LogStatusFn = (e) => {
    setLogStatus(e)
  }
  // 展开/收起的回调
  // const onExpand = (expandedKeys,record) => {
  //   if (expandedKeys) {
  //     setrowkeys({expandedRowKeys:[record.rowKey]})
  //   } else {
  //     setrowkeys( {expandedRowKeys: []} );
  //   }
  // };
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
            <a href={`https://www.kuaidi100.com/chaxun?nu=${record.logisticsNo}`} target="_blank" rel="noreferrer">
              {intl.formatMessage({ id: 'contract.wuliudanhao' })}：{record.logisticsNo}
            </a>
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

  const beforeUpload = (file: any) => {
    const isLt20M = file.size / 1024 / 1024 < 20

    if (!isLt20M) {
      message.error('上传文件大小不超过 20M!')
      return Upload.LIST_IGNORE
    }
  }

  return (
    <Space direction="vertical" style={{ display: 'flex', width: '100%' }} size={16}>
      <Card
        id="shippingStatistics"
        className={cx(style.recordLyout, 'deleveBox')}
        title={translate('web.resource.order.shouhuotongji')}
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
        title={translate('web.resource.order.shouhuomingxi')}
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
                      {!isPreview && isReturn && !dataRef.current.includes(item.id) && (
                        <Button type="primary" disabled={disabled} onClick={() => handleReturn()}>
                          {intl.formatMessage({ id: 'transaction_components.querenhuidan' })}
                        </Button>
                      )}
                      {!isPreview && isReceived && item.showReceive && (
                        <Button type="primary" disabled={disabled} onClick={() => handleConfirm(item)}>
                          {intl.formatMessage({ id: 'transaction_components.querenshouhuo' })}
                        </Button>
                      )}
                      {isPreview && item.receiptTime && (
                        <Button type="primary" disabled={disabled} onClick={() => handlePreviewReturn(item)}>
                          {intl.formatMessage({ id: 'transaction_components.zhakanshouhuohuidan' })}
                        </Button>
                      )}
                      {item.selfCode && (
                        <Button type="primary" disabled={disabled} onClick={() => handlePreviewSelfCode(item)}>
                          {translate('web.resource.order.chakanzitima')}
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
                </div>
              )
            })}
      </Card>
      <ModalForm
        modalTitle={intl.formatMessage({ id: 'transaction_components.querenshouhuo' })}
        currentRef={receiveRef}
        confirm={handleSubmit}
        cancel={() => setDisabled(false)}
        actions={receiveActions}
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
                orderId: {
                  type: 'number',
                  title: intl.formatMessage({ id: 'transaction_components.dangqianid' }),
                  visible: false,
                },
                batchNo: {
                  type: 'number',
                  title: intl.formatMessage({ id: 'transaction_components.shouhuopici' }),
                  visible: false,
                },
                receiveBill: {
                  title: intl.formatMessage({ id: 'transaction_components.shouhuohuidan' }),
                  'x-component': 'Upload',
                  'x-component-props': {
                    listType: 'text',
                    maxCount: 1,
                    action: '/api/support/file/upload',
                    data: { fileType: UPLOAD_TYPE },
                    beforeUpload: '{{beforeUpload}}',
                    headers: {
                      accessToken,
                    },
                    locale: {
                      uploadText: intl.formatMessage({ id: 'common.button.upload' }),
                    },
                  },
                },
              },
            },
          },
        }}
        modalProps={{ confirmLoading: loading }}
        expressionScope={{ beforeUpload }}
      />
      <Modal
        title={intl.formatMessage({ id: 'transaction_components.zhakanshouhuohuidan' })}
        visible={visible}
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
    </Space>
  )
}

OrderDeleveRecord.defaultProps = {}

export default OrderDeleveRecord
