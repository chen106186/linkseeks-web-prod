import { useEffect, useState } from 'react'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { Link, usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import { formatTimeString } from '@/utils'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { PlayCircleOutlined, PoweroffOutlined } from '@ant-design/icons'
import CustomTag from '@/pages/procurement/components/customTag'
import CustomBadge from '@/pages/procurement/components/customBadge'
import { CALLFORBID_TYPE, PURCHASE_TYPE } from '@/constants/procurement'
import {
  getPurchaseInviteTenderGetInviteTenderInStatus,
  getPurchaseInviteTenderGetInviteTenderOutStatus,
  getPurchaseInviteTenderGetSubmitTenderOutStatus,
  getPurchaseSubmitTenderGetInviteTenderInStatus,
  getPurchaseSubmitTenderGetInviteTenderOutStatus,
  getPurchaseSubmitTenderGetSubmitTenderInStatus,
  getPurchaseSubmitTenderGetSubmitTenderOutStatus,
} from '@apps/apis'
const intl = getIntl()

/** 工具: 按属性归类 */
export const groupBy = (objectArray: any[], property: string) => {
  return objectArray.reduce(function (acc: { [x: string]: any[] }, obj: { [x: string]: any }) {
    var key = obj[property]
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(obj)
    return acc
  }, {})
}

/** 根据招投标流程api返回的字段 处理成组件需要的状态数据格式 */
export const processLogResponses = (resData) => {
  const { currentInnerStep, currentOuterStep, externalTasks } = resData
  const externalLogs = externalTasks.map((item) => ({
    id: item.taskStep,
    name: item.taskName,
    operationRole: item.memberRoleName,
    isActive: currentOuterStep === 0 ? true : item.taskStep <= currentOuterStep,
  }))
  const subTasks = externalTasks.filter((item) => item.taskStep === currentOuterStep)
  const interiorLogs = subTasks.length
    ? subTasks[0]['subTasks'].map((item) => ({
        id: item.taskStep,
        name: item.taskName,
        operationRole: item.userRoleName,
        isActive: currentInnerStep === 0 ? true : item.taskStep < currentInnerStep,
      }))
    : null
  return {
    interiorLogs,
    externalLogs,
  }
}

// 招投标内部状态
export const insideStatusText = [
  '待提交审核',
  '审核通过',
  '报名审核通过',
  '资格预审审核通过',
  '待开标',
  '待评标',
  '待提交审核定标',
  '定标审核通过(二级)',
  '完成招标',
  '已废标',
]

// 招投标外部状态
export const outStatusText = [
  '待提交招标',
  '待平台审核招标',
  '待招标报名',
  '待资格预审',
  '待开标',
  '待评标',
  '待定标',
  '待中标公示',
  '完成招标',
  '已废标',
]

// 评标中的环节状态
export const remarkProcessStatus = [
  '未报名',
  '已评标',
  '未评标',
  '未报名',
  '未报价',
  '报名审核未通过',
  '资格审核未通过',
]

// 招标表格基本列
export const baseBidListColumns: any[] = [
  {
    title: intl.formatMessage({ id: 'table.purchase.code' }),
    align: 'left',
    dataIndex: 'code',
    key: 'code',
    render: (text, record) => {
      const { pathname } = useLocation()
      return (
        <>
          <EyeAuthButton url={`${pathname}/detail?id=${record.id}`}>{text}</EyeAuthButton>
          <div>{record['projectName']}</div>
        </>
      )
    },
  },
  {
    title: intl.formatMessage({ id: 'table.purchase.purchaseType' }),
    align: 'left',
    dataIndex: 'purchaseType',
    key: 'purchaseType',
    render: (t) => PURCHASE_TYPE[t],
  },
  {
    title: intl.formatMessage({ id: 'table.purchase.zhaobiaofangshi' }),
    align: 'left',
    dataIndex: 'inviteTenderType',
    key: 'inviteTenderType',
    render: (t) => CALLFORBID_TYPE[t],
  },
  {
    title: intl.formatMessage({ id: 'table.purchase.fabushijian' }),
    align: 'left',
    dataIndex: 'createTime',
    key: 'createTime',
    render: (text, record) => formatTimeString(record.createTime),
    width: 200,
  },
  {
    title: intl.formatMessage({ id: 'table.purchase.inviteTenderStartTime' }),
    align: 'left',
    dataIndex: 'createTime',
    key: 'createTime',
    render: (text, record) => (
      <>
        <div>
          <PlayCircleOutlined />
          &nbsp;{formatTimeString(record.inviteTenderStartTime)}
        </div>
        <div>
          <PoweroffOutlined />
          &nbsp;{formatTimeString(record.inviteTenderEndTime)}
        </div>
      </>
    ),
    width: 200,
  },
  {
    title: intl.formatMessage({ id: 'table.purchase.waibuzhuangtai' }),
    align: 'left',
    dataIndex: 'inviteTenderOutStatusValue',
    key: 'inviteTenderOutStatusValue',
    render: (text, r) => <CustomTag text={text} color={r.inviteTenderOutStatusColor} />,
  },
  {
    title: intl.formatMessage({ id: 'table.purchase.neibuzhuangtai' }),
    align: 'left',
    dataIndex: 'inviteTenderInStatusValue',
    key: 'inviteTenderInStatusValue',
    render: (text, r) => <CustomBadge text={text} color={r.inviteTenderInStatusColor} />,
  },
]

// 投标表格基本列
export const baseTenderListColumns: any[] = [
  {
    title: intl.formatMessage({ id: 'table.purchase.tendeCode' }),
    align: 'left',
    dataIndex: 'id',
    key: 'id',
    render: (text, record) => (
      <>
        {record.code ? (
          <EyeAuthButton url={`/procurementAbility/tender/tenderSearch/detail?id=${record.id}`}>
            {record.code}
          </EyeAuthButton>
        ) : null}
        <div>{record.inviteTender.projectName}</div>
      </>
    ),
  },
  {
    title: intl.formatMessage({ id: 'table.purchase.inviteTender' }),
    align: 'left',
    dataIndex: 'memberId',
    key: 'memberId',
    render: (text, record) => (
      <>
        <EyeAuthButton url={`/procurementAbility/tender/callForBidsSearch/detail?id=${record.inviteTender.id}`}>
          {record.inviteTender.code}
        </EyeAuthButton>
        <div>{record.inviteTender.memberName}</div>
      </>
    ),
  },
  {
    title: intl.formatMessage({ id: 'table.purchase.inviteTenderStartTime' }),
    align: 'left',
    dataIndex: 'inviteTender',
    key: 'inviteTender',
    render: (text, record) => (
      <>
        <div>
          <PlayCircleOutlined />
          &nbsp;{formatTimeString(record.inviteTender.inviteTenderStartTime)}
        </div>
        <div>
          <PoweroffOutlined />
          &nbsp;{formatTimeString(record.inviteTender.inviteTenderEndTime)}
        </div>
      </>
    ),
    width: 200,
  },
  {
    title: intl.formatMessage({ id: 'table.purchase.waibuzhuangtai' }),
    align: 'left',
    dataIndex: 'submitTenderOutStatusValue',
    key: 'submitTenderOutStatusValue',
    render: (text, r) => <CustomTag text={text} color={r.submitTenderOutStatusColor} />,
  },
  {
    title: intl.formatMessage({ id: 'table.purchase.neibuzhuangtai' }),
    align: 'left',
    dataIndex: 'submitTenderInStatusValue',
    key: 'submitTenderInStatusValue',
    render: (text, r) => <CustomBadge text={text} color={r.submitTenderInStatusColor} />,
  },
]

/** 获取高级筛选状态 */

interface IState {
  code: number
  message: string
}

/** 招标管理 */
/** 招标 招标查询 内部状态 */
export const getInviteTenderInStatus = () => {
  const [state, setstate] = useState<IState[]>([])

  useEffect(() => {
    getPurchaseInviteTenderGetInviteTenderInStatus({}).then((res) => {
      const { code, data } = res
      if (code === 1000) {
        setstate(data)
      }
    })
  }, [])

  return state
}

/** 招标 招标查询 外部状态 */
export const getInviteTenderOutStatus = () => {
  const [state, setstate] = useState<IState[]>([])

  useEffect(() => {
    getPurchaseInviteTenderGetInviteTenderOutStatus({}).then((res) => {
      const { code, data } = res
      if (code === 1000) {
        setstate(data)
      }
    })
  }, [])

  return state
}

/** 招标 投标查询 外部状态 */
export const getInviteSubmitTenderOutStatus = () => {
  const [state, setstate] = useState<IState[]>([])

  useEffect(() => {
    getPurchaseInviteTenderGetSubmitTenderOutStatus({}).then((res) => {
      const { code, data } = res
      if (code === 1000) {
        setstate(data)
      }
    })
  }, [])

  return state
}

/** 投标管理 */
/** 投标 招标查询 内部状态 */
export const getSubmitInviteTenderInStatus = () => {
  const [state, setstate] = useState<IState[]>([])

  useEffect(() => {
    getPurchaseSubmitTenderGetInviteTenderInStatus({}).then((res) => {
      const { code, data } = res
      if (code === 1000) {
        setstate(data)
      }
    })
  }, [])

  return state
}

/** 投标 招标查询 外部状态 */
export const getSubmitInviteTenderOutStatus = () => {
  const [state, setstate] = useState<IState[]>([])

  useEffect(() => {
    getPurchaseSubmitTenderGetInviteTenderOutStatus({}).then((res) => {
      const { code, data } = res
      if (code === 1000) {
        setstate(data)
      }
    })
  }, [])

  return state
}

/** 投标 投标查询 内部状态 */
export const getSubmitSubmitTenderInStatus = () => {
  const [state, setstate] = useState<IState[]>([])

  useEffect(() => {
    getPurchaseSubmitTenderGetSubmitTenderInStatus({}).then((res) => {
      const { code, data } = res
      if (code === 1000) {
        setstate(data)
      }
    })
  }, [])

  return state
}

/** 投标 投标查询 外部状态 */
export const getSubmitSubmitTenderOutStatus = () => {
  const [state, setstate] = useState<IState[]>([])

  useEffect(() => {
    getPurchaseSubmitTenderGetSubmitTenderOutStatus({}).then((res) => {
      const { code, data } = res
      if (code === 1000) {
        setstate(data)
      }
    })
  }, [])

  return state
}
