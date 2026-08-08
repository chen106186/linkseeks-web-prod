import React, { useState, useEffect } from 'react'
import { usePrompt } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { Form, Tooltip, Popconfirm, Button, message, Modal, Tabs, Space } from 'antd'
import { SyncOutlined } from '@ant-design/icons'
import { LineCard, PageHeaderWrapper, AuthButton, AddAuthButton, StandardTree } from '@apps/components'
import TabTree, { createTreeActions } from '@/components/TabTree'
import { useTreeTabs } from '@/hooks/useTreeTabs'
import {
  getProductPlatformGetCategoryTree,
  postProductCustomerDeleteCustomerCategory,
  postProductCustomerSaveOrUpdateCustomerCategory,
  postProductCustomerSyncCategory,
  getManageInitConfigEnableMultiTenancy,
} from '@apps/apis'
import { useWebIntl } from '@apps/locales'
import useNodeDrag from './services/hooks/useNodeDrag'
import useNodeClick from './services/hooks/useNodeClick'
import { CategoryProvider, useCategoryContext } from './services/context'
import useNodeTools from './services/hooks/useNodeTools'
import CategoryForm from './services/components/categoryForm'

const syncTreeActions = createTreeActions()

const fetchPlatformTreeData = async (params?) => {
  // 平台后台树
  const res = await getProductPlatformGetCategoryTree()
  return res
}

