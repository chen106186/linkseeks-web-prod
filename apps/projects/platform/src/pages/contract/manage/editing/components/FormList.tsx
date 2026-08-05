import React, { useState, useEffect, forwardRef, useRef } from 'react'
import { Table, Input, Select, Form, Typography, Popconfirm, Modal, Button, message } from 'antd'

import styles from '../index.less'
import { getIntl } from '@linkseeks/i18n'
import StandardTable from '@/components/StandardTable'
import { PlusOutlined } from '@ant-design/icons'
import { goodcolumns, purchasecolumns } from '../../addList/Table'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import { getContractPurchaseRequisitionPageToBeEdit } from '@apps/apis'
import { MaterialListSchema, PurchaseContractListSchema } from '../../addList/components/schema'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import Submit from '@/components/NiceForm/components/Submit'
import deepClone from 'clone'
import BigNumber from 'bignumber.js'
import { getProductMaterielGetMaterielList } from '@apps/apis'
import CustomInputSearch from '@/components/NiceForm/components/CustomInputSearch'
import CustomCategorySearch from '@/components/NiceForm/components/CustomCategorySearch'
import { FormEffectHooks } from '@apps/formily'
import {
  searchBrandOptionEffect,
  searchCustomerCategoryOptionEffect,
} from '@/pages/procurementAbility/purchaseRequisition/increaseRequisition/effects'

