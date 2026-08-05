import React, { useState, useEffect } from 'react'
import { Modal, Button, Switch, Space, Popconfirm, Form } from 'antd'
import { clearSelectedStatus, changeProps, produce } from '@apps/design-core'
import { isEmpty } from 'lodash'
import cloneDeep from 'lodash/cloneDeep'
import { LineTitle } from '@apps/components'
import { DragIcon, PlusIcon } from '@linkseeks/icons'
import { getWebIntl } from '@apps/locales'
import { NAV_TYPE, DEFAULT_SYSTEM_NAV } from '@apps/design-ui'
import { Table } from '@linkseeks/ui'
import { ColumnsType } from 'antd/lib/table'
import { arrayMove } from '@linkseeks/tools'
import { LAYOUT_TYPE } from '@apps/design-ui/src/Web/constants'
import SettingPanel from '../../../../components/SettingPanel'
import TableRow from './TableRow'
import { DndContextProvider, useDnd } from './useDnd'
import { getTypeName } from './constants'
import CommonItemModal, { ModalFormType } from '../CommonItemModal'
import styles from './index.less'
import { resetListSort } from '@/pages/design/utils'

interface MenuItemType {
  sort: number
  name: string
  link?: string
  status: boolean
  type: NAV_TYPE
  value?: string
  valueText?: string
}

interface MallNavProps {
  menuData: MenuItemType[]
  layoutType: LAYOUT_TYPE
}

