/*
 * @Author: XieZhiXiong
 * @Date: 2020-11-04 15:09:09
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-10-26 10:32:48
 * @Description: 维修商品抽屉组件
 */
import React from 'react'
import { Drawer, Button, Pagination, message } from 'antd'
import { getIntl } from '@linkseeks/i18n'
import { createFormActions } from '@apps/formily'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import NiceForm from '@/components/NiceForm'
import NestTable from '@/components/NestTable'
import { goodItem, OrderListRes } from './interface'
import { listSearchSchema } from './schema'
import styles from './index.less'

const intl = getIntl()

const formActions = createFormActions()

const PAGE_SIZE = 16

interface GoodsDrawerProps {
  /**
   * 选中值（子表格的值）
   */
  checked: number[]
  /**
   * 抽屉标题
   */
  title?: string
  /**
   * 是否可见的
   */
  visible: boolean
  /**
   * 关闭事件
   */
  onClose: () => void
  /**
   * 确定事件
   */
  onConfirm: (values: goodItem[]) => void
  /**
   * 选项改变事件
   */
  onChange: (value: number[]) => void
  /**
   * 获取订单列表数据
   */
  fetchOrderList: (params: any) => Promise<OrderListRes>
  /**
   * NestTableProps
   */
  nestProps?: {
    [key: string]: any
  }
  /**
   * 是否展示检索框
   */
  searchable?: boolean
  /**
   * 流程类型：2.售后换货流程 3.售后退货流程 4.售后维修流程
   */
  afterType: 2 | 3 | 4
  /**
   * 订单类型
   */
  orderType: number
}

interface GoodsDrawerState {
  page: number
  size: number
  searchVal: {
    orderNo?: string
    orderThe?: string
    startCreateTime?: string
    endCreateTime?: string
    type?: string
  }
  dataSource: OrderListRes
  selectedRowKeys: number[]
  childSelectedRowKeys: number[]
  loading: boolean
}

// 跟 选中的子节点 找到 父级选中的 keys
function transformParentKeys(data: any[], childCheckedKeys: string[]) {
  const ret = []

  if (!Array.isArray(data)) {
    return ret
  }
  data.forEach((item) => {
    const atom = {
      checkeds: [],
      ...item,
    }

    // 这里循环遍历 判断 选中的子表格的keys中 是否包含 当前子项，如果有先 push 到父节点的 checkeds
    if (item.products && item.products.length) {
      item.products.forEach((childItem) => {
        if (childCheckedKeys.find((key) => key === childItem.id)) {
          atom.checkeds.push(childItem.id)
        }
      })
    }

    // 判断两者长度 一样 就表示父节点时候选中的
    if (atom.checkeds.length === (atom.products && atom.products.length)) {
      ret.push(atom.id)
    }
  })
  return ret
}

class GoodsDrawer extends React.Component<GoodsDrawerProps, GoodsDrawerState> {
  static getDerivedStateFromProps(nextProps, nextState) {
    const { checked } = nextProps
    const { dataSource } = nextState
    const parents = transformParentKeys(dataSource.data, checked)

    if ('checked' in nextProps) {
      return {
        selectedRowKeys: parents,
        childSelectedRowKeys: checked,
      }
    }
    return null
  }

  constructor(props) {
    super(props)
    this.state = {
      page: 1,
      size: PAGE_SIZE,
      searchVal: {},
      dataSource: {
        totalCount: 0,
        data: [],
      },
      selectedRowKeys: [],
      childSelectedRowKeys: [],
      loading: false,
    }
  }

  flattened = []