const ClassProperty: React.FC<{}> = () => {
  const intl = useIntl()
  const [syncVisible, setSyncVisible] = useState(false)
  const [unsaved, setUnsaved] = useState(false)
  const translate = useWebIntl()
  const {
    treeRef,
    submitLoading,
    categoryForm,
    operateType,
    selectCategoryInfo,
    setOperateType,
    setSubmitLoading,
    setSelectCategoryInfo,
    refreshData,
    updateCategoryInfo,
  } = useCategoryContext()
  const { renderTools } = useNodeTools()
  const { onAllowDrop, onDragDrop } = useNodeDrag()
  const { handleClick } = useNodeClick()
  const [customPlateformExpandkeys] = useState<number[]>([])
  const [syncLoading, setSyncLoading] = useState<boolean>(false)
  const [resetSearch, setResetSearch] = useState(false)
  const [isMultiple, setIsMultiple] = useState<boolean>(false) // saas多租户
  const [tabsActiveKey, setTabsActiveKey] = useState<string>('1')

  usePrompt({
    when: unsaved,
    message: intl.formatMessage({
      id: 'common.tip.save.confirm',
      defaultMessage: '您还有未保存的内容，是否确定要离开？',
    }),
  })

  /* 关联平台后台品类树 */
  const { treeData: plateformTreeData } = useTreeTabs({
    fetchMenuData: fetchPlatformTreeData,
  })

  /* 同步树 */
  const { handleSelect: handleSyncSelect } = useTreeTabs({
    treeActions: syncTreeActions,
  })

  useEffect(() => {
    getMultiple()
  }, [])

  const getMultiple = () => {
    const siteId = import.meta.env.OUT_SITEID
    getManageInitConfigEnableMultiTenancy({ siteId }).then(({ code, data }) => {
      if (code === 1000) {
        setIsMultiple(data)
      }
    })
  }

  const onFinish = (values) => {
    setSubmitLoading(true)
    const params = {
      ...values,
      category: values.category && JSON.stringify(values.category) !== '{}' ? values.category : undefined,
      parentId:
        operateType === 'AddChild'
          ? treeRef.current?.selectNode?.id
          : operateType === 'Edit'
          ? selectCategoryInfo?.parentId || 0
          : 0,
      id: operateType === 'Edit' && selectCategoryInfo ? selectCategoryInfo?.id : null,
      categoryInspections:
        values.categoryInspections && values.categoryInspections.length > 0
          ? values.categoryInspections.map((_item) => ({
              id: _item.id,
              grouping: _item.grouping,
              testItems: _item.testItems,
              startValue: _item.startValue,
              endValue: _item.endValue,
              inspectionInstructions: _item.inspectionInstructions,
            }))
          : undefined,
    }
    postProductCustomerSaveOrUpdateCustomerCategory(params).then((res) => {
      setSubmitLoading(false)
      treeRef.current.refreshTreeData()
      if (operateType !== 'Edit') {
        // 若为新增，不停留在编辑界面
        setOperateType(undefined)
        setSelectCategoryInfo(undefined)
      } else {
        if (selectCategoryInfo) {
          updateCategoryInfo(String(selectCategoryInfo.id))
        }
      }
      // 保存后要将是否填写过表单设为false
      setUnsaved(false)
      setTabsActiveKey('1')
    })
  }

  // 同步平台品类
  const asyncClass = () => {
    setSyncVisible(true)
    setResetSearch(false)
  }

  const handleSyncOk = () => {
    setSyncLoading(true)
    const syncIds = syncTreeActions.getSelectKeys()
    if (syncIds.length) {
      postProductCustomerSyncCategory({
        idList: Array.from(new Set([...syncIds, ...syncTreeActions.getExpandedKeys()])),
      } as any).then((res) => {
        treeRef.current.refreshTreeData()
        syncTreeActions.setSelectKeys([])
        setResetSearch(true)
        setSyncVisible(false)
        setSyncLoading(false)
      })
    } else {
      message.error(intl.formatMessage({ id: 'classAndProperty.class.error' }))
      setSyncLoading(false)
    }
  }

  const handleSyncCancel = () => {
    setResetSearch(true)
    setSyncVisible(false)
    treeRef.current.refreshTreeData()
    syncTreeActions.setSelectKeys([])
  }

  const handleDelete = async (e) => {
    e.stopPropagation()
    if (operateType === 'Edit' && selectCategoryInfo) {
      postProductCustomerDeleteCustomerCategory({ id: Number(selectCategoryInfo.id) }).then((res) => {
        if (res.code === 1000) {
          treeRef.current.refreshTreeData()
          setOperateType(undefined)
        }
      })
    }
  }

  const renderHeadTools = () => {
    return (
      !isMultiple && (
        <p>
          <AuthButton type="custom" code="synchronization">
            <Tooltip title={intl.formatMessage({ id: 'classAndProperty.class.h3.tooltip' })}>
              <Button type="default" icon={<SyncOutlined />} onClick={asyncClass}>
                {intl.formatMessage({ id: 'classAndProperty.class.h3.button' })}
              </Button>
            </Tooltip>
          </AuthButton>
        </p>
      )
    )
  }

  return (
    <PageHeaderWrapper
      title={intl.formatMessage({ id: 'classAndProperty.class.title' })}
      className="useConnectBtnWrapper"
    >
      <StandardTree
        request={refreshData}
        height="76vh"
        treeRef={treeRef}
        title={intl.formatMessage({
          id: 'classAndProperty.class.h3',
          defaultMessage: '选择要编辑的品类',
        })}
        onAllowDrop={onAllowDrop}
        onDragDrop={onDragDrop}
        headTools={renderHeadTools}
        renderTools={renderTools}
        handleNodeClick={handleClick}
        emptyRender={() => (
          <Button
            block
            type="primary"
            onClick={() => {
              categoryForm.resetFields()
              setOperateType('Add')
            }}
          >
            {translate('web.resource.commodity.xinzengpinlei')}
          </Button>
        )}
      >
        <LineCard
          bodyStyle={{
            paddingTop: 0,
            height: 'auto',
          }}
          style={{
            flex: 2,
            width: 0,
            marginLeft: 16,
          }}
        >
          {operateType && (
            <Form
              form={categoryForm}
              layout="vertical"
              onFinish={onFinish}
              onValuesChange={() => setUnsaved(true)}
              wrapperCol={{
                span: 14,
              }}
            >
              <Tabs defaultActiveKey="1" activeKey={tabsActiveKey} onChange={setTabsActiveKey}>
                <Tabs.TabPane
                  tab={intl.formatMessage({
                    id: 'classAndProperty.class.tabs.pinLeiWeiHu',
                    defaultMessage: '品类维护',
                  })}
                  key="1"
                >
                  <CategoryForm isMultiple={isMultiple} />
                </Tabs.TabPane>
              </Tabs>
              <Form.Item>
                <Space>
                  <AddAuthButton>
                    <Button loading={submitLoading} htmlType="submit" type="primary">
                      {intl.formatMessage({
                        id: 'classAndProperty.class.h3.formButtonGroup.button.1',
                        defaultMessage: '保存',
                      })}
                    </Button>
                  </AddAuthButton>
                  <AuthButton type="custom" code="delete">
                    <Popconfirm
                      title={intl.formatMessage({
                        id: 'classAndProperty.class.h3.formButtonGroup.popconfirm',
                      })}
                      okText={intl.formatMessage({ id: 'classAndProperty.class.h3.formButtonGroup.okText' })}
                      cancelText={intl.formatMessage({
                        id: 'classAndProperty.class.h3.formButtonGroup.cancelText',
                      })}
                      onConfirm={handleDelete}
                    >
                      {operateType === 'Edit' && (
                        <Button htmlType="button">
                          {intl.formatMessage({
                            id: 'classAndProperty.class.h3.formButtonGroup.button.2',
                            defaultMessage: '删除',
                          })}
                        </Button>
                      )}
                    </Popconfirm>
                  </AuthButton>
                </Space>
              </Form.Item>
            </Form>
          )}
        </LineCard>
      </StandardTree>
      <Modal
        title={intl.formatMessage({ id: 'classAndProperty.class.modal.2.title' })}
        open={syncVisible}
        onOk={handleSyncOk}
        onCancel={handleSyncCancel}
        okText={intl.formatMessage({ id: 'classAndProperty.class.modal.2.okText' })}
        cancelText={intl.formatMessage({ id: 'classAndProperty.class.modal.2.cancelText' })}
        forceRender
        getContainer="#root"
        confirmLoading={syncLoading}
        destroyOnClose={true}
      >
        <TabTree
          fetchData={(params) => fetchPlatformTreeData(params)}
          treeData={plateformTreeData}
          handleSelect={handleSyncSelect}
          actions={syncTreeActions}
          customKey="id"
          enableSearch
          searchPlaceholder={intl.formatMessage({ id: 'classAndProperty.class.modal.2.searchPlaceholder' })}
          resetSearch={resetSearch}
          customExpandkeys={customPlateformExpandkeys}
          checkable={true}
        />
      </Modal>
    </PageHeaderWrapper>
  )
}

export default () => (
  <CategoryProvider>
    <ClassProperty />
  </CategoryProvider>
)
