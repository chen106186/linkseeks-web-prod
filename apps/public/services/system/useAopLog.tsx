import { getSupportAopLogGetSystemAopLogPageList } from '@apps/apis'
import { RecordColumns } from '@apps/components'
import { useMemo } from 'react'
import { useMemoizedFn } from '@linkseeks/hooks'
import { Button, Modal } from '@linkseeks/ui'
import { useWebIntl } from '@apps/locales'

/**
 * 获取审计日志
 */
export const useAopLog = ({ sourceState }) => {
  const translate = useWebIntl()

  const isControlSelf = useMemo(() => {
    // 当前运行环境是平台后台，且此时要查看能力中心的数据，则多显示一些字段
    if (process.env.OUT_SOURCE === '99' && sourceState === '1') {
      return true
    } else {
      return false
    }
  }, [sourceState])
  const fetchAopLogList = useMemoizedFn(async (params) => {
    if (sourceState === '') {
      return []
    }
    const payload = {
      ...params,
      source: sourceState,
    }
    const result = await getSupportAopLogGetSystemAopLogPageList(payload)
    return result
  })

  const defaultColumns: any[] = [
    { key: 'operate', title: translate('web.common.control'), searchField: { type: 'Input' } },
    {
      key: 'operateTime',
      title: translate('web.common.controlTime'),
      format: 'Date',
      searchField: {
        type: 'DateRange',
        name: ['startDateTime', 'endDateTime'],
        placeholder: [translate('web.common.controlStartTime'), translate('web.common.controlEndTime')],
        showTime: true,
      },
    },
    isControlSelf && {
      key: 'memberId',
      title: translate('web.resource.system.caozuorenguishuhuiyuanid'),
    },
    isControlSelf && {
      key: 'memberName',
      title: translate('web.resource.system.caozuorenguishuhuiyuanmingcheng'),
      searchField: {
        type: 'Input',
        placeholder: translate('web.resource.system.qingshuruguishuhuiyuanmingcheng'),
      },
    },
    { key: 'userId', title: translate('web.resource.system.caozuyonghuid') },
    {
      key: 'userName',
      title: translate('web.resource.system.caozuoyonghu'),
      searchField: { main: true, name: 'memberAccount' },
    },
    { key: 'memberRoleName', title: translate('web.resource.system.caozuoyonghujuese') },
    { key: 'ipAddress', title: translate('web.resource.system.qingqiuip'), searchField: { type: 'Input' } },
    {
      key: 'isSuccess',
      title: translate('web.resource.system.shifouchenggong'),
      render: (value) => (value ? translate('web.common.shi') : translate('web.common.fou')),
    },
    {
      key: 'requestParam',
      title: translate('web.resource.system.qinggqiucanshu'),
      render: (value) => (
        <Button
          type="link"
          onClick={() => {
            handleOpenParam(value)
          }}
        >
          {value}
        </Button>
      ),
    },
    {
      key: 'responseParam',
      title: translate('web.resource.system.xiangyingcanshu'),
      render: (value) => (
        <Button
          type="link"
          onClick={() => {
            handleOpenParam(value)
          }}
        >
          {value}
        </Button>
      ),
    },
  ].filter(Boolean)

  const handleOpenParam = useMemoizedFn((value) => {
    Modal.info({
      title: translate('web.resource.system.canshuchakan'),
      content: <code>{value}</code>,
    })
  })

  return {
    fetchAopLogList,
    columns: defaultColumns,
  }
}
