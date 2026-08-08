import React, { useRef } from 'react'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { Button, Card } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import StandardTable from '@/components/StandardTable'
import { ColumnType } from 'antd/lib/table/interface'
import { getMemberRolePage, postMemberRoleDelete, postMemberRoleUpdatestatus } from '@apps/apis'
import { StatusAuthButton } from '@apps/components'
import { EyeAuthButton } from '@apps/components'
import { PageHeaderWrapper } from '@apps/components'
import PopConfirmControl from '@/components/PopConfirmControl'

const fetchData = async (params) => {
  const { data } = await getMemberRolePage(params)
  return data
}

const MemberSystem: React.FC<{}> = () => {
  const intl = useIntl()
  const ref = useRef<any>({})

  const deleteItem = async (record) => {
    // 删除该项
    await postMemberRoleDelete({
      roleId: record.id,
    })
    ref.current.reloadCurrent()
  }

  const updateItem = (record) => {
    history.push(`/systemAbility/authConfig/memberSystem/edit?id=${record.id}&preview=0`)
  }

  const handleStatus = async (record) => {
    await postMemberRoleUpdatestatus({
      id: record.id,
      status: record.status === 1 ? 0 : 1,
    })

    ref.current.reloadCurrent()
  }

  const columns: ColumnType<any>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      align: 'center',
      key: 'id',
    },
    {
      title: intl.formatMessage({ id: 'authConfig.roleName' }),
      dataIndex: 'roleName',
      align: 'center',
      key: 'roleName',
      className: 'commonPickColor',
      render: (text, record) => (
        <EyeAuthButton url={`/systemAbility/authConfig/memberSystem/detail?id=${record.id}&preview=1`}>
          {text}
        </EyeAuthButton>
      ),
    },
    {
      title: intl.formatMessage({ id: 'authConfig.describe' }),
      align: 'center',
      dataIndex: 'remark',
      key: 'remark',
    },
    {
      title: intl.formatMessage({ id: 'authConfig.state' }),
      align: 'center',
      dataIndex: 'status',
      key: 'status',
      render: (text: any, record: any) =>
        record.roleName !== '超级管理员' && (
          <StatusAuthButton record={record} handleConfirm={() => handleStatus(record)} />
        ),
    },
    {
      title: intl.formatMessage({ id: 'authConfig.option' }),
      dataIndex: 'option',
      align: 'center',
      render: (text: any, record: any) => {
        return (
          record.roleName !== '超级管理员' && (
            <>
              <Button type="link" onClick={() => updateItem(record)}>
                {intl.formatMessage({ id: 'authConfig.modify' })}
              </Button>
              <PopConfirmControl onConfirm={() => deleteItem(record)} visible={record.status === 0}>
                <Button type="link">{intl.formatMessage({ id: 'authConfig.delete' })}</Button>
              </PopConfirmControl>
            </>
          )
        )
      },
    },
  ]

  const STATUS_ENUM = [
    {
      label: intl.formatMessage({ id: 'common.text.all' }),
      value: null,
    },
    {
      label: intl.formatMessage({ id: 'common.status.effective' }),
      value: 1,
    },
    {
      label: intl.formatMessage({ id: 'common.status.invalid' }),
      value: 0,
    },
  ]

  return (
    <PageHeaderWrapper>
      <Card className="common-wrapper">
        <StandardTable
          keepAlive={false}
          columns={columns}
          currentRef={ref}
          fetchTableData={(params: any) => fetchData(params)}
          formilyLayouts={{
            justify: 'space-between',
          }}
          formilyChilds={{
            layouts: {
              order: 2,
            },
            children: (
              <Button
                style={{ width: 140 }}
                icon={<PlusOutlined />}
                onClick={() => history.push('/systemAbility/authConfig/memberSystem/add')}
                type="primary"
              >
                {intl.formatMessage({ id: 'authConfig.createNew' })}
              </Button>
            ),
          }}
          formilyProps={{
            layouts: {
              order: 3,
            },
            ctx: {
              effects: ($) => {
                $('onFieldInputChange', 'status').subscribe(() => {
                  ref.current.reloadCurrent()
                })
              },
              schema: {
                type: 'object',
                properties: {
                  roleName: {
                    type: 'Search',
                    'x-component-props': {
                      placeholder: intl.formatMessage({ id: 'authConfig.inputRoleName' }),
                    },
                  },
                  status: {
                    type: 'string',
                    enum: STATUS_ENUM,
                    'x-component-props': {
                      placeholder: intl.formatMessage({ id: 'authConfig.chooseState' }),
                    },
                  },
                },
              },
            },
          }}
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default MemberSystem
