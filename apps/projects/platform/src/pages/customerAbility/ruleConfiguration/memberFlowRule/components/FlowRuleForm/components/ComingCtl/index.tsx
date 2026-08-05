/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-28 15:19:56
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-04 17:26:12
 * @Description: 入库资料操作组
 */
import React, { useState, useRef, useEffect } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { PlusOutlined } from '@ant-design/icons'
import { Space, Button, Drawer } from 'antd'
import { ColumnType } from 'antd/lib/table/interface'
import { createFormActions } from '@apps/formily'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import { getMemberCustomerProcessRuleConfigPage } from '@apps/apis'
import PolymericTable, { FetchParamsType } from '@/components/PolymericTable'
import querySchema from './schema'

export type ValueType = {
  /**
   * 注册资料Id
   */
  id: number
  /**
   * 中文名称
   */
  fieldLocalName: string
  /**
   * 中文名称
   */
  groupName: string
}

interface IProps {
  /**
   * 角色id
   */
  roleId: number
  /**
   * 点击确认事件触发
   */
  onConfirm: (value: ValueType[]) => void
  /**
   * 值
   */
  value?: ValueType[]
  /**
   * 是否可新增的
   */
  isCanAdd?: boolean
}

type ExtraFetchType = FetchParamsType & {
  /**
   * 角色id
   */
  roleId: string
  /**
   * 名称
   */
  name: string
}

const ComingCtl = (props: IProps) => {
  const { roleId, onConfirm, value, isCanAdd } = props
  const [visibleDrawer, setVisibleDrawer] = useState(false)

  const ref = useRef<any>({})

  const intl = useIntl()

  const [rowSelection, RowCtl] = useRowSelectionTable({ customKey: 'id' })

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'member.memberFlowRule.components.ComingCtl.columns.id' }),
      dataIndex: 'id',
    },
    {
      title: intl.formatMessage({ id: 'member.memberFlowRule.components.ComingCtl.columns.fieldLocalName' }),
      dataIndex: 'fieldLocalName',
    },
    {
      title: intl.formatMessage({ id: 'member.memberFlowRule.components.ComingCtl.columns.groupName' }),
      dataIndex: 'groupName',
    },
    {
      title: intl.formatMessage({ id: 'member.memberFlowRule.components.ComingCtl.columns.fieldTypeName' }),
      dataIndex: 'fieldTypeName',
    },
    {
      title: intl.formatMessage({
        id: 'member.memberFlowRule.components.ComingCtl.columns.validate',
        defaultMessage: '变更需要审核',
      }),
      dataIndex: 'validate',
      render: (text) =>
        text
          ? intl.formatMessage({ id: 'common.button.yes', defaultMessage: '是' })
          : intl.formatMessage({ id: 'common.button.no', defaultMessage: '否' }),
    },
    {
      title: intl.formatMessage({
        id: 'member.memberFlowRule.components.ComingCtl.columns.allowSelect',
        defaultMessage: '搜索项',
      }),
      dataIndex: 'allowSelect',
      render: (text) =>
        text
          ? intl.formatMessage({ id: 'common.button.yes', defaultMessage: '是' })
          : intl.formatMessage({ id: 'common.button.no', defaultMessage: '否' }),
    },
  ]

  const fetchListData = async (params: ExtraFetchType) => {
    if (!roleId) {
      return { data: [], totalCount: 0 }
    }
    const payload = {
      ...params,
      current: `${params.current}`,
      pageSize: `${params.pageSize}`,
      roleId: `${roleId}`,
    }
    const res = await getMemberCustomerProcessRuleConfigPage(payload)
    return res.data
  }

  useEffect(() => {
    if (ref && ref.current && ref.current.reload) {
      ref.current.reload({ roleId })
    }
  }, [props.roleId])

  useEffect(() => {
    if ('value' in props) {
      // 同步
      RowCtl.setSelectRow(value)
      RowCtl.setSelectedRowKeys(value.map((item) => item.id))
    }
  }, [value])

  const handleVisibleDrawer = (flag: boolean) => {
    setVisibleDrawer(!!flag)
  }

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(RowCtl.selectRow)
      handleVisibleDrawer(false)
    }
  }

  return (
    <div>
      <Space size="middle">
        {isCanAdd && (
          <Button type="primary" icon={<PlusOutlined />} onClick={() => handleVisibleDrawer(true)}>
            {intl.formatMessage({ id: 'member.memberFlowRule.components.ComingCtl.add' })}
          </Button>
        )}
        {/* <Button>
          预览入库资料
        </Button> */}
      </Space>

      <Drawer
        title={intl.formatMessage({ id: 'member.memberFlowRule.components.ComingCtl.drawer.title' })}
        width={1000}
        onClose={() => handleVisibleDrawer(false)}
        visible={visibleDrawer}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button onClick={() => handleVisibleDrawer(false)} style={{ marginRight: 16 }}>
              {intl.formatMessage({ id: 'member.actions.cancel' })}
            </Button>
            <Button onClick={handleConfirm} type="primary">
              {intl.formatMessage({ id: 'member.actions.confirm' })}
            </Button>
          </div>
        }
        bodyStyle={{
          paddingBottom: 0,
        }}
      >
        <PolymericTable
          rowKey="id"
          columns={columns}
          fetchDataSource={(params) => fetchListData(params as ExtraFetchType)}
          rowSelection={rowSelection}
          defaultPageSize={20}
          searchFormProps={{
            schema: querySchema,
          }}
          full
        />
      </Drawer>
    </div>
  )
}

ComingCtl.defaultProps = {
  isCanAdd: false,
}

export default ComingCtl
