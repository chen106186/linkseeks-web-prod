/**
 * @Description 选择物料弹窗
 */
import React, { useEffect } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Cascader, Drawer, Button, Space, message } from 'antd'
import { createFormActions } from '@apps/formily'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import {
  getProductMaterielGetDoesNotFreezeMaterielList,
  GetProductMaterielGetDoesNotFreezeMaterielListResponseDetail,
} from '@apps/apis'
import PolymericTable, { FetchParamsType } from '@/components/PolymericTable'
import { ColumnType } from 'antd/lib/table'
import {
  fetchBrand,
  fetchCategoryData,
  fetchStatus,
  fetchTreeData,
  useAsyncCascader,
} from '../../../common/useGetTableSearchData'
import { querySchema } from './schema'

const formActions = createFormActions()

export type MaterialsItemType = GetProductMaterielGetDoesNotFreezeMaterielListResponseDetail & {}

export type MaterialsValueType = MaterialsItemType[]

type ExtraFetchType = FetchParamsType & {
  /**
   * 物料编号
   */
  code: string
  /**
   * 物料名称
   */
  name: string
  /**
   * 物料组id
   */
  materialGroupId: number
  /**
   * 品类
   */
  categoryId: number
  /**
   * 品牌
   */
  brandId: number
}

interface MaterialsDrawerProps {
  /**
   * 是否可见
   */
  visible: boolean
  /**
   * 值
   */
  value: MaterialsItemType[]
  /**
   * 点击确认触发事件
   */
  onConfirm: (values: MaterialsItemType[]) => void
  /**
   * 抽屉关闭事件
   */
  onClose: () => void
}

const MaterialsDrawer: React.FC<MaterialsDrawerProps> = (props) => {
  const { visible, onClose, value, onConfirm } = props
  const [rowSelection, rowCtl] = useRowSelectionTable({ type: 'checkbox', customKey: 'id' })

  const intl = useIntl()

  useEffect(() => {
    if (value) {
      rowCtl.setSelectRow(value)
      rowCtl.setSelectedRowKeys(value.map((item) => item.id))
    }
  }, [value])

  const columns: ColumnType<GetProductMaterielGetDoesNotFreezeMaterielListResponseDetail>[] = [
    {
      title: intl.formatMessage({ id: 'material.code', defaultMessage: '物料编号' }),
      dataIndex: 'code',
    },
    {
      title: intl.formatMessage({ id: 'material.code', defaultMessage: '物料名称' }),
      dataIndex: 'name',
    },
    {
      title: intl.formatMessage({ id: 'material.group.title', defaultMessage: '物料组' }),
      dataIndex: 'materialGroup',
      render: (text, record) => {
        return <div>{record.materialGroup?.name}</div>
      },
    },
    {
      title: intl.formatMessage({ id: 'material.type', defaultMessage: '规格型号' }),
      dataIndex: 'type',
      // render: (text, record) => {
      //   const { materialAttributeList } = record;
      //   const string = materialAttributeList?.reduce((prev, current) => {
      //     const { customerAttributeValueList } = current;
      //     const temp = customerAttributeValueList?.map((_item) => {
      //       return _item.value
      //     }).join('/');
      //     return prev + "/" + temp
      //   }, "").slice(1);
      //   return (
      //     <div>{string}</div>
      //   )
      // }
    },
    {
      title: intl.formatMessage({ id: 'material.category', defaultMessage: '品类' }),
      dataIndex: 'category',
      render: (text, record) => {
        return <div>{record.customerCategory?.name}</div>
      },
    },
    {
      title: intl.formatMessage({ id: 'material.brand', defaultMessage: '品牌' }),
      dataIndex: 'brand',
      render: (text, record) => {
        return <div>{record.brand?.name}</div>
      },
    },
    {
      title: intl.formatMessage({ id: 'material.unit', defaultMessage: '单位' }),
      dataIndex: 'unitName',
    },
  ]

  const fetchMaterialsList = async (params: ExtraFetchType) => {
    const res = await getProductMaterielGetDoesNotFreezeMaterielList({
      ...(params as any),
      current: `${params.current}`,
      pageSize: `${params.pageSize}`,
    })
    if (res.code === 1000) {
      return res.data
    }
    return { data: [], totalCount: 0 }
  }

  const handleClose = () => {
    if (onClose) {
      onClose()
    }
  }

  const handleConfirm = () => {
    if (!rowCtl.selectRow.length) {
      message.warning(intl.formatMessage({ id: 'material.select.required', defaultMessage: '请选择物料' }))
      return
    }
    if (onConfirm) {
      onConfirm(rowCtl.selectRow)
    }
  }

  return (
    <Drawer
      title={intl.formatMessage({ id: 'material.modal.selectMaterial.title', defaultMessage: '选择物料' })}
      width={1000}
      onClose={handleClose}
      visible={visible}
      footer={
        <div
          style={{
            textAlign: 'right',
          }}
        >
          <Space size="middle">
            <Button onClick={handleClose}>
              {intl.formatMessage({ id: 'common.button.cancel', defaultMessage: '取消' })}
            </Button>
            <Button onClick={handleConfirm} type="primary">
              {intl.formatMessage({ id: 'common.button.confirm', defaultMessage: '确定' })}
            </Button>
          </Space>
        </div>
      }
      bodyStyle={{
        paddingBottom: 0,
      }}
      destroyOnClose
    >
      <PolymericTable
        rowKey="id"
        columns={columns}
        fetchDataSource={(params) => fetchMaterialsList(params as ExtraFetchType)}
        rowSelection={rowSelection}
        defaultPageSize={20}
        searchFormProps={{
          actions: formActions,
          schema: querySchema,
          components: {
            Cascader,
          },
          effects: ($, actions) => {
            useStateFilterSearchLinkageEffect($, actions, 'code', FORM_FILTER_PATH)
            useAsyncCascader('materialGroupId', fetchTreeData)
            useAsyncCascader('categoryId', fetchCategoryData)
            useAsyncSelect('brandId', fetchBrand, ['name', 'id'])
            useAsyncSelect('status', fetchStatus, ['name', 'status'])
          },
        }}
        full
      />
    </Drawer>
  )
}

export default MaterialsDrawer
