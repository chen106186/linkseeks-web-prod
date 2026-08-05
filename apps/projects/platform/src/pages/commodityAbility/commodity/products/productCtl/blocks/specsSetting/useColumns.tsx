import { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Form, Input, Space, Tooltip } from '@linkseeks/ui'
import { useSpecsFormData } from './service'
import { cloneDeep, filter, isEqual } from 'lodash'
import { MultipleCardUpload } from '@apps/components'
import {
  useSubUnitIdField,
  useProductForm,
  PriceDataModal,
  useIsCrossBorderField,
  useFormField,
  usePriceTypeField,
  PRICE_TYPE_ENUM,
} from '@apps/services/commodity'
import { useWebIntl } from '@apps/locales'
import { QuestionCircleIcon } from '@linkseeks/icons'

const useColumns = () => {
  const {
    specsSettingColumns,
    specsSettingDataSource,
    setSpecsSelections,
    setSpecsSettingDataSource,
    materialDataSource,
    extraDataRef,
    disabled,
    checkDisabled,
    isSingleSpecs,
    codeDisabled,
    handleChangeDataSource,
  } = useProductForm()
  const translate = useWebIntl()
  const { handleCheckRequired } = useSpecsFormData()
  const priceRef = useRef<any>({})
  const isCrossBorderValue = useIsCrossBorderField()
  const subUnitIdValue = useSubUnitIdField()
  const priceTypeValue = usePriceTypeField()
  const productName = Form.useWatch('name')
  const handleOpenPrice = async (type: string, record?: any, index?: number) => {
    if (await handleCheckRequired()) {
      priceRef.current.toggle(type, record, index)
    }
  }

  const handleUploadImageChange = (fileList, record, index) => {
    if (fileList) {
      setSpecsSettingDataSource((data) => {
        const result = cloneDeep(data)
        result[index].commodityPic = fileList
        return result
      })
    }
  }

  const handleSkuCodeChange = (value: string, index) => {
    setSpecsSettingDataSource((data) => {
      const result = cloneDeep(data)
      result[index].code = value
      return result
    })
  }

  // const productNameColumn = useMemo(() => {
  //   if (isSingleSpecs) {
  //     // 单规格商品下 需要显示一个固定的商品名称
  //     return [
  //       {
  //         key: 'name',
  //         dataIndex: 'name',
  //         width: 200,
  //         title: translate('web.resource.commodity.name'),
  //         render: () => {
  //           return productName
  //         },
  //       },
  //     ]
  //   } else {
  //     return []
  //   }
  // }, [isSingleSpecs, productName])

  // 物料变化时引发的列数改动
  const materialColumns = useMemo(() => {
    if (materialDataSource.length > 0) {
      return [
        {
          key: 'goodsId',
          title: translate('web.resource.order.guanlianwuliao'),
          dataIndex: 'goodsId',
          width: 200,
          onCell(record, index) {
            return {
              options: materialDataSource.map((v) => ({ label: v.name, value: v.id })),
              editable: true,
              dataIndex: 'goodsId',
              index,
              record,
            }
          },
        },
      ]
    } else {
      return []
    }
  }, [materialDataSource])

  // 是否是跨境商品，如果是，则需要输入HS编码
  const hsCodeColumns = useMemo(() => {
    if (isCrossBorderValue) {
      return [
        {
          key: 'hsCode',
          title: translate('web.resource.commodity.hsCode'),
          dataIndex: 'hsCode',
          width: 200,
          onCell(record, index) {
            return {
              // 如果没有option，默认则是input类型
              editable: true,
              dataIndex: 'hsCode',
              index,
              record,
            }
          },
        },
      ]
    } else {
      return []
    }
  }, [isCrossBorderValue])
  /**
   * 固定搭配的
   */
  const targetColumns = useMemo(() => {
    // 商品定价为积分兑换商品时，”设置价格“改为”设置积分”隐藏“阶梯价格“，”单价“改为”所需积分“
    const cols = [
      {
        key: 'code',
        dataIndex: 'code',
        title: (
          <div>
            <span>{translate('web.resource.commodity.skubianma')}</span>
            <Tooltip placement="top" title={translate('web.resource.commodity.codetip')}>
              <QuestionCircleIcon style={{ marginLeft: 4 }} size={12} />
            </Tooltip>
          </div>
        ),
        width: 220,
        render: (value, record, index) => {
          return (
            <Form.Item
              name={['commoditySkuList', record.id, 'code']}
              style={{ marginBottom: 0 }}
              initialValue={value}
              rules={[
                {
                  pattern: /^[A-Za-z0-9_\-]{5,30}$/,
                  message: translate('web.resource.commodity.skucodetipmessage'),
                },
              ]}
            >
              <Input
                value={value}
                style={{ width: 200 }}
                maxLength={30}
                disabled={codeDisabled}
                onBlur={(e) => handleSkuCodeChange(e.target.value, index)}
              />
            </Form.Item>
          )
        },
      },
      priceTypeValue !== PRICE_TYPE_ENUM.INQUIRY_PRICE && {
        key: 'unitPrice',
        title:
          priceTypeValue === PRICE_TYPE_ENUM.POINT_GOODS_PRICE
            ? translate('web.resource.commodity.suoxujifen')
            : translate('web.common.danjia'),
        dataIndex: 'unitPrice',
        width: 200,
        render: (priceDataModal: PriceDataModal) => {
          if (!priceDataModal) {
            return ''
          }
          if (priceDataModal.isStep) {
            // 是阶梯价
            const stepPrice = priceDataModal.outputStepPrice()
            if (stepPrice) {
              return Object.keys(stepPrice).map((stepKey) => {
                const [numberMin, numberMax] = stepKey.split('-')
                return (
                  <p key={stepKey}>
                    {numberMin} - {numberMax}: ￥ {stepPrice[stepKey]}
                  </p>
                )
              })
            }
          } else {
            if (priceDataModal instanceof PriceDataModal) {
              return priceDataModal?.getPriceWithCurrency(priceTypeValue)
            }
            return priceTypeValue
          }
        },
        shouldCellUpdate: () => priceTypeValue,
      },
      subUnitIdValue &&
        priceTypeValue !== PRICE_TYPE_ENUM.INQUIRY_PRICE && {
          key: 'priceRate',
          title:
            priceTypeValue === PRICE_TYPE_ENUM.POINT_GOODS_PRICE
              ? translate('web.resource.commodity.fudanweijifen')
              : translate('web.resource.commodity.fudanweidanjia'),
          dataIndex: 'priceRate',
          render: (priceRate: number, record: any) => {
            if (!priceRate) {
              return ''
            }

            const priceDataModal: PriceDataModal = record.unitPrice
            if (priceDataModal.isStep) {
              const stepSubPrice = priceDataModal.outputStepSubPrice()
              return Object.keys(stepSubPrice).map((stepKey) => {
                const [numberMin, numberMax] = stepKey.split('-')
                return (
                  <p key={stepKey}>
                    {numberMin} - {numberMax}: ￥ {stepSubPrice[stepKey]}
                  </p>
                )
              })
            } else {
              if (priceDataModal?.getSubPriceWithCurrency) {
                return priceDataModal?.getSubPriceWithCurrency(priceTypeValue)
              }
              return ''
            }
          },
          shouldCellUpdate: () => priceTypeValue,
        },
      {
        key: 'commodityPic',
        title: translate('web.resource.commodity.shanpintupian'),
        dataIndex: 'commodityPic',
        render(value, record, index) {
          return (
            <MultipleCardUpload
              value={value}
              onChange={(fileList) => handleUploadImageChange(fileList, record, index)}
              maxCount={10}
              pictureSize={64}
              maxSize={2}
            />
          )
        },
      },
      {
        key: 'cz',
        title: translate('web.common.control'),
        fixed: 'right',
        width: 250,
        dataIndex: 'cz',
        render(_, record, index) {
          return (
            <Space>
              {priceTypeValue !== PRICE_TYPE_ENUM.INQUIRY_PRICE && (
                <Button onClick={() => handleOpenPrice('single', record, index)} type="link">
                  {priceTypeValue === PRICE_TYPE_ENUM.POINT_GOODS_PRICE
                    ? translate('web.resource.commodity.shezhijifen')
                    : translate('web.resource.commodity.shezhijiage')}
                </Button>
              )}

              {!checkDisabled && (
                <Button onClick={() => handleDelete(record)} type="link">
                  {translate('web.common.delete')}
                </Button>
              )}
            </Space>
          )
        },
      },
    ]

    const validateSkuColumns = specsSettingColumns.map((v) => {
      return {
        ...v,
        onCell(record, index) {
          return {
            ...v.onCell(record, index),
            disabled: false,
          }
        },
      }
    })

    return [...validateSkuColumns, ...materialColumns, ...hsCodeColumns, ...cols].filter(Boolean)
  }, [
    specsSettingDataSource,
    specsSettingColumns,
    // productNameColumn,
    isSingleSpecs,
    priceTypeValue,
    materialColumns,
    hsCodeColumns,
    subUnitIdValue,
    disabled,
    checkDisabled,
  ])

  const handleDelete = (record) => {
    setSpecsSelections((data) => {
      const selected = data.filter((v) => v !== record.getRowKey())
      handleChangeDataSource(selected)
      return selected
    })
  }

  return {
    columns: targetColumns,
    handleOpenPrice,
    priceRef,
  }
}

export default useColumns
