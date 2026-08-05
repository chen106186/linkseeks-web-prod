import React from 'react'
import TableLayout from '@/components/TableLayout'
import { ColumnType } from 'antd/lib/table/interface'
import {
  createTime,
  digest,
  endTime,
  outerStatusName,
  qualityNo,
  receiveNo,
  startTime,
  qualityTypeName,
  buyerMemberName,
} from '../../columns'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link } from '@linkseeks/router-core'
import { getOrderQualityCollaborateGetQualityOrderCollaboratePage } from '@apps/apis'
import { customAuthUrl as AuthUrl } from '@apps/domains'

const QualitySynergySearchTable: React.FC<{}> = () => {
  const intl = getIntl()
  const columns: ColumnType<any>[] = [
    {
      ...qualityNo,
      render: (_text, record) => (AuthUrl('detail') ? <Link to={`detail?id=${record?.id}`}>{_text}</Link> : _text),
    },
    {
      ...digest,
    },
    {
      ...startTime,
    },
    {
      ...endTime,
    },
    {
      ...qualityTypeName,
    },
    {
      ...receiveNo,
    },
    {
      ...buyerMemberName,
    },
    {
      ...createTime,
    },
    {
      ...outerStatusName,
    },
  ]

  return (
    <TableLayout
      columns={columns}
      effects="qualityNo"
      schema={{
        type: 'object',
        properties: {
          megalayout: {
            type: 'object',
            'x-component': 'mega-layout',
            properties: {
              qualityNo: {
                type: 'string',
                'x-component': 'Search',
                'x-mega-props': {},
                'x-component-props': {
                  placeholder: intl.formatMessage({ id: 'quality.zhijiandanhao', defaultMessage: '质检单号' }),
                  align: 'flex-left',
                },
              },
            },
          },
          [FORM_FILTER_PATH]: {
            type: 'object',
            'x-component': 'flex-layout',
            'x-component-props': {
              rowStyle: {
                justifyContent: 'flex-start',
                flexWrap: 'nowrap',
              },
              colStyle: {
                //改变间隔
                marginRight: 20,
              },
            },
            properties: {
              digest: {
                type: 'string',
                'x-component-props': {
                  placeholder: intl.formatMessage({
                    id: 'quality.zhijiandanzhaiyao',
                    defaultMessage: '质检单摘要',
                  }),
                },
              },
              buyerMemberName: {
                type: 'string',
                'x-component-props': {
                  placeholder: intl.formatMessage({ id: 'quality.caigoushang', defaultMessage: '采购商' }),
                },
              },
              '[startTime,endTime]': {
                type: 'string',
                'x-component': 'DateRangePickerUnix',
                'x-component-props': {
                  placeholder: [
                    intl.formatMessage({ id: 'quality.zhijiankaishishijian', defaultMessage: '质检开始时间' }),
                    intl.formatMessage({ id: 'quality.zhijianjieshushijian', defaultMessage: '质检结束时间' }),
                  ],
                  showTime: false,
                  format: 'YYYY-MM-DD',
                },
              },
              sumbit: {
                'x-component': 'Submit',
                'x-mega-props': {
                  span: 1,
                },
                'x-component-props': {
                  children: intl.formatMessage({ id: 'quality.chaxun', defaultMessage: '查询' }),
                },
              },
            },
          },
        },
      }}
      fetch={getOrderQualityCollaborateGetQualityOrderCollaboratePage}
    />
  )
}
export default QualitySynergySearchTable
