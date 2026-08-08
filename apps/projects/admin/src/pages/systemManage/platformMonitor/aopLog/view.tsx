import { AuthButton, EyeAuthButton, Loading, PageHeaderWrapper, StandardFormTable } from '@apps/components'
import { Button, Card, Radio, Tabs } from '@linkseeks/ui'
import { ReactNode, useMemo, useRef, useState } from 'react'
import { getSupportAopLogGetServiceModule, getSupportAopLogGetSource } from '@apps/apis'
import { useRequestApi } from '@linkseeks/hooks'
import { useAopLog } from '@apps/services'

const View = () => {
  const { data, loading } = useRequestApi(getSupportAopLogGetServiceModule)
  const [sourceState, setSrouceState] = useState('')
  const { data: sourceData } = useRequestApi(getSupportAopLogGetSource, {
    onSuccess(data) {
      if (data.code === 1000 && sourceState === '') {
        setSrouceState(data.data?.[0].value || '')
        actionRef.current.reload()
      }
    },
  })
  const { fetchAopLogList, columns } = useAopLog({ sourceState })

  const actionRef = useRef<any>(null)

  return (
    <PageHeaderWrapper
      extra={
        <Radio.Group
          buttonStyle="solid"
          onChange={(e) => {
            setSrouceState(e.target.value)
            actionRef.current.reload()
          }}
          value={sourceState}
        >
          {sourceData?.map((v) => (
            <Radio.Button key={v.value} value={v.value} disabled={v.disabled}>
              {v.label}
            </Radio.Button>
          ))}
        </Radio.Group>
      }
    >
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
