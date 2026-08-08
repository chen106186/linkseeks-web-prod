/**
 * 订单能力 - 送货单 - 送货单管理详情SRM
 * @author: Gavin
 * @description: 与B2B内容大致相同，文件分开方便后续对接以及日后变动修改二开
 */
import { PageHeaderWrapper } from '@apps/components'
import React, { useCallback, useEffect, useState } from 'react'
import {
  BillsInfo,
  BuyerLabel,
  ConsigneeTimeLabel,
  DeliveryAbstractLabel,
  DeliveryDate,
  DeliveryGood,
  DeliveryInfo,
  DeliveryNameLabel,
  DeliveryPhoneLabel,
  DeliverySlefAddrLabel,
  DeliveryTimeLabel,
  Distribution,
  LogisticsCarNoLabel,
  LogisticsCompanyLabel,
  LogisticsInfo,
  LogisticsNoLabel,
  NoteLabel,
  ReceivingAddress,
} from '../../constants'
import { BaseInfo as ContentBox } from '@/components/BaseInfo'
import { Input, Table, Form, Button, Modal, Tabs } from 'antd'
import { DeliveryNoticeTableColumnB2B } from '../../constants/page-table-column'
import { FormItem, required } from '@/components/FormItem'
import { DatePickerSelect } from '@/components/DatePickerSelect'
import { ReceiverAddress, ShipperAddress } from '@/components/AddressDrawer'
import { HarvestMaterialContextProvider, HarvestMaterialInput } from '../../assets/context'
import { ReceivingNoteB2BAddService } from '../../assets/handles/HandleFormSubmit'
import { RoleSelect } from '@/components/RoleSelect'
import LogisticsCompanyMerchantsSelect from '@/components/LogisticsCompanySelect/LogisticsCompanyMerchantsSelect'
import moment from 'moment'
import DeliveryGoodTableSelectB2B from '../../components/DeliveryGoodTableSelect/DeliveryGoodTableSelectB2B'
import { PATTERN_MAPS } from '@/constants/regExp'
import usePrompt from '@/hooks/usePrompt'
import { validatorByteObject } from '@/utils/regExp'
import { formatTable, formMapData } from '../../components/DeliveryGoodTableSelect/useformatTable'
import { getMemberManageBuyerMember } from '@apps/apis'
import { getProductSelectGetWarehouse, postProductInventoryGetWarehouseDistributableInventory } from '@apps/apis'
import { useWebIntl } from '@apps/locales'
import { tabLink } from '@apps/components/src/web/PageHeaderWrapper'

const { TabPane } = Tabs

