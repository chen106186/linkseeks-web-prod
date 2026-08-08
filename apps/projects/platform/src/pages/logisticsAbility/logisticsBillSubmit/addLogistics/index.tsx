import React, { useState, useEffect } from 'react'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link, usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import styles from './index.less'
import ReturnEle from '@/components/ReturnEle'
import { ColumnType } from 'antd/lib/table/interface'
import { Tabs, Button, Card, Form, Input, Select, Table, Row, Col, Statistic, message, Badge } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import { LinkOutlined, PlusOutlined } from '@ant-design/icons'
import ModalTable from '@/components/ModalTable'
import { SelectGoodsColumns, ExternalListColumns, AfterSalesSelectGoodsColumns } from './components/columns'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import moment from 'moment'
import ModalTableOrder from './components/ModalTableOrder'
import StatusTag from '@/components/StatusTag'
import { EXCHANGE_OUTER_STATUS_TAG_MAP, EXCHANGE_INNER_STATUS_BADGE_MAP } from './constants'
import {
  getLogisticsOrderWaitSubmitGet,
  getLogisticsSelectListMemberCompany,
  getLogisticsSelectListShipperAddress,
  postLogisticsOrderWaitSubmitAdd,
  postLogisticsOrderWaitSubmitUpdate,
} from '@apps/apis'
import { getProductInvoicesDetails, getProductInvoicesList } from '@apps/apis'
// getProductInvoicesProductList
import { getEnhanceProcessToBeAddLogisticsDetails } from '@apps/apis'
import {
  getAftersalesReplaceGoodsPageReplaceCommodityByLogistics,
  getAftersalesReplaceGoodsPageReplaceDetailByLogistics,
  getAftersalesReplaceGoodsPageReturnCommodityByLogistics,
  getAftersalesReplaceGoodsPageReturnDetailByLogistics,
  getAftersalesReturnGoodsPageCommodityByLogistics,
  getAftersalesReturnGoodsPageDetailByLogistics,
} from '@apps/apis'
import { getOrderCommonProductLogisticsPage } from '@apps/apis'
import { getSettlementPlatformConfigGetSettlementWay } from '@apps/apis'
import { history } from '@linkseeks/router-manager'
const { TabPane } = Tabs
const { Search } = Input
const { Option } = Select
const layout: any = {
  colon: false,
  labelCol: { style: { width: '174px' } },
  wrapperCol: { span: 9 },
  labelAlign: 'left',
}
const intl = getIntl()
const TabFormErrors = (props) => {
  return (
    <Badge size="small" count={props.dot} offset={[6, -5]}>
      {props.children}
    </Badge>
  )
}

/**
 * @id: 订单id
 * @createType: 1-物流能力创建2-销售发货订单创建3-生产通知订单创建4-换货申请创建5-换货处理创建6-退货申请创建,-> (默认没有为自新建)
 */
