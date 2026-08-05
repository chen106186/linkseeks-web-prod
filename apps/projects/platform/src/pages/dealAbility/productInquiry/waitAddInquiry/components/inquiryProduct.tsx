import React, { useCallback, useEffect, useState } from 'react'
import { Button, Form, Table, InputNumber, Image, message, Typography } from 'antd'
import { jumpDefaultMall } from '@/constants'
import { Card } from '@linkseeks/ui'
import { PlusOutlined } from '@ant-design/icons'
import { ColumnType } from 'antd/lib/table/interface'
import TableModal from '@/pages/transaction/components/tableModal'
import { isEmpty } from 'lodash'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { useLinkageUtils } from '@/utils/formEffectUtils'
import { FormEffectHooks } from '@apps/formily'
import {
  getProductCommodityCommonGetCommodityListByBuyer,
  getProductSelectGetMemberBrand,
  getProductSelectGetMemberCategory,
} from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'
const { onFormMount$ } = FormEffectHooks
const intl = getIntl()
interface InquiryProductLayoutProps {
  /** 获得询价商品 */
  getInquiryProduct: (e) => void
  /** 回显 */
  setInquiryProduct?: any[]
  /** 会员信息 */
  member?: number
  /** form */
  form?: any
  /** 二次询价 */
  isEdit?: boolean
}

