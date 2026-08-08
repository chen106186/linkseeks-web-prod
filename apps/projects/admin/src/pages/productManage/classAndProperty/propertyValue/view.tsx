import type { ReactNode } from 'react'
import React, { useState, useRef, useEffect } from 'react'
import { Row, Col, Popconfirm, Button, Card } from 'antd'
import { PauseCircleOutlined, PlayCircleOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons'
import { PageHeaderWrapper, AuthButton, EditAuthButton, StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { history } from '@linkseeks/router-manager'
import { useQuery } from '@linkseeks/router-core'
import { useTreeTabs } from '@/hooks/useTreeTabs'
import TabTree, { createTreeActions } from '@/components/TabTree'
import {
  getProductPlatformGetAttributeTree,
  getProductPlatformGetAttributeValueList,
  postProductPlatformDeleteAttributeValue,
  postProductPlatformUpdateAttributeValueStatus,
} from '@apps/apis'

const treeActions = createTreeActions()

const fetchAttributeTreeData = async (params?) => {
  const res = await getProductPlatformGetAttributeTree({ filterInput: true })
  return res
}

const PropertyValue: React.FC = () => {
  const query = useQuery()

  const ref = useRef({} as ActionType)
  const [selectKey, setSelectKey] = useState(undefined)
  const [selectNode, setSelectNode] = useState<any>({
    _title: query.attrName,
  })
  const [customExpandkeys, setCustomExpandkeys] = useState<any>()
  const flag = useRef<boolean>(false)

  const { treeData } = useTreeTabs({
    treeActions,
    fetchMenuData: fetchAttributeTreeData,
  })

  useEffect(() => {
    const prefix = sessionStorage.getItem('beforeKeyPrefix')
    const beforeKey: any = query.attrId

    if (beforeKey) {
      // 展开之前的选择项 拼接含有字母字符串的key
      setSelectKey(beforeKey)
      const evilKey = `${prefix}_${beforeKey}`
      treeActions.setExpandedKeys([evilKey])
      setCustomExpandkeys([evilKey])
      treeActions.setSelectKeys([evilKey])
    }
  }, [])

  useEffect(() => {
    if (selectKey && flag.current) {
      ref.current.reload()
    } else if (!selectKey) {
      flag.current = false
    } else {
      flag.current = true
    }
  }, [selectKey])

  const onHandleSelect = (key, node) => {
    if (node.children && node.children.length > 0) {
      return
    }
    if (key) {
      const arr = key.split('_')
      sessionStorage.setItem('beforeKeyPrefix', arr[0])
      setSelectKey(arr[arr.length - 1])
      setSelectNode(node)
    }
  }

  const fetchData = (params: any) => {
    return new Promise((resolve) => {
      getProductPlatformGetAttributeValueList({
        ...params,
        name: params.name || '',
        attributeId: selectKey,
      }).then((res) => {
        const { data } = res
        resolve(data)
      })
    })
  }

  const handleSee = (record: any) => {
    history.push(
      `/productManage/classAndProperty/propertyValue/detail?attrId=${selectKey}&attrName=${selectNode._title}&attrValueId=${record.id}&isSee=true&type=${record.type}`,
    )
  }

  const confirm = (record: any) => {
    postProductPlatformUpdateAttributeValueStatus({
      id: record.id,
      isEnable: !record.isEnable,
    }).then(() => {
      ref.current.reload()
    })
  }

  const clickDelete = (record: any) => {
    postProductPlatformDeleteAttributeValue({ id: record.id }).then(() => {
      ref.current.reload()
    })
  }

  const cancel = () => {
    console.log('cancel')
  }

  const defaultColumns: RecordColumns<any>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      fixed: 'left',
    },
    {
      title: '属性值',
      dataIndex: 'value',
      key: 'value',
      searchField: {
        name: 'name',
        type: 'Input',
        title: '属性值名称',
      },
      render: (text: any, record: any) => (
        <span className="commonPickColor" onClick={() => handleSee(record)}>
          {text}&nbsp;
          <EyeOutlined />
        </span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'isEnable',
      key: 'isEnable',
      render: (text: any, record: any) => {
        let component: ReactNode = null
        component = (
          <Popconfirm
            title="确定要执行这个操作?"
            onConfirm={() => confirm(record)}
            onCancel={cancel}
            okText="是"
            cancelText="否"
          >
            <Button type="link" style={record.isEnable ? { color: '#00A98F' } : { color: 'red' }}>
              {record.isEnable ? (
                <>
                  有效 <PlayCircleOutlined />
                </>
              ) : (
                <>
                  无效 <PauseCircleOutlined />
                </>
              )}
            </Button>
          </Popconfirm>
        )
        return component
      },
    },
    {
      title: '操作',
      key: 'option',
      align: 'center',
      fixed: 'right',
      render: (text: any, record: any) => {
        return (
          <>
            <EditAuthButton>
              <Button
                type="link"
                onClick={() =>
                  history.push(
                    `/productManage/classAndProperty/propertyValue/edit?attrId=${selectKey}&attrName=${selectNode._title}&attrValueId=${record.id}`,
                  )
                }
              >
                编辑
              </Button>
            </EditAuthButton>
            {!record.isEnable && (
              <AuthButton type="custom" code="delete">
                <Popconfirm
                  title="确定要执行这个操作?"
                  onConfirm={() => clickDelete(record)}
                  onCancel={cancel}
                  okText="是"
                  cancelText="否"
                >
                  <Button type="link">删除</Button>
                </Popconfirm>
              </AuthButton>
            )}
          </>
        )
      },
    },
  ]

  return (
    <PageHeaderWrapper backDom={false}>
      <Row gutter={[24, 36]}>
        <Col span={8}>
          <Card>
            <div className="mb-30">选择要编辑的项目</div>
            {treeData && treeData.length > 0 ? (
              <TabTree
                fetchData={(params) => fetchAttributeTreeData(params)}
                treeData={treeData}
                actions={treeActions}
                handleSelect={(key, node) => onHandleSelect(key, node)}
                customKey="id"
                customExpandkeys={customExpandkeys}
              />
            ) : (
              <>暂无菜单</>
            )}
          </Card>
        </Col>
        <Col span={16}>
          <Card>
            {selectKey && (
              <StandardFormTable
                columns={defaultColumns}
                autoScrollX
                request={(params) => fetchData(params)}
                searchButtons={[
                  {
                    key: 'add',
                    children: '新建',
                    onClick() {
                      history.push(
                        `/productManage/classAndProperty/propertyValue/add?attrId=${
                          selectKey || query.attrId
                        }&attrName=${selectNode?._title || query.attrName}&type=${selectNode?.type || query.type}`,
                      )
                    },
                    type: 'primary',
                    icon: <PlusOutlined />,
                  },
                ]}
                rowKey="id"
                actionRef={ref}
              />
            )}
          </Card>
        </Col>
      </Row>
    </PageHeaderWrapper>
  )
}

export default PropertyValue
