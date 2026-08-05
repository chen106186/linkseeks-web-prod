/**
 * 订单能力 - 待提交送货通知单B2b - 增修送货通知单B2B详情
 * @author: Gavin
 */
import React, { useEffect, useState, useRef } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { history } from '@linkseeks/router-manager'
import BaseInfo from '@/components/BaseInfo/BaseInfo'
import { Button, DatePicker, Form, Input, Table, TimePicker, message } from 'antd'
import { SaveOutlined } from '@ant-design/icons'
import { ReceiverAddress } from '@/components/AddressDrawer'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import { RoleSelect } from '@/components/RoleSelect'
import DeliveryGoodTableSelect from '../../../../components/DeliveryGoodTableSelect/DeliveryGoodTableSelect'
import { HarvestMaterialContextProvider, HarvestMaterialInput } from '../../../../assets/context'
import {
  postOrderDeliveryNoticeOrderB2bCreate,
  getOrderDeliveryNoticeOrderDetail,
  getOrderDeliveryNoticeOrderDetailPage,
  postOrderDeliveryNoticeOrderUpdate,
} from '@apps/apis'
import {
  BaseInfo as base_info,
  DeliveryGood,
  Remarks,
  NoticeSummary,
  BuyerLabel,
  DeliveryDate,
  DeliveryTime,
  ReceivingAddress,
  ShippingInfo,
} from '../../../../constants'
import {
  BrandColumn,
  ClassColumn,
  MaterialModelColumn,
  CommodityNoColumn,
  TradeNameColumn,
  OrderCreatedAtColumn,
  OrderNoColumn,
  OrderNumColumn,
  UntilColumn,
} from '../../../../constants/table-column'
import moment from 'moment'
import usePrompt from '@/hooks/usePrompt'
import FormProgress, { HandleType } from '@/components/FormProgress'
import { getMemberManageBuyerMember } from '@apps/apis'
import { validatorByte } from '@/utils/regExp'
import { formatTable, formMapData } from '@/pages/orderAbility/components/DeliveryGoodTableSelect/useformatTable'
import { useWebIntl } from '@apps/locales'

type PropsType = {
  type: 'add' | 'edit'
  id?: string
  planData?: any
  btnCode: string
}

enum PAGE_TYPE {
  ADD = 'add',
  EDIT = 'edit',
}

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 },
}

