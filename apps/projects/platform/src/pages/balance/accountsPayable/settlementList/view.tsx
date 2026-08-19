import React, { useRef, useCallback, useEffect, useState, useMemo } from 'react'
import { useIntl } from '@linkseeks/i18n'
import QRCode from 'qrcode'
import { PageHeaderWrapper } from '@apps/components'
import { Button, Card, Col, DatePicker, Dropdown, message, Modal, Row, Space } from 'antd'
import NiceForm from '@/components/NiceForm'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { createFormActions, FormEffectHooks } from '@apps/formily'
import StandardTable from '@/components/StandardTable'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { schema } from './schema'
import moment, { Moment } from 'moment'
import { fetchOptions } from '../../common'
import UploadVoucherModal from '../../components/UploadVoucherModal'
import Voucher from '../../components/Voucher'
import useSetSearchValueInTable from '@/hooks/useSetSearchValueInTable'
import {
  getSettlementCommonGetSettlementOrderType,
  getSettlementCommonGetSettlementStatus,
  getSettlementMemberSettlementCommunicationPayResult,
  getSettlementMemberSettlementGetCommunicationPayTradeNo,
  getSettlementMemberSettlementGetPayablePayProve,
  getSettlementMemberSettlementPagePayableSettlement,
  GetSettlementMemberSettlementPagePayableSettlementRequest,
  postSettlementMemberSettlementCommunicationPay,
  postSettlementMemberSettlementPay,
  postSettlementMemberSettlementBuyerPayableSettlementExport,
  postSettlementMemberSettlementBatchPay,
  getSettlementCommonGetExportFlag,
} from '@apps/apis'
import { postSettlementJobMemberManualSettlement } from '@apps/apis'
import OtherPayModal from '../components/OtherPayModal'
import useHandleSettlementList from './hooks/useHandleSettlementList'
import ViewUniversalPay from '../../components/ViewUniversalPay'
import {
  UNIVERSAL_PAY_ALIPAY,
  UNIVERSAL_PAY_BALANCE,
  UNIVERSAL_PAY_QUICK,
  UNIVERSAL_PAY_UNION,
  UNIVERSAL_PAY_WECHAT,
} from '@/constants/universalPay'
import GetCodeModal from '../components/GetCodeModal'
import { postPayEAccountAllInPayConfirmPay } from '@apps/apis'
import QrcodeModal from '../components/QrcodeModal'
import useCycleRequest from './hooks/useCycleRequest'
import { CaretDownOutlined } from '@ant-design/icons'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import { downFileByBuffer } from '@/utils/index'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { AuthButton } from '@apps/components'

const { onFieldValueChange$ } = FormEffectHooks
const { RangePicker } = DatePicker
const formActions = createFormActions()
interface SearchParams {
  settlementName?: string
  payName?: string
  isSettlement: number
  startTime?: Moment
  endTime?: Moment
  prePayStartTime: Moment
  prePayEndTime: Moment
  payStartTime: Moment
  payEndTime: Moment
  orderType?: number
  status?: number
  current: number
  pageSize: number
}

/** 通联支付 11 => 微信， 12 支付宝 13 =》快捷支付 14 =》 网银支付 15 => 月支付  */
type UniversalPay = 11 | 12 | 13 | 14 | 15

