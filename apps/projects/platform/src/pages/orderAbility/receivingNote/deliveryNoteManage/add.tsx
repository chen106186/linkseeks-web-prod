import AnchorPage, { AnchorsItem } from '@/components/AnchorPage'
import { BaseInfo } from '@/components/BaseInfo'
import { useContext, useEffect, useRef, useState, useCallback } from 'react'
import {
  BillsInfo,
  DeliveryInfo,
  LogisticsInfo,
  AutoEnter,
  Harvest,
  HarvestMaterial,
  ReceiptAddLabel,
  NoteLabel,
  DeliveryTimeLabel,
  ConsigneeTimeLabel,
  LogisticsCompanyLabel,
  LogisticsCarNoLabel,
  LogisticsNoLabel,
  DeliveryAbstractLabel,
  BuyerLabel,
  DeliveryDateLabel,
  DeliveryNameLabel,
  DeliveryPhoneLabel,
  ReceivingAddress,
  DeliveryTypeLabel,
  DeliveryNoLabel,
  ExternalRoamRecord,
  DeliverySlefAddrLabel,
  DeliveryDate,
  DeliveryTime,
  ShippingInfo,
  ReceiptAbstractLabel,
  SupplyMembersLabel,
  ReceivingTime,
  ConsigneeLabel,
  ConsigneePhoneLabel,
  HarvestGood,
  DeliveryGood,
} from '../../constants'
import { Button, Form, Input, message, Radio, Table } from 'antd'
import { FormItem, required } from '@/components/FormItem'
import {
  DeliveryNoticeTableColumn,
  DeliveryNoticeTableColumnSRM,
  ExternalRoamRecordTableColumn,
} from '../../constants/page-table-column'
import { HarvestMaterialContextProvider, HarvestMaterialInput } from '../../assets/context'
import {
  DeliveryNoteB2bUploadService,
  ReceiveOrderCreate,
  ReceivingNoteAddService,
} from '../../assets/handles/HandleFormSubmit'
import NoteFactoryService from '../../assets/handles/DeliveryNoteService'
import { RoleSelect } from '@/components/RoleSelect'
import { AddressDrawer, FormatValue, ReceiverAddress, ShipperAddress } from '@/components/AddressDrawer'
import {
  getLogisticsSelectListReceiverAddress,
  getLogisticsSelectListShipperAddress,
  postLogisticsReceiverAddressAdd,
  postLogisticsReceiverAddressUpdate,
  postLogisticsShipperAddressAdd,
  postLogisticsShipperAddressUpdate,
} from '@apps/apis'
import { DatePickerSelect } from '@/components/DatePickerSelect'
import LogisticsCompanyMerchantsSelect from '@/components/LogisticsCompanySelect/LogisticsCompanyMerchantsSelect'
import { DeliveryNumColumn, OrderNumColumn } from '../../constants/table-column'
import { useLocation } from '@linkseeks/router-core'
import usePrompt from '@/hooks/usePrompt'
import { validatorByteObject } from '@/utils/regExp'
import LogisticsInfoBox from '../../components/LogisticsInfo'
import OrderWarehousingTable from '../../components/orderWarehousingTable'
import { getOrderDeliveryOrderDetailProductPage } from '@apps/apis'
import { getProductWarehouseRuleConfigGetWarehouseAutoEnter } from '@apps/apis'

import { Modal } from 'antd'
import { UPLOAD_TYPE } from '@/constants'
import { authService } from '@apps/services'
import ModalForm from '@/components/ModalForm'
import { history } from '@linkseeks/router-manager'
import { getIntl } from '@linkseeks/i18n'
import { createFormActions } from '@apps/formily'
import { usePageStatus } from '@/hooks/usePageStatus'

const intl = getIntl()
const receiveActions = createFormActions()
const { useForm } = Form
const noteService = NoteFactoryService.getInstance('receive')

const ContentBox = BaseInfo

