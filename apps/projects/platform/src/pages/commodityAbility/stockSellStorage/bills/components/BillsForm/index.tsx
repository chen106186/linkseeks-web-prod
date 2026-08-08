import React, { useState, useEffect } from 'react'
import { Button, Spin, Cascader } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { ArrayTable } from '@apps/formily'
import { history } from '@linkseeks/router-manager'
import { usePrompt } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import moment from 'moment'
import { formatTimeString } from '@/utils'
import { SaveOutlined, PlusOutlined } from '@ant-design/icons'
import { createFormActions, FormEffectHooks } from '@apps/formily'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import {
  getProductMaterielGetMaterielList,
  getProductInvoicesDetails,
  postProductInvoicesAddOrUpdate,
} from '@apps/apis'
import NiceForm from '@/components/NiceForm'
import ModalTable from '@/components/ModalTable'
import Search from '@/components/NiceForm/components/Search'
import Submit from '@/components/NiceForm/components/Submit'
import SearchSelect from '@/components/NiceForm/components/SearchSelect'
import CustomCategorySearch from '@/components/NiceForm/components/CustomCategorySearch'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { addBillSchema, goodsSearchSchema } from './schema'
import { createEffects, useAsyncCascader, fetchTreeData } from './effects'
import EllipsisText from '@/formSchema/components/EllipsisText'
import { useFormDetail } from '@/formSchema/effects/useFormDetail'
import FormDetailHeader from '@/components/FormDetailHeader'
import { FormDetailContext } from '@/formSchema/context'
import FormDetailWrapper from '@/components/FormDetailWrapper'
const addSchemaAction = createFormActions()
const { onFormInputChange$ } = FormEffectHooks

interface BillsFormProps {
  /**
   * 单据id
   */
  id?: string
  /**
   * 单据编号
   */
  invoicesNo?: string
  /**
   * 是否是编辑的
   */
  isEdit?: boolean
  /**
   * 单据类型ID
   */
  invoicesTypeId: string
  /**
   * 对应单据
   */
  relevanceInvoices: string
  /**
   * 单据id，可能是待新增销售发货单，待新增采购入库单跳转过来的
   */
  relevanceInvoicesId: string
  /**
   * 来源，跳转来源于 进销存新增 or 其他地方跳转过来的
   * 1 进销存，2 单据
   */
  source?: 1 | 2
}

