import React, { Fragment, RefObject, useEffect, useImperativeHandle, useState } from 'react'
import { LineTitle } from '@apps/components'
import CommodityDrawer from '@/pages/pageCustomized/components/drawers/commodityDrawer'
import { Button, message, Popconfirm, Space, Table } from 'antd'
import { DragIcon, PlusIcon } from '@linkseeks/icons'
import { produce } from '@apps/design-core'
import { getWebIntl } from '@apps/locales'
import { ColumnsType } from 'antd/lib/table'
import { CommodityItemType } from '@apps/design-ui/src/Web/CommodityFloor/goods'
import { arrayMove } from '@linkseeks/tools'
import cloneDeep from 'lodash/cloneDeep'
import TableRow from '../MallNav/TableRow'
import { DndContextProvider, useDnd } from '../MallNav/useDnd'
import styles from './index.less'

export interface GoodsActionType {
  getList: () => CommodityItemType[]
}

interface IProps {
  commodityList: CommodityItemType[]
  onChange?: () => void
  actionRef?: RefObject<GoodsActionType>
}

const Goods: React.FC<IProps> = (props) => {
  const { commodityList, actionRef, onChange } = props
  const [list, setList] = useState<CommodityItemType[]>([])
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const translate = getWebIntl()
  const dndProps = useDnd()

  const updateList = (list: any[]) => {
    setList(list)
    onChange?.()
  }

  useImperativeHandle(actionRef, () => ({
    getList: () => {
      return list
    },
  }))

  useEffect(() => {
    if (commodityList && commodityList.length > 0) {
      setList(cloneDeep(commodityList))
    }
  }, [commodityList])

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (active.id !== over.id) {
      const oldIndex = list.findIndex((v) => v.commodityId === active.id)
      const newIndex = list.findIndex((v) => v.commodityId === over.id)
      updateList(arrayMove(list, oldIndex, newIndex))
    }
  }

  const handleDeleteItem = (sort: number) => {
    updateList(list.filter((item) => item.sort !== sort))
  }

  const commodityColumns: ColumnsType<CommodityItemType> = [
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
      title: 'ID',
      dataIndex: 'commodityId',
    },
    {
      title: translate('web.resource.commodity.name'),
      dataIndex: 'commodityName',
    },
    {
      title: translate('web.resource.shop.guishupinlei'),
      dataIndex: 'commodityCategory',
    },
    {
      title: translate('web.common.control'),
      dataIndex: 'option',
      width: 130,
      render: (_, record) => (
        <Space>
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

  const onChooseCommodityConfirm = (chooseList: any) => {
    const sortList = produce(list, (oldList) => {
      return oldList.sort((a, b) => (b.sort > a.sort ? -1 : 1))
    })
    const newSort = sortList.length > 0 ? sortList[sortList.length - 1].sort : 0

    const newList: CommodityItemType[] = chooseList.map((item, index) => ({
      sort: newSort + (index + 1),
      priceType: item.priceType,
      storeId: item.storeId,
      commodityId: item.id,
      commodityName: item.name,
      commodityPicUrl: item.mainPic,
      commodityPrice: item.min,
      commodityCategory: item.customerCategoryName,
    }))
    if ([...list, ...newList].length > 10) {
      message.info(translate('web.resource.shop.zuiduotuijiancountgeshangpin' as never, { count: 10 }))
      return
    }
    updateList([...list, ...newList])
    setModalVisible(false)
  }

  return (
    <Fragment>
      <LineTitle
        style={{ marginTop: 24 }}
        extra={
          <Button
            type="primary"
            icon={<PlusIcon />}
            onClick={() => {
              setModalVisible(true)
            }}
          >
            {translate('web.common.addResource')}
          </Button>
        }
      >
        <span>{translate('web.resource.shop.tuijianshangpinpeizhi')}</span>
      </LineTitle>
      <DndContextProvider {...dndProps} handleDragEnd={handleDragEnd} items={list.map((item) => item.commodityId)}>
        <Table
          rowKey="commodityId"
          columns={commodityColumns}
          dataSource={list}
          pagination={false}
          components={{
            body: {
              row: TableRow,
            },
          }}
        />
      </DndContextProvider>
      <CommodityDrawer
        selectId={list.map((item) => item.commodityId)}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={onChooseCommodityConfirm}
        selectType="checkbox"
        showActivity={false}
      />
    </Fragment>
  )
}

export default Goods