const AddLogistics: React.FC<{}> = () => {
  const q = useQuery()
  const l = useLocation()
  const routerHistory = {
    location: {
      ...q,
      ...l,
    },
  }
  const [detailList, setdetailList] = useState<any>([]) //表格列表数据
  const [query, setQuery] = useState<any>({}) //表提交的数据
  const [visible, setvisible] = useState<boolean>(false)
  const [shippingvisible, setshippingvisible] = useState<boolean>(false)
  const [invoicesvisible, setinvoicesvisible] = useState<boolean>(false)
  const [shippingRowSelection, shippingRowCtl] = useRowSelectionTable({ customKey: 'id', type: 'radio' })
  const [invoicesRowSelection, invoicesRowCtl] = useRowSelectionTable({ customKey: 'id', type: 'radio' })
  const [id, setId] = useState<any>(routerHistory.location?.query?.id)
  const [relevanceType, setrelevanceType] = useState<number>(1)
  const [createType, setCreateType] = useState<number>(
    Number(routerHistory.location.query?.createType) || 1,
  ) /**创建方式 */
  const [goodsRowSelection, goodsRowCtl] = useRowSelectionTable({ customKey: 'id' })
  const [listShipperAddress, setListShipperAddress] = useState<any>([]) //发货地址
  const [listMemberCompany, setListMemberCompany] = useState<any>([]) //物流服务商
  const [badge, setbadge] = useState<any>([0, 0])
  const [memberInfo, setmemberInfo] = useState<any>({})
  const [form] = Form.useForm()
  const [goodsForm] = Form.useForm()
  const [loading, setLoading] = useState<boolean>(false)

  /**输入框输入 */
  const inputOnchange = (id, e, name) => {
    const { value } = e.target
    detailList.forEach((v) => {
      if (v.productId === id) {
        v[name] = value
      }
    })
    setdetailList([...detailList])
    countTotal(name)
  }
  /** 计算总数 */
  const countTotal = (name?: string) => {
    let num: any = 0
    detailList.forEach((item: any, idx: number) => {
      if (name === 'carton') {
        num += item.carton ? Number(item.carton) : 0
      } else if (name === 'weight') {
        num += item.weight ? Number(item.weight) : 0
      } else if (name === 'volume') {
        num += item.volume ? Number(item.volume) : 0
      }
    })
    return num
  }
  /**表头 */
  const columns: ColumnType<any>[] = [
    {
      title: 'ID',
      key: 'productId',
      dataIndex: 'productId',
    },
    {
      title: intl.formatMessage({ id: 'logistics.shangpinmingcheng' }),
      key: 'productName',
      dataIndex: 'productName',
    },
    {
      title: intl.formatMessage({ id: 'logistics.pinlei' }),
      key: 'categoryName',
      dataIndex: 'categoryName',
    },
    {
      title: intl.formatMessage({ id: 'logistics.pinpai' }),
      key: 'brandName',
      dataIndex: 'brandName',
    },
    {
      title: intl.formatMessage({ id: 'logistics.danwei' }),
      key: 'unitName',
      dataIndex: 'unitName',
    },
    {
      title: intl.formatMessage({ id: 'logistics.shuliang' }),
      key: 'amount',
      width: 120,
      dataIndex: 'amount',
      render: (text: any, record: any, index: number) => (
        <Form.Item
          style={{ marginBottom: 0 }}
          name={`amount${index}`}
          initialValue={record.amount}
          rules={[{ required: true, message: intl.formatMessage({ id: 'logistics.qingshurushuliang' }) }]}
        >
          <Input type="number" min={1} onBlur={(e) => inputOnchange(record.productId, e, 'amount')} />
        </Form.Item>
      ),
    },
    {
      title: intl.formatMessage({ id: 'logistics.xiangshu' }),
      key: 'carton',
      width: 120,
      dataIndex: 'carton',
      render: (text: any, record: any, index: number) => (
        <Form.Item
          style={{ marginBottom: 0 }}
          name={`carton${index}`}
          initialValue={record.carton}
          rules={[{ required: true, message: intl.formatMessage({ id: 'logistics.qingshuruxiangshu' }) }]}
        >
          <Input type="number" min={1} onBlur={(e) => inputOnchange(record.productId, e, 'carton')} />
        </Form.Item>
      ),
    },
    {
      title: intl.formatMessage({ id: 'logistics.zhongliangKG' }),
      key: 'weight',
      width: 120,
      dataIndex: 'weight',
      render: (text: any, record: any, index: number) => (
        <Form.Item
          style={{ marginBottom: 0 }}
          name={`weight${index}`}
          initialValue={record.weight}
          rules={[{ required: true, message: intl.formatMessage({ id: 'logistics.qingshuruzhongliangKG' }) }]}
        >
          <Input type="number" min={1} onBlur={(e) => inputOnchange(record.productId, e, 'weight')} />
        </Form.Item>
      ),
    },
    {
      title: intl.formatMessage({ id: 'logistics.tijiM3' }),
      key: 'volume',
      width: 120,
      dataIndex: 'volume',
      render: (text: any, record: any, index: number) => (
        <Form.Item
          style={{ marginBottom: 0 }}
          name={`volume${index}`}
          initialValue={record.volume}
          rules={[{ required: true, message: intl.formatMessage({ id: 'logistics.qingshurutijiM3' }) }]}
        >
          <Input type="number" min={1} onBlur={(e) => inputOnchange(record.productId, e, 'volume')} />
        </Form.Item>
      ),
    },
    {
      title: intl.formatMessage({ id: 'logistics.caozuo' }),
      key: 'options',
      dataIndex: 'options',
      render: (text: any, record: any, index: number) => (
        <Button type="link" onClick={() => handleDelect(index)}>
          {intl.formatMessage({ id: 'logistics.shanchu' })}
        </Button>
      ),
    },
  ]
  /**接口请求 */
  useEffect(() => {
    /** 物流服务商*/
    new Promise((resolve) => {
      getLogisticsSelectListMemberCompany()
        .then((res) => {
          if (res.code === 1000) {
            resolve(res.data)
          }
        })
        .catch((error) => {
          console.warn(error)
        })
    })
      .then((res) => {
        setListMemberCompany(res)
      })
      .catch((error) => console.log(error))
    /** 发货地址*/
    new Promise((resolve) => {
      getLogisticsSelectListShipperAddress()
        .then((res) => {
          if (res.code === 1000) {
            resolve(res.data)
          }
        })
        .catch((error) => {
          console.warn(error)
        })
    })
      .then((res) => {
        console.log(res, 10078)
        setListShipperAddress(res)
      })
      .catch((error) => console.log(error))
    switch (Number(createType)) {
      case 2:
        getProductInvoicesDetails({ invoicesId: id })
          .then((res: any) => {
            if (res.code === 1000) {
              const obj = {
                receiverName: res.data.receiverName,
                receiverPhone: res.data.phone,
                receiverFullAddress: res.data.fullAddress,
                shipmentOrderCode: res.data.invoicesNo,
                relevanceOrderCode: res.data.orderNo,
                voucherTime: res.data.transactionTime,
                externalState: res.data.state,
                shipmentOrderId: res.data.id,
                relevanceOrderId: res.data.relevanceInvoicesId,
                receiverMemberId: res.data.supplyMembersId,
                receiverRoleId: res.data.supplyMembersRoleId,
                receiverMemberName: res.data.supplyMembersName,
              }
              form.setFieldsValue(obj)
              setQuery({ ...obj })
            }
          })
          .catch((error) => {
            console.warn(error)
          })
        break
      case 3:
        getEnhanceProcessToBeAddLogisticsDetails({ id })
          .then((res: any) => {
            if (res.code === 1000) {
              const obj = {
                receiverName: res.data.receiveUserName,
                receiverPhone: res.data.receiveUserTel,
                receiverFullAddress: res.data.receiveAddress,
                shipperAddressId: res.data.deliveryAddressId,
                shipperFullAddress: res.data.deliveryAddress,
                shipmentOrderCode: res.data.deliveryNo,
                relevanceOrderCode: res.data.noticeNo,
                shipmentOrderId: res.data.deliveryId,
                relevanceOrderId: res.data.id,
                voucherTime: res.data.createTime,
                externalState: res.data.outerStatus,
                receiverMemberId: res.data.supplierMemberId,
                receiverRoleId: res.data.supplierRoleId,
                receiverMemberName: res.data.supplierName,
              }
              form.setFieldsValue(obj)
              setQuery({ ...obj })
            }
          })
          .catch((error) => {
            console.warn(error)
          })
        break
      case 4:
        getAftersalesReplaceGoodsPageReturnDetailByLogistics({ replaceId: id })
          .then((res: any) => {
            if (res.code === 1000) {
              const obj = {
                receiverName: res.data.receiveUserName,
                receiverPhone: res.data.receiveUserTel,
                receiverFullAddress: res.data.receiveAddress,
                relevanceOrderCode: res.data.applyNo,
                voucherTime: res.data.applyTime,
                relevanceOrderId: res.data.applyId,
                externalState: res.data.state,
                digest: res.data.applyAbstract,
                receiverMemberId: res.data.receiveMemberId,
                receiverRoleId: res.data.receiveRoleId,
                receiverMemberName: res.data.receiveUserName,
                shipmentOrderCode: res.data.deliveryNo,
                shipmentOrderId: res.data.deliveryId,
                outerStatusName: res.data.outerStatusName,
              }
              form.setFieldsValue(obj)
              setQuery({ ...obj })
            }
          })
          .catch((error) => {
            console.warn(error)
          })
        break
      case 5:
        getAftersalesReplaceGoodsPageReplaceDetailByLogistics({ replaceId: id })
          .then((res: any) => {
            if (res.code === 1000) {
              const obj = {
                receiverName: res.data.receiveUserName,
                receiverPhone: res.data.receiveUserTel,
                receiverFullAddress: res.data.receiveAddress,
                relevanceOrderCode: res.data.applyNo,
                voucherTime: res.data.applyTime,
                relevanceOrderId: res.data.applyId,
                externalState: res.data.state,
                digest: res.data.applyAbstract,
                receiverMemberId: res.data.receiveMemberId,
                receiverRoleId: res.data.receiveRoleId,
                receiverMemberName: res.data.receiveUserName,
                shipmentOrderCode: res.data.deliveryNo,
                shipmentOrderId: res.data.deliveryId,
                outerStatusName: res.data.outerStatusName,
              }
              form.setFieldsValue(obj)
              setQuery({ ...obj })
            }
          })
          .catch((error) => {
            console.warn(error)
          })
        break
      case 6:
        getAftersalesReturnGoodsPageDetailByLogistics({ returnId: id })
          .then((res: any) => {
            if (res.code === 1000) {
              const obj = {
                receiverName: res.data.receiveUserName,
                receiverPhone: res.data.receiveUserTel,
                receiverFullAddress: res.data.receiveAddress,
                relevanceOrderCode: res.data.applyNo,
                relevanceOrderId: res.data.applyId,
                voucherTime: res.data.applyTime,
                externalState: res.data.state,
                digest: res.data.applyAbstract,
                receiverMemberId: res.data.receiveMemberId,
                receiverRoleId: res.data.receiveRoleId,
                receiverMemberName: res.data.receiveUserName,
                shipmentOrderCode: res.data.deliveryNo,
                shipmentOrderId: res.data.deliveryId,
                outerStatusName: res.data.outerStatusName,
              }
              form.setFieldsValue(obj)
              setQuery({ ...obj })
            }
          })
          .catch((error) => {
            console.warn(error)
          })
        break
    }

    /**进来编辑的时候回显数据 */
    const { pathname, query } = routerHistory.location
    const path = pathname.split('/')[pathname.split('/').length - 1]
    if (path === 'edit') {
      getLogisticsOrderWaitSubmitGet({ id: query.id })
        .then((res) => {
          if (res.code === 1000) {
            const obj = {
              id: query.id,
              digest: res.data.digest,
              createType: res.data.createType,
              relevanceType: res.data.relevanceType,
              companyName: res.data.companyName,
              companyId: res.data.companyId,
              logisticsOrderNo: res.data.logisticsOrderNo,
              receiverName: res.data.receiverName,
              receiverPhone: res.data.receiverPhone,
              receiverFullAddress: res.data.receiverFullAddress,
              shipmentOrderCode: res.data.shipmentOrderCode,
              shipmentOrderId: res.data.shipmentOrderId,
              relevanceOrderCode: res.data.relevanceOrderCode,
              relevanceOrderId: res.data.relevanceOrderId,
              voucherTime: res.data.invoicesTime,
              externalState: res.data.status,
              shipperAddressId: res.data.shipperAddressId,
              shipperFullAddress: res.data.shipperFullAddress,
              logisticsOrderLogList: res.data.logisticsOrderLogList,
              settlementWay: res.data.settlementWay,
              freightPrice: res.data.freightPrice,
            }
            form.setFieldsValue(obj)
            const list = [...res.data.detailList]
            goodsRowCtl.setSelectRow(list)
            goodsRowCtl.setSelectedRowKeys(list.map((v) => v.productId))
            setQuery(obj)
            setId(query.id)
            setCreateType(res.data.createType)
            setdetailList(res.data.detailList)
          }
        })
        .catch((error) => {
          console.warn(error)
        })
    }
  }, [])

  /** 选择物流服务伤 */
  const handleSelectCompany = (option: any) => {
    const obj = { ...query }
    if (option) {
      obj.companyId = option.value
      obj.companyName = option.children
      setmemberInfo({ memberId: option.memberid, roleId: option.roleid })
    } else {
      obj.companyId = ''
      obj.companyName = ''
    }

    setQuery(obj)
  }

  /**选择发货方地址 */
  const handleSelectAddress = (option: any) => {
    const obj = { ...query }
    obj.shipperAddressId = option.value
    obj.shipperFullAddress = option.children
    obj.shipperName = option.shipperName
    obj.shipperPhone = option.shipperPhone

    setQuery(obj)
  }

  /**选择商品列表请求 */
  const fetchData = (params?: any) => {
    if (visible) {
      return new Promise((resolve) => {
        switch (Number(createType)) {
          case 1:
            if (query.shipmentOrderId) {
              // getProductInvoicesProductList({ ...params, invoicesId: query.shipmentOrderId })
              //   .then((res: any) => {
              //     if (res.code === 1000) {
              //       res.data.data.forEach((item) => {
              //         item.category = item.categoryName
              //         item.brand = item.brandName
              //         item.unit = item.unitName
              //       })
              //       resolve(res.data)
              //     }
              //   })
              //   .catch((error) => {
              //     console.warn(error)
              //   })
            } else {
              getOrderCommonProductLogisticsPage({
                ...params,
                orderId: query.relevanceOrderId,
                orderNo: query.relevanceOrderCode,
              })
                .then((res: any) => {
                  if (res.code === 1000) {
                    resolve(res.data)
                  }
                })
                .catch((error) => {
                  console.warn(error)
                })
            }
            break
          case 2:
            // getProductInvoicesProductList({
            //   ...params,
            //   invoicesId: query.shipmentOrderId ? query.shipmentOrderId : query.relevanceOrderId,
            // })
            //   .then((res: any) => {
            //     if (res.code === 1000) {
            //       res.data.data.forEach((item) => {
            //         item.category = item.categoryName
            //         item.brand = item.brandName
            //         item.unit = item.unitName
            //       })
            //       resolve(res.data)
            //     }
            //   })
            //   .catch((error) => {
            //     console.warn(error)
            //   })
            break
          case 3:
            // getProductInvoicesProductList({
            //   ...params,
            //   invoicesId: query.shipmentOrderId ? query.shipmentOrderId : query.relevanceOrderId,
            // })
            //   .then((res: any) => {
            //     if (res.code === 1000) {
            //       res.data.data.forEach((item) => {
            //         item.category = item.categoryName
            //         item.brand = item.brandName
            //         item.unit = item.unitName
            //       })
            //       resolve(res.data)
            //     }
            //   })
            //   .catch((error) => {
            //     console.warn(error)
            //   })
            break
          case 4:
            getAftersalesReplaceGoodsPageReturnCommodityByLogistics({
              ...params,
              dataId: query.relevanceOrderId ? query.relevanceOrderId : query.shipmentOrderId,
            })
              .then((res) => {
                if (res.code === 1000) {
                  resolve(res.data)
                }
              })
              .catch((error) => {
                console.warn(error)
              })
            break
          case 5:
            getAftersalesReplaceGoodsPageReplaceCommodityByLogistics({
              ...params,
              dataId: query.relevanceOrderId ? query.relevanceOrderId : query.shipmentOrderId,
            })
              .then((res) => {
                if (res.code === 1000) {
                  resolve(res.data)
                }
              })
              .catch((error) => {
                console.warn(error)
              })
            break
          case 6:
            getAftersalesReturnGoodsPageCommodityByLogistics({
              ...params,
              dataId: query.relevanceOrderId ? query.relevanceOrderId : query.shipmentOrderId,
            })
              .then((res) => {
                if (res.code === 1000) {
                  resolve(res.data)
                }
              })
              .catch((error) => {
                console.warn(error)
              })
            break
        }
      })
    }
  }

  /**确定选择商品 */
  const handleConfirm = () => {
    const selectRow = goodsRowCtl.selectRow
    console.log(selectRow)
    const arr: any[] = []
    selectRow.forEach((item: any) => {
      arr.push({
        productId: item.id ? item.id : item.productId,
        productName: item.productName || item.name,
        categoryName: item.category ? item.category : item.categoryName,
        brandName: item.brand ? item.brand : item.brandName,
        unitName: item.unit ? item.unit : item.unitName,
        amount: item.amount,
        carton: item.carton,
        weight: item.weight,
        volume: item.volume,
      })
    })
    goodsForm.resetFields()
    setdetailList([...arr])
    setvisible(false)
  }

  /***表头区域 */
  const ShippingColumns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'logistics.fahuodanhao' }),
      dataIndex: 'invoicesNo',
    },
    {
      title: intl.formatMessage({ id: 'logistics.duiyingdingdanhao' }),
      dataIndex: 'orderNo',
    },
    {
      title: intl.formatMessage({ id: 'logistics.danjuzhaiyao' }),
      dataIndex: 'invoicesAbstract',
    },
    {
      title: intl.formatMessage({ id: 'logistics.duiyingcangku' }),
      dataIndex: 'warehouseName',
    },
    {
      title: intl.formatMessage({ id: 'logistics.danjuleixing' }),
      dataIndex: 'invoicesTypeName',
    },
    {
      title: intl.formatMessage({ id: 'logistics.danjushijian' }),
      dataIndex: 'transactionTime',
      render: (text: any) => <>{moment(text).format('YYYY-MM-DD  HH:mm:ss')} </>,
    },
  ]
  const invoicesColumns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'logistics.danjuhao' }),
      dataIndex: 'applyNo',
    },
    {
      title: intl.formatMessage({ id: 'logistics.danjuzhaiyao' }),
      dataIndex: 'applyAbstract',
      render: (text, record) => text || record.digest,
    },
    {
      title: intl.formatMessage({ id: 'logistics.huiyuanmingcheng' }),
      dataIndex: 'memberName',
    },
    {
      title: intl.formatMessage({ id: 'logistics.danjushijian' }),
      dataIndex: 'applyTime',
      render: (text: any) => <>{moment(text).format('YYYY-MM-DD  HH:mm:ss')} </>,
    },
  ]
  /** 选择发货单 列表数据  */
  const fetchShippingData = (params: any) => {
    return new Promise((resolve) => {
      getProductInvoicesList({ ...params })
        .then((res) => {
          if (res.code === 1000) {
            resolve(res.data)
          }
        })
        .catch((error) => {
          console.warn(error)
        })
    })
  }
  /**确定发货单 */
  const handleShipping = () => {
    const data = { ...query }
    if (shippingRowCtl.selectRow.length > 0) {
      const selectRow = shippingRowCtl.selectRow[0]
      data.shipmentOrderId = selectRow.id
      data.shipmentOrderCode = selectRow.invoicesNo //发货单号

      data.receiverMemberName = selectRow.memberName
      data.receiverPhone = selectRow.phone
      data.receiverName = selectRow.receiverName //收货方名称
      data.receiverFullAddress = selectRow.fullAddress
      data.relevanceOrderId = selectRow.relevanceInvoicesId
      data.relevanceOrderCode = selectRow.relevanceInvoicesNo

      form.setFieldsValue({
        shipmentOrderCode: selectRow.relevanceInvoicesId,
        relevanceOrderCode: selectRow.relevanceInvoicesId,
      })
      setQuery({ ...data })
      setId(selectRow.id)
      setCreateType(1)
      setshippingvisible(false)
    }
  }
  /**确定对应订单号/售后单 */

  const conditions = (selectRow: any) => {
    const data = { ...query }
    if (!data.shipmentOrderId) {
      data.receiverPhone = selectRow.receiveUserTel
      data.receiverName = selectRow.receiveUserName //收货方名称
      data.receiverFullAddress = selectRow.receiveAddress
      data.receiverMemberName = selectRow.memberName
      data.receiverAddressId = selectRow.receiveId
    }
    data.relevanceOrderId = selectRow.applyId
    data.relevanceOrderCode = selectRow.applyNo

    form.setFieldsValue({
      relevanceOrderCode: selectRow.applyNo,
    })
    setQuery({ ...data })
    setId(selectRow.applyId)
  }
  /**确定选择对应订单号/售后单 */
  const handleInvoices = (type: number) => {
    const selectRow = invoicesRowCtl.selectRow[0]
    if (invoicesRowCtl.selectRow.length > 0) {
      const data = { ...query }
      data.relevanceType = type
      setrelevanceType(type)
      switch (type) {
        case 1:
          if (!data.shipmentOrderId) {
            data.receiverPhone = selectRow.phone
            data.receiverName = selectRow.receiverName //收货方名称
            data.receiverAddressId = selectRow.receiverAddressId
            data.receiverFullAddress = selectRow.fullAddress
            data.receiverMemberName = selectRow.memberName
          }
          data.relevanceOrderId = selectRow.id
          data.relevanceOrderCode = selectRow.orderNo

          data.shipmentOrderId = ''
          data.shipmentOrderCode = '' //发货单号

          form.setFieldsValue({
            shipmentOrderCode: undefined,
            relevanceOrderCode: selectRow.orderNo,
          })
          setQuery({ ...data })
          setId(selectRow.id)
          // setCreateType(2)
          break
        case 2:
          conditions(selectRow)
          // setCreateType(4)
          break
        case 3:
          conditions(selectRow)
          // setCreateType(5)
          break
        case 4:
          conditions(selectRow)
          // setCreateType(6)
          break
      }
      setinvoicesvisible(false)
    }
  }

  const handleDelect = (idx: number) => {
    const list = [...detailList]
    list.splice(idx, 1)
    goodsRowCtl.setSelectRow(list)
    goodsRowCtl.setSelectedRowKeys(list.map((v) => v.productId))
    setdetailList([...list])
  }

  /**打开选择商品 */
  const handleVisible = () => {
    console.log(query)
    if (query.shipmentOrderCode || query.relevanceOrderCode) {
      setvisible(true)
    } else {
      message.error(intl.formatMessage({ id: 'logistics.qingxianxuanzeyaocaozuode' }))
    }
  }

  /** 提交数据 */
  const handleSubmit = async () => {
    setLoading(true)
    const data = [...badge]
    const params = { ...query }
    const basicRef = await form
      .validateFields()
      .then((res) => {
        console.log(res)
        params.digest = res.digest
        return true
      })
      .catch((error) => {
        return error
      })
    const goodsRef = await goodsForm
      .validateFields()
      .then((res) => {
        return true
      })
      .catch((error) => {
        return error
      })
    params.createType = createType
    if (basicRef.errorFields) {
      data[0] = basicRef.errorFields.length
      setbadge(data)
      setLoading(false)
    } else {
      data[0] = 0
      setbadge(data)
      if (detailList.length > 0) {
        if (goodsRef.errorFields) {
          data[1] = goodsRef.errorFields.length
          setbadge([...data])
          setLoading(false)
        } else {
          data[1] = 0
          setbadge(data)
          const { pathname } = routerHistory.location
          const path = pathname.split('/')[pathname.split('/').length - 1]
          params.detailList = detailList
          if (path === 'edit') {
            postLogisticsOrderWaitSubmitUpdate({ ...params })
              .then((res) => {
                if (res.code !== 1000) {
                  setLoading(false)
                  return
                }
                history.goBack()
              })
              .catch((error) => {
                console.warn(error)
              })
          } else {
            postLogisticsOrderWaitSubmitAdd({ ...params })
              .then((res) => {
                if (res.code !== 1000) {
                  setLoading(false)
                  return
                }
                history.goBack()
              })
              .catch((error) => {
                console.warn(error)
              })
          }
        }
      } else {
        message.error(intl.formatMessage({ id: 'logistics.qingxiantianjiashangpin' }))
        setLoading(false)
      }
    }
  }

  /**结算方式 */
  useEffect(() => {
    if (Object.keys(memberInfo).length > 0) {
      getSettlementPlatformConfigGetSettlementWay({ ...memberInfo })
        .then((res) => {
          if (res.code === 1000) {
            const data = { ...query }
            data.settlementWay = res.data
            setQuery(data)
          }
        })
        .catch((error) => {
          message.error(error.message)
        })
    }
  }, [memberInfo])

  /**跳转到售后/订单的详情 */
  const jumpOrderDetail = (id: any) => {
    console.log(id, 1086)
    if (id) {
      switch (Number(createType)) {
        case 1:
          switch (Number(relevanceType)) {
            case 1:
              history.open(`/orderAbility/saleOrder/readyAddLogisticsOrder/detail?id=${id}`)
              break
            case 2:
              history.open(`/afterAbility/exchangeApplication/exchangePrAddLogistics/detail?id=${id}`)
              break
            case 3:
              history.open(`/afterAbility/exchangeManage/exchangePrAddLogistics/detail?id=${id}`)
              break
            case 4:
              history.open(`/afterAbility/returnApplication/returnPrAddLogistics/detail?id=${id}`)
              break
          }
          break
        case 2:
          history.open(`/orderAbility/saleOrder/readyAddLogisticsOrder/detail?id=${id}`)
          break
        case 3:
          history.open(`/handling/confirm/pendingDelivered/detail?id=${id}`)
          break
        case 4:
          history.open(`/afterAbility/exchangeApplication/exchangePrAddLogistics/detail?id=${id}`)
          break
        case 5:
          history.open(`/afterAbility/exchangeManage/exchangePrAddLogistics/detail?id=${id}`)
          break
        case 6:
          history.open(`/afterAbility/returnApplication/returnPrAddLogistics/detail?id=${id}`)
          break
      }
    } else {
      message.error(intl.formatMessage({ id: 'logistics.cidingdanidbucunzai' }))
    }
  }

  /** 查看对应发货单详情 */
  const handleOrderDetail = (id: number) => {
    if (id) {
      switch (Number(createType)) {
        case 6:
          history.open(`/afterAbility/returnApplication/returnPrAddDeliver/deliverDetail?id=${id}`)
          break
        default:
          history.open(`/commodityAbility/stockSellStorage/bills/detail?id=${id}&preview=1`)
          break
      }
    } else {
      message.error(intl.formatMessage({ id: 'logistics.cidingdanidbucunzai' }))
    }
  }

  return (
    <PageHeaderWrapper
      extra={
        <Button type="primary" onClick={handleSubmit} loading={loading}>
          {' '}
          {intl.formatMessage({ id: 'logistics.baocun' })}
        </Button>
      }
    >
      <Card>
        <Tabs type="card">
          {/** 基本信息 */}
          <TabPane
            key="tab-1"
            tab={<TabFormErrors dot={badge[0]}>{intl.formatMessage({ id: 'logistics.jibenxinxi' })}</TabFormErrors>}
            forceRender
          >
            <Form {...layout} form={form} className={styles.revise_style}>
              <Form.Item
                label={intl.formatMessage({ id: 'logistics.danjuzhaiyao' })}
                name="digest"
                rules={[{ required: true, message: intl.formatMessage({ id: 'logistics.qingshurudanjuzhaiyao' }) }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label={intl.formatMessage({ id: 'logistics.wuliufuwushang' })}
                name="companyId"
                rules={[{ required: true, message: intl.formatMessage({ id: 'logistics.qingxuanzeliufuwushang' }) }]}
              >
                <Select allowClear onChange={(value, option) => handleSelectCompany(option)}>
                  {listMemberCompany.map((item: any, idx: number) => (
                    <Option roleid={item.roleId} memberid={item.memberId} key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              {query.logisticsOrderNo && (
                <Form.Item label={intl.formatMessage({ id: 'logistics.wuliudanhao' })} name="receiverName1">
                  <span>{query.logisticsOrderNo}</span>
                </Form.Item>
              )}

              <Form.Item label={intl.formatMessage({ id: 'logistics.duiyingfahuodanhao' })} name="shipmentOrderCode">
                <Search
                  disabled={!!routerHistory.location.query?.createType}
                  readOnly
                  value={Object.keys(query).length > 0 ? query.shipmentOrderCode : undefined}
                  enterButton={
                    <div style={{ backgroundColor: '#6b778c !important', color: '#fff !important' }}>
                      <LinkOutlined /> {intl.formatMessage({ id: 'logistics.xuanze' })}
                    </div>
                  }
                  onSearch={() => setshippingvisible(true)}
                />
                {query.shipmentOrderCode && (
                  <Button type="link" onClick={() => handleOrderDetail(query.shipmentOrderId)}>
                    {intl.formatMessage({ id: 'logistics.zhakandanhaoxiangqing' })}
                  </Button>
                )}
              </Form.Item>
              <Form.Item
                label={intl.formatMessage({ id: 'logistics.duiyingdingdanhaoshouhou' })}
                name="relevanceOrderCode"
              >
                <Search
                  disabled={!!routerHistory.location.query?.createType}
                  readOnly
                  value={Object.keys(query).length > 0 ? query.relevanceOrderCode : undefined}
                  enterButton={
                    <div style={{ backgroundColor: '#6b778c !important', color: '#fff !important' }}>
                      <LinkOutlined /> {intl.formatMessage({ id: 'logistics.xuanze' })}
                    </div>
                  }
                  onSearch={() => setinvoicesvisible(true)}
                />
                {query.relevanceOrderCode && (
                  <Button type="link" onClick={() => jumpOrderDetail(query.relevanceOrderId)}>
                    {intl.formatMessage({ id: 'logistics.zhakandanhaoxiangqing' })}
                  </Button>
                )}
              </Form.Item>
              <Form.Item label={intl.formatMessage({ id: 'logistics.shouhuofang' })} name="receiverName">
                <span>
                  {query.receiverName}/{query.receiverPhone}
                </span>
              </Form.Item>
              <Form.Item label={intl.formatMessage({ id: 'logistics.shouhuodizhi' })} name="receiverFullAddress">
                <div>{query.receiverFullAddress}</div>
              </Form.Item>
              <Form.Item
                label={intl.formatMessage({ id: 'logistics.fahuodizhi' })}
                name="shipperAddressId"
                rules={[{ required: true, message: intl.formatMessage({ id: 'logistics.qingxuanzefahuodizhi' }) }]}
              >
                <Select allowClear onChange={(value, option) => handleSelectAddress(option)}>
                  {listShipperAddress.map((item: any, idx: number) => (
                    <Option key={item.id} value={item.id} shipperName={item.shipperName} shipperPhone={item.phone}>
                      {item.fullAddress}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label={intl.formatMessage({ id: 'logistics.danjushijian' })} name="voucherTime">
                <span>{query.voucherTime && moment(query.voucherTime).format('YYYY-MM-DD  HH:mm:ss')} </span>
              </Form.Item>
              {createType === 2 || createType === 3 ? (
                <Form.Item label={intl.formatMessage({ id: 'logistics.waibuzhuangtai' })} name="externalState">
                  {query.externalState === 1 ? (
                    <Badge status="warning" text={intl.formatMessage({ id: 'logistics.daitijiao' })} />
                  ) : query.externalState === 2 ? (
                    <Badge status="processing" text={intl.formatMessage({ id: 'logistics.daiqueren' })} />
                  ) : query.externalState === 3 ? (
                    <Badge status="error" text={intl.formatMessage({ id: 'logistics.bujieshouwuliudan' })} />
                  ) : query.externalState === 4 ? (
                    <Badge status="success" text={intl.formatMessage({ id: 'logistics.jieshouwuliudan' })} />
                  ) : (
                    ''
                  )}
                </Form.Item>
              ) : createType === 4 || createType === 5 || createType === 6 ? (
                <Form.Item label={intl.formatMessage({ id: 'logistics.waibuzhuangtai' })} name="externalState">
                  <Badge status="warning" text={query.outerStatusName} />
                </Form.Item>
              ) : (
                <></>
              )}
            </Form>
          </TabPane>
          {/** 物流单明细 */}
          <TabPane
            key="tab-2"
            tab={<TabFormErrors dot={badge[1]}>{intl.formatMessage({ id: 'logistics.wuliudanmingxi' })}</TabFormErrors>}
            forceRender
          >
            <Button block type="dashed" style={{ marginBottom: '24px' }} onClick={handleVisible}>
              <PlusOutlined />
              {intl.formatMessage({ id: 'logistics.xuanzeshangpin' })}
            </Button>
            <Form form={goodsForm}>
              <Table columns={columns} dataSource={detailList} rowKey={'productId'} pagination={false} />
            </Form>
            <Row gutter={[16, 16]} style={{ margin: '0 0 0 65%', width: '35%' }}>
              <Col span={8}>
                <Statistic
                  title={intl.formatMessage({ id: 'logistics.zongxiangshuxiang' })}
                  value={countTotal('carton')}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title={intl.formatMessage({ id: 'logistics.zongzhongliangKG' })}
                  value={countTotal('weight')}
                />
              </Col>
              <Col span={8}>
                <Statistic title={intl.formatMessage({ id: 'logistics.zongtijiM3' })} value={countTotal('volume')} />
              </Col>
            </Row>
          </TabPane>
          {/** 运费 */}
          <TabPane key="tab-3" tab={intl.formatMessage({ id: 'logistics.yunfei' })} forceRender>
            <Form {...layout}>
              {query.freightPrice && (
                <Form.Item label={intl.formatMessage({ id: 'logistics.yunfei' })}>
                  <span>{query.freightPrice}</span>
                </Form.Item>
              )}
              <Form.Item label={intl.formatMessage({ id: 'logistics.jiesuanfangshi' })}>
                <span>{query.settlementWay}</span>
              </Form.Item>
            </Form>
          </TabPane>
          {/** 流转记录 */}
          <TabPane key="tab-4" tab={intl.formatMessage({ id: 'logistics.liuzhuanjilu' })} forceRender>
            <Table columns={ExternalListColumns} dataSource={query.logisticsOrderLogList} />
          </TabPane>
        </Tabs>
      </Card>
      {/* 选择对应发货单 - createType === 1的时候才显示 */}
      <ModalTable
        width={900}
        modalTitle={intl.formatMessage({ id: 'logistics.xuanzefahuodan' })}
        columns={ShippingColumns}
        visible={shippingvisible}
        rowSelection={shippingRowSelection}
        cancel={() => setshippingvisible(false)}
        confirm={handleShipping}
        resetModal={{ destroyOnClose: true, forceRender: true }}
        forceRender={true}
        fetchTableData={(params) => fetchShippingData(params)}
        tableProps={{ rowKey: 'id' }}
        modalType="logisticsDelivery"
        searchName="invoicesNo"
      />
      {/* 选择对应订单号/售后单 */}
      <ModalTableOrder
        width={1000}
        visible={invoicesvisible}
        columns={invoicesColumns}
        invoicesNo={query.invoicesNo}
        relevanceType={relevanceType}
        tableProps={{ rowKey: 'id' }}
        resetModal={{ destroyOnClose: true, forceRender: true }}
        forceRender={true}
        rowSelection={invoicesRowSelection}
        cancel={() => setinvoicesvisible(false)}
        confirm={handleInvoices}
      />
      {/* 选择商品 */}
      <ModalTable
        modalTitle={intl.formatMessage({ id: 'logistics.xuanzeshangpin' })}
        visible={visible}
        columns={
          createType !== 4 && createType !== 5 && createType !== 6 ? SelectGoodsColumns : AfterSalesSelectGoodsColumns
        }
        resetModal={{ destroyOnClose: true, forceRender: true }}
        forceRender={true}
        fetchTableData={(params) => fetchData(params)}
        cancel={() => setvisible(false)}
        confirm={handleConfirm}
        rowSelection={goodsRowSelection}
        modalType="selectGoodsSchema"
        searchName="productName"
        tableProps={{
          rowKey: 'id',
        }}
      />
    </PageHeaderWrapper>
  )
}

export default AddLogistics