const MallNav: React.FC<MallNavProps> = (props) => {
  const { menuData, layoutType, ...others } = props
  const [list, setList] = useState<MenuItemType[]>([])
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [optionType, setOptionType] = useState<'add' | 'edit'>('add')
  const [changeState, setChangeState] = useState<boolean>(false)
  const dndProps = useDnd()
  const translate = getWebIntl()
  const [form] = Form.useForm()

  useEffect(() => {
    if (!isEmpty(menuData)) {
      const newList: MenuItemType[] = cloneDeep(menuData)
      if (newList) {
        setList(
          newList.map((item, index) => {
            item.sort = index + 1
            return item
          }),
        )
      }
    }
  }, [menuData])

  const updateList = (list: MenuItemType[]) => {
    setList(list)
    setChangeState(true)
  }

  /**
   * 确认
   */
  const handleConfirm = (e) => {
    e.preventDefault()
    if (!changeState) {
      return
    }

    changeProps({
      props: {
        ...others,
        menuData: resetListSort(list),
      },
    })
    clearSelectedStatus()
  }

  const handleCancel = () => {
    if (changeState) {
      Modal.confirm({
        content: translate('web.common.ninhaiyouweibaocundeneirong'),
        okText: translate('web.common.confirm'),
        cancelText: translate('web.common.cancel'),
        onOk: () => {
          clearSelectedStatus()
        },
      })
    } else {
      clearSelectedStatus()
    }
  }

  const handleStatusChange = (checked: boolean, item: MenuItemType) => {
    const newList = list.map((listItem) => {
      if (listItem.sort === item.sort) {
        listItem.status = checked
      }
      return listItem
    })

    updateList(newList)
  }

  const handleDeleteItem = (sort: number) => {
    updateList(list.filter((item) => item.sort !== sort))
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (active.id !== over.id) {
      const oldIndex = list.findIndex((v) => v.sort === active.id)
      const newIndex = list.findIndex((v) => v.sort === over.id)
      updateList(arrayMove(list, oldIndex, newIndex))
    }
  }

  const handleEdit = (record: MenuItemType) => {
    setOptionType('edit')
    setModalVisible(true)
    form.setFieldsValue(record)
  }

  const columns: ColumnsType<MenuItemType> = [
    {
      title: translate('web.common.sort'),
      dataIndex: 'sort',
      width: 80,
      render: () => (
        <div className={styles['drag-btn']}>
          <DragIcon size={16} />
        </div>
      ),
    },
    {
      title: translate('web.resource.shop.daohangmingcheng'),
      dataIndex: 'name',
      width: 180,
    },
    {
      title: translate('web.resource.shop.daohangleixing'),
      dataIndex: 'type',
      render: (type, record) => {
        if (layoutType === LAYOUT_TYPE.shop && record.type === NAV_TYPE.mallHome) {
          return translate('web.resource.shop.dianpushouye')
        } else {
          return getTypeName(type, record.valueText)
        }
      },
      ellipsis: true,
    },
    {
      title: translate('web.resource.shop.shifouxianshi'),
      dataIndex: 'status',
      width: 120,
      render: (status, record) => (
        <Switch checked={status} onChange={(checked) => handleStatusChange(checked, record)} />
      ),
    },
    {
      title: translate('web.common.control'),
      dataIndex: 'option',
      width: 130,
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>
            {translate('web.common.edit')}
          </Button>
          <Popconfirm
            title={translate('web.common.shifouquerenshanchu')}
            onConfirm={() => handleDeleteItem(record.sort)}
          >
            <Button type="link">{translate('web.common.delete')}</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const handleModalConfirm = () => {
    form.validateFields().then((values) => {
      if (optionType === 'add') {
        const sortList = produce(list, (oldList) => {
          return oldList.sort((a, b) => (b.sort > a.sort ? -1 : 1))
        })
        const newSort = sortList.length > 0 ? sortList[sortList.length - 1]?.sort + 1 : 1
        updateList([
          ...list,
          {
            ...values,
            sort: newSort,
            status: true,
          },
        ])
      } else {
        const newList = produce(list, (oldList) => {
          oldList.map((listItem) => {
            if (listItem.sort === values.sort) {
              listItem.name = values.name
              listItem.type = values.type
              listItem.value = values.value
              listItem.valueText = values.valueText
            }
          })
          return oldList
        })
        updateList(newList)
      }
      setModalVisible(false)
      form.resetFields()
    })
  }

  return (
    <SettingPanel onCancel={handleCancel} onOK={handleConfirm}>
      <LineTitle
        extra={
          <Button
            type="primary"
            icon={<PlusIcon />}
            onClick={() => {
              setOptionType('add')
              setModalVisible(true)
            }}
          >
            {translate('web.common.addResource')}
          </Button>
        }
      >
        {translate('web.resource.shop.daohangpeizhi')}
      </LineTitle>
      <DndContextProvider {...dndProps} handleDragEnd={handleDragEnd} items={list.map((item) => item.sort)}>
        <Table
          rowKey="sort"
          columns={columns}
          dataSource={list}
          pagination={false}
          components={{
            body: {
              row: TableRow,
            },
          }}
        />
      </DndContextProvider>
      <CommonItemModal
        title={
          optionType === 'add'
            ? translate('web.resource.shop.tianjiadaohang')
            : translate('web.resource.shop.bianjidaohang')
        }
        layoutType={layoutType}
        visible={modalVisible}
        formSchema={[
          {
            type: ModalFormType.Input,
            name: 'sort',
            hidden: true,
          },
          {
            type: ModalFormType.Switch,
            name: 'status',
            hidden: true,
          },
          {
            type: ModalFormType.Input,
            name: 'name',
            label: translate('web.resource.shop.daohangmingcheng'),
            rules: [
              {
                required: true,
                message: translate('web.common.qingshuru'),
              },
            ],
          },
          {
            type: ModalFormType.NavType,
            name: 'type',
            label: translate('web.resource.shop.daohangleixing'),
            disabled: optionType === 'edit',
            rules: [
              {
                required: true,
                message: translate('web.common.qingxuanze'),
              },
              {
                validator(_, value) {
                  if (
                    value &&
                    optionType === 'add' &&
                    list.some((item) => DEFAULT_SYSTEM_NAV.includes(value) && item.type === value)
                  ) {
                    return Promise.reject(
                      new Error(translate('web.resource.shop.yicunzaixiangtongdexitongneizhidaohang')),
                    )
                  }
                  return Promise.resolve()
                },
              },
            ],
          },
        ]}
        form={form}
        onOk={handleModalConfirm}
        onCancel={() => {
          setModalVisible(false)
          form.resetFields()
        }}
      />
    </SettingPanel>
  )
}

export default MallNav
