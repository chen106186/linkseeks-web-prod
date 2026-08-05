import React, { useState, useEffect } from 'react'
import {
  createFormActions,
  FormEffectHooks,
  ISchemaFormActions,
  ISchemaFormAsyncActions,
  registerVirtualBox,
} from '@apps/formily'
import { Button, Row, Col, message } from 'antd'
import { useModalTable } from '../../model/useModalTable'
import AnchorDrawer from '@/components/AnchorDrawer'
import style from './index.less'
import { PlusOutlined } from '@ant-design/icons'
import DrawerTable from '@/components/DrawerTable'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import Search from '@/components/NiceForm/components/Search'
import Submit from '@/components/NiceForm/components/Submit'
import { productSearch, relevanceSchema } from '../../schema/modal'
import {
  searchBrandOptionEffect,
  searchCustomerCategoryOptionEffect,
} from '@/pages/procurementAbility/callForBids/addNewBid/effects'
import CustomInputSearch from '@/components/NiceForm/components/CustomInputSearch'
import CustomCategorySearch from '@/components/NiceForm/components/CustomCategorySearch'
import {
  getProductCommodityCommonGetCommodityListBySeller,
  getProductCommodityGetCommodityAttributeByCommoditySkuId,
} from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()

export interface RelateProductDrawerProps {
  type?: 'radio' | 'checkbox'
  title?: string
  schemaAction: ISchemaFormActions | ISchemaFormAsyncActions
  currentRef?: any
  confirmModal?()
}

const formActions = createFormActions()

