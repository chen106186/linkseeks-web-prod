import { useIntl } from '@linkseeks/i18n'
import React, { useEffect, useMemo, useState } from 'react'
import { Spin, Card } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import theme from '../../../../../config/lingxi.theme.config'
import useInitialValue from '@/hooks/useInitialValue'
import { getMemberSupplierInspectGet, GetMemberInspectGetResponse } from '@apps/apis'
import { usePageStatus } from '@/hooks/usePageStatus'
import CustomizeColumn from '@/components/CustomizeColumn'

interface Iprops {}

const InspectionDetail: React.FC<Iprops> = (props: Iprops) => {
  const { id } = usePageStatus()
  const params = useMemo(() => {
    return id ? { id: id.toString() } : null
  }, [id])
  const { loading, initialValue } = useInitialValue<GetMemberInspectGetResponse, { id: string }>(
    getMemberSupplierInspectGet,
    params,
  )

  const intl = useIntl()
  const anchorHeader = useMemo(
    () => [
      {
        key: 'basicInfo',
        label: `${intl.formatMessage({ id: 'member.memberInspection.common.schema.add.baseInfo' })}`,
      },
      {
        key: 'detail',
        label: `${intl.formatMessage({ id: 'member.memberInspection.common.schema.add.detail' })}`,
      },
    ],
    [],
  )

  const basicInfoColumns = useMemo(
    () => [
      {
        title: `${intl.formatMessage({ id: 'member.memberInspection.common.columns.index.investigateTopic' })}`,
        value: initialValue?.subject,
      },
      {
        title: `${intl.formatMessage({ id: 'member.memberInspection.common.columns.index.investigateDate' })}`,
        value: initialValue?.inspectDay,
      },
      {
        title: `${intl.formatMessage({ id: 'member.memberInspection.common.schema.add.appendix' })}`,
        value: (
          // 这里应该写一个组件
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {initialValue?.attachments.map((_row) => {
              return (
                <a style={{ marginBottom: '4px' }} key={_row.url} href={_row.url}>
                  {_row.name}
                </a>
              )
            })}
          </div>
        ),
      },
      {
        title: `${intl.formatMessage({ id: 'supplier.supplierInspection.common.columns.index.supplierName' })}`,
        value: initialValue?.name,
      },
      {
        title: `${intl.formatMessage({ id: 'supplier.supplierInspection.detail.supplierRepresent' })}`,
        span: 2,
        value: initialValue?.userName,
      },
      {
        title: `${intl.formatMessage({ id: 'member.memberInspection.common.columns.index.investigateType' })}`,
        value: initialValue?.inspectTypeName,
      },
      {
        title: `${intl.formatMessage({ id: 'member.memberInspection.common.schema.add.reason' })}`,
        span: 2,
        value: initialValue?.reason,
      },
    ],
    [initialValue],
  )

  const detailInfoColumns = useMemo(
    () => [
      {
        title: `${intl.formatMessage({ id: 'member.memberInspection.common.columns.index.investigateScore' })}`,
        value: initialValue?.score,
      },
      {
        title: `${intl.formatMessage({ id: 'member.memberInspection.common.schema.add.appendix' })}`,
        span: 2,
        value: (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {initialValue?.reports.map((_row) => {
              return (
                <a style={{ marginBottom: '4px' }} key={_row.url} href={_row.url}>
                  {_row.name}
                </a>
              )
            })}
          </div>
        ),
      },
      {
        title: `${intl.formatMessage({ id: 'member.memberInspection.common.columns.index.investigateResult' })}`,
        value: initialValue?.result,
      },
    ],
    [initialValue],
  )

  return (
    <Spin spinning={loading}>
      <PageHeaderWrapper
        title={`${intl.formatMessage({ id: 'member.memberInspection.common.columns.index.investigateTopic' })}: ${
          initialValue?.subject
        }`}
        items={anchorHeader}
      >
        <div style={{ margin: `${theme['@margin-md']} 0` }}>
          <CustomizeColumn
            id="basicInfo"
            data={basicInfoColumns}
            title={intl.formatMessage({ id: 'member.memberInspection.common.schema.add.baseInfo' })}
            column={3}
          />
        </div>
        <div id="detail" style={{ margin: `${theme['@margin-md']} 0` }}>
          <CustomizeColumn
            data={detailInfoColumns}
            title={intl.formatMessage({ id: 'member.memberInspection.common.schema.add.detail' })}
            column={3}
          />
        </div>
      </PageHeaderWrapper>
    </Spin>
  )
}

export default InspectionDetail
