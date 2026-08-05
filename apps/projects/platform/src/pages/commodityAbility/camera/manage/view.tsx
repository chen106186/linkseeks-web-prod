import React from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { useIntl } from '@linkseeks/i18n'
import { Button } from '@linkseeks/ui'
import { useWebIntl } from '@apps/locales'
import { getCommodityWebCameraPage } from '@apps/apis'
import { PageHeaderWrapper, StandardFormTable, EyeAuthButton, StatusAuthButton, AuthButton } from '@apps/components'
import PopConfirmControl from '@/components/PopConfirmControl'

import useUserSystem from './services/useUserSystem'

const UserSystem: React.FC<{}> = () => {
  const intl = useIntl()
  const translate = useWebIntl()
  const { ref, addItem, deleteItem, updateItem, pathname } = useUserSystem()

  const columns = StandardFormTable.createColumns([
    {
      title: '摄像头名称',
      dataIndex: 'name',
      align: 'center',
      key: 'name',
      searchField: 'Input',
    },
    {
      title: '设备序列号',
      dataIndex: 'deviceSerial',
      align: 'center',
      key: 'deviceSerial',
    },
    {
      title: '通道号',
      dataIndex: 'channelNo',
      align: 'center',
      key: 'channelNo',
    },
    {
      title: '萤石云应用Key',
      dataIndex: 'appKey',
      align: 'center',
      key: 'appKey',
    },
    {
      title: '萤石云应用Secret',
      dataIndex: 'appSecret',
      align: 'center',
      key: 'appSecret',
    },
    {
      title: 'API网关地址',
      dataIndex: 'apiBase',
      align: 'center',
      key: 'apiBase',
    },
    {
      title: 'Token端点地址',
      dataIndex: 'tokenUrl',
      align: 'center',
      key: 'tokenUrl',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      align: 'center',
      key: 'remark',
    },
    {
      title: intl.formatMessage({ id: 'authConfig.option' }),
      dataIndex: 'option',
      key: 'option',
      align: 'center',
      fixed: 'right',
      render: (text, record) => {
        return (
          <>
            <Button type="link" onClick={() => updateItem(record)}>
              {intl.formatMessage({ id: 'authConfig.modify' })}
            </Button>
            <PopConfirmControl onConfirm={() => deleteItem(record)} visible={record.status === 0}>
              <Button type="link">{intl.formatMessage({ id: 'authConfig.delete' })}</Button>
            </PopConfirmControl>
          </>
        )
      },
    },
  ])

  return (
    <PageHeaderWrapper>
      <StandardFormTable
        columns={columns}
        autoScrollX
        request={getCommodityWebCameraPage}
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
