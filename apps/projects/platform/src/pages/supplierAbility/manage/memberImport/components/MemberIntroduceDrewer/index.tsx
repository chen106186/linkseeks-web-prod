/*
 * @Description: 会员引入抽屉
 */
import React, { useEffect, useState } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Drawer, Button, message } from 'antd'
import { ColumnType } from 'antd/lib/table/interface'
import { createFormActions } from '@apps/formily'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import PolymericTable, { FetchParamsType, FetchResponse } from '@/components/PolymericTable'
import { querySchema } from './querySchema'

const queryFormActions = createFormActions()

export type MemberIntroduceType = {
  /**
   * 会员ID
   */
  memberId: number
  /**
   * 会员名称
   */
  name: string
  /**
   * 会员类型
   */
  memberType: number
  /**
   * 会员类型名称
   */
  memberTypeName: string
  /**
   * 会员角色
   */
  roleId: number
  /**
   * 会员角色名称
   */
  roleName: string
  /**
   * 会员等级
   */
  level: number
  /**
   * 会员等级名称
   */
  levelTag: string
  /**
   * 国家代码Id
   */
  countryCodeId: number
  /**
   * 手机号码
   */
  phone: string
  /**
   * 注册邮箱
   */
  email: string
  /**
   * 上级会员关系Id
   */
  upperRelationId: number
  /**
   * 注册资料
   */
  detail: { [key: string]: any }
  /**
   * 审核id
   */
  validateId: number
  telCode: string
}

export type MemberIntroduceDrawerSubmitValue = MemberIntroduceType[]

type ExtraFetchType = FetchParamsType & {
  name: string
}

export interface MemberIntroduceDrawerProps {
  /**
   * 是否可见
   */
  visible: boolean
  /**
   * 值
   */
  value?: MemberIntroduceType[]
  /**
   * Form 确认事件
   */
  onSubmit: (values: MemberIntroduceDrawerSubmitValue) => Promise<void>
  /**
   * 抽屉关闭事件
   */
  onClose: () => void
  /**
   * 获取dataSource方法
   */
  fetchDataSource: (params: ExtraFetchType) => Promise<FetchResponse<MemberIntroduceType>>
}

const MemberIntroduceDrawer = (props: MemberIntroduceDrawerProps) => {
  const { visible, value, onSubmit, onClose, fetchDataSource } = props
  const [confirmLoading, setConfirmLoading] = useState(false)

  const [rowSelection, rowCtl] = useRowSelectionTable({ type: 'checkbox', customKey: 'validateId' })

  const intl = useIntl()

  useEffect(() => {
    if (value) {
      rowCtl.setSelectRow(value)
      rowCtl.setSelectedRowKeys(value.map((item) => item.validateId))
    }
  }, [value])

  const columns: ColumnType<MemberIntroduceType>[] = [
    {
      title: intl.formatMessage({ id: 'supplier.management.import.query.supplierId', defaultMessage: '供应商ID' }),
      dataIndex: 'memberId',
      width: '15%',
    },
    {
      title: intl.formatMessage({ id: 'supplier.management.import.query.supplierName2', defaultMessage: '供应商名称' }),
      dataIndex: 'name',
    },
    // {
    //   title: intl.formatMessage({ id: 'member.management.import.query.memberTypeName',defaultMessage: '会员类型' }),
    //   dataIndex: 'memberTypeName',
    // },
    // {
    //   title: intl.formatMessage({ id: 'member.management.import.query.roleName',defaultMessage: '会员角色' }),
    //   dataIndex: 'roleName',
    // },
    // {
    //   title: intl.formatMessage({ id: 'member.management.import.query.form.basic.level',defaultMessage: '会员等级' }),
    //   dataIndex: 'levelTag',
    // },
  ]

  const fetchMemberIntroduceList = async (params: ExtraFetchType) => {
    if (!fetchDataSource) {
      return { data: [], totalCount: 0 }
    }
    const mergeParams = {
      ...params,
    }
    const res = await fetchDataSource(mergeParams)
    return res
  }

  const handleClose = () => {
    if (onClose) {
      onClose()
    }
  }

  const handleConfirm = () => {
    if (!rowCtl.selectRow.length) {
      message.warning(
        intl.formatMessage({
          id: 'supplier.management.import.query.introduceDrewer.required',
          defaultMessage: '请选择供应商',
        }),
      )
      return
    }
    setConfirmLoading(true)
    if (onSubmit) {
      onSubmit(rowCtl.selectRow).finally(() => {
        setConfirmLoading(false)
      })
    }
  }

  return (
    <Drawer
      title={intl.formatMessage({
        id: 'supplier.management.import.query.introduceDrewer.title',
        defaultMessage: '供应商引入',
      })}
      width={1000}
      onClose={handleClose}
      visible={visible}
      footer={
        <div
          style={{
            textAlign: 'right',
          }}
        >
          <Button onClick={handleClose} style={{ marginRight: 16 }}>
            {intl.formatMessage({ id: 'common.button.cancel', defaultMessage: '取消' })}
          </Button>
          <Button onClick={handleConfirm} type="primary" loading={confirmLoading}>
            {intl.formatMessage({ id: 'common.button.confirm', defaultMessage: '确定' })}
          </Button>
        </div>
      }
      bodyStyle={{
        paddingBottom: 0,
      }}
      destroyOnClose
    >
      <PolymericTable
        rowKey="validateId"
        columns={columns}
        fetchDataSource={(params) => fetchMemberIntroduceList(params as ExtraFetchType)}
        rowSelection={rowSelection}
        searchFormProps={{
          actions: queryFormActions,
          schema: querySchema,
        }}
        defaultPageSize={20}
        full
      />
    </Drawer>
  )
}

export default MemberIntroduceDrawer
