import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { Modal, Input, Select, Button, Drawer, message, Radio } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { RadioChangeEvent } from 'antd/lib/radio/interface'
import cx from 'classnames'
import {
  getCommodityWebCategoryWebFindEnterpriseCategoryTree,
  getCommodityAdornWebPlatformFindCommodityList,
} from '@apps/apis'
import { clearSelectedStatus, changeProps, produce } from '@apps/design-core'
import { SketchPicker } from 'react-color'
import { UploadImage, StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import GoodsItem from './GoodsItem'
import SettingPanel from '../../../../components/SettingPanel'
import SettingList from '../../../../components/SettingList'
import useSelectOptions from './services/hooks/useSelectOptions'
import styles from './index.less'
import { MallItemType } from '@/pages/mallManage/services/types'

interface GoodsItemType {
  advertImg: string
  describe: string
  firstId: string | undefined
  goodsIdList: number[]
  goodsList?: any[]
  name: string
  memberId: number
  memberRoleId: number
  secondId: string | undefined
  shopId: number | undefined
  thirdId: string | undefined
  fontColor: string
}

interface CategoryItemType {
  id: string
  parentId: string
  name: string
  checked: boolean
  imageUrl: string
  children: CategoryItemType[]
}

interface PlatformGoodsProps {
  dataInfo: GoodsItemType
  adornId: number
}

const PlatformGoods: React.FC<PlatformGoodsProps> = (props) => {
  const { adornId } = props
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const [newProps, setNewProps] = useState(props)
  const { dataInfo } = newProps
  const [selectDrawerVisible, setSelectDrawerVisible] = useState<boolean>(false)
  const [categoryList, setCategoryList] = useState<CategoryItemType[]>([])
  const [secondCategoryList, setSecondCategoryList] = useState<CategoryItemType[]>([])
  const [thirdCategoryList, setThirdCategoryList] = useState<CategoryItemType[]>([])
  const [selectMallInfo, setSelectMallInfo] = useState<MallItemType>()
  const [categoryId, setCategoryId] = useState<string>()
  const [fontColor, setFontColor] = useState<string>()
  const ref = useRef({} as ActionType)
  const {
    mallList,
    brandData: _brandData,
    categoryData: _categoryData,
    fetchBranchData,
    fetchCategoryDate,
  } = useSelectOptions({ adornId, categoryId })

  const brandData = useMemo(() => {
    const transform = (list) =>
      list.map((v) => ({
        label: v.brandName,
        value: v.brandId,
      }))
    return _brandData ? transform(_brandData) : []
  }, [_brandData])

  const categoryData = useMemo(() => {
    const transform = (list) =>
      list.map((v) => ({
        label: v.name,
        value: v.id,
        children: v.children ? transform(v.children) : null,
      }))
    return _categoryData ? transform(_categoryData) : []
  }, [_categoryData])

  const initCategoryId = () => {
    if (dataInfo) {
      if (dataInfo.thirdId) {
        setCategoryId(dataInfo.thirdId)
      } else if (dataInfo.secondId) {
        setCategoryId(dataInfo.secondId)
      } else if (dataInfo.firstId) {
        setCategoryId(dataInfo.firstId)
      } else {
        setCategoryId(undefined)
      }
    }
  }

  useEffect(() => {
    if (mallList && mallList.length > 0) {
      // 默认选择默认企业商城
      const defaultEnterprise = mallList.find((item) => item.isDefault)
      if (defaultEnterprise) {
        setSelectMallInfo(defaultEnterprise)
      } else {
        setSelectMallInfo(mallList[0])
      }
    }
  }, [mallList])

  useEffect(() => {
    initCategoryId()
  }, [])

  useEffect(() => {
    if (fontColor) {
      const newDataInfo = produce(dataInfo, (oldDataInfo) => {
        oldDataInfo['fontColor'] = fontColor
      })
      changeNewProps('dataInfo', newDataInfo)
    }
  }, [fontColor])

  useEffect(() => {
    if (selectMallInfo) {
      fetchCategoryTree()
      fetchBranchData(selectMallInfo.id)
      fetchCategoryDate(selectMallInfo.id)
    }
  }, [selectMallInfo])

  const fetchCategoryTree = () => {
    const headers: any = {
      shopId: selectMallInfo?.id,
    }
    const param: any = {
      adornId,
    }
    getCommodityWebCategoryWebFindEnterpriseCategoryTree(param, {
      headers,
    }).then((res: any) => {
      setCategoryList(res.data || [])
      if (dataInfo.firstId) {
        for (const item of res.data) {
          if (item.id === dataInfo.firstId) {
            if (item.children) {
              setSecondCategoryList(item.children)
              if (dataInfo.secondId) {
                for (const secondItem of item.children) {
                  if (secondItem.id === dataInfo.secondId) {
                    if (secondItem.children) {
                      setThirdCategoryList(secondItem.children)
                    }
                  }
                }
              }
            }
          }
        }
      }
    })
  }

  const changeNewProps = (key: string, data: any) => {
    const newProps = { ...props }
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
    const result = produce(newProps, (old) => {
      old.dataInfo['visible'] = true
    })

    if (result.dataInfo.name) {
      let str = result.dataInfo.name
      str = str.replace(/[\u4e00-\u9fa5]/g, 'OO')
      const maxByte = 16
      if (str.length > maxByte) {
        message.error(`最多输入${maxByte}个字符，${Math.floor(maxByte / 2)}个汉字`)
        return
      }
    }

    if (result.dataInfo.describe) {
      let str = result.dataInfo.describe
      str = str.replace(/[\u4e00-\u9fa5]/g, 'OO')
      const maxByte = 28
      if (str.length > maxByte) {
        message.error(`最多输入${maxByte}个字符，${Math.floor(maxByte / 2)}个汉字`)
        return
      }
    }

    changeProps({
      props: result,
    })
    clearSelectedStatus()
  }

  const handleDrawerClose = () => {
    setSelectDrawerVisible(false)
  }

  const getMinPriceByRange = (range: string) => {
    if (range) {
      const minPrice = range.split('~')[0]
      return minPrice ? minPrice : 0
    }
    return 0
  }

  // 表头
  const columns: RecordColumns<any>[] = [
    {
      title: 'ID',
      key: 'commodityId',
      dataIndex: 'commodityId',
    },
    {
      title: '商品图片',
      key: 'commodityPicUrl',
      dataIndex: 'commodityPicUrl',
      // eslint-disable-next-line react/display-name
      render: (commodityPicUrl) => <img width={32} height={32} src={commodityPicUrl} />,
    },
    {
      title: '商品名称',
      key: 'commodityName',
      dataIndex: 'commodityName',
      searchField: {
        main: true,
        name: 'name',
      },
    },
    {
      title: '品类',
      key: 'categoryName',
      dataIndex: 'categoryName',
      searchField: {
        type: 'Cascader',
        name: 'categoryId',
        valueEnum: categoryData,
      },
    },
    {
      title: '品牌',
      key: 'brandName',
      dataIndex: 'brandName',
      searchField: {
        type: 'Select',
        name: 'brandId',
        title: '商品品牌',
        valueEnum: brandData,
      },
    },
    // {
    //   title: '单位',
    //   key: 'unitName',
    //   dataIndex: 'unitName',
    // },
    {
      title: '价格',
      key: 'priceRange',
      dataIndex: 'priceRange',
      searchField: {
        type: 'Input',
        name: 'memberName',
        title: '供应会员',
      },
      render: (priceRange) => `￥${getMinPriceByRange(priceRange)}`,
    },
  ]

  const fetchData = (params: any) => {
    return new Promise((resolve) => {
      params.type = 0
      params.shopId = dataInfo.shopId || selectMallInfo?.id
      params.adornId = adornId
      params.categoryId = categoryId
      params.commodityIdList = dataInfo.goodsIdList || []
      getCommodityAdornWebPlatformFindCommodityList(params).then((res) => {
        const { data } = res
        resolve(data)
      })
    })
  }

  // 搜索
  const search = (values: any) => {
    ref.current.reload()
  }

  const handleCategoryChange = (value: any, type: string) => {
    setCategoryId(value)
    switch (type) {
      case 'first':
        for (const item of categoryList) {
          if (item.id && item.id === value) {
            if (item.children) {
              const newDataInfo = produce(dataInfo, (oldDataInfo) => {
                oldDataInfo['firstId'] = item.id
                oldDataInfo['secondId'] = undefined
                oldDataInfo['thirdId'] = undefined
              })
              changeNewProps('dataInfo', newDataInfo)
              setSecondCategoryList(item.children)
            }
          }
        }
        break
      case 'second':
        for (const item of secondCategoryList) {
          if (item.id && item.id === value) {
            if (item.children) {
              const newDataInfo = produce(dataInfo, (oldDataInfo) => {
                oldDataInfo['secondId'] = item.id
                oldDataInfo['thirdId'] = undefined
              })
              changeNewProps('dataInfo', newDataInfo)
              setThirdCategoryList(item.children)
            }
          }
        }
        break
      case 'third':
        const newDataInfo = produce(dataInfo, (oldDataInfo) => {
          oldDataInfo['thirdId'] = value
        })
        changeNewProps('dataInfo', newDataInfo)
        break
      default:
        break
    }
  }

  const handleChangeForKey = (value: string, key: string) => {
    const newDataInfo = produce(dataInfo, (oldDataInfo) => {
      oldDataInfo[key] = value
    })
    changeNewProps('dataInfo', newDataInfo)
  }

  const handleConfirmSelect = () => {
    if (
      ref.current.selectionKeys.length > 6 ||
      [...(dataInfo?.goodsIdList || []), ...ref.current.selectionKeys].length > 6
    ) {
      message.info('最多选择推荐6件商品')
      return
    } else {
      changeNewProps(
        'dataInfo',
        produce(dataInfo, (oldDataInfo) => {
          oldDataInfo['goodsIdList'] = [...(dataInfo.goodsIdList || []), ...ref.current.selectionKeys]
          oldDataInfo['goodsList'] = [...(dataInfo.goodsIdList || []), ...ref.current.getSelectionItems()]
        }),
      )
      setSelectDrawerVisible(false)
    }
  }

  const handleDeleteSelect = (goodItem: any) => {
    const newList: any[] = []
    const ids: number[] = []
    dataInfo.goodsList?.forEach((item) => {
      if (item.goodsId !== goodItem.goodsId) {
        newList.push(item)
        ids.push(item.goodsId)
      }
    })

    changeNewProps(
      'dataInfo',
      Object.assign(
        { ...dataInfo },
        {
          goodsList: newList,
          goodsIdList: ids,
        },
      ),
    )
  }

  const handleMallSelect = (e: RadioChangeEvent) => {
    if (e.target.value) {
      for (const item of mallList) {
        if (item.id === e.target.value) {
          setSelectMallInfo(item)
          changeNewProps('dataInfo', Object.assign({ ...dataInfo }, { shopId: item.id }))
          return
        }
      }
    }
  }

  const handleAddRecommend = () => {
    if (!selectMallInfo) {
      message.info('请选择关联商城')
      return
    }

    let tempCategoryId: number | undefined = undefined
    if (dataInfo.thirdId) {
      tempCategoryId = Number(dataInfo.thirdId)
    } else if (dataInfo.secondId) {
      tempCategoryId = Number(dataInfo.secondId)
    } else if (dataInfo.firstId) {
      tempCategoryId = Number(dataInfo.firstId)
    }

    if (!tempCategoryId) {
      message.info('请先选择品类')
      return
    }
    setSelectDrawerVisible(true)

    if (ref.current.reload) {
      ref.current.reload()
    }
  }

  return (
    <SettingPanel confirmLoading={confirmLoading} onCancel={handleCancel} onOK={handleConfirmSave}>
      <div className={styles.platform_goods}>
        <div className={styles.setting_title}>
          <span>分类信息设置</span>
        </div>
        <div className={styles.setting_line_addItem}>
          <div className={styles.setting_line_addItem_line}>
            <div className={styles.setting_line_addItem_line_label}>广告图:</div>
            <div className={styles.setting_line_addItem_line_brief}>
              <UploadImage
                imgUrl={dataInfo.advertImg}
                size="192*288"
                fileMaxSize={200}
                onChange={(val) => handleChangeForKey(val, 'advertImg')}
              />
            </div>
          </div>
          <div className={styles.setting_line_addItem_line}>
            <div className={cx(styles.setting_line_addItem_line_label, styles.height32)}>关联商城：</div>
            <div className={styles.setting_line_addItem_line_brief}>
              <Radio.Group value={dataInfo.shopId || selectMallInfo?.id} onChange={handleMallSelect}>
                {mallList &&
                  mallList.map((item) => (
                    <Radio key={item.id} value={item.id}>
                      {item.name}
                    </Radio>
                  ))}
              </Radio.Group>
            </div>
          </div>
          <div className={styles.setting_line_addItem_line}>
            <div className={cx(styles.setting_line_addItem_line_label, styles.height32)}>品类：</div>
            <div className={styles.setting_line_addItem_line_brief}>
              <div className={styles.select_line} style={{ gap: 8 }}>
                <Select
                  style={{ width: 212 }}
                  value={dataInfo.firstId}
                  placeholder="一级品类"
                  onChange={(value) => handleCategoryChange(value, 'first')}
                >
                  {categoryList &&
                    categoryList.map((categoryItem) => (
                      <Select.Option key={categoryItem.id} value={categoryItem.id}>
                        {categoryItem.name}
                      </Select.Option>
                    ))}
                </Select>
                <Select
                  style={{ width: 212 }}
                  value={dataInfo.secondId}
                  placeholder="二级品类"
                  onChange={(value) => handleCategoryChange(value, 'second')}
                >
                  {secondCategoryList &&
                    secondCategoryList.map((item) => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.name}
                      </Select.Option>
                    ))}
                </Select>
                <Select
                  style={{ width: 212 }}
                  value={dataInfo.thirdId}
                  placeholder="三级品类"
                  onChange={(value) => handleCategoryChange(value, 'third')}
                >
                  {thirdCategoryList &&
                    thirdCategoryList.map((item) => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.name}
                      </Select.Option>
                    ))}
                </Select>
              </div>
            </div>
          </div>
          <div className={styles.setting_line_addItem_line}>
            <div className={cx(styles.setting_line_addItem_line_label, styles.height32)}>分类名称：</div>
            <div className={styles.setting_line_addItem_line_brief}>
              <Input
                className={styles.setting_line_addItem_input}
                value={dataInfo.name}
                onChange={(e) => handleChangeForKey(e.target.value, 'name')}
              />
            </div>
          </div>
          <div className={styles.setting_line_addItem_line}>
            <div className={cx(styles.setting_line_addItem_line_label, styles.height32)}>分类描述:</div>
            <div className={styles.setting_line_addItem_line_brief}>
              <Input
                className={styles.setting_line_addItem_input}
                value={dataInfo.describe}
                onChange={(e) => handleChangeForKey(e.target.value, 'describe')}
              />
            </div>
          </div>
          <div className={styles.setting_line_addItem_line}>
            <div className={cx(styles.setting_line_addItem_line_label, styles.height32)}>字体颜色:</div>
            <div className={styles.setting_line_addItem_line_brief}>
              <div className={cx(styles.color_picker)} style={{ backgroundColor: dataInfo.fontColor || '#303133' }}>
                <div className={styles.picker}>
                  <SketchPicker
                    color={dataInfo.fontColor || '#303133'}
                    onChangeComplete={({ hex }) => {
                      setFontColor(hex)
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.setting_title}>
          <span>分类商品设置</span>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => handleAddRecommend()}
          style={{ marginBottom: 12 }}
        >
          添加推荐商品
        </Button>
        <SettingList size="small">
          {dataInfo.goodsList &&
            dataInfo.goodsList.map((item) => (
              <SettingList.SettingItem
                size="small"
                onDelete={() => handleDeleteSelect(item)}
                selected={true}
                key={`setting_item_${item.goodsId}`}
              >
                <GoodsItem dataInfo={item} />
              </SettingList.SettingItem>
            ))}
        </SettingList>
        <Drawer title="选择推荐商品" width={1200} onClose={handleDrawerClose} open={selectDrawerVisible}>
          <SettingPanel
            confirmLoading={confirmLoading}
            onCancel={() => setSelectDrawerVisible(false)}
            onOK={handleConfirmSelect}
          >
            <StandardFormTable
              columns={columns}
              autoScrollX
              request={(params) => fetchData(params)}
              rowKey="commodityId"
              actionRef={ref}
              isRowSelection
            />
          </SettingPanel>
        </Drawer>
      </div>
    </SettingPanel>
  )
}

export default PlatformGoods
