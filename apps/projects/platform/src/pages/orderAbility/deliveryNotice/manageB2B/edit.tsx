/**
 * 订单能力 - 送货单 - 送货单管理详情SRM
 * @author: Gavin
 * @description: 与B2B内容大致相同，文件分开方便后续对接以及日后变动修改二开
 */
import AnchorPage, { AnchorsItem } from '@/components/AnchorPage'
import React, { useCallback, useEffect, useState, useContext } from 'react'
import {
  BillsInfo,
  BuyerLabel,
  ConsigneeTimeLabel,
  DeliveryAbstractLabel,
  DeliveryDate,
  DeliveryDateLabel,
  DeliveryGood,
  DeliveryInfo,
  DeliveryNameLabel,
  DeliveryPhoneLabel,
  DeliverySlefAddrLabel,
  DeliveryTimeLabel,
  DeliveryTypeLabel,
  Distribution,
  ExternalRoamRecord,
  LogisticsCarNoLabel,
  LogisticsCompanyLabel,
  LogisticsInfo,
  LogisticsNoLabel,
  NoteLabel,
  ReceivingAddress,
} from '../../constants'
import { BaseInfo as ContentBox } from '@/components/BaseInfo'
import { Input, Table, Row, Col, Select, Radio, Form, Button, Modal } from 'antd'
import { DeliveryNoticeTableColumn, ExternalRoamRecordTableColumn } from '../../constants/page-table-column'
import { FormItem, required } from '@/components/FormItem'
import { DatePickerSelect } from '@/components/DatePickerSelect'
import { AddressDrawer, ReceiverAddress, ShipperAddress } from '@/components/AddressDrawer'
import {
  getLogisticsSelectListReceiverAddress,
  getLogisticsSelectListShipperAddress,
  postLogisticsReceiverAddressAdd,
  postLogisticsReceiverAddressUpdate,
  postLogisticsShipperAddressAdd,
  postLogisticsShipperAddressUpdate,
} from '@apps/apis'
import { DeliveryNoteB2bUploadService } from '../../assets/handles/HandleFormSubmit'
import { RoleSelect } from '@/components/RoleSelect'
import LogisticsCompanyMerchantsSelect from '@/components/LogisticsCompanySelect/LogisticsCompanyMerchantsSelect'
import { useLocation } from '@linkseeks/router-core'
import { DeliveryNumColumn } from '../../constants/table-column'
import { addrFormatValue } from '../../assets/format/addrValue'
import { PATTERN_MAPS } from '@/constants/regExp'
import usePrompt from '@/hooks/usePrompt'
import useLogistics from '../../assets/hooks/useLogistics'
import usePageTitle from '../../assets/hooks/usePageTitle'

const ContentBoxItem = ContentBox.BaseInfoItem