const SettlementList = () => {
  const ref = useRef<any>({})
  const intl = useIntl()
  const { searchData, formatInitialValue, clear } = useSetSearchValueInTable()
  const [uploadSubmitLoading, setUploadSubmitLoading] = useState<boolean>()
  const [universalPayLoading, setUniversalPayLoading] = useState<boolean>(false)
  const { itemInfo, modals, handleClose, columns, handleOpen } = useHandleSettlementList()
  const [files, setFiles] = useState([])
  const [qrcodeUrl, setQrcodeUrl] = useState<string>('')
  const [currentUniversalPay, setCurrentUniversalPay] = useState<UniversalPay | null>(null)
  /**
   * 时间戳做随机码，
   * 这里有个场景就是当我付款时，点微信支付等，然后取消了付款，再次点付款(微信支付)，此时通联那边会认为这个支付订单会重复了，所以需要虚构一个随机码去标识一下
   * */
  const [randomCode, setRandomCode] = useState<string>('')

  /** 轮询请求支付状态 */
  const { cycleCancel, cycleStart, result } = useCycleRequest({ offsetTime: 3, endCount: 10 })

  const [selectRow, selectRowFns] = useRowSelectionTable({
    customKey: 'id',
  })

  const universalPayInfo1 = useMemo(
    () => ({
      name: itemInfo?.settlementName,
      amount: itemInfo?.amount,
      statusName: itemInfo?.statusName,
      payWayName: intl.formatMessage({ id: 'balance.tonglianzhifu' }),
      settlementDate: itemInfo?.settlementDate,
    }),
    [itemInfo],
  )

  const universalPayInfo = useMemo(
    () => ({
      name: itemInfo?.payName,
      amount: itemInfo?.amount,
      payMethods: intl.formatMessage({ id: 'balance.tonglianzhifu' }),
    }),
    [itemInfo],
  )

  /**
   * 分页查询
   * @param {params: SearchParams}
   */
  const fetchListData = useCallback(
    async (params: GetSettlementMemberSettlementPagePayableSettlementRequest) => {
      const searchParams = {
        ...searchData,
        ...params,
      }
      const postData = {
        ...searchParams,
        status: searchParams.status || '0',
        orderType: searchParams.orderType || '0',
      }

      const { data } = await getSettlementMemberSettlementPagePayableSettlement(postData)
      return data
    },
    [searchData],
  )

  /**
   * 手动结算
   */
  const fetchManualSettlement = useCallback(async (id: number) => {
    const { code, data } = await postSettlementJobMemberManualSettlement({ id })
    if (code === 1000) {
      handleClose('manualSettlement')
      formActions.submit()
    }
  }, [])

  useEffect(() => {
    if (itemInfo !== null && modals['manualSettlement']) {
      fetchManualSettlement(itemInfo.id)
      return
    }
    if (itemInfo !== null && modals['viewPay']) {
      fetchVouchers(itemInfo.id)
    }
  }, [itemInfo, modals])

  const fetchVouchers = useCallback(async (id: number) => {
    const { code, data } = await getSettlementMemberSettlementGetPayablePayProve({ id: id.toString() })
    if (code === 1000) {
      setFiles(data)
    }
  }, [])

  /**
   * 上传凭证
   * @param params
   */
  const handleUploadVoucher = async (params: { fileList: { name: string; proveUrl: string }[] }) => {
    setUploadSubmitLoading(true)
    const { data, code } = await postSettlementMemberSettlementPay({
      id: itemInfo?.id!,
      proveList: params.fileList,
    })
    setUploadSubmitLoading(false)
    if (code === 1000) {
      // handlePayModalClose();
      handleClose('uploadPayVoucher')
      formActions.submit()
    }
  }

  const generateQrCode = async (codeUrl: string) => {
    try {
      const data = await QRCode.toDataURL(codeUrl)
      setQrcodeUrl(data)
    } catch (error) {
      message.error(error)
    }
  }

  /** 通联支付，短信验证码支付， 这里是后台随机生成的结算单 */
  const handleCompleteSmsCode = async (codeString: string) => {
    const {
      code,
      data,
      message: msg,
    } = await postPayEAccountAllInPayConfirmPay(
      {
        // tradeCode: `${itemInfo.settlementNo}-${randomCode}`,
        tradeCode: randomCode,
        verificationCode: codeString,
      },
      { ctlType: 'none' },
    )
    if (code !== 1000) {
      message.error(msg)
      return
    }
    handleClose('smsCodeModal')
    setTimeout(() => {
      formActions.submit()
    }, 1500)
  }

  /** 通联支付, 付款  */
  const handleUniversalPay = async (params: { payChannel: number }) => {
    console.log('modals', modals)
    // 如果是网银支付
    if (modals.unionPay) {
      handleClose('universalPay')
      formActions.submit()
      return
    }
    const channel = params.payChannel
    try {
      setUniversalPayLoading(true)

      const {
        data,
        code,
        message: msg,
      } = await postSettlementMemberSettlementCommunicationPay(
        {
          id: itemInfo.id,
          payChannelType: params.payChannel,
        },
        { ctlType: 'none' },
      )
      if (code !== 1000) {
        message.error(msg)
        return
      }

      setCurrentUniversalPay(channel as UniversalPay)
      if ([UNIVERSAL_PAY_WECHAT, UNIVERSAL_PAY_ALIPAY].includes(channel)) {
        message.loading({
          title: '正在生成支付二维码',
        })
        await generateQrCode(data)
        handleClose('universalPay')
        handleOpen('qrcodeModal')
        return
      }
      // 快捷支付 或者 余额支付
      if (channel === UNIVERSAL_PAY_QUICK || channel === UNIVERSAL_PAY_BALANCE) {
        // TODO 加一个随机数
        const res = await getSettlementMemberSettlementGetCommunicationPayTradeNo({
          id: itemInfo.id.toString(),
        })
        if (res.code !== 1000) {
          message.error(intl.formatMessage({ id: `${res.code}` }))
          return
        }
        setRandomCode(res.data)
        handleClose('universalPay')
        handleOpen('smsCodeModal')
        return
      }

      if (channel === UNIVERSAL_PAY_UNION) {
        handleOpen('unionPay')
        window.open(data)
      }
    } finally {
      setUniversalPayLoading(false)
    }
  }

  /** 轮询接口 */
  useEffect(() => {
    if (modals.qrcodeModal) {
      cycleStart(getSettlementMemberSettlementCommunicationPayResult, { settlementNo: itemInfo.settlementNo })
    }
  }, [modals])

  useEffect(() => {
    if (result && result.code === 1000 && result.data) {
      message.success('支付成功')
      handleClose('qrcodeModal')
      cycleCancel()
      formActions.submit()
    }
  }, [result])

  /**
   * 搜索
   */
  const handleSearch = (values: SearchParams) => {
    const format = 'YYYY-MM-DD'
    const { payStartTime, payEndTime, prePayStartTime, prePayEndTime, ...rest } = values
    const startTime = values.startTime?.format(format)
    const endTime = values.endTime ? values.endTime.endOf('day').format('YYYY-MM-DD HH:mm:ss') : ''
    const withPayStartTime = payStartTime
      ? { payStartTime: payStartTime.unix() + '000', payEndTime: payEndTime.unix() + '999' }
      : {}
    const withPrePayEndTime = prePayStartTime
      ? { prePayStartTime: prePayStartTime.unix() + '000', prePayEndTime: prePayEndTime.unix() + '999' }
      : {}
    ref.current.reload({ ...rest, startTime, endTime, ...withPayStartTime, ...withPrePayEndTime })
  }

  const handleIhadPay = () => {
    handleClose('qrcodeModal')
    formActions.submit()
  }

  /* 批量付款 */
  const handlePayment = () => {
    const { selectedRowKeys = [], selectRow = [], setSelectedRowKeys, setSelectRow } = selectRowFns
    const flag = selectRow.every((item) => item.status == 2 && item.payWay == 1)
    if (!flag) {
      message.warning(intl.formatMessage({ id: 'balance.batch.payment.limit' }))
      return
    }
    Modal.confirm({
      title: intl.formatMessage({ id: 'balance.confirm.tips' }),
      icon: <ExclamationCircleOutlined />,
      content: intl.formatMessage({ id: 'balance.batch.payment.confirm.content' }),
      okText: intl.formatMessage({ id: 'balance.confirm.ok' }),
      cancelText: intl.formatMessage({ id: 'balance.confirm.cancel' }),
      onOk() {
        postSettlementMemberSettlementBatchPay({ ids: selectedRowKeys }).then((res) => {
          if (res.code === 1000) {
            ref.current.reloadCurrent()
            setSelectedRowKeys([])
            setSelectRow([])
          }
        })
      },
      onCancel() {},
    })
  }

  /* 导出 */
  const handleExport = () => {
    const { selectedRowKeys = [], selectRow = [], setSelectedRowKeys, setSelectRow } = selectRowFns
    if (selectedRowKeys.length > 5000) {
      message.warning(intl.formatMessage({ id: 'balance.export.quantity.limit' }))
      return
    }
    const orderType = selectRow[0].orderType
    const flag = selectRow.some((item) => item.orderType !== orderType)
    if (flag) {
      message.warning(intl.formatMessage({ id: 'balance.export.orderType.limit' }))
      return
    }
    postSettlementMemberSettlementBuyerPayableSettlementExport(
      { ids: selectedRowKeys },
      { responseType: 'blob', getResponse: true },
    ).then((res: any) => {
      const { response } = res
      if (response.status == 200) {
        const suffixName = response.headers.get('content-disposition').split('.')[1]
        const fileName = `${moment().format('YYYYMMDD')}账单.${suffixName}`
        downFileByBuffer(response.data, fileName)
        ref.current.reloadCurrent()
        setSelectedRowKeys([])
        setSelectRow([])
      }
    })
  }

  const controllerBtns = (
    <Row>
      <Col span={6}>
        <Space direction="horizontal" size={16}>
          <AuthButton type="custom" code="payment">
            <Button disabled={!selectRow.selectedRowKeys.length} onClick={handlePayment}>
              {intl.formatMessage({ id: 'balance.batch.payment.btn' })}
            </Button>
          </AuthButton>
          <AuthButton type="custom" code="export">
            <Button disabled={!selectRow.selectedRowKeys.length} onClick={handleExport}>
              {intl.formatMessage({ id: 'balance.batch.export.btn' })}
            </Button>
          </AuthButton>
        </Space>
      </Col>
    </Row>
  )

  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          tableProps={{
            rowKey: 'id',
            scroll: {
              x: 1500,
            },
          }}
          rowSelection={selectRow}
          keepAlive={false}
          columns={columns}
          currentRef={ref}
          fetchTableData={(params: any) => fetchListData(params)}
          controlRender={
            <NiceForm
              actions={formActions}
              components={{ RangePicker, controllerBtns: () => controllerBtns }}
              expressionScope={{}}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'settlementName', FORM_FILTER_PATH)
                useAsyncSelect('status', fetchOptions(getSettlementCommonGetSettlementStatus))
                // 单据类型
                useAsyncSelect('orderType', fetchOptions(getSettlementCommonGetSettlementOrderType))
                // 导出
                useAsyncSelect('exportFlag', fetchOptions(getSettlementCommonGetExportFlag))
              }}
              schema={schema}
              onSubmit={handleSearch}
              {...formatInitialValue}
              onReset={() => {
                clear()
              }}
            />
          }
        />
      </Card>
      <UploadVoucherModal
        visible={modals.uploadPayVoucher}
        // id={balanceInfo?.id}
        roleId={itemInfo?.roleId}
        settlementId={itemInfo?.memberId}
        handleUpload={handleUploadVoucher}
        onCancel={() => handleClose('uploadPayVoucher')}
        confirmLoading={uploadSubmitLoading}
      />
      <Modal
        width={548}
        title={intl.formatMessage({ id: 'balance.accountsPayable.settlementList.modal.title' })}
        onCancel={() => handleClose('viewPay')}
        visible={modals['viewPay']}
        footer={null}
      >
        {/* <WrapVoucher  id={props.id} type={props.type} /> */}
        <Voucher files={files} />
      </Modal>
      <OtherPayModal
        visible={modals.universalPay}
        balanceInfo={universalPayInfo}
        onClose={() => handleClose('universalPay')}
        onConfirm={handleUniversalPay}
        confirmLoading={universalPayLoading}
      />
      <ViewUniversalPay
        visible={modals['viewUniversalPay']}
        balanceInfo={universalPayInfo1}
        onClose={() => handleClose('viewUniversalPay')}
        onOk={() => handleClose('viewUniversalPay')}
      />
      <QrcodeModal
        visible={modals.qrcodeModal}
        mode={currentUniversalPay === UNIVERSAL_PAY_WECHAT ? 'wechat' : 'alipay'}
        onOk={handleIhadPay}
        // mode={'wechat'}
        qrcode={qrcodeUrl}
        onClose={() => handleClose('qrcodeModal')}
      />
      <GetCodeModal
        visible={modals.smsCodeModal}
        onOk={handleCompleteSmsCode}
        tradeCode={randomCode}
        onClose={() => handleClose('smsCodeModal')}
        // randomCode={randomCode}
      />
    </PageHeaderWrapper>
  )
}

export default SettlementList
