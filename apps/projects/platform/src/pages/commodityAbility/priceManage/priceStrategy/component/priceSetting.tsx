import React, { useState, useEffect, useRef } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { usePageStatus, PageStatus } from '@/hooks/usePageStatus'
import { ISchemaFormActions, ISchema, FormEffectHooks } from '@apps/formily'
import { PlusOutlined, LinkOutlined, SettingOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { Button, message, Tooltip, Input } from 'antd'
import NiceForm from '@/components/NiceForm'
import { columnsUnitProduct, memberColumns, memberLevelColumns } from '../../constant'
import { constructTableData, transformDataForNiceForm } from '../../effect'
import PriceModal from './priceModal'
import ProductModal from './productModal'
import MemberModal from './memberModal'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { fectchShopListsSource } from '@/utils/type'
import {
  getProductCommodityGetCommoditySkuList,
  getProductCommodityUnitPriceStrategyGetUnitPriceStrategy,
} from '@apps/apis'
import MemberLevelModal from './memberLevelModal'
import { setPriceSchema } from '../../schema'

const { Search } = Input

export interface PriceSettingProps {
  addSchemaAction: ISchemaFormActions
  onFieldChange?()
  formSubmit?(values)
}

const fetchShopLists = async () => {
  return await fectchShopListsSource({ type: 1 })
}

const PriceSetting: React.FC<PriceSettingProps> = (props) => {
  const intl = useIntl()
  const { addSchemaAction, formSubmit, onFieldChange = () => {} } = props
  const priceRef = useRef<any>({})
  const productRef = useRef<any>({})
  const memberRef = useRef<any>({})
  const memberLevelRef = useRef<any>({})
  const [formLoading, setFormLoading] = useState(false)
  const [schema, setSchmea] = useState<ISchema>(setPriceSchema)

  const [initFormValue, setInitialFormValue] = useState({})
  const dataRef = useRef({})
  const [priceType, setPriceType] = useState(1)

  const { id, preview, pageStatus } = usePageStatus()

  useEffect(() => {
    if (id) {
      getProductCommodityUnitPriceStrategyGetUnitPriceStrategy({ id }).then((res) => {
        const { initValue } = transformDataForNiceForm(res.data, addSchemaAction)
        setInitialFormValue(initValue)
        dataRef.current = initValue
        addSchemaAction.setFieldState('commodityMemberList', (state) => {
          state.dataSource = initValue.commodityMemberList
        })
        addSchemaAction.setFieldValue('minOrder', initValue.minOrder)
      })
    }
  }, [])

  // 删除会员
  const handleDeleteMemberTable = (reocrd) => {
    const value = addSchemaAction.getFieldValue('commodityMemberList')
    const res = value.filter((item) => item.memberId != reocrd.memberId)
    addSchemaAction.setFieldValue('commodityMemberList', res)
    addSchemaAction.setFieldState('commodityMemberList', (state) => {
      state.isDelete = true
    })
    if (pageStatus === PageStatus.EDIT) {
      let hasMember = memberRef.current.rowSelectionCtl.selectRow
      memberRef.current.rowSelectionCtl.setSelectRow(hasMember.filter((item) => item.memberId != reocrd.memberId))
    }
  }

  // 删除会员等级
  const handleDeleteMemberLevelTable = (reocrd) => {
    const value = addSchemaAction.getFieldValue('commodityMemberLevelList')
    const res = value.filter((item) => item.levelId != reocrd.levelId)
    addSchemaAction.setFieldValue('commodityMemberLevelList', res)
    addSchemaAction.setFieldState('commodityMemberLevelList', (state) => {
      state.isDelete = true
    })
    if (pageStatus === PageStatus.EDIT) {
      let hasMember = memberRef.current.rowSelectionCtl.selectRow
      memberRef.current.rowSelectionCtl.setSelectRow(hasMember.filter((item) => item.levelId != reocrd.levelId))
    }
  }

  const handleAddMemberBtn = () => {
    const shopId = addSchemaAction.getFieldValue('shopId')
    const productId = addSchemaAction.getFieldValue('productId')
    if (!shopId || !productId) {
      message.error(intl.formatMessage({ id: 'priceManage.priceStrategy.priceSetting.error.1' }))
      return
    }
    memberRef.current.setVisible(true)
    const commodityMemberList = addSchemaAction.getFieldValue('commodityMemberList')
    if (!commodityMemberList || commodityMemberList.length === 0) {
      memberRef.current?.rowSelectionCtl?.setSelectedRowKeys([])
      memberRef.current?.rowSelectionCtl?.setSelectRow([])
    }
  }

  const handleAddMemberLevelBtn = () => {
    const shopId = addSchemaAction.getFieldValue('shopId')
    const productId = addSchemaAction.getFieldValue('productId')
    if (!shopId || !productId) {
      message.error(intl.formatMessage({ id: 'priceManage.priceStrategy.priceSetting.error.1' }))
      return
    }
    memberLevelRef.current.setVisible(true)
    const commodityMemberLevelList = addSchemaAction.getFieldValue('commodityMemberLevelList')
    if (!commodityMemberLevelList || commodityMemberLevelList.length === 0) {
      memberLevelRef.current?.rowSelectionCtl?.setSelectedRowKeys([])
      memberLevelRef.current?.rowSelectionCtl?.setSelectRow([])
    } else {
      memberLevelRef.current?.rowSelectionCtl?.setSelectedRowKeys(commodityMemberLevelList.map((item) => item.levelId))
      memberLevelRef.current?.rowSelectionCtl?.setSelectRow(commodityMemberLevelList)
    }
  }

  const handleSetProductPrice = (record: any) => {
    console.log(record, 'record')
    if (record?.id) {
      priceRef.current.setVisible(true)
      priceRef.current.setCurrentSetPriceRow(record)
    }
  }

  // 弹出商品选择
  const handleAddProductBtn = () => {
    const shopId = addSchemaAction.getFieldValue('shopId')
    if (!shopId) {
      message.error(intl.formatMessage({ id: 'priceManage.priceStrategy.priceSetting.error.2' }))
      return false
    }
    productRef.current.setVisible(true)
    productRef.current.rowSelectionCtl.setSelectedRowKeys([addSchemaAction.getFieldValue('productId')])
  }

  // 价格策略设置表单提交
  const handleSubmit = async (values) => {
    formSubmit && formSubmit(values)
  }

  const clickBatchSetPrice = () => {
    if (addSchemaAction.getFieldValue('productId')) {
      priceRef.current.setIsBatchSetting(true)
      priceRef.current.setVisible(true)
    } else {
      message.error(intl.formatMessage({ id: 'priceManage.priceStrategy.priceSetting.error.3' }))
    }
  }

  const searchMember = (value) => {
    if (!value) {
      addSchemaAction.setFieldValue(
        'commodityMemberList',
        addSchemaAction.getFieldState('commodityMemberList')['dataSource'],
      )
      return
    }

    let commodityMemberList = addSchemaAction
      .getFieldValue('commodityMemberList')
      .filter((item) => item.name.indexOf(value) !== -1)
    addSchemaAction.setFieldValue('commodityMemberList', commodityMemberList)
  }

  /**
   * 生成价格设置 table 和会员 column
   * @param pId 商品id
   * @param ctx action
   * @param priceType 价格类型（可选）1现货2询价
   */
  const producePriceTableMemerColumn = async (pId, ctx, priceType?) => {
    let skuList: any = []
    if (pageStatus === PageStatus.ADD) {
      const res = await getProductCommodityGetCommoditySkuList({ id: pId })
      skuList = res.data || []
    }

    // 填充价格设置table（编辑采用initValue数据）
    let source = pageStatus === PageStatus.ADD ? skuList : dataRef.current['memberUnitPriceList']

    const { columsUnit, tableUnitData } = constructTableData(source, ctx, pageStatus)
    ctx.setFieldState('memberUnitPriceList', (state) => {
      state.dataSource = source // 存源数据
      columsUnit.push({
        dataIndex: 'ctl',
        title: intl.formatMessage({ id: 'priceManage.priceStrategy.priceSetting.ctl' }),
        align: 'center',
        render: (_i, _r) => (
          <Button disabled={pageStatus === PageStatus.PREVIEW} type="link" onClick={() => handleSetProductPrice(_r)}>
            {intl.formatMessage({ id: 'priceManage.priceStrategy.priceSetting.ctl.button' })}
          </Button>
        ),
      })
      state.props['x-component-props'].columns = columsUnit
    })
    ctx.setFieldValue('memberUnitPriceList', tableUnitData)

    // 填充适用会员table
    ctx.setFieldState('commodityMemberList', (state) => {
      memberColumns[memberColumns.length - 1].render = (text, record) => {
        return (
          <Button
            disabled={pageStatus === PageStatus.PREVIEW}
            type="link"
            onClick={() => handleDeleteMemberTable(record)}
          >
            {intl.formatMessage({ id: 'priceManage.priceStrategy.priceSetting.delete' })}
          </Button>
        )
      }
      state.props['x-component-props'].columns = memberColumns
    })

    // 填充会员等级table
    ctx.setFieldState('commodityMemberLevelList', (state) => {
      memberLevelColumns[memberLevelColumns.length - 1].render = (text, record) => {
        return (
          <Button
            disabled={pageStatus === PageStatus.PREVIEW}
            type="link"
            onClick={() => handleDeleteMemberLevelTable(record)}
          >
            {intl.formatMessage({ id: 'priceManage.priceStrategy.priceSetting.delete' })}
          </Button>
        )
      }
      state.props['x-component-props'].columns = memberLevelColumns
    })
  }

  // 新增会员
  const tableAddMemberButton = pageStatus !== PageStatus.PREVIEW && (
    <>
      <p style={{ display: 'flex', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        <Search
          placeholder={intl.formatMessage({ id: 'priceManage.priceStrategy.priceSetting.tableAddMemberButton' })}
          onSearch={(value) => searchMember(value)}
          style={{ width: 256 }}
        />
      </p>
      <Button style={{ marginBottom: 16 }} block icon={<PlusOutlined />} onClick={handleAddMemberBtn} type="dashed">
        {intl.formatMessage({ id: 'priceManage.priceStrategy.priceSetting.tableAddMemberButton.button' })}
      </Button>
    </>
  )

  // 新增会员等级
  const tableAddMemberLevelButton = pageStatus !== PageStatus.PREVIEW && (
    <>
      <Button
        style={{ marginBottom: 16 }}
        block
        icon={<PlusOutlined />}
        onClick={handleAddMemberLevelBtn}
        type="dashed"
      >
        {intl.formatMessage({ id: 'priceManage.priceStrategy.priceSetting.tableAddMemberButton.button1' })}
      </Button>
    </>
  )

  // 批量设置价格按钮
  const batchPriceButton = pageStatus !== PageStatus.PREVIEW && priceType !== 2 && (
    <Button type="text" onClick={clickBatchSetPrice} style={{ marginBottom: 12, float: 'right' }}>
      <SettingOutlined /> {intl.formatMessage({ id: 'priceManage.priceStrategy.priceSetting.batchPriceButton.button' })}
    </Button>
  )

  // 选择商品
  const connectProduct = pageStatus === PageStatus.ADD && (
    <div className="connectBtn" onClick={handleAddProductBtn}>
      <LinkOutlined style={{ marginRight: 4 }} />
      {intl.formatMessage({ id: 'priceManage.priceStrategy.priceSetting.connectProduct.button' })}
    </div>
  )

  const questionNameLabel = (
    <>
      {intl.formatMessage({ id: 'priceManage.priceStrategy.priceSetting.questionNameLabel' })}&nbsp;
      <Tooltip title={intl.formatMessage({ id: 'priceManage.priceStrategy.priceSetting.questionNameLabel.tooltip' })}>
        <QuestionCircleOutlined />
      </Tooltip>
    </>
  )

  const questionPriceTypeLabel = (
    <>
      {intl.formatMessage({ id: 'priceManage.priceStrategy.priceSetting.questionPriceTypeLabel' })}&nbsp;
      <Tooltip
        title={intl.formatMessage({ id: 'priceManage.priceStrategy.priceSetting.questionPriceTypeLabel.tooltip' })}
      >
        <QuestionCircleOutlined />
      </Tooltip>
    </>
  )

  return (
    <>
      <NiceForm
        loading={formLoading}
        previewPlaceholder=" "
        editable={pageStatus !== PageStatus.PREVIEW}
        value={initFormValue}
        expressionScope={{
          questionNameLabel,
          questionPriceTypeLabel,
          connectProduct,
          batchPriceButton,
          columnsUnitProduct,
          memberColumns,
          tableAddMemberButton,
          memberLevelColumns,
          tableAddMemberLevelButton,
        }}
        effects={($, ctx) => {
          FormEffectHooks.onFormInputChange$().subscribe(() => {
            onFieldChange()
          })
          useAsyncSelect('shopId', fetchShopLists, ['name', 'id'])
          $('onFieldValueChange', 'shopId').subscribe((parentState) => {
            if (parentState.value) {
              ctx.setFieldState('shopId', (state) => {
                if (pageStatus === PageStatus.EDIT) {
                  state.props['x-component-props'].disabled = true
                }
              })
              ctx.setFieldState('priceType', (state) => {
                if (pageStatus === PageStatus.EDIT) {
                  state.props['x-component-props'].disabled = true
                }
              })
            }
          })

          $('onFieldValueChange', 'productId').subscribe(async (parentState) => {
            if (parentState.value) {
              producePriceTableMemerColumn(parentState.value, ctx)
            }
          })

          // $('onFieldValueChange', 'priceType').subscribe((parentState) => {
          //   let pId = ctx.getFieldValue('productId')
          //   if (pId) {
          //     producePriceTableMemerColumn(pId, ctx, parentState.value)
          //   }
          //   setPriceType(parentState.value)
          // })

          // 会员 会员等级动态表单
          $('onFieldValueChange', 'applyType').subscribe((parentState) => {
            const _schema = { ...schema }
            if (parentState.value === 1) {
              // 采用会员
              ctx.setFieldState('commodityMemberList', (state) => (state.visible = true))
              ctx.setFieldState('commodityMemberLevelList', (state) => (state.visible = false))
            } else if (parentState.value === 2) {
              // 采用会员等级
              ctx.setFieldState('commodityMemberLevelList', (state) => (state.visible = true))
              ctx.setFieldState('commodityMemberList', (state) => (state.visible = false))
            }
            setSchmea({ ..._schema })
          })
        }}
        onSubmit={handleSubmit}
        actions={addSchemaAction}
        schema={schema}
      />

      {/* 选择商品 Modal */}
      <ProductModal currentRef={productRef} schemaAction={addSchemaAction} />

      {/* 选择会员 */}
      <MemberModal currentRef={memberRef} schemaAction={addSchemaAction} />

      {/* 选择会员等级 */}
      <MemberLevelModal currentRef={memberLevelRef} schemaAction={addSchemaAction} />

      {/* 价格设置 Modal */}
      <PriceModal currentRef={priceRef} schemaAction={addSchemaAction} />
    </>
  )
}

PriceSetting.defaultProps = {}

export default React.memo(PriceSetting)
