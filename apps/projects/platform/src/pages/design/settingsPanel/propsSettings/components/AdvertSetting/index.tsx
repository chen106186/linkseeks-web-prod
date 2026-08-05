import React, { forwardRef, useState, useEffect } from 'react'
import { Button, Form, message, Popconfirm, Space } from 'antd'
import { ImageBox, LineTitle } from '@apps/components'
import { Modal } from 'antd'
import isEmpty from 'lodash/isEmpty'
import cloneDeep from 'lodash/cloneDeep'
import { clearSelectedStatus, changeProps, produce } from '@apps/design-core'
import { getWebIntl } from '@apps/locales'
import { DragIcon, PlusIcon } from '@linkseeks/icons'
import { DndContextProvider, useDnd } from '../MallNav/useDnd'
import { Table } from '@linkseeks/ui'
import { ColumnsType } from 'antd/lib/table'
import { arrayMove } from '@linkseeks/tools'
import moment from 'moment'
import { AdvertItem, NAV_TYPE } from '@apps/design-ui'
import { LAYOUT_TYPE } from '@apps/design-ui/src/Web/constants'
import TableRow from '../MallNav/TableRow'
import { getTypeName } from '../MallNav/constants'
import SettingPanel from '../../../../components/SettingPanel'
import CommonItemModal, { ModalFormType } from '../CommonItemModal'
import styles from './index.less'
import { resetListSort } from '@/pages/design/utils'

interface AdvertSettingPropsType {
  advertList: AdvertItem[]
  onChange: Function
  layoutType: LAYOUT_TYPE
  type: 'top' | 'banner' | 'interact' | 'category' | 'service' | number
}

const AdvertSetting: React.FC<AdvertSettingPropsType> = forwardRef((props, ref) => {
  const { advertList = [], type, layoutType } = props
  const [list, setList] = useState<AdvertItem[]>([])
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [optionType, setOptionType] = useState<'add' | 'edit'>('add')
  const [changeState, setChangeState] = useState<boolean>(false)
  const dndProps = useDnd()
  const [form] = Form.useForm()
  const translate = getWebIntl()

  useEffect(() => {
    if (!isEmpty(advertList)) {
      const newList: AdvertItem[] = cloneDeep(advertList)
      if (newList) {
        setList(
          newList.map((item, index) => {
            item.sort = index + 1
            return item
          }),
        )
      }
    }
  }, [advertList])

  const updateList = (list: AdvertItem[]) => {
    setList(list)
    setChangeState(true)
  }

  const handleDeleteItem = (sort: number) => {
    updateList(list.filter((item) => item.sort !== sort))
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

  const handleConfirmSave = (e: any) => {
    e.preventDefault()
    if (!changeState) {
      clearSelectedStatus()
      return
    }

    changeProps({
      props: {
        type,
        advertList: resetListSort(list),
        linkdisable: true,
      },
    })
    clearSelectedStatus()
  }

  const handleEdit = (record: AdvertItem) => {
    setOptionType('edit')
    setModalVisible(true)
    form.setFieldsValue({
      ...record,
    })
    if (record.effectiveStartTime || record.effectiveEndTime) {
      form.setFieldValue('effectiveTime', [moment(record.effectiveStartTime), moment(record.effectiveEndTime)])
    }
  }

  const columns: ColumnsType<AdvertItem> = [
    {
      title: translate('web.common.sort'),
      dataIndex: 'sort',
      render: () => (
        <div className={styles['drag-btn']}>
          <DragIcon size={16} />
        </div>
      ),
    },
    {
      title: translate('web.common.tupian'),
      dataIndex: 'picUrl',
      render: (picUrl) => <ImageBox width={66} height={40} src={picUrl} />,
    },
    {
      title: translate('web.common.name'),
      dataIndex: 'name',
    },
    {
      title: translate('web.resource.shop.tiaozhuanleixing'),
      dataIndex: 'type',
      render: (type, record) => {
        if (layoutType === LAYOUT_TYPE.shop && record.type === NAV_TYPE.mallHome) {
          return translate('web.resource.shop.dianpushouye')
        } else {
          return getTypeName(type, record.valueText)
        }
      },
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

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (active.id !== over.id) {
      const oldIndex = list.findIndex((v) => v.sort === active.id)
      const newIndex = list.findIndex((v) => v.sort === over.id)
      updateList(arrayMove(list, oldIndex, newIndex))
    }
  }

  const handleModalConfirm = () => {
    form.validateFields().then((values) => {
      const effectiveStartTime = values.effectiveTime
        ? moment(values.effectiveTime[0]).format('yyyy-MM-DD HH:mm:ss')
        : undefined
      const effectiveEndTime = values.effectiveTime
        ? moment(values.effectiveTime[1]).format('yyyy-MM-DD HH:mm:ss')
        : undefined
      if (optionType === 'add') {
        const sortList = produce(list, (oldList) => {
          return oldList.sort((a, b) => (b.sort > a.sort ? -1 : 1))
        })
        const newSort = sortList.length > 0 ? sortList[sortList.length - 1].sort + 1 : 1
        updateList([
          ...list,
          {
            ...values,
            sort: newSort,
            effectiveStartTime,
            effectiveEndTime,
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
              listItem.picUrl = values.picUrl
              listItem.effectiveStartTime = effectiveStartTime
              listItem.effectiveEndTime = effectiveEndTime
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
    <SettingPanel onCancel={handleCancel} onOK={handleConfirmSave}>
      <LineTitle
        extra={
          <Button
            type="primary"
            icon={<PlusIcon />}
            onClick={() => {
              if (type === 3 && list.length >= 2) {
                message.error(translate('web.resource.mall.zuiduozhichitianjiage', { count: 2 }))
                return
              }
              setOptionType('add')
              setModalVisible(true)
            }}
          >
            {translate('web.common.addResource')}
          </Button>
        }
      >
        <span>{translate('web.resource.commodity.tupianbianji')}</span>
        {type !== 3 && (
          <label className={styles['line-subtitle']}>{translate('web.resource.shop.duoyuyzhangshizidonglunbo')}</label>
        )}
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
        title={optionType === 'add' ? translate('web.common.addResource') : translate('web.common.edit')}
        visible={modalVisible}
        layoutType={layoutType}
        formSchema={[
          {
            type: ModalFormType.Input,
            name: 'sort',
            hidden: true,
          },
          {
            type: ModalFormType.Upload,
            label: translate('web.common.tupian'),
            name: 'picUrl',
            rules: [
              {
                required: true,
                message: translate('web.resource.shop.qingshangchuantupian'),
              },
            ],
          },
          {
            type: ModalFormType.Input,
            name: 'name',
            label: translate('web.common.name'),
            rules: [
              {
                required: true,
                message: translate('web.common.qingshuru'),
              },
            ],
          },
          {
            type: ModalFormType.DateRange,
            name: 'effectiveTime',
            label: translate('web.resource.shop.youxiaoqi'),
          },
          {
            type: ModalFormType.NavType,
            name: 'type',
            label: translate('web.resource.shop.daohangleixing'),
            rules: [
              {
                required: true,
                message: translate('web.common.qingxuanze'),
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
})

AdvertSetting.displayName = 'AdvertSetting'

export default AdvertSetting
