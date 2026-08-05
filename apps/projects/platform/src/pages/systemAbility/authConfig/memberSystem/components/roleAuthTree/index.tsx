import React, { useRef, useCallback, useMemo, useState } from 'react'
import { Button, Card, Tabs, Checkbox, Row, Col, Tooltip } from '@linkseeks/ui'
import { SyncIcon, PackupIcon } from '@linkseeks/icons'
import { LineTitle, StandardTree } from '@apps/components'
import { useLocation, useQuery } from '@linkseeks/router-core'
import useMemberMenu from '../../services/hooks/useRoleAuthTree'
import { useRoleAuthTreeContext } from '../../services/contexts'
import { PageStatus, usePageStatus } from '@/hooks/usePageStatus'
import { useWebIntl } from '@apps/locales'

const RoleAuthTree = () => {
  const { id } = useQuery()

  const { setIds, setMenuData } = useRoleAuthTreeContext()
  const { refreshData, treeRef } = useMemberMenu({ id })
  const { pageStatus } = usePageStatus()
  const translate = useWebIntl()
  const handleNodeClick = (node) => {
    console.log(node)
  }
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
        <Tooltip title={translate('web.common.refresh')}>
          <Button type="normal" style={{ marginLeft: 16 }} onClick={refresh} icon={<SyncIcon size={16} />}></Button>
        </Tooltip>
        <Tooltip title={translate('web.common.shrink')}>
          <Button
            type="normal"
            style={{ marginLeft: 16 }}
            onClick={handleExpandAll}
            icon={<PackupIcon size={16} />}
          ></Button>
        </Tooltip>
      </>
    )
  }

  return (
    <StandardTree
      request={refreshData}
      handleNodeClick={handleNodeClick}
      height="70vh"
      treeRef={treeRef}
      title="菜单选择"
      checkable
      disableAction={true}
      onCheckChange={handleCheckChange}
      headTools={renderHeadTools}
      disabled={pageStatus === PageStatus.PREVIEW}
    ></StandardTree>
  )
}

export default RoleAuthTree
