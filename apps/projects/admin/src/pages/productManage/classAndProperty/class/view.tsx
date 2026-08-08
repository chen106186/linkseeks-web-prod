import React, { useState, useEffect } from 'react'
import { usePrompt } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { Form, Popconfirm, Button, Tabs, Space } from 'antd'
import { LineCard, PageHeaderWrapper, AuthButton, AddAuthButton, StandardTree } from '@apps/components'
import { postProductPlatformDeleteCategory, postProductPlatformSaveOrUpdateCategory } from '@apps/apis'
import useNodeDrag from './services/hooks/useNodeDrag'
import useNodeClick from './services/hooks/useNodeClick'
import { CategoryProvider, useCategoryContext } from './services/context'
import useNodeTools from './services/hooks/useNodeTools'
import CategoryForm from './services/components/categoryForm'

const ClassProperty: React.FC<{}> = () => {
  const intl = useIntl()
  const [unsaved, setUnsaved] = useState(false)

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
  const { renderTools, renderHeadTools } = useNodeTools()
  const { onAllowDrop, onDragDrop } = useNodeDrag()
  const { handleClick } = useNodeClick()
  const [tabsActiveKey, setTabsActiveKey] = useState<string>('1')

  usePrompt({
    when: unsaved,
    message: intl.formatMessage({
      id: 'common.tip.save.confirm',
      defaultMessage: '您还有未保存的内容，是否确定要离开？',
    }),
  })

  const onFinish = (values) => {
    setSubmitLoading(true)
    const params = {
      ...values,
      parentId:
        operateType === 'AddChild'
          ? treeRef.current?.selectNode?.id
          : operateType === 'Edit'
          ? selectCategoryInfo?.parentId || 0
          : 0,
      id: operateType === 'Edit' && selectCategoryInfo ? selectCategoryInfo?.id : null,
      sort: 99,
    }
    postProductPlatformSaveOrUpdateCategory(params).then((res) => {
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

  const handleDelete = async (e) => {
    e.stopPropagation()
    if (operateType === 'Edit' && selectCategoryInfo) {
      postProductPlatformDeleteCategory({ id: Number(selectCategoryInfo.id) }).then((res) => {
        if (res.code === 1000) {
          treeRef.current.refreshTreeData()
          setOperateType(undefined)
        }
      })
    }
  }

  return (
    <PageHeaderWrapper title="品类" className="useConnectBtnWrapper">
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
        renderTools={renderTools}
        headTools={renderHeadTools}
        handleNodeClick={handleClick}
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
                  <CategoryForm />
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
                    <Popconfirm title="确定要删除吗？" okText="是" cancelText="否" onConfirm={handleDelete}>
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
    </PageHeaderWrapper>
  )
}

export default () => (
  <CategoryProvider>
    <ClassProperty />
  </CategoryProvider>
)
