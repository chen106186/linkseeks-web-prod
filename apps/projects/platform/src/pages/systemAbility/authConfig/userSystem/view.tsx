import React from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { useIntl } from '@linkseeks/i18n'
import { Button } from '@linkseeks/ui'
import { useWebIntl } from '@apps/locales'
import { getMemberUserPage, GetMemberUserPageResponseDetail } from '@apps/apis'
import { PageHeaderWrapper, StandardFormTable, EyeAuthButton, StatusAuthButton, AuthButton } from '@apps/components'
import PopConfirmControl from '@/components/PopConfirmControl'

import useUserSystem from './services/useUserSystem'

const UserSystem: React.FC<{}> = () => {
  const intl = useIntl()
  const translate = useWebIntl()
  const { ref, addItem, deleteItem, updateItem, handleStatus, pathname } = useUserSystem()

  const columns = StandardFormTable.createColumns<GetMemberUserPageResponseDetail>([
    {
      title: intl.formatMessage({ id: 'authConfig.account' }),
      dataIndex: 'account',
      align: 'center',
      key: 'account',
      className: 'commonPickColor',
      render: (text, record) => (
        <EyeAuthButton url={`${pathname}/detail?id=${record.userId}&preview=1`}>{text}</EyeAuthButton>
      ),
      searchField: {
        main: true,
        type: 'Input',
      },
    },
    {
      title: intl.formatMessage({ id: 'authConfig.name' }),
      dataIndex: 'name',
      align: 'center',
      key: 'name',
      searchField: 'Input',
    },
    {
      title: intl.formatMessage({ id: 'authConfig.orgName' }),
      dataIndex: 'orgName',
      align: 'center',
      key: 'orgName',
    },
    {
      title: intl.formatMessage({ id: 'authConfig.phone' }),
      align: 'center',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: intl.formatMessage({ id: 'authConfig.belongRoleName' }),
      align: 'center',
      dataIndex: 'roleName',
      key: 'roleName',
    },
    {
      title: intl.formatMessage({ id: 'authConfig.lastLoginTime' }),
      align: 'center',
      dataIndex: 'lastLoginTime',
      key: 'lastLoginTime',
    },
    {
      title: intl.formatMessage({ id: 'authConfig.status' }),
      align: 'center',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) =>
        record.roleName !== '超级管理员' && (
          <StatusAuthButton handleConfirm={() => handleStatus(record)} record={record} />
        ),
      searchField: 'Select',
    },
    {
      title: intl.formatMessage({ id: 'authConfig.option' }),
      dataIndex: 'option',
      key: 'option',
      align: 'center',
      fixed: 'right',
      render: (text, record) => {
        return (
          record.roleName !== '超级管理员' && (
            <>
              <AuthButton type="custom" code="edit">
                <Button type="link" onClick={() => updateItem(record)}>
                  {intl.formatMessage({ id: 'authConfig.modify' })}
                </Button>
              </AuthButton>
              <PopConfirmControl onConfirm={() => deleteItem(record)} visible={record.status === 0}>
                <Button type="link">{intl.formatMessage({ id: 'authConfig.delete' })}</Button>
              </PopConfirmControl>
            </>
          )
        )
      },
    },
  ])

  return (
    <PageHeaderWrapper>
      <StandardFormTable
        columns={columns}
        autoScrollX
        request={getMemberUserPage}
        actionRef={ref}
        searchSelectMaps={{
          status: [
            {
              label: translate('web.common.all'),
              value: null,
            },
            {
              label: translate('web.common.youxiao'),
              value: 1,
            },
            {
              label: translate('web.common.wuxiao'),
              value: 0,
            },
          ],
        }}
        searchButtons={[
          {
            key: 'add',
            children: intl.formatMessage({ id: 'authConfig.createNew' }),
            type: 'primary',
            icon: <PlusOutlined />,
            onClick() {
              addItem()
            },
          },
        ]}
      />
    </PageHeaderWrapper>
  )
}

export default UserSystem
