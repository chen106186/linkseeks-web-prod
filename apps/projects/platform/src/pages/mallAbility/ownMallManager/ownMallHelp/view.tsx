import React, { useState } from 'react'
import { LineCard, PageHeaderWrapper, StandardTree } from '@apps/components'
import { usePrompt } from '@linkseeks/router-core'
import { Space, Switch, Form, Spin } from '@linkseeks/ui'
import { useIntl } from '@linkseeks/i18n'
import { PlusCircleIcon } from '@linkseeks/icons'
import { HelpfulProvider, useHelpfulContext } from './services/context'
import HelpfulForm from './services/components/HelpfulForm'
import styles from './index.less'
import useHelpful from './services/hooks/useHelpful'
import MenuModal from './services/components/MenuModal'
import useNodeTools from './services/hooks/useNodeTools'
import useNodeClick from './services/hooks/useNodeClick'
import useNodeDrag from './services/hooks/useNodeDrag'
import { PostCommodityShopHelpInfoSaveRequest } from '@apps/apis'

const OwnMallHelp: React.FC = () => {
  const {
    treeRef,
    operateType,
    helpfulForm,
    menuForm,
    selectHelpfulInfo,
    setMenuModalVisible,
    refreshData,
    setOperateType,
    updateHelpful,
    setSelectHelpfulInfo,
  } = useHelpfulContext()
  const {
    mallList,
    loading,
    saveLoading,
    switchLoading,
    activeKey,
    helpInfoEnable,
    addMenu,
    updateMenu,
    setActiveKey,
    enableHelpInfo,
  } = useHelpful(treeRef)
  const { renderTools } = useNodeTools()
  const { handleClick } = useNodeClick()
  const { onAllowDrop, onDragDrop } = useNodeDrag()
  const intl = useIntl()
  const [unsaved, setUnsaved] = useState<boolean>(false)

  usePrompt({
    when: unsaved,
    message: intl.formatMessage({
      id: 'common.tip.save.confirm',
      defaultMessage: '您还有未保存的内容，是否确定要离开？',
    }),
  })

  const renderHeadTools = () => {
    const handleAddMenu = () => {
      setOperateType('Add')
      menuForm.resetFields()
      setMenuModalVisible(true)
    }

    return (
      <Space>
        <PlusCircleIcon onClick={handleAddMenu} size={18} className={styles['plus-icon']} />
      </Space>
    )
  }

  const renderHeadMeta = () => {
    return (
      <div className={styles['helpful-headmeta']}>
        <span>{intl.formatMessage({ id: 'own.help.headmeta', defaultMessage: '是否开启帮助信息' })}</span>
        <Switch loading={switchLoading} checked={helpInfoEnable} onChange={enableHelpInfo} />
      </div>
    )
  }

  const onFinish = (values) => {
    if (treeRef.current.selectNode) {
      const helpContent = values?.helpContent?.toHTML() ?? null
      if (operateType === 'AddChild') {
        addMenu(
          {
            ...values,
            parentId: treeRef.current.selectNode?.id || 0,
            level: (treeRef.current.selectNode?.level || 0) + 1,
            helpContent,
          },
          treeRef.current.selectNode.children || [],
        ).then(() => {
          treeRef.current.refreshTreeData()
          setSelectHelpfulInfo(undefined)
          setOperateType(undefined)
          setUnsaved(false)
        })
      } else {
        updateMenu({
          id: Number(treeRef.current.selectNode?.id),
          ...values,
          helpContent,
        }).then(() => {
          updateHelpful(String(treeRef.current.selectNode?.id))
          treeRef.current.refreshTreeData()
          setUnsaved(false)
        })
      }
    }
  }

  const handleOk = (name: string) => {
    switch (operateType) {
      case 'Add':
        addMenu(
          {
            name,
            parentId: 0,
            level: 1,
          } as PostCommodityShopHelpInfoSaveRequest,
          treeRef.current.treeData || [],
        ).then(() => {
          setMenuModalVisible(false)
          treeRef.current.refreshTreeData()
        })
        break
      case 'EditMenu':
        if (treeRef.current.selectNode) {
          updateMenu({ id: Number(treeRef.current.selectNode?.id), name }).then(() => {
            setMenuModalVisible(false)
            treeRef.current.refreshTreeData()
            updateHelpful(String(treeRef.current.selectNode?.id))
          })
        }
        break
      default:
        break
    }
  }

  const showForm =
    (operateType && treeRef.current.selectNode && treeRef.current.selectNode.parentId !== 0 && selectHelpfulInfo) ||
    operateType === 'AddChild'

  return (
    <PageHeaderWrapper
      isTabs
      items={mallList && mallList.length > 1 ? mallList : []}
      onTabChange={(key) => {
        setOperateType(undefined)
        treeRef.current.setSelectKeys([])
        setSelectHelpfulInfo(undefined)
        setActiveKey(key)
      }}
    >
      <Spin spinning={loading}>
        {activeKey && (
          <StandardTree
            request={() => refreshData(activeKey)}
            height="66vh"
            treeRef={treeRef}
            treeClassName={styles['helpful-tree']}
            title={intl.formatMessage({ id: 'own.help.list', defaultMessage: '列表' })}
            onAllowDrop={onAllowDrop}
            onDragDrop={onDragDrop}
            headTools={renderHeadTools}
            headMeta={renderHeadMeta}
            renderTools={renderTools}
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
              title={
                showForm && operateType === 'Edit'
                  ? intl.formatMessage({
                      id: 'own.help.linecard.title',
                      defaultMessage: '编辑“{{title}}”帮助信息',
                      title: treeRef.current?.selectNode?.name,
                    })
                  : ''
              }
            >
              {showForm && (
                <Form
                  form={helpfulForm}
                  onFinish={onFinish}
                  onValuesChange={() => setUnsaved(true)}
                  labelAlign="left"
                  labelCol={{
                    span: 3,
                  }}
                  wrapperCol={{
                    span: 14,
                  }}
                >
                  <HelpfulForm submitLoading={saveLoading} />
                </Form>
              )}
            </LineCard>
          </StandardTree>
        )}
      </Spin>
      <MenuModal confirmLoading={saveLoading} onOk={handleOk} />
    </PageHeaderWrapper>
  )
}

export default () => (
  <HelpfulProvider>
    <OwnMallHelp />
  </HelpfulProvider>
)
