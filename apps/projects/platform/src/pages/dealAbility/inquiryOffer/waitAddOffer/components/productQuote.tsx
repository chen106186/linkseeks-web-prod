import React, { useCallback, useEffect, useState } from 'react'
import { Form, Button, Table, Input, Image, Drawer, FormInstance } from 'antd'
import { ColumnType } from 'antd/lib/table/interface'
import { Card } from '@linkseeks/ui'
import { isEmpty } from 'lodash'
import { EyeAuthButton } from '@apps/components'
import { jumpDefaultMall } from '@/constants'
import StandardTable from '@/components/StandardTable'
import { formatTimeString } from '@/utils'
import { authService } from '@apps/services'
import { getTradeProductQuotationHistoryList } from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
interface ProductQuoteLayoutProps {
  /** 回显 */
  setProductQuote?: any[]
  /** FormInstance */
  form?: FormInstance
}
const intl = getIntl()
const ProductQuoteLayout: React.FC<ProductQuoteLayoutProps> = (props: any) => {
  const { setProductQuote, form } = props
  const [dataSource, setDataSource] = useState<any[]>([])
  const [commoditySkuId, setCommoditySkuId] = useState()
  const [visible, setVisible] = useState<boolean>(false)
  const count = (num: any, price: any) => {
    let money: any = null
    money = Number(price) * 1 * Number(num)
    return Number(money).toFixed(2)
  }
  const handleChange = (id, e) => {
    const { value } = e.target
    dataSource.forEach((v) => {
      if (v.productId === id) {
        v.price = value
        v.money = count(v.purchaseCount, value)
      }
    })
    form.setFieldsValue({
      inquiryListProductRequests: dataSource,
    })
    setDataSource([...dataSource])
  }

  const handleJump = (data: any) => {
    jumpDefaultMall(`/shop/${data.memberId}_${data.memberRoleId}/inquiry/detail/${data.commodityId}`)
  }

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'dealAbility.shangpinID' }),
      key: 'commodityId',
      dataIndex: 'commodityId',
      render: (text: any, record: any) => (
        <EyeAuthButton type="button" handleClick={() => handleJump(record)}>
          {text}
        </EyeAuthButton>
      ),
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.shangpintupian' }),
      key: 'imgUrl',
      dataIndex: 'imgUrl',
      render: (text) => <Image width={32} height={32} src={text} />,
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.shangpinmingcheng' }),
      key: 'productName',
      dataIndex: 'productName',
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.pinlei' }),
      key: 'category',
      dataIndex: 'category',
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.pinpai' }),
      key: 'brand',
      dataIndex: 'brand',
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.hanshuishuil' }),
      key: 'isTax',
      dataIndex: 'isTax',
      render: (_, record) =>
        `${
          record.taxRate ? intl.formatMessage({ id: 'dealAbility.shi' }) : intl.formatMessage({ id: 'dealAbility.fou' })
        }/${record.taxRate}`,
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.caigoushuliangdanwei' }),
      key: 'purchaseCount',
      dataIndex: 'purchaseCount',
      render: (text: any, record: any) => <>{`${text}/${record.unit}`}</>,
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.baojiadanjia' }),
      key: 'price',
      dataIndex: 'price',
      width: 150,
      render: (text, record, index) => (
        <Form.Item
          initialValue={record.price}
          name={`purchaseCount${index}`}
          rules={[{ required: true, message: intl.formatMessage({ id: 'dealAbility.qingshurubaojiadanjia' }) }]}
          style={{ marginBottom: '0px' }}
        >
          <Input
            onBlur={(e) => handleChange(record.productId, e)}
            addonBefore={intl.formatMessage({ id: 'common.money' })}
            min={1}
            type="number"
          />
        </Form.Item>
      ),
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.jine' }),
      key: 'money',
      dataIndex: 'money',
      render: (text: any) => <>{text}</>,
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.caozuo' }),
      key: 'operate',
      dataIndex: 'operate',
      render: (_text, _data, index) => (
        <Button type="link" onClick={() => handleHitory(_data)}>
          {intl.formatMessage({ id: 'dealAbility.lishibaojia' })}
        </Button>
      ),
    },
  ]

  const handlePreview = (val) => {
    const { memberId } = authService.getAuth()
    if (val.quoteMemberId === memberId) {
      history.open(`/dealAbility/inquiryOffer/offerSearch/offer?id=${val.id}`)
    } else {
      history.open(`/dealAbility/confirmOffer/offerSearch/offer?id=${val.id}`)
    }
  }

  const hitoryColumns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'dealAbility.shangpinID' }),
      key: 'commodityId',
      dataIndex: 'commodityId',
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.shangpinmingcheng' }),
      key: 'productName',
      dataIndex: 'productName',
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.pinlei' }),
      key: 'category',
      dataIndex: 'category',
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.pinpai' }),
      key: 'brand',
      dataIndex: 'brand',
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.danwei' }),
      key: 'unit',
      dataIndex: 'unit',
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.caigoushuliang' }),
      key: 'purchaseCount',
      dataIndex: 'purchaseCount',
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.baojiadanjia' }),
      key: 'price',
      dataIndex: 'price',
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.xunjiahuiyuan' }),
      key: 'memberName',
      dataIndex: 'memberName',
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.baojiahuiyuan' }),
      key: 'quoteMemberName',
      dataIndex: 'quoteMemberName',
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.baojiashijian' }),
      key: 'createTime',
      dataIndex: 'createTime',
      render: (text: any, record: any) => formatTimeString(text),
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.baojiadan' }),
      key: 'quotationNo',
      dataIndex: 'quotationNo',
      render: (_text, _record) => (
        <Button type="link" onClick={() => handlePreview(_record)}>
          {_text}
        </Button>
      ),
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.waibuzhuangtai' }),
      key: 'externalStateName',
      dataIndex: 'externalStateName',
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.neibuzhuangtai' }),
      key: 'interiorStateName',
      dataIndex: 'interiorStateName',
    },
  ]

  useEffect(() => {
    if (!isEmpty(setProductQuote)) {
      setDataSource([...setProductQuote])
    }
  }, [setProductQuote])

  const handleHitory = (_data) => {
    setCommoditySkuId(_data.productId)
    setVisible(true)
  }

  const fetchTableData = useCallback(
    (params: any) => {
      return new Promise((resolve) => {
        getTradeProductQuotationHistoryList({ ...params, commoditySkuId }).then((res) => {
          if (res.code !== 1000) {
            return
          }
          resolve(res.data)
        })
      })
    },
    [commoditySkuId],
  )

  return (
    <Card id="productQuoteLayout" title={intl.formatMessage({ id: 'dealAbility.shangpinbaojia' })}>
      <Form.Item
        name="inquiryListProductRequests"
        rules={[{ required: true, message: intl.formatMessage({ id: 'dealAbility.qingtianjiashangpin' }) }]}
      >
        <Table rowKey={(record) => record.productId} columns={columns} dataSource={dataSource} pagination={false} />
        <Drawer
          width={1200}
          title={intl.formatMessage({ id: 'dealAbility.lishibaojia' })}
          visible={visible}
          onClose={() => setVisible(false)}
          destroyOnClose
        >
          <StandardTable columns={hitoryColumns} tableProps={{ rowKey: 'id' }} fetchTableData={fetchTableData} />
        </Drawer>
      </Form.Item>
    </Card>
  )
}

export default ProductQuoteLayout
