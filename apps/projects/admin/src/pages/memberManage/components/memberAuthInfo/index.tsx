import React, { useRef, useCallback, useMemo, useState } from 'react'
import { Button, Card, Tabs, Checkbox, Row, Col, Tooltip } from '@linkseeks/ui'
import { SyncIcon, PackupIcon } from '@linkseeks/icons'
import { LineTitle, StandardTree } from '@apps/components'
import { useLocation, useQuery } from '@linkseeks/router-core'
import useAuthInfoTree from '../../services/hooks/useAuthInfoTree'
import { PageStatus, usePageStatus } from '@/hooks/usePageStatus'

const RoleAuthTree = () => {
  const { id, validateId } = useQuery()
  const { isDetail } = usePageStatus()
  const idRef = useRef<any[]>([])
  const menuDataRef = useRef<any>({})

  const setIds = (ids: any[]) => {
    idRef.current = ids
  }

  const setMenuData = (hashTreeData: any) => {
    menuDataRef.current = hashTreeData
  }
  const { refreshData, treeRef, loading, handleSubmit } = useAuthInfoTree({
    id,
    validateId,
    setIds,
    setMenuData,
    idRef,
    menuDataRef,
  })
  const { pageStatus } = usePageStatus()
  /**
   * 当有勾选状态变更时触发
   */
  const handleCheckChange = async (checkList) => {
    setIds(checkList)
    setMenuData(treeRef.current.menuUtil.hashTreeData)
  }

  const renderHeadTools = () => {
    const refresh = () => {
      treeRef.current.refreshTreeData()
    }

    const handleExpandAll = () => {
      treeRef.current.handleExpandAll()
    }
    return (
      <>
        <Tooltip title="刷新">
          <Button type="normal" style={{ marginLeft: 16 }} onClick={refresh} icon={<SyncIcon size={16} />}></Button>
        </Tooltip>
        <Tooltip title="收缩">
          <Button
            type="normal"
            style={{ marginLeft: 16 }}
            onClick={handleExpandAll}
            icon={<PackupIcon size={16} />}
          ></Button>
        </Tooltip>
        <Button
          size="small"
          style={{ marginLeft: 16 }}
          type="primary"
          loading={loading}
          onClick={handleSubmit}
          // disabled={isDetail}
        >
          提交
        </Button>
      </>
    )
  }

  return (
    <StandardTree
      request={refreshData}
      height="70vh"
      treeRef={treeRef}
      title="菜单选择"
      checkable
      // disableAction={true}
      onCheckChange={handleCheckChange}
      headTools={renderHeadTools}
      // disabled={isDetail}
    ></StandardTree>
  )
}

export default RoleAuthTree
