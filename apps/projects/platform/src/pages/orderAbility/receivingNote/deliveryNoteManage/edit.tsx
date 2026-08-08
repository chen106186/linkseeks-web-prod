import { PageHeaderWrapper } from '@apps/components'
import { BaseInfo } from '@/components/BaseInfo'
import { useEffect, useState } from 'react'
import {
  BillsInfo,
  DeliveryInfo,
  LogisticsInfo,
  Harvest,
  HarvestMaterial,
  NoteLabel,
  ConsigneeTimeLabel,
  LogisticsCompanyLabel,
  LogisticsCarNoLabel,
  LogisticsNoLabel,
  DeliveryAbstractLabel,
  BuyerLabel,
  ReceivingAddress,
  DeliveryTypeLabel,
  DeliveryNoLabel,
  DeliverySlefAddrLabel,
  ReceivingTime,
  ConsigneeLabel,
  ConsigneePhoneLabel,
  PlearInput,
  DeliveryGood,
  HarvestGood,
} from '../../constants'
import { Button, Form, Input, Modal, Table } from 'antd'
import { FormItem, required } from '@/components/FormItem'
import { DeliveryNoticeTableColumn, DeliveryNoticeTableColumnSRM } from '../../constants/page-table-column'
import { HarvestMaterialContextProvider } from '../../assets/context'
import { ReceiveOrderUpdate } from '../../assets/handles/HandleFormSubmit'
import NoteFactoryService from '../../assets/handles/DeliveryNoteService'
import { RoleSelect } from '@/components/RoleSelect'
import { ReceiverAddress, ShipperAddress } from '@/components/AddressDrawer'
import { DatePickerSelect } from '@/components/DatePickerSelect'
import LogisticsCompanyMerchantsSelect from '@/components/LogisticsCompanySelect/LogisticsCompanyMerchantsSelect'
import { DeliveryNumColumn } from '../../constants/table-column'
import { useLocation } from '@linkseeks/router-core'
import usePrompt from '@/hooks/usePrompt'
import usePageTitle from '../../assets/hooks/usePageTitle'
import useLogistics from '../../assets/hooks/useLogistics'
import { validatorByteObject } from '@/utils/regExp'
import { useAnchor } from '@/utils/hooks'

const { useForm } = Form
const noteService = NoteFactoryService.getInstance('receive')

const ContentBox = BaseInfo

