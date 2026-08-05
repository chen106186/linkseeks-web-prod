import React, { useState, useRef, useEffect } from 'react'
import { Modal, message, Button, Drawer } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { getCommodityAdornWebPlatformFindStoreList } from '@apps/apis'
import { clearSelectedStatus, changeProps } from '@apps/design-core'
import { GlobalConfig } from '@/global/config'
import ShopItem, { MerchantItem } from './ShopItem'
import styles from './index.less'
import SettingPanel from '../../../../components/SettingPanel'
import SettingList from '../../../../components/SettingList'
import { filterPropsFunction } from '../../../../utils'

interface NewSelectItemType {
  value: number
  label: string
}

interface PlatformGoodsProps {
  dataList: MerchantItem[]
  adornId: number
}

const PlatformBrand: React.FC<PlatformGoodsProps> = (props) => {
  const { adornId } = props
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const [newProps, setNewProps] = useState(props)
  const { dataList } = newProps
  const [selectDrawerVisible, setSelectDrawerVisible] = useState<boolean>(false)
  const [mallSelectList, setMallSelectList] = useState<NewSelectItemType[]>([])
  const ref = useRef({} as ActionType)

  const initMallList = (mallList: any[]) => {
    if (!mallList) {
      return []
    }
    const newList: NewSelectItemType[] = []
    for (const item of mallList) {
      const tempItem: NewSelectItemType = {
        label: item.name,
        value: item.id,
      }
      newList.push(tempItem)
    }
    return newList
  }

  useEffect(() => {
    const enterpriseMallList = GlobalConfig.web.shopInfo.filter((item) => item.type === 1 && item.environment === 1)
    setMallSelectList(initMallList(enterpriseMallList))
  }, [])

  const changeNewProps = (key: string, data: any) => {
    const newProps = filterPropsFunction(props)
    newProps[key] = data
    setNewProps(newProps)
  }

  useEffect(() => {
    console.log(newProps)
  }, [newProps])

  const handleCancel = () => {
    if (JSON.stringify(props) !== JSON.stringify(newProps)) {
      Modal.confirm({
        content: '您还没有保存修改的内容，是否确认关闭？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          clearSelectedStatus()
        },
      })
    } else {
      clearSelectedStatus()
    }
  }

  const handleConfirmSave = () => {
    changeProps({
      props: newProps,
    })
    clearSelectedStatus()
  }

  const handleDrawerClose = () => {
    setSelectDrawerVisible(false)
  }

  // 表头
  const columns: RecordColumns<any>[] = [
    {
      title: 'ID',
      key: 'id',
      dataIndex: 'id',
      width: 128,
    },
    {
      title: '店铺logo',
      key: 'logo',
      dataIndex: 'logo',
      width: 88,
      searchField: {
        name: 'shopId',
        type: 'Select',
        valueEnum: mallSelectList,
        title: '商城',
      },
      render: (logoUrl) => <img width={32} height={32} src={logoUrl} />,
    },
    {
      title: '店铺名称',
      key: 'memberName',
      dataIndex: 'memberName',
      searchField: {
        type: 'Input',
        name: 'name',
      },
    },
  ]

  const fetchData = (params: any) => {
    return new Promise((resolve) => {
      params.type = 0
      params.adornId = adornId
      const idList = dataList.map((item) => item.id)
      params.storeIdList = idList || []
      getCommodityAdornWebPlatformFindStoreList(params).then((res) => {
        const { data } = res
        resolve(data)
      })
    })
  }

  const handleConfirmSelect = () => {
    if (ref.current?.selectionKeys?.length > 6 || [...dataList, ...ref.current?.getSelectionItems()].length > 6) {
      message.info('最多选择推荐6个实力商家')
      return
    } else {
      changeNewProps('dataList', [...dataList, ...ref.current?.getSelectionItems()])
      setSelectDrawerVisible(false)
      ref.current.setSelectionKeys([])
    }
  }

  const handleBrandItemChange = (val: string, brandItem: MerchantItem) => {
    const newList = [...dataList]
    newList.forEach((item) => {
      if (item.id === brandItem.id) {
        item['describe'] = val
      }
    })
    changeNewProps('dataList', newList)
  }

  const handleBrandDelete = (brandItem: MerchantItem) => {
    const newList: MerchantItem[] = []
    dataList.forEach((item) => {
      if (item.id !== brandItem.id) {
        newList.push(item)
      }
    })
    changeNewProps('dataList', newList)
  }

  return (
    <SettingPanel confirmLoading={confirmLoading} onCancel={handleCancel} onOK={handleConfirmSave}>
      <div className={styles.platform_goods}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setSelectDrawerVisible(true)
          }}
          style={{ marginBottom: 16 }}
        >
          添加推荐商家
        </Button>

        <SettingList size="small" type="select">
          {dataList &&
            dataList.map((item) => (
              <SettingList.SettingItem
                size="small"
                // onDelete={() => handleDeleteSelect(item)}
                key={`setting_item_${item.id}`}
              >
                <ShopItem dataInfo={item} onChange={handleBrandItemChange} onDelete={handleBrandDelete} />
              </SettingList.SettingItem>
            ))}
        </SettingList>

        <Drawer
          title="选择推荐商家"
          width={800}
          onClose={handleDrawerClose}
          visible={selectDrawerVisible}
          className={styles.selectDrawer}
        >
          <SettingPanel
            confirmLoading={confirmLoading}
            onCancel={() => setSelectDrawerVisible(false)}
            onOK={handleConfirmSelect}
          >
            <StandardFormTable
              columns={columns}
              autoScrollX
              request={(params) => fetchData(params)}
              rowKey="id"
              actionRef={ref}
              isRowSelection
              initalValue={{
                shopId: mallSelectList && mallSelectList.length > 0 ? mallSelectList[0].value : undefined,
              }}
            />
          </SettingPanel>
        </Drawer>
      </div>
    </SettingPanel>
  )
}

export default PlatformBrand
