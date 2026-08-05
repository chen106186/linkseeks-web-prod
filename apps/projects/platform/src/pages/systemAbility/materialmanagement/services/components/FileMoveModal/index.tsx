import React, { useRef, useState } from 'react'
import { message, Modal } from 'antd'
import { useWebIntl } from '@apps/locales'
import { useMaterialContext } from '../../context'
import { StandardTree, TreeContextProps } from '@apps/components'
import { useMemoizedFn } from '@linkseeks/hooks'
import { postManageMaterialLibraryMoveFilesAcrossDir } from '@apps/apis'

interface IProps {}

const FileMoveModal: React.FC<IProps> = () => {
  const { treeRef, refreshData, moveModalVisible, selectMaterialList, updateMaterial, setMoveModalVisible } =
    useMaterialContext()
  const translate = useWebIntl()
  const moveTreeRef = useRef<TreeContextProps>({} as any)
  const [selectNode, setSelectNode] = useState<any>()

  const handleClick = useMemoizedFn(async (node) => {
    setSelectNode(node)
  })

  const handleConfirmMove = () => {
    if (selectNode) {
      if (selectMaterialList && selectMaterialList.data && selectMaterialList.data.length > 0) {
        const selectList = selectMaterialList.data.filter((item) => item['cheboxUrl'])
        const param = {
          moveIdList: selectList.map((item) => item.id),
          targetId: selectNode.id,
        }
        postManageMaterialLibraryMoveFilesAcrossDir(param).then((res) => {
          if (res.code === 1000) {
            setMoveModalVisible(false)
            if (treeRef.current.selectNode?.id) {
              updateMaterial(String(treeRef.current.selectNode.id))
            }
          }
        })
      }
    } else {
      message.info(translate('web.resource.system.qingxuanzeyaoyidongdemulu'))
    }
  }

  return (
    <Modal
      open={moveModalVisible}
      title={translate('web.resource.system.xuanzemubiaolujing')}
      width={450}
      onOk={handleConfirmMove}
      onCancel={() => {
        setMoveModalVisible(false)
      }}
    >
      <StandardTree
        request={() => refreshData()}
        height="60vh"
        enableSearch
        searchPlaceholder={translate('web.resource.system.sousuowenjianjia')}
        treeRef={moveTreeRef}
        handleNodeClick={handleClick}
      />
    </Modal>
  )
}

export default FileMoveModal
