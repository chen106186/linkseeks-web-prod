import React, { useEffect, useMemo } from 'react'
import { Popconfirm, Button, Card, Tooltip } from 'antd'
import TabTree, { createTreeActions } from '@/components/TabTree'
import { createFormActions, FormButtonGroup, Checkbox } from '@apps/formily'
import { classSchema } from './schema'
import { useTreeTabs } from '@/hooks/useTreeTabs'
import NiceForm from '@/components/NiceForm'
import type { GetManageContentCategoryAllResponse } from '@apps/apis'
import { AuthButton } from '@apps/components'
import {
  getManageContentCategoryAll,
  getManageContentCategoryGet,
  postManageContentCategoryAdd,
  postManageContentCategoryDelete,
  postManageContentCategoryUpdate,
} from '@apps/apis'
import styles from './index.less'
import { QuestionCircleOutlined } from '@ant-design/icons'

enum FormState {
  FREE, // 空闲状态
  EDIT, // 编辑状态
  ADD, // 新增状态
}

type TreeDataType = {
  id: number
  title: string
  children: TreeDataType[]
  key: string
  level: number
  parentId: number
}

/**
 * 递归改变数据结构
 * @param treeData
 * @param level
 * @returns
 */
const transferTreeData = (
  treeData: GetManageContentCategoryAllResponse,
  level: string,
  checkedKeys,
): TreeDataType[] => {
  const res: TreeDataType[] = []
  for (let i = 0; i < treeData.length; i++) {
    const item = treeData[i]
    const key = level + item.id
    const result: TreeDataType = {
      id: item.id,
      name: item.name,
      key: key,
      level: item.level,
      parentId: item.parentId,
      children: [],
    }
    if (item.status) {
      checkedKeys.push(key)
    }
    if (item.list.length !== 0) {
      result.children = transferTreeData(item.list as GetManageContentCategoryAllResponse, key + '-', checkedKeys)
    }
    res.push(result)
  }
  return res
}

const formActions = createFormActions()
const treeActions = createTreeActions()

const fetchClassTreeData = async (params?) => {
  const res = await getManageContentCategoryAll()
  return res
}

const ClassProperty: React.FC<{}> = () => {
  const {
    treeStatus,
    setTreeStatus,
    treeData,
    nodeRecord,
    setNodeRecord,
    handleSelect,
    getTreeMaps,
    resetMenu,
    toolsRender,
    handleDeleteMenu,
  } = useTreeTabs({
    treeActions,
    formActions,
    deleteMenu: postManageContentCategoryDelete,
    fetchMenuData: fetchClassTreeData,
    fetchItemDetailData: getManageContentCategoryGet,
  })
  const tempCheckedKeys = []
  const transferTreeDatarRes: TreeDataType[] = useMemo(
    () => transferTreeData(treeData, '', tempCheckedKeys),
    [treeData],
  )

  const formInitValue = nodeRecord && treeStatus === FormState.EDIT ? getTreeMaps(nodeRecord.key) : {}
  const formValue = formInitValue ? { ...formInitValue, status: [formInitValue.status] } : {}

  const is3Level = useMemo(() => {
    if (!nodeRecord || nodeRecord.parentId === 0) {
      return 1
    }
    // 通脱nodeRecord 的parentId 和 _key 判断创建节点还是子节点
    const { parentId, _key } = nodeRecord
    const splitRes = _key.split('-')
    let flag = splitRes.length
    let i = 1
    for (; i <= splitRes.length; i++) {
      if (splitRes[i - 1] === parentId?.toString()) {
        console.log(i)
        flag = i + 1
        break
      }
    }
    return flag
  }, [nodeRecord])

  const onFinish = async (values: {
    id: number
    parentId: number
    name: string
    describe: string
    status: string[]
    level: number
  }) => {
    const _key = nodeRecord?._key?.split('-')
    const isEdit = treeStatus === FormState.EDIT
    let parentId = nodeRecord?.parentId || 0
    if (nodeRecord && !isEdit && is3Level === 4) {
      parentId = _key[1]
    }
    const service = !isEdit ? postManageContentCategoryAdd : postManageContentCategoryUpdate
    let postData: any = {
      name: values.name,
      describe: values.describe,
      status: values.status?.[0] || 0,
      level: is3Level === 4 ? 3 : is3Level,
      parentId: parentId,
    }
    if (isEdit) {
      postData = {
        ...postData,
        parentId: values.parentId,
        id: values.id,
        level: values.level,
      }
    }

    const { code } = await service(postData)
    if (code === 1000) {
      resetMenu()
      setTreeStatus(FormState.FREE)
      setNodeRecord(null)
    }
  }

  const clickSelect = (key, node) => {
    handleSelect(key, node)
    // flag = false
  }

  useEffect(() => {
    // 这里有个奇怪的地方，不知道为什么要医疗nodeRecord
    if ((treeStatus === FormState.ADD && is3Level === 3) || is3Level === 4) {
      formActions.setFieldValue('level', 3)
    }
  }, [treeStatus, nodeRecord, is3Level])

  return (
    <div className={styles.page}>
      <div className={styles.tree}>
        <Card>
          <div className="mb-30">选择要编辑的项目</div>
          {treeData && treeData.length > 0 ? (
            <TabTree
              fetchData={(params) => fetchClassTreeData(params)}
              treeData={transferTreeDatarRes}
              toolsRender={toolsRender}
              actions={treeActions}
              handleSelect={(key, node) => clickSelect(key, node)}
              customKey="id"
              addChildLevel={3}
            />
          ) : (
            <Button block type="primary" onClick={() => handleSelect()}>
              暂无菜单, 开始新增
            </Button>
          )}
        </Card>
      </div>
      <div className={styles.editPanel}>
        {treeStatus !== FormState.FREE && (
          <>
            <div className="common-panel-title mb-30">{treeStatus === FormState.ADD ? '新增' : '编辑'}</div>
            <NiceForm
              value={formValue}
              components={{
                Checkbox,
                CheckboxGroup: Checkbox.Group,
              }}
              name="classForm"
              onSubmit={onFinish}
              actions={formActions}
              schema={classSchema}
              expressionScope={{
                showWarn: (
                  <Tooltip
                    placement="topLeft"
                    title={'只能同时对7个一级分类下的第三级分类设置推荐分类，且每个一级分类下最多只允许设置2个推荐分类'}
                  >
                    <span style={{ marginTop: '-12px', width: '50px' }}>
                      <QuestionCircleOutlined />
                    </span>
                  </Tooltip>
                ),
              }}
            >
              <FormButtonGroup>
                <AuthButton type="custom" code="save">
                  <Button htmlType="submit" type="primary">
                    保存
                  </Button>
                </AuthButton>
                <AuthButton type="custom" code="delete">
                  <Popconfirm title="确定要删除吗？" okText="是" cancelText="否" onConfirm={handleDeleteMenu}>
                    {treeStatus !== FormState.ADD && <Button>删除</Button>}
                  </Popconfirm>
                </AuthButton>
              </FormButtonGroup>
            </NiceForm>
          </>
        )}
      </div>
    </div>
  )
}

export default ClassProperty