const DeliveryNoticeManageSRMEdit: React.FC = () => {
  const [tableDataSource, setTableDataSource] = useState<any>([])
  const { handleLeave } = usePrompt()
  const location: any = useLocation()
  const { id } = location.query

  const [form] = Form.useForm()

  const service = new DeliveryNoteB2bUploadService(form)

  const { handleLogisticsShow, isSince } = useLogistics()

  const { title, setDeliveryTitle } = usePageTitle()

  const [anchors, setAnchors] = useState<AnchorsItem[]>([BillsInfo, Distribution, DeliveryInfo, LogisticsInfo])

  useEffect(() => {
    form.setFieldsValue({ sourceType: 0, id: id })
    service.getDetailById(id).then((res) => {
      form.setFieldsValue(res)
      setDeliveryTitle(res)
    })

    service.getOrderDeliveryOrderDetailProductPage({ id }).then((res) => {
      setTableDataSource(res?.data)
      setAnchors([
        ...anchors,
        {
          ...DeliveryGood,
          name: `${DeliveryGood.name}(${res?.data?.length})`,
        },
      ])
    })
  }, [id])

  const handleSubmit = useCallback(() => {
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
  }, [form, tableDataSource])

  return (
    <AnchorPage
      title={title}
      anchors={anchors}
      extra={
        <Button.Group>
          <Button onClick={handleSubmit} type="primary">
            提交
          </Button>
        </Button.Group>
      }
    >
      <Form form={form} onValuesChange={() => handleLeave()}>
        <FormItem hidden name="sourceType">
          <Input type="hidden" />
        </FormItem>

        <FormItem hidden name="id">
          <Input type="hidden" />
        </FormItem>

        <ContentBox title={BillsInfo.name} id={BillsInfo.key}>
          <FormItem rules={[required()]} label={DeliveryAbstractLabel} name="digest">
            <Input placeholder="最长100字符,50个汉字" />
          </FormItem>

          <FormItem label={NoteLabel} name="remark">
            <Input />
          </FormItem>

          <FormItem rules={[required()]} label={BuyerLabel} name="member">
            <RoleSelect
              disabled={true}
              formatFeils={(e) => {
                return {
                  buyerMemberId: e.id,
                  buyerRoleId: e.roleId,
                  roleType: 2,
                  name: e.name,
                }
              }}
            />
          </FormItem>
        </ContentBox>

        <ContentBox title={Distribution.name} id={Distribution.key}>
          <FormItem rules={[required()]} label={DeliveryDate} name="deliveryTime">
            <DatePickerSelect disabled={true} className="w-full" />
          </FormItem>

          <FormItem label={DeliveryNameLabel} name="executorVO.consignee">
            <Input />
          </FormItem>

          <FormItem rules={[required()]} label={DeliveryTimeLabel} name="deliveryRangeTime">
            <DatePickerSelect.RangePicker disabled={true} className="w-full" picker="time" />
          </FormItem>

          <FormItem
            rules={[{ pattern: PATTERN_MAPS.phone, message: '手机号是否正确' }]}
            label={DeliveryPhoneLabel}
            name="executorVO.phone"
          >
            <Input type="tel" />
          </FormItem>
        </ContentBox>

        <ContentBox title={DeliveryInfo.name} id={DeliveryInfo.key}>
          <FormItem rules={[required()]} label={ConsigneeTimeLabel} name="sendTime">
            <DatePickerSelect className="w-full" />
          </FormItem>

          <FormItem label={ReceivingAddress} name="receiveVO">
            <ReceiverAddress disabled={true} />
          </FormItem>

          <FormItem rules={[required()]} label={DeliverySlefAddrLabel} name="deliveryVO">
            <ShipperAddress showDefault={true} />
          </FormItem>
        </ContentBox>

        <ContentBox title={LogisticsInfo.name} id={LogisticsInfo.key}>
          <FormItem rules={[required()]} label={DeliveryTypeLabel} name="deliveryType">
            <Radio.Group
              onChange={(e) => {
                form.setFieldsValue({ deliveryType: e.target?.value })
                handleLogisticsShow(e.target.value)
              }}
            >
              <Radio value={0}>物流</Radio>
              <Radio value={1}>自提</Radio>
              {/* <Radio.Button value={3}>无效配送</Radio.Button> */}
            </Radio.Group>
          </FormItem>

          <FormItem hidden={isSince} label={LogisticsCarNoLabel} name="executorVO.carNumbers">
            <Input />
          </FormItem>
          <FormItem hidden={isSince} label={LogisticsCompanyLabel} name="logisticsCompanyInt">
            <LogisticsCompanyMerchantsSelect />
          </FormItem>
          <FormItem hidden={isSince} label={LogisticsNoLabel} name="logisticsNo">
            <Input maxLength={20} />
          </FormItem>
        </ContentBox>

        <ContentBox title={DeliveryGood.name} id={DeliveryGood.key} cols={1}>
          <Table
            rowKey={(row) => row.orderNo}
            columns={[
              ...DeliveryNoticeTableColumn,
              {
                ...DeliveryNumColumn,
                dataIndex: 'deliveryCount',
                render: (t, rcode, index) => {
                  return t
                },
              },
            ]}
            dataSource={tableDataSource}
          />
        </ContentBox>
      </Form>
    </AnchorPage>
  )
}

export default DeliveryNoticeManageSRMEdit