const DeliveryNoticeManageSRMDetails: React.FC = () => {
  const [tableDataSource, setTableDataSource] = useState<Map<string, any>>(new Map())
  const [tableDataSourceContext, setTableDataSourceContext] = useState([])
  const [warehouseOptions, setWarehouseOptions] = useState<any>([])
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)
  const [outOfStockId, setOutOfStockId] = useState<number>()
  const translate = useWebIntl()
  const { handleLeave } = usePrompt()

  const [form] = Form.useForm()
  const service = new ReceivingNoteB2BAddService(form)

  const [anchors, setAnchors] = useState<tabLink[]>([
    BillsInfo,
    Distribution,
    DeliveryInfo,
    LogisticsInfo,
    DeliveryGood,
  ])

  useEffect(() => {
    form.setFieldsValue({
      sourceType: 0,
      deliveryRangeTime: [moment().startOf('day').add('hour', 8), moment().startOf('day').add('hour', 12)],
    })
    getProductSelectGetWarehouse().then((res) => {
      if (res.code === 1000 && res.data.length > 0) {
        setWarehouseOptions(res.data)
        setOutOfStockId(res.data[0].id)
        form.setFieldsValue({
          outOfStockId: res.data[0].id,
          warehouseRole: res.data[0].warehouseAdminName,
        })
      }
    })
  }, [])

  const handleSubmit = useCallback(() => {
    Modal.confirm({
      title: translate('web.common.tip'),
      content: translate('web.resource.order.querensonghuodanziliaotianxieshifouzhengque'),
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
  }, [form, tableDataSourceContext])

  useEffect(() => {
    if (outOfStockId && tableDataSourceContext.length > 0) {
      const _products = tableDataSourceContext
      const _materielIdList = _products.map((item) => item.goodsId).filter((item) => item !== null)
      if (_materielIdList.length > 0) {
        postProductInventoryGetWarehouseDistributableInventory({
          warehouseId: outOfStockId,
          materielIdList: _materielIdList,
        }).then((res) => {
          if (res.code === 1000) {
            const _list = []
            _products.forEach((item) => {
              const _obj = { ...item }
              const _distributableInventory =
                res.data.filter((_item) => _item.goodsId === item.goodsId)?.[0]?.distributableInventory ?? 0
              _obj.availableForDeliveryQuantity = _distributableInventory
              _list.push(_obj)
            })
            setTableDataSourceContext(_list)
          }
        })
      }
    }
  }, [outOfStockId])

  const handleRemoveMaterialTableRow = (i: number) => {
    const source: any[] = JSON.parse(JSON.stringify(tableDataSourceContext))
    source.splice(i, 1)

    const atpm = JSON.parse(JSON.stringify(anchors))
    atpm.pop()
    setAnchors([
      ...atpm,
      {
        ...DeliveryGood,
        label: `${DeliveryGood.name}(${source.length})`,
      },
    ])

    const r = formMapData(tableDataSource, source)
    setTableDataSource(r)
    setTableDataSourceContext(source)
  }

  const onWarehouseChange = (key: string) => {
    const _obj = { ...warehouseOptions[Number(key)] }
    setOutOfStockId(_obj.id)
    form.setFieldsValue({ outOfStockId: _obj.id, warehouseRole: _obj.warehouseAdminName })
  }

  return (
    <PageHeaderWrapper
      title={translate('web.resource.order.xinzengsonghuodan')}
      items={anchors}
      extra={
        <Button.Group>
          <Button onClick={handleSubmit} loading={submitLoading} type="primary">
            {translate('web.common.submit')}
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

        <ContentBox title={BillsInfo.label} id={BillsInfo.key}>
          <FormItem rules={[required(), validatorByteObject(100)]} label={DeliveryAbstractLabel} name="digest">
            <Input />
          </FormItem>

          <FormItem rules={[validatorByteObject(100)]} label={NoteLabel} name="remark">
            <Input
              placeholder={translate('web.common.tip_byteLengthLimit', { byteNum: 100, chineseNum: 50 })}
              maxLength={100}
            />
          </FormItem>

          <FormItem rules={[required()]} label={BuyerLabel} name="member">
            <RoleSelect
              formProp={form}
              request={getMemberManageBuyerMember}
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

        <ContentBox title={Distribution.label} id={Distribution.key}>
          <FormItem rules={[required()]} label={DeliveryDate} name="deliveryTime">
            <DatePickerSelect formProp={form} defualtToday={true} className="w-full" />
          </FormItem>

          <FormItem label={DeliveryNameLabel} name="executorVO.consignee">
            <Input placeholder={`${translate('web.common.qingshuru')}${DeliveryNameLabel}`} />
          </FormItem>

          <FormItem rules={[required()]} label={DeliveryTimeLabel} name="deliveryRangeTime">
            <DatePickerSelect.RangePicker className="w-full" picker="time" />
          </FormItem>

          <FormItem
            rules={[
              { pattern: PATTERN_MAPS.phone, message: translate('web.resource.member.qingshuruzhengquedeshoujihao') },
            ]}
            label={DeliveryPhoneLabel}
            name="executorVO.phone"
          >
            <Input type="tel" placeholder={`${translate('web.common.qingshuru')}${DeliveryPhoneLabel}`} />
          </FormItem>
        </ContentBox>

        <ContentBox title={DeliveryInfo.label} id={DeliveryInfo.key}>
          <FormItem rules={[required()]} label={ConsigneeTimeLabel} name="sendTime">
            <DatePickerSelect className="w-full" />
          </FormItem>

          <FormItem label={ReceivingAddress} name="receiveVO">
            <ReceiverAddress disabled={true} hiddenBtn={true} />
          </FormItem>

          <FormItem rules={[required()]} label={DeliverySlefAddrLabel} name="deliveryVO">
            <ShipperAddress formProp={form} showDefault={true} />
          </FormItem>
        </ContentBox>

        <ContentBox title={LogisticsInfo.label} id={LogisticsInfo.key}>
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
              <Radio.Button value={3}>无效配送</Radio.Button>
            </Radio.Group>
          </FormItem> */}

          <FormItem label={LogisticsCarNoLabel} name="executorVO.carNumbers">
            <Input placeholder={`${translate('web.common.qingshuru')}${LogisticsCarNoLabel}`} maxLength={20} />
          </FormItem>
          <FormItem label={LogisticsCompanyLabel} name="logisticsCompanyInt">
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
            label={LogisticsNoLabel}
            name="logisticsNo"
          >
            <Input placeholder={`${translate('web.common.qingshuru')}${LogisticsNoLabel}`} maxLength={20} />
          </FormItem>
        </ContentBox>

        <ContentBox title={DeliveryGood.label} id={DeliveryGood.key} cols={1}>
          <FormItem hidden={true} name="outOfStockId" />
          <FormItem hidden={true} name="warehouseRole" />
          <Tabs defaultActiveKey="0" onChange={onWarehouseChange}>
            {warehouseOptions?.map((_item, _index) => (
              <TabPane tab={_item.name} key={`${_index}`} />
            ))}
          </Tabs>
          {/* 在编辑的时候不需要进行此操作 */}
          <DeliveryGoodTableSelectB2B
            value={tableDataSource}
            form={form}
            onChange={(value) => {
              const atpm = JSON.parse(JSON.stringify(anchors))
              atpm.pop()

              const ft = formatTable(value)

              setAnchors([
                ...atpm,
                {
                  ...DeliveryGood,
                  name: `${DeliveryGood.name}(${ft.length})`,
                },
              ])

              if (ft.length > 0) {
                const addr = {
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
              const _materielIdList = ft.map((item) => item.goodsId).filter((item) => item !== null)
              if (_materielIdList.length > 0) {
                postProductInventoryGetWarehouseDistributableInventory({
                  warehouseId: outOfStockId,
                  materielIdList: _materielIdList,
                }).then((res) => {
                  if (res.code === 1000) {
                    const _list = []
                    ft.forEach((item) => {
                      const _obj = { ...item }
                      const _distributableInventory =
                        res.data.filter((_item) => _item.goodsId === item.goodsId)?.[0]?.distributableInventory ?? 0
                      _obj.availableForDeliveryQuantity = _distributableInventory
                      _list.push(_obj)
                    })
                    setTableDataSource(value)
                    setTableDataSourceContext(_list)
                  }
                })
              } else {
                setTableDataSource(value)
                setTableDataSourceContext(ft)
              }
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
                {
                  title: translate('web.resource.logistics.daisonghuoshuliang'),
                  dataIndex: 'leftCount',
                  key: 'leftCount',
                },
                ...DeliveryNoticeTableColumnB2B,
                {
                  // ...DeliveryNumColumn,
                  title: translate('web.resource.logistics.songhuoshuliang'),
                  dataIndex: 'deliveryCount',
                  key: 'deliveryCount',
                  fixed: 'right',
                  width: 120,
                  render: (t, record, index) => {
                    return (
                      <HarvestMaterialInput
                        value={record[DeliveryNoticeTableColumnB2B[DeliveryNoticeTableColumnB2B.length - 1].key]}
                        index={index}
                        keyup="deliveryCount"
                      />
                    )
                  },
                },
                {
                  title: translate('web.common.control'),
                  fixed: 'right',
                  width: 100,
                  render: (t, r, i) => {
                    return (
                      <Button type="link" onClick={() => handleRemoveMaterialTableRow(i)}>
                        {translate('web.common.delete')}
                      </Button>
                    )
                  },
                },
              ]}
              dataSource={tableDataSourceContext}
              pagination={{
                size: 'small',
              }}
              scroll={{ x: 1800 }}
            />
          </HarvestMaterialContextProvider>
        </ContentBox>
      </Form>
    </PageHeaderWrapper>
  )
}

export default DeliveryNoticeManageSRMDetails
