import React from 'react'
import CustomTag from '@/pages/procurement/components/customTag'
import { formatTimeString } from '@/utils'
import { FileFilled } from '@ant-design/icons'
import { ISchema } from '@apps/formily'
import { BidInOpeartTexts, BidInStateTexts, BidOutOpeartTexts, BidOutStateTexts } from '@/constants/procurement'
import { getIntl } from '@linkseeks/i18n'
import { getWebIntl } from '@apps/locales'
const intl = getIntl()
const translate = getWebIntl()
export const anchorTitleList = [
  {
    title: intl.formatMessage({ id: 'table.purchase.liuzhuanjindu' }),
    id: 'transferProcess',
    componentName: 'TransferProcess',
  },
  { title: intl.formatMessage({ id: 'table.purchase.jibenxinxi' }), id: 'baseicInfo', type: 'basicInfo' },
  { title: intl.formatMessage({ id: 'table.purchase.pingbiaoyaoqiu' }), id: 'remarkNeed', type: 'remarkNeed' },
  // { title: intl.formatMessage({ id: 'table.purchase.pingbiaobaogao' }), id: 'remarkBidReport', componentName: "RemarkBidReport" },
  {
    title: intl.formatMessage({ id: 'table.purchase.zhuanjiachouqulie' }),
    id: 'extractExpertList',
    componentName: 'ExtractExpertList',
  },
  {
    title: intl.formatMessage({ id: 'table.purchase.pingbiaojilu' }),
    id: 'remarkBidRecord',
    componentName: 'RemarkBidRecord',
  },
  {
    title: intl.formatMessage({ id: 'table.purchase.tuijianzhongbiaohui' }),
    id: 'recommandBidMember',
    componentName: 'RecommandBidMember',
  },
  {
    title: intl.formatMessage({ id: 'table.purchase.pingbiaofujian' }),
    id: 'remarkBidFiles',
    componentName: 'RemarkBidFiles',
  },
  {
    title: intl.formatMessage({ id: 'table.purchase.liuzhuanjilu' }),
    id: 'transferRecord',
    componentName: 'BidTransformRecord',
  },
]

// 基本信息
export const basicColumnList = [
  {
    span: 8,
    fieldList: [
      { title: intl.formatMessage({ id: 'table.purchase.numbering' }), name: 'code' },
      // { title: intl.formatMessage({ id: 'table.purchase.waibuzhuangtai' }), name: 'inviteTenderOutStatusValue', render: (text) => BidOutStateTexts[text]},
      // { title: intl.formatMessage({ id: 'table.purchase.innerStatus' }), name: 'inviteTenderInStatusValue', render: (text) => BidInStateTexts[text] },
      { title: intl.formatMessage({ id: 'table.purchase.waibuzhuangtai' }), name: 'inviteTenderOutStatusValue' },
      { title: intl.formatMessage({ id: 'table.purchase.innerStatus' }), name: 'inviteTenderInStatusValue' },
      {
        title: intl.formatMessage({ id: 'table.purchase.bidCreateTime' }),
        name: 'createTime',
        render: (text) => formatTimeString(text),
      },
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
]

// 评标要求
export const evaluationColumnList = [
  {
    span: 8,
    fieldList: [
      {
        title: intl.formatMessage({ id: 'table.purchase.pingbiaoyaoqiushi' }),
        name: 'createTime',
        render: (t, r) =>
          formatTimeString(r['evaluationStartTime']) +
          translate('web.common.zhi') +
          formatTimeString(r['evaluationEndTime']),
      },
      { title: intl.formatMessage({ id: 'table.purchase.pingbiaoyaoqiu' }), name: 'evaluationRequirement' },
    ],
  },
  {
    span: 8,
    fieldList: [
      {
        title: intl.formatMessage({ id: 'table.purchase.pingbiaoyaoqiufu' }),
        name: 'evaluationFile',
        render: (t, r) => (
          <div>
            {t.map((_item, _i) => (
              <p>
                <a key={`evaluationFile${_i}`} target="_blank" href={_item.url}>
                  <FileFilled /> {_item.name}
                </a>
              </p>
            ))}
          </div>
        ),
      },
    ],
  },
  {
    span: 8,
    fieldList: [
      {
        title: intl.formatMessage({ id: 'table.purchase.shifouzaixianping' }),
        name: 'isOnlineEvaluation',
        render: (text) =>
          text ? intl.formatMessage({ id: 'table.purchase.shi' }) : intl.formatMessage({ id: 'table.purchase.fou' }),
      },
      { title: intl.formatMessage({ id: 'table.purchase.pingbiaoxiangmuban' }), name: 'templateName' },
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

// 新增推荐会员schema
export const addRecommandMemberSchema: ISchema = {
  type: 'object',
  properties: {
    NO_SUBMIT: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelAlign: 'top',
      },
      properties: {
        memberName: {
          type: 'string',
          title: intl.formatMessage({ id: 'table.purchase.tuijianzhongbiaohui' }),
          required: true,
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'table.purchase.shurutuijianzhong' }),
          },
        },
        userName: {
          type: 'string',
          title: intl.formatMessage({ id: 'table.purchase.tuijianren' }),
          required: true,
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'table.purchase.shurutuijianren' }),
          },
        },
        reason: {
          type: 'textarea',
          'x-component-props': {
            rows: 4,
            placeholder: intl.formatMessage({ id: 'table.purchase.zaicishuruni100' }),
          },
          title: intl.formatMessage({ id: 'table.purchase.tuijianzhongbiaoli' }),
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({ id: 'table.purchase.qingshuruliyou' }),
            },
            {
              limitByte: true,
              maxByte: 100,
            },
          ],
        },
      },
    },
  },
}
