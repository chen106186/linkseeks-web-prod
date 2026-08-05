import React, { useRef, forwardRef, memo } from 'react'
import StandardTable from '@/components/StandardTable'
import { ColumnType } from 'antd/lib/table'
import CommonDrawer from '@/components/CommonDrawer'
import { getMemberUserPageByRoleId } from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'

interface PropsType {
  onOk?: (rows: any[], rowKeys: any[]) => void
}

const SeeUserDrawer = (props: PropsType, ref) => {
  const intl = useIntl()
  const tableRef = useRef<any>({})
  const roleIdRef = useRef<any>()

  const fetchData = (params: any) => {
    return new Promise((resolve) => {
      if (roleIdRef.current) {
        getMemberUserPageByRoleId({ ...params, roleId: roleIdRef.current }).then(({ code, data }) => {
          if (code === 1000) {
            resolve(data)
          }
        })
      } else {
        resolve({ total: 0, data: [] })
      }
    })
  }

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'material.no', defaultMessage: '序号' }),
      dataIndex: 'number',
      key: 'number',
      render: (text, record, index) => index + 1,
    },
    {
      title: intl.formatMessage({ id: 'authConfig.personName', defaultMessage: '姓名' }),
      dataIndex: 'name',
      key: 'name',
    },
    { title: intl.formatMessage({ id: 'authConfig.tel', defaultMessage: '手机号' }), dataIndex: 'phone', key: 'phone' },
    {
      title: intl.formatMessage({ id: 'authConfig.orgName', defaultMessage: '所属机构' }),
      dataIndex: 'orgName',
      key: 'orgName',
    },
    {
      title: intl.formatMessage({ id: 'authConfig.zhiwei', defaultMessage: '职位' }),
      dataIndex: 'jobTitle',
      key: 'jobTitle',
    },
  ]

  return (
    <CommonDrawer
      ref={ref}
      title={intl.formatMessage({ id: 'processRuleSetting.userList', defaultMessage: '用户列表' })}
      width={800}
      footer={null}
      onShow={(params: any) => {
        roleIdRef.current = params?.roleId
      }}
      destroyOnClose={true}
    >
      <StandardTable
        ref={tableRef}
        columns={columns}
        tableProps={{ rowKey: 'userId' }}
        fetchTableData={(params: any) => fetchData(params)}
      />
    </CommonDrawer>
  )
}

export default memo(forwardRef(SeeUserDrawer))