export const RelevanceTenderProduct: React.FC<RelateProductDrawerProps> = ({
  type = 'checkbox',
  title,
  schemaAction,
  confirmModal,
  currentRef,
  ...restProps
}) => {
  const { visible, setVisible } = useModalTable({ type, customKey: 'id' })
  const [childVisible, setChildVisible] = useState<boolean>(false)
  const [selectRow, setSelectRow] = useState<any[]>([]) // 子级抽屉选择的行数据
  const [currentMaterial, setCurrentMaterial] = useState<any>() // 当前操作的物料行数据
  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<string>>([])

  const [dataIdList, setDataIdList] = useState<any>([
    {
      title: intl.formatMessage({ id: 'table.purchase.jibenxinxi' }),
      idName: 'basicInfo',
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.fujian' }),
      idName: 'file',
    },
  ])
  const [outerSchema, setOuterSchema] = useState<any>(relevanceSchema)

  useEffect(() => {
    if (currentRef) {
      currentRef.current = {
        setVisible,
        visible,
        setCurrentMaterial,
      }
    }
  }, [])

  useEffect(() => {
    if (visible) {
      // 清空之前的数据并重置schema
      formActions.reset()
      setDataIdList([
        {
          title: intl.formatMessage({ id: 'table.purchase.jibenxinxi' }),
          idName: 'basicInfo',
        },
        {
          title: intl.formatMessage({ id: 'table.purchase.fujian' }),
          idName: 'file',
        },
      ])
      setOuterSchema(() => {
        let tempSchema: any = { ...relevanceSchema }
        return {
          type: 'object',
          properties: { Text_0: tempSchema['properties']['Text_0'], Text_99: tempSchema['properties']['Text_99'] },
        }
      })
      // 没有关联商品清空相关回显信息
      if (!currentMaterial?.commodityId && !currentMaterial?.commoditySkuId) {
        setSelectRow([])
        setSelectedRowKeys([])
      } else {
        setSelectedRowKeys([currentMaterial.commodityId])
      }
      console.log(currentMaterial, selectRow)
    }
  }, [visible])

  // 显示当前投标物料信息
  useEffect(() => {
    if (currentMaterial) {
      formActions.setFieldValue('bidMaterial', currentMaterial)
    }
  }, [currentMaterial])

  // 注册virtual组件 用于基本信息布局
  registerVirtualBox('CustomLayout', (props) => {
    const { schema, value } = props

    const { showStar = false, headerBackgroundColor, headerColor, whetherSelect = false } = schema['x-component-props']

    return (
      <div style={{ border: '1px solid #DAF2E7', marginBottom: 16 }}>
        <p style={{ paddingLeft: 8, fontSize: 12, backgroundColor: headerBackgroundColor, color: headerColor }}>
          {props.props['title']}
          <span style={{ color: 'red' }}>{showStar ? '*' : null}</span>
        </p>
        <div className={style['card-list']}>
          {whetherSelect ? (
            <Button type="dashed" block icon={<PlusOutlined />} onClick={selectProduct}>
              {intl.formatMessage({ id: 'table.purchase.xuanzeshangpin' })}
            </Button>
          ) : null}
          {whetherSelect
            ? value && (
                <Row>
                  <Col span={12}>
                    <Row>
                      <Col span={8}>
                        <p className={style['card-list_title']}>
                          {intl.formatMessage({ id: 'table.purchase.shangpinmingcheng' })}
                        </p>
                      </Col>
                      <Col>
                        <p>{value.name}</p>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={12}>
                    <Row>
                      <Col span={8}>
                        <p className={style['card-list_title']}>
                          {intl.formatMessage({ id: 'table.purchase.pinpai' })}
                        </p>
                      </Col>
                      <Col>
                        <p>{value.brandName}</p>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={12}>
                    <Row>
                      <Col span={8}>
                        <p className={style['card-list_title']}>
                          {intl.formatMessage({ id: 'table.purchase.pinlei' })}
                        </p>
                      </Col>
                      <Col>
                        <p>{value.customerCategoryName}</p>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              )
            : currentMaterial && (
                <Row>
                  <Col span={12}>
                    <Row>
                      <Col span={8}>
                        <p className={style['card-list_title']}>
                          {intl.formatMessage({ id: 'table.purchase.wuliaobianhao' })}
                        </p>
                      </Col>
                      <Col>
                        <p>{currentMaterial.code}</p>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={12}>
                    <Row>
                      <Col span={8}>
                        <p className={style['card-list_title']}>
                          {intl.formatMessage({ id: 'table.purchase.pinpai' })}
                        </p>
                      </Col>
                      <Col>
                        <p>{currentMaterial.brandName}</p>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={12}>
                    <Row>
                      <Col span={8}>
                        <p className={style['card-list_title']}>
                          {intl.formatMessage({ id: 'table.purchase.wuliaomingcheng' })}
                        </p>
                      </Col>
                      <Col>
                        <p>{currentMaterial.name}</p>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={12}>
                    <Row>
                      <Col span={8}>
                        <p className={style['card-list_title']}>
                          {intl.formatMessage({ id: 'table.purchase.pinlei' })}
                        </p>
                      </Col>
                      <Col>
                        <p>{currentMaterial.categoryName}</p>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={12}>
                    <Row>
                      <Col span={8}>
                        <p className={style['card-list_title']}>
                          {intl.formatMessage({ id: 'table.purchase.guigexinghao' })}
                        </p>
                      </Col>
                      <Col>
                        <p>{currentMaterial.type}</p>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              )}
        </div>
      </div>
    )
  })

  const selectProduct = () => {
    setChildVisible(true)
  }

  const columns: any[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      className: 'commonHide',
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.shangpinbianma' }),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.shangpinmingcheng' }),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.pinlei' }),
      dataIndex: 'customerCategoryName',
      key: 'customerCategoryName',
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.pinpai' }),
      dataIndex: 'brandName',
      key: 'brandName',
    },
  ]

  // 父级抽屉提交
  const confirmSubmit = () => {
    formActions.validate().then((res) => {
      if (res['errors']['length'] === 0) {
        setVisible(false)
        formActions.submit((v) => {
          // 点击确定 设置商品id和商品文件到对应物料行中
          let submitMateriel = schemaAction.getFieldValue('submitTenderMateriel')
          submitMateriel.map((item) => {
            if (item.id === currentMaterial['id']) {
              item.file = v['file']
              item.commodityId = selectRow[0]['commodityId']
              item.commoditySkuId = selectRow[0]['id']
            }
            return item
          })

          schemaAction.setFieldValue('submitTenderMateriel', submitMateriel)
        })
      }
    })
  }

  const beforeUpload = (file) => {
    if (file.size / 1024 / 1024 > 20) {
      message.warning(intl.formatMessage({ id: 'table.purchase.yicishangchuanyi' }))
      return Promise.reject()
    }
  }

  const footer = (
    <div
      style={{
        textAlign: 'right',
      }}
    >
      <Button onClick={() => setVisible(false)} style={{ marginRight: 8 }}>
        {intl.formatMessage({ id: 'table.purchase.quxiao' })}
      </Button>
      <Button onClick={confirmSubmit} type="primary">
        {intl.formatMessage({ id: 'table.purchase.queding' })}
      </Button>
    </div>
  )

  const getProductUnitAndRender = (uid) => {
    getProductCommodityGetCommodityAttributeByCommoditySkuId({ commoditySkuId: uid }).then((res) => {
      setDataIdList(() => {
        let origin = [...dataIdList]
        res.data.map((item, index) => {
          origin.splice(++index, 0, {
            title: item.customerAttribute.name,
            id: item.customerAttribute.name,
          })
        })
        return origin
      })
      setOuterSchema(() => {
        let origin = { ...outerSchema }
        res.data.map((item, index) => {
          let tempObj = {
            type: 'object',
            'x-index': ++index,
            'x-component': 'CustomTitle',
            'x-component-props': {
              text: item.customerAttribute.name,
            },
            properties: {},
          }
          tempObj['properties'][item.customerAttribute.name] = {
            title: item.customerAttribute.name,
            type: 'string',
            readOnly: true,
            default: item.customerAttributeValueList[0]['value'],
          }
          origin['properties'][`Text_${++index}`] = tempObj
        })

        let sortArr = Object.keys(origin['properties']).sort(
          (a, b) => Number(a.replace(/[^\d.]/g, '')) - Number(b.replace(/[^\d.]/g, '')),
        )
        let sortAfter = { type: 'object', properties: {} }
        for (let i = 0; i < sortArr.length; i++) {
          sortAfter['properties'][sortArr[i]] = origin['properties'][sortArr[i]]
        }
        console.log(sortAfter, 'sortAfter')
        return sortAfter
      })
    })
  }

  // 子级抽屉点击确定 ~生成动态schema和dataList
  const onConfirm = () => {
    setChildVisible(false)
    formActions.setFieldValue('tenderProduct', selectRow[0])
    getProductUnitAndRender(selectRow[0]['id'])
  }

  const fetchData = (params: any) => {
    return new Promise((resolve, reject) => {
      getProductCommodityCommonGetCommodityListBySeller({
        ...params,
        shopType: 1,
        environment: 1,
      }).then((res) => {
        resolve(res.data)
      })
    })
  }

  const rowSelection: any = {
    type: 'radio',
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectRow(selectedRows)
      setSelectedRowKeys(selectedRowKeys)
    },
  }

  return (
    <AnchorDrawer
      title={title}
      visible={visible}
      dataIdList={dataIdList}
      footer={footer}
      onClose={() => setVisible(false)}
      isForm={true}
      actions={formActions}
      // effects={($, ctx) => {
      //   $('onFormMount').subscribe(() => {
      //
      //   })
      // }}
      schema={outerSchema}
      expressionScope={{
        beforeUpload,
      }}
    >
      {/* 子抽屉 */}
      <DrawerTable
        drawerTitle={intl.formatMessage({ id: 'table.purchase.xuanzeshangpin' })}
        confirm={onConfirm}
        cancel={() => setChildVisible(false)}
        visible={childVisible}
        columns={columns}
        rowSelection={rowSelection}
        fetchTableData={(params: any) => fetchData(params)}
        formilyProps={{
          ctx: {
            schema: productSearch,
            components: { ModalSearch: Search, Submit, CustomInputSearch, CustomCategorySearch },
            effects: ($, actions) => {
              actions.reset()
              useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
              FormEffectHooks.onFieldChange$('brandId').subscribe((state) => {
                searchBrandOptionEffect(actions, 'brandId')
              })
              FormEffectHooks.onFieldChange$('customerCategoryId').subscribe((state) => {
                searchCustomerCategoryOptionEffect(actions, 'customerCategoryId')
              })
            },
          },
        }}
        resetDrawer={{
          destroyOnClose: true,
        }}
        tableProps={{
          rowKey: 'id',
        }}
      />
    </AnchorDrawer>
  )
}

RelevanceTenderProduct.defaultProps = {}

export default RelevanceTenderProduct