function DeliveryNoteAddForm() {
  const [tableDataSource, setTableDataSource] = useState<any>([])
  const [, setOuterHistoryList] = useState([])
  const [type] = useState(0)
  const location = useLocation()
  const { id } = (location as any).query
  const [form] = useForm()
  const service = new ReceiveOrderUpdate(form)
  service.setTableData(tableDataSource)
  const { handleLeave } = usePrompt()
  const { title, setReceiveTitle } = usePageTitle()
  const { handleLogisticsShow, isSince } = useLogistics()
  const [info, setInfo] = useState<any>()

  const { anchors, update } = useAnchor([BillsInfo, Harvest, DeliveryInfo, LogisticsInfo])

  useEffect(() => {
    noteService.getDetailInfoById(id).then((res) => {
      handleLogisticsShow(res?.deliveryType)
      setInfo(res)
      console.log(service.formatField(res))

      setReceiveTitle(res)
      const target = {
        ...service.formatField(res),
        'executorVO.phone': res?.executorVO?.phone,
        'executorVO.consignee': res?.executorVO?.consignee,
        'executorVO.carNumbers': res?.executorVO?.carNumbers,
        'receiveVO.phone': res?.receiveVO?.phone,
        'receiveVO.consignee': res?.receiveVO?.consignee,
        logisticsCompanyInt: {
          label: res?.logisticsCompany,
          value: res?.logisticsCompanyId,
        },
      }
      form.setFieldsValue({
        id: id,
        ...target,
      })

      setOuterHistoryList(res?.outerHistoryList)

      service.getOrderDeliveryOrderDetailProductPage(id).then((prdouct) => {
        setTableDataSource(prdouct?.data)
        update([
          {
            ...HarvestMaterial,
            name: `${res?.type == 1 ? HarvestGood.name : HarvestMaterial.name}(${prdouct?.data?.length})`,
          },
        ])
      })
    })
  }, [])

  function handleSubmit() {
    console.log(tableDataSource)
    Modal.confirm({
      title: '提示',
      content: '确认送货单资料填写是否正确，提交后不能再撤回!',
      onOk: () => {
        service.setTableData(tableDataSource)
        service.submit().then((res) => {
          if (res.code === 1000) {
            handleLeave(false)
            setTimeout(() => {
              history.go(-1)
            }, 1000)
          }
        })
      },
    })
  }

  function RenaderDeliveryType({ value }: { value?: any }) {
    return <>{value === 2 ? '自提' : '物流'}</>
  }

  return (
    <PageHeaderWrapper
      title={title}
      items={anchors}
      extra={
        <Button onClick={() => handleSubmit()} type="primary">
          提交
        </Button>
      }
    >
      <Form form={form} onValuesChange={() => handleLeave()}>
        <FormItem hidden name="id">
          <Input />
        </FormItem>

        <ContentBox title={BillsInfo.name} id={BillsInfo.key}>
          <FormItem rules={[required()]} label={DeliveryNoLabel} name="deliveryNo">
            <Input disabled={true} placeholder={`${PlearInput}${DeliveryNoLabel}`} />
          </FormItem>

          <FormItem rules={[required()]} label={DeliveryAbstractLabel} name="digest">
            <Input disabled={true} placeholder={`${PlearInput}${DeliveryAbstractLabel}`} />
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
            <Input placeholder={`${PlearInput}${NoteLabel}`} />
          </FormItem>
        </ContentBox>

        <ContentBox title={Harvest.name} id={Harvest.key}>
          <FormItem rules={[required()]} label={ReceivingTime} name="receiveTime">
            <DatePickerSelect disabled={true} className="w-full" />
          </FormItem>

          <FormItem rules={[required()]} label={ReceivingAddress} name="receiveVO">
            <ReceiverAddress disabled={true} hiddenBtn />
          </FormItem>

          <FormItem
            rules={[
              {
                required: false,
                message: '',
              },
            ]}
            label={ConsigneeLabel}
            name="executorVO.consignee"
          >
            <Input placeholder={`${PlearInput}${ConsigneeLabel}`} />
          </FormItem>

          <FormItem
            rules={[
              {
                required: false,
                message: '',
              },
            ]}
            label={ConsigneePhoneLabel}
            name="executorVO.phone"
          >
            <Input placeholder={`${PlearInput}${ConsigneePhoneLabel}`} />
          </FormItem>
        </ContentBox>

        <ContentBox title={DeliveryInfo.name} id={DeliveryInfo.key}>
          <FormItem rules={[required()]} label={ConsigneeTimeLabel} name="sendTime">
            <DatePickerSelect disabled={true} className="w-full" />
          </FormItem>

          <FormItem rules={[required()]} label={DeliverySlefAddrLabel} name="deliveryVO">
            <ShipperAddress hiddenBtn={true} disabled={true} />
          </FormItem>
        </ContentBox>

        <ContentBox title={LogisticsInfo.name} id={LogisticsInfo.key}>
          <FormItem hidden={true} name="deliveryType">
            <Input hidden={true} />
          </FormItem>

          <FormItem label={DeliveryTypeLabel}>
            <RenaderDeliveryType value={info?.deliveryType} />
          </FormItem>

          <FormItem hidden={isSince} label={LogisticsCarNoLabel} name="executorVO.carNumbers">
            <Input disabled />
          </FormItem>
          <FormItem hidden={isSince} label={LogisticsCompanyLabel} name="logisticsCompanyInt">
            <LogisticsCompanyMerchantsSelect />
          </FormItem>
          <FormItem
            hidden={isSince}
            label={LogisticsNoLabel}
            rules={
              isSince ? [validatorByteObject(20)] : [validatorByteObject(20), required(`请输入${LogisticsNoLabel}`)]
            }
            name="logisticsNo"
          >
            <Input disabled maxLength={20} placeholder={`${PlearInput}${LogisticsNoLabel}`} />
          </FormItem>
        </ContentBox>

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
              rowKey={(row) => row.orderNo}
              columns={[
                ...(type == 1
                  ? DeliveryNoticeTableColumn
                  : DeliveryNoticeTableColumnSRM.filter((_item) => _item.key !== 'leftCount')),
                {
                  ...DeliveryNumColumn,
                  render: (t, rcode) => {
                    return <>{rcode.receiveCount}</>
                  },
                },
              ]}
              dataSource={tableDataSource}
            />
          </HarvestMaterialContextProvider>
        </ContentBox>

        {/* <ContentBox className='mt-15' title={ExternalRoamRecord.name} id={ExternalRoamRecord.key} cols={1}>
          <Table
            columns={[
              ...ExternalRoamRecordTableColumn,
            ]}
            rowKey="id"
            dataSource={outerHistoryList}
          />
        </ContentBox> */}
      </Form>
    </PageHeaderWrapper>
  )
}

export default DeliveryNoteAddForm
