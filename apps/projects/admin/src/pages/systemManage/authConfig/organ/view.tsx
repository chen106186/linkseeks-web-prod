import React from 'react'
import { Row, Col, Popconfirm, Button } from 'antd'
import TabTree, { createTreeActions } from '@/components/TabTree'
import SchemaForm, { createFormActions, LifeCycleTypes } from '@apps/formily'
import { menuSchema } from './schema'
import { useTreeTabs } from '@/hooks/useTreeTabs'
import { PageHeaderWrapper } from '@apps/components'
import {
  getMemberManageOrgGet,
  getMemberManageOrgTree,
  postMemberManageOrgAdd,
  postMemberManageOrgDelete,
  postMemberManageOrgUpdate,
} from '@apps/apis'
import { usePrompt } from '@linkseeks/router-core'
import './index.less'

const { ON_FORM_INPUT_CHANGE } = LifeCycleTypes

enum FormState {
  FREE, // 空闲状态
  EDIT, // 编辑状态
  ADD, // 新增状态
}

const formActions = createFormActions()
const treeActions = createTreeActions()

const fetchMenuData = async (params?) => {
  const res = await getMemberManageOrgTree()
  return res
}

const Organ: React.FC<{}> = () => {
  const {
    treeStatus,
    setTreeStatus,
    treeData,
    setIsEditForm,
    nodeRecord,
    setNodeRecord,
    handleSelect,
    getTreeMaps,
    setTreeMaps,
    resetMenu,
    toolsRender,
    handleDeleteMenu,
    isEditForm,
  } = useTreeTabs({
    treeActions,
    formActions,
    deleteMenu: postMemberManageOrgDelete,
    fetchMenuData: fetchMenuData,
    fetchItemDetailData: getMemberManageOrgGet,
  })

  usePrompt({ when: isEditForm, message: '您还有未保存的内容，是否确定要离开？' })
  // 当拥有节点数据并且当前状态是编辑状态时 需回显表单
  const formInitValue = nodeRecord && treeStatus === FormState.EDIT ? getTreeMaps(nodeRecord.key) : {}

  const handleSubmitAllSetting = () => {
    formActions.submit()
  }

  // 保存设置提交
  const handleSubmit = (value) => {
    // 去掉模拟的key, 为true的时候是编辑
    const editOrAdd = nodeRecord && treeStatus === FormState.EDIT
    const params = editOrAdd
      ? { ...value, parentId: nodeRecord.id }
      : {
          ...value,
          parentId: nodeRecord ? nodeRecord.parentId : 0,
        }
    const fn = editOrAdd ? postMemberManageOrgUpdate : postMemberManageOrgAdd
    fn(params).then((res) => {
      if (res.code === 1000) {
        resetMenu()
        setTreeStatus(FormState.FREE)
        setNodeRecord(undefined)
        // 保存后要将是否填写过表单设为false
        setIsEditForm(false)
      }
    })
  }

  return (
    <PageHeaderWrapper>
      <div className="common-wrapper">
        <Row gutter={[36, 36]}>
          <Col span={8}>
            <div className="common-panel-title mb-30">选择要编辑的项目</div>
            {treeData && treeData.length > 0 ? (
              <TabTree
                fetchData={(params) => fetchMenuData(params)}
                treeData={treeData}
                toolsRender={toolsRender}
                actions={treeActions}
                customKey="id"
                checkStrictly
                handleSelect={(key, node) => handleSelect(key, node)}
              />
            ) : (
              <Button block type="primary" onClick={() => handleSelect()}>
                暂无菜单, 开始新增
              </Button>
            )}
          </Col>
          <Col span={16}>
            {treeStatus !== FormState.FREE && (
              <>
                <div className="common-panel-title mb-30">{treeStatus === FormState.ADD ? '新增' : '编辑'}</div>
                <SchemaForm
                  schema={menuSchema}
                  value={formInitValue}
                  actions={formActions}
                  layout="vertical"
                  effects={($) => {
                    $(ON_FORM_INPUT_CHANGE).subscribe(() => {
                      setIsEditForm(true)
                    })
                    $('onFormReset').subscribe(() => {
                      console.log('mount')
                    })
                  }}
                  onSubmit={handleSubmit}
                ></SchemaForm>
                <Button
                  onClick={handleSubmitAllSetting}
                  type="primary"
                  style={{ marginTop: 32, marginBottom: 16, marginRight: 24 }}
                >
                  保存设置
                </Button>
                <Popconfirm title="确定要删除吗？" okText="是" cancelText="否" onConfirm={handleDeleteMenu}>
                  <Button style={{ marginTop: 32, marginBottom: 16 }}>删除菜单</Button>
                </Popconfirm>
              </>
            )}
          </Col>
        </Row>
      </div>
    </PageHeaderWrapper>
  )
}

export default Organ