function DeliveryNoteAddForm() {
  const [tableDataSource, setTableDataSource] = useState<any>([])
  const { id } = usePageStatus()

  const [form] = useForm()
  const service = new ReceiveOrderCreate(form)
  const [idType, setidType] = useState(0)
  service.setTableData(tableDataSource)
  const { handleLeave } = usePrompt()
  const [info, setInfo] = useState<any>()
  const [errorMsg, setErrorMsg] = useState('')
  const [showComponents, setShowComponents] = useState<boolean>(false)

  const [anchors, setAnchors] = useState<AnchorsItem[]>(() => {
    return [BillsInfo, Harvest, DeliveryInfo, LogisticsInfo]
  })
  /*弹窗上传附件*/
  const receiveRef = useRef<any>({})
  const [loading, setLoading] = useState<boolean>(false)
  const { accessToken } = authService.getAuth() || {}
  const [newDeliveryNoticeTableColumn, setNewDeliveryNoticeTableColumn] = useState(DeliveryNoticeTableColumn)
  const [newDeliveryNoticeTableColumnSRM, setDeliveryNoticeTableColumnSRM] = useState(DeliveryNoticeTableColumnSRM)
  const b2bDeliveryNoticeTableColumn = [
    {
      title: '送货数量',
      dataIndex: 'deliveryCount',
      key: 'deliveryCount',
    },
    {
      title: '收货数量',
      dataIndex: 'deliveryCount',
      key: 'deliveryCount',
    },
  ]
  const getDeliveryNoticeTableColumnSRM = () => {
    const newSRMColum = newDeliveryNoticeTableColumnSRM.filter((item) => item.key !== 'receiveCount')
    const deliveryCount = {
      title: '收货数量',
      dataIndex: 'deliveryCount',
      key: 'deliveryCount',
    }
    setDeliveryNoticeTableColumnSRM([...newSRMColum, deliveryCount])
  }
  useEffect(() => {
    service.getDetailById(id).then((info) => {
      const target = noteService.formatField(info)

      ;(target.member = {
        buyerMemberId: info?.buyerMemberId,
        buyerMemberName: info?.buyerMemberName,
        buyerRoleId: info?.buyerRoleId,
        roleType: 2,
        name: info?.vendorMemberName,
      }),
        form.setFieldsValue({
          deliveryOrderId: id,
          ...target,
        })
      setInfo({
        ...info,
        deliveryVO: noteService.formatAddress(target.deliveryVO),
      })
      console.log('info', info)
      setidType(info?.type)

      let _anchors = [...anchors]

      getOrderDeliveryOrderDetailProductPage({
        id,
        current: '1',
        pageSize: '10',
      })
        .then((res) => res.data)
        .then((res) => {
          getProductWarehouseRuleConfigGetWarehouseAutoEnter().then((autoRes) => {
            if (autoRes.code === 1000) {
              setShowComponents(autoRes.data?.isCreate ?? false)
              setTableDataSource(res.data)
              if (autoRes.data?.isCreate) {
                _anchors.push(AutoEnter)
              }
              setAnchors([
                ..._anchors,
                {
                  ...HarvestMaterial,
                  name: `${info?.type == 1 ? HarvestGood.name : HarvestMaterial.name}(${res.data.length})`,
                },
              ])
            }
          })
        })
    })
    getDeliveryNoticeTableColumnSRM()
    setNewDeliveryNoticeTableColumn([...newDeliveryNoticeTableColumn, ...b2bDeliveryNoticeTableColumn])
  }, [])

  /*增加弹窗再次确认提交*/
  function handleSubmit() {
    console.log(receiveRef)
    Modal.confirm({
      title: '提示',
      content: '确认收货单资料填写是否正确，提交后不能再撤回!',
      onOk: () => {
        receiveRef.current.setVisible(true)
      },
    })
  }
  function RenaderDeliveryType({ value }: { value?: any }) {
    return <>{value === 2 ? '自提' : '物流'}</>
  }

  // 提交凭证
  function handleSubmitVoucher() {
    const url = receiveActions.getFieldValue('receiveBill') ? receiveActions.getFieldValue('receiveBill')[0].data : ''
    if (url) {
      form.setFieldsValue({ url: receiveActions.getFieldValue('receiveBill')[0].data })
    }
    service
      .submit()
      .then((res) => {
        if (res.code == 1000) {
          handleLeave(false)
          receiveRef.current.setVisible(false)
          setTimeout(() => {
            history.back(-1)
          }, 1000)
        }
      })
      .catch((err) => {
        try {
          setErrorMsg(err.errorFields[0].errors[0])
        } catch (e) {}
      })
      .finally(() => {})
  }
  return (
    <AnchorPage
      title={ReceiptAddLabel}
      anchors={anchors}
      extra={
        <Button onClick={() => handleSubmit()} type="primary">
          提交
        </Button>
      }
    >
      <Form form={form} onValuesChange={() => handleLeave()}>
        <FormItem hidden name="deliveryOrderId">
          <Input />
        </FormItem>

        <ContentBox title={BillsInfo.name} id={BillsInfo.key}>
          <FormItem rules={[required()]} label={ReceiptAbstractLabel} name="digest">
            <Input />
          </FormItem>

          <FormItem rules={[required()]} label={SupplyMembersLabel} name="member">
            <RoleSelect
              disabled={true}
              formatFeils={(e) => {
                return {
                  buyerMemberId: e.memberId,
                  buyerRoleId: e.roleId,
                  roleType: 2,
                  name: e.name,
                }
              }}
            />
          </FormItem>

          <FormItem label={NoteLabel} name="remark" rules={[validatorByteObject(100)]}>
            <Input placeholder="最长100字符，50个汉字" maxLength={100} />
          </FormItem>
          <FormItem label={NoteLabel} name="url" hidden>
            <Input />
          </FormItem>
        </ContentBox>

        <ContentBox title={Harvest.name} id={Harvest.key}>
          <div>
            <FormItem rules={[required(`请输入${ReceivingTime}`)]} label={ReceivingTime} name="receiveTime">
              <DatePickerSelect errorMsg={errorMsg} className="w-full" />
            </FormItem>

            <FormItem label={ConsigneeLabel} name="executorVO.consignee">
              <Input placeholder={`请输入${ConsigneeLabel}`} />
            </FormItem>

            <FormItem label={ConsigneePhoneLabel} name="executorVO.phone">
              <Input type="tel" placeholder={`请输入${ConsigneePhoneLabel}`} />
            </FormItem>
          </div>

          <div>
            <FormItem label={ReceivingAddress} name="receiveVO">
              <ReceiverAddress hiddenBtn={true} disabled={true} />
            </FormItem>
          </div>
        </ContentBox>

        <ContentBox title={DeliveryInfo.name} id={DeliveryInfo.key}>
          <div>
            <FormItem label={DeliveryNoLabel}>{info?.deliveryNo}</FormItem>

            <FormItem label={ConsigneeTimeLabel}>{info?.sendTime}</FormItem>
          </div>

          <div>
            <FormItem label={DeliverySlefAddrLabel}>
              {info?.deliverVO?.provinceName ?? ''}
              {info?.deliverVO?.cityName ?? ''}
              {info?.deliverVO?.districtName ?? ''}
              {info?.deliverVO?.streetName ?? ''}
              {info?.deliverVO?.address ?? ''}
            </FormItem>
          </div>
        </ContentBox>

        <ContentBox title={LogisticsInfo.name} id={LogisticsInfo.key}>
          <LogisticsInfoBox info={info} />
        </ContentBox>

        {showComponents && (
          <ContentBox title={AutoEnter.name} id={AutoEnter.key} cols={1}>
            <FormItem hidden name="warehousingOrderProductDetailVOS" />
            <OrderWarehousingTable tableDatas={tableDataSource} type={info?.type} form={form} />
          </ContentBox>
        )}

        <ContentBox
          title={info?.type == 1 ? DeliveryGood.name : HarvestMaterial.name}
          id={info?.type == 1 ? DeliveryGood.key : HarvestMaterial.key}
          cols={1}
        >
          <HarvestMaterialContextProvider
            value={{
              dataSource: tableDataSource,
            }}
          >
            <Table
              rowKey="id"
              columns={[...(idType == 1 ? newDeliveryNoticeTableColumn : newDeliveryNoticeTableColumnSRM)]}
              dataSource={tableDataSource}
            />
          </HarvestMaterialContextProvider>
        </ContentBox>
      </Form>
      <ModalForm
        modalTitle={intl.formatMessage({ id: 'transaction_components.querenshouhuo' })}
        currentRef={receiveRef}
        confirm={handleSubmitVoucher}
        cancel={() => receiveRef.current.setVisible(false)}
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
                receiveBill: {
                  title: intl.formatMessage({ id: 'transaction_components.shouhuohuidan' }),
                  'x-component': 'Upload',
                  'x-component-props': {
                    listType: 'text',
                    maxCount: 1,
                    action: '/api/support/file/upload',
                    data: { fileType: UPLOAD_TYPE },
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
      />
    </AnchorPage>
  )
}

export default DeliveryNoteAddForm
