import React from 'react'
import TableLayout from '@/components/TableLayout'
import { ColumnType } from 'antd/lib/table/interface'
import {
  createTime,
  digest,
  endTime,
  operation,
  outerStatusName,
  qualityNo,
  receiveNo,
  startTime,
  qualityTypeName,
  vendorMemberName,
} from '../../columns'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { Link } from '@linkseeks/router-core'
import { history } from '@linkseeks/router-manager'
import { getOrderQualityGetQualityOrderPage } from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'
import { customAuthUrl as AuthUrl } from '@apps/domains'
import { AuthButton } from '@apps/components'

const QualityManageSearchTable: React.FC<{}> = () => {
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
      ...vendorMemberName,
    },
    {
      ...createTime,
    },
    {
      ...outerStatusName,
    },
    {
      ...operation,
      render: (_text, record) => (
        <AuthButton type="edit" code="detail">
          {record?.generate && (
            <Link to={`edit?id=${record?.id}`}>
              {intl.formatMessage({ id: 'quality.shouhouchuli', defaultMessage: '售后处理' })}
            </Link>
          )}
        </AuthButton>
      ),
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
              vendorMemberName: {
                type: 'string',
                'x-component-props': {
                  placeholder: intl.formatMessage({ id: 'quality.gongyingshang', defaultMessage: '供应商' }),
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
              outerStatus: {
                type: 'string',
                'x-component-props': {
                  placeholder: intl.formatMessage({ id: 'quality.neibuzhuangtai', defaultMessage: '内部状态' }),
                },
                enum: [
                  { label: intl.formatMessage({ id: 'quality.zhijianzhong', defaultMessage: '质检中' }), value: 1 },
                  {
                    label: intl.formatMessage({ id: 'quality.zhijianwancheng', defaultMessage: '质检完成' }),
                    value: 2,
                  },
                  {
                    label: intl.formatMessage({
                      id: 'quality.yishengchengshouhoudan',
                      defaultMessage: '已生成售后单',
                    }),
                    value: 3,
                  },
                ],
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
      fetch={getOrderQualityGetQualityOrderPage}
    />
  )
}
export default QualityManageSearchTable
