import { Button, Cascader, Col, Form, Input, Row, Select, Space, Table, message } from '@linkseeks/ui'
import useColumns from './useColumns'
import {
  useProductForm,
  CardWrapper,
  usePriceTypeField,
  useCommodityPicField,
  SpecsAttributeTableItem,
  SpecsAttributeTableRow,
  PRICE_TYPE_ENUM,
  SpecsDetailTable,
} from '@apps/services/commodity'
import { useEffect, useRef, useState } from 'react'
import SpecsModal from './speceModal'
import { useSpecsFormData } from './service'
import { isEqual, isNumber, map, mapValues, omit } from 'lodash'
import MaterialModal from './materialModal'
import PriceModal from './priceModal'
import { useWebIntl } from '@apps/locales'
import { SingleCardUpload, StandardUpload, UploadFile, UploadImage } from '@apps/components'
import { getDiffDataSource } from './getDiffDataSource'
interface EditableRowProps {
  index: number
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm()
  return <tr {...props} />
}

const omitSpecsAttrId = (obj) => {
  const result: any = {}
  for (const key in obj) {
    const item = obj[key]
    result[key] = omit(item, 'id')
  }

  return result
}
const EditableCell: React.FC<any> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  type,
  index,
  options,
  value,
  disabled,
  ...restProps
}) => {
  const translate = useWebIntl()
  const { specsSettingDataSource, setSpecsSettingDataSource } = useProductForm()
  let childNode = children
  // 规格属性的操作项
  if (editable) {
    if (options) {
      const handleChange = (value) => {
        const newData = new SpecsAttributeTableRow()
        newData.addResources(record)

        /**
         * 如果有变更sku信息，则需要将原sku的item项id删除，以免无法绑定对应关系
         */
        const initAttributeItem = {
          ...newData[dataIndex],
          ...options.find((v) => v.value === value),
        }

        initAttributeItem.id && delete initAttributeItem.id
        newData[dataIndex] = new SpecsAttributeTableItem(initAttributeItem)

        // 这里校验如果要改变的这一项 已经在specsSettingDataSource中存在，则不允许修改
        if (
          specsSettingDataSource.some((v) =>
            isEqual(omitSpecsAttrId(newData.getSpecsAttribute()), omitSpecsAttrId(v.getSpecsAttribute())),
          ) &&
          dataIndex !== 'goodsId'
        ) {
          message.error(translate('web.resource.commodity.yicunzaishuxing'))
        } else {
          const result = [...specsSettingDataSource]
          result.splice(index, 1, newData)

          setSpecsSettingDataSource(result)
        }
      }
      const value = record ? record[dataIndex] : ''
      childNode = (
        <Select
          style={{ width: '100%' }}
          allowClear={false}
          options={options}
          value={value}
          onChange={handleChange}
          disabled={disabled}
        />
      )
    } else {
      // 否则是输入类型
      // 目前只有hscode编码是输入类型
      const value = record ? record[dataIndex] : ''

      const handleChange = (e) => {
        const value = e.target.value

        if (isNaN(Number(value))) {
          return
        }
        setSpecsSettingDataSource((dataSource) => {
          const newDataSource = [...dataSource]
          newDataSource[index].setHsCode(value)
          return newDataSource
        })
      }
      childNode = (
        <Input maxLength={10} style={{ width: '100%' }} onChange={handleChange} value={value} disabled={disabled} />
      )
    }
  }

  return <td {...restProps}>{childNode}</td>
}

// 规格设置
const SpecsSetting = () => {
  const translate = useWebIntl()
  const { handleCheckRequired } = useSpecsFormData()
  const { columns, priceRef, handleOpenPrice } = useColumns()
  const {
    formInstance,
    setSpecsSettingDataSource,
    specsSettingDataSource,
    specsAttributeSKU,
    setSpecsSelections,
    checkDisabled,
    productData,
    handleChangeDataSource,
  } = useProductForm()
  const commodityPicField = useCommodityPicField()
  const priceTypeValue = usePriceTypeField()
  const specsRef = useRef<any>({})
  const materialRef = useRef<any>({})
  const uploader = useRef<any>({})
  // 唤起商品规格
  // 若规格属性中的必选项没有勾选，则不能唤起
  const handleOpenSpecs = async () => {
    const target = await handleCheckRequired()
    if (target) {
      // 已选中的所有规格属性项
      // 写入到context中
      specsRef.current.toggle()
    }
  }

  const handleOpenMaterial = async () => {
    materialRef.current.toggle()
  }

  const handleChangeImage = (uploadImageList: string[]) => {
    if (uploadImageList) {
      setSpecsSettingDataSource((data) => [
        ...data.map((v) => {
          v.setCommodityPic(uploadImageList)
          return v
        }),
      ])
    }
  }

  const openBatchPicture = () => {
    if (specsSettingDataSource.length > 0) {
      uploader.current.click()
    } else {
      message.error(translate('web.resource.commodity.qingxianshezhiguige'))
    }
  }

  /**
   * 新增规格按钮
   * 触发后会自动添加一条没选中的sku进来
   */
  const handleAddSpecs = async () => {
    const target = await handleCheckRequired()
    if (target) {
      const dataSource = specsAttributeSKU.current?.generateSKUData()
      if (dataSource) {
        const results = getDiffDataSource(dataSource, specsSettingDataSource)
        if (results && results.length > 0) {
          const firstItem = results[0]
          setSpecsSelections((data) => {
            const selected = [...data, firstItem.getRowKey()]
            handleChangeDataSource(selected)
            return selected
          })
        } else {
          message.info(translate('web.resource.commodity.zanwukexuanguige'))
        }
      } else {
        message.error(translate('web.resource.commodity.meiyouguigeshuxing'))
      }
    }
  }
  const controlBtns = (
    <Space>
      {!checkDisabled && (
        <Button type="primary" onClick={handleAddSpecs}>
          {translate('web.resource.commodity.xinzengguige')}
        </Button>
      )}

      <Button onClick={openBatchPicture}>{translate('web.resource.commodity.piliangshezhishanpintupian')}</Button>
      <StandardUpload showUploadList={false} onChange={handleChangeImage} multiple maxCount={10} maxSize={2}>
        <div ref={uploader}></div>
      </StandardUpload>
      <Button onClick={handleOpenMaterial}>{translate('web.resource.order.guanlianwuliao')}</Button>
      {priceTypeValue !== PRICE_TYPE_ENUM.INQUIRY_PRICE && (
        <Button onClick={() => handleOpenPrice('batch')}>
          {priceTypeValue === PRICE_TYPE_ENUM.POINT_GOODS_PRICE
            ? translate('web.resource.commodity.piliangshezhijifen')
            : translate('web.resource.commodity.piliangshezhijiage')}
        </Button>
      )}
      {!checkDisabled && (
        <Button onClick={handleOpenSpecs} type="primary">
          {translate('web.resource.commodity.xuanzeshanpinguige')}
        </Button>
      )}
    </Space>
  )

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  }

  return (
    <CardWrapper id="4" title={translate('web.resource.commodity.guigeshezhi')} extra={controlBtns}>
      <Table
        components={components}
        columns={columns}
        dataSource={specsSettingDataSource}
        rowKey={(record) => {
          // 根据sku信息设置key
          return JSON.stringify(record.getSpecsAttribute())
        }}
        pagination={false}
        scroll={{ x: columns.length * 250 }}
      />
      <SpecsModal ref={specsRef} />
      <MaterialModal ref={materialRef} />
      <PriceModal ref={priceRef} />
    </CardWrapper>
  )
}

export default SpecsSetting
