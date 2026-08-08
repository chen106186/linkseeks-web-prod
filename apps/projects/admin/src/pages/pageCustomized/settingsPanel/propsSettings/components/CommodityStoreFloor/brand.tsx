import React, { Fragment, RefObject, useEffect, useImperativeHandle, useState } from 'react'
import { ImageBox, LineTitle } from '@apps/components'
import { Button, message, Popconfirm, Space, Table } from 'antd'
import { DragIcon, PlusIcon } from '@linkseeks/icons'
import { getWebIntl } from '@apps/locales'
import { ColumnsType } from 'antd/lib/table'
import { produce } from '@apps/design-core'
import MixDrawer from '@/pages/pageCustomized/components/drawers/mixDrawer'
import { BrandItemType } from '@apps/design-ui/src/Web/CommodityStoreFloor/brand'
import { arrayMove } from '@linkseeks/tools'
import cloneDeep from 'lodash/cloneDeep'
import TableRow from '../MallNav/TableRow'
import { DndContextProvider, useDnd } from '../MallNav/useDnd'
import styles from './index.less'

export interface BrandActionType {
  getList: () => BrandItemType[]
}

interface IProps {
  brandList: BrandItemType[]
  onChange?: () => void
  actionRef?: RefObject<BrandActionType>
}

const Brand: React.FC<IProps> = (props) => {
  const { brandList, actionRef, onChange } = props
  const [list, setList] = useState<BrandItemType[]>([])
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
    if (brandList && brandList.length > 0) {
      setList(cloneDeep(brandList))
    }
  }, [brandList])

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (active.id !== over.id) {
      const oldIndex = list.findIndex((v) => v.brandId === active.id)
      const newIndex = list.findIndex((v) => v.brandId === over.id)
      updateList(arrayMove(list, oldIndex, newIndex))
    }
  }

  const handleDeleteItem = (sort: number) => {
    updateList(list.filter((item) => item.sort !== sort))
  }

  const commodityColumns: ColumnsType<BrandItemType> = [
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
      dataIndex: 'brandLogo',
      render: (brandLogo) => {
        return <ImageBox src={brandLogo} width={32} height={32} />
      },
    },
    {
      title: translate('web.resource.shop.pinpaimingcheng'),
      dataIndex: 'brandName',
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

  const onChooseConfirm = (chooseList: any) => {
    const sortList = produce(list, (oldList) => {
      return oldList.sort((a, b) => (b.sort > a.sort ? -1 : 1))
    })
    const newSort = sortList.length > 0 ? sortList[sortList.length - 1].sort : 0

    const newList: BrandItemType[] = chooseList.map((item, index) => ({
      sort: newSort + (index + 1),
      /**
       * 品牌ID
       */
      brandId: item.id,
      /**
       * 品牌Logo
       */
      brandLogo: item.logoUrl,
      brandName: item.name,
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
        <span>{translate('web.resource.shop.tuijianpinpai')}</span>
      </LineTitle>
      <DndContextProvider {...dndProps} handleDragEnd={handleDragEnd} items={list.map((item) => item.brandId)}>
        <Table
          rowKey="brandId"
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
      <MixDrawer
        selectId={list.map((item) => item.brandId)}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={onChooseConfirm}
        selectType="checkbox"
        type={6}
        property={1}
        environment={1}
      />
    </Fragment>
  )
}

export default Brand
