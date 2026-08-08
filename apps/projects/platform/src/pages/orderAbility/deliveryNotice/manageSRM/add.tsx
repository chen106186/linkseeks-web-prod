/**
 * 订单能力 - 送货单 - 送货单管理详情SRM
 * @author: Gavin
 * @description: 与B2B内容大致相同，文件分开方便后续对接以及日后变动修改二开
 */
import AnchorPage, { AnchorsItem } from '@/components/AnchorPage'
import React, { useCallback, useEffect, useState, useContext, useMemo } from 'react'
import {
  BaseInfo,
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
  OutStatusLabel,
  ReceivingAddress,
} from '../../constants'
import { BaseInfo as ContentBox } from '@/components/BaseInfo'
import { Input, Table, Row, Col, Select, Radio, Form, Button, Modal } from 'antd'
import { DeliveryNoticeTableColumn, DeliveryNoticeTableColumnSRM } from '../../constants/page-table-column'
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
import { HarvestMaterialContextProvider, HarvestMaterialContext, HarvestMaterialInput } from '../../assets/context'
import moment from 'moment'
import { HandelFormFieldsKeyValue } from '@/utils/form'
import { DeliveryNoteAddService } from '../../assets/handles/HandleFormSubmit'
import { RoleSelect } from '@/components/RoleSelect'
import DeliveryNoticeOrderFactory from '../../assets/handles/DeliveryNoticeOrder'
import LogisticsCompanyMerchantsSelect from '@/components/LogisticsCompanySelect/LogisticsCompanyMerchantsSelect'
import { values } from 'lodash'
import {
  DeliveryNumColumn,
  OrderNumColumn,
  ResidueDeliveryNumColumn,
  DeliveredNumColumn,
} from '../../constants/table-column'
import { addrFormatValue } from '../../assets/format/addrValue'
import DeliveryGoodTableSelectSRM from '../../components/DeliveryGoodTableSelect/DeliveryGoodTableSelectSRM'
import { PATTERN_MAPS } from '@/constants/regExp'
import usePrompt from '@/hooks/usePrompt'
import useLogistics from '../../assets/hooks/useLogistics'
import { validatorByteObject } from '@/utils/regExp'
import { formatTable, formMapData } from '../../components/DeliveryGoodTableSelect/useformatTable'
import { useWebIntl } from '@apps/locales'

const ContentBoxItem = ContentBox.BaseInfoItem

