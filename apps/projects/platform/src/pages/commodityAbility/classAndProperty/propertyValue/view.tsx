import React, { useState, useRef, ReactNode, useEffect } from 'react'
import { Row, Col, Popconfirm, Button, Card, message, Tooltip } from 'antd'
import { PauseCircleOutlined, PlayCircleOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons'
import { PageHeaderWrapper } from '@apps/components'
import { EyeAuthButton } from '@apps/components'
import { history } from '@linkseeks/router-manager'
import { useQuery, useLocation } from '@linkseeks/router-core'
import { getIntl, useIntl } from '@linkseeks/i18n'
import StandardTable from '@/components/StandardTable'
import { ColumnType } from 'antd/lib/table/interface'
import { useTreeTabs } from '@/hooks/useTreeTabs'
import TabTree, { createTreeActions } from '@/components/TabTree'
import ModalTable from '@/components/ModalTable'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import Search from '@/components/NiceForm/components/Search'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import Submit from '@/components/NiceForm/components/Submit'
import { ISchema } from '@apps/formily'
import { clearModalParams } from '@/utils'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import {
  getProductCustomerGetCustomerAttributeTree,
  getProductCustomerGetCustomerAttributeValueList,
  getProductPlatformGetSyncAttributeValueList,
  postProductCustomerDeleteCustomerAttributeValue,
  postProductCustomerSyncAttributeValue,
  postProductCustomerUpdateCustomerAttributeValueStatus,
} from '@apps/apis'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton } from '@apps/components'
import { getManageInitConfigEnableMultiTenancy } from '@apps/apis'

const treeActions = createTreeActions()

const fetchAttributeTreeData = async (params?) => {
  const res = await getProductCustomerGetCustomerAttributeTree({ filterInput: true })
  return res
}

const syncSchema: ISchema = {
  type: 'object',
  properties: {
    attributeGroupName: {
      type: 'string',
      'x-component': 'ModalSearch',
      'x-component-props': {
        placeholder: getIntl().formatMessage({ id: 'classAndProperty.propertyValue.syncSchema.attributeGroupName' }),
        align: 'flex-left',
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        rowStyle: {
          flexWrap: 'nowrap',
          style: {
            marginRight: 0,
          },
        },
        colStyle: {
          marginTop: 20,
        },
      },
      properties: {
        attributeName: {
          type: 'string',
          'x-component-props': {
            placeholder: getIntl().formatMessage({ id: 'classAndProperty.propertyValue.syncSchema.attributeName' }),
          },
        },
        attributeValue: {
          type: 'string',
          'x-component-props': {
            placeholder: getIntl().formatMessage({ id: 'classAndProperty.propertyValue.syncSchema.attributeValue' }),
          },
          'x-component': 'Search',
        },
        submit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            children: getIntl().formatMessage({ id: 'classAndProperty.propertyValue.syncSchema.submit' }),
          },
        },
      },
    },
  },
}

