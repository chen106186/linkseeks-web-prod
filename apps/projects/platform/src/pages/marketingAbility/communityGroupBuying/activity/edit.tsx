import React, { Fragment, useEffect, useRef, useState } from 'react'
import type { RadioChangeEvent } from 'antd'
import {
  Button,
  Card,
  Table,
  message,
  Image,
  Tag,
  Row,
  Col,
  DatePicker,
  Input,
  Spin,
  Cascader,
  Popconfirm,
  Form,
  Drawer,
} from 'antd'
import {
  BraftEditor,
  PageHeaderWrapper,
  type RecordColumns,
  Editor,
  AuthButton,
  StandardFormTable,
} from '@apps/components'
import { usePageStatus } from '@/hooks/usePageStatus'
import CustomUpload from '@/components/NiceForm/components/CustomUpload'
import {
  getManageAreaAll,
  type GetManageAreaAllResponse,
  getMarketingMerchantCbgActivityGet,
  getMarketingMerchantCbgTeamLeaderPage,
  getMarketingPlatformCbgTeamLeaderPage,
  postMarketingMerchantCbgActivityCreate,
  postMarketingMerchantCbgActivityEdit,
} from '@apps/apis'
import { Radio, Space } from '@linkseeks/ui'
import moment from 'moment/moment'
import { getIntl } from '@linkseeks/i18n'
import CollocationLayout from '@/pages/marketingAbility/communityGroupBuying/activity/collocationLayout'
import { SaveOutlined } from '@ant-design/icons'
import { history } from '@linkseeks/router-manager'
import { Link } from '@linkseeks/router-core'
import type { ActionType } from '@apps/components/src/web/StandardFormTable/types'
import styles from '@/pages/commodityAbility/trademark/trademarkApply/index.less'
import { formatTimeString } from '@/utils'
import dayjs from 'dayjs'
import weekday from 'dayjs/plugin/weekday'
import localeData from 'dayjs/plugin/localeData'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import weekYear from 'dayjs/plugin/weekYear'

// 注册 antd 需要的 dayjs 插件
dayjs.extend(weekday)
dayjs.extend(localeData)
dayjs.extend(weekOfYear)
dayjs.extend(weekYear)
const { TextArea } = Input
const intl = getIntl()
interface ExpandedDataType {
  key: React.Key
  date: string
  name: string
  upgradeNum: string
}

