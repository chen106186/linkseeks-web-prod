import React, { useEffect, useState } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { history } from '@linkseeks/router-manager'
import { useQuery, useLocation } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { formatTimeString } from '@/utils'
import { Steps, Tag, Table, Form, Button } from 'antd'
import BaseInfo from '@/components/BaseInfo/BaseInfo'
import { getProductSampleDeliverVendorDetail, postProductSampleDeliverVendorConfirmSend } from '@apps/apis'
import { outerStatusColor } from '../common/commonData'
import FlowRecordModal from '../components/FlowRecordModal'
import type { DetailInfoType } from '../common/commomType'
import { sampleColumns, materialColumns, productColumns, recordColumns } from '../common/commonColumns'
import ConfirmForm from '../components/ConfirmForm'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton } from '@apps/components'
import { getLogisticsReceiverAddressList } from '@apps/apis'
import { authService } from '@apps/services'

const { BaseInfoItem } = BaseInfo

const { name: currentName, account: currentPhone } = authService.getAuth()

const radioValueList = [
  { text: '确认寄样', value: 1 },
  { text: '拒绝', value: 0 },
]
const ConfirmInfo: React.FC = () => {
  const { id } = useQuery()
  const { pathname } = useLocation()
  const intl = useIntl()
  const [form] = Form.useForm()
  const [details, setDetails] = useState<DetailInfoType>()
  const [radioValue, setRadioValue] = useState(1)
  const [loading, setLoading] = useState(false)

  const getDetail = async () => {
    const { code, data } = await getProductSampleDeliverVendorDetail({ id: id as string })
    if (code === 1000) {
      setDetails(data)
    }
  }
  const anchorsArr = [
    {
      key: 'flowProgress',
      label: intl.formatMessage({
        id: 'customerAbility.songyang.detail.anchor_1',
        defaultMessage: '流转进度',
      }),
    },
    {
      key: 'basicInfo',
      label: intl.formatMessage({
        id: 'customerAbility.songyang.detail.anchor_2',
        defaultMessage: '基本信息',
      }),
    },
    {
      key: 'sampleInfo',
      label: intl.formatMessage({
        id: 'customerAbility.songyang.detail.anchor_3',
        defaultMessage: '送样信息',
      }),
    },
    {
      key: 'sampleMaterials',
      label:
        details?.scenes == 1
          ? intl.formatMessage({
              id: 'customerAbility.songyang.detail.anchor_4',
              defaultMessage: '送样商品',
            })
          : intl.formatMessage({
              id: 'customerAbility.songyang.detail.anchor_5',
              defaultMessage: '送样物料',
            }),
    },
    {
      key: 'sampleConfirm',
      label: intl.formatMessage({
        id: 'customerAbility.songyang.detail.anchor_8',
        defaultMessage: '寄样确认',
      }),
    },
  ]

  const getDefaultAddress = async () => {
    const { data } = await getLogisticsReceiverAddressList({ isStore: 0 })
    form.setFieldsValue({ address: data?.length > 0 ? data[0] : {} })
  }

  useEffect(() => {
    if (id) {
      getDetail()
      getDefaultAddress()
    }
  }, [])

  const onChangeRadio = (v) => {
    const {
      target: { value },
    } = v
    setRadioValue(value)
  }

  // 收货地址列表接口
  const getAddressListApi = async () => {
    return await getLogisticsReceiverAddressList({ isStore: 0 })
  }

  const onSubmit = () => {
    form.validateFields().then(
      (
        values: {
          [x: string]: any
          attachmentsData?: any
          address?: any
          estimatedDeliveryTime?: any
        },
        error: any,
      ) => {
        if (error) {
          return
        }
        setLoading(true)
        let params = {}
        if (radioValue == 1) {
          const { attachmentsData = {}, address = {}, estimatedDeliveryTime = '', ...rest } = values
          const attachments =
            attachmentsData?.fileList?.length > 0
              ? attachmentsData?.fileList?.map((item) => ({
                  name: item.name,
                  url: item?.url || item?.response?.data,
                }))
              : []
          params = {
            id,
            attachments,
            receiverName: address?.name || address?.receiverName,
            fullAddress: address?.fullAddress,
            receiverPhone: address?.phone,
            estimatedDeliveryTime: formatTimeString(estimatedDeliveryTime, 'YYYY-MM-DD'),
            ...rest,
          }
        } else {
          params = { id, ...values }
        }
        postProductSampleDeliverVendorConfirmSend(params)
          .then((res) => {
            if (res.code == 1000) {
              history.goBack()
            }
          })
          .finally(() => {
            setLoading(false)
          })
      },
    )
  }

  return (
    <PageHeaderWrapper
      title={`${details?.summary || ''} | ${details?.deliveryNo || ''}`}
      onBack={() => history.goBack()}
      items={anchorsArr}
      extra={
        // <AuthButton type="custom" code="submit">
        <Button loading={loading} type="primary" onClick={onSubmit}>
          {intl.formatMessage({
            id: 'customerAbility.songyang.btn.submit',
            defaultMessage: '提交',
          })}
        </Button>
        // </AuthButton>
      }
    >
      {/* 流转进度 */}
      <BaseInfo
        className="mt-0"
        title={anchorsArr[0].name}
        id={anchorsArr[0].key}
        cols={1}
        subtitle={<FlowRecordModal columns={recordColumns} dataSource={details?.outerHistories || []} />}
      >
        <Steps
          progressDot
          current={
            details?.simpleProcessDefVO?.currentStep == 0
              ? details?.simpleProcessDefVO?.tasks?.length - 1
              : details?.simpleProcessDefVO?.currentStep - 2
          }
        >
          {details?.simpleProcessDefVO?.tasks?.length > 0 &&
            details?.simpleProcessDefVO?.tasks.map((item) => (
              <Steps.Step key={item.properties.oper} title={item.properties.oper} description={item.roleName} />
            ))}
        </Steps>
      </BaseInfo>
      {/* 基本信息 */}
      <BaseInfo className="mt-16" title={anchorsArr[1].name} id={anchorsArr[1].key}>
        <BaseInfoItem
          label={intl.formatMessage({
            id: 'customerAbility.songyang.title_2',
            defaultMessage: '送样需求单摘要',
          })}
        >
          {details?.summary}
        </BaseInfoItem>
        <BaseInfoItem
          label={intl.formatMessage({
            id: 'customerAbility.songyang.title_3',
            defaultMessage: '需求日期',
          })}
        >
          {details?.demandDate}
        </BaseInfoItem>
        <BaseInfoItem
          label={intl.formatMessage({
            id: 'customerAbility.songyang.title_1',
            defaultMessage: '送样需求单号',
          })}
        >
          {details?.deliveryNo}
        </BaseInfoItem>
        <BaseInfoItem
          label={intl.formatMessage({
            id: 'customerAbility.songyang.title_buyers',
            defaultMessage: '采购商',
          })}
        >
          {details?.buyerMemberName}
        </BaseInfoItem>
        <BaseInfoItem
          label={intl.formatMessage({
            id: 'customerAbility.songyang.title_4',
            defaultMessage: '送样类型',
          })}
        >
          {details?.typeName}
        </BaseInfoItem>
        <BaseInfoItem
          label={intl.formatMessage({
            id: 'customerAbility.songyang.title_5',
            defaultMessage: '紧急程度',
          })}
        >
          {details?.emergencyLevelName}
        </BaseInfoItem>
        <BaseInfoItem
          label={intl.formatMessage({
            id: 'customerAbility.songyang.title_9',
            defaultMessage: '外部状态',
          })}
        >
          <Tag
            color={
              outerStatusColor.hasOwnProperty(details?.outerStatus) ? outerStatusColor[details?.outerStatus] : 'default'
            }
          >
            {details?.outerStatusName}
          </Tag>
        </BaseInfoItem>
      </BaseInfo>
      {/* 送样信息 */}
      <BaseInfo className="mt-16" title={anchorsArr[2].name} id={anchorsArr[2].key}>
        <BaseInfoItem
          label={intl.formatMessage({
            id: 'customerAbility.songyang.detail.label.receiver',
            defaultMessage: '接收人',
          })}
        >
          {details?.receiver}
        </BaseInfoItem>
        <BaseInfoItem
          label={intl.formatMessage({
            id: 'customerAbility.songyang.detail.label.address',
            defaultMessage: '送样地址',
          })}
        >
          <div>
            {details?.receiverName && <span>{details?.receiverName}/</span>}
            <span>{details?.receiverPhone}</span>
          </div>
          {details?.address}
        </BaseInfoItem>
        <BaseInfoItem
          label={intl.formatMessage({
            id: 'customerAbility.songyang.detail.label.receiveDepartment',
            defaultMessage: '接收部门',
          })}
        >
          {details?.receiveDepartment}
        </BaseInfoItem>
        <BaseInfoItem
          label={intl.formatMessage({
            id: 'customerAbility.songyang.detail.label.remark',
            defaultMessage: '备注',
          })}
        >
          {details?.remark}
        </BaseInfoItem>
        <BaseInfoItem
          label={intl.formatMessage({
            id: 'customerAbility.songyang.detail.label.phone',
            defaultMessage: '联系电话',
          })}
        >
          {details?.phone}
        </BaseInfoItem>
      </BaseInfo>
      {/* 送样物料 */}
      <BaseInfo className="mt-16" title={anchorsArr[3].name} id={anchorsArr[3].key} cols={1}>
        <Table
          columns={[...(details?.scenes == 1 ? productColumns : materialColumns), ...sampleColumns]}
          dataSource={details?.products}
          scroll={{ x: 1200 }}
        />
      </BaseInfo>
      <BaseInfo cols={1} className="mt-16" title={anchorsArr[4].name} id={anchorsArr[4].key}>
        <ConfirmForm
          onChangeRadio={onChangeRadio}
          form={form}
          radioValueList={radioValueList}
          radioValue={radioValue}
          getAddressListApi={getAddressListApi}
          initialValues={{ agree: 1, name: currentName, phone: currentPhone }}
        />
      </BaseInfo>
    </PageHeaderWrapper>
  )
}

export default ConfirmInfo
