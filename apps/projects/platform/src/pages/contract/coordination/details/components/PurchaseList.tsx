import React, { useState, useEffect, useRef } from 'react'
import { Space, Table, Typography, message } from 'antd'
import style from '../index.less'
import type { IAntdSchemaFormProps } from '@apps/formily'
import CrossSellProducts from '../../components/modal/crossSellProducts'
import {
  getContractCoordinationPagePurchaseMaterielList,
  postContractCoordinationAssociatedOfferGoods,
} from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'
import cx from 'classnames'
import { Card } from '@linkseeks/ui'

const { Text } = Typography
export interface Iprops extends IAntdSchemaFormProps {
  /* 显示隐藏 */
  contractId
  type
  Refresh: Function
  oldContractId
}
const intl = getIntl()
const purchaseList: React.FC<Iprops> = ({ contractId, type, Refresh, oldContractId }) => {
  const ref: any = useRef({})
  const [columns, setcolumns] = useState<any>([])
  const [ListData, setListData] = useState<any>([])
  // const [Totalamount, setTotalamount] = useState<any>(0)
  // const [Numberamount, setNumberamount] = useState<any>(0)
  const [listLoading, setListLoading] = useState(false)
  const [size] = useState(10)
  const [index, setIndex] = useState<number>()
  const [record, setRecord] = useState<any>({})
  const [visible, setVisible] = useState<boolean>(false)
  const [total, setTotal] = useState(0)
  const [current, setcurrent] = useState(1) // 当前页
  // 采购物料变更数据 前 or 后
  const [isMaterialsNew, setIsMaterialsNew] = useState<boolean>(true)

  const columnsTab = (Number, Total) => {
    const column: any = [
      {
        title: intl.formatMessage({ id: 'contract.wuliaobianhaomingcheng' }),
        dataIndex: 'materielNo',
        render: (text, item) => {
          return (
            <div>
              <div>{text}</div>
              <div>{item.materielName}</div>
            </div>
          )
        },
      },
      { title: intl.formatMessage({ id: 'contract.guigexinghao' }), dataIndex: 'type' },
      { title: intl.formatMessage({ id: 'contract.pinlei' }), dataIndex: 'category' },
      { title: intl.formatMessage({ id: 'contract.pinpai' }), dataIndex: 'brand' },
      { title: intl.formatMessage({ id: 'contract.danwei' }), dataIndex: 'unit' },
      { title: intl.formatMessage({ id: 'contract.inquiry.number' }), dataIndex: 'purchaseCount' },
      { title: intl.formatMessage({ id: 'contract.hanshui' }), dataIndex: 'isHasTaxName' },
      {
        title: intl.formatMessage({ id: 'contract.shuil' }),
        dataIndex: 'taxRate',
        render: (text) => {
          return <div>{text}%</div>
        },
      },
      {
        title: intl.formatMessage({ id: 'contract.danjiahanshui' }),
        dataIndex: 'price',
        render: (text) => {
          return <div>{text}</div>
        },
      },
      {
        dataIndex: 'bidCount',
        title: (
          <Space direction="vertical">
            <Text>{intl.formatMessage({ id: 'contract.quantity' })}</Text>
            <Text>
              {intl.formatMessage({ id: 'contract.heji' })}:{Number}
            </Text>
          </Space>
        ),
      },
      {
        dataIndex: 'bidAmount',
        title: (
          <Space direction="vertical">
            <Text>{intl.formatMessage({ id: 'contract.hetongjinehanshui' })}</Text>
            <Text>
              {intl.formatMessage({ id: 'contract.heji' })}: {Total}
            </Text>
          </Space>
        ),
        render: (text) => {
          return (
            <div>
              {/* {intl.formatMessage({ id: 'common.money' })} */}
              {text}
            </div>
          )
        },
      },
    ]
    setcolumns(column)
  }
  /* 下拉的子元素 */
  const listItem = (records, indexs) => (
    <div className={style.listItem}>
      <div className={style.label}>
        <p>{intl.formatMessage({ id: 'contract.guanlian' })}</p>
        <p>{intl.formatMessage({ id: 'contract.baojiashangpin' })}</p>
      </div>
      <div className={style.text}>
        <p>
          {intl.formatMessage({ id: 'contract.shangpinID' })}：{records.associatedDataId}
        </p>
        <p className={style.nowrap}>
          {intl.formatMessage({ id: 'contract.shangpinmingcheng' })}：{record.associatedGoods}
        </p>
      </div>
      <div className={style.text}>
        <p>
          {intl.formatMessage({ id: 'contract.guigexinghao' })}：{records.associatedType}
        </p>
        <p>
          {intl.formatMessage({ id: 'contract.pinlei' })}：{records.associatedCategory}
        </p>
      </div>
      <div className={style.text}>
        <p>
          {intl.formatMessage({ id: 'contract.pinpai' })}：{records.associatedBrand}
        </p>
      </div>
      {type == 'submitExamine' && (
        <div className={style.text}>
          <p
            style={{ color: '#00A98F', textAlign: 'right', lineHeight: '35px', cursor: 'pointer' }}
            onClick={() => {
              setIndex(indexs)
              setRecord(records)
              setVisible(true)
            }}
          >
            {intl.formatMessage({ id: 'contract.guanlianbaojiashangpin' })}
          </p>
        </div>
      )}
    </div>
  )
  const fetchListData = (params) => {
    setListLoading(true)
    getContractCoordinationPagePurchaseMaterielList({
      contractId: isMaterialsNew ? contractId : oldContractId,
      ...params,
    })
      .then((res) => {
        setTotal(res.data.totalCount)

        let Totalamounts = 0
        let Numberamounts = 0
        if (res.data.data) {
          res.data.data.map((item) => {
            Totalamounts += item.bidAmount
            Numberamounts += item.bidCount
          })
          // setTotalamount(Totalamounts)
          // setNumberamount(Numberamounts)
          columnsTab(Numberamounts, Totalamounts)
          setListData(res.data.data)
          Refresh(res.data.data)
        }
      })
      .finally(() => {
        setListLoading(false)
      })
      .catch(() => {})
  }

  /** 确定关联商品 */
  const handleConfirm = (params: any) => {
    const data = [...ListData]
    const productAttributeJson = params.product.name
      .split('/')
      .filter((_item, i) => i !== 0)
      .join('/')
    console.log(data[index])
    data[index].associatedCategory = params.product.customerCategoryName
    data[index].associatedBrand = params.product.brandName
    data[index].associatedGoods = params.product.name
    const purchaseMaterielId = data[index].id
    const associatedMaterielNo = data[index].associatedMaterielNo
      ? data[index].associatedMaterielNo
      : params.product.code
    const associatedMaterielName = data[index].associatedGoods
    // const associatedType = data[index].name;
    const associatedType = `${productAttributeJson}-${params.product.customerCategoryName}`
    const associatedCategory = data[index].associatedCategory
    const associatedBrand = data[index].associatedBrand
    const res_data = {
      contractId,
      purchaseMaterielId,
      associatedGoods: params.product.name,
      associatedDataId: params.product.id,
      associatedMaterielNo,
      associatedMaterielName,
      associatedType,
      associatedCategory,
      associatedBrand,
    }
    console.log(res_data, intl.formatMessage({ id: 'contract.qingqiuguoqucanshu' }), params.product)
    const msg = message.loading({
      content: intl.formatMessage({ id: 'contract.zhengzaicaozuo' }),
      duration: 0,
    })
    postContractCoordinationAssociatedOfferGoods(res_data)
      .then((res) => {
        if (res.code === 1000) {
          const datas = {
            current: current,
            pageSize: 10,
          }
          fetchListData(datas)
        }
      })
      .finally(() => {
        msg()
      })
    setListData(data)
    setVisible(false)
    setRecord({})
  }

  useEffect(() => {
    if (contractId) {
      const datas = {
        current: 1,
        pageSize: 10,
      }
      fetchListData(datas)
    }
  }, [contractId])
  // 展开/收起的回调
  // const onExpand = expandedKeys => {
  // };
  const handlePaginationChange = (currents: number) => {
    const datas = {
      current: currents,
      pageSize: 10,
    }
    setcurrent(currents)
    fetchListData(datas)
  }

  const handleMaterialChange = (data) => {
    setIsMaterialsNew(data)
    const res = {
      current: 1,
      pageSize: 10,
      contractId: data ? contractId : oldContractId,
    }
    setcurrent(1)
    fetchListData(res)
  }

  return (
    <Card
      id="materials"
      title={intl.formatMessage({ id: 'contract.hetongcaigoucailiao' })}
      extra={
        oldContractId ? (
          <div className={style.changeBtn}>
            <div
              className={cx(style.btn, !isMaterialsNew ? style.active : '')}
              onClick={() => handleMaterialChange(false)}
            >
              变更前
            </div>
            <div
              className={cx(style.btn, isMaterialsNew ? style.active : '')}
              onClick={() => handleMaterialChange(true)}
            >
              变更后
            </div>
          </div>
        ) : null
      }
    >
      <div className={style.box}>
        <Table
          columns={columns}
          rowKey="id"
          ref={ref}
          expandable={{
            expandedRowRender: (records) => listItem(records, index),
            // onExpand: records => onExpand(records)
          }}
          loading={listLoading}
          dataSource={ListData}
          pagination={{
            current: current,
            pageSize: size,
            total: total,
            onChange: handlePaginationChange,
          }}
          style={{
            width: '100%',
          }}
        />
      </div>
      <CrossSellProducts visible={visible} record={record} onClose={() => setVisible(false)} onClick={handleConfirm} />
    </Card>
  )
}
export default purchaseList
