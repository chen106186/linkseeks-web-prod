import React, { useRef, useCallback, useMemo, useState } from 'react'
import { Button, Card, Tabs, Checkbox, Row, Col, Tooltip } from '@linkseeks/ui'
import { SyncIcon, PackupIcon } from '@linkseeks/icons'
import { LineTitle, StandardTree } from '@apps/components'
import { useLocation, useQuery } from '@linkseeks/router-core'
import { useRequest, useResetState } from '@linkseeks/hooks'
import style from '../index.less'
import '../index.global.less'
import useMemberMenu from '../services/hooks/useMemberMenu'
import { useMemberAuthContext } from '../services/contexts'

const TabMenu = ({ source }) => {
  const { id } = useQuery()

  const { setIds, setMenuData } = useMemberAuthContext()
  const { refreshData, treeRef } = useMemberMenu({ id, source })

  const request = async () => {
    const { data } = await refreshData()

    setIds(data)
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
      disableAction={true}
      onCheckChange={handleCheckChange}
      headTools={renderHeadTools}
    ></StandardTree>
  )
}

export default TabMenu