const DeliveryNoticeManagementAwaitB2BDetails: React.FC<PropsType> = ({ type, id, planData, btnCode }) => {
  const [form] = Form.useForm()
  const { handleLeave } = usePrompt()
  const [tableDataSource, setTableDataSource] = useState<any>(new Map())
  const [tableDataSourceContext, setTableDataSourceContext] = useState([])

  const [loading, setLoading] = useState<boolean>(false)

  const progressRef = useRef<HandleType>()

  const translate = useWebIntl()

  const getConst = (len = 0) => {
    return [
      base_info,
      ShippingInfo,
      { ...DeliveryGood, label: `${translate('web.resource.commodity.songhuoshangping')}${!!len ? `(${len})` : ''}` },
      Remarks,
    ]
  }

  const PAGE_TYPE_LABEL = {
    [PAGE_TYPE.ADD]: translate('web.common.add'),
    [PAGE_TYPE.EDIT]: translate('web.common.edit'),
  }

  const changeTableSource = (data = []) => {
    setTableDataSourceContext(data)
    renderProgress(data)
  }

  const renderProgress = (data = tableDataSourceContext) => {
    const planCountValues: any = {}
    data.forEach((item, index) => {
      planCountValues[`planCount${index}`] = item.planCount
    })
    progressRef.current.render(form, { tableDataSourceContext: data, ...planCountValues })
  }

  const handleSubmit = () => {
    form.validateFields().then(({ deliveryStartEndTime, deliveryTime, digest, member, receivingAddress, remark }) => {
      if (tableDataSourceContext.some((item) => !item.planCount)) {
        message.warning(translate('web.resource.order.qingtianxiejihuasonghuoshuliang'))
        return
      }
      const { name: buyerMemberName, roleType, ...buyerMemberRest } = member
      const params = {
        noticeId: id || undefined,
        ...buyerMemberRest,
        buyerMemberName,
        digest,
        ...receivingAddress,
        deliveryTime: moment(deliveryTime).format('YYYY-MM-DD'),
        deliveryStartTime: moment(deliveryStartEndTime[0]).format('HH:mm'),
        deliveryEndTime: moment(deliveryStartEndTime[1]).format('HH:mm'),
        products: tableDataSourceContext,
        remark,
      }
      const requestApi = id ? postOrderDeliveryNoticeOrderUpdate : postOrderDeliveryNoticeOrderB2bCreate
      setLoading(true)
      requestApi(params)
        .then(({ code, data }) => {
          if (code === 1000) {
            handleLeave(false)
            // history.goBack()
            // 兼容从送货计划协同跳转生成送货通知单
            handleLeave(false)
            history.push('/orderAbility/deliveryNoticeManagement/query')
          }
        })
        .finally(() => {
          setLoading(false)
        })
    })
  }

  const handleRemoveMaterialTableRow = (i: number) => {
    const source: any[] = JSON.parse(JSON.stringify(tableDataSourceContext))
    source.splice(i, 1)

    const r = formMapData(tableDataSource, source)

    setTableDataSource(r)

    changeTableSource(source)
  }

  const getDetail = async () => {
    const { code, data } = await getOrderDeliveryNoticeOrderDetail({ id })
    if (code === 1000) {
      const member = {
        name: data.buyerMemberName,
        buyerMemberId: data.buyerMemberId,
        buyerRoleId: data.buyerRoleId,
        roleType: 2,
      }
      const receivingAddress = {
        planNo: data.planNo,
        provinceName: data.provinceName,
        cityName: data.cityName,
        districtName: data.districtName,
        streetName: data.streetName || '0',
        address: data.address,
        phone: data.phone,
        consignee: data.consignee,
        consigneeId: data.consigneeId,
        fullAddress: `${data.provinceName}${data.cityName}${data.districtName}${data.streetName}${data.address}`,
      }
      form.setFieldsValue({
        deliveryTime: moment(data.deliveryTime),
        deliveryStartEndTime: [moment(data.deliveryStartTime, 'HH:mm'), moment(data.deliveryEndTime, 'HH:mm')],
        digest: data.digest,
        member,
        receivingAddress,
      })
    }
  }

  const getOrderDeliveryNoticeOrderDetailList = () => {
    getOrderDeliveryNoticeOrderDetailPage({ current: '1', pageSize: '50', orderId: id }).then(({ code, data }) => {
      if (code === 1000) {
        changeTableSource(data.data)
      }
    })
  }

  useEffect(() => {
    if (id) {
      getDetail()
      getOrderDeliveryNoticeOrderDetailList()
    } else {
      // 通过送货计划生成时
      if (planData) {
        const receivingAddress = {
          planNo: planData.planNo,
          provinceName: planData.provinceName,
          cityName: planData.cityName,
          districtName: planData.districtName,
          streetName: planData.streetName,
          address: planData.address,
          phone: planData.phone,
          consignee: planData.consignee,
          consigneeId: planData.consigneeId,
          fullAddress: `${planData.provinceName || ''}${planData.cityName || ''}${planData.districtName || ''}${
            planData.streetName || ''
          }${planData.address || ''}`,
        }
        form.setFieldsValue({
          digest: `${planData.deliveryTime}${planData.products[0]?.productName || ''}${translate(
            'web.resource.order.songhuotongzhi',
          )}`,
          deliveryTime: moment(planData.deliveryTime),
          receivingAddress,
          member: {
            buyerMemberId: planData.buyerMemberId,
            buyerRoleId: planData.buyerRoleId,
            roleType: 2,
            name: planData.buyerMemberName,
          },
        })
        changeTableSource(planData.products)
      }
    }
  }, [])

  const columns = [
    { ...CommodityNoColumn, dataIndex: 'skuId' },
    { ...TradeNameColumn, dataIndex: 'productName' },
    { ...MaterialModelColumn, dataIndex: 'spec' },
    { ...ClassColumn, dataIndex: 'category' },
    { ...BrandColumn, dataIndex: 'brand' },
    { ...UntilColumn, dataIndex: 'unit' },
    { ...OrderNoColumn, dataIndex: 'orderNo' },
    { ...OrderCreatedAtColumn, dataIndex: 'createTime' },
    { ...OrderNumColumn, dataIndex: 'purchaseCount' },
    {
      title: translate('web.resource.logistics.jihuasonghuoshuliang'),
      width: 100,
      align: 'center',
      render: (t, rcode, index) => {
        return (
          <HarvestMaterialInput
            disabled={!!planData}
            value={rcode['planCount']}
            index={index}
            keyup="planCount"
            onValuesChange={() => {
              handleLeave()
              renderProgress()
            }}
          />
        )
      },
    },
  ]
  !planData &&
    columns.push({
      title: translate('web.common.control'),
      align: 'center',
      render: (t, r, i) => {
        return (
          <Button type="link" onClick={() => handleRemoveMaterialTableRow(i)}>
            {translate('web.common.delete')}
          </Button>
        )
      },
    })

  return (
    <PageHeaderWrapper
      title={
        <FormProgress
          title={`${PAGE_TYPE_LABEL[type]}${translate('web.resource.order.songhuotongzhidan')}`}
          ref={progressRef}
        />
      }
      onBack={() => history.goBack()}
      items={getConst(tableDataSourceContext?.length)}
      extra={
        <AuthButton type="custom" code={btnCode}>
          <Button icon={<SaveOutlined />} loading={loading} onClick={handleSubmit} type="primary">
            {translate('web.common.submit')}
          </Button>
        </AuthButton>
      }
    >
      <Form
        labelAlign="left"
        form={form}
        onValuesChange={() => {
          handleLeave()
          renderProgress()
        }}
      >
        <BaseInfo className="mt-0" title={base_info.label} id={base_info.key}>
          <Form.Item
            {...formItemLayout}
            name="digest"
            label={NoticeSummary}
            rules={[{ required: true, message: `${translate('web.common.qingtianxie')}${NoticeSummary}` }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            {...formItemLayout}
            rules={[{ required: true, message: `${translate('web.common.qingxuanze')}${BuyerLabel}` }]}
            label={BuyerLabel}
            name="member"
          >
            <RoleSelect
              request={getMemberManageBuyerMember}
              disabled={!!planData}
              formatFeils={(e) => {
                return {
                  buyerMemberId: e.memberId,
                  buyerRoleId: e.roleId,
                  roleType: 2,
                  name: e.name,
                }
              }}
            />
          </Form.Item>
        </BaseInfo>
        <BaseInfo className="mt-16" title={ShippingInfo.label} id={ShippingInfo.key}>
          <Form.Item
            {...formItemLayout}
            label={DeliveryDate}
            name="deliveryTime"
            rules={[{ required: true, message: `${translate('web.common.qingxuanze')}${DeliveryDate}` }]}
          >
            <DatePicker disabled={!!planData} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            {...formItemLayout}
            label={ReceivingAddress}
            name="receivingAddress"
            rules={[{ required: true, message: `${translate('web.common.qingxuanze')}${ReceivingAddress}` }]}
          >
            <ReceiverAddress disabled hiddenBtn={true} />
          </Form.Item>

          <Form.Item
            {...formItemLayout}
            label={DeliveryTime}
            name="deliveryStartEndTime"
            initialValue={[moment('08:00', 'HH:mm'), moment('12:00', 'HH:mm')]}
            rules={[{ required: true, message: `${translate('web.common.qingxuanze')}${DeliveryTime}` }]}
          >
            <TimePicker.RangePicker className="timePicker-range-separate" format="HH:mm" style={{ width: '100%' }} />
          </Form.Item>
        </BaseInfo>
        <BaseInfo className="mt-16" title={DeliveryGood.label} id={DeliveryGood.key} cols={1}>
          <DeliveryGoodTableSelect
            value={tableDataSource}
            title={`${translate('web.common.select')}${DeliveryGood.label}`}
            disabled={!!planData}
            form={form}
            onChange={(value) => {
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
                  consigneeId: ft[0].consigneeId,
                  fullAddress: `${ft[0].provinceName}${ft[0].cityName}${ft[0].districtName}${ft[0].streetName}${ft[0].address}`,
                }
                form.setFieldsValue({
                  receivingAddress: addr,
                })
              }
              console.log(value)
              setTableDataSource(value)
              changeTableSource(ft)
            }}
          />
          <HarvestMaterialContextProvider
            value={{
              dataSource: tableDataSourceContext,
            }}
          >
            <Table rowKey={(row) => row.orderNo} columns={columns} dataSource={tableDataSourceContext} />
          </HarvestMaterialContextProvider>
        </BaseInfo>
        <BaseInfo className="mt-16" title={Remarks.label} id={Remarks.key} cols={1}>
          <Form.Item
            labelCol={{ span: 0 }}
            wrapperCol={{ span: 24 }}
            name="remark"
            rules={[{ validator: (rule, value, callback) => validatorByte(rule, value, callback, 600) }]}
          >
            <Input.TextArea
              rows={6}
              maxLength={300}
              placeholder={translate('web.common.tip_byteLengthLimit', { byteNum: '600', chineseNum: '300' })}
            />
          </Form.Item>
        </BaseInfo>
        {/* {
          type === PAGE_TYPE.EDIT && (
            <BaseInfo className='mt-16' title={ExternalRoamRecord.name} id={ExternalRoamRecord.key} cols={1}>
              <Table
                rowKey={'id'}
                dataSource={historyData}
                columns={ExternalRoamRecordTableColumn}
                pagination={false}
              />
            </BaseInfo>
          )
        } */}
      </Form>
    </PageHeaderWrapper>
  )
}

export default DeliveryNoticeManagementAwaitB2BDetails
