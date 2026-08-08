/**
 * 订单能力 - 送货单 - 送货单管理详情SRM
 * @author: Gavin
 * @description: 与B2B内容大致相同，文件分开方便后续对接以及日后变动修改二开
 */
import AnchorPage, { AnchorsItem } from '@/components/AnchorPage'
import React, { useCallback, useEffect, useState, useContext } from 'react'
import {
  BaseInfo,
  BuyerLabel,
  ConsigneeTimeLabel,
  DeliveryAbstractLabel,
  DeliveryDate,
  DeliveryGood,
  DeliveryInfo,
  DeliveryNameLabel,
  DeliveryPanleNoLabel,
  DeliveryPhoneLabel,
  DeliverySlefAddrLabel,
  DeliveryTime,
  DeliveryTimeLabel,
  DeliveryTypeLabel,
  Distribution,
  LogisticsCarNoLabel,
  LogisticsCompanyLabel,
  LogisticsInfo,
  LogisticsNoLabel,
  Material,
  NoteLabel,
  ReceivingAddress as ReceivingAddressLabel,
} from '../../constants'
import { BaseInfo as ContentBox } from '@/components/BaseInfo'
import { Input, Table, Radio, Form, Button, Modal } from 'antd'
import { DeliveryNoticeTableColumn, DeliveryNoticeTableColumnSRM } from '../../constants/page-table-column'
import { FormItem, required } from '@/components/FormItem'
import { DatePickerSelect } from '@/components/DatePickerSelect'
import { AddressDrawer } from '@/components/AddressDrawer'
import {
  getLogisticsSelectListReceiverAddress,
  getLogisticsSelectListShipperAddress,
  postLogisticsReceiverAddressAdd,
  postLogisticsReceiverAddressUpdate,
  postLogisticsShipperAddressAdd,
  postLogisticsShipperAddressUpdate,
} from '@apps/apis'
import DeliveryGoodTableSelect from '../../components/DeliveryGoodTableSelect/DeliveryGoodTableSelect'
import { HarvestMaterialContextProvider, HarvestMaterialInput } from '../../assets/context'

import { RoleSelect } from '@/components/RoleSelect'
import LogisticsCompanyMerchantsSelect from '@/components/LogisticsCompanySelect/LogisticsCompanyMerchantsSelect'
import { DeliveryNumColumn, OrderNumColumn } from '../../constants/table-column'
import { DeliveryAddFactory } from '../../assets/factory/DeliveryAddFactory'
import { history } from '@linkseeks/router-manager'
import { useQuery } from '@linkseeks/router-core'
import { SourceTypeEnum } from '../../constants/SourceTypeEnum'

import { ShipperAddress, ReceiverAddress } from '@/components/AddressDrawer'
import { checkRegExp, validatorByteObject } from '@/utils/regExp'
import { PATTERN_MAPS } from '@/constants/regExp'
import usePrompt from '@/hooks/usePrompt'
import { useAnchor } from '@/utils/hooks'
import { RoleTypeEnum } from '../../constants/RoleTypeEnum'
import useLogistics from '../../assets/hooks/useLogistics'

