import React from 'react'
import { useToggle } from '@linkseeks/hooks'
import { Table } from 'antd'
import styles from './index.less'
import { PlusOutlined } from '@ant-design/icons'
import { useIntl } from '@linkseeks/i18n'
import MaterialsDrawer, { MaterialsValueType } from '../MaterialsDrawer'

/**
 * 选择指定物料
 */

interface Iprops {
  value: MaterialsValueType
  mutators: {
    change: (data: any) => void
  }
  editable: boolean
}

const DEFAULT_RETURN_DATA = {
  totalCount: 0,
  data: [],
}

const SelectMaterial: React.FC<Iprops> & { isFieldComponent: boolean } = (props: Iprops) => {
  const [visible, toggle] = useToggle(false)
  const { value, mutators, editable } = props
  const intl = useIntl()

  const columns = [
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

  const handleDelete = (_row: { code: string }) => {
    const temp = value.filter((_item) => !(_item.code === _row.code))
    mutators.change(temp)
  }

  const withEdit = editable
    ? columns.concat([
        {
          title: intl.formatMessage({ id: 'material.operation', defaultMessage: '操作' }),
          render: (text, record) => {
            return (
              <a onClick={() => handleDelete(record)}>
                {intl.formatMessage({ id: 'material.group.delete', defaultMessage: '删除' })}
              </a>
            )
          },
        },
      ] as any)
    : columns

  const handleMaterialsDrawerConfirm = (value: MaterialsValueType) => {
    if (props.mutators.change) {
      props.mutators.change(value)
    }
    toggle(false)
  }

  return (
    <div>
      {editable && (
        <div className={styles.plus} onClick={() => toggle(true)}>
          <PlusOutlined />
          {intl.formatMessage({ id: 'material.button.add', defaultMessage: '添加' })}
        </div>
      )}
      <Table columns={withEdit} dataSource={value} rowKey="id" />
      {/* 物料弹窗 */}
      <MaterialsDrawer
        visible={visible}
        onClose={() => toggle(false)}
        value={value}
        onConfirm={handleMaterialsDrawerConfirm}
      />
    </div>
  )
}

SelectMaterial.isFieldComponent = true

export default SelectMaterial
