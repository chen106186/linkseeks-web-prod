import { message } from 'antd'
import { ColumnType } from 'antd/lib/table'
import moment from 'moment'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { useQuery, useLocation } from '@linkseeks/router-core'
const intl = getIntl()

export const initBasicData = (message: any, isCoordination?: boolean) => {
  const { pathname } = useLocation()
  const unPageCoordination = pathname.indexOf('pageCoordination') === -1
  const basicDataDesc = [
    {
      col: [
        { label: '8D 编号', extra: message.eightDRectificationNo || '-' },
        { label: '摘要', extra: message.summary || '-' },
        { label: '来源单据', extra: message.qualityTypeName || '-' },
        { label: '来源单号', extra: message.orderNo || '-' },
        { label: 'ICA 要求日期', extra: message.icaReplyTime || '-' },
        { label: 'ICA 延期天数', extra: `${message.icaDelayTime}天` },
        { label: '外部状态', extra: message.outerStatusName || '-' },
      ],
    },
    {
      col: [
        { label: '来源类型', extra: message.sourceTypeName || '-' },
        {
          label: unPageCoordination ? '供应会员' : '采购会员',
          extra: unPageCoordination ? message.supplyMemberName : message.memberName || '-',
        },
        {
          label: message.orderType === 1 ? '物料信息' : '商品信息',
          extra: message.productDetail.name || message.productDetail.generalTerm || '-',
        },
        { label: '备注', extra: message.remark || '-' },
        { label: 'PCA 要求日期', extra: message.pcaReplyTime || '-' },
        { label: 'PCA 延期天数', extra: `${message.pcaDelayTime}天` },
      ],
    },
  ]
  // 8d协同部分隐藏内部状态
  !isCoordination && basicDataDesc[1].col.push({ label: '内部状态', extra: message.internalStatusName || '-' })
  return basicDataDesc
}

export const initProblemData = (message: any) => {
  const problemDataDesc = [
    {
      col: [
        { label: '检验方式', extra: message.inspectionTypName || '-' },
        { label: '质检数量', extra: message.qualityQuantity || '-' },
        { label: '不良品数量', extra: message.defectiveQuantity || '-' },
        { label: '不良率', extra: `${message.defectiveRate}%` || '-' },
      ],
    },
    {
      col: [
        { label: '问题紧急程度', extra: message.problemDegreeTypeName || '-' },
        { label: '检验结果', extra: message.batchJudgmentTypeName || '-' },
        { label: '问题描述', extra: message.problemDescription || '-' },
      ],
    },
  ]
  return problemDataDesc
}

// 临时遏制措施
export const temporaryColumnsDesc: any[] = [
  {
    title: '序号',
    render: (text, record, index) => {
      return index + 1
    },
  },
  {
    title: '检查环节',
    key: 'link',
    dataIndex: 'link',
  },
  {
    title: '质检数量',
    key: 'qualityQuantity',
    dataIndex: 'qualityQuantity',
  },
  {
    title: '不良品数量',
    key: 'defectiveQuantity',
    dataIndex: 'defectiveQuantity',
  },
  {
    title: '处理措施',
    key: 'treatmentMeasures',
    dataIndex: 'treatmentMeasures',
  },
  {
    title: '实施负责人',
    key: 'name',
    dataIndex: 'name',
  },
  {
    title: '要求完成日期',
    key: 'completionDate',
    dataIndex: 'completionDate',
  },
]

// 小组信息
export const groupColumnsDesc: any[] = [
  {
    title: '序号',
    render: (text, record, index) => {
      return index + 1
    },
  },
  {
    title: '代表方',
    key: 'roleType',
    dataIndex: 'roleType',
    render: (value) =>
      value == 1
        ? intl.formatMessage({ id: 'eightD.gongyingshang', defaultMessage: '供应商' })
        : intl.formatMessage({ id: 'eightD.caigoushang', defaultMessage: '采购商' }),
  },
  {
    title: '姓名',
    key: 'name',
    dataIndex: 'name',
  },
  {
    title: '部门',
    key: 'orgName',
    dataIndex: 'orgName',
  },
  {
    title: '职位',
    key: 'jobTitle',
    dataIndex: 'jobTitle',
  },
  {
    title: '电话',
    key: 'phone',
    dataIndex: 'phone',
  },
  {
    title: '邮箱',
    key: 'email',
    dataIndex: 'email',
  },
]

export const userListColumns = [
  {
    title: '姓名',
    dataIndex: 'name',
    align: 'center',
    width: 250,
  },
  {
    title: '部门',
    dataIndex: 'orgName',
    align: 'center',
    width: 100,
  },
  {
    title: '职位',
    dataIndex: 'jobTitle',
    align: 'center',
    width: 150,
  },
  {
    title: '电话',
    dataIndex: 'phone',
    align: 'center',
    width: 200,
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    align: 'center',
    width: 250,
  },
]

/**判断文件类型和大小 */
export const beforeDocUpload = (file: any) => {
  const isLt20M = file.size / 1024 / 1024 < 20
  if (!isLt20M) {
    message.error('文件规格不正确')
  }
  return isLt20M
}

export const verifyColumns = [
  {
    title: '序号',
    render: (text, record, index) => {
      return index + 1
    },
  },
  {
    title: '操作角色',
    key: 'roleName',
    dataIndex: 'roleName',
  },
  {
    title: '操作',
    key: 'operationName',
    dataIndex: 'operationName',
  },
  {
    title: '操作时间',
    key: 'createTime',
    dataIndex: 'createTime',
    render: (text, record, index) => {
      return moment(text || '').format('YYYY-MM-DD')
    },
  },
  {
    title: '审核意见',
    key: 'auditOpinion',
    dataIndex: 'auditOpinion',
  },
]

export const innerColumnsFront = [
  {
    title: '序号',
    render: (text, record, index) => {
      return index + 1
    },
  },
  {
    title: '操作人',
    key: 'roleName',
    dataIndex: 'roleName',
  },
  {
    title: '部门',
    key: 'department',
    dataIndex: 'department',
  },
  {
    title: '职位',
    key: 'position',
    dataIndex: 'position',
  },
]
export const innerColumnsAfter = [
  {
    title: '操作',
    key: 'operationName',
    dataIndex: 'operationName',
  },
  {
    title: '操作时间',
    key: 'createTime',
    dataIndex: 'createTime',
    render: (text, record, index) => {
      return moment(text || '').format('YYYY-MM-DD')
    },
  },
  {
    title: '审核意见',
    key: 'auditOpinion',
    dataIndex: 'auditOpinion',
  },
]

export const messageErr = (tips: string) => {
  message.error(tips)
}