const { Option } = Select
const { Text } = Typography
const intl = getIntl()
const FormList = (props: any) => {
  const refs = useRef<any>({})
  const { currentRef, purchaseMaterielList, sourceType, form, totalAmountChange } = props
  const [dataList, setData] = useState([])
  const [selectData, setSelectData] = useState<any>([])
  const [isModalVisible, setIsModalVisible] = useState(false) // 显示模态框
  const [isPurchaseModalVisible, setIsPurchaseModalVisible] = useState(false) // 显示模态框
  const purchaseRefs = useRef<any>({})
  const [purchaseData, setPurchaseData] = useState<any>([])
  const [lookAssociatedproductNo, setLookAssociatedproductNo] = useState<string>('')
  const [rowSelection, RowCtl] = useRowSelectionTable({
    customKey: 'id',
    extendsSelection: {
      getCheckboxProps: (record: any) => ({
        disabled: record.disabled,
      }),
    },
  })
  const [refresh, setRefresh] = useState<number>(1)
  const [requisitionList] = useState<any>([])
  const [associatedDocumentsVisible, setAssociatedDocumentsVisible] = useState<boolean>(false)
  const [requisitionDataShow] = useState<boolean>(false)
  const [undeletableIds, setUndeletableIds] = useState<string[]>()

  const handleTotalAmountChange = (list) => {
    let num = 0
    list.map((i) => {
      num = new BigNumber(+num).plus(i.bidAmount).toNumber()
    })

    totalAmountChange(num)
  }

  /* 设置值 */
  const setInput = (e, name, id) => {
    let idx
    dataList.map((i, index) => {
      if (i.id == id) idx = index
    })
    let flag: boolean = false // 是否触发金额总值变化
    const item: any = [...dataList]
    console.log(e)
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
      item[idx].bidCount && item[idx].price ? (Number(item[idx].bidCount) * Number(item[idx].price)).toFixed(2) : 0
    console.log(item)
    setData(item)

    if (flag) handleTotalAmountChange(item)
  }

  /* 删除 */
  const handleDelete = (id, productNo) => {
    const dataSource = [...dataList]
    let flag = false
    const deleteItem: any = dataSource.filter((item) => item.id == id)

    if (sourceType == 4 && (Array.isArray(deleteItem[0].prpIds) || deleteItem[0].prpIds)) {
      const res = Array.isArray(deleteItem[0].prpIds) ? deleteItem[0].prpIds : String(deleteItem[0].prpIds).split(',')
      res.map((i) => {
        if (undeletableIds?.indexOf(String(i)) > -1) {
          flag = true
        }
      })
    }

    if (sourceType == 5 && undeletableIds?.indexOf(String(deleteItem[0]?.id)) > -1) flag = true

    if (flag) {
      message.error(
        `编号【${deleteItem[0]?.materielNo}】物料原合同已转订单【${
          deleteItem[0]?.oldNum - deleteItem[0]?.contractFreeCount
        }】数量，不可删除`,
      )
      return
    }

    const List = dataSource.filter((item) => item.id !== id)
    setData(List)
    handleTotalAmountChange(List)
    setSelectData(dataSource.filter((item) => (sourceType == 4 ? item.productNo !== productNo : item.id !== id)))
  }

  const columnsTab: any = [
    {
      title: intl.formatMessage({ id: 'contract.wuliaobianhaomingcheng' }),
      dataIndex: 'materielName',
      align: 'center',
      render: (text, item) => (
        <div>
          <p>{item.materielNo}</p>
          <p>{text}</p>
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: 'contract.guigexinghao' }),
      dataIndex: 'type',
      align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'contract.pinlei' }),
      dataIndex: 'category',
      align: 'center',
      render: (text) => <span>{text}</span>,
    },
    {
      title: intl.formatMessage({ id: 'contract.pinpai' }),
      dataIndex: 'brand',
      align: 'center',
      render: (text) => <span>{text}</span>,
    },
    { title: intl.formatMessage({ id: 'contract.danwei' }), dataIndex: 'unit', align: 'center' },
    {
      title: intl.formatMessage({ id: 'contract.inquiry.number' }),
      dataIndex: 'purchaseCount',
      key: 'purchaseCount',
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
            initialValue={text || text == 0 ? (text == 0 ? '0' : text.toString()) : ''}
          >
            <Input
              style={{
                width: 120,
              }}
              placeholder=""
              onChange={(e) => setInput(e, 'purchaseCount', record.newId)}
              defaultValue={record.purchaseCount}
              disabled={sourceType != 4 && sourceType != 5}
            />
          </Form.Item>
        ),
    },
    {
      title: intl.formatMessage({ id: 'contract.hanshui' }),
      dataIndex: 'isHasTax',
      align: 'center',
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
            disabled={sourceType != 4 && sourceType != 5}
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
            disabled={sourceType != 4 && sourceType != 5}
          />
        </Form.Item>
      ),
    },
    {
      title: intl.formatMessage({ id: 'contract.danjiahanshui' }),
      dataIndex: 'price',
      align: 'center',
      render: (text: any, record: any) => (
        <Form.Item
          name={`price${record.newId}`}
          initialValue={text}
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
            // addonBefore={intl.formatMessage({id: 'common.money'})}
            defaultValue={text}
            disabled={sourceType != 4 && sourceType != 5}
          />
        </Form.Item>
      ),
    },
    {
      title: intl.formatMessage({ id: 'contract.quantity' }),
      dataIndex: 'bidCount',
      align: 'center',
      render: (text, record) =>
        sourceType == 4 ? (
          <Text>{text}</Text>
        ) : (
          <Form.Item
            name={`bidCount${record.newId}`}
            rules={[
              {
                required: true,
                pattern: /^\d*(?:\.\d{0,3})?$/,
                message: intl.formatMessage({ id: 'contract.quantity.tip1' }),
              },
              {
                validator: (rule, value, callback) => {
                  try {
                    const _value = Number(value)
                    const min = record.oldNum - record.contractFreeCount
                    if (_value < min) {
                      throw new Error(
                        intl.formatMessage({
                          id: 'contract.quantity.tip2',
                          code: record.materielNo,
                          min: min,
                        }),
                      )
                    }
                    if (_value == 0) {
                      throw new Error(`数量不能等于0`)
                    }
                    callback()
                  } catch (err) {
                    callback(err)
                  }
                },
              },
            ]}
            initialValue={text || text == 0 ? (text == 0 ? '' : text.toString()) : ''}
          >
            <Input
              style={{
                width: 120,
              }}
              onChange={(e) => setInput(e, 'bidCount', record.newId)}
              defaultValue={text ? text : ''}
              disabled={sourceType != 4 && sourceType != 5}
            />
          </Form.Item>
        ),
    },
    {
      title: intl.formatMessage({ id: 'contract.hetongjinehanshui' }),
      dataIndex: 'bidAmount',
      key: 'bidAmount',
      align: 'center',
      render: (text: any, record: any) => <Text>{record.bidAmount || '0.00'}</Text>,
    },
    {
      title: intl.formatMessage({ id: 'contract.residue.quantity' }),
      dataIndex: 'contractFreeCount',
      key: 'contractFreeCount',
      align: 'center',
      render: (text: any, record: any) => <Text>{record.contractFreeCount || ''}</Text>,
    },
    sourceType == 4
      ? {
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
        }
      : {},
    sourceType == 4 || sourceType == 5
      ? {
          title: intl.formatMessage({ id: 'contract.caozuo' }),
          dataIndex: 'del',
          align: 'center',
          key: 'del',
          render: (_, record) => (
            <Popconfirm
              title={intl.formatMessage({ id: 'contract.quedingyaoshanchuma' })}
              onConfirm={() => handleDelete(record.id, record.productNo)}
            >
              <a>{intl.formatMessage({ id: 'contract.shanchu' })}</a>
            </Popconfirm>
          ),
        }
      : {},
  ]

  useEffect(() => {
    const data = []
    const undeletableId = []

    if (sourceType == 4) {
      purchaseMaterielList?.map((i) => {
        i.id = i.prpIds[0] || i.id
        i.prpIds = i.prpIds
        i.productNo = i.materielNo
        i.oldNum = i.bidCount

        // 查询编辑时不可删除物料的请购单id(合同数量不等于剩余数量不可删)
        if (i.bidCount != i.contractFreeCount) {
          i.prpIds.map((ii) => {
            undeletableId.push(String(ii))
          })
        }

        i.requisitionList?.map((ii) => {
          ii.label = 'old'
          ii.prpId = ii.detailId
          i.newId = i.prpIds[0] || ii.detailId
          ii.materielNo = i.materielNo
          ii.materielName = i.materielName
          ii.productNo = i.materielNo

          ii.bidCount = ii.surplusQuantity
          ii.num = ii.surplusQuantity
          ii.prpIds = ii.prpId
          ii.price = ''

          ii.category = i.category || ''

          ii.id = ii.prpId
          ii.newId = ii.prpId
          ii.name = i.materielName
          ii.brand = i.brand || ''
          ii.unitName = i.unit
          ii.unit = i.unit
          ii.type = i.type
          ii.label = 'purchase'
          data.push(ii)
        })
      })

      setUndeletableIds(undeletableId)
      setData(purchaseMaterielList)
      setSelectData(deepClone(data))
      setPurchaseData(deepClone(data))
    } else {
      purchaseMaterielList?.map((i) => {
        i.newId = i.id
        i.oldNum = i.bidCount
        // 查询编辑时不可删除物料的请购单id(合同数量不等于剩余数量不可删)
        if (i.bidCount != i.contractFreeCount) {
          undeletableId.push(String(i.id))
        }
      })
      setUndeletableIds(undeletableId)
      setData(purchaseMaterielList)
      setSelectData(purchaseMaterielList)
    }
  }, [purchaseMaterielList, sourceType])

  /* 回调出来的数据 */
  useEffect(() => {
    currentRef.current = {
      get: () =>
        new Promise((resolve: any) => {
          const list = []
          dataList.map((item, index) => {
            list.push({
              id: item.id,
              materielId: item.id,
              materielNo: item.materielNo,
              materielName: item.materielName,
              type: item.type,
              category: item.category,
              brand: item.brand,
              unit: item.unit,
              isHasTax: item.isHasTax,
              taxRate: item.taxRate,
              purchaseCount: item.purchaseCount || 0,
              price: Number(item.price),
              bidCount: item.bidCount,
              bidAmount: item.bidCount && item.price ? (Number(item.bidCount) * Number(item.price)).toFixed(2) : '',
              associatedMaterielName: item.associatedMaterielName ? item.associatedMaterielName : '',
              associatedGoods: item.associatedGoods ? item.associatedGoods : '',
              associatedDataId: item.associatedDataId ? item.associatedDataId : '',
              associatedMaterielNo: item.associatedMaterielNo ? item.associatedMaterielNo : '',
              associatedType: item.associatedType ? item.associatedType : '',
              associatedCategory: item.associatedCategory ? item.associatedCategory : '',
              associatedBrand: item.associatedBrand ? item.associatedBrand : '',
              rowId: index,
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
          {intl.formatMessage({ id: 'contract.pinpai' })}:{record.brand ? record.associatedBrand : ''}
        </p>
      </div>
    </div>
  )

  //相同物料组合成同一条
  const handlePurchaseData = (selectRow) => {
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
      const startList = selectRow

      startList.forEach((i) => {
        if (prpIdsList?.length && prpIdsList.indexOf(i.prpId.toString()) > -1) {
          if (i.productNo == item.productNo && i.prpId == prpIdsList[prpIdsList.indexOf(i.prpId.toString())]) {
            num = new BigNumber(+i.num).plus(num).toNumber()
          }
        }
      })

      item.bidCount = num
      item.contractFreeCount = num
      item.rowId = index + 1
      item.price = item.price || ''
      item.bidAmount = (item.bidCount * item.price).toFixed(2)
      item.materielId = item.id
    })
    return newArray
  }

  /* 确定 */
  const handleOk = () => {
    const list = deepClone(RowCtl.selectRow)

    setData([])
    if (sourceType == 4) {
      list.map((item: any) => {
        item.prpIds = item.prpId
      })

      setSelectData(list)
      const newList = handlePurchaseData(deepClone(list))

      console.log('ok---------newList', newList, undeletableIds)

      newList.map((i) => {
        if (undeletableIds?.indexOf(String(i.prpId)) > -1) {
          purchaseMaterielList.map((item) => {
            if (item.prpIds.indexOf(Number(i.prpId)) > -1) i.oldNum = item.bidCount
          })
        }

        i.id = i.prpId
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
        item.bidCount = form.getFieldValue('bidCount' + item.id) ? form.getFieldValue('bidCount' + item.id) : ''
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

  const handleCancel = () => {
    console.log(sourceType)
    if (sourceType == 4) {
      setIsPurchaseModalVisible(false)
    } else {
      setIsModalVisible(false)
    }
  }

  /* 获取请购物料 */
  const getPurchaseList = (params) => {
    return new Promise((resolve) => {
      params.prpIds = purchaseMaterielList.map((i) => i.prpIds).flat(Infinity)
      getContractPurchaseRequisitionPageToBeEdit({ ...params, isEdit: 1 }).then((res) => {
        if (res.code === 1000) {
          const data = res.data?.data?.map((i: any) => {
            i.id = i.prpId
            i.customerCategory = {
              name: i.category || '',
            }
            // i.brand = {
            //   name: i.brand || ''
            // }
            i.unitName = i.unit
            i.type = i.spec
            i.bidCount = i.surplusQuantity
            i.num = i.surplusQuantity
            i.prpIds = i.prpId
            i.price = ''
            i.newId = i.prpId
            i.materielName = i.name
            i.materielNo = i.productNo
            if (undeletableIds?.indexOf(String(i.prpId)) > -1) i.disabled = true
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

  // const getTable = (params)=>{

  //   const {...rest } = params;
  //   return new Promise((resolve, reject) => {
  //     getContractPurchaseRequisitionPageByProductIds({
  //       ...rest,
  //       prpIdsStr:lookAssociatedproductNo || ''
  //     })
  //       .then(res => {
  //         if (res.code === 1000) {
  //           resolve(res.data);
  //         }
  //         reject();
  //       })
  //       .catch(() => {
  //         reject();
  //       });
  //   });
  // }

  /* 获取商品 */
  const getGoodsList = (params) => {
    return new Promise((resolve) => {
      getProductMaterielGetMaterielList(params).then((res) => {
        if (res.code === 1000) {
          const data: any = res.data.data
          data.map((item) => {
            item.category = item.customerCategory?.name || ''
            item.brand = item.brand?.name || ''
            item.materielName = item.name
            item.materielNo = item.code
            item.unit = item.unitName
            item.disabled = undeletableIds?.indexOf(String(item.id)) > -1
          })

          resolve({ ...res.data, data })
        }
      })
    })
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
          rowKey="rowId"
          dataSource={dataList}
          columns={columnsTab}
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
          columns={purchasecolumns}
          rowKey="rowId"
          dataSource={
            requisitionDataShow
              ? requisitionList
              : (RowCtl.selectRow?.length ? RowCtl.selectRow : purchaseData).filter(
                  (i) => i.productNo == lookAssociatedproductNo,
                )
          }
          // expandable={{
          //   expandedRowRender: (record, index) => listItem(record, index),
          // }}
          style={{
            width: '100%',
          }}
        />
      </Modal>

      {/* 接口查看单据 */}
      {/* <ModalTable
        cancel={() => setAssociatedDocumentsVisibleTwo(false)}
        visible={associatedDocumentsVisibleTwo}
        width={1200}
        columns={purchasecolumns}
        modalTitle={intl.formatMessage({ id: 'contract.guanlianqinggoudan' })}
        fetchTableData={params => getTable(params)}
        rowKey={'rowId'}
        resetModal={{destroyOnClose: true, forceRender: false,footer:null}}
      />  */}
    </div>
  )
}

export default forwardRef(FormList)