const BillsForm: React.FC<BillsFormProps> = ({ id, invoicesNo = '', isEdit = false }) => {
  const intl = useIntl()
  const [visible, setVisible] = useState(false)
  const [productRowSelection, productRowCtl] = useRowSelectionTable({
    type: 'checkbox',
  })
  const [billInfo, setBillInfo] = useState<{ [key: string]: any }>({
    invoicesTime: moment().format('YYYY-MM-DD HH:mm:ss'),
  })
  const [unsaved, setUnsaved] = useState(false)
  const [infoLoading, setInfoLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  usePrompt({
    when: unsaved,
    message: intl.formatMessage({
      id: 'stockSellStorage.ninhaiyouweibaocundenei',
    }),
  })

  const goodsColumns: any[] = [
    {
      title: intl.formatMessage({ id: 'stockSellStorage.huohao' }),
      dataIndex: 'id',
      // align: 'center',
      render: (_, record) => record.code,
    },
    {
      title: intl.formatMessage({ id: 'stockSellStorage.huopinmingcheng' }),
      dataIndex: 'name',
      // align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'stockSellStorage.materialGroup' }),
      dataIndex: ['materialGroup', 'name'],
      // align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'stockSellStorage.guigexinghao' }),
      dataIndex: 'type',
      // align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'stockSellStorage.pinlei' }),
      dataIndex: ['customerCategory', 'name'],
      // align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'stockSellStorage.pinpai' }),
      dataIndex: ['brand', 'name'],
      // align: 'center',
    },
  ]

  // 获取单据详情
  const getBillInfo = () => {
    if (!id && !invoicesNo) {
      return
    }
    setInfoLoading(true)
    getProductInvoicesDetails({
      id,
    } as any)
      .then((res) => {
        if (res.code !== 1000) {
          return
        }
        const { invoicesTime, invoicesDetailsOrderResponses, ...rest } = res.data

        setBillInfo({
          ...rest,
          source: 1,
          invoicesDetailsDTOList: invoicesDetailsOrderResponses?.map((item) => {
            return {
              ...item,
              totalPrice:
                item.totalPrice !== null && item.totalPrice !== undefined
                  ? `${intl.formatMessage({ id: 'common.money' })}${item.totalPrice}`
                  : '',
            }
          }),
          invoicesTime: invoicesTime ? formatTimeString(invoicesTime) : '',
        })
      })
      .catch((err) => {
        console.warn(err)
      })
      .finally(() => {
        setInfoLoading(false)
      })
  }

  useEffect(() => {
    getBillInfo()
  }, [])

  // 弹出单据明细
  const handleAdd = () => {
    setVisible(true)
  }

  const TableAddButton =
    isEdit || !id ? (
      <Button style={{ marginBottom: 16 }} block icon={<PlusOutlined />} onClick={handleAdd} type="dashed">
        {intl.formatMessage({ id: 'stockSellStorage.tianjiadanjumingxi' })}
      </Button>
    ) : null

  // 提交
  const handleSubmit = (value) => {
    setSubmitLoading(true)
    postProductInvoicesAddOrUpdate({
      id: +id,
      ...value,
      invoicesTime: new Date(value.invoicesTime).getTime(),
      source: 1,
      invoicesDetailsList: value.invoicesDetailsDTOList?.map((item) => {
        return {
          ...item,
          totalPrice: item.totalPrice?.substring(1),
        }
      }),
    })
      .then((res) => {
        if (res.code !== 1000) {
          setSubmitLoading(false)
          return
        }
        setUnsaved(false)
        setTimeout(() => {
          history.goBack()
        }, 800)
      })
      .catch(() => {
        setSubmitLoading(false)
      })
  }

  // 选择单据明细
  const handleOkAddProduct = async () => {
    // 这里先找到是否已经选择过的数据，存在的话就直接使用，否则用新值
    const preValues = addSchemaAction.getFieldValue('invoicesDetailsDTOList')
    const values = []

    productRowCtl.selectRow.forEach((item) => {
      const atom = {
        materielId: item.id,
        materielNo: item.code,
        materielName: item.name,
        materielGroup: item.materialGroup?.name,
        materialGroupId: item.materialGroup?.id,
        specifications: item.type,
        category: item.customerCategory?.name || '',
        brand: item.brand?.name || '',
        unit: item.unitName,
        costPrice: item.costPrice,
        invoicesCount: 0.001,
        totalPrice: String(item.costPrice * 0.001),
      }
      values.push(atom)
    })
    const new_values = values.filter((val) => !preValues.some((v) => v.materielId === val.materielId))
    addSchemaAction.setFieldValue('invoicesDetailsDTOList', preValues?.concat(new_values))
    productRowCtl.setSelectRow([])
    productRowCtl.setSelectedRowKeys([])
    setVisible(false)
  }

  // 获取货品列表
  const fetchProductList = async (params) => {
    const materialGroupId = params.materialGroupId
      ? params.materialGroupId[params.materialGroupId.length - 1]
      : undefined
    const res = await getProductMaterielGetMaterielList({
      ...params,
      materialGroupId,
      ids: '99',
    })
    if (res.code === 1000) {
      return res.data
    }
    return []
  }

  const handleRemoveItem = (index: number) => {
    const newValue = [...addSchemaAction.getFieldValue('invoicesDetailsDTOList')]
    newValue.splice(index, 1)
    addSchemaAction.setFieldValue('invoicesDetailsDTOList', newValue)
  }

  // ArrayTable自定义渲染
  const renderListTableRemove = (index: number) => (
    <Button shape="circle" icon={<DeleteOutlined />} onClick={() => handleRemoveItem(index)} />
  )

  const { formContext } = useFormDetail()
  const providerValue = {
    // detailData: initFormValue,
    schemaActions: addBillSchema,
    formContext,
  }
  return (
    <Spin spinning={infoLoading}>
      <FormDetailContext.Provider value={providerValue}>
        <FormDetailHeader
          title={
            !id && isEdit
              ? intl.formatMessage({ id: 'stockSellStorage.xinjiandanju' })
              : isEdit
              ? intl.formatMessage({ id: 'stockSellStorage.bianjidanju' })
              : intl.formatMessage({ id: 'stockSellStorage.zhakandanju' })
          }
          schema={addBillSchema}
          extraRight={
            isEdit
              ? [
                  <Button
                    key="1"
                    type="primary"
                    icon={<SaveOutlined />}
                    loading={submitLoading}
                    onClick={() => addSchemaAction.submit()}
                  >
                    {intl.formatMessage({ id: 'stockSellStorage.baocun' })}
                  </Button>,
                ]
              : []
          }
        />
        <FormDetailWrapper>
          <NiceForm
            value={billInfo}
            previewPlaceholder=" "
            expressionScope={{
              TableAddButton,
              renderListTableRemove,
            }}
            components={{
              // RadioGroup: Radio.Group,
              ArrayTable,
              Text: EllipsisText,
            }}
            editable={isEdit}
            effects={($, actions) => {
              createEffects($, actions)
              onFormInputChange$().subscribe(() => {
                if (!unsaved) {
                  setUnsaved(true)
                }
              })
              // 注入表单完成进度
              formContext.useAttachmentChangeForContext(actions)
              formContext.useAnchorCountChangeForContext(actions, ['invoicesDetailsDTOList'])
            }}
            onSubmit={handleSubmit}
            actions={addSchemaAction}
            schema={addBillSchema}
          />
        </FormDetailWrapper>

        <ModalTable
          modalTitle={intl.formatMessage({
            id: 'stockSellStorage.xuanzehuopin',
          })}
          confirm={handleOkAddProduct}
          cancel={() => setVisible(false)}
          visible={visible}
          columns={goodsColumns}
          rowSelection={productRowSelection}
          fetchTableData={(params) => fetchProductList(params)}
          formilyProps={{
            ctx: {
              schema: goodsSearchSchema,
              components: {
                Search,
                Submit,
                SearchSelect,
                CustomCategorySearch,
                Cascader,
              },
              effects: ($, actions) => {
                useAsyncCascader('materialGroupId', fetchTreeData)
                useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
              },
              inline: false,
            },
          }}
          tableProps={{
            rowKey: 'id',
          }}
        />
      </FormDetailContext.Provider>
    </Spin>
  )
}

export default BillsForm
