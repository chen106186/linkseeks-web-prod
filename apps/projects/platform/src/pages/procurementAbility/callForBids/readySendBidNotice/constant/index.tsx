import React from 'react'
import CustomTag from '@/pages/procurement/components/customTag'
import { formatTimeString } from '@/utils'
import { ISchema } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'
import { FILE_PREFIX_ENUM } from '@apps/constants'
const intl = getIntl()

export const anchorTitleList = [
  {
    title: intl.formatMessage({ id: 'table.purchase.liuzhuanjindu' }),
    id: 'transferProcess',
    componentName: 'TransferProcess',
  },
  { title: intl.formatMessage({ id: 'table.purchase.jibenxinxi' }), id: 'baseicInfo', type: 'basicInfo' },
  {
    title: intl.formatMessage({ id: 'table.purchase.huiyuanzhongbiaoxin' }),
    id: 'memberWinInfo',
    componentName: 'MemberWinInfo',
  },
  {
    title: intl.formatMessage({ id: 'table.purchase.liuzhuanjilu' }),
    id: 'transferRecord',
    componentName: 'BidTransformRecord',
  },
]

export const dataIdList = [
  {
    title: intl.formatMessage({ id: 'detail.purchase.awardResults' }),
    idName: 'bidNotice',
  },
  {
    title: intl.formatMessage({ id: 'detail.purchase.bidLayout1' }),
    idName: 'bidMessage',
  },
  {
    title: intl.formatMessage({ id: 'detail.purchase.thanks' }),
    idName: 'thankLetter',
  },
]

// 基本信息
export const basicColumnList = [
  {
    span: 8,
    fieldList: [
      { title: intl.formatMessage({ id: 'table.purchase.numbering' }), name: 'code' },
      { title: intl.formatMessage({ id: 'table.purchase.waibuzhuangtai' }), name: 'inviteTenderOutStatusValue' },
      { title: intl.formatMessage({ id: 'table.purchase.innerStatus' }), name: 'inviteTenderInStatusValue' },
    ],
  },
  {
    span: 8,
    fieldList: [
      { title: intl.formatMessage({ id: 'table.purchase.projectName' }), name: 'projectName' },
      { title: intl.formatMessage({ id: 'table.purchase.zhaobiaohuiyuan' }), name: 'memberName' },
      { title: intl.formatMessage({ id: 'table.purchase.zhaobiaozhaiyao' }), name: 'remark' },
    ],
  },
  {
    span: 8,
    fieldList: [
      {
        title: intl.formatMessage({ id: 'table.purchase.bidCreateTime' }),
        name: 'createTime',
        render: (text) => formatTimeString(text),
      },
      {
        title: intl.formatMessage({ id: 'table.purchase.shiyongdizhi' }),
        name: 'inviteTenderAreaList',
        render: (t, r) => (
          <p>
            {t.map((_item, _i) => (
              <p key={`address${_i}`}>{_item.provinceName + '/' + (_item.cityName || '')}</p>
            ))}
          </p>
        ),
      },
    ],
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

// 发送中标公示
export const noticeSchema: ISchema = {
  type: 'object',
  properties: {
    Text_1: {
      type: 'object',
      'x-component': 'CustomTitle',
      'x-component-props': {
        text: intl.formatMessage({ id: 'detail.purchase.awardResults' }),
      },
      properties: {
        NO_SUBMIT_LAYOUT_1: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            labelAlign: 'top',
            full: true,
          },
          properties: {
            winTenderAnnounce: {
              type: 'string',
              'x-component-props': {
                children: intl.formatMessage({ id: 'table.purchase.fasongzhongbiaogong' }),
              },
              'x-component': 'checkboxsingle',
              default: true,
              required: true,
            },
            winTenderAnnounceContent: {
              type: 'textarea',
              title: '',
              required: true,
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'table.purchase.qingtianxiezhongbiao' }),
                rows: 4,
              },
            },
            winTenderAnnounceFile: {
              title: intl.formatMessage({ id: 'table.purchase.zhongbiaogongshifu' }),
              'x-component': 'FixUpload',
              'x-component-props': {
                action: '/api/support/file/upload/prefix',
                data: {
                  fileType: 1,
                  prefix: FILE_PREFIX_ENUM.PURCHASE_SERVICE,
                },
                beforeUpload: '{{beforeUpload}}',
                accept: '.xls, .xlsx, .doc, .docx, .wps, .pdf, .jpg, .png, .jpeg',
              },
              'x-rules': [
                {
                  required: false,
                  message: intl.formatMessage({ id: 'detail.purchase.message57' }),
                },
              ],
              // description: intl.formatMessage({ id: 'table.purchase.yicishangchuanyi' }),
            },
          },
        },
      },
    },
    Text_2: {
      type: 'object',
      'x-component': 'CustomTitle',
      'x-component-props': {
        text: intl.formatMessage({ id: 'detail.purchase.bidLayout1' }),
      },
      properties: {
        winTenderNotice: {
          type: 'string',
          'x-component-props': {
            children: intl.formatMessage({ id: 'table.purchase.fasongzhongbiaotong' }),
          },
          'x-component': 'checkboxsingle',
          default: true,
        },
        winTenderNoticeContent: {
          type: 'textarea',
          title: '',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'table.purchase.qingtianxiezhongbiao1' }),
            rows: 4,
          },
        },
        winTenderNoticeFile: {
          title: intl.formatMessage({ id: 'table.purchase.zhongbiaotongzhifu' }),
          'x-component': 'FixUpload',
          'x-component-props': {
            action: '/api/support/file/upload/prefix',
            data: {
              fileType: 1,
              prefix: FILE_PREFIX_ENUM.PURCHASE_SERVICE,
            },
            beforeUpload: '{{beforeUpload}}',
            accept: '.xls, .xlsx, .doc, .docx, .wps, .pdf, .jpg, .png, .jpeg',
          },
          'x-rules': [
            {
              required: false,
              message: intl.formatMessage({ id: 'detail.purchase.message57' }),
            },
          ],
          // description: intl.formatMessage({ id: 'table.purchase.yicishangchuanyi' }),
        },
      },
    },
    Text_3: {
      type: 'object',
      'x-component': 'CustomTitle',
      'x-component-props': {
        text: intl.formatMessage({ id: 'detail.purchase.thanks' }),
      },
      properties: {
        winTenderThanks: {
          type: 'string',
          'x-component-props': {
            children: intl.formatMessage({ id: 'table.purchase.fasongganxiehan' }),
          },
          'x-component': 'checkboxsingle',
          default: true,
        },
        winTenderThanksContent: {
          type: 'textarea',
          title: '',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'table.purchase.qingtianxieganxie' }),
            rows: 4,
          },
        },
      },
    },
  },
}
