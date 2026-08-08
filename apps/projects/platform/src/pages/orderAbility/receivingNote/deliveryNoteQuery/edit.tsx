import AnchorPage, { AnchorsItem } from '@/components/AnchorPage'
import { BaseInfo } from '@/components/BaseInfo'
import { useContext, useEffect, useState } from 'react'
import {
  BillsInfo,
  DeliveryInfo,
  LogisticsInfo,
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
} from '../../constants'
import { Button, Form, Input, Radio, Table } from 'antd'
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
  ReceiveOrderUpdate,
  ReceivingNoteAddService,
} from '../../assets/handles/HandleFormSubmit'
import NoteFactoryService from '../../assets/handles/DeliveryNoteService'
import { RoleSelect } from '@/components/RoleSelect'
import { AddressDrawer, ReceiverAddress, ShipperAddress } from '@/components/AddressDrawer'
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
import { useQuery } from '@linkseeks/router-core'
import ReceiveNoteFacotry from '../../assets/handles/ReceiveNotePage'
import usePrompt from '@/hooks/usePrompt'
import usePageTitle from '../../assets/hooks/usePageTitle'

const { useForm } = Form
const noteService = ReceiveNoteFacotry.getInstance('Manage')

const ContentBox = BaseInfo

function DeliveryNoteAddForm() {
  const [tableDataSource, setTableDataSource] = useState<any>([])

  const { id } = useQuery()
  const [form] = useForm()
  const service = new ReceiveOrderUpdate(form)
  const [type, setType] = useState(0)

  service.setTableData(tableDataSource)

  const { handleLeave } = usePrompt()
  const { title, setDeliveryTitle } = usePageTitle()

  const [anchors, setAnchors] = useState<AnchorsItem[]>(() => {
    return [BillsInfo, Harvest, DeliveryInfo, LogisticsInfo, HarvestMaterial]
  })

  useEffect(() => {
    service.getDetailById(id).then((res) => {
      form.setFieldsValue({
        deliveryOrderId: id,
        deliveryType: 1,
        ...res,
      })
      setType(res?.type)
      setDeliveryTitle(res)
    })

    service.getOrderDeliveryOrderDetailProductPage(id).then((res) => {
      setTableDataSource(res.data)
    })
  }, [])

  function handleSubmit() {
    service.submit().then((res) => {
      console.log(res)
    })
  }

  function RenaderDeliveryType({ value }: { value?: any }) {
    return <>{value === 0 ? '自提' : '物流'}</>
  }

  return (
    <AnchorPage
      title={title}
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
          <FormItem rules={[required()]} label={DeliveryAbstractLabel} name="digest">
            <Input />
          </FormItem>

          <FormItem rules={[required()]} label={BuyerLabel} name="member">
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

          <FormItem label={NoteLabel} name="remark">
            <Input />
          </FormItem>
        </ContentBox>

        <ContentBox title={Harvest.name} id={Harvest.key}>
          <FormItem rules={[required()]} label={ConsigneeTimeLabel} name="sendTime">
            <DatePickerSelect className="w-full" />
          </FormItem>

          <FormItem rules={[required()]} label={ReceivingAddress} name="receiveVO">
            <ReceiverAddress />
          </FormItem>

          <FormItem rules={[required()]} label={DeliveryPhoneLabel} name="receiverBO.phone">
            <Input />
          </FormItem>
        </ContentBox>

        <ContentBox title={DeliveryInfo.name} id={DeliveryInfo.key}>
          <FormItem rules={[required()]} label={DeliveryNoLabel} name="deliveryNo">
            <Input disabled={true} />
          </FormItem>

          <FormItem rules={[required()]} label={DeliveryDateLabel} name="deliveryTime">
            <DatePickerSelect disabled={true} className="w-full" />
          </FormItem>

          <FormItem rules={[required()]} label={DeliveryNameLabel} name="deliveryVO">
            <ShipperAddress disabled={true} />
          </FormItem>

          <FormItem rules={[required()]} label={DeliveryTimeLabel} name="deliveryRangeTime">
            <DatePickerSelect.RangePicker picker="time" disabled={true} className="w-full" />
          </FormItem>
        </ContentBox>

        <ContentBox title={LogisticsInfo.name} id={LogisticsInfo.key}>
          <FormItem rules={[required()]} label={DeliveryTypeLabel} name="deliveryType">
            <RenaderDeliveryType />
          </FormItem>

          <FormItem label={LogisticsCarNoLabel} name="executorVO.carNumbers">
            <Input disabled={true} />
          </FormItem>
          <FormItem label={LogisticsCompanyLabel} name="logisticsCompanyInt">
            <LogisticsCompanyMerchantsSelect disabled={true} />
          </FormItem>
          <FormItem
            label={LogisticsNoLabel}
            rules={[
              {
                max: 20,
              },
            ]}
            name="logisticsNo"
          >
            <Input maxLength={20} disabled={true} />
          </FormItem>
        </ContentBox>

        <ContentBox title={HarvestMaterial.name} id={HarvestMaterial.key} cols={1}>
          <HarvestMaterialContextProvider
            value={{
              dataSource: tableDataSource,
            }}
          >
            <Table
              rowKey={(row) => row.orderNo}
              columns={[
                ...(type == 1 ? DeliveryNoticeTableColumn : DeliveryNoticeTableColumnSRM),
                {
                  ...DeliveryNumColumn,
                  render: (t, rcode, index) => {
                    return (
                      <HarvestMaterialInput value={rcode[OrderNumColumn.key]} index={index} keyup="deliveryCount" />
                    )
                  },
                },
              ]}
              dataSource={tableDataSource}
            />
          </HarvestMaterialContextProvider>
        </ContentBox>
      </Form>
    </AnchorPage>
  )
}

export default DeliveryNoteAddForm