const CbgActivityEdit = () => {
  const { id, preview } = usePageStatus()
  const [activityData, setActivityData] = useState<any>({})
  const pickupPointRef = useRef({} as ActionType)
  const [goodsData, setGoodsData] = useState<any>([])
  const [goodsMap, setGoodsMap] = useState<any>({})
  const [skuMap, setSkuMap] = useState<any>({})
  const [teamLeaderData, setTeamLeaderData] = useState<any>([])
  const [editorState, setEditorState] = useState<any>()
  const [form] = Form.useForm()
  const [editorValue, setEditorValue] = useState<any>([])
  const [picture, setPicture] = useState<string>()
  const [saleScopeType, setSaleScopeType] = useState<number>(0)
  const [proviceOptions, setProviceOptions] = useState<GetManageAreaAllResponse>()
  const [proviceMap, setProviceMap] = useState<any>({})
  const [productVisible, setProductVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [shopIdList, setShopIdList] = useState([1, 2])
  const [addressList, setAddressList] = useState([])
  const [openTeamLeaderModal, setOpenTeamLeaderModal] = useState(false)

  useEffect(() => {
    // 获取团购详情
    getMarketingMerchantCbgActivityGet({
      id: id,
    }).then((res) => {
      if (res.code !== 1000) {
        message.warning('加载失败')
      }
      setActivityData(res.data)
      form.setFieldsValue({
        name: res.data.name,
        description: res.data.description,
        saleScopeType: res.data.saleScopeType,
        deliveryType: res.data.deliveryType,
        shippingTimeDescription: res.data.shippingTimeDescription,
        startTime: dayjs(res.data.startTime),
        endTime: dayjs(res.data.endTime),
      })
      const tmpAddressList = []
      res.data.cbgActivityPickupPointList.forEach((point) => {
        const row = []
        if (point.pickupPointProvinceCode) {
          row.push(point.pickupPointProvinceCode)
        }
        if (point.pickupPointCityCode) {
          row.push(point.pickupPointCityCode)
        }
        if (point.pickupPointAreaCode) {
          row.push(point.pickupPointAreaCode)
        }
        tmpAddressList.push(row)
      })

      setAddressList(tmpAddressList)
      setSaleScopeType(res.data.saleScopeType)
      setPicture(res.data.picture)
      setEditorState(BraftEditor.createEditorState(res.data.detail))

      const tmpCbgActivityPickupPointList = res.data.cbgActivityPickupPointList || []
      setTeamLeaderData(tmpCbgActivityPickupPointList)
      const tmpGoodsData = []
      const tmpGoodsMap = {}
      const tmpCbgActivityGoodsList = res.data.cbgActivityGoodsList || []
      tmpCbgActivityGoodsList.forEach((goods) => {
        let goodsItem = tmpGoodsMap[goods.productId]
        if (!goodsItem) {
          goodsItem = {
            productId: goods.productId,
            productName: goods.productName,
            productImgUrl: goods.productImgUrl,
            brand: goods.brand,
            unit: goods.unit,
            productType: goods.productType,
            category: goods.category,
            categoryId: goods.categoryId,
            customerCategory: goods.customerCategory,
            customerCategoryId: goods.customerCategoryId,
            categoryFullId: goods.categoryFullId,
            customerCategoryFullId: goods.customerCategoryFullId,
            skuList: [],
          }
          tmpGoodsMap[goods.productId] = goodsItem
        }
        const skuList = goodsItem.skuList || []
        skuList.push({
          skuId: goods.skuId,
          type: goods.type,
          price: goods.price || 0,
          activityPrice: goods.activityPrice || 0,
          stockNum: goods.stockNum || 0,
          commissionRate: (goods.commissionRate || 0) * 100,
        })
        goodsItem.skuList = skuList
        tmpGoodsMap[goods.productId] = goodsItem
      })
      for (const key in tmpGoodsMap) {
        if (tmpGoodsMap.hasOwnProperty(key)) {
          tmpGoodsData.push(tmpGoodsMap[key])
        }
      }
      setGoodsData(tmpGoodsData)
    })

    //获取省市区
    getManageAreaAll().then((res) => {
      if (res.code === 1000) {
        const arr = [...res.data] // 裁去最后一级别
        const trimmedArr = trimToThreeLevels(arr)
        const addrMap = {}
        trimmedArr.map((addr0) => {
          addrMap[addr0.code] = addr0.name
          addr0.areaRespList.map((addr1) => {
            addrMap[addr1.code] = addr1.name
            addr1.areaRespList.map((addr2) => {
              addrMap[addr2.code] = addr2.name
            })
          })
        })
        setProviceMap(addrMap)
        setProviceOptions(trimmedArr)
      }
    })
  }, [])

  function trimToThreeLevels(list: any[], level = 1): any[] {
    return list.map((item) => {
      const newItem = { ...item }
      if (newItem.areaRespList && Array.isArray(newItem.areaRespList)) {
        if (level < 3) {
          newItem.areaRespList = trimToThreeLevels(newItem.areaRespList, level + 1)
        } else {
          // 到第三层就砍掉下面的 areaRespList
          delete newItem.areaRespList
        }
      }
      return newItem
    })
  }

  const toggle = (flag: boolean) => {
    setProductVisible(flag)
  }

  const handleSelectProducts = (params) => {
    const tmpGoodsMap = {}

    // 先把已有数据装载进 tmpGoodsMap
    goodsData.forEach((item) => {
      tmpGoodsMap[item.productId] = {
        ...item,
        skuList: [...item.skuList], // 防止直接修改原对象
      }
    })

    // 再处理新增的 params
    params.forEach((goods) => {
      let goodsItem = tmpGoodsMap[goods.commodityId]
      if (!goodsItem) {
        goodsItem = {
          productId: goods.productId,
          productName: goods.productName,
          productImgUrl: goods.productImgUrl,
          brandId: goods.brandId,
          brand: goods.brandName,
          unitId: goods.unitId,
          unit: goods.unitName,
          productType: goods.customerCategoryType,
          categoryId: goods.categoryId,
          category: goods.categoryName,
          customerCategoryId: goods.customerCategoryId,
          customerCategory: goods.customerCategoryName,
          categoryFullId: goods.categoryFullId,
          customerCategoryFullId: goods.customerCategoryFullId,
          skuList: [],
        }
      }

      // 判断 SKU 是否已存在，避免重复
      const exists = goodsItem.skuList.some((sku) => sku.skuId === goods.skuId)
      if (!exists) {
        goodsItem.skuList.push({
          skuId: goods.skuId,
          type: goods.attr,
          price: goods.price,
          activityPrice: 0,
          stockNum: goods.stockCount,
          commissionRate: 0,
        })
      }

      tmpGoodsMap[goods.commodityId] = goodsItem
    })

    // 转换为数组
    const tmpGoodsData = Object.values(tmpGoodsMap)

    setGoodsData(tmpGoodsData)
    setProductVisible(false)
  }

  const handleEditorChange = (editorState) => {
    setEditorState(editorState)
  }

  const startTimeDisabled = (current, name) => {
    const _endTime = form.getFieldValue(name)
    if (_endTime) {
      return current && (current < dayjs().startOf('hour') || _endTime.diff(current, 'hour') < 1)
    } else {
      return current && current < dayjs().startOf('hour')
    }
  }

  const endTimeDisabled = (current, name) => {
    const _startTime = form.getFieldValue(name)
    if (_startTime) {
      return current && (current < dayjs().startOf('hour') || current.diff(_startTime, 'hour') < 1)
    } else {
      return current && current < dayjs().startOf('hour')
    }
  }

  const onSaleScopeTypeChange = (e: RadioChangeEvent) => {
    console.log('radio checked', e.target.value)
    setSaleScopeType(e.target.value)
  }

  const expandedRowRender = (record, mindex) => {
    const updateSkuField = (skuIndex, field, value) => {
      const newGoodsData = [...goodsData]
      const currentSkus = [...(newGoodsData[mindex]?.skuList || [])]
      currentSkus[skuIndex] = {
        ...currentSkus[skuIndex],
        [field]: value,
      }
      newGoodsData[mindex] = {
        ...newGoodsData[mindex],
        skuList: currentSkus,
      }
      setGoodsData(newGoodsData)
    }

    const removeSkuRow = (skuIndex) => {
      const newGoodsData = [...goodsData]
      const currentSkus = [...(newGoodsData[mindex]?.skuList || [])]
      currentSkus.splice(skuIndex, 1)
      newGoodsData[mindex] = {
        ...newGoodsData[mindex],
        skuList: currentSkus,
      }
      setGoodsData(newGoodsData)
    }

    const columns: RecordColumns<any>[] = [
      {
        title: '商品SKUID',
        key: 'skuId',
        dataIndex: 'skuId',
      },
      {
        title: '商品规格名称',
        key: 'type',
        dataIndex: 'type',
      },
      {
        title: '单价￥',
        key: 'price',
        dataIndex: 'price',
      },
      {
        title: '活动价￥',
        key: 'activityPrice',
        dataIndex: 'activityPrice',
        render: (_text, record, index) => (
          <Input
            size="small"
            value={record.activityPrice}
            onChange={(e) => {
              const val = e.target.value
              updateSkuField(index, 'activityPrice', val)
            }}
            onBlur={(e) => {
              const raw = e.target.value?.trim()
              const num = parseFloat(raw)
              const val = isNaN(num) ? '0.00' : num.toFixed(2)
              updateSkuField(index, 'activityPrice', val)
            }}
          />
        ),
      },
      {
        title: '活动库存',
        key: 'stockNum',
        dataIndex: 'stockNum',
        render: (_text, record, index) => (
          <Input
            size="small"
            value={record.stockNum}
            onChange={(e) => {
              const val = e.target.value
              updateSkuField(index, 'stockNum', val)
            }}
            onBlur={(e) => {
              const raw = e.target.value?.trim()
              const num = parseInt(raw)
              const val = isNaN(num) ? '0' : num
              updateSkuField(index, 'stockNum', val)
            }}
          />
        ),
      },
      {
        title: '设置团购佣金',
        key: 'commissionRate',
        dataIndex: 'commissionRate',
        render: (_text, record, index) => (
          <Input
            size="small"
            value={record.commissionRate}
            onChange={(e) => {
              const val = e.target.value
              updateSkuField(index, 'commissionRate', val)
            }}
            onBlur={(e) => {
              const raw = e.target.value?.trim()
              const num = parseInt(raw)
              const val = isNaN(num) ? '0' : num
              updateSkuField(index, 'commissionRate', val)
            }}
            suffix="%"
          />
        ),
      },
      {
        title: '操作',
        key: 'action',
        dataIndex: 'action',
        render: (_text, _record, index) => (
          <Popconfirm title="确定删除该规格？" onConfirm={() => removeSkuRow(index)}>
            <a>移除</a>
          </Popconfirm>
        ),
      },
    ]

    return <Table columns={columns} dataSource={record.skuList} pagination={false} rowKey="skuId" />
  }

  const columns: RecordColumns<any>[] = [
    {
      title: '商品ID',
      key: 'productId',
      dataIndex: 'productId',
      width: 120,
    },
    {
      title: '商品名称',
      key: 'productName',
      dataIndex: 'productName',
      width: 200,
    },
    {
      title: '单位',
      key: 'unit',
      dataIndex: 'unit',
      width: 120,
    },
    {
      title: '商品类型',
      key: 'productType',
      dataIndex: 'productType',
      width: 120,
    },
    {
      title: '平台类目',
      key: 'category',
      dataIndex: 'category',
      width: 150,
    },
    {
      title: '商家品类',
      key: 'customerCategory',
      dataIndex: 'customerCategory',
      width: 150,
    },
    {
      title: '操作',
      key: 'state',
      dataIndex: 'state',
      width: 150,
      render: (_text, record) => (
        <Fragment>
          <Button
            type="link"
            onClick={() => {
              const newData = goodsData.filter((item) => item.productId !== record.productId)
              setGoodsData(newData)
            }}
          >
            移除
          </Button>
        </Fragment>
      ),
    },
  ]

  const teamLeaderColumns: RecordColumns<any>[] = [
    {
      title: '团长名称',
      key: 'name',
      dataIndex: 'name',
      width: 150,
    },
    {
      title: '团长手机号',
      key: 'phone',
      dataIndex: 'phone',
      width: 150,
    },
    {
      title: '自提点名称',
      key: 'pickupPointName',
      dataIndex: 'pickupPointName',
      width: 150,
    },
    {
      title: '自提信息',
      key: 'address',
      dataIndex: 'address',
      width: 350,
      render: (_text, record) => (
        <>
          {record.pickupPointProvince +
            record.pickupPointCity +
            record.pickupPointArea +
            record.pickupPointStreet +
            record.pickupPointAddress}
        </>
      ),
    },
    {
      title: '操作',
      key: 'state',
      dataIndex: 'state',
      fixed: 'right',
      render: (_text, record) => (
        <Fragment>
          <Button
            type="link"
            onClick={() => {
              const newData = teamLeaderData.filter((item) => item.id !== record.id)
              setTeamLeaderData(newData)
            }}
          >
            移除
          </Button>
        </Fragment>
      ),
    },
  ]

  // 1：全部，2：指定地区，3：指定自提点
  const options = [
    { label: '全部', value: 1 },
    { label: '指定地区', value: 2 },
    { label: '指定自提点', value: 3 },
  ]

  // 1：物流，2：自提，3：物流+自提
  const deliveryTypeOptions = [
    { label: '物流', value: 1 },
    { label: '自提', value: 2 },
    { label: '物流+自提', value: 3 },
  ]

  const handleSubmit = async () => {
    const values = await form.validateFields()
    if (goodsData.length === 0) {
      message.warning('请选择商品')
      return
    }
    console.log('发布活动')

    const postData = {
      ...values,
      startTime: values.startTime.format('YYYY-MM-DD HH:mm:ss'),
      endTime: values.endTime.format('YYYY-MM-DD HH:mm:ss'),
    }

    const goodsList = []
    goodsData.forEach((goods) => {
      goods.skuList.forEach((sku) => {
        const item = {
          productId: goods.productId,
          productName: goods.productName,
          productImgUrl: goods.productImgUrl,
          brand: goods.brand,
          unit: goods.unit,
          productType: goods.productType,
          categoryId: goods.categoryId,
          category: goods.category,
          customerCategoryId: goods.customerCategoryId,
          customerCategory: goods.customerCategory,
          categoryFullId: goods.categoryFullId,
          customerCategoryFullId: goods.customerCategoryFullId,
          skuId: sku.skuId,
          type: sku.type,
          price: sku.price,
          activityPrice: sku.activityPrice,
          stockNum: sku.stockNum,
          commissionRate: (sku.commissionRate / 100).toFixed(2),
        }
        goodsList.push(item)
      })
    })
    postData.cbgActivityGoodsList = goodsList

    // 选择地区
    if (postData.saleScopeType === 2) {
      const tmpAddressList = []
      addressList.forEach((row, rowIndex) => {
        let addItem = {}
        row.forEach((cell, colIndex) => {
          if (colIndex === 0) {
            addItem.pickupPointProvinceCode = cell
            addItem.pickupPointProvince = proviceMap[cell]
          }
          if (colIndex === 1) {
            addItem.pickupPointCityCode = cell
            addItem.pickupPointCity = proviceMap[cell]
          }
          if (colIndex === 2) {
            addItem.pickupPointAreaCode = cell
            addItem.pickupPointArea = proviceMap[cell]
          }
        })
        tmpAddressList.push(addItem)
      })
      postData.cbgActivityPickupPointList = tmpAddressList
    }
    // 选择自提点
    if (postData.saleScopeType === 3) {
      const tmpAddressList = []
      teamLeaderData.forEach((row, rowIndex) => {
        tmpAddressList.push({
          teamLeaderId: row.id,
          pickupPointProvince: row.pickupPointProvince,
          pickupPointProvinceCode: row.pickupPointProvinceCode,
          pickupPointCity: row.pickupPointCity,
          pickupPointCityCode: row.pickupPointCityCode,
          pickupPointArea: row.pickupPointArea,
          pickupPointAreaCode: row.pickupPointAreaCode,
        })
      })
      postData.cbgActivityPickupPointList = tmpAddressList
    }

    postData.picture = picture
    if (editorState) {
      postData.detail = editorState.toHTML()
    }

    postData.id = id
    console.log(postData)

    postMarketingMerchantCbgActivityEdit(postData).then((res) => {
      if (res.code !== 1000) {
        message.error(res.message)
        return
      }
      history.goBack()
    })
  }

  const addressChangeOnSelect = (value: string[][]) => {
    console.log('addressChangeOnSelect')
    console.log(value)
    setAddressList(value)
  }

  const pickUpPointColumns: RecordColumns<any>[] = [
    {
      title: '团长名称',
      key: 'name',
      dataIndex: 'name',
      searchField: 'Input',
    },
    {
      title: '团长手机',
      key: 'phone',
      dataIndex: 'phone',
    },
    {
      title: '自提点名称',
      key: 'pickupPointName',
      dataIndex: 'pickupPointName',
    },
    {
      title: '自提信息',
      key: 'pickupPoint',
      dataIndex: 'pickupPoint',
      render: (_text, record) => (
        <>
          {record.pickupPointProvince +
            record.pickupPointCity +
            record.pickupPointArea +
            record.pickupPointStreet +
            record.pickupPointAddress}
        </>
      ),
    },
  ]

  const pickUpPointFetchData = async (params: any) => {
    const { ...arg } = params
    const payload = { ...arg }

    return new Promise((resolve) => {
      getMarketingMerchantCbgTeamLeaderPage({ ...payload }).then((res) => {
        if (res.code === 1000) {
          resolve(res.data)
        }
      })
    })
  }

  const onPickUpClose = () => {
    setOpenTeamLeaderModal(false)
  }

  const onPickUpOk = () => {
    if (!pickupPointRef.current?.getSelectionItems()?.length) {
      message.warning('未选择任何自提点')
      return
    }
    setTeamLeaderData(pickupPointRef.current?.getSelectionItems())
    setOpenTeamLeaderModal(false)
  }

  useEffect(() => {
    if (!openTeamLeaderModal) {
      return
    }
    pickupPointRef.current?.reload()
  }, [openTeamLeaderModal])

  return (
    // <div>
    <PageHeaderWrapper
      title="编辑团购活动"
      extra={
        <Button loading={loading} icon={<SaveOutlined />} type="primary" onClick={handleSubmit}>
          保存活动
        </Button>
      }
    >
      <Space direction="vertical" size="middle">
        <Card title="活动基本信息">
          <Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 14 }} layout="horizontal">
            <Form.Item label="活动名称" name="name" rules={[{ required: true, message: '请输入活动名称' }]}>
              <Input placeholder="请填写活动名称，不超过40个字" maxLength={40} />
            </Form.Item>
            <Form.Item label="活动描述" name="description" rules={[{ required: true, message: '请输入活动描述' }]}>
              <TextArea placeholder="不超过200个字" maxLength={200} />
            </Form.Item>
            <Form.Item label="活动时间">
              <Space style={{ display: 'flex' }} align="baseline">
                <Form.Item
                  name="startTime"
                  validateFirst
                  rules={[
                    {
                      required: true,
                      validator: (_, value) => {
                        const _signUpEndTime = form.getFieldValue('signUpEndTime')
                        if (!value) {
                          return Promise.reject(
                            new Error(`${intl.formatMessage({ id: 'selfManagement.pleaseSelectStartTime' })}`),
                          )
                        }
                        if (_signUpEndTime && !moment(value).isAfter(_signUpEndTime)) {
                          return Promise.reject(
                            new Error(`${intl.formatMessage({ id: 'selfManagement.activitiesGreater' })}`),
                          )
                        }
                        return Promise.resolve()
                      },
                    },
                  ]}
                >
                  <DatePicker
                    showTime
                    showNow={false}
                    allowClear
                    placeholder="开始时间"
                    disabledDate={(current) => startTimeDisabled(current, 'endTime')}
                  />
                </Form.Item>
                ~
                <Form.Item
                  name="endTime"
                  rules={[
                    {
                      required: true,
                      message: `${intl.formatMessage({ id: 'selfManagement.pleaseSelectActivityOverTime' })}`,
                    },
                  ]}
                >
                  <DatePicker
                    showTime
                    showNow={false}
                    allowClear
                    placeholder="结束时间"
                    disabledDate={(current) => endTimeDisabled(current, 'startTime')}
                  />
                </Form.Item>
              </Space>
            </Form.Item>
            <Form.Item label="销售范围" name="saleScopeType" rules={[{ required: true, message: '请选择销售范围' }]}>
              <Radio.Group options={options} onChange={onSaleScopeTypeChange} />
            </Form.Item>
            {/*{saleScopeType}*/}
            {saleScopeType == 2 && (
              <Form.Item label="选择指定地区" rules={[{ required: true, message: '请选择指定地区' }]}>
                <Cascader
                  options={proviceOptions}
                  onChange={addressChangeOnSelect}
                  value={addressList}
                  placeholder="请选择地区"
                  fieldNames={{ label: 'name', value: 'code', children: 'areaRespList' }}
                  multiple
                  notFoundContent={<Spin size="small" />}
                />
              </Form.Item>
            )}
            {saleScopeType == 3 && (
              <Form.Item label="选择自定自提点">
                <Space direction="vertical" size="middle">
                  <Button type="primary" onClick={() => setOpenTeamLeaderModal(true)}>
                    选择自提点
                  </Button>

                  <Table columns={teamLeaderColumns} dataSource={teamLeaderData} />
                </Space>
              </Form.Item>
            )}
            <Form.Item label="配送方式" name="deliveryType" rules={[{ required: true, message: '请选择配送方式' }]}>
              <Radio.Group options={deliveryTypeOptions} />
            </Form.Item>
            <Form.Item
              label="发货时间说明"
              name="shippingTimeDescription"
              rules={[{ required: true, message: '请输入发货时间说明' }]}
            >
              <TextArea placeholder="不超过200个字" maxLength={200} />
            </Form.Item>
            <Form.Item label="活动商品及佣金">
              <Space direction="vertical" size="middle">
                <Button type="primary" onClick={() => setProductVisible(true)}>
                  选择商品
                </Button>
                <Row>
                  <Col span={24}>
                    <Table
                      rowKey="productId"
                      columns={columns}
                      expandable={{ expandedRowRender, defaultExpandedRowKeys: ['0'] }}
                      dataSource={goodsData}
                      pagination={false}
                    />
                  </Col>
                </Row>
                <CollocationLayout
                  shopIdList={shopIdList}
                  visible={productVisible}
                  toggle={toggle}
                  onConfirm={handleSelectProducts}
                />
              </Space>
            </Form.Item>
            <Form.Item label="团购图片" rules={[{ required: true, message: '请上传团购图片' }]}>
              <CustomUpload
                value={picture}
                editable={true}
                mutators={{
                  change: (val) => {
                    setPicture(val)
                  },
                }}
                props={{
                  'x-component-props': {
                    fileMaxSize: 300,
                  },
                  'x-rules': {
                    required: true,
                    message: '请上传团购图片',
                  },
                }}
              />
            </Form.Item>
            <Form.Item label="团购详情">
              <Editor value={editorState} onChange={handleEditorChange} />
            </Form.Item>
          </Form>
        </Card>

        <Drawer
          title="选择自提点"
          placement="right"
          closable={false}
          size="large"
          onClose={onPickUpClose}
          open={openTeamLeaderModal}
          footer={
            <div style={{ textAlign: 'right' }}>
              <Button onClick={onPickUpClose} style={{ marginRight: 8 }}>
                取消
              </Button>
              <Button onClick={onPickUpOk} type="primary">
                确认
              </Button>
            </div>
          }
        >
          <Space direction="vertical" size="middle">
            <StandardFormTable
              columns={pickUpPointColumns}
              autoScrollX
              isRowSelection
              request={(params) => pickUpPointFetchData(params)}
              actionRef={pickupPointRef}
            />
          </Space>
        </Drawer>
      </Space>
    </PageHeaderWrapper>
    // </div>
  )
}

export default CbgActivityEdit
