import React, { useState, useRef } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { useLocation } from '@linkseeks/router-core'
import { Button, Form, Card, Modal, Checkbox, Row, Col, Input, Badge, InputNumber, Switch } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'
import StandardTable from '@/components/StandardTable'
import { ColumnType } from 'antd/lib/table/interface'
import { formatTimeString } from '@/utils'
import { EyeAuthButton } from '@apps/components'
import NiceForm from '@/components/NiceForm'
import { createFormActions, FormEffectHooks } from '@apps/formily'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { searchCustomerCategoryOptionEffect, searchBrandOptionEffect } from '../../commodity/products/effect'
import { fastSchema } from '../schema'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { priceTypeLabel, productStatusColor, productStatusLabel } from '../../commodity/products/constant'
import {
  getProductCommodityCommonGetCommodityDetailList,
  GetProductCommodityCommonGetCommodityDetailListResponseDetail,
  getProductCommodityGetCommodityPrice,
  postProductCommodityUpdateCommodityPrice,
} from '@apps/apis'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import { getWebIntl } from '@apps/locales'
import { Validator } from '@apps/validator'
import { useMemoizedFn } from '@linkseeks/hooks'
import styles from './index.less'
import { PlusCircleIcon } from '@linkseeks/icons'

const validator = new Validator()
const formActions = createFormActions()
const translate = getWebIntl()
const FastModifyPrice: React.FC<{}> = () => {
  const intl = useIntl()
  const { pathname } = useLocation()
  const ref = useRef<any>({})
  const [form] = Form.useForm()
  const [modifyModal, setModifyModal] = useState(false)
  const [ladderPrice, setLadderPrice] = useState(false)
  const [currentRow, setCurrentRow] = useState<GetProductCommodityCommonGetCommodityDetailListResponseDetail>()
  const jtSwitch = Form.useWatch('ladderPrice', form)
  const ladderRangeValue = Form.useWatch('ladderRange', form)

  const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  }

  const [priceType, setPriceType] = useState<number>(1)

  const columns: ColumnType<any>[] = [
    {
      title: 'skuID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: translate('web.resource.commodity.shanpinguige'),
      dataIndex: 'commodityAttribute',
      key: 'commodityAttribute',
    },
    {
      title: translate('web.resource.commodity.ID'),
      dataIndex: 'commodityId',
      key: 'commodityId',
    },
    {
      title: intl.formatMessage({ id: 'commodity.products.fastModifyPrice.columns.name' }),
      dataIndex: 'name',
      key: 'name',
      className: 'commonPickColor',
      render: (text: any, record: any) => (
        <EyeAuthButton
          type={authUrl(pathname, 'detail') ? 'link' : 'button'}
          url={`/commodityAbility/commodity/products/detail?id=${record.commodityId}`}
        >
          {text}
        </EyeAuthButton>
      ),
    },

    {
      title: intl.formatMessage({ id: 'commodity.products.fastModifyPrice.columns.customerCategoryName' }),
      dataIndex: 'customerCategoryName',
      key: 'customerCategoryName',
    },
    {
      title: intl.formatMessage({ id: 'commodity.products.fastModifyPrice.columns.brandName' }),
      dataIndex: 'brandName',
      key: 'brandName',
    },
    {
      title: intl.formatMessage({ id: 'commodity.products.fastModifyPrice.columns.unitName' }),
      dataIndex: 'unitName',
      key: 'unitName',
    },
    {
      title: intl.formatMessage({ id: 'commodity.products.fastModifyPrice.columns.priceType' }),
      dataIndex: 'priceType',
      key: 'priceType',
      render: (t, r) => priceTypeLabel[t],
    },
    {
      title: intl.formatMessage({ id: 'commodity.products.fastModifyPrice.columns.min' }),
      dataIndex: 'min',
      key: 'min',
      render: (text: any, reocrd: any) => {
        if (reocrd.priceType === 1) {
          if (reocrd.max === reocrd.min)
            return (
              <>
                {translate('web.common.currencySymbol')}
                {reocrd.min}
              </>
            )
          else
            return (
              <>
                {translate('web.common.currencySymbol')}
                {reocrd.min} ~ {translate('web.common.currencySymbol')}
                {reocrd.max}
              </>
            )
        }
        if (reocrd.priceType === 3) {
          if (reocrd.max === reocrd.min) return <>{reocrd.min}</>
          else
            return (
              <>
                {reocrd.min} ~ {reocrd.max}
              </>
            )
        }
        if (reocrd.priceType === 2) return null
      },
    },
    {
      title: intl.formatMessage({ id: 'commodity.products.fastModifyPrice.columns.applyTime' }),
      dataIndex: 'applyTime',
      key: 'applyTime',
      render: (text: any, record: any) => text && formatTimeString(text),
    },
    {
      title: intl.formatMessage({ id: 'commodity.products.fastModifyPrice.columns.status' }),
      dataIndex: 'status',
      key: 'status',
      render: (text) => <Badge color={productStatusColor[text]} text={productStatusLabel[text]} />,
    },
    {
      title: intl.formatMessage({ id: 'commodity.products.fastModifyPrice.columns.option' }),
      dataIndex: 'option',
      width: 128,
      render: (text: any, record: any) => {
        return (
          <>
            <EditAuthButton>
              <Button type="link" className="padLeft0" onClick={() => handleModify(record)}>
                {record.priceType === 3
                  ? intl.formatMessage({ id: 'commodity.products.fastModifyPrice.columns.option.1' })
                  : intl.formatMessage({ id: 'commodity.products.fastModifyPrice.columns.option.2' })}
              </Button>
            </EditAuthButton>
          </>
        )
      },
    },
  ]

  const fetchData = (params: any) => {
    if (!params.priceTypeList) {
      params.priceTypeList = ''
    }
    return new Promise((resolve, reject) => {
      getProductCommodityCommonGetCommodityDetailList({ ...params, environment: 1 }).then((res) => {
        const { data } = res
        resolve(data)
      })
    })
  }

  const handleModify = (record: any) => {
    setCurrentRow(record)
    const { id, unitPrice, priceType } = record
    // 阶梯价格回显处理
    setModifyModal(true)
    setPriceType(priceType)
    // 获取商品价格积分
    getProductCommodityGetCommodityPrice({ skuId: id }).then((res) => {
      const { data } = res
      form.resetFields()
      if (Object.keys(data)[0] === '0-0') {
        // 状态为非阶梯价格
        setLadderPrice(false)
        form.setFieldsValue({ ladderPrice: false, uniquePrice: Object.values(data)[0] })
      } else if (JSON.stringify(data) === '{}') {
        // 没有数据
        setLadderPrice(false)
      } else {
        setLadderPrice(true)
        let numberArray = Object.keys(data).map((item) => item.split('-').map((_) => Number(_)))
        let priceArray = Object.values(data)
        let tempArr: any[] = []
        numberArray.map((_item, _index) => {
          tempArr.push({
            numberMin: _item[0],
            numberMax: _item[1],
            numberPrice: priceArray[_index],
          })
        })

        form.setFieldsValue({
          ladderPrice: true,
          ladderRange: tempArr.sort((a, b) => (a.numberPrice > b.numberPrice ? 1 : -1)),
        })
      }
    })
  }

  const handleOk = () => {
    form.validateFields().then((v) => {
      const { ladderPrice, ladderRange } = v
      let _priceRange = {}
      if (ladderPrice) {
        // 判断阶梯价格
        ladderRange.length > 0 &&
          ladderRange.map((_item) => {
            _priceRange[`${_item.numberMin}-${_item.numberMax}`] = _item.numberPrice
          })
      } else {
        _priceRange['0-0'] = v.uniquePrice
      }
      postProductCommodityUpdateCommodityPrice({ id: Number(currentRow?.id), unitPrice: _priceRange }).then((res) => {
        if (res.code === 1000) {
          ref.current.reloadCurrent()
          setModifyModal(false)
        }
      })
    })
  }

  const handleCancel = () => {
    setModifyModal(false)
  }

  /**
   * 校验最大值必须大于最小值
   */
  const validatorStepCompare = (r, v, callback) => {
    const filedName = r.field.split('.')
    filedName.pop()
    const value = form.getFieldValue(filedName)

    if (Number(value['numberMax']) > Number(value['numberMin'])) {
      callback()
    } else {
      callback(translate('web.resource.commodity.zuidazhi'))
    }
  }

  const renderPrice = useMemoizedFn(() => {
    return (
      <>
        <Form.Item
          name="uniquePrice"
          label={priceType === 3 ? translate('web.resource.commodity.jifen') : translate('web.common.danjia')}
          rules={[
            {
              required: true,
              type: 'number',
              message: intl.formatMessage({ id: 'priceManage.priceStrategy.priceModal.uniquePrice.rule.1' }),
            },
            {
              pattern: /^([0](\.\d{1,4}))$|^([1-9][0-9]*(\.\d{1,4})?)$|^[0]$/,
              message: intl.formatMessage({ id: 'priceManage.priceStrategy.priceModal.uniquePrice.rule.2' }),
            },
          ]}
        >
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
      </>
    )
  })

  // 阶梯价
  const renderAddPrice = () => {
    return (
      <Form.Item
        name="ladderRange"
        label=""
        shouldUpdate={true}
        rules={[
          {
            required: true,
            message: intl.formatMessage({
              id: 'commodity.products.addProductsItem.priceAttributeForm.modal.form.ladderRange.message',
            }),
          },
        ]}
      >
        <Row>
          <Col span={20}>
            <Row>
              <Col span={10}>
                <span className={styles.label}>{translate('web.resource.commodity.jiagequjian1')}</span>
              </Col>
              <Col span={9}>
                <span className={styles.label}>{translate('web.resource.commodity.jiagequjian2')}</span>
              </Col>
              <Col span={5}>
                <span className={styles.label}>
                  {priceType === 3 ? translate('web.resource.commodity.jifen') : translate('web.common.danjia')}
                  <i className={styles.redStar}>*</i>
                </span>
              </Col>
            </Row>
          </Col>
        </Row>
        <Form.List name="ladderRange">
          {(fields, { add, remove }) => {
            if (!fields.length) {
              add()
            }
            return (
              <div>
                <div>
                  {fields.map(({ key, name, ...restField }, index) => {
                    const minInitValue =
                      index === 0 ? currentRow?.minOrder : Number(ladderRangeValue?.[index - 1]?.numberMax) + 1

                    const handleChange = (e) => {
                      const value = e.target.value
                      const readyIndex = index + 1
                      if (fields.length !== 1 && readyIndex !== fields.length) {
                        form.setFieldValue(['ladderRange', readyIndex, 'numberMin'], Number(value) + 1)
                      }
                    }
                    return (
                      <Row key={key} gutter={[0, 10]}>
                        <Col span={20} style={{ display: 'flex' }}>
                          <Form.Item
                            {...restField}
                            name={[name, 'numberMin']}
                            initialValue={minInitValue}
                            rules={[
                              {
                                required: true,
                                message: intl.formatMessage({
                                  id: 'commodity.products.addProductsItem.priceAttributeForm.modal.form.numberMin.message.1',
                                }),
                              },
                              {
                                pattern: /^\d+(\.\d{1,3})?$/,
                                message: intl.formatMessage({
                                  id: 'commodity.products.addProductsItem.priceAttributeForm.modal.form.numberMin.message.2',
                                }),
                              },
                            ]}
                          >
                            <Input
                              disabled
                              placeholder={intl.formatMessage({
                                id: 'commodity.products.addProductsItem.priceAttributeForm.modal.form.numberMin.placeholder',
                              })}
                            />
                          </Form.Item>
                          <Button type="text">~</Button>
                          <Form.Item
                            {...restField}
                            name={[name, 'numberMax']}
                            rules={[
                              {
                                required: true,
                                message: intl.formatMessage({
                                  id: 'commodity.products.addProductsItem.priceAttributeForm.modal.form.numberMax.message.1',
                                }),
                              },
                              {
                                pattern: /^\d+(\.\d{1,3})?$/,
                                message: intl.formatMessage({
                                  id: 'commodity.products.addProductsItem.priceAttributeForm.modal.form.numberMax.message.2',
                                }),
                              },
                              {
                                validator: validatorStepCompare,
                              },
                            ]}
                          >
                            <Input
                              placeholder={intl.formatMessage({
                                id: 'commodity.products.addProductsItem.priceAttributeForm.modal.form.numberMax.placeholder',
                              })}
                              onChange={handleChange}
                            />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, 'numberPrice']}
                            rules={[
                              {
                                required: true,
                                message:
                                  priceType === 3
                                    ? translate.formatFormInputTip(translate('web.resource.commodity.jifen'))
                                    : translate.formatFormInputTip(translate('web.common.danjia')),
                              },
                              {
                                pattern: /^([0](\.\d{1,4}))$|^([1-9][0-9]*(\.\d{1,4})?)$|^[0]$/,
                                message:
                                  priceType === 3
                                    ? translate('web.resource.commodity.jifenxiaoshu')
                                    : translate('web.resource.commodity.danjiaxiaoshu'),
                              },
                            ]}
                            style={{ marginLeft: 20 }}
                          >
                            <InputNumber
                              min={0}
                              placeholder={
                                priceType === 3
                                  ? translate.formatFormInputTip(translate('web.resource.commodity.jifen'))
                                  : translate.formatFormInputTip(translate('web.common.danjia'))
                              }
                            />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          {key > 0 && (
                            <Button style={{ marginLeft: 16 }} onClick={() => remove(name)} icon={<MinusOutlined />} />
                          )}
                        </Col>
                      </Row>
                    )
                  })}
                </div>
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} style={{ width: '100%' }} icon={<PlusCircleIcon />} />
                </Form.Item>
              </div>
            )
          }}
        </Form.List>
      </Form.Item>
    )
  }

  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          columns={columns}
          currentRef={ref}
          tableProps={{ rowKey: 'id' }}
          fetchTableData={(params: any) => fetchData(params)}
          controlRender={
            <NiceForm
              actions={formActions}
              onSubmit={(values) => ref.current.reload(values)}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
                FormEffectHooks.onFieldChange$('brandId').subscribe((state) => {
                  searchBrandOptionEffect(actions, 'brandId')
                })
                FormEffectHooks.onFieldChange$('customerCategoryId').subscribe((state) => {
                  searchCustomerCategoryOptionEffect(actions, 'customerCategoryId')
                })
              }}
              schema={fastSchema}
            />
          }
        />
      </Card>
      <Modal
        title={
          priceType === 3
            ? translate('web.resource.commodity.shezhijifen')
            : translate('web.resource.commodity.shezhijiage')
        }
        open={modifyModal}
        onCancel={handleCancel}
        onOk={handleOk}
        closable
        destroyOnClose
      >
        <Form labelCol={{ span: 6 }} labelAlign="left" form={form} preserve={false}>
          <Form.Item
            name="ladderPrice"
            label={
              priceType === 3
                ? translate('web.resource.commodity.jietijifen')
                : translate('web.resource.commodity.jietijiage')
            }
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          {jtSwitch ? renderAddPrice() : renderPrice()}
        </Form>
      </Modal>
    </PageHeaderWrapper>
  )
}

export default FastModifyPrice
