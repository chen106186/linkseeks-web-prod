import React, { useEffect, useState } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { history } from '@linkseeks/router-manager'
import { useQuery } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import BaseInfo from '@/components/BaseInfo/BaseInfo'
import { Steps, Tag, Table } from 'antd'
import { getProductSampleDeliverVendorDetail } from '@apps/apis'
import { outerStatusColor } from '../common/commonData'
import FlowRecordModal from '../components/FlowRecordModal'
import FileItem from '../components/FileItem'
import type { DetailInfoType } from '../common/commomType'
import { sampleColumns, materialColumns, productColumns, recordColumns } from '../common/commonColumns'

const { BaseInfoItem } = BaseInfo

const RequestSheetDetails: React.FC = () => {
  const { id } = useQuery()
  const intl = useIntl()
  const [details, setDetails] = useState<DetailInfoType>()

  const getDetail = async () => {
    const { code, data } = await getProductSampleDeliverVendorDetail({ id: id as string })
    if (code === 1000) {
      const { logisticsInfos = [] } = data
      let sendInfo = {}
      let returnInfo = {}
      logisticsInfos.forEach((item) => {
        if (item.type == 1) {
          sendInfo = item
        } else {
          returnInfo = item
        }
      })
      setDetails({ ...data, sendInfo, returnInfo })
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
      key: 'sendingSampleInfo',
      label: intl.formatMessage({
        id: 'customerAbility.songyang.detail.anchor_6',
        defaultMessage: '寄样信息',
      }),
    },
    {
      key: 'returnSampleInfo',
      label: intl.formatMessage({
        id: 'customerAbility.songyang.detail.anchor_7',
        defaultMessage: '退样信息',
      }),
    },
  ]

  useEffect(() => {
    if (id) getDetail()
  }, [])

  return (
    <PageHeaderWrapper
      title={`${details?.summary || ''} | ${details?.deliveryNo || ''}`}
      onBack={() => history.goBack()}
      items={anchorsArr}
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
              <Steps.Step key={item.taskStep} title={item.properties.oper} description={item.roleName} />
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
      {/* 寄样信息 */}
      <BaseInfo className="mt-16" title={anchorsArr[4].name} id={anchorsArr[4].key}>
        <BaseInfoItem
          label={intl.formatMessage({
            id: 'customerAbility.songyang.detail.label.sender',
            defaultMessage: '寄样人',
          })}
        >
          {details?.sendInfo?.name}
        </BaseInfoItem>
        <BaseInfoItem
          label={intl.formatMessage({
            id: 'customerAbility.songyang.detail.label.sendAddress',
            defaultMessage: '退样地址',
          })}
        >
          <div>
            {details?.sendInfo?.receiverName && <span>{details?.sendInfo?.receiverName}/</span>}
            <span>{details?.sendInfo?.receiverPhone}</span>
          </div>
          {details?.sendInfo?.fullAddress}
        </BaseInfoItem>
        <BaseInfoItem
          label={intl.formatMessage({
            id: 'customerAbility.songyang.detail.label.phone',
            defaultMessage: '联系电话',
          })}
        >
          {details?.sendInfo?.phone}
        </BaseInfoItem>
        <BaseInfoItem
          label={intl.formatMessage({
            id: 'customerAbility.songyang.detail.label.remark',
            defaultMessage: '备注',
          })}
        >
          {details?.sendInfo?.remark}
        </BaseInfoItem>
        <BaseInfoItem
          label={intl.formatMessage({
            id: 'customerAbility.songyang.detail.label.estimatedDeliveryTime',
            defaultMessage: '预计送达时间',
          })}
        >
          {details?.sendInfo?.estimatedDeliveryTime}
        </BaseInfoItem>
        <BaseInfoItem
          label={intl.formatMessage({
            id: 'customerAbility.songyang.detail.label.logisticsNo',
            defaultMessage: '物流单号',
          })}
        >
          {details?.sendInfo?.logisticsNo}
        </BaseInfoItem>
        <BaseInfoItem
          label={intl.formatMessage({
            id: 'customerAbility.songyang.detail.label.file',
            defaultMessage: '附件',
          })}
        >
          {details?.sendInfo?.attachments?.length > 0 &&
            details?.sendInfo?.attachments.map((item) => <FileItem key={item.name} value={item} />)}
        </BaseInfoItem>
      </BaseInfo>
      {/* 退样信息 */}
      <BaseInfo className="mt-16" title={anchorsArr[5].name} id={anchorsArr[5].key}>
        <BaseInfoItem
          label={intl.formatMessage({
            id: 'customerAbility.songyang.detail.label.returnName',
            defaultMessage: '退样人',
          })}
        >
          {details?.returnInfo?.name}
        </BaseInfoItem>
        <BaseInfoItem
          label={intl.formatMessage({
            id: 'customerAbility.songyang.detail.label.logisticsNo',
            defaultMessage: '物流单号',
          })}
        >
          {details?.returnInfo?.logisticsNo}
        </BaseInfoItem>
        <BaseInfoItem
          label={intl.formatMessage({
            id: 'customerAbility.songyang.detail.label.phone',
            defaultMessage: '联系电话',
          })}
        >
          {details?.returnInfo?.phone}
        </BaseInfoItem>
        <BaseInfoItem
          label={intl.formatMessage({
            id: 'customerAbility.songyang.detail.label.remark',
            defaultMessage: '备注',
          })}
        >
          {details?.returnInfo?.remark}
        </BaseInfoItem>
        <BaseInfoItem
          label={intl.formatMessage({
            id: 'customerAbility.songyang.detail.label.estimatedReturnTime',
            defaultMessage: '预计退样时间',
          })}
        >
          {details?.returnInfo?.estimatedDeliveryTime}
        </BaseInfoItem>
        <BaseInfoItem
          label={intl.formatMessage({
            id: 'customerAbility.songyang.detail.label.file',
            defaultMessage: '附件',
          })}
        >
          {details?.returnInfo?.attachments?.length > 0 &&
            details?.returnInfo?.attachments.map((item) => <FileItem key={item.name} value={item} />)}
        </BaseInfoItem>
      </BaseInfo>
    </PageHeaderWrapper>
  )
}

export default RequestSheetDetails
