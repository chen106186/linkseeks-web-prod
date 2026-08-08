import React, { useRef, useState } from 'react'
import { history } from '@linkseeks/router-manager'
import EyePreview from '@/components/EyePreview'
import moment from 'moment'
import { Button, Popconfirm, Modal, Input, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import {
  postTradeAskPurchasePage,
  postTradeAskPurchaseDelete,
  postTradeInquiryListDeleteAll,
  postTradeAskPurchasePublish,
  postTradeAskPurchaseTerminate,
  postTradeAskPurchaseInvalid,
  postTradeAskPurchaseEndQuote,
  PostTradeAskPurchasePageResponseDetail,
} from '@apps/apis'
import { createFormActions, SchemaForm } from '@apps/formily'
import { getModaSchema } from './schema/modalSchema'
import { innerStatusList, STATUS } from '../constats'
import { AuthButton, StandardFormTable } from '@apps/components'
import { useWebIntl } from '@apps/locales'

const action = createFormActions()

const index: React.FC = () => {
  const loadingRef = useRef<boolean>(false)
  const tableRef = StandardFormTable.useTableRef()
  const translate = useWebIntl()

  const format = (text, fmt?: string) => {
    return <>{moment(text).format(fmt || 'YYYY-MM-DD HH:mm:ss')}</>
  }

  const [rowkeys, setRowKeys] = useState<any>([])

  const [termination, setTermination] = useState<boolean>(false)
  const [toVoid, setToVoid] = useState<boolean>(false)
  /** 批量审核 */
  const fetchSubmitBatch = async (id?: number) => {
    let res: any = null
    if (loadingRef.current) {
      return
    }
    loadingRef.current = true
    if (id) {
      res = await postTradeAskPurchasePublish({ ids: [Number(id)] })
    } else {
      const selectItems = tableRef.current.getSelectionItems()
      if (selectItems.length === 0) {
        message.info(translate('web.common.selectOneRequest'))
        return
      }

      res = await postTradeAskPurchasePublish({ ids: selectItems.map((item) => item.id) })
    }
    if (res.code !== 1000) {
      loadingRef.current = false
      return
    }
    tableRef.current.reload()
    tableRef.current.clearSelection()
    loadingRef.current = false
  }

  /**
   * 删除或批量删除
   * @type: 1: 单个删除, 2: 批量删除
   * */
  const fnDelectItem = async (id?: number) => {
    let res: any = null
    if (id) {
      res = await postTradeAskPurchaseDelete({ id })
    } else {
      res = await postTradeInquiryListDeleteAll({ ids: rowkeys })
    }
    if (res.code === 1000) {
      tableRef.current.reload()
      setRowKeys([])
    }
  }

  /**
   * 结束报价
   * @type: 1: 单个删除, 2: 批量删除
   * */
  const fnStopQuote = async (id: number) => {
    let res = await postTradeAskPurchaseEndQuote({ id })
    if (res.code === 1000) {
      tableRef.current.reload()
    }
  }

  const fnDelectItemDesc = () => {
    setTermination(false)
    setToVoid(false)
    action.validate().then((errorRes) => {
      if (errorRes.errors.length === 0) {
        const value = action.getFieldValue('formData')
        const objPar = {
          id: value.id,
          remark: value.cancelReason,
          cancelTime: value.cancelTime,
        }
        const fnApi = toVoid ? postTradeAskPurchaseInvalid : postTradeAskPurchaseTerminate
        fnApi(objPar).then((res: any) => {
          console.log(res)
          tableRef.current.reload()
        })
      }
    })
  }

  /**
   * 生成订单
   * @param record
   */
  const handleCreateOrder = (record: PostTradeAskPurchasePageResponseDetail) => {
    Modal.confirm({
      title: translate('web.resource.deal.shifouquerenshengchengdingdan'),
      onOk: () => {
        if (record.awardBidQuoteId) {
          history.push(
            `/orderAbility/purchaseOrder/readyAddSourcingOrder/add?awardBidQuoteId=${record.awardBidQuoteId}`,
          )
        }
      },
    })
  }

  const columns = StandardFormTable.createColumns([
    {
      title: translate('web.resource.mall.xuqiudanhao'),
      searchField: {
        main: true,
      },
      key: 'askPurchaseNo',
      dataIndex: 'askPurchaseNo',
      render: (text: any, record: any) => (
        <EyePreview url={`/dealAbility/wangBuy/list/detail?id=${record.id}`}>{text}</EyePreview>
      ),
    },
    {
      title: translate('web.resource.mall.xuqiuzhaiyao'),
      key: 'name',
      dataIndex: 'name',
      searchField: 'Input',
    },
    {
      title: translate('web.resource.mall.baojiajiezhishijian'),
      key: 'quoteEndTime',
      dataIndex: 'quoteEndTime',
      render: (text: any) => text && format(text),
    },
    {
      title: translate('web.resource.member.danjushijian'),
      key: 'billTime',
      dataIndex: 'billTime',
      searchField: {
        type: 'DateRange',
        showTime: true,
        name: ['billStartTime', 'billEndTime'],
        placeholder: [translate('web.common.kaishishijian'), translate('web.common.jieshushijian')],
      },
      render: (text: any) => text && format(text),
    },
    {
      title: translate('web.resource.deal.shoudaobaojiadanfenshu'),
      key: 'quoteCount',
      dataIndex: 'quoteCount',
    },
    {
      title: translate('web.resource.deal.xuqiudanzhuangtai'),
      key: 'status',
      dataIndex: 'status',
      searchField: {
        type: 'Select',
        valueEnum: [
          {
            label: translate('web.resource.deal.suoyouzhuangtai'),
            value: STATUS.allStatus,
          },
          {
            label: translate('web.resource.mall.daifabu'),
            value: STATUS.toBeReleased,
          },
          {
            label: translate('web.resource.mall.daibaojia'),
            value: STATUS.waitQuote,
          },
          {
            label: translate('web.resource.deal.daibijia'),
            value: STATUS.toBeParity,
          },
          {
            label: translate('web.resource.deal.daishenheshoubiaoyiji'),
            value: STATUS.waitAuditBidOne,
          },
          {
            label: translate('web.resource.deal.daishenheshoubiaoerji'),
            value: STATUS.waitAuditBidTwo,
          },
          {
            label: translate('web.resource.deal.shoubiaoshenhebutongguoyiji'),
            value: STATUS.waitUnPassAuditBidOne,
          },
          {
            label: translate('web.resource.deal.shoubiaoshenhebutonguoerji'),
            value: STATUS.waitUnPassAuditBidTwo,
          },
          {
            label: translate('web.resource.deal.daiquerenshoubiao'),
            value: STATUS.waitConfirm,
          },
          {
            label: translate('web.resource.mall.finshed'),
            value: STATUS.finished,
          },
        ],
      },
      render: (text: any) => <div>{text && innerStatusList[text]}</div>,
    },
    {
      title: translate('web.common.control'),
      key: 'options',
      width: 235,
      dataIndex: 'options',
      render: (text: any, record: any) => {
        return (
          <div style={{ display: 'flex' }}>
            {record.status === 1 && (
              <>
                <AuthButton code="fabu" type="custom">
                  <Popconfirm
                    title={translate('web.resource.deal.shifoutijiaofabuxunyuanxuqiu')}
                    okText={translate('web.common.shi')}
                    cancelText={translate('web.common.fou')}
                    onConfirm={() => fetchSubmitBatch(record.id)}
                  >
                    <Button type="link">{translate('web.resource.deal.fabu')}</Button>
                  </Popconfirm>
                </AuthButton>
                <AuthButton code="edit" type="custom">
                  <Button type="link" onClick={() => history.push(`/dealAbility/wangBuy/list/edit?id=${record.id}`)}>
                    {translate('web.common.change')}
                  </Button>
                </AuthButton>
                <AuthButton code="shanchu" type="custom">
                  <Popconfirm
                    title={translate('web.resource.deal.shifoushanchuxunyuanxuqiudan')}
                    okText={translate('web.common.shi')}
                    cancelText={translate('web.common.fou')}
                    onConfirm={() => fnDelectItem(record.id)}
                  >
                    <Button type="link">{translate('web.common.delete')}</Button>
                  </Popconfirm>
                </AuthButton>
              </>
            )}
            {record.status === 2 && (
              <AuthButton code="zhongzhi" type="custom">
                <Popconfirm
                  title={translate('web.resource.deal.shifoutiqianjieshudangqianbaojia')}
                  okText={translate('web.common.shi')}
                  cancelText={translate('web.common.fou')}
                  onConfirm={() => fnStopQuote(record.id)}
                >
                  <Button type="link">{translate('web.resource.deal.jieshubaojia')}</Button>
                </Popconfirm>
              </AuthButton>
            )}
            {record.status === 3 && (
              <Button
                type="link"
                onClick={() => history.push(`/dealAbility/wangBuy/list/detail?id=${record.id}&comparePrices=true`)}
              >
                {translate('web.resource.deal.bijia')}
              </Button>
            )}
            {(record.status === 4 || record.status === 5) && (
              <Button
                type="link"
                onClick={() => history.push(`/dealAbility/wangBuy/list/detail?id=${record.id}&comparePrices=true`)}
              >
                {translate('web.common.approved')}
              </Button>
            )}
            {(record.status === 6 || record.status === 7) && (
              <Button
                type="link"
                onClick={() => history.push(`/dealAbility/wangBuy/list/detail?id=${record.id}&comparePrices=true`)}
              >
                {translate('web.resource.deal.xiugaishoubiaojieguo')}
              </Button>
            )}
            {record.status === 8 && (
              <Button
                type="link"
                onClick={() => history.push(`/dealAbility/wangBuy/list/detail?id=${record.id}&comparePrices=true`)}
              >
                {translate('web.resource.mall.confirmQuote')}
              </Button>
            )}
            {record.status === 9 && (
              <Button type="link" onClick={() => handleCreateOrder(record)}>
                {translate('web.resource.deal.shengchengdingdan')}
              </Button>
            )}
            {Number(record.quoteCount) > 0 && (
              <AuthButton code="detail" type="custom">
                <Button type="link" onClick={() => history.push(`/dealAbility/wangBuy/offer/detail?id=${record.id}`)}>
                  {translate('web.resource.deal.chakanbaojia')}
                </Button>
              </AuthButton>
            )}
            {record.status > 1 && record.status < 9 && (
              <>
                <AuthButton code="zuofei" type="custom">
                  <Button
                    type="link"
                    onClick={() => {
                      setToVoid(true)
                      action.setFieldValue('formData', {
                        cancelTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                        id: record.id,
                        eightDRectificationNo: text,
                        cancelReason: '',
                      })
                    }}
                  >
                    {translate('web.common.zuofei')}
                  </Button>
                </AuthButton>
              </>
            )}
          </div>
        )
      },
    },
  ])

  const fetchData = (params) => {
    const payload = {
      ...params,
    }

    if (payload.billStartTime) {
      payload.billStartTime = moment(payload.billStartTime).format('YYYY-MM-DD HH:mm:ss')
    }

    if (payload.billEndTime) {
      payload.billEndTime = moment(payload.billEndTime).format('YYYY-MM-DD HH:mm:ss')
    }

    return new Promise((resolve) => {
      postTradeAskPurchasePage(payload, { ctlType: 'none' }).then((res) => {
        const { data } = res
        resolve(data)
      })
    })
  }

  return (
    <>
      <StandardFormTable
        actionRef={tableRef}
        columns={columns}
        request={fetchData}
        isRowSelection
        searchButtons={[
          {
            icon: <PlusOutlined />,
            children: translate('web.resource.logistics.xinjian'),
            type: 'primary',
            key: 'add',
            onClick: () => {
              history.push(`/dealAbility/wangBuy/list/add`)
            },
          },
          {
            children: translate('web.resource.deal.piliangfabu'),
            key: 'piliangfabu',
            onClick: () => {
              fetchSubmitBatch()
            },
          },
        ]}
      />
      <Modal
        title={
          termination ? translate('web.resource.deal.zhongzhiyuanyin') : translate('web.resource.deal.zuofeiyuanyin')
        }
        open={termination || toVoid}
        onCancel={() => {
          setTermination(false)
          setToVoid(false)
        }}
        onOk={(e) => {
          fnDelectItemDesc()
        }}
      >
        <SchemaForm actions={action} schema={getModaSchema(termination)} components={{ TextArea: Input.TextArea }} />
      </Modal>
    </>
  )
}
export default index
