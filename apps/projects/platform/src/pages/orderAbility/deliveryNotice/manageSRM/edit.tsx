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
  ConsigneeLabel,
  ConsigneePhoneLabel,
  ConsigneeTimeLabel,
  DeliveryAbstractLabel,
  DeliveryAddrLabel,
  DeliveryDate,
  DeliveryDateLabel,
  DeliveryGood,
  DeliveryInfo,
  DeliveryNameLabel,
  DeliveryNoLabel,
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
  Material,
  NoteLabel,
  OutStatusLabel,
  ReceivingAddress,
} from '../../constants'
import { BaseInfo as ContentBox } from '@/components/BaseInfo'
import { Input, Table, Row, Col, Select, Radio, Form, Button, message, Modal } from 'antd'
import {
  DeliveryNoticeTableColumn,
  DeliveryNoticeTableColumnSRM,
  ExternalRoamRecordTableColumn,
} from '../../constants/page-table-column'
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
import DeliveryGoodTableSelect from '../../components/DeliveryGoodTableSelect/DeliveryGoodTableSelect'
import { HarvestMaterialContextProvider, HarvestMaterialContext } from '../../assets/context'
import { HandelFormFieldsKeyValue } from '@/utils/form'
import { DeliveryNoteAddService, DeliveryNoteUploadService } from '../../assets/handles/HandleFormSubmit'
import { RoleSelect } from '@/components/RoleSelect'
import DeliveryNoticeOrderFactory from '../../assets/handles/DeliveryNoticeOrder'
import LogisticsCompanyMerchantsSelect from '@/components/LogisticsCompanySelect/LogisticsCompanyMerchantsSelect'
import { useLocation } from '@linkseeks/router-core'
import { DeliveryNumColumn } from '../../constants/table-column'
import { addrFormatValue } from '../../assets/format/addrValue'
import { PATTERN_MAPS } from '@/constants/regExp'
import usePrompt from '@/hooks/usePrompt'
import useLogistics from '../../assets/hooks/useLogistics'
import usePageTitle from '../../assets/hooks/usePageTitle'
import { validatorByteObject } from '@/utils/regExp'

const ContentBoxItem = ContentBox.BaseInfoItem

const DeliveryNoticeManageSRMEdit: React.FC = () => {
  const [tableDataSource, setTableDataSource] = useState<any>([])
  const [outerHistoryList, setOuterHistoryList] = useState<any>([])
  const location: any = useLocation()
  const { id } = location.query

  const { handleLeave } = usePrompt()
  const { handleLogisticsShow, isSince } = useLogistics()

  const [form] = Form.useForm()

  const service = new DeliveryNoteUploadService(form)

  const { title, setDeliveryTitle } = usePageTitle()

  const [anchors, setAnchors] = useState<AnchorsItem[]>([BillsInfo, Distribution, DeliveryInfo, LogisticsInfo])

  useEffect(() => {
    form.setFieldsValue({ sourceType: 0, id: id })
    service.getDetailById(id).then((res) => {
      form.setFieldsValue(res)
      setDeliveryTitle(res)
      setOuterHistoryList(res.outerHistoryList)
    })

    service.getOrderDeliveryOrderDetailProductPage({ id }).then((res) => {
      setTableDataSource(res.data)
      setAnchors([
        ...anchors,
        {
          ...Material,
          name: `${Material.name}(${res?.data?.length})`,
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
            <Input />
          </FormItem>

          <FormItem label={NoteLabel} name="remark">
            <Input.TextArea rows={1} placeholder="最长100字符，50个汉字" maxLength={100} />
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
            <ReceiverAddress />
          </FormItem>

          <FormItem rules={[required()]} label={DeliverySlefAddrLabel} name="deliveryVO">
            <ShipperAddress />
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
          <FormItem
            rules={
              isSince ? [validatorByteObject(20)] : [validatorByteObject(20), required(`请输入${LogisticsNoLabel}`)]
            }
            hidden={isSince}
            label={LogisticsNoLabel}
            name="logisticsNo"
          >
            <Input maxLength={20} />
          </FormItem>
        </ContentBox>

        <ContentBox title={DeliveryGood.name} id={DeliveryGood.key} cols={1}>
          <Table
            rowKey={(row) => row.orderNo}
            columns={[
              ...DeliveryNoticeTableColumnSRM,
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

      {/* <ContentBox title={ExternalRoamRecord.name} key={ExternalRoamRecord.key} cols={1}>
        <Table
          columns={ExternalRoamRecordTableColumn}
          rowKey="id"
          dataSource={outerHistoryList}
        />
      </ContentBox> */}
    </AnchorPage>
  )
}

export default DeliveryNoticeManageSRMEdit
