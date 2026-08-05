import React, { useMemo, useState, useEffect } from 'react'
import { Space, Table, Button, Input, Pagination, Select, message } from 'antd'
import cx from 'classnames'
import { SearchOutlined } from '@ant-design/icons'
import { GetProductShopStoreGetCommodityDetailResponse } from '@apps/apis'
import { ColumnsType } from 'antd/lib/table'
import cloneDeep from 'lodash/cloneDeep'
import filterIcon from '@/assets/icons/filter_icon.svg'
import lodashIsEmpty from 'lodash/isEmpty'
import { priceFormat } from '@apps/utils'
import { getWebIntl } from '@/utils/locales'
import InputNumber from '@/components/InputNumber'
import SkuModel from './skuModel'
import { getMaxCountRange } from '../Price'
import styles from './index.module.less'

const { Option } = Select

interface PriceType {
  range: string
  min: number
  max: number
  price: number
}

export interface PriceListItemType {
  commoditySkuAttributeList: {
    customerAttribute: {
      groupName: string
      id: number
      isSearch: boolean
      name: string
    }
    customerAttributeValue: {
      id: number
      value: string
    }
  }[]
  warehouseId: number
  buyCount: number
  commodityPic: string[]
  commodityUnitPriceAndPicId: number | null
  hsCode: boolean | null
  id: number
  inventoryByProductVOS: {
    positionId: number
    stockCount: number
    warehouseAddress: string
    warehouseId: number
    warehouseName: string
  }[]
  minOrder: number
  priceRate: number
  stockCount: number
  unitPrice: Record<string, string>
  upperCommoditySkuId: number
}

export type MroModelsProps = {
  CommodityDetail: GetProductShopStoreGetCommodityDetailResponse
  handleMroInquiry?: (sku: any) => void
  handleMroToBuy?: (priceType: number, useActivityPrice: boolean, skuList?: any[]) => void
  handleMroAddToPurchase?: (skuList: PriceListItemType[]) => Promise<boolean>
}

