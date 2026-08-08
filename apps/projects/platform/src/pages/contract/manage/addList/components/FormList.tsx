import React, { useRef, useState, useEffect, forwardRef } from 'react'
import { Button, Table, Input, Select, Popconfirm, Form, Typography, Modal, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import StandardTable from '@/components/StandardTable'
import styles from '../index.less'
import { goodcolumns, purchasecolumns } from '../Table'
const { Option } = Select
const { Text } = Typography
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import { getProductMaterielGetMaterielList } from '@apps/apis'
import {
  getPurchaseBiddingPrizeMaterielPage,
  getPurchaseQuotedPriceProductlistListContract,
  getPurchaseSubmitTenderMaterielGetSubmitTenderMaterielList,
} from '@apps/apis'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import {
  getContractPurchaseRequisitionPageToBeCreate,
  postContractPurchaseRequisitionGetPrpIdsByRequisitionProductIds,
} from '@apps/apis'
import { FormEffectHooks } from '@apps/formily'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { MaterialListSchema } from './schema'
import { PurchaseContractListSchema } from './schema'
import Submit from '@/components/NiceForm/components/Submit'
import BigNumber from 'bignumber.js'
import deepClone from 'clone'
import {
  searchBrandOptionEffect,
  searchCustomerCategoryOptionEffect,
} from '@/pages/procurementAbility/purchaseRequisition/increaseRequisition/effects'
import CustomInputSearch from '@/components/NiceForm/components/CustomInputSearch'
import CustomCategorySearch from '@/components/NiceForm/components/CustomCategorySearch'
import { useLocation } from '@linkseeks/router-core'
import { getWebIntl } from '@apps/locales'
const intl = getIntl()
const translate = getWebIntl()
const FormList = (props: any) => {
  const { state } = useLocation()
  const _state: any = state

  const { currentRef, Row, sourceType, sourceWay, form, totalAmountChange } = props
  const refs = useRef<any>({})
  const purchaseRefs = useRef<any>({})
  /* 显示模态框 */
  const [isModalVisible, setIsModalVisible] = useState(false) // 显示模态框
  const [isPurchaseModalVisible, setIsPurchaseModalVisible] = useState(false) // 显示模态框
  const [purchaseData, setPurchaseData] = useState<any>([])

  const [refresh, setRefresh] = useState<number>(1)
  const [rowSelection, RowCtl] = useRowSelectionTable({ customKey: 'id' })

  const [dataList, setData] = useState<any[]>([]) // 列表数据
  const [columnsTab, setcolumnsTab] = useState<any>([])

  const [lockDemandPool, setLockDemandPool] = useState<boolean>(_state?.demandPoolRows ? true : false)
  const [associatedDocumentsVisible, setAssociatedDocumentsVisible] = useState<boolean>(false)
  const [lookAssociatedproductNo, setLookAssociatedproductNo] = useState<string>('')
  const [selectData, setSelectData] = useState<any>([])
  const [dataFromPool, setDataFromPool] = useState<any>([])

  // const formActions = createFormActions();

  const handleTotalAmountChange = (list) => {
    let num = 0
    list.map((i) => {
      num = new BigNumber(+num).plus(i.bidAmount).toNumber()
    })

    totalAmountChange(num)
  }

  /** 相同物料组合成同一条 */
  const handlePurchaseData = (selectRow, flag?: boolean) => {
    const data = selectRow

    const newArray = data.reduce((total, cur) => {
      const hasValue = total.findIndex((current) => {
        return current.productNo === cur.productNo
      })

      if (hasValue === -1) total.push(cur)
      if (hasValue !== -1)
        total[hasValue].surplusQuantity = new BigNumber(+total[hasValue].surplusQuantity)
          .plus(cur.surplusQuantity)
          .toNumber()
      if (hasValue !== -1) total[hasValue].prpIds = total[hasValue].prpIds + ',' + cur.prpIds
      return total
    }, [])

    newArray.map((item: any, index: number) => {
      let num = 0
      const prpIdsList = item.prpIds?.toString().split(',')

      const startList = flag ? selectRow : Object.keys(Row).length === 0 ? purchaseData : selectRow

      startList?.forEach((i) => {
        if (prpIdsList?.length && prpIdsList.indexOf(i.prpId.toString()) > -1) {
          if (i.productNo == item.productNo && i.prpId == prpIdsList[prpIdsList.indexOf(i.prpId.toString())]) {
            num = new BigNumber(+i.num).plus(num).toNumber()
          }
        }
      })

      item.bidCount = num
      item.rowId = index + 1
      item.price = item.price || ''
      item.materielId = item.id
    })

    return newArray
  }

  useEffect(() => {
    //需求池转入
    if (_state?.demandPoolRows) {
      const _requisitionProductIds = _state?.demandPoolRows?.map((item) => item.id)
      postContractPurchaseRequisitionGetPrpIdsByRequisitionProductIds({
        requisitionProductIds: _requisitionProductIds,
      }).then((res) => {
        message.destroy()
        if (res.code === 1000) {
          let list = _state?.demandPoolRows
            ?.map((i: any, index: number) => {
              i.id = res.data[index]
              i.code = i.productNo
              i.customerCategory = {
                name: i.category || '',
              }
              i.brand = {
                name: i.brand || '',
              }
            })
            .filter((item) => item)
          setPurchaseData(JSON.parse(JSON.stringify(list)))
          list = handlePurchaseData(list, true)
          console.log(list)
          setData(list)
          setDataFromPool(list)
          setSelectData(list)
        }
      })
    }
  }, [])

  /* 设置值 */
  const setInput = (e, name, id) => {
    let idx
    dataList.map((i, index) => {
      if (i.id == id) idx = index
    })

    let flag: boolean = false // 是否触发金额总值变化
    const item: any = [...dataList]
    switch (name) {
      case 'isHasTax':
        item[idx].isHasTax = e
        break
      case 'taxRate':
        item[idx].taxRate = e.target.value
        break
      case 'price':
        item[idx].price = e.target.value
        flag = true
        break
      case 'bidCount':
        item[idx].bidCount = e.target.value
        flag = true
        break
      case 'purchaseCount':
        item[idx].purchaseCount = e.target.value
        break
    }
    item[idx].bidAmount =
      item[idx].bidCount && item[idx].price
        ? new BigNumber(+item[idx].bidCount).multipliedBy(item[idx].price).toNumber().toFixed(2)
        : 0

    setData(item)

    if (flag) handleTotalAmountChange(item)
  }

  /* 确定 */
  const handleOk = () => {
    setData([])
    const list = JSON.parse(JSON.stringify(RowCtl.selectRow))

    if (sourceType == 4) {
      list.map((item: any) => {
        item.prpIds = item.prpId
      })
      console.log('ok---------', list)
      setSelectData(list)
      const newList = handlePurchaseData(JSON.parse(JSON.stringify(list)))

      newList.map((i) => {
        i.newId = i.prpId
        i.isHasTax = form.getFieldValue('isHasTax' + i.prpId) || undefined
        i.taxRate = form.getFieldValue('taxRate' + i.prpId) || ''
        i.price = form.getFieldValue('price' + i.prpId) || ''
        i.bidAmount =
          i.bidCount && i.price ? new BigNumber(+i.bidCount).multipliedBy(i.price).toNumber().toFixed(2) : ''
      })

      setData(newList)
      setIsPurchaseModalVisible(false)
    } else {
      list.map((item: any, index: number) => {
        item.newId = item.id
        item.rowId = index + 1
        item.isHasTax = form.getFieldValue('isHasTax' + item.id) || undefined
        item.taxRate = form.getFieldValue('taxRate' + item.id) || ''
        item.price = form.getFieldValue('price' + item.id) || ''
        item.bidCount = form.getFieldValue('bidCount' + item.id) || ''
        item.bidAmount =
          item.bidCount && item.price
            ? new BigNumber(+item.bidCount).multipliedBy(item.price).toNumber().toFixed(2)
            : ''
        item.materielId = item.id
      })
      setSelectData(list)
      setIsModalVisible(false)
      setData(list)
    }
    setRefresh(refresh + 1)
  }
  /* 获取商品 */
  const getGoodsList = (params) => {
    return new Promise((resolve) => {
      getProductMaterielGetMaterielList(params).then((res) => {
        if (res.code === 1000) {
          resolve(res.data)
        }
      })
    })
  }
  /* 获取请购物料 */
  const getPurchaseList = (params) => {
    return new Promise((resolve) => {
      getContractPurchaseRequisitionPageToBeCreate(params).then((res) => {
        if (res.code === 1000) {
          const data = res.data?.data?.map((i: any) => {
            i.id = i.prpId
            i.customerCategory = {
              name: i.category || '',
            }
            i.brand = {
              name: i.brand || '',
            }
            i.unitName = i.unit
            i.type = i.spec
            i.bidCount = i.surplusQuantity
            i.num = i.surplusQuantity
            i.prpIds = i.prpId
            i.price = ''
            return i
          })

          const newData = purchaseData

          data.map((ii) => {
            if (!purchaseData.some((i) => i.prpId == ii.prpId)) newData.push(ii)
          })
          setPurchaseData(newData)
          resolve({ ...res.data, data })
        }
      })
    })
  }

  /* 删除 */
  const handleDelete = (item) => {
    const { id, productNo } = item
    const dataSource = [...dataList]
    const _dataFromPool = [...dataFromPool]
    const List = dataSource.filter((items) => items.id !== id)
    const _poolList = _dataFromPool.filter((items) => items.id !== id)
    setDataFromPool(_poolList)
    setData(List)
    handleTotalAmountChange(List)
    setSelectData(dataSource.filter((items) => (sourceType == 4 ? items.productNo !== productNo : items.id !== id)))
    // setSelectedRowKeys(RowKeysList)
  }

  /* 获取物料信息 */
  const getList = () => {
    const parmas: any = {
      current: '1',
      pageSize: '10',
    }
    if (sourceType == 4) {
      let list = JSON.parse(sessionStorage.getItem('recordList'))
      list = list?.map((i: any) => {
        i.id = i.prpId
        i.customerCategory = {
          name: i.category || '',
        }
        i.brand = {
          name: i.brand || '',
        }
        i.unitName = i.unit
        i.type = i.spec
        i.bidCount = i.surplusQuantity
        i.num = i.surplusQuantity
        i.price = ''
        i.quantity = i.quantity
        i.prpIds = i.prpId
        i.price = ''
        i.newId = i.prpId
        return i
      })

      setPurchaseData(deepClone(list))
      setSelectData(deepClone(list))
      setData(handlePurchaseData(deepClone(list)))

      return
    }
    let fn
    switch (sourceType) {
      case '1':
        parmas.id = Row.demandId
        parmas.memberId = Row.partyBMemberId
        parmas.memberRoleId = Row.partyBRoleId
        fn = getPurchaseQuotedPriceProductlistListContract
        break

      case '2':
        parmas.submitTenderId = Row.bidId
        fn = getPurchaseSubmitTenderMaterielGetSubmitTenderMaterielList
        break

      case '3':
        parmas.id = Row.viePriceId
        fn = getPurchaseBiddingPrizeMaterielPage
        break

      default:
        break
    }
    /* 过滤字段 */
    const _filter = (sourceTypes: string, newObj: any, callBackArr: any[]) => {
      const key = callBackArr[sourceTypes]
      if (!key) {
        return ''
      }
      let callBlackString = ''
      if (sourceTypes == '2') {
        if (newObj.inviteTenderMateriel[key]) {
          return newObj.inviteTenderMateriel[key]
        } else {
          return newObj[key]
        }
      }
      callBlackString = newObj[key]
      if (callBlackString == null) {
        return ''
      }
      return callBlackString
    }
    /* 处理数组 */
    const _filterArr = (sourceTypes: string, newObj: any, callBackArr: any[]) => {
      let callBlackString = _filter(sourceTypes, newObj, callBackArr)
      if (Object.getPrototypeOf(callBlackString) === Array.prototype) {
        callBlackString = callBlackString[0]
      }
      return callBlackString
    }
    /* 处理布尔值 */
    const _filterFalg = (sourceTypes: string, newObj: any, callBackArr: any[]) => {
      let callBlackString = _filter(sourceTypes, newObj, callBackArr)
      if (sourceTypes !== '1') {
        callBlackString = callBlackString ? '1' : '0'
      }
      return Number(callBlackString)
    }

    fn(parmas)
      .then((res) => {
        if (res.code === 1000) {
          const data = res.data.data.map((item, index) => {
            return {
              materielId: _filterArr(sourceType, item, ['', 'goodsId', 'goodsId', 'goodsId']),
              code: _filter(sourceType, item, ['', 'number', 'code', 'number']), // 物料编号
              name: _filter(sourceType, item, ['', 'name', 'name', 'name']), //物料名称
              type: _filter(sourceType, item, ['', 'model', 'type', 'model']), //物料规格
              customerCategory: {
                // 品类
                name: _filter(sourceType, item, ['', 'category', 'categoryName', 'category']),
                category: _filter(sourceType, item, ['', 'category', '', '']),
                id: _filterArr(sourceType, item, ['', 'goodsId', 'categoryId', 'ids']),
              },
              brand: {
                name: _filter(sourceType, item, ['', 'brand', 'brandName', 'brand']),
              }, // 品牌
              unitName: _filter(sourceType, item, ['', 'unit', 'unitName', 'unit']), //单位
              purchaseCount: _filter(sourceType, item, ['', 'purchaseCount', 'count', 'purchaseCount']), // 数量
              isHasTax: _filterFalg(sourceType, item, ['', 'isTax', 'isTax', 'isTax']), // 数量是否函税
              taxRate: _filter(sourceType, item, ['', 'taxProbability', 'taxRate', 'taxRate']) || 0, //税率
              price: _filter(sourceType, item, ['', 'taxUnitPrice', 'price', 'unitPrice']), //单价
              bidCount:
                sourceType == '1'
                  ? ((item.awardTaxProbability * item.purchaseCount) / 100).toFixed(3)
                  : sourceType == '2'
                  ? ((item.awardTenderRatio * item.inviteTenderMateriel.count) / 100).toFixed(3)
                  : item.purchaseCount.toFixed(3),
              bidAmount:
                sourceType == '1'
                  ? (
                      Number(((item.awardTaxProbability * item.purchaseCount) / 100).toFixed(3)) * item.taxUnitPrice
                    ).toFixed(2)
                  : sourceType == '2'
                  ? (
                      Number(((item.awardTenderRatio * item.inviteTenderMateriel.count) / 100).toFixed(3)) * item.price
                    ).toFixed(2)
                  : item.price.toFixed(2),
              // productBrand
              associatedDataId: _filter(sourceType, item, ['', 'productId', 'commoditySkuId']), // 关联商品id
              associatedGoods: _filter(sourceType, item, ['', 'productName', 'commodityName', '']), //关联
              // associatedMaterielNo: _filter(sourceType, item, ['', 'number', 'commodityCode']), // 关联物料编号
              // associatedMaterielName: _filter(sourceType, item, ['', 'productName', 'commodityName']), // 关联商品名称
              associatedType:
                sourceType == 1
                  ? _filter(sourceType, item, ['', 'productAttributeJson', 'commodityCategory', '']).split('-')[1]
                  : _filter(sourceType, item, ['', 'productAttributeJson', 'commodityAttribute', '']), //规格型号
              associatedCategory: _filter(sourceType, item, ['', 'productAttributeJson', 'commodityCategory', '']), // 关联商品品类
              associatedBrand: _filter(sourceType, item, ['', 'productBrand', 'commodityBrand', '']), // 关联品牌
              rowId: index,
              goodsPic: item.goodsPic,
            }
          })
          setData(data)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }
  useEffect(() => {
    const columnsTabs: any = [
      {
        title: intl.formatMessage({ id: 'contract.wuliaobianhaomingcheng' }),
        dataIndex: 'name',
        align: 'center',
        key: 'name',
        render: (text, item) => (
          <div>
            <p>{item.code}</p>
            <p>{text}</p>
          </div>
        ),
      },
      {
        title: intl.formatMessage({ id: 'contract.guigexinghao' }),
        dataIndex: 'type',
        align: 'center',
        key: 'type',
      },
      {
        title: intl.formatMessage({ id: 'contract.pinlei' }),
        dataIndex: 'customerCategory',
        align: 'center',
        key: 'customerCategory',
        render: (text, item) => (
          <span>{item?.customerCategory?.name ? item.customerCategory?.name : item.customerCategory?.category}</span>
        ),
      },
      {
        title: intl.formatMessage({ id: 'contract.pinpai' }),
        dataIndex: 'brand',
        align: 'center',
        key: 'brand',
        render: (text, item) => <span>{item.brand ? item.brand.name : ''}</span>,
      },
      {
        title: intl.formatMessage({ id: 'contract.danwei' }),
        dataIndex: 'unitName',
        align: 'center',
        key: 'unitName',
      },
      {
        title: intl.formatMessage({ id: 'contract.inquiry.number' }),
        dataIndex: 'purchaseCount',
        key: 'purchaseCount' + refresh,
        align: 'center',
        render: (text, record) =>
          sourceType == 4 || sourceType == 5 ? (
            <Text>-</Text>
          ) : (
            <Form.Item
              name={`purchaseCount${record.newId}`}
              rules={[
                {
                  required: true,
                  pattern: /^\d*(?:\.\d{0,3})?$/,
                  message: intl.formatMessage({ id: 'contract.inquiry.number.tip' }),
                },
              ]}
              initialValue={text != '' ? text : ''}
            >
              <Input
                style={{
                  width: 120,
                }}
                placeholder=""
                onChange={(e) => setInput(e, 'purchaseCount', record.newId)}
                defaultValue={text}
                disabled={Object.keys(Row).length != 0 ? true : false}
              />
            </Form.Item>
          ),
      },
      {
        title: intl.formatMessage({ id: 'contract.hanshui' }),
        dataIndex: 'isHasTax',
        align: 'center',
        key: 'isHasTax' + refresh,
        render: (text, record) => (
          <Form.Item
            name={`isHasTax${record.newId}`}
            rules={[{ required: true, message: intl.formatMessage({ id: 'contract.qingxuanze' }) }]}
            initialValue={text || text == 0 ? (text == 0 ? '0' : text.toString()) : ''}
          >
            <Select
              style={{ width: 80 }}
              defaultValue={text === 0 || text === 1 ? text.toString() : ''}
              onChange={(e) => setInput(e, 'isHasTax', record.newId)}
              disabled={Object.keys(Row).length != 0 && sourceWay != 'purchase' ? true : false}
            >
              <Option value="0" key={0}>
                {intl.formatMessage({ id: 'contract.fou' })}
              </Option>
              <Option value="1" key={1}>
                {intl.formatMessage({ id: 'contract.shi' })}
              </Option>
            </Select>
          </Form.Item>
        ),
      },
      {
        title: intl.formatMessage({ id: 'contract.shuil' }),
        dataIndex: 'taxRate',
        align: 'center',
        key: 'taxRate' + refresh,
        render: (text: any, record: any) => (
          <Form.Item
            name={`taxRate${record.newId}`}
            rules={[
              {
                required: true,
                pattern: /^\d*(?:\.\d{0,3})?$/,
                message: intl.formatMessage({ id: 'contract.shuil.tip' }),
              },
            ]}
            initialValue={text || text == 0 ? text : ''}
          >
            <Input
              style={{
                width: 120,
              }}
              defaultValue={text}
              onChange={(e) => setInput(e, 'taxRate', record.newId)}
              addonAfter="%"
              disabled={Object.keys(Row).length != 0 && sourceWay != 'purchase' ? true : false}
            />
          </Form.Item>
        ),
      },
      {
        title: intl.formatMessage({ id: 'contract.danjiahanshui' }),
        dataIndex: 'price',
        align: 'center',
        key: 'price' + refresh,
        render: (text: any, record: any) => (
          <Form.Item
            name={`price${record.newId}`}
            initialValue={text != '' ? String(text).replace(/^(.*\..{4}).*$/, '$1') : ''}
            rules={[
              {
                required: true,
                pattern: /^\d*(?:\.\d{0,4})?$/,
                message: intl.formatMessage({ id: 'purchaseRequisition.danjiajinxiansi' }),
              },
            ]}
          >
            <Input
              style={{
                width: 120,
              }}
              onChange={(e) => setInput(e, 'price', record.newId)}
              defaultValue={text != '' ? Number(text) : ''}
              disabled={Object.keys(Row).length != 0 && sourceWay != 'purchase' ? true : false}
            />
          </Form.Item>
        ),
      },
      {
        title: intl.formatMessage({ id: 'contract.quantity' }),
        dataIndex: 'bidCount',
        align: 'center',
        key: 'bidCount' + refresh,
        render: (text, record) =>
          sourceType == 4 ? (
            text
          ) : (
            <Form.Item
              name={`bidCount${record.newId}`}
              rules={[
                {
                  required: true,
                  pattern: /^\d*(?:\.\d{0,3})?$/,
                  message: intl.formatMessage({ id: 'contract.quantity.tip1' }),
                },
              ]}
              initialValue={text != '' ? text : ''}
            >
              <Input
                style={{
                  width: 120,
                }}
                onChange={(e) => setInput(e, 'bidCount', record.newId)}
                defaultValue={text ? text : ''}
                disabled={Object.keys(Row).length != 0 || sourceType == 4 ? true : false}
              />
            </Form.Item>
          ),
      },
      {
        title: intl.formatMessage({ id: 'contract.hetongjinehanshui' }),
        dataIndex: 'bidAmount',
        key: 'bidAmount',
        align: 'center',
        render: (text: any, record: any) => (
          <Text>
            {translate('web.common.currencySymbol')}
            {record.bidAmount || '0.00'}
          </Text>
        ),
      },
    ]
    if (sourceType == 4) {
      columnsTabs.push({
        title: intl.formatMessage({ id: 'contract.guanliandanju' }),
        dataIndex: 'associatedDocuments',
        key: 'associatedDocuments',
        align: 'center',
        render: (text: any, record: any) => (
          <Button
            type="link"
            onClick={() => {
              setLookAssociatedproductNo(record.productNo)
              setAssociatedDocumentsVisible(true)
            }}
          >
            {intl.formatMessage({ id: 'contract.guanlianqinggoudan' })}
          </Button>
        ),
      })
    }
    if (dataList.length !== 0 && (sourceType == 4 || sourceType == 5)) {
      columnsTabs.push({
        title: intl.formatMessage({ id: 'contract.caozuo' }),
        dataIndex: 'del',
        align: 'center',
        key: 'del',
        render: (_, record) => {
          return (
            <Popconfirm
              title={intl.formatMessage({ id: 'contract.quedingyaoshanchuma' })}
              onConfirm={() => handleDelete(record)}
            >
              <a>{intl.formatMessage({ id: 'contract.shanchu' })}</a>
            </Popconfirm>
          )
        },
      })
    }

    setcolumnsTab(columnsTabs)
  }, [dataList, refresh])

  useEffect(() => {
    setSelectData([])
    RowCtl.setSelectedRowKeys([])
    RowCtl.setSelectRow([])
    if (Object.keys(Row).length === 0 && !lockDemandPool) {
      setData([])
    }
    setLockDemandPool(false)
  }, [sourceType])

  useEffect(() => {
    if (Object.keys(Row).length != 0) {
      getList()
    }
  }, [Row])

  /* 回调出来的数据 */
  useEffect(() => {
    currentRef.current = {
      get: () =>
        new Promise((resolve: any) => {
          const list = []
          dataList.map((item) => {
            list.push({
              id: 0,
              materielId: item.materielId,
              materielNo: sourceType != 4 ? item.code : item.productNo,
              materielName: item.name,
              type: item.type,
              category: item.customerCategory != null ? item.customerCategory.name : '',
              brand: item.brand != null ? item.brand.name : '',
              unit: item.unitName,
              isHasTax: item.isHasTax,
              taxRate: item.taxRate,
              purchaseCount: sourceType == 4 || sourceType == 5 ? 0 : item.purchaseCount,
              price: item.price,
              bidCount: String(item.bidCount).replace(/^(.*\..{4}).*$/, '$1'),
              bidAmount:
                item.bidCount && item.price
                  ? new BigNumber(+item.bidCount).multipliedBy(item.price).toNumber().toFixed(2)
                  : '',
              associatedMaterielName: Object.keys(Row).length === 0 ? '' : item.associatedMaterielName,
              associatedGoods: Object.keys(Row).length === 0 ? '' : item.associatedGoods,
              associatedDataId: Object.keys(Row).length === 0 ? '' : item.associatedDataId,
              associatedMaterielNo: Object.keys(Row).length === 0 ? '' : item.associatedMaterielNo,
              associatedType: Object.keys(Row).length === 0 ? '' : item.associatedType,
              associatedCategory: Object.keys(Row).length === 0 ? '' : item.associatedCategory,
              associatedBrand: Object.keys(Row).length === 0 ? '' : item.associatedBrand,
              prpIds: sourceType == 4 ? item.prpIds?.toString().split(',') : null,
              goodsPic: item.goodsPic,
            })
          })
          resolve({
            state: true,
            name: 'purchaseMaterielList',
            data: { list },
          })
        }),
    }
  })

  const handleCancel = () => {
    if (sourceType == 4) {
      setIsPurchaseModalVisible(false)
    } else {
      setIsModalVisible(false)
    }
  }
  /* 下拉的子元素 */
  const listItem = (record) => (
    <div className={styles.listItem}>
      <div className={styles.label}>
        <p>{intl.formatMessage({ id: 'contract.guanlian' })}</p>
        <p>{intl.formatMessage({ id: 'contract.baojiashangpin' })}</p>
      </div>
      <div className={styles.text}>
        <p>
          {intl.formatMessage({ id: 'contract.shangpinID' })}：{record.associatedDataId}
        </p>
        <p>
          {intl.formatMessage({ id: 'contract.shangpinmingcheng' })}：{record.associatedGoods}
        </p>
      </div>
      <div className={styles.text}>
        <p>
          {intl.formatMessage({ id: 'contract.guige' })}：{record.associatedType}
        </p>
        <p>
          {intl.formatMessage({ id: 'contract.pinlei' })}：{record.associatedCategory}
        </p>
      </div>
      <div className={styles.text}>
        <p>
          {intl.formatMessage({ id: 'contract.pinpai' })}:{record.associatedBrand}
        </p>
      </div>
    </div>
  )

  // const onExpand = expandedKeys => {
  //   console.log(expandedKeys)
  // };

  const _linkDataSource = () => {
    if (Object.keys(Row).length === 0) {
      if (_state?.demandPoolRows) {
        return purchaseData
      } else {
        return RowCtl.selectRow
      }
    } else {
      return RowCtl.selectRow?.length ? RowCtl.selectRow : purchaseData
    }
  }

  return (
    <div className={styles.box}>
      {(sourceType == 4 || sourceType == 5) && (
        <div
          style={{ paddingTop: 12, paddingBottom: 12 }}
          onClick={() => {
            if (sourceType == 4) {
              setIsPurchaseModalVisible(true)
            } else {
              setIsModalVisible(true)
            }
            RowCtl.setSelectedRowKeys(selectData.map((i) => i.id))
            RowCtl.setSelectRow(selectData)
          }}
        >
          <Button block type="dashed">
            <PlusOutlined />
            {intl.formatMessage({ id: 'contract.xuanzecaigouwuliao' })}
          </Button>
        </div>
      )}
      <Form form={form}>
        <Table
          scroll={{ x: '100%' }}
          columns={columnsTab}
          rowKey="rowId"
          dataSource={dataList}
          expandable={{
            expandedRowRender: (record) => listItem(record),
          }}
          style={{
            width: '100%',
          }}
        />
      </Form>

      {/* 模态框 */}
      <Modal
        title={intl.formatMessage({ id: 'contract.xuanzecaigouwuliao' })}
        width={1200}
        visible={isPurchaseModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <StandardTable
          tableProps={{
            rowKey: 'prpId',
            scroll: {
              x: 1200,
            },
          }}
          columns={purchasecolumns}
          currentRef={purchaseRefs}
          rowSelection={rowSelection}
          fetchTableData={(params: any) => getPurchaseList(params)}
          formilyProps={{
            ctx: {
              inline: false,
              schema: PurchaseContractListSchema,
              effects: ($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'requisitionNo', FORM_FILTER_PATH)
              },
              components: {
                Submit,
              },
            },
            layouts: {
              order: 3,
            },
          }}
        />
      </Modal>

      <Modal
        title={intl.formatMessage({ id: 'contract.xuanzecaigouwuliao' })}
        width={1000}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <StandardTable
          tableProps={{
            rowKey: 'id',
          }}
          columns={goodcolumns}
          currentRef={refs}
          rowSelection={rowSelection}
          fetchTableData={(params: any) => getGoodsList(params)}
          formilyProps={{
            ctx: {
              inline: false,
              schema: MaterialListSchema,
              effects: ($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'code', FORM_FILTER_PATH)
                FormEffectHooks.onFieldChange$('brandId').subscribe(() => {
                  searchBrandOptionEffect(actions, 'brandId')
                })
                FormEffectHooks.onFieldChange$('customerCategoryId').subscribe(() => {
                  searchCustomerCategoryOptionEffect(actions, 'customerCategoryId')
                })
              },
              components: {
                CustomInputSearch,
                CustomCategorySearch,
                Submit,
              },
            },
            layouts: {
              order: 3,
            },
          }}
        />
      </Modal>

      {/* 查看关联单据 */}
      <Modal
        footer={null}
        title={intl.formatMessage({ id: 'contract.xuanzecaigouwuliao' })}
        width={1200}
        visible={associatedDocumentsVisible}
        onCancel={() => setAssociatedDocumentsVisible(false)}
      >
        <Table
          scroll={{
            x: 1200,
          }}
          columns={purchasecolumns}
          rowKey="rowId"
          dataSource={_linkDataSource().filter((i) => i.productNo == lookAssociatedproductNo)}
          // expandable={{
          //   expandedRowRender: (record, index) => listItem(record, index),
          // }}
          style={{
            width: '100%',
          }}
        />
      </Modal>
    </div>
  )
}

export default forwardRef(FormList)
