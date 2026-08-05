/*
 * @Author: Bill
 * @Date: 2020-10-19 11:53:43
 * @desc 发票管理 发票列表
 */

import React, { useState, useEffect } from 'react'
import { Row, Col, Switch, Popconfirm } from 'antd'
import { FormOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import styles from './index.less'
import { history } from '@linkseeks/router-manager'
import {
  getSettlementPlatformConfigGetPlatformInvoiceList,
  postSettlementPlatformConfigDeletePlatformInvoice,
} from '@apps/apis'

interface ReceiptProps {
  id: number
  kindName: string
  typeName: string
  invoiceTitle: string
  taxNo: string
  bankOfDeposit: string
  account: string
  address: string
  tel: string
  defaultName: string
}

interface ItemIprops extends ReceiptProps {
  onRemove: (id: number | string) => Promise<void>
}

/**
 * 每个发票Item
 * @param props ItemIprops
 */
const ReceiptItem: React.FC<ItemIprops> = (props: ItemIprops) => {
  const { id, kindName, typeName, invoiceTitle, taxNo, bankOfDeposit, account, address, tel, defaultName } = props
  const handleRouterPush = () => {
    history.push(`/settlementManage/receipt/edit?id=${id}`)
  }
  const handleDelete = (id: number | string) => {
    props.onRemove(id)
  }
  return (
    <div className={styles.item}>
      <div className={styles.controller}>
        <div className={styles.edit} onClick={handleRouterPush}>
          <FormOutlined />
        </div>
        <div className={styles.remove}>
          <Popconfirm title="确定删除这条信息吗？" onConfirm={() => handleDelete(id)} okText="确定" cancelText="取消">
            <DeleteOutlined />
          </Popconfirm>
        </div>
      </div>
      <Row className={styles.row}>
        <Col span={6}>开具类型</Col>
        <Col span={18}>{typeName}</Col>
      </Row>
      <Row className={styles.row}>
        <Col span={6}>发票种类</Col>
        <Col span={18}>{kindName}</Col>
      </Row>
      <Row className={styles.row}>
        <Col span={6}>发票抬头</Col>
        <Col span={18}>{invoiceTitle}</Col>
      </Row>
      <Row className={styles.row}>
        <Col span={6}>纳税号</Col>
        <Col span={18}>{taxNo}</Col>
      </Row>
      <Row className={styles.row}>
        <Col span={6}>账号</Col>
        <Col span={18}>{account}</Col>
      </Row>
      <Row className={styles.row}>
        <Col span={6}>开户行</Col>
        <Col span={18}>{bankOfDeposit}</Col>
      </Row>
      <Row className={styles.row}>
        <Col span={6}>地址</Col>
        <Col span={18}>{address}</Col>
      </Row>
      <Row className={styles.row}>
        <Col span={6}>电话</Col>
        <Col span={18}>{tel}</Col>
      </Row>
      <Row>
        <Col span={6}>是否默认</Col>
        <Col span={18}>
          <Switch disabled checked={defaultName == '是' ? true : false} />
        </Col>
      </Row>
    </div>
  )
}

/**
 * 发票列表
 */
const Receipt: React.FC<{}> = () => {
  const [list, setList] = useState<ReceiptProps[]>([])
  const fetchData = async () => {
    const { data } = await getSettlementPlatformConfigGetPlatformInvoiceList()
    return data
  }
  useEffect(() => {
    fetchData().then((data) => {
      setList(data)
    })
  }, [])

  const handleRouterAdd = () => {
    history.push('/settlementManage/receipt/add')
  }

  // 删除发票
  const remove = async (id: number | string) => {
    const res = await postSettlementPlatformConfigDeletePlatformInvoice({ dataId: id as number })
    if (res.code == 1000) {
      const newList = list.filter((item) => item.id !== id)
      setList(newList)
    }
  }

  return (
    <div>
      <Row gutter={24}>
        {list.map((item: ReceiptProps) => {
          return (
            <Col span={8} key={item.id} className={styles.margin}>
              <ReceiptItem onRemove={remove} {...item} />
            </Col>
          )
        })}

        <Col span={8} className={styles.margin}>
          <div className={styles.add} onClick={handleRouterAdd}>
            <div>
              <PlusOutlined />
            </div>
            <div>新建发票</div>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default Receipt
