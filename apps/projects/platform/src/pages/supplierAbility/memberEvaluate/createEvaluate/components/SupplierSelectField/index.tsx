/*
 * @Description: 供应商Field组件
 */
import React, { useState, useEffect } from 'react'
import { Input, Button, Drawer, message, Space } from 'antd'
import { LinkOutlined } from '@ant-design/icons'
import { ColumnType } from 'antd/lib/table/interface'
import { useSchemaProps } from '@apps/formily'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import {
  postMemberSupplierLifecycleArchivesManagementPage,
  PostMemberSupplierLifecycleArchivesManagementPageResponseDetail,
} from '@apps/apis'
import PolymericTable, { FetchParamsType, FetchResponse } from '@/components/PolymericTable'
import { querySchema } from './schema'
import { useWebIntl } from '@apps/locales'

export type MemberType = PostMemberSupplierLifecycleArchivesManagementPageResponseDetail & {
  /**
   * 唯一的key，由 memberId+roleId组成
   */
  onlyId: number
}

export type VisitorMemberValue = {
  subMemberId: number
  subRoleId: number
  subMemberName: string
  currentLifecycleStageName: string
  currentLifecycleStageId: number
}[]

interface SupplierSelectFieldProps {
  /**
   * 值
   */
  value: VisitorMemberValue
  /**
   * 选择会员触发事件
   */
  onChange?: (value: VisitorMemberValue) => void
  /**
   * 是否是禁用的
   */
  disabled?: boolean
}

type ExtraFetchType = FetchParamsType & {
  /**
   * 供应商角色名称
   */
  name: string
}

const SupplierSelectField = (props) => {
  const { schema, value } = props

  const [visibleDrawer, setVisibleDrawer] = useState(false)

  const [rowSelection, rowCtl] = useRowSelectionTable({ type: 'radio', customKey: 'onlyId' })

  const schemaProps = useSchemaProps()

  const componentProps: SupplierSelectFieldProps = schema.getExtendsComponentProps() || {}

  const translate = useWebIntl()

  useEffect(() => {
    if (value) {
      rowCtl.setSelectRow(value)
      rowCtl.setSelectedRowKeys(value.map((item) => item.onlyId))
    }
  }, [value])

  const columns: ColumnType<MemberType>[] = [
    {
      title: translate('web.resource.member.gongyingshangid'),
      dataIndex: 'memberId',
    },
    {
      title: translate('web.resource.member.gouyingshangmingchen'),
      dataIndex: 'name',
    },
    {
      title: translate('web.resource.member.shengmingzhouqijieduan'),
      dataIndex: 'lifeCycleStageName',
    },
    {
      title: translate('web.resource.member.rukushijian'),
      dataIndex: 'depositTime',
    },
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
        status: 1, // 只需要状态是 启用的
      },
      {
        ctlType: 'none',
      },
    )
    if (res.code === 1000) {
      return {
        ...res.data,
        data: res.data.data?.map((item) => ({
          ...item,
          onlyId: `${item.memberId}+${item.roleId}`,
        })),
      }
    }
    return { data: [], totalCount: 0 }
  }

  const handleConfirm = () => {
    if (!rowCtl.selectRow.length) {
      message.warning(translate('web.resource.member.qingxuanzegongyingshang'))
      return
    }
    if (props.mutators.change) {
      props.mutators.change(
        rowCtl.selectRow.map((item) => ({
          subMemberId: item.memberId,
          subRoleId: item.roleId,
          subMemberName: item.name,
          currentLifecycleStageName: item.lifeCycleStageName,
          currentLifecycleStageId: item.lifeCycleStageId,
        })),
      )
    }
    handleVisibleDrawer(false)
  }

  return (
    <>
      <Input.Group compact>
        <Input
          value={value && value.length ? value[0].subMemberName : ''}
          placeholder={translate('web.resource.member.qingxuanzegongyingshang')}
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
        title={translate('web.resource.member.xuanzegongyingshang')}
        visible={visibleDrawer}
        width={800}
        onClose={() => handleVisibleDrawer(false)}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Space>
              <Button onClick={() => handleVisibleDrawer(false)}>{translate('web.common.cancel')}</Button>
              <Button onClick={handleConfirm} type="primary">
                {translate('web.common.confirm')}
              </Button>
            </Space>
          </div>
        }
        bodyStyle={{
          paddingBottom: 0,
        }}
      >
        <PolymericTable
          rowKey="onlyId"
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

SupplierSelectField.isFieldComponent = true

export default SupplierSelectField
