import React, { memo, useCallback } from 'react'
import { isEqual } from 'lodash'
import { changeProps, clearHovered, PageConfigType, ROOT, STATE_PROPS } from '@apps/design-core'
import ReactSortable from './components/ReactSortable'
import SortTree from './SortTree'
import styles from './index.less'
import { useSelector } from '../../hooks/useSelector'

interface ModuleTreeCollapseProps {
  className?: string
  /** 是否过滤掉根节点 */
  isFilterRoot?: boolean
}

const ModuleTreeCollapse: React.FC<ModuleTreeCollapseProps> = (props: ModuleTreeCollapseProps) => {
  const { isFilterRoot = true } = props
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
  const { className } = props

  /**
   * 拖拽排序
   * @param sortKeys
   * @param evt
   * @param props
   */
  // const layoutSortChange = () => {

  // };

  const childNodes = !isFilterRoot ? [ROOT] : pageConfig[ROOT].childNodes

  const handleEnd = (evt, ref) => {
    const parentKey = ROOT
    changeProps({
      treeKey: parentKey,
      props: pageConfig[parentKey].props,
      childNodes: ref.toArray(),
    })
  }

  return (
    <div onMouseLeave={onMouseLeave} className={`${styles['sort-container']} ${className}`}>
      <ReactSortable
        options={{
          group: {
            name: `nested`,
          },
          animation: 200,
          dataIdAttr: 'data-id',
          // ghostClass: styles['item-background'],
          handle: '.drag_item',
          swapThreshold: 0.5,
        }}
        onMoveEnd={handleEnd}
      >
        <SortTree childNodes={childNodes as any} specialProps={{ key: ROOT }} />
      </ReactSortable>
    </div>
  )
}

export default memo(ModuleTreeCollapse)
