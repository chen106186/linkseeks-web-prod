import React, { useEffect } from 'react'
import CustomTag from '@/pages/procurement/components/customTag'
import { BidInOpeartTexts, BidOutOpeartTexts } from '@/constants/procurement'
import { formatTimeString } from '@/utils'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()

export const anchorTitleList = [
  {
    title: intl.formatMessage({ id: 'table.purchase.liuzhuanjindu' }),
    id: 'transferProcess',
    componentName: 'TransferProcess',
  },
  { title: intl.formatMessage({ id: 'table.purchase.jibenxinxi' }), id: 'baseicInfo', type: 'basicInfo' },
  {
    title: intl.formatMessage({ id: 'table.purchase.pingbiaobaogao' }),
    id: 'remarkBidReport',
    componentName: 'RemarkBidReport',
  },
  {
    title: intl.formatMessage({ id: 'table.purchase.huiyuancanbiaoxin' }),
    id: 'participateInfo',
    componentName: 'ParticipateInfo',
  },
  {
    title: intl.formatMessage({ id: 'table.purchase.zhaobiaodingbiao' }),
    id: 'bidConfirm',
    componentName: 'BidConfirm',
  },
  {
    title: intl.formatMessage({ id: 'table.purchase.liuzhuanjilu' }),
    id: 'transferRecord',
    componentName: 'BidTransformRecord',
  },
]

export const outReocrdCols: any[] = [
  {
    title: intl.formatMessage({ id: 'detail.purchase.label50' }),
    dataIndex: 'no',
    align: 'center',
    key: 'no',
    render: (_, __, index: number) => index + 1,
  },
  {
    title: intl.formatMessage({ id: 'detail.purchase.label51' }),
    dataIndex: 'memberRoleName',
    align: 'center',
    key: 'memberRoleName',
  },
  {
    title: intl.formatMessage({ id: 'table.purchase.zhuangtai' }),
    dataIndex: 'statusValue',
    align: 'center',
    key: 'statusValue',
    render: (text, r) => <CustomTag text={text} color={r.statusColor} />,
  },
  {
    title: intl.formatMessage({ id: 'table.purchase.caozuo' }),
    dataIndex: 'operationValue',
    align: 'center',
    key: 'operationValue',
  },
  {
    title: intl.formatMessage({ id: 'detail.purchase.label52' }),
    dataIndex: 'createTime',
    align: 'center',
    key: 'createTime',
    render: (time) => formatTimeString(time),
  },
  {
    title: intl.formatMessage({ id: 'detail.purchase.auditOpinion' }),
    dataIndex: 'checkRemark',
    align: 'center',
    key: 'checkRemark',
  },
]

export const insideRecordCols: any[] = [
  {
    title: intl.formatMessage({ id: 'table.purchase.liuzhuanjilu' }),
    dataIndex: 'no',
    align: 'center',
    key: 'no',
    render: (_, __, index: number) => index + 1,
  },
  {
    title: intl.formatMessage({ id: 'detail.purchase.roleName' }),
    dataIndex: 'memberRoleName',
    align: 'center',
    key: 'memberRoleName',
  },
  {
    title: intl.formatMessage({ id: 'detail.purchase.department2' }),
    dataIndex: 'userOrgName',
    align: 'center',
    key: 'userOrgName',
  },
  {
    title: intl.formatMessage({ id: 'table.purchase.zhiwei' }),
    dataIndex: 'userJobTitle',
    align: 'center',
    key: 'userJobTitle',
  },
  {
    title: intl.formatMessage({ id: 'table.purchase.zhuangtai' }),
    dataIndex: 'statusValue',
    align: 'center',
    key: 'statusValue',
    render: (text, r) => <CustomTag text={text} color={r.statusColor} />,
  },
  {
    title: intl.formatMessage({ id: 'table.purchase.caozuo' }),
    dataIndex: 'operationValue',
    align: 'center',
    key: 'operationValue',
  },
  {
    title: intl.formatMessage({ id: 'detail.purchase.label52' }),
    dataIndex: 'createTime',
    align: 'center',
    key: 'createTime',
    render: (text) => formatTimeString(text),
  },
  {
    title: intl.formatMessage({ id: 'detail.purchase.auditOpinion' }),
    dataIndex: 'checkRemark',
    align: 'center',
    key: 'checkRemark',
  },
]

// 提交弹框schema
export const submitSchema = {
  type: 'object',
  properties: {
    NO_SUBMIT: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelAlign: 'top',
      },
      properties: {
        checkStatus: {
          type: 'radio',
          title: intl.formatMessage({ id: 'table.purchase.shifoushenhetong' }),
          enum: [
            { label: intl.formatMessage({ id: 'detail.purchase.message86' }), value: true },
            { label: intl.formatMessage({ id: 'detail.purchase.message87' }), value: false },
          ],
          // required: true,
          default: true,
          'x-linkages': [
            {
              type: 'value:visible',
              target: 'checkRemark',
              condition: '{{$value === false}}',
            },
          ],
        },
        checkRemark: {
          type: 'textarea',
          'x-component-props': {
            rows: 4,
            placeholder: intl.formatMessage({ id: 'table.purchase.zaicishuruni60' }),
          },
          title: intl.formatMessage({ id: 'detail.purchase.message84' }),
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({ id: 'table.purchase.qingshuruyuanyin' }),
            },
            {
              limitByte: true,
              maxByte: 60,
            },
          ],
        },
      },
    },
  },
}