  // 获取订单列表
  getOrderList = async () => {
    const { page, size, searchVal } = this.state
    const { fetchOrderList, afterType, orderType } = this.props

    // const isMateriel = (
    //   orderType === ORDER_TYPE_INQUIRY_CONTRACT
    //   || orderType === ORDER_TYPE_BIDDING_CONTRACT
    //   || orderType === ORDER_TYPE_TENDER_CONTRACT
    // );

    if (!fetchOrderList) {
      return
    }

    this.setState({ loading: true })
    try {
      const orderListRes = await fetchOrderList({
        current: `${page}`,
        pageSize: `${size}`,
        ...searchVal,
      })
      if (orderListRes) {
        const { data, ...rest } = orderListRes
        const newData: { [key: string]: any }[] = data.map((item) => ({
          ...item,
          id: item.orderId,
          products: item.products.map(({ productId, logo, ...rest }) => ({
            id: productId,
            ...rest,
            quantity: +rest.quantity,
            purchasePrice: +rest.purchasePrice,
            tax: rest.tax ? 1 : 0,
            taxRate: +rest.taxRate,
            orderNo: item.orderNo,
            orderId: item.orderId,
            payInfoList: item.payInfoList,
            orderType: item.orderType,
            contractId: item.contractId,
            contractNo: item.contractNo,
            skuPic: logo,
            shopId: item.shopId,
            shopLogo: item.logo,
            shopName: item.vendorMemberName,
          })),
        }))
        newData.forEach((item) => {
          item.products.forEach((product) => {
            // 防止重复添加数据
            if (!this.flattened.find((flat) => flat.id === product.id)) {
              this.flattened.push(product)
            }
          })
        })

        this.setState({
          dataSource: {
            data: newData,
            ...rest,
          },
        })
      }
    } catch (error) {
      console.warn('error', error)
    }
    this.setState({ loading: false })
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.visible && this.props.visible && !this.state.loading) {
      this.getOrderList()
    }
  }

  handlePaginationChange = (page, size) => {
    this.setState(
      {
        page,
        size,
      },
      () => {
        this.getOrderList()
      },
    )
  }

  handleSearch = (values) => {
    this.setState(
      {
        page: 1,
        searchVal: values,
      },
      () => {
        this.getOrderList()
      },
    )
  }

  handleClose = () => {
    if (this.props.onClose) {
      this.props.onClose()
    }
  }

  // 子表格选中行
  handleChildSelectChange = (record: any, selected: any, selectedRows: any) => {
    const {
      childSelectedRowKeys,
      dataSource: { data },
    } = this.state
    let childArr: any = [...childSelectedRowKeys]
    // 第一步，判断selected true：选中，将 id值 添加到childArr，false：取消选中，将 id值 从childArr中移除
    if (selected) {
      childArr.push(record.id)
    } else {
      childArr.splice(
        childArr.findIndex((item: any) => item === record.id),
        1,
      )
    }

    const fullData = this.findFullProductArr(childArr, this.flattened)
    const filtered = this.filterProduct(fullData)
    const filteredKeys = filtered.map((item) => item.id)

    if (!('checked' in this.props)) {
      this.setState({ childSelectedRowKeys: filteredKeys })
    }
    this.triggerChange(filteredKeys)
  }

  // 子表格选中所有行
  handleChildSelectAll = (selected: any, selectedRows: any, changeRows: any) => {
    const {
      selectedRowKeys,
      childSelectedRowKeys,
      dataSource: { data },
    } = this.state
    // 第一步：判断selected，true：将子Table全部选中，false：将子Table全部取消选中
    let childArr: any = [...childSelectedRowKeys]
    if (selected) {
      // 全选
      childArr = Array.from(new Set([...childArr, ...changeRows.map((item: any) => item.id)]))
    } else {
      // 取消全选
      childArr = childArr.filter((item: any) => !changeRows.some((e: any) => e.id === item))
    }

    const fullData = this.findFullProductArr(childArr, this.flattened)
    const filtered = this.filterProduct(fullData)
    const filteredKeys = filtered.map((item) => item.id)

    if (!('checked' in this.props)) {
      this.setState({ childSelectedRowKeys: filteredKeys })
    }
    this.triggerChange(filteredKeys)
  }

  // 表格选中行
  handleParentSelectChange = (record: any, selected: any, selectedRows: any) => {
    const {
      selectedRowKeys,
      childSelectedRowKeys,
      dataSource: { data },
    } = this.state
    let childArr: any = [...childSelectedRowKeys]
    // setChildArr：选择父Table下的所有子选项
    let setChildArr = data.find((d: any) => d.id === record.id).products.map((item: any) => item.id)
    // 第一步  判断selected   true：选中，false，取消选中
    if (selected) {
      // 第二步，父Table选中，子Table全选中（全部整合到一起，然后去重）
      childArr = Array.from(new Set([...childArr, ...setChildArr]))
    } else {
      // 第二步，父Table取消选中，子Table全取消选中（针对childArr，过滤掉取消选中的父Table下的所有子Table的 id）
      childArr = childArr.filter((item: any) => !setChildArr.some((e: any) => e === item))
    }

    const fullData = this.findFullProductArr(childArr, this.flattened)
    const filtered = this.filterProduct(fullData)
    const filteredKeys = filtered.map((item) => item.id)

    if (!('checked' in this.props)) {
      this.setState({ childSelectedRowKeys: filteredKeys })
    }
    this.triggerChange(filteredKeys)
  }

  // 表格选中所有行
  hanldeParentSelectAll = (selected: any, selectedRows: any, changeRows: any) => {
    const {
      selectedRowKeys,
      childSelectedRowKeys,
      dataSource: { data },
    } = this.state
    let setChildArr: any = [] // 将改变的父Table下的子Table下的 id 都添加到setChildArr中
    data.forEach((item: any) => {
      setChildArr = [...setChildArr, ...(item.products || []).map((item: any) => item.id)]
    })

    // 第一步判断 selected true：全选，false：取消全选
    if (selected) {
      // 第二步：父Table选中，子Table全选中，设置子Table 的 SelectedRowKeys
      const fullData = this.findFullProductArr(setChildArr, this.flattened)
      const filtered = this.filterProduct(fullData)
      const filteredKeys = filtered.map((item) => item.id)

      if (!('checked' in this.props)) {
        this.setState({ childSelectedRowKeys: filteredKeys })
      }
      this.triggerChange(filteredKeys)
    } else {
      // 第二步：父Table取消选中，子Table 全取消选中，设置子 Table 的 SelectedRowKeys
      if (!('checked' in this.props)) {
        this.setState({ childSelectedRowKeys: [] })
      }
      this.triggerChange([])
    }
  }

  handleConfirm = () => {
    const {
      childSelectedRowKeys,
      dataSource: { data },
    } = this.state
    const { onConfirm } = this.props

    if (onConfirm) {
      // 从选中的子表格行 key，找到完整的信息
      const fullDate = []

      this.flattened.forEach((product) => {
        if (childSelectedRowKeys.find((key) => key === product.id)) {
          fullDate.push({
            ...product,
            orderNo: product.orderNo, // 手动补全订单单号
          })
        }
      })
      onConfirm(fullDate)
    }
    this.handleClose()
  }

  handleAfterVisibleChange = (visible) => {
    if (!visible) {
      this.handleClose()
    }
  }

  triggerChange = (changedValue) => {
    const { onChange } = this.props
    if (onChange) {
      onChange(changedValue)
    }
  }

  findFullProductArr = (selectKeys, data) => {
    const ret = []
    selectKeys.forEach((item) => {
      const current = data.find((dataItem) => dataItem.id === item)
      if (current) {
        ret.push(current)
      }
    })
    return ret
  }

  // 过滤工作流不同的 商品
  // 如果是合同订单相关，过滤合同编号不同的数据
  filterProduct = (data) => {
    const first = data.length ? data[0] : null
    if (!first) {
      return []
    }

    // 过滤合同编号不同的的商品
    const filtered1 = data.filter((item) => item.contractNo === first.contractNo)
    if (filtered1.length !== data.length) {
      message.warning(
        intl.formatMessage({
          id: 'afterService.components.GoodsDrawer.filter.1',
          defaultMessage: '已过滤掉 合同编号不同 商品',
        }),
      )
    }
    // 售后退货、换货才涉及工作流相关
    if (this.props.afterType !== 2 && this.props.afterType !== 3) {
      return filtered1
    }
    // 过滤工作流不同的的商品
    const filtered2 = filtered1.filter((item) => item.processKey === first.processKey)
    if (filtered2.length !== filtered1.length) {
      message.warning(
        intl.formatMessage({
          id: 'afterService.components.GoodsDrawer.filter.2',
          defaultMessage: '已过滤掉 售后工作流不同 商品',
        }),
      )
    }
    return filtered2
  }

  render() {
    const { page, size, dataSource, childSelectedRowKeys, selectedRowKeys, loading } = this.state
    const {
      title = intl.formatMessage({ id: 'afterService.components.GoodsDrawer.title', defaultMessage: '选择维修商品' }),
      visible = false,
      nestProps = {},
      searchable = false,
    } = this.props

    return (
      <Drawer
        title={title}
        width={1200}
        onClose={this.handleClose}
        afterVisibleChange={this.handleAfterVisibleChange}
        visible={visible}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button onClick={this.handleClose} style={{ marginRight: 8 }}>
              {intl.formatMessage({ id: 'afterService.common.cancel', defaultMessage: '取 消' })}
            </Button>
            <Button onClick={this.handleConfirm} type="primary">
              {intl.formatMessage({ id: 'afterService.common.confirm', defaultMessage: '确 定' })}
            </Button>
          </div>
        }
        destroyOnClose
      >
        <div className={styles.order}>
          {searchable && (
            <div className={styles['order-head']}>
              <NiceForm
                actions={formActions}
                onSubmit={this.handleSearch}
                effects={($, actions) => {
                  useStateFilterSearchLinkageEffect($, actions, 'orderNo', FORM_FILTER_PATH)
                }}
                schema={listSearchSchema}
              />
            </div>
          )}

          <div className={styles['order-body']}>
            <NestTable
              NestColumns={[]}
              className="common_tb"
              rowClassName={(_, index) => index % 2 === 0 && 'tb_bg'}
              rowKey="orderId"
              childrenDataKey="products"
              dataSource={dataSource.data}
              loading={loading}
              childRowSelection={{
                selectedRowKeys: childSelectedRowKeys,
                onSelect: this.handleChildSelectChange,
                onSelectAll: this.handleChildSelectAll,
              }}
              rowSelection={{
                selectedRowKeys: selectedRowKeys,
                onSelect: this.handleParentSelectChange,
                onSelectAll: this.hanldeParentSelectAll,
              }}
              {...nestProps}
            />
          </div>

          {searchable && (
            <div className={styles['order-foot']}>
              <Pagination
                current={page}
                pageSize={size}
                total={dataSource.totalCount}
                onChange={this.handlePaginationChange}
                size="small"
                showQuickJumper
              />
            </div>
          )}
        </div>
      </Drawer>
    )
  }
}

export default GoodsDrawer
