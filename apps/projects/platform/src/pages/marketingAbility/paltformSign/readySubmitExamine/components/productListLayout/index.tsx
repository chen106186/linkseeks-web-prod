import { useIntl } from '@linkseeks/i18n'
import React, { useState, useMemo, useEffect } from 'react'
import { Table, Form, Button } from 'antd'
import { Card } from '@linkseeks/ui'
import { Columns } from '../columns'
import EditableCell from './EditableCell'
import { isEmpty } from 'lodash'
import { PlusOutlined } from '@ant-design/icons'
import { EditableContext } from '@/pages/transaction/components/detailLayout/components/context'
import ListModalLayout from '@/pages/marketingAbility/components/listModalLayout'
import CollocationLayout from '@/pages/marketingAbility/components/collocationLayout'
import { remindLayout, RemindLayoutProps } from './remind'
import { getMarketingPlatformActivitySignupDetailGoodsPage } from '@apps/apis'

/** 表格头 */
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm()
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  )
}
interface ProductListLayoutProps {
  /** 详情数据 */
  data?: any
  /** 返回表格数据给父级 */
  getDataSource?: (e: any[]) => void
  /** ref */
  signUpId?: string | number
}
/** 主体内容 */
const ProductListLayout: React.FC<ProductListLayoutProps> = (props: any) => {
  const intl = useIntl()
  const { data, getDataSource, signUpId } = props
  const [type, setType] = useState<number>(0)
  const [visible, setVisible] = useState<boolean>(false)
  const [listModalVisible, setListModalVisible] = useState<boolean>(false)
  const [dataSource, setDataSource] = useState<any>([])
  const [shopIdList, setShopIdList] = useState<number[]>([])
  const [skuId, setSkuId] = useState<number>(0)
  const [collocation, setCollocation] = useState<any[]>([])
  const [idNotInList, setIdNotInList] = useState<number[]>([]) // 排除的id集合 ,Long
  const [remind, setRemind] = useState<RemindLayoutProps>({})

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  }
  const handleSave = (row) => {
    const newData = [...dataSource]
    const index = newData.findIndex((item) => row.id === item.id)
    const item = newData[index]
    newData.splice(index, 1, { ...item, ...row })
    getDataSource(newData)
    setDataSource(newData)
  }
  const handleDelete = (key) => {
    const newData = [...dataSource]
    setIdNotInList(idNotInList.filter((item) => item !== key))
    getDataSource(newData.filter((item) => item.id !== key))
    setDataSource(newData.filter((item) => item.id !== key))
  }
  const columns = useMemo(() => {
    return Columns(type || 1)
  }, [type])

  useEffect(() => {
    if (!isEmpty(data)) {
      setType(data.activityType)
      setShopIdList(
        data.shopList.map((item) => {
          return item.shopId
        }),
      )
    }
  }, [data])

  const toggle = (flag: boolean) => {
    setVisible(flag)
  }

  const handleOk = (selectRowRecord: any) => {
    setDataSource([...dataSource, ...selectRowRecord])
    setIdNotInList([...idNotInList, ...selectRowRecord.map((item) => item.id)])
    toggle(false)
  }

  /** 活动加个计算 */
  const sumTotal = (price, num) => {
    switch (Number(type)) {
      case 2:
        return Number(price) - Number(num)
    }
  }

  /** 设置搭配 */
  const handleSetting = (record: any) => {
    console.log(record)
    if (record.goodsSubsidiaryGroupList !== undefined) {
      setCollocation(record.goodsSubsidiaryGroupList)
    } else {
      setCollocation([])
    }
    setSkuId(record.id)
    setListModalVisible(true)
  }

  const handleConfirm = (params: any) => {
    const fields = [...dataSource]
    fields.forEach((item) => {
      if (item.id === skuId) {
        item.goodsSubsidiaryGroupList = [...params]
      }
    })
    setListModalVisible(false)
    getDataSource(fields)
    setDataSource(fields)
  }

  useEffect(() => {
    if (signUpId) {
      getMarketingPlatformActivitySignupDetailGoodsPage({
        signUpId,
        current: `${intl.formatMessage({ id: 'undefined' })}`,
        pageSize: `${intl.formatMessage({ id: 'undefined' })}`,
      }).then((res) => {
        if (res.code !== 1000) {
          return
        }
        getDataSource(res.data.data)
        setDataSource(res.data.data)
      })
    }
  }, [signUpId])

  useEffect(() => {
    if (!isEmpty(data)) {
      const {
        activityDefinedBO: { activityType, giveType, giftType },
      } = data
      if (giveType && giftType) {
        setRemind(remindLayout(activityType, giveType, giftType))
        return
      }
      setRemind(remindLayout(activityType))
    }
  }, [data])

  console.log(remind, 10086)

  return (
    <Card id="productListLayout" title={intl.formatMessage({ id: 'paltformSign.activitiesOfGoods' })}>
      <Button style={{ marginBottom: '16px' }} block type="dashed" icon={<PlusOutlined />} onClick={() => toggle(true)}>
        {intl.formatMessage({ id: 'paltformSign.choiceActivityGoods' })}
      </Button>
      <Table
        rowKey={(record) => record.id}
        components={components}
        columns={
          columns.map((col: any) => {
            if (!col.editable && !col.operation) {
              return col
            }
            return {
              ...col,
              onCell: (record) => ({
                record,
                operation: col.operation,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                activities: type,
                handleSave: handleSave,
                handleDelete: handleDelete,
                handleSetting: handleSetting,
                sumTotal: sumTotal,
              }),
            }
          }) as any
        }
        dataSource={dataSource}
        pagination={{
          size: 'small',
        }}
      />
      {/* 选择活动商品 */}
      <CollocationLayout
        visible={visible}
        idNotInList={idNotInList}
        shopIdList={shopIdList}
        toggle={toggle}
        onConfirm={handleOk}
      />
      {/* 设置搭配商品 */}
      {!isEmpty(remind) && (
        <ListModalLayout
          title={remind.modalTitle}
          remind={remind}
          idNotInList={[skuId]}
          shopIdList={shopIdList}
          visible={listModalVisible}
          onClose={() => setListModalVisible(false)}
          onConfirm={handleConfirm}
          value={collocation}
        />
      )}
    </Card>
  )
}
export default ProductListLayout