const MroModels: React.FC<MroModelsProps> = ({
  CommodityDetail,
  handleMroInquiry,
  handleMroToBuy,
  handleMroAddToPurchase,
}) => {
  const { commoditySkuList, minOrder, priceType } = CommodityDetail
  const [isEmpty, setIsEmpty] = useState<boolean>(false)
  const [source, setSource] = useState<PriceListItemType[]>([])
  const [skuList, setSkuList] = useState<any[]>([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [modalSkuList, setModalSkuList] = useState<any[]>([])
  const [skuIdObj, setSkuIdObj]: any = useState({})
  const [selectDataObj, setSelectDataObj]: any = useState({})
  const [tempObj, setTempObj]: any = useState({}) //用来存储规格分类id,即pid，不可改变
  const [initData, setInitData]: any = useState<any[]>([])
  const [inputValue, setInputValue]: any = useState('')
  const [submitLoading, setSubmitLoding] = useState<boolean>(false)
  const [pagination, setPagination]: any = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })
  const translate = getWebIntl()

  const handleData = (data: any[]) => {
    /**
     * 处理初始数据格式
     * 格式：{'颜色': ['白色', '白色', '绿色'], '尺码': ['36', '37', 'false']}
     * 字符串false指代空
     * 意义：当选择白色时，尺码可以选择36、37
     * 思路：1、找出第一次选的属性的值的下标；2、找下一个属性的属性值
     */
    let skuObj: any = {}
    let tempData: any = {}
    data.forEach((item) => {
      skuObj[item.customerAttribute.id] = []
      tempData[item.customerAttribute.id] = [] //数据模板，不可改变
    })
    commoditySkuList.forEach((item) => {
      for (const key in tempData) {
        for (let index = 0; index < item.commoditySkuAttributeList.length; index++) {
          const _item = item.commoditySkuAttributeList[index]
          if (_item.customerAttribute?.id?.toString() == key) {
            skuObj[key].push(_item.customerAttributeValue?.id)
            break
          }
          if (index == item.commoditySkuAttributeList.length - 1) {
            skuObj[key].push('') //使用''代表空
          }
        }
      }
    })
    setTempObj(tempData)
    setSkuIdObj(skuObj)
  }

  /* 未改变之前的实现逻辑，放置外部更改source值会导致组件一直重新渲染 */
  const addMinNumber = (arr: any[], min: number) => {
    return arr.map((item) => {
      item.minOrder = min
      return item
    })
  }

  /** 重置数据 */
  const resetData = () => {
    let flag = commoditySkuList.every(
      (item: { commoditySkuAttributeList: string | any[] }) => item.commoditySkuAttributeList.length > 0,
    )
    setIsEmpty(!flag)
    initSkuList()
    setInitData(addMinNumber(cloneDeep(commoditySkuList) as any[], minOrder))
    getTableData(pagination.current, pagination.pageSize)
  }

  useEffect(() => {
    resetData()
  }, [commoditySkuList])

  const getTableData = (current: number, pageSize: number) => {
    const data = addMinNumber(cloneDeep(commoditySkuList) as any[], minOrder)
    const start = (current - 1) * pageSize
    const list = data?.slice(start, start + pageSize) || []
    console.log(list, 'list')
    setSource(list)
    setPagination({ total: commoditySkuList.length, current, pageSize })
  }
  const _tableData = useMemo(() => {
    return initData
  }, [initData])

  /**
   * 判断数组中是否存在该数据
   * @param list
   * @param attrId
   */
  const judgeAttrInList = (list: any[], attrId: number) => {
    return list.some((item) => item.customerAttribute.id === attrId)
  }

  const judgeAttrValueInList = (list: any[], attrId: number) => {
    return list.some((item) => item.id === attrId)
  }

  const initSkuList = () => {
    const tempSkuList: any[] = []

    for (const item of commoditySkuList) {
      if (item.commoditySkuAttributeList && item.commoditySkuAttributeList.length > 0) {
        for (const attrListItem of item.commoditySkuAttributeList) {
          if (attrListItem?.customerAttribute) {
            if (
              attrListItem?.customerAttribute?.id &&
              judgeAttrInList(tempSkuList, attrListItem.customerAttribute.id)
            ) {
              let tempSkuListIndex = 0
              tempSkuList.map((item, index) => {
                if (item.customerAttribute.id === attrListItem.customerAttribute?.id) {
                  tempSkuListIndex = index
                }
              })
              const customerAttributeValue: any = { ...attrListItem.customerAttributeValue }
              if (
                customerAttributeValue?.id &&
                !judgeAttrValueInList(
                  tempSkuList[tempSkuListIndex].customerAttributeValueList,
                  customerAttributeValue?.id,
                )
              ) {
                if (tempSkuListIndex === 0) {
                  if (item.commodityPic) {
                    customerAttributeValue.commodityPic = item.commodityPic[0]
                  }
                }
                tempSkuList[tempSkuListIndex].customerAttributeValueList = [
                  ...tempSkuList[tempSkuListIndex].customerAttributeValueList,
                  customerAttributeValue,
                ]
              }
            } else {
              const temp: any = {}
              temp.id = attrListItem.id
              temp.customerAttribute = attrListItem.customerAttribute
              const customerAttributeValue: any = { ...attrListItem.customerAttributeValue }
              if (tempSkuList.length === 0) {
                if (item.commodityPic) {
                  customerAttributeValue.commodityPic = item.commodityPic[0]
                }
              }
              temp.customerAttributeValueList = [customerAttributeValue]
              tempSkuList.push(temp)
            }
          }
        }
      }
    }

    setSkuList(tempSkuList)
    setModalSkuList(tempSkuList)
    handleData(tempSkuList)
  }

  const _returnCustomerAttributeValue = (parentId: number, commoditySkuAttributeList: any[]) => {
    for (let _i = 0; _i <= commoditySkuAttributeList.length - 1; _i++) {
      if (commoditySkuAttributeList[_i].customerAttribute.id === parentId) {
        return commoditySkuAttributeList[_i].customerAttributeValue.value
      }
    }
    return null
  }
  const TableHeader = ({ name }: any) => {
    return (
      <div className={styles.table_header} onClick={() => setIsModalVisible(true)}>
        <div>{name}</div>
        <img className={styles.table_header_img} src={filterIcon} />
      </div>
    )
  }

  /**
   * 设置当前选择的sku的价格区间
   * @param uniPrice
   */
  const getCurrentPriceRange = (uniPrice: any) => {
    const initPriceRange = uniPrice
    let tempPriceRange: any[] = []
    Object.keys(initPriceRange).forEach((key) => {
      const keyArr = key.split('-')
      const min = Number(keyArr[0])
      const max = Number(keyArr[1])
      tempPriceRange.push({
        range: key,
        min,
        max,
        price: initPriceRange[key],
      })
    })
    try {
      tempPriceRange = tempPriceRange.sort((a, b) => (a.min > b.max ? 1 : -1))
    } catch (error) {
      console.log(error)
    }
    return tempPriceRange
  }

  const getLadderPrice = (ladderPrice: PriceType[], buyCount: number): number => {
    let result = 0
    if (!ladderPrice) {
      return 0
    }
    if (ladderPrice.length <= 1) {
      result = ladderPrice[0]?.price
    } else {
      const temp = ladderPrice.filter((item) => {
        return Number(buyCount) >= Number(item.min) && Number(buyCount) <= Number(item.max)
      })
      if (lodashIsEmpty(temp)) {
        const maxItem = getMaxCountRange(ladderPrice, buyCount)
        result = maxItem.price
      } else {
        result = temp[0]?.price
      }
    }
    return result
  }

  const BackNewColumns = () => {
    let addCol: ColumnsType<any> = skuList?.map((unit: any, index: number) => {
      return {
        title: <TableHeader name={unit.customerAttribute.name} />,
        width: 150,
        dataIndex: 'commoditySkuAttributeList',
        render: (_text: any, record: any) => {
          return _returnCustomerAttributeValue(unit.customerAttribute.id, record.commoditySkuAttributeList)
        },
      }
    })
    const _baseColumns: ColumnsType<PriceListItemType> = []
    // 如果数据中只要有一个有仓库数据则显示选择仓库的列
    if (
      source.some(
        (item) =>
          item.inventoryByProductVOS &&
          Array.isArray(item.inventoryByProductVOS) &&
          item.inventoryByProductVOS.length > 0,
      )
    ) {
      _baseColumns.push({
        title: translate('web.resource.mall.xuanzecangku'),
        dataIndex: 'inventoryByProductVOS',
        width: 192,
        fixed: 'right',
        render: (_, record) => {
          if (record?.inventoryByProductVOS?.length > 0) {
            // 默认选中第一个仓库
            if (!record['warehouseId']) {
              record['warehouseId'] = record?.inventoryByProductVOS[0].warehouseId
              record['stockCount'] = record?.inventoryByProductVOS[0].stockCount
            }

            return (
              <Select
                value={record['warehouseId']}
                style={{ width: 174 }}
                onChange={(val) => {
                  const _index = source.findIndex((item) => item.id === record.id)
                  let _source = [...source]
                  let _record = { ...record }
                  _record['warehouseId'] = val
                  _record['stockCount'] =
                    record?.inventoryByProductVOS.find((item) => item.warehouseId === val)?.stockCount ||
                    _record['stockCount']
                  _source[_index] = _record
                  setSource(_source)
                }}
              >
                {record?.['inventoryByProductVOS'].map((_item: any) => (
                  <Option key={`${_item.warehouseId}_${_item.positionId}`} value={_item.warehouseId}>
                    {_item.warehouseAddress}
                  </Option>
                ))}
              </Select>
            )
          }
          return null
        },
      })
    }

    _baseColumns.push(
      {
        title: translate('web.resource.mall.kucun'),
        dataIndex: 'stockCount',
        width: 100,
        fixed: 'right',
      },
      {
        title: translate('web.resource.mall.price'),
        dataIndex: 'unitPrice',
        width: 100,
        fixed: 'right',
        render: (_text: any, record: any) => {
          if (priceType === 1) {
            if (Object.keys(record.unitPrice).length > 0) {
              const priceList = getCurrentPriceRange(record.unitPrice)
              return `￥${priceFormat(getLadderPrice(priceList, record.buyCount))}`
            }
          }
          if (priceType === 2) {
            return translate('web.resource.mall.xuyaoxunjia')
          }
          return null
        },
      },
    )

    if (priceType === 1) {
      _baseColumns.push({
        title: translate('web.resource.mall.shuliang'),
        dataIndex: 'stockCount',
        fixed: 'right',
        width: 120,
        render: (text, record, index) => {
          return (
            <Space>
              <InputNumber
                disabled={false}
                value={record?.buyCount ?? 0}
                min={0}
                max={record.stockCount}
                onChange={(num: number) => {
                  const _index = source.findIndex((item) => item.id === record.id)
                  let _source = [...source]
                  let _record = { ...record }
                  _record['buyCount'] = num
                  _source[_index] = _record
                  setSource(_source)
                  console.log(_source, num, '_source')
                }}
              />
            </Space>
          )
        },
      })
    }
    if (priceType === 2) {
      _baseColumns.push({
        title: translate('web.resource.mall.shuliang'),
        dataIndex: 'stockCount',
        fixed: 'right',
        render: (text, record, index) => (
          <Button
            type="default"
            onClick={() => {
              handleMroInquiry?.(record)
            }}
          >
            {translate('web.resource.mall.lijixunjia')}
          </Button>
        ),
      })
    }
    return addCol.concat(_baseColumns)
  }

  const handleModelOk = () => {
    /**
     * 判断已选项的长度
     * 长度为1，表格数据为找出的所有数据
     * 长度大于1，表格数据为所找出的重复数据
     */
    const selectDataLength = Object.keys(selectDataObj)?.length
    if (!selectDataLength) {
      setIsModalVisible(false)
      setSource(initData)
      return
    }
    let tableList: any = []
    let tempArr: any = []
    initData.forEach((item: any) => {
      for (const key in selectDataObj) {
        item.commoditySkuAttributeList.forEach((_item: any) => {
          if (key == _item.customerAttribute.id && selectDataObj[key] == _item.customerAttributeValue.id) {
            tempArr.push(item)
          }
        })
      }
    })
    if (selectDataLength > 1) {
      tempArr.forEach((item: any) => {
        const tempList = tempArr.filter((_item: any) => _item.id == item.id) //判断该数据在数组中是否重复
        if (tempList.length > 1 && tableList.indexOf(item) == -1) {
          //若重复则只需push一次
          tableList.push(item)
        }
      })
    } else {
      tableList = tempArr
    }
    setSource(tableList)
    setIsModalVisible(false)
  }

  const onChangeInputValue = (e: { target: { value: any } }) => {
    const {
      target: { value },
    } = e
    setInputValue(value)
  }

  const onSearch = () => {
    let fliterList: any = []
    initData.forEach((item: any) => {
      item.commoditySkuAttributeList.forEach((_item: any) => {
        //模糊搜索
        if (_item.customerAttributeValue.value.indexOf(inputValue) !== -1 && fliterList.indexOf(item) == -1) {
          fliterList.push(item)
        }
      })
    })
    setSource(fliterList)
  }

  const onReset = () => {
    setSource(initData)
    setInputValue('')
  }

  const _returnSelectSkuCount = () => {
    let _count = 0
    source.forEach((item) => {
      if (item['buyCount'] && item['buyCount'] > 0) {
        _count = _count + 1
      }
    })
    return _count
  }

  const _returnSelectSkuTotal = () => {
    let _count = 0
    source.forEach((item) => {
      if (item['buyCount'] && item['buyCount'] > 0) {
        _count = _count + Number(item['buyCount'])
      }
    })
    return _count
  }

  const _submit = async () => {
    if (_returnSelectSkuTotal() === 0) {
      message.error(translate('web.resource.mall.qingxuanzesku'))
      return
    }
    setSubmitLoding(true)
    const _skuList = source.filter((item) => item.buyCount && item.buyCount > 0)
    const res = await handleMroAddToPurchase?.(_skuList)
    setSubmitLoding(false)
    // 批量加入购物车后，数量输入框的数值需重置为0
    if (res) {
      resetData()
    }
  }

  return (
    <div className={styles['mroModels']}>
      <div className={styles['title']}>{translate('web.resource.mall.quanbuxinghao')}</div>
      <Space style={{ marginBottom: 16 }}>
        <Input
          value={inputValue}
          onChange={onChangeInputValue}
          className={styles['searchInput']}
          placeholder={translate('web.resource.mall.sousuoguanjiazi')}
          suffix={<SearchOutlined />}
        />
        <Button className={cx(styles['btn'])} type="primary" onClick={() => onSearch()}>
          {translate('web.common.search')}
        </Button>
        <Button className={cx(styles['btn'], styles['btn_reset'])} onClick={() => onReset()}>
          {translate('web.common.reset')}
        </Button>
      </Space>
      <Table
        scroll={
          isEmpty
            ? {}
            : {
                x: '100%',
              }
        }
        tableLayout="fixed"
        pagination={false}
        rowKey="id"
        dataSource={source}
        columns={BackNewColumns()}
      />
      <div className={styles['bottom']}>
        <Pagination
          total={_tableData.length}
          showTotal={(total) => translate('web.common.gongtotalye', { total: Math.ceil(total / 10) })}
          defaultPageSize={10}
          defaultCurrent={1}
          {...pagination}
          onChange={getTableData}
        />
        {/* 现货商品展示购物车按钮 */}
        {priceType === 1 && (
          <div className={styles['bottom_right']}>
            <Space>
              {translate('web.resource.mall.gongxuanzelejizhongshangpinzongjijijian', {
                count: _returnSelectSkuCount(),
                total: _returnSelectSkuTotal(),
              })}
              <Button loading={submitLoading} type="primary" onClick={_submit} disabled={_returnSelectSkuTotal() === 0}>
                {translate('web.resource.mall.piliangjiarugouwuche')}
              </Button>
            </Space>
          </div>
        )}
      </div>
      {isModalVisible && (
        <SkuModel
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
          modalSkuList={modalSkuList}
          setModalSkuList={setModalSkuList}
          selectDataObj={selectDataObj}
          setSelectDataObj={setSelectDataObj}
          tempObj={tempObj}
          skuIdObj={skuIdObj}
          handleOk={handleModelOk}
        />
      )}
    </div>
  )
}
export default MroModels
