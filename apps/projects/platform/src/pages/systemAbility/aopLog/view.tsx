import { AuthButton, EyeAuthButton, Loading, PageHeaderWrapper, StandardFormTable } from '@apps/components'
import { Button, Card, Radio, Tabs } from '@linkseeks/ui'
import { ReactNode, useMemo, useRef, useState } from 'react'
import { getSupportAopLogGetServiceModule, getSupportAopLogGetSource } from '@apps/apis'
import { useRequestApi } from '@linkseeks/hooks'
import { useAopLog } from '@apps/services'

/**
 * 能力中心的审计日志，只需要查询能力中心的
 */
const View = () => {
  const { data, loading } = useRequestApi(getSupportAopLogGetServiceModule)

  // 默认传1，是能力中心的
  const { fetchAopLogList, columns } = useAopLog({ sourceState: 1 })

  const actionRef = useRef<any>(null)

  return (
    <PageHeaderWrapper>
      <StandardFormTable
        loading={loading}
        type="tabs"
        columns={columns}
        tabsKey="serviceModule"
        tabsItems={data!}
        actionRef={actionRef}
        request={fetchAopLogList}
        rowKey="operateTime"
      />
    </PageHeaderWrapper>
  )
}

export default View
