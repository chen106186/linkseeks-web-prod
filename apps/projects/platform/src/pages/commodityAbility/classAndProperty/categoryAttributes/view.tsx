import React, { useState, useRef, useEffect, RefObject } from 'react'
import { Row, Col, Popconfirm, Button, Card, message } from 'antd'
import { PlusOutlined, EyeOutlined, HolderOutlined } from '@ant-design/icons'
import { useLocation } from '@linkseeks/router-core'
import { ModalFormTableRef, PageHeaderWrapper, StandardFormTable } from '@apps/components'
import { EyeAuthButton, ModalFormTable } from '@apps/components'
import { getIntl, useIntl } from '@linkseeks/i18n'
import StandardTable from '@/components/StandardTable'
import { ColumnType } from 'antd/lib/table/interface'
import styles from './index.less'
import TabTree from '@/components/TabTree'
import { useTreeTabs } from '@/hooks/useTreeTabs'
import {
  getProductCustomerGetCustomerAttributeList,
  getProductCustomerGetCustomerCategoryAttributeList,
  getProductCustomerGetCustomerCategoryTree,
  postProductCustomerDeleteCustomerCategoryAttribute,
  postProductCustomerSaveCustomerCategoryAttribute,
  postProductCustomerSaveCustomerCategoryAttributeSort,
} from '@apps/apis'
import { ISchema } from '@apps/formily'
import Sortable, { SortableEvent } from 'sortablejs'
import { arrayMoveImmutable } from '@/utils'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton } from '@apps/components'
import { useWebIntl } from '@apps/locales'

const fetchCategoryTreeData = async (params?) => {
  const res = await getProductCustomerGetCustomerCategoryTree()
  return res
}