const DeliveryNoticeManageSRMDetails: React.FC = () => {
  const [tableDataSource, setTableDataSource] = useState()
  const { handleLeave } = usePrompt()

  const [form] = Form.useForm()
  const { time, ot } = useQuery()

  const service = DeliveryAddFactory.getInstance(Number(ot))
  service.setForm(form)

  const { handleLogisticsShow, isSince } = useLogistics()

  const { anchors, update, delUpdate } = useAnchor([BaseInfo, Distribution, DeliveryInfo, LogisticsInfo])

  useEffect(() => {
    const DELIVERY_NOTICE_PATH: any = JSON.parse(localStorage.getItem('DELIVERY_NOTICE_PATH'))

    const data = DELIVERY_NOTICE_PATH[time]

    let formFeils = service.formatField(data)

    setTableDataSource(data.products)
    handleAnchor(data?.products?.length)

    form.setFieldsValue({
      sourceType: SourceTypeEnum.PlanAdd,
      ...formFeils,
    })
  }, [])

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
              history.back(-2)
            }, 1000)
          }
        })
      },
    })
  }, [form, tableDataSource])

  const handleAnchor = (len) => {
    update([
      ot == RoleTypeEnum.B2B
        ? {
            ...DeliveryGood,
            name: `${DeliveryGood.name}(${len})`,
          }
        : {
            ...Material,
            name: `${Material.name}(${len})`,
          },
    ])
  }

  const handleDelAnchor = (len) => {
    delUpdate([
      ot == RoleTypeEnum.B2B
        ? {
            ...DeliveryGood,
            name: `${DeliveryGood.name}(${len})`,
          }
        : {
            ...Material,
            name: `${Material.name}(${len})`,
          },
    ])
  }

  return (
    <AnchorPage
      title="新增送货单"
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

        <ContentBox title={BaseInfo.name} id={BaseInfo.key}>
          <FormItem label={DeliveryPanleNoLabel} name="sourceNo">
            <Input disabled />
          </FormItem>

          <FormItem rules={[required(`${DeliveryAbstractLabel}不能为空`)]} label={DeliveryAbstractLabel} name="digest">
            <Input />
          </FormItem>

          <FormItem rules={[validatorByteObject(150)]} label={NoteLabel} name="remark">
            <Input maxLength={150} placeholder="最长150个汉字" />
          </FormItem>

          <FormItem rules={[required(`${BuyerLabel}不能为空`)]} label={BuyerLabel} name="member">
            <RoleSelect
              formProp={form}
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
        </ContentBox>

        <ContentBox title={Distribution.name} id={Distribution.key}>
          <FormItem rules={[required(`${DeliveryDate}不能为空`)]} label={DeliveryDate} name="deliveryTime">
            <DatePickerSelect formProp={form} disabled={true} defualtToday={true} className="w-full" />
          </FormItem>

          <FormItem rules={[validatorByteObject(16)]} label={DeliveryNameLabel} name="executorVO.consignee">
            <Input maxLength={16} placeholder={`请输入${DeliveryNameLabel}`} />
          </FormItem>

          <FormItem rules={[required(`${DeliveryTime}不能为空`)]} label={DeliveryTime} name="deliveryRangeTime">
            <DatePickerSelect.RangePicker className="w-full" picker="time" />
          </FormItem>

          <FormItem
            rules={[{ pattern: PATTERN_MAPS.phone, message: '手机号是否正确' }, validatorByteObject(20)]}
            label={DeliveryPhoneLabel}
            name="executorVO.phone"
          >
            <Input type="tel" maxLength={20} placeholder={`请输入${DeliveryPhoneLabel}`} />
          </FormItem>
        </ContentBox>

        <ContentBox title={DeliveryInfo.name} id={DeliveryInfo.key}>
          <FormItem rules={[required(`${ConsigneeTimeLabel}不能为空`)]} label={ConsigneeTimeLabel} name="sendTime">
            <DatePickerSelect className="w-full" />
          </FormItem>

          <FormItem
            // rules={[
            //   required(`${ReceivingAddressLabel}不能为空`)
            // ]}
            label={ReceivingAddressLabel}
            name="receiveVO"
          >
            <ReceiverAddress hiddenBtn={true} disabled={true} />
          </FormItem>

          <FormItem
            rules={[required(`${DeliverySlefAddrLabel}不能为空`)]}
            label={DeliverySlefAddrLabel}
            name="deliveryVO"
          >
            <ShipperAddress
              formProp={form}
              showDefault={true}
              onChange={(val) => {
                form.setFieldsValue({
                  'executorVO.phone': val?.phone,
                })
              }}
            />
          </FormItem>
        </ContentBox>

        <ContentBox title={LogisticsInfo.name} id={LogisticsInfo.key}>
          <FormItem rules={[required(`请选择${DeliveryTypeLabel}`)]} label={DeliveryTypeLabel} name="deliveryType">
            <Radio.Group
              onChange={(e) => {
                form.setFieldsValue({ deliveryType: e.target?.value })
                handleLogisticsShow(e.target.value)
              }}
            >
              <Radio value={1}>物流</Radio>
              <Radio value={2}>自提</Radio>
              {/* <Radio.Button value={3}>无效配送</Radio.Button> */}
            </Radio.Group>
          </FormItem>

          <FormItem
            rules={[validatorByteObject(20)]}
            hidden={isSince}
            label={LogisticsCarNoLabel}
            name="executorVO.carNumbers"
          >
            <Input placeholder={`请输入${LogisticsCarNoLabel}`} maxLength={20} />
          </FormItem>

          <FormItem hidden={isSince} label={LogisticsCompanyLabel} name="logisticsCompanyInt">
            <LogisticsCompanyMerchantsSelect formProp={form} />
          </FormItem>

          <FormItem
            rules={
              isSince ? [validatorByteObject(20)] : [validatorByteObject(20), required(`请输入${LogisticsNoLabel}`)]
            }
            hidden={isSince}
            label={LogisticsNoLabel}
            name="logisticsNo"
          >
            <Input placeholder={`请输入${LogisticsNoLabel}`} maxLength={20} />
          </FormItem>
        </ContentBox>

        <ContentBox
          title={ot == 1 ? DeliveryGood.name : Material.name}
          id={ot == 1 ? DeliveryGood.key : Material.key}
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
                ...(ot == 1 ? DeliveryNoticeTableColumn : DeliveryNoticeTableColumnSRM),
                {
                  ...DeliveryNumColumn,
                  render: (t, rcode, index) => {
                    return (
                      <HarvestMaterialInput
                        value={rcode['deliveryCount']}
                        index={index}
                        keyup="deliveryCount"
                        disabled={true}
                      />
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

export default DeliveryNoticeManageSRMDetails
