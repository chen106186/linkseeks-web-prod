import { StandardTree, LineCard } from '@apps/components'
import { Button } from '@linkseeks/ui'
import style from './index.less'
import { EditFillIcon, PlusFillIcon } from '@linkseeks/icons'
import MenuFormModal from '../menuFormModal'
import ButtonList from '../buttonList'
import { useMenuContext, MenuTabProvider } from '../../services/context'
import ButtonModal from '../buttonModal'
import useNodeClick from '../../services/hooks/useNodeClick'
import useNodeDrag from '../../services/hooks/useNodeDrag'
import useNodeTools from '../../services/hooks/useNodeTools'
const TabMenu = () => {
  const contextValues = useMenuContext()
  const { treeRef, formRef } = contextValues
  const { handleClick } = useNodeClick()
  const { onAllowDrop, onDragDrop } = useNodeDrag()
  const { renderTools, renderHeadTools } = useNodeTools()

  return (
    <StandardTree
      request={contextValues.requestTreeData}
      handleNodeClick={handleClick}
      height="70vh"
      treeRef={treeRef}
      title="菜单选择"
      onAllowDrop={onAllowDrop}
      onDragDrop={onDragDrop}
      renderTools={renderTools}
      headTools={renderHeadTools}
    >
      {/* 按钮模块设置 */}
      <LineCard
        className={style['config']}
        headExtra={
          <Button
            type="normal"
            // 只有菜单这里有选中，并且选中的菜单没有子菜单了才可以编辑按钮
            disabled={!(treeRef.current.selectNode && !treeRef.current.selectNode.children)}
            onClick={(e) => {
              contextValues.handleButtonToggle('add')
            }}
            icon={<PlusFillIcon size={16} />}
            size={'small'}
          ></Button>
        }
        headTitle="按钮/模块设置"
      >
        <ButtonList />
        <ButtonModal />
      </LineCard>
      <MenuFormModal ref={formRef} />
    </StandardTree>
  )
}

export default ({ source }) => (
  <MenuTabProvider source={source}>
    <TabMenu />
  </MenuTabProvider>
)
