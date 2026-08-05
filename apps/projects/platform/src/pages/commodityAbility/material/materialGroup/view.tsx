import React, { useEffect, useState } from 'react'
import type { onSelectParameters } from '../components/materialTree'
import MaterialTree from '../components/materialTree'
import styles from './index.less'
import { Button, Card, Empty, Popconfirm } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import NiceForm from '@/components/NiceForm'
import { schema } from './schema'
import { createAsyncFormActions, FormButtonGroup, FormPath } from '@apps/formily'
import {
  getProductMaterialGroupDetail,
  getProductMaterialGroupTree,
  postProductMaterialGroupDelete,
  postProductMaterialGroupSaveOrUpdate,
} from '@apps/apis'
import FormilyTreeSelect from '../components/formilyTreeSelect'
import { useIntl } from '@linkseeks/i18n'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'

const formActions = createAsyncFormActions()

type SubmitDataType = {
  code: string
  name: string
  description?: string
}

type InfoType = {
  status: 'edit' | 'create'
  parentId: number | string
  id?: number | string
}

/**
 * 顶级
 * @returns
 */

const MaterialGroup = () => {
  const intl = useIntl()
  const [treeData, setTreeData] = useState([])
  /** 记录当前是创建还是修改，记录创建的父级id */
  const [info, setInfo] = useState<InfoType | null>(null)
  const [formValue, setFormValue] = useState(null)
  const [loading, setLoading] = useState(false)

  const getTree = async () => {
    const { data } = await getProductMaterialGroupTree({ rootNodeId: '0' })
    setTreeData(data)
  }

  useEffect(() => {
    getTree()
  }, [])

  const refresh = () => {
    setInfo(null)
    getTree()
  }

  /**
   * 选中状态下 获取接口， 渲染右边form
   */
  const onSelect = async (selectedKeys: onSelectParameters[0], event: onSelectParameters[1]) => {
    if (!event.selected) {
      setFormValue(null)
      setInfo(null)
      return
    }
    setInfo({
      status: 'edit',
      parentId: null,
      id: event.node.key,
    })
    formActions.setFieldState('parentId', (state) => {
      FormPath.setIn(state, 'visible', true)
    })
    setTimeout(() => {
      formActions.setFieldState('parentId', (state) => {
        const options = [
          {
            parentId: 0,
            name: '顶级',
            key: 0,
            id: 0,
            children: [...treeData],
          },
        ]
        FormPath.setIn(state, 'props.enum', options)
        FormPath.setIn(state, 'props.x-component-props', { currentId: event.node.key })
      })
    }, 100)

    const { data, code } = await getProductMaterialGroupDetail({ id: `${event.node.key}` })
    if (code === 1000) {
      setFormValue(data)
    }
  }

  const onSubmit = async (submitData: SubmitDataType) => {
    setLoading(true)
    const postData =
      info?.status === 'create'
        ? {
            parentId: +info.parentId,
            ...submitData,
          }
        : {
            id: +info?.id,
            ...submitData,
          }
    const { code } = await postProductMaterialGroupSaveOrUpdate(postData)
    setLoading(false)
    if (code === 1000) {
      refresh()
    }
  }

  const handleAdd = (params: { parentKey: string; depth: number }) => {
    console.log(params)
    setInfo({
      status: 'create',
      parentId: params.parentKey || 0,
    })
    setFormValue({
      code: '',
      description: '',
      name: '',
    })
    setTimeout(() => {
      formActions.setFieldState('parentId', (state) => {
        FormPath.setIn(state, 'visible', false)
      })
    }, 200)
  }

  const handleDelete = async () => {
    const { code } = await postProductMaterialGroupDelete({ id: +info.id! })
    if (code === 1000) {
      refresh()
    }
  }

  const handleCreate = () => {
    setInfo({
      status: 'create',
      parentId: 0,
    })
    formActions.setFieldState('parentId', (state) => {
      FormPath.setIn(state, 'visible', false)
    })
  }

  return (
    <PageHeaderWrapper title={intl.formatMessage({ id: 'material.group.title', defaultMessage: '物料组管理' })}>
      <div className={styles.page}>
        <div className={styles.left}>
          <Card
            title={intl.formatMessage({ id: 'material.group.list', defaultMessage: '列表' })}
            extra={
              (treeData.length === 0 && (
                <AddAuthButton>
                  <Button onClick={handleCreate}>
                    {intl.formatMessage({
                      id: 'material.group.create',
                      defaultMessage: '新建物料组',
                    })}
                  </Button>
                </AddAuthButton>
              )) ||
              null
            }
          >
            <MaterialTree
              treeData={treeData}
              onSelect={onSelect}
              onAdd={handleAdd}
              fieldNames={{ title: 'name', key: 'id', children: 'children' }}
            />
          </Card>
        </div>
        <section className={styles.content}>
          <Card title={intl.formatMessage({ id: 'material.group.edit', defaultMessage: '编辑' })}>
            {(!info && <Empty />) || (
              <NiceForm
                value={formValue}
                components={{ FormilyTreeSelect }}
                schema={schema}
                onSubmit={onSubmit}
                actions={formActions}
              >
                <FormButtonGroup>
                  <AuthButton type="custom" code="update">
                    <Button htmlType="submit" type="primary" loading={loading}>
                      {intl.formatMessage({ id: 'material.group.save', defaultMessage: '保存' })}
                    </Button>
                  </AuthButton>
                  {(info.status === 'edit' && (
                    <AuthButton type="custom" code="delete">
                      <Popconfirm
                        title={intl.formatMessage({
                          id: 'material.group.delete.tips',
                          defaultMessage: '确定要删除吗？',
                        })}
                        okText={intl.formatMessage({
                          id: 'material.group.delete.confirm',
                          defaultMessage: '是',
                        })}
                        cancelText={intl.formatMessage({
                          id: 'material.group.delete.cancel',
                          defaultMessage: '否',
                        })}
                        onConfirm={handleDelete}
                      >
                        <Button>
                          {intl.formatMessage({
                            id: 'material.group.delete',
                            defaultMessage: '删除',
                          })}
                        </Button>
                      </Popconfirm>
                    </AuthButton>
                  )) ||
                    null}
                </FormButtonGroup>
              </NiceForm>
            )}
          </Card>
        </section>
      </div>
    </PageHeaderWrapper>
  )
}

export default MaterialGroup
