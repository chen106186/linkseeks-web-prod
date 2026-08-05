import { Radio } from 'antd'
import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'

import { getIntl } from '@linkseeks/i18n'

export const TableMemberColumn = [
  {
    title: '',
    render: (t, r) => {
      return <Radio value={r} />
    },
  },
  {
    title: getIntl().formatMessage({ id: 'member.memberVisitManage.index', defaultMessage: '序号' }),
    dataIndex: 'index',
    width: '10%',
    render: (_, record, index) => index + 1,
  },
  {
    title: getIntl().formatMessage({ id: 'member.memberVisitManage.fullName', defaultMessage: '姓名' }),
    dataIndex: 'name',
  },
  {
    title: getIntl().formatMessage({ id: 'member.memberVisitManage.phoneNumber', defaultMessage: '手机号' }),
    dataIndex: 'phone',
  },
  {
    title: getIntl().formatMessage({ id: 'member.memberVisitManage.orgName', defaultMessage: '所属机构' }),
    dataIndex: 'orgName',
  },
  {
    title: getIntl().formatMessage({ id: 'member.memberVisitManage.job', defaultMessage: '职位' }),
    dataIndex: 'jobTitle',
  },
]

export const querySchema: ISchema = {
  type: 'object',
  properties: {
    MEGA_LAYOUT: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        grid: true,
        columns: 1,
      },
      properties: {
        name: {
          type: 'string',
          'x-mega-props': {
            wrapperCol: 12,
          },
          'x-component': 'Search',
          'x-component-props': {
            placeholder: getIntl().formatMessage({
              id: 'member.memberVisitManage.fullName.placeholder',
              defaultMessage: '搜索',
            }),
            align: 'flex-left',
            tip: getIntl().formatMessage({
              id: 'member.memberVisitManage.fullName.tip',
              defaultMessage: '输入 姓名 进行搜索',
            }),
          },
        },
        [FORM_FILTER_PATH]: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            grid: true,
            full: true,
            autoRow: true,
            columns: 6,
          },
          properties: {
            org: {
              type: 'string',
              'x-component-props': {
                placeholder: getIntl().formatMessage({
                  id: 'member.memberVisitManage.orgName',
                  defaultMessage: '所属机构',
                }),
                allowClear: true,
              },
            },
            jobTitle: {
              type: 'string',
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'member.memberVisitManage.job', defaultMessage: '职位' }),
                allowClear: true,
              },
            },
            submit: {
              'x-component': 'Submit',
              'x-mega-props': {
                span: 1,
              },
              'x-component-props': {
                children: getIntl().formatMessage({ id: 'common.button.search', defaultMessage: '查询' }),
              },
            },
          },
        },
      },
    },
  },
}
