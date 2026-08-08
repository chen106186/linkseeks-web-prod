import React, { memo, useCallback } from 'react'
import { clearHovered, PageConfigType, ROOT, STATE_PROPS } from '@apps/design-core'
import isEqual from 'lodash/isEqual'
import SortTree from './SortTree'
import styles from './index.less'
import { useSelector } from '../../hooks/useSelector'

interface BrickTreeProps {
  className?: string
  /** 是否过滤掉根节点 */
  isFilterRoot?: boolean
}

function ModuleTree(props: BrickTreeProps) {
  const { pageConfig } = useSelector<{ pageConfig: PageConfigType }, STATE_PROPS>(
    ['pageConfig'],
    (prevState, nextState) => {
      const {
        pageConfig: { [ROOT]: prevRoot },
      } = prevState
      const {
        pageConfig: { [ROOT]: root },
      } = nextState
      return !isEqual(prevRoot, root)
    },
  )

  const onMouseLeave = useCallback((e: any) => {
    e.stopPropagation()
    clearHovered()
  }, [])

  if (!pageConfig[ROOT]) return null
  const { className, isFilterRoot = true } = props

  const childNodes = !isFilterRoot ? [ROOT] : pageConfig[ROOT].childNodes

  return (
    <div onMouseLeave={onMouseLeave} className={`${styles['sort-container']} ${className}`}>
      <SortTree
        level={1}
        disabled={false}
        childNodes={childNodes as string[]}
        specialProps={{ key: ROOT, domTreeKeys: [], parentKey: '' }}
        componentName={''}
      />
    </div>
  )
}

export default memo(ModuleTree)