const PropertyValue: React.FC<{}> = () => {
  const intl = useIntl()
  const query = useQuery()
  const { pathname } = useLocation()
  const ref = useRef<any>({})
  const [selectKey, setSelectKey] = useState(undefined)
  const [selectNode, setSelectNode] = useState<any>()
  const [customExpandkeys, setCustomExpandkeys] = useState<any>()

  const [syncVisible, setSyncVisible] = useState(false)
  const [syncLoading, setSyncLoading] = useState<boolean>(false)
  const [rowSelection, rowSelectionCtl] = useRowSelectionTable({ customKey: 'id' })
  const flag = useRef<boolean>(false) // 标识 初始点击品类不执行effect的重载表格
  const [isMultiple, setIsMultiple] = useState<boolean>(true) // saas多租户

  const { treeData, resetMenu } = useTreeTabs({
    treeActions,
    fetchMenuData: fetchAttributeTreeData,
  })

  useEffect(() => {
    let prefix = sessionStorage.getItem('beforeKeyPrefix')
    let beforeKey = query.attrId
    const siteId = import.meta.env.OUT_SITEID

    if (beforeKey) {
      // 展开之前的选择项 拼接含有字母字符串的key
      setSelectKey(beforeKey)
      let evilKey = `${prefix}_${beforeKey}`
      treeActions.setExpandedKeys([evilKey])
      setCustomExpandkeys([evilKey])
      treeActions.setSelectKeys([evilKey])
    }

    getMultiple()
  }, [])

  useEffect(() => {
    if (selectKey && flag.current) {
      ref.current.reload({ current: 1, pageSize: 10, name: '', customerAttributeId: selectKey })
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
      let arr = key.split('_')
      sessionStorage.setItem('beforeKeyPrefix', arr[0])
      console.log(arr[0], 'prefix')
      setSelectKey(arr[arr.length - 1])
      setSelectNode(node)
    }
  }

  const getMultiple = () => {
    const siteId = import.meta.env.OUT_SITEID
    getManageInitConfigEnableMultiTenancy({ siteId }).then(({ code, data }) => {
      if (code === 1000) {
        setIsMultiple(data)
      }
    })
  }

  const fetchData = (params: any) => {
    return new Promise((resolve, reject) => {
      getProductCustomerGetCustomerAttributeValueList({
        ...params,
        name: params?.name || '',
        customerAttributeId: selectKey,
      }).then((res) => {
        const { data } = res
        resolve(data)
      })
    })
  }

  const fetchPlatformData = async (params) => {
    // 平台后台属性值列表
    delete params['name']
    delete params['customerAttributeId']
    return new Promise((resolve, reject) => {
      getProductPlatformGetSyncAttributeValueList(params).then((res) => {
        resolve(res.data)
      })
    })
  }

  const columns: ColumnType<any>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: intl.formatMessage({ id: 'classAndProperty.propertyValue.columns.value' }),
      dataIndex: 'value',
      key: 'value',
      render: (text: any, record: any) => (
        <EyeAuthButton
          type={authUrl(pathname, 'detail') ? 'link' : 'button'}
          url={`/commodityAbility/classAndProperty/propertyValue/detail?attrId=${selectKey}&attrName=${record.customerAttribute?.name}&attrValueId=${record.id}&isSee=true&isMultiple=${isMultiple}&type=${record.type}`}
        >
          {text}
        </EyeAuthButton>
      ),
    },
    {
      title: intl.formatMessage({ id: 'classAndProperty.propertyValue.columns.isEnable' }),
      dataIndex: 'isEnable',
      key: 'isEnable',
      render: (text: any, record: any) => {
        let component: ReactNode = null
        component = (
          <AuthButton type="custom" code="status">
            <Popconfirm
              title={intl.formatMessage({ id: 'classAndProperty.propertyValue.columns.popconfirm.title' })}
              onConfirm={() => confirm(record)}
              onCancel={cancel}
              okText={intl.formatMessage({ id: 'classAndProperty.propertyValue.columns.popconfirm.okText' })}
              cancelText={intl.formatMessage({ id: 'classAndProperty.propertyValue.columns.popconfirm.cancelText' })}
            >
              <Button type="link" style={record.isEnable ? { color: '#00A98F' } : { color: 'red' }}>
                {record.isEnable ? (
                  <>
                    {intl.formatMessage({ id: 'classAndProperty.propertyValue.columns.popconfirm.button.1' })}{' '}
                    <PlayCircleOutlined />
                  </>
                ) : (
                  <>
                    {intl.formatMessage({ id: 'classAndProperty.propertyValue.columns.popconfirm.button.2' })}{' '}
                    <PauseCircleOutlined />
                  </>
                )}
              </Button>
            </Popconfirm>
          </AuthButton>
        )
        return component
      },
    },
    {
      title: intl.formatMessage({ id: 'classAndProperty.propertyValue.columns.option' }),
      dataIndex: 'option',
      render: (text: any, record: any) => {
        return (
          <>
            {record.isEnable ? (
              ''
            ) : (
              <>
                <EditAuthButton>
                  <Button
                    type="link"
                    onClick={() =>
                      history.push(
                        `/commodityAbility/classAndProperty/propertyValue/edit?attrId=${selectKey}&attrName=${record.customerAttribute?.name}&attrValueId=${record.id}&isMultiple=${isMultiple}`,
                      )
                    }
                  >
                    {intl.formatMessage({ id: 'classAndProperty.propertyValue.columns.button.1' })}
                  </Button>
                </EditAuthButton>
                <AuthButton type="custom" code="delete">
                  <Popconfirm
                    title={intl.formatMessage({
                      id: 'classAndProperty.propertyValue.columns.button.2.popconfirm.title',
                    })}
                    onConfirm={() => clickDelete(record)}
                    onCancel={cancel}
                    okText={intl.formatMessage({
                      id: 'classAndProperty.propertyValue.columns.button.2.popconfirm.okText',
                    })}
                    cancelText={intl.formatMessage({
                      id: 'classAndProperty.propertyValue.columns.button.2.popconfirm.cancelText',
                    })}
                  >
                    <Button type="link">
                      {intl.formatMessage({ id: 'classAndProperty.propertyValue.columns.button.2' })}
                    </Button>
                  </Popconfirm>
                </AuthButton>
              </>
            )}
          </>
        )
      },
    },
  ]

  const syncColumns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'classAndProperty.propertyValue.syncColumns.id' }),
      dataIndex: 'id',
      align: 'center',
      key: 'id',
    },
    {
      title: intl.formatMessage({ id: 'classAndProperty.propertyValue.syncColumns.attributeGroupName' }),
      dataIndex: ['attribute', 'groupName'],
      align: 'center',
      key: 'attribute.groupName',
    },
    {
      title: intl.formatMessage({ id: 'classAndProperty.propertyValue.syncColumns.attributeName' }),
      dataIndex: ['attribute', 'name'],
      align: 'center',
      key: 'attribute.name',
    },
    {
      title: intl.formatMessage({ id: 'classAndProperty.propertyValue.syncColumns.value' }),
      dataIndex: 'value',
      align: 'center',
      key: 'value',
    },
  ]

  const confirm = (record: any) => {
    postProductCustomerUpdateCustomerAttributeValueStatus({ id: record.id, isEnable: !record.isEnable }).then((res) => {
      ref.current.reloadCurrent()
    })
  }

  const clickDelete = (record: any) => {
    postProductCustomerDeleteCustomerAttributeValue({ id: record.id }).then((res) => {
      ref.current.reloadCurrent()
    })
  }

  const cancel = () => {
    console.log('cancel')
  }

  // 同步平台属性值
  const asyncClass = () => {
    setSyncVisible(true)
  }

  const handleAsyncOk = () => {
    setSyncLoading(true)
    if (rowSelectionCtl.selectedRowKeys.length) {
      postProductCustomerSyncAttributeValue({ idList: rowSelectionCtl.selectedRowKeys }).then((res) => {
        if (res.code === 1000) {
          if (ref?.current?.reload) {
            ref.current.reloadCurrent()
          }
          resetMenu()
          rowSelectionCtl.setSelectedRowKeys([])
        }
        setSyncVisible(false)
        setSyncLoading(false)
        clearModalParams()
      })
    } else {
      message.error(intl.formatMessage({ id: 'classAndProperty.propertyValue.error' }))
      setSyncLoading(false)
    }
  }

  const handleAsyncCancel = () => {
    clearModalParams()
    setSyncVisible(false)
  }

  // const clearModalParams = () => {
  //   let currentState = JSON.parse(sessionStorage.getItem("currentState"))
  //   let result = {...currentState, queryParams: {}, current: 1}
  //   sessionStorage.setItem("currentState", JSON.stringify(result))
  // }

  return (
    <PageHeaderWrapper>
      <Row gutter={[24, 36]}>
        <Col span={8}>
          <Card>
            <p style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div className="mb-30">{intl.formatMessage({ id: 'classAndProperty.propertyValue.h3' })}</div>
              {!isMultiple && (
                <p>
                  <Tooltip title={intl.formatMessage({ id: 'classAndProperty.propertyValue.h3.tooltip' })}>
                    <Button type="default" onClick={asyncClass}>
                      {intl.formatMessage({ id: 'classAndProperty.propertyValue.h3.button' })}
                    </Button>
                  </Tooltip>
                </p>
              )}
            </p>
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
              <>{intl.formatMessage({ id: 'classAndProperty.propertyValue.h3.none' })}</>
            )}
          </Card>
        </Col>
        <Col span={16}>
          <Card>
            {selectKey && (
              <StandardTable
                columns={columns}
                currentRef={ref}
                fetchTableData={(params: any) => fetchData(params)}
                formilyLayouts={{
                  justify: 'space-between',
                }}
                formilyProps={{
                  layouts: {
                    order: 1,
                  },
                  ctx: {
                    schema: {
                      type: 'object',
                      properties: {
                        name: {
                          type: 'string',
                          'x-component-props': {
                            placeholder: intl.formatMessage({
                              id: 'classAndProperty.propertyValue.standardTable.formilyProps.name',
                            }),
                          },
                          'x-component': 'Search',
                        },
                      },
                    },
                  },
                }}
                formilyChilds={{
                  layouts: {
                    order: 0,
                  },
                  children: (
                    <>
                      <AddAuthButton>
                        <Button
                          type="primary"
                          icon={<PlusOutlined />}
                          onClick={() => {
                            history.push(
                              `/commodityAbility/classAndProperty/propertyValue/add?attrId=${
                                selectKey || query.attrId
                              }&attrName=${selectNode?._title || query.attrName}&isMultiple=${isMultiple}&type=${
                                selectNode?.type || query.type
                              }`,
                            )
                          }}
                        >
                          {intl.formatMessage({
                            id: 'classAndProperty.propertyValue.standardTable.formilyChilds.button',
                          })}
                        </Button>
                      </AddAuthButton>
                    </>
                  ),
                }}
              />
            )}
          </Card>
        </Col>
      </Row>

      <ModalTable
        modalTitle={intl.formatMessage({ id: 'classAndProperty.propertyValue.modalTable' })}
        confirm={handleAsyncOk}
        cancel={handleAsyncCancel}
        visible={syncVisible}
        columns={syncColumns}
        rowSelection={rowSelection}
        fetchTableData={(params: any) => fetchPlatformData(params)}
        formilyProps={{
          ctx: {
            schema: syncSchema,
            components: { ModalSearch: Search, Submit },
            effects: ($, actions) => {
              actions.reset()
              useStateFilterSearchLinkageEffect($, actions, 'attributeGroupName', FORM_FILTER_PATH)
            },
          },
        }}
        resetModal={{
          destroyOnClose: true,
          confirmLoading: syncLoading,
        }}
        tableProps={{
          rowKey: 'id',
        }}
      />
    </PageHeaderWrapper>
  )
}

export default PropertyValue
