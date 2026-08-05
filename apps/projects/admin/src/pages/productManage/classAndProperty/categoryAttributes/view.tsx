import React, { useState, useRef, useEffect } from 'react'
import { Row, Col, Popconfirm, Button, Modal, Card } from 'antd'
import { PlusOutlined, EyeOutlined, HolderOutlined } from '@ant-design/icons'
import { PageHeaderWrapper, AuthButton, StandardFormTable, ModalFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { history } from '@linkseeks/router-manager'
import styles from './index.less'
import TabTree from '@/components/TabTree'
import { useTreeTabs } from '@/hooks/useTreeTabs'
import {
  getProductPlatformGetAttributeList,
  getProductPlatformGetCategoryAttributeList,
  getProductPlatformGetCategoryTree,
  postProductPlatformDeleteCategoryAttribute,
  postProductPlatformSaveCategoryAttribute,
  postProductPlatformSaveCategoryAttributeSort,
} from '@apps/apis'
import type { SortableEvent } from 'sortablejs'
import Sortable from 'sortablejs'
import { arrayMoveImmutable } from '@/utils'

const fetchCategoryTreeData = async () => {
  const res = await getProductPlatformGetCategoryTree()
  return res
}

interface IPage {
  current: number
  pageSize: number
}
const CategoryAttributes: React.FC = () => {
  const ref = useRef({} as ActionType)
  const refLink = ModalFormTable.useTableRef()
  const currentCategoryRef = useRef<any>() // 保存最新的品类id
  const [selectKey, setSelectKey] = useState<any>()
  const [roleVisible, setRoleVisible] = useState(false)
  const [linkTableRowData, setLinkTableRowData] = useState<any[]>([])
  const flag = useRef<boolean>(false)
  const [dataSource, setDataSource] = useState<any>([]) // 表格当前拖曳数据
  const currentPage = useRef<IPage>({ current: 1, pageSize: 10 })

  const { treeData } = useTreeTabs({
    fetchMenuData: fetchCategoryTreeData,
  })

  // 获取选中项的关联属性列表
  useEffect(() => {
    if (selectKey && flag.current) {
      ref.current.reload()
    } else if (!selectKey) {
      flag.current = false
    } else {
      flag.current = true
    }
  }, [selectKey])

  const fetchLinkAttributeData = (params) => {
    currentPage.current = { current: params.current, pageSize: params.pageSize }
    return new Promise((resolve) => {
      getProductPlatformGetCategoryAttributeList({
        ...params,
        categoryId: selectKey,
        name: params.name || '',
      }).then((res) => {
        const sortList = res.data?.data.sort((a, b) => (b.sort > a.sort ? -1 : 1))
        resolve({ ...res.data, data: sortList.map((item, index) => ({ ...item, index })) })
        setLinkTableRowData(sortList)
        setDataSource(sortList)
      })
    })
  }

  // 获取所有属性列表 modal
  const fetchAttributeData = (params) => {
    return new Promise((resolve) => {
      getProductPlatformGetAttributeList({
        ...params,
        categoryId: selectKey,
        name: params.name || '',
      }).then((res) => {
        resolve(res.data)
      })
    })
  }

  const handleSee = (record) => {
    history.push(`/productManage/classAndProperty/categoryAttributes/detail?id=${record.id}`)
  }

  const handleSelectOk = () => {
    refLink.current?.setVisible(false)
    postProductPlatformSaveCategoryAttribute({
      categoryId: selectKey,
      attributeIds: refLink.current.selectionKeys,
    }).then((res) => {
      if (res.code === 1000) setTimeout(() => ref.current.reload(), 500)
    })
  }

  const handleSelectCancel = () => {
    refLink.current?.setVisible(false)
    refLink.current?.clearSelection()
  }

  const clickRelief = (paramsId: number) => {
    postProductPlatformDeleteCategoryAttribute({
      categoryId: currentCategoryRef.current,
      attributeIds: [paramsId],
    }).then(() => {
      ref.current.reload()
    })
  }

  const defaultColumns: RecordColumns<any>[] = [
    {
      title: '排序',
      key: 'order',
      width: 60,
      render: () => <HolderOutlined className={styles.dragIcon} />,
      fixed: 'left',
    },
    {
      title: '序号',
      dataIndex: 'sort',
      key: 'sort',
      fixed: 'left',
      width: 60,
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      fixed: 'left',
      width: 60,
    },
    {
      title: '属性名称',
      dataIndex: 'name',
      key: 'name',
      searchField: 'Input',
      render: (text, record) => (
        <span className="commonPickColor" onClick={() => handleSee(record)}>
          {text}&nbsp;
          <EyeOutlined />
        </span>
      ),
    },
    {
      title: '属性组名称',
      dataIndex: 'groupName',
      key: 'groupName',
    },
    {
      title: '是否规格属性',
      dataIndex: 'isPrice',
      key: 'isPrice',
      render: (text) => (text ? '是' : '否'),
    },
    {
      title: '展示方式',
      dataIndex: 'type',
      key: 'type',
      render: (text) => {
        const text_arr = ['', '单选', '多选', '输入']
        return text_arr[text]
      },
    },
    {
      title: '是否必填',
      dataIndex: 'isMust',
      key: 'isMust',
      render: (text) => <>{text ? '是' : '否'}</>,
    },
    {
      title: '状态',
      dataIndex: 'isEnable',
      key: 'isEnable',
      render: (text) => (text ? '有效' : '无效'),
    },
    {
      title: '操作',
      key: 'option',
      fixed: 'right',
      render: (text, record) => {
        return (
          <>
            <AuthButton type="custom" code="delete">
              <Popconfirm title="是否解除关联？" onConfirm={() => clickRelief(record.id)} okText="是" cancelText="否">
                <Button type="link">解除关联</Button>
              </Popconfirm>
            </AuthButton>
          </>
        )
      },
    },
  ]

  const defaultColumnsLink = StandardFormTable.createColumns([
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      fixed: 'left',
      width: 60,
    },
    {
      title: '属性名称',
      dataIndex: 'name',
      key: 'name',
      searchField: 'Search',
    },
    {
      title: '属性组名称',
      dataIndex: 'groupName',
      key: 'groupName',
      searchField: {
        main: true,
      },
    },
    {
      title: '展示方式',
      dataIndex: 'type',
      key: 'type',
      render: (text) => {
        const text_arr = ['', '单选', '多选', '输入']
        return text_arr[text]
      },
    },
    {
      title: '是否必填',
      dataIndex: 'isMust',
      key: 'isMust',
      render: (text) => <>{text ? '是' : '否'}</>,
    },
  ])

  const handleNewLink = () => {
    const linkArray: number[] = []
    linkTableRowData.forEach((item) => {
      linkArray.push(item.id)
    })
    refLink.current?.setVisible(true)
    refLink.current?.clearSelection()
  }

  const onHandleSelect = (key) => {
    setSelectKey(key)
    // setSelectNode(node)
    currentCategoryRef.current = key
  }

  const sorttableRef = useRef<Sortable>()
  const tableRef = useRef<HTMLElement>()
  useEffect(() => {
    if (sorttableRef.current?.el && sorttableRef.current?.destroy) {
      // 销毁之前的实例
      sorttableRef.current.destroy()
    }
    const element = document.querySelector('#dragTable tbody') as HTMLElement
    if (element && dataSource.length) {
      sorttableRef.current = Sortable.create(element, {
        animation: 300,
        //拖动结束
        onEnd: (evt: SortableEvent) => {
          console.log('before:', dataSource)
          const start = evt.oldIndex || 0
          const end = evt.newIndex || 0
          const result = arrayMoveImmutable([].concat(dataSource), start, end)
          setDataSource([...result])
          const { current, pageSize } = currentPage.current
          const params = result.map((item, index) => ({
            categoryId: currentCategoryRef.current,
            attributeId: item['id'],
            sort: index + (current - 1) * pageSize,
          }))
          console.log('after:', result, params)
          postProductPlatformSaveCategoryAttributeSort(params).then(({ code }) => {
            if (code === 1000) {
              setTimeout(() => {
                ref.current.reload()
              }, 1000)
            }
          })
        },
      })
    }
  }, [tableRef.current, dataSource])

  return (
    <PageHeaderWrapper backDom={false}>
      <Row gutter={[24, 36]}>
        <Col span={8}>
          {/* 商品品类列表 */}
          <Card>
            <div className="mb-30">选择要编辑的项目</div>
            {treeData && treeData.length > 0 ? (
              <TabTree
                fetchData={() => fetchCategoryTreeData()}
                treeData={treeData}
                handleSelect={(key, node) => onHandleSelect(key, node)}
                customKey="id"
              />
            ) : (
              <>暂无菜单</>
            )}
          </Card>
        </Col>
        <Col span={16}>
          {selectKey && (
            <div className={styles.innerBox}>
              <StandardFormTable
                columns={defaultColumns}
                autoScrollX
                request={(params) => fetchLinkAttributeData(params)}
                searchButtons={[
                  {
                    key: 'add',
                    children: '新建',
                    onClick() {
                      handleNewLink()
                    },
                    type: 'primary',
                    icon: <PlusOutlined />,
                  },
                ]}
                rowKey="id"
                actionRef={ref}
                tableProps={{
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
          columns={defaultColumnsLink}
          modalTitle={'关联属性'}
          rowKey="id"
          isRowSelection
          onOk={handleSelectOk}
          onClose={handleSelectCancel}
        />
        {/* <Modal
          title="关联属性"
          visible={roleVisible}
          onOk={handleSelectOk}
          onCancel={handleSelectCancel}
          okText="确认"
          cancelText="取消"
          width={704}
          destroyOnClose={true}
        >
          <StandardFormTable
            columns={defaultColumnsLink}
            autoScrollX
            request={(params) => fetchAttributeData(params)}
            rowKey="id"
            actionRef={refLink}
            isRowSelection
          />
        </Modal> */}
      </Row>
    </PageHeaderWrapper>
  )
}

export default CategoryAttributes
