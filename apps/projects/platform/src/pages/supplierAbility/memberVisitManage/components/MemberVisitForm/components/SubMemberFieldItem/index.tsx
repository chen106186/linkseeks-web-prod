/*
 * @Description: 被拜访的会员表单项组件
 */
import React, { useState, useEffect } from 'react'
import { Input, Button, Drawer, message } from 'antd'
import { LinkOutlined } from '@ant-design/icons'
import { ColumnType } from 'antd/lib/table/interface'
import { useSchemaProps } from '@apps/formily'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import { postMemberSupplierLifecycleArchivesManagementPage } from '@apps/apis'
import PolymericTable, { FetchParamsType, FetchResponse } from '@/components/PolymericTable'
import { querySchema } from './schema'
import { useIntl } from '@linkseeks/i18n'
export type MemberType = {
  /**
   * 会员id
   */
  memberId: number
  /**
   * 会员名称
   */
  name: string
  /**
   * 会员类型
   */
  memberTypeName: string
  /**
   * 会员角色
   */
  roleName: string
  /**
   * 会员等级
   */
  levelTag: string
}

export type SubMemberValue = MemberType[]

interface MemberVisitedFieldItemProps {
  /**
   * 值
   */
  value: SubMemberValue
  /**
   * 选择会员触发事件
   */
  onChange?: (value: SubMemberValue) => void
  /**
   * 是否是禁用的
   */
  disabled?: boolean
}

type ExtraFetchType = FetchParamsType & {
  /**
   * 会员角色名称
   */
  name: string
}

const MemberVisitedFieldItem = (props) => {
  const { value } = props

  const [visibleDrawer, setVisibleDrawer] = useState(false)

  const [rowSelection, rowCtl] = useRowSelectionTable({ type: 'radio', customKey: 'memberId' })

  const schemaProps = useSchemaProps()
  const intl = useIntl()
  const componentProps = props.props['x-component-props'] || {}

  useEffect(() => {
    if (value) {
      rowCtl.setSelectRow(value)
      rowCtl.setSelectedRowKeys(value.map((item) => item.memberId))
    }
  }, [value])

  const columns: ColumnType<MemberType>[] = [
    // {
    //   title: intl.formatMessage({ id: 'member.memberVisitManage.index',defaultMessage: '序号' }),
    //   dataIndex: 'index',
    //   width: '10%',
    //   render: (_, record, index) => index + 1,
    // },
    {
      title: intl.formatMessage({ id: 'supplier.supplierVisitManage.supplierId', defaultMessage: '供应商ID' }),
      dataIndex: 'memberId',
      width: '15%',
    },
    {
      title: intl.formatMessage({ id: 'supplier.supplierVisitManage.supplierName', defaultMessage: '供应商名称' }),
      dataIndex: 'name',
    },
    {
      title: `${intl.formatMessage({
        id: 'supplier.supplierInspection.common.columns.index.supplierLifecycle',
        defaultMessage: '生命周期阶段',
      })}`,
      dataIndex: 'lifeCycleStageName',
    },
    {
      title: `${intl.formatMessage({
        id: 'supplier.supplierInspection.common.columns.index.supplierEntryTime',
        defaultMessage: '入库时间',
      })}`,
      dataIndex: 'registerTime',
    },
    // {
    //   title: '会员类型',
    //   dataIndex: 'memberTypeName',
    // },
    // {
    //   title: '会员角色',
    //   dataIndex: 'roleName',
    // },
    // {
    //   title: intl.formatMessage({ id: 'member.memberVisitManage.levelTag',defaultMessage: '会员等级' }),
    //   dataIndex: 'levelTag',
    // },
  ]

  const handleVisibleDrawer = (flag?: boolean) => {
    setVisibleDrawer(!!flag)
  }

  const fetchMemberList = async (params: ExtraFetchType) => {
    const res = await postMemberSupplierLifecycleArchivesManagementPage(
      {
        ...(params as any),
        current: `${params.current}`,
        pageSize: `${params.pageSize}`,
      },
      {
        ctlType: 'none',
      },
    )
    if (res.code === 1000) {
      return res.data
    }
    return { data: [], totalCount: 0 }
  }

  const handleConfirm = () => {
    if (!rowCtl.selectRow.length) {
      message.warning(
        intl.formatMessage({ id: 'supplier.evaluation.subMember.required', defaultMessage: '请选择供应商' }),
      )
      return
    }
    if (props.mutators.change) {
      props.mutators.change(rowCtl.selectRow)
    }
    handleVisibleDrawer(false)
  }

  return (
    <>
      <Input.Group compact>
        <Input
          value={value && value.length ? value[0].name : ''}
          placeholder={intl.formatMessage({
            id: 'supplier.evaluation.subMember.required',
            defaultMessage: '请选择供应商',
          })}
          style={{ width: 'calc(100% - 32px)' }}
          disabled
        />
        <Button
          type="primary"
          icon={<LinkOutlined />}
          onClick={() => handleVisibleDrawer(true)}
          disabled={!schemaProps.editable || componentProps?.disabled}
        />
      </Input.Group>
      <Drawer
        title={intl.formatMessage({
          id: 'supplier.supplierVisitManage.supplier.placeholder',
          defaultMessage: '选择供应商',
        })}
        visible={visibleDrawer}
        width={800}
        onClose={() => handleVisibleDrawer(false)}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button onClick={() => handleVisibleDrawer(false)} style={{ marginRight: 16 }}>
              {intl.formatMessage({ id: 'common.button.cancel', defaultMessage: '取消' })}
            </Button>
            <Button onClick={handleConfirm} type="primary">
              {intl.formatMessage({ id: 'common.button.confirm', defaultMessage: '确定' })}
            </Button>
          </div>
        }
        bodyStyle={{
          paddingBottom: 0,
        }}
      >
        <PolymericTable
          rowKey="memberId"
          columns={columns}
          fetchDataSource={(params) => fetchMemberList(params as ExtraFetchType)}
          rowSelection={rowSelection}
          defaultPageSize={20}
          searchFormProps={{
            schema: querySchema,
            effects: ($, actions) => {},
          }}
          full
        />
      </Drawer>
    </>
  )
}

MemberVisitedFieldItem.isFieldComponent = true

export default MemberVisitedFieldItem