const InquiryProductLayout: React.FC<InquiryProductLayoutProps> = (props: any) => {
  const { getInquiryProduct, setInquiryProduct, member, form, isEdit } = props
  const [visible, setVisible] = useState<boolean>(false)
  const [dataSource, setDataSource] = useState<any[]>([])
  const [memberId, setMemberId] = useState<number>()

  const handlesStFieldsValue = () => {
    const params = [...dataSource]
    params.forEach((_item, _i) => {
      form.setFieldsValue({
        [`purchaseCount${_i}`]: _item.purchaseCount,
      })
    })
  }

  /** 改变采购数量 */
  const setInputNumber = (val, index) => {
    const data = [...dataSource]
    data[index].purchaseCount = val
    setDataSource(data)
    getInquiryProduct(data)
  }

  /** 删除 */
  const handleDeleted = (index) => {
    const data = [...dataSource]
    data.splice(index, 1)
    setDataSource(data)
    getInquiryProduct(data)
  }

  useEffect(() => {
    handlesStFieldsValue()
  }, [dataSource])

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'dealAbility.shangpinID' }),
      key: 'commodityId',
      dataIndex: 'commodityId',
      render: (commodityId, data) => (
        <Typography.Link
          target="_blank"
          onClick={() =>
            jumpDefaultMall(`/shop/${data.memberId}_${data.memberRoleId}/inquiry/detail/${data.commodityId}`)
          }
        >
          {commodityId}
        </Typography.Link>
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
      title: intl.formatMessage({ id: 'dealAbility.danwei' }),
      key: 'unit',
      dataIndex: 'unit',
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.caigoushuliang' }),
      key: 'purchaseCount',
      dataIndex: 'purchaseCount',
      render: (text, _data, index) => (
        <Form.Item
          initialValue={text}
          name={`purchaseCount${index}`}
          rules={[{ required: true, message: intl.formatMessage({ id: 'dealAbility.qingshurucaigoushuliang' }) }]}
          style={{ marginBottom: '0px' }}
        >
          <InputNumber min={1} maxLength={8} onChange={(val) => setInputNumber(val, index)} />
        </Form.Item>
      ),
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.caozuo' }),
      key: 'operate',
      dataIndex: 'operate',
      render: (_text, _data, index) => (
        <Button disabled={isEdit} type="link" onClick={() => handleDeleted(index)}>
          {intl.formatMessage({ id: 'dealAbility.shanchu' })}
        </Button>
      ),
    },
  ]

  const productColumns: any[] = [
    {
      title: 'ID',
      dataIndex: 'commodityId',
      key: 'commodityId',
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.shangpinmingcheng' }),
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.pinlei' }),
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.pinpai' }),
      dataIndex: 'brand',
      key: 'brand',
    },
  ]

  const handleFetchData = useCallback(
    (params: any) => {
      return new Promise((resolve) => {
        getProductCommodityCommonGetCommodityListByBuyer({
          ...params,
          priceTypeList: 2,
          memberId,
          shopId: form.getFieldValue('shopId'),
        })
          .then((res) => {
            if (res.code !== 1000) {
              return
            }
            const data: any[] = []
            res.data.data.forEach((v, i) => {
              data.push({
                commodityId: v.commodityId,
                productId: v.id,
                productName: v.name + '/' + v.commodityAttribute,
                category: v.customerCategoryName,
                brand: v.brandName,
                unit: v.unitName,
                purchaseCount: 1,
                logistics: v.logistics,
                memberId: v.memberId,
                memberRoleId: v.memberRoleId,
                imgUrl: v.mainPic,
                taxRate: v.taxRate,
                upperCommoditySkuId: v.commoditySkuId,
                upperMemberId: v.upperMemberId,
                upperMemberName: v.upperMemberName,
                upperMemberRoleName: v.upperMemberRoleName,
                upperMemberRoleId: v.upperMemberRoleId,
              })
            })
            resolve({
              totalCount: res.data.totalCount,
              data,
            })
          })
          .catch((error) => {
            console.warn(error)
          })
      })
    },
    [visible],
  )

  useEffect(() => {
    if (!isEmpty(setInquiryProduct)) {
      setDataSource([...setInquiryProduct])
    }
  }, [setInquiryProduct])

  const toggle = (flag: boolean) => {
    setVisible(flag)
  }

  const handleLogisticOnOk = (selectRowKeys: string[] | number[], selectRowRecord: any) => {
    setDataSource(selectRowRecord)
    getInquiryProduct(selectRowRecord)
    toggle(false)
  }

  useEffect(() => {
    if (!isEmpty(member)) {
      setDataSource([])
      setMemberId(member.memberId)
    }
  }, [member])

  const useBusinessEffects = () => {
    const linkage = useLinkageUtils()
    onFormMount$().subscribe(() => {
      getProductSelectGetMemberCategory({ memberId: member.memberId, memberRoleId: member.roleId })
        .then((res) => {
          const _enum = res.data.map((item) => {
            return {
              label: item.name,
              value: item.id,
            }
          })
          linkage.enum('customerCategoryId', _enum)
        })
        .catch((error) => {
          console.warn(error)
        })
      getProductSelectGetMemberBrand({ memberId: member.memberId, memberRoleId: member.roleId })
        .then((res) => {
          const _enum = res.data.map((item) => {
            return {
              label: item.name,
              value: item.id,
            }
          })
          linkage.enum('brandId', _enum)
        })
        .catch((error) => {
          console.warn(error)
        })
    })
  }

  const handleAddedProduct = () => {
    if (isEmpty(member)) {
      message.warning(intl.formatMessage({ id: 'dealAbility.qingxuanzebeixunjiahuiyuan' }))
      return
    }
    if (!form.getFieldValue('shopId')) {
      message.warning(intl.formatMessage({ id: 'dealAbility.qingxuanzexunjiashangcheng' }))
      return
    }
    toggle(true)
  }

  return (
    <Card id="inquiryProductLayout" title={intl.formatMessage({ id: 'dealAbility.xunjiashangpin' })}>
      <Button block type="dashed" style={{ marginBottom: '24px' }} onClick={handleAddedProduct}>
        <PlusOutlined />
        {intl.formatMessage({ id: 'dealAbility.tianjiashangpin' })}
      </Button>
      <Form.Item
        name="inquiryListProductRequests"
        rules={[{ required: true, message: intl.formatMessage({ id: 'dealAbility.qingtianjiashangpin' }) }]}
      >
        <Table rowKey="productId" columns={columns} dataSource={dataSource} pagination={false} />
      </Form.Item>
      <TableModal
        modalType="Drawer"
        visible={visible}
        title={intl.formatMessage({ id: 'dealAbility.xuanzeshangpin' })}
        mode={'checkbox'}
        tableProps={{
          rowKey: 'productId',
        }}
        customKey="productId"
        fetchData={handleFetchData}
        onClose={() => toggle(false)}
        onOk={handleLogisticOnOk}
        columns={productColumns}
        effects={($, actions) => {
          useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
          useBusinessEffects()
        }}
        schema={{
          type: 'object',
          properties: {
            megalayout: {
              type: 'object',
              'x-component': 'mega-layout',
              properties: {
                name: {
                  type: 'string',
                  'x-component': 'Search',
                  'x-mega-props': {},
                  'x-component-props': {
                    placeholder: intl.formatMessage({ id: 'dealAbility.shangpinmingcheng' }),
                    align: 'flex-left',
                  },
                },
              },
            },
            [FORM_FILTER_PATH]: {
              type: 'object',
              'x-component': 'flex-layout',
              'x-component-props': {
                rowStyle: {
                  justifyContent: 'flex-start',
                  flexWrap: 'nowrap',
                },
                colStyle: {
                  //改变间隔
                  marginRight: 20,
                },
              },
              properties: {
                PRO_LAYOUT: {
                  type: 'object',
                  'x-component': 'mega-layout',
                  'x-mega-props': {
                    span: 5,
                  },
                  'x-component-props': {
                    inline: true,
                  },
                  properties: {
                    customerCategoryId: {
                      type: 'string',
                      'x-component-props': {
                        placeholder: intl.formatMessage({ id: 'dealAbility.qingxuanzepinlei' }),
                        style: {
                          width: 160,
                        },
                      },
                      enum: [],
                    },
                    brandId: {
                      type: 'string',
                      'x-component-props': {
                        placeholder: intl.formatMessage({ id: 'dealAbility.qingxuanzepinpai' }),
                        style: {
                          width: 160,
                        },
                      },
                      enum: [],
                    },
                  },
                },
                sumbit: {
                  'x-component': 'Submit',
                  'x-mega-props': {
                    span: 1,
                  },
                  'x-component-props': {
                    children: intl.formatMessage({ id: 'dealAbility.chaxun' }),
                  },
                },
              },
            },
          },
        }}
        value={dataSource}
      />
    </Card>
  )
}

export default InquiryProductLayout
