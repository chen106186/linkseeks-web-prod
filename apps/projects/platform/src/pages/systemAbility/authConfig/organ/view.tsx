import React from 'react'
import { Row, Col, Popconfirm, Button, Card } from 'antd'
import TabTree, { createTreeActions } from '@/components/TabTree'
import SchemaForm, { createFormActions, LifeCycleTypes, FormEffectHooks } from '@apps/formily'
import { menuSchema } from './schema'
import {
  getMemberOrgTree,
  postMemberOrgDelete,
  getMemberOrgGet,
  postMemberOrgUpdate,
  postMemberOrgAdd,
} from '@apps/apis'
import { useTreeTabs } from '@/hooks/useTreeTabs'
import { useIntl } from '@linkseeks/i18n'

const { ON_FORM_INPUT_CHANGE } = LifeCycleTypes
const { onFieldInputChange$ } = FormEffectHooks

enum FormState {
  FREE, // 空闲状态
  EDIT, // 编辑状态
  ADD, // 新增状态
}

const formActions = createFormActions()
const treeActions = createTreeActions()

const fetchMenuData = async (params?) => {
  const res = await getMemberOrgTree()
  return res
}

const Organ: React.FC<{}> = () => {
  const intl = useIntl()

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
  } = useTreeTabs({
    treeActions,
    formActions,
    deleteMenu: postMemberOrgDelete,
    fetchMenuData: fetchMenuData,
    fetchItemDetailData: getMemberOrgGet,
  })

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
    const fn = editOrAdd ? postMemberOrgUpdate : postMemberOrgAdd
    fn(params).then((res) => {
      resetMenu()
      setTreeStatus(FormState.FREE)
      setNodeRecord(undefined)
      // 保存后要将是否填写过表单设为false
      setIsEditForm(false)
    })
  }

  return (
    <Card className="common-wrapper white-wrapper">
      <Row gutter={[36, 36]}>
        <Col span={8}>
          <div className="common-panel-title mb-30">{intl.formatMessage({ id: 'authConfig.chooseProject' })}</div>
          {treeData && treeData.length > 0 ? (
            <TabTree
              fetchData={(params) => fetchMenuData(params)}
              treeData={treeData}
              toolsRender={toolsRender}
              actions={treeActions}
              customKey="id"
              handleSelect={(key, node) => handleSelect(key, node)}
            />
          ) : (
            <Button block type="primary" onClick={() => handleSelect()}>
              {intl.formatMessage({ id: 'authConfig.tempNoStarAdd' })}
            </Button>
          )}
        </Col>
        <Col span={16}>
          {treeStatus !== FormState.FREE && (
            <>
              <div className="common-panel-title mb-30">
                {treeStatus === FormState.ADD
                  ? intl.formatMessage({ id: 'common.button.add' })
                  : intl.formatMessage({ id: 'common.button.edit' })}
              </div>
              <SchemaForm
                schema={menuSchema}
                value={formInitValue}
                actions={formActions}
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
                {intl.formatMessage({ id: 'authConfig.saveSeting' })}
              </Button>
              <Popconfirm
                title={intl.formatMessage({ id: 'authConfig.confirmDelete' })}
                okText={intl.formatMessage({ id: 'common.button.yes' })}
                cancelText={intl.formatMessage({ id: 'common.button.no' })}
                onConfirm={handleDeleteMenu}
              >
                <Button style={{ marginTop: 32, marginBottom: 16 }}>
                  {intl.formatMessage({ id: 'common.button.delete' })}
                </Button>
              </Popconfirm>
            </>
          )}
        </Col>
      </Row>
    </Card>
  )
}

export default Organ
