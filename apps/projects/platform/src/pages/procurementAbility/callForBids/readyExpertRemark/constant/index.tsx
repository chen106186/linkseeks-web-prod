import React from 'react'
import CustomTag from '@/pages/procurement/components/customTag'
import { formatTimeString } from '@/utils'
import { FileFilled, QuestionCircleOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'
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
  {
    title: intl.formatMessage({ id: 'table.purchase.pingbiaobaogao' }),
    id: 'remarkBidReport',
    componentName: 'RemarkBidReport',
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

// 评标要去
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

/** 生成在线评标表格
 * memeberList: 投标会员列表
 * contentList: 评标细则内容列表
 */
export const generateRemarkTable = (memeberList, contentList) => {
  // 初始列
  const columns: any[] = [
    {
      title: intl.formatMessage({ id: 'detail.purchase.memberId' }),
      dataIndex: 'memberId',
      key: 'memberId',
      className: 'commonHide',
    },
    { title: intl.formatMessage({ id: 'table.purchase.pingbiaohuiyuan' }), dataIndex: 'memberName', key: 'memberName' },
    { title: intl.formatMessage({ id: 'table.purchase.zongjidefen' }), dataIndex: 'totalScore', key: 'totalScore' },
    {
      title: intl.formatMessage({ id: 'table.purchase.pingbiaofenlei' }),
      dataIndex: 'sort',
      key: 'sort',
      className: 'commonHide',
    },
  ]

  // 新增字段以 字符term+细则id组合而成
  contentList.map((item) => {
    columns.push({
      title: (
        <>
          {`${item.term}(${item.standardScore}分)`}
          <Tooltip title={item.standard}>
            <QuestionCircleOutlined />
          </Tooltip>
        </>
      ),
      realTitle: item.term,
      dataIndex: `score_${item.id}`,
      key: `score_${item.id}`,
      align: 'center',
      formItem: 'input',
      editable: true,
      width: 140,
    })
  })

  const dataSource: any[] = []

  memeberList.map((item) => {
    let dataItem = { memberId: item.memberId, memberName: item.memberName }
    contentList
      .map((_) => `score_${_.id}`)
      .map((_) => {
        dataItem[_] = null
        return dataItem
      })
    dataSource.push(dataItem)
  })

  return {
    columns,
    dataSource,
  }
}