interface IPage {
  current: number
  pageSize: number
}
const CategoryAttributes: React.FC<{}> = () => {
  const intl = useIntl()
  const ref = useRef<any>({})
  const refLink = ModalFormTable.useTableRef()
  const { pathname } = useLocation()
  const currentCategoryRef = useRef<number>() // 保存最新的品类id
  const [selectKey, setSelectKey] = useState(undefined)
  const [selectNode, setSelectNode] = useState<any>()
  const [linkLoading, setLinkLoading] = useState(false)
  const flag = useRef<boolean>(false) // 标识 初始点击品类不执行effect的重载表格
  const [dataSource, setDataSource] = useState<any>([]) // 拖拽表格排序当前页数据
  const sorttableRef = useRef<Sortable>()
  const currentPage = useRef<IPage>({ current: 1, pageSize: 10 })

  const translate = useWebIntl()
  const {
    treeStatus,
    setTreeStatus,
    treeData,
    setIsEditForm, //是否编辑状态
    nodeRecord,
    setNodeRecord,
    handleSelect,
    getTreeMaps,
    setTreeMaps,
    resetMenu,
  } = useTreeTabs({
    fetchMenuData: fetchCategoryTreeData,
  })

  // 获取选中项的关联属性列表
  useEffect(() => {
    if (selectKey && flag.current) {
      ref.current.reloadCurrent()
    } else if (!selectKey) {
      flag.current = false
    } else {
      flag.current = true
    }
  }, [selectKey])

  const fetchLinkAttributeData = (params) => {
    currentPage.current = { current: params.current, pageSize: params.pageSize }
    return new Promise((resolve) => {
      getProductCustomerGetCustomerCategoryAttributeList({
        ...params,
        categoryId: selectKey,
        name: params.name || '',
      }).then(({ data }) => {
        if (data) {
          resolve(data)
          setDataSource(() => [...data.data])
        } else {
          resolve([])
        }
      })
    })
  }

  // 获取所有属性列表
  const fetchAttributeData = (params) => {
    if (!selectKey) return
    return new Promise((resolve) => {
      getProductCustomerGetCustomerAttributeList({
        ...params,
        name: params.name || '',
      }).then((res) => {
        if (res.code === 1000 && res.data) {
          resolve(res.data)
        } else {
          resolve({
            data: [],
            totalCount: 0,
          })
        }
      })
    })
  }

  const handleSelectOk = () => {
    const customerAttributeList = refLink.current?.getSelectionItems()
    if (!customerAttributeList.length) {
      message.info(translate('web.common.selectOneRequest'))
      return
    }
    refLink.current?.setVisible(false)
    refLink.current?.clearSelection()
    setLinkLoading(true)
    postProductCustomerSaveCustomerCategoryAttribute({
      customerCategoryId: selectKey,
      customerAttributeIds: customerAttributeList.map((item) => item.id),
    }).then((res) => {
      setLinkLoading(false)
      if (res.code === 1000) {
        setTimeout(() => ref.current.reloadCurrent(), 500)
      }
    })
  }

  const handleSelectCancel = () => {
    refLink.current?.setVisible(false)
    refLink.current?.clearSelection()
    setLinkLoading(false)
  }

  const columns: ColumnType<any>[] = [
    {
      title: translate('web.common.sort'),
      dataIndex: 'order',
      width: 60,
      render: () => <HolderOutlined className={styles.dragIcon} />,
    },
    {
      title: translate('web.common.sortIndex'),
      dataIndex: 'sort',
      key: 'sort',
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: intl.formatMessage({ id: 'classAndProperty.categoryAttributes.columns.name' }),
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <EyeAuthButton
          type={authUrl(pathname, 'detail') ? 'link' : 'button'}
          url={`/commodityAbility/classAndProperty/categoryAttributes/detail?id=${record.id}`}
        >
          {text}
        </EyeAuthButton>
      ),
    },
    {
      title: intl.formatMessage({ id: 'classAndProperty.categoryAttributes.columns.groupName' }),
      dataIndex: 'groupName',
      key: 'groupName',
    },
    {
      title: translate('web.resource.commodity.shifouguigeshuxing'),
      dataIndex: 'isPrice',
      key: 'isPrice',
      render: (text) =>
        text
          ? intl.formatMessage({ id: 'classAndProperty.attribute.columns.isEmpty.1' })
          : intl.formatMessage({ id: 'classAndProperty.attribute.columns.isEmpty.2' }),
    },
    {
      title: intl.formatMessage({ id: 'classAndProperty.categoryAttributes.columns.type' }),
      dataIndex: 'type',
      key: 'type',
      render: (text) => {
        const text_arr = [
          '',
          intl.formatMessage({ id: 'classAndProperty.categoryAttributes.columns.type.1' }),
          intl.formatMessage({ id: 'classAndProperty.categoryAttributes.columns.type.2' }),
          intl.formatMessage({ id: 'classAndProperty.categoryAttributes.columns.type.3' }),
        ]
        return text_arr[text]
      },
    },
    {
      title: intl.formatMessage({ id: 'classAndProperty.categoryAttributes.columns.isEmpty' }),
      dataIndex: 'isMust',
      key: 'isMust',
      render: (text) => (
        <>
          {text
            ? intl.formatMessage({ id: 'classAndProperty.categoryAttributes.columns.isEmpty.1' })
            : intl.formatMessage({ id: 'classAndProperty.categoryAttributes.columns.isEmpty.2' })}
        </>
      ),
    },
    {
      title: intl.formatMessage({ id: 'classAndProperty.categoryAttributes.columns.isEnable' }),
      dataIndex: 'isEnable',
      key: 'isEnable',
      render: (text) =>
        text
          ? intl.formatMessage({ id: 'classAndProperty.categoryAttributes.columns.isEnable.1' })
          : intl.formatMessage({ id: 'classAndProperty.categoryAttributes.columns.isEnable.2' }),
    },
    {
      title: intl.formatMessage({ id: 'classAndProperty.categoryAttributes.columns.option' }),
      dataIndex: 'option',
      render: (text, record) => {
        return (
          <>
            <EditAuthButton>
              <Popconfirm
                title={intl.formatMessage({ id: 'classAndProperty.categoryAttributes.columns.popconfirm' })}
                onConfirm={() => clickRelief(record.id)}
                okText={intl.formatMessage({ id: 'classAndProperty.categoryAttributes.columns.okText' })}
                cancelText={intl.formatMessage({ id: 'classAndProperty.categoryAttributes.columns.cancelText' })}
              >
                <Button type="link">
                  {intl.formatMessage({ id: 'classAndProperty.categoryAttributes.columns.button' })}
                </Button>
              </Popconfirm>
            </EditAuthButton>
          </>
        )
      },
    },
  ]

  const columnsLink = StandardFormTable.createColumns([
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: intl.formatMessage({ id: 'classAndProperty.categoryAttributes.columnsLink.name' }),
      dataIndex: 'name',
      key: 'name',
      searchField: 'Input',
    },
    {
      title: intl.formatMessage({ id: 'classAndProperty.categoryAttributes.columnsLink.groupName' }),
      dataIndex: 'groupName',
      key: 'groupName',
      searchField: {
        main: true,
      },
    },
    {
      title: intl.formatMessage({ id: 'classAndProperty.categoryAttributes.columnsLink.type' }),
      dataIndex: 'type',
      key: 'type',
      render: (text) => {
        const text_arr = [
          '',
          intl.formatMessage({ id: 'classAndProperty.categoryAttributes.columnsLink.type.1' }),
          intl.formatMessage({ id: 'classAndProperty.categoryAttributes.columnsLink.type.2' }),
          intl.formatMessage({ id: 'classAndProperty.categoryAttributes.columnsLink.type.3' }),
        ]
        return text_arr[text]
      },
    },
    {
      title: intl.formatMessage({ id: 'classAndProperty.categoryAttributes.columnsLink.isEmpty' }),
      dataIndex: 'isMust',
      key: 'isMust',
      render: (text) => (
        <>
          {text
            ? intl.formatMessage({ id: 'classAndProperty.categoryAttributes.columnsLink.isEmpty.1' })
            : intl.formatMessage({ id: 'classAndProperty.categoryAttributes.columnsLink.isEmpty.2' })}
        </>
      ),
    },
  ])

  const clickRelief = (paramsId: number) => {
    if (!currentCategoryRef.current) return
    postProductCustomerDeleteCustomerCategoryAttribute({
      customerCategoryId: +currentCategoryRef.current,
      customerAttributeIds: [paramsId],
    }).then((res) => {
      if (res.code === 1000) {
        ref.current.reloadCurrent()
      }
    })
  }

  const handleNewLink = () => {
    refLink.current?.setVisible(true)
    refLink.current?.clearSelection()
    refLink.current?.reload()
  }

  const onHandleSelect = (key, node) => {
    setSelectKey(key)
    setSelectNode(node)
    currentCategoryRef.current = key
  }

  const tableRef = useRef<HTMLElement>()
  useEffect(() => {
    if (sorttableRef.current?.el && sorttableRef.current?.destroy) {
      // 销毁之前的实例
      sorttableRef.current.destroy()
    }
    const element = document.querySelector('#dragTable tbody') as HTMLElement
    const data = [...dataSource]
    if (element && data.length) {
      sorttableRef.current = Sortable.create(element, {
        animation: 300,
        draggable: 'tr',
        //拖动结束
        onEnd: (evt: SortableEvent) => {
          console.log('before:', data)
          const start = evt.oldIndex || 0
          const end = evt.newIndex || 0
          const result = arrayMoveImmutable([].concat(data), start, end)
          setDataSource([...result])
          const { current, pageSize } = currentPage.current
          const params = result.map((item, index) => ({
            categoryId: currentCategoryRef.current,
            attributeId: item['id'],
            sort: index + (current - 1) * pageSize,
          }))
          console.log('after:', result, params)
          postProductCustomerSaveCustomerCategoryAttributeSort(params).then(({ code }) => {
            if (code === 1000) {
              setTimeout(() => {
                ref.current.reloadCurrent()
              }, 1000)
            }
          })
        },
      })
    }
  }, [tableRef.current, dataSource])

  return (
    <PageHeaderWrapper>
      <Row gutter={[24, 36]}>
        <Col span={8}>
          {/* 商品品类列表 */}
          <Card>
            <div className="mb-30">{intl.formatMessage({ id: 'classAndProperty.categoryAttributes.tabTree' })}</div>
            {treeData && treeData.length > 0 ? (
              <TabTree
                fetchData={(params) => fetchCategoryTreeData(params)}
                treeData={treeData}
                handleSelect={(key, node) => onHandleSelect(key, node)}
                customKey="id"
              />
            ) : (
              <>{intl.formatMessage({ id: 'classAndProperty.categoryAttributes.tabTree.none' })}</>
            )}
          </Card>
        </Col>
        <Col span={16}>
          {selectKey && (
            <div className={styles.innerBox}>
              <StandardTable
                columns={columns}
                currentRef={ref}
                fetchTableData={(params) => fetchLinkAttributeData(params)}
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
                              id: 'classAndProperty.categoryAttributes.formilyProps.name',
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
                        <Button type="primary" icon={<PlusOutlined />} onClick={handleNewLink}>
                          {intl.formatMessage({ id: 'classAndProperty.categoryAttributes.formilyChilds.button' })}
                        </Button>
                      </AddAuthButton>
                    </>
                  ),
                }}
                tableProps={{
                  rowKey: 'id',
                  id: 'dragTable',
                  ref: tableRef,
                }}
              />
            </div>
          )}
        </Col>
        <ModalFormTable
          actionRef={refLink}
          request={(params) => fetchAttributeData(params)}
          columns={columnsLink}
          modalTitle={intl.formatMessage({ id: 'classAndProperty.categoryAttributes.modalTable' })}
          rowKey="id"
          isRowSelection
          onOk={handleSelectOk}
          onClose={handleSelectCancel}
          loading={linkLoading}
        />
      </Row>
    </PageHeaderWrapper>
  )
}

export default CategoryAttributes
