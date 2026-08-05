import React, { useState, useRef, useEffect } from 'react'
import { Modal, message, Button, Drawer } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { getCommodityAdornWebPlatformFindBrandList, getCommodityWebShopWebAll } from '@apps/apis'
import { clearSelectedStatus, changeProps } from '@apps/design-core'
import { GlobalConfig } from '@/global/config'
import BrandItem, { BrandItemType } from './BrandItem'
import styles from './index.less'
import SettingPanel from '../../../../components/SettingPanel'
import SettingList from '../../../../components/SettingList'
import { filterPropsFunction } from '../../../../utils'

interface PlatformGoodsProps {
  dataList: BrandItemType[]
  adornId: number
}

interface NewSelectItemType {
  value: number
  label: string
}

const PlatformBrand: React.FC<PlatformGoodsProps> = (props) => {
  const { adornId } = props
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const [newProps, setNewProps] = useState(props)
  const { dataList } = newProps
  const [selectDrawerVisible, setSelectDrawerVisible] = useState<boolean>(false)
  const [mallSelectList, setMallSelectList] = useState<NewSelectItemType[]>([])
  const [shopId, setShopId] = useState<number>()
  const ref = useRef({} as ActionType)

  const fetchMallData = async () => {
    const { code, data } = await getCommodityWebShopWebAll(
      {
        type: 1,
        isMemberType: false,
        environment: 1,
      } as any,
      { ctlType: 'none' },
    )
    if (code === 1000) {
      return data.map((_item) => {
        return {
          label: _item.name,
          value: _item.id,
        }
      })
    }
    return []
  }

  const initMallList = async () => {
    const mallList = await fetchMallData()
    if (!mallList) {
      return []
    }
    setShopId(mallList[0].value)
    setMallSelectList(mallList)
  }

  useEffect(() => {
    initMallList()
  }, [])

  const changeNewProps = (key: string, data: any) => {
    const newProps = filterPropsFunction(props)
    newProps[key] = data
    setNewProps(newProps)
  }

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
      key: 'brandId',
      dataIndex: 'brandId',
      width: 128,
    },
    {
      title: '品牌logo',
      key: 'brandLogo',
      dataIndex: 'brandLogo',
      width: 88,
      searchField: {
        type: 'Select',
        name: 'shopId',
        title: '商城',
        valueEnum: mallSelectList,
      },
      render: (brandLogo) => <img width={32} height={32} src={brandLogo} />,
    },
    {
      title: '品牌名称',
      key: 'brandName',
      dataIndex: 'brandName',
      searchField: 'Input',
    },
  ]

  const fetchData = (params: any) => {
    return new Promise((resolve) => {
      if (params.categoryId) {
        delete params.categoryId
      }
      params.type = 0
      params.adornId = adornId
      const idList = dataList.map((item) => item.brandId)
      params.brandIdList = (idList || []).join(',')
      if (params.shopId) {
        setShopId(params.shopId)
      }
      getCommodityAdornWebPlatformFindBrandList(params).then((res) => {
        const { data } = res
        resolve(data)
      })
    })
  }

  const handleConfirmSelect = () => {
    if (ref.current.selectionKeys.length > 12 || [...dataList, ...ref.current.getSelectionItems()].length > 12) {
      message.info('最多选择推荐12个品牌')
      return
    } else {
      const newList: BrandItemType[] = []
      for (const item of ref.current.getSelectionItems()) {
        newList.push({
          brandId: item.brandId,
          brandName: item.brandName,
          describe: '',
          brandLogo: item.brandLogo,
          shopId: shopId || 1,
        })
      }
      changeNewProps('dataList', [...dataList, ...newList])
      setSelectDrawerVisible(false)
      ref.current.setSelectionKeys([])
    }
  }

  const handleBrandItemChange = (val: string, brandItem: BrandItemType) => {
    const newList = [...dataList]
    newList.forEach((item) => {
      if (item.brandId === brandItem.brandId) {
        item.describe = val
      }
    })
    changeNewProps('dataList', newList)
  }

  const handleBrandDelete = (brandItem: BrandItemType) => {
    const newList: BrandItemType[] = []
    dataList.forEach((item) => {
      if (item.brandId !== brandItem.brandId) {
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
            if (ref.current.reload) {
              ref.current.reload()
            }
          }}
          style={{ marginBottom: 16 }}
        >
          添加推荐品牌
        </Button>

        <SettingList size="small" type="select">
          {dataList &&
            dataList.map((item) => (
              <SettingList.SettingItem
                size="small"
                // onDelete={() => handleDeleteSelect(item)}
                key={`setting_item_${item.brandId}`}
              >
                <BrandItem dataInfo={item} onChange={handleBrandItemChange} onDelete={handleBrandDelete} />
              </SettingList.SettingItem>
            ))}
        </SettingList>

        <Drawer
          title="选择品牌"
          width={800}
          onClose={handleDrawerClose}
          open={selectDrawerVisible}
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
              rowKey="brandId"
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