const DeliveryNoticeManageSRMDetails: React.FC = () => {
  const [tableDataSource, setTableDataSource] = useState<Map<string, any>>(new Map())
  const [tableDataSourceContext, setTableDataSourceContext] = useState([])
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)
  const translate = useWebIntl()
  const { handleLeave } = usePrompt()

  // const { handleLogisticsShow, isSince } = useLogistics()

  const [form] = Form.useForm()
  const service = new DeliveryNoteAddService(form)

  const [anchors, setAnchors] = useState<AnchorsItem[]>([
    BillsInfo,
    Distribution,
    DeliveryInfo,
    LogisticsInfo,
    Material,
  ])

  useEffect(() => {
    form.setFieldsValue({
      sourceType: 0,
      deliveryRangeTime: [moment().startOf('day').add('hour', 8), moment().startOf('day').add('hour', 12)],
    })
  }, [])

  useEffect(() => {}, [])

  const handleSubmit = useCallback(() => {
    Modal.confirm({
      title: '提示',
      content: '确认送货单资料填写是否正确，提交后不能再撤回!',
      onOk: () => {
        service.setTableData(tableDataSourceContext)
        setSubmitLoading(true)
        service
          .submit()
          .then((res) => {
            if (res.code === 1000) {
              handleLeave(false)
              setTimeout(() => {
                history.go(-1)
              }, 1000)
            }
          })
          .finally(() => setSubmitLoading(false))
      },
    })
  }, [form, tableDataSourceContext, submitLoading])

  return (
    <AnchorPage
      title="新增送货单"
      anchors={anchors}
      extra={
        <Button.Group>
          <Button onClick={handleSubmit} loading={submitLoading} type="primary">
            提交
          </Button>
        </Button.Group>
      }
    >
      <Form
        form={form}
        onValuesChange={() => {
          handleLeave()
        }}
      >
        <FormItem hidden name="sourceType">
          <Input type="hidden" />
        </FormItem>

        <ContentBox title={BillsInfo.name} id={BillsInfo.key}>
          <FormItem rules={[required()]} label={DeliveryAbstractLabel} name="digest">
            <Input />
          </FormItem>

          <FormItem label={NoteLabel} rules={[validatorByteObject(100)]} name="remark">
            <Input.TextArea placeholder="最长100字符，50个汉字" maxLength={100} rows={1} />
          </FormItem>

          <FormItem rules={[required()]} label={BuyerLabel} name="member">
            <RoleSelect
              formProp={form}
              isDefault={true}
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
          <FormItem rules={[required()]} label={DeliveryDate} name="deliveryTime">
            <DatePickerSelect formProp={form} defualtToday={true} className="w-full" />
          </FormItem>

          <FormItem label={DeliveryNameLabel} name="executorVO.consignee">
            <Input placeholder={`请输入${DeliveryNameLabel}`} maxLength={16} />
          </FormItem>

          <FormItem rules={[required()]} label={DeliveryTime} name="deliveryRangeTime">
            <DatePickerSelect.RangePicker className="w-full" picker="time" />
          </FormItem>

          <FormItem
            rules={[{ pattern: PATTERN_MAPS.phone, message: '手机号是否正确' }]}
            label={DeliveryPhoneLabel}
            name="executorVO.phone"
          >
            <Input type="tel" placeholder={`请输入${DeliveryPhoneLabel}`} maxLength={20} />
          </FormItem>
        </ContentBox>

        <ContentBox title={DeliveryInfo.name} id={DeliveryInfo.key}>
          <FormItem rules={[required()]} label={ConsigneeTimeLabel} name="sendTime">
            <DatePickerSelect className="w-full" />
          </FormItem>

          <FormItem label={ReceivingAddress} name="receiveVO">
            <ReceiverAddress disabled={true} hiddenBtn={true} />
          </FormItem>

          <FormItem
            rules={[required(`请输入${DeliverySlefAddrLabel}`)]}
            label={DeliverySlefAddrLabel}
            name="deliveryVO"
          >
            <ShipperAddress formProp={form} showDefault={true} />
          </FormItem>
        </ContentBox>

        <ContentBox title={LogisticsInfo.name} id={LogisticsInfo.key}>
          {/* <FormItem
            rules={[
              required()
            ]}
            label={DeliveryTypeLabel} name="deliveryType"
            initialValue={1}
          >
            <Radio.Group onChange={(e) => {
              form.setFieldsValue({ 'deliveryType': e.target?.value })
              handleLogisticsShow(e.target.value)
            }}>
              <Radio value={1}>物流</Radio>
              <Radio value={2}>自提</Radio>
            </Radio.Group>
          </FormItem> */}
          <FormItem
            // hidden={isSince}
            label={LogisticsNoLabel}
            name="logisticsNo"
          >
            <Input maxLength={20} placeholder={`请输入${LogisticsNoLabel}`} />
          </FormItem>

          <FormItem
            // hidden={isSince}
            label={LogisticsCompanyLabel}
            name="logisticsCompanyInt"
          >
            <LogisticsCompanyMerchantsSelect formProp={form} />
          </FormItem>

          <FormItem
            rules={
              // isSince ?
              [validatorByteObject(20)]
              // :
              // [
              //   validatorByteObject(20),
              //   required(`请输入${LogisticsNoLabel}`)
              // ]
            }
            // hidden={isSince}
            label={LogisticsCarNoLabel}
            name="executorVO.carNumbers"
          >
            <Input maxLength={20} placeholder={`请输入${LogisticsCarNoLabel}`} />
          </FormItem>
        </ContentBox>

        <ContentBox title={Material.name} id={Material.key} cols={1}>
          {/* 在编辑的时候不需要进行此操作 */}
          <DeliveryGoodTableSelectSRM
            value={tableDataSource}
            form={form}
            onChange={(value) => {
              let atpm = JSON.parse(JSON.stringify(anchors))
              atpm.pop()

              const ft = formatTable(value)
              if (ft.length > 0) {
                let addr = {
                  provinceName: ft[0].provinceName,
                  cityName: ft[0].cityName,
                  districtName: ft[0].districtName,
                  streetName: ft[0].streetName,
                  address: ft[0].address,
                  phone: ft[0].phone,
                  consignee: ft[0].consignee,
                  receiverName: ft[0].consignee,
                  fullAddress: `${ft[0].provinceName}${ft[0].cityName}${ft[0].districtName}${ft[0].streetName}${ft[0].address}`,
                }
                form.setFieldsValue({
                  receiveVO: addr,
                })
              }

              setAnchors([
                ...atpm,
                {
                  ...Material,
                  name: `${Material.name}(${ft.length})`,
                },
              ])

              setTableDataSource(value)
              setTableDataSourceContext(ft)
            }}
          />

          <HarvestMaterialContextProvider
            value={{
              dataSource: tableDataSourceContext,
            }}
          >
            <Table
              rowKey={(row) => row.orderNo}
              columns={[
                ...DeliveryNoticeTableColumnSRM,
                {
                  ...DeliveryNumColumn,
                  fixed: 'right',
                  width: 120,
                  render: (t, record, index) => {
                    return (
                      <HarvestMaterialInput
                        value={record[DeliveryNoticeTableColumnSRM[DeliveryNoticeTableColumnSRM.length - 1].key]}
                        index={index}
                        keyup="deliveryCount"
                      />
                    )
                  },
                },

                {
                  title: translate('web.common.control'),
                  render: (t, r, i) => {
                    return (
                      <Button
                        type="link"
                        onClick={() => {
                          let tpm = JSON.parse(JSON.stringify(tableDataSourceContext))
                          tpm.splice(i, 1)
                          let atpm = JSON.parse(JSON.stringify(anchors))
                          atpm.pop()

                          setAnchors([
                            ...atpm,
                            {
                              ...Material,
                              name: `${Material.name}(${tpm.length})`,
                            },
                          ])

                          const r = formMapData(tableDataSource, tpm)

                          setTableDataSource(r)
                          setTableDataSourceContext(tpm)
                        }}
                      >
                        {translate('web.common.delete')}
                      </Button>
                    )
                  },
                },
              ]}
              dataSource={tableDataSourceContext}
            />
          </HarvestMaterialContextProvider>
        </ContentBox>
      </Form>
    </AnchorPage>
  )
}

export default DeliveryNoticeManageSRMDetails
