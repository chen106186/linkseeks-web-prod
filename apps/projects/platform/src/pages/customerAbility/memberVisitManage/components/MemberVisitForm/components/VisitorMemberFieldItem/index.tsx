/*
 * @Description: 被拜访的会员表单项组件
 */
import React, { useState, useEffect } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Input, Button, Drawer, message } from 'antd'
import { LinkOutlined } from '@ant-design/icons'
import { ColumnType } from 'antd/lib/table/interface'
import { useSchemaProps } from '@apps/formily'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import { getMemberUserPage } from '@apps/apis'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import PolymericTable, { FetchParamsType, FetchResponse } from '@/components/PolymericTable'
import { querySchema } from './schema'

export type MemberType = {
  /**
   * 用户id
   */
  userId: number
  /**
   * 账号
   */
  account: string
  /**
   * 姓名
   */
  name: string
  /**
   * 手机号码前缀（国家代码）
   */
  countryCode: string
  /**
   * 手机号码
   */
  phone: string
  /**
   * 最后一次登录时间
   */
  lastLoginTime: string
  /**
   * 所属角色
   */
  roleName: string
  /**
   * 所属组织机构名称
   */
  orgName: string
  /**
   * 状态0-无效1-有效
   */
  status: number
  /**
   * 职位
   */
  jobTitle: string
}

export type VisitorMemberValue = MemberType[]

interface VisitorMemberFieldItemProps {
  /**
   * 值
   */
  value: VisitorMemberValue
  /**
   * 选择客户触发事件
   */
  onChange?: (value: VisitorMemberValue) => void
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

const VisitorMemberFieldItem = (props) => {
  const { value } = props

  const [visibleDrawer, setVisibleDrawer] = useState(false)

  const [rowSelection, rowCtl] = useRowSelectionTable({ type: 'radio', customKey: 'userId' })

  const schemaProps = useSchemaProps()
  const intl = useIntl()

  const componentProps = props.props['x-component-props'] || {}

  useEffect(() => {
    if (value) {
      rowCtl.setSelectRow(value)
      rowCtl.setSelectedRowKeys(value.map((item) => item.userId))
    }
  }, [value])

  const columns: ColumnType<MemberType>[] = [
    {
      title: intl.formatMessage({ id: 'member.memberVisitManage.index', defaultMessage: '序号' }),
      dataIndex: 'index',
      width: '10%',
      render: (_, record, index) => index + 1,
    },
    {
      title: intl.formatMessage({ id: 'member.memberVisitManage.fullName', defaultMessage: '姓名' }),
      dataIndex: 'name',
    },
    {
      title: intl.formatMessage({ id: 'member.memberVisitManage.phoneNumber', defaultMessage: '手机号' }),
      dataIndex: 'phone',
    },
    {
      title: intl.formatMessage({ id: 'member.memberVisitManage.orgName', defaultMessage: '所属机构' }),
      dataIndex: 'orgName',
    },
    {
      title: intl.formatMessage({ id: 'member.memberVisitManage.job', defaultMessage: '职位' }),
      dataIndex: 'jobTitle',
    },
  ]

  const handleVisibleDrawer = (flag?: boolean) => {
    setVisibleDrawer(!!flag)
  }

  const fetchMemberList = async (params: ExtraFetchType) => {
    const res = await getMemberUserPage({
      ...(params as any),
      current: `${params.current}`,
      pageSize: `${params.pageSize}`,
      status: 1, // 只需要状态是 启用的
    })
    if (res.code === 1000) {
      return res.data
    }
    return { data: [], totalCount: 0 }
  }

  const handleConfirm = () => {
    if (!rowCtl.selectRow.length) {
      message.warning(
        intl.formatMessage({ id: 'member.memberVisitManage.visitor.required', defaultMessage: '请选择用户' }),
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
            id: 'member.memberVisitManage.visitor.required',
            defaultMessage: '请选择用户',
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
        title={intl.formatMessage({ id: 'member.memberVisitManage.visitor.placeholder2', defaultMessage: '选择用户' })}
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
          rowKey="userId"
          columns={columns}
          fetchDataSource={(params) => fetchMemberList(params as ExtraFetchType)}
          rowSelection={rowSelection}
          defaultPageSize={20}
          searchFormProps={{
            schema: querySchema,
            effects: ($, actions) => {
              useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
            },
          }}
          full
        />
      </Drawer>
    </>
  )
}

VisitorMemberFieldItem.isFieldComponent = true

export default VisitorMemberFieldItem
