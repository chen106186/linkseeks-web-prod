import React, { useRef, useState, useEffect } from 'react'
import { history } from '@linkseeks/router-manager'
import { useLocation } from '@linkseeks/router-core'
import { useIntl, getIntl } from '@linkseeks/i18n'
import { Button, Popconfirm, Tooltip, message, Space } from 'antd'
import { PageHeaderWrapper, StatusAuthButton, StandardFormTable } from '@apps/components'
import { EyeAuthButton } from '@apps/components'
import { PlusOutlined } from '@ant-design/icons'
import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import Search from '@/components/NiceForm/components/Search'
import Submit from '@/components/NiceForm/components/Submit'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import ModalTable from '@/components/ModalTable'
import { clearModalParams } from '@/utils'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import {
  getProductCustomerGetCustomerAttributeList,
  getProductPlatformGetAttributeList,
  postProductCustomerDeleteCustomerAttribute,
  postProductCustomerSyncAttribute,
  postProductCustomerUpdateCustomerAttributeStatus,
} from '@apps/apis'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton } from '@apps/components'
import { getManageInitConfigEnableMultiTenancy } from '@apps/apis'
import { useWebIntl } from '@apps/locales'

const formProduct: ISchema = {
  type: 'object',
  properties: {
    groupName: {
      type: 'string',
      'x-component': 'ModalSearch',
      'x-component-props': {
        placeholder: getIntl().formatMessage({ id: 'classAndProperty.attribute.formProduct.groupName' }),
        align: 'flex-left',
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        rowStyle: {
          flexWrap: 'nowrap',
          style: {
            marginRight: 0,
          },
        },
        colStyle: {
          marginTop: 20,
        },
      },
      properties: {
        name: {
          type: 'string',
          'x-component-props': {
            placeholder: getIntl().formatMessage({ id: 'classAndProperty.attribute.formProduct.name' }),
            style: {
              width: 160,
            },
          },
        },
        submit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            children: getIntl().formatMessage({ id: 'classAndProperty.attribute.formProduct.submit' }),
          },
        },
      },
    },
  },
}

const Attribute: React.FC<{}> = () => {
  const intl = useIntl()
  const ref = StandardFormTable.useTableRef()
  const syncRef = useRef<any>({})
  const { pathname } = useLocation()
  const [syncVisible, setSyncVisible] = useState<boolean>(false)

  const [syncLoading, setSyncLoading] = useState<boolean>(false)
  const [rowSelection, rowSelectionCtl] = useRowSelectionTable({ customKey: 'id' })
  const [isMultiple, setIsMultiple] = useState<boolean>(true) // saas多租户

  const translate = useWebIntl()
  useEffect(() => {
    getMultiple()
  }, [])

  const getMultiple = () => {
    const siteId = import.meta.env.OUT_SITEID
    getManageInitConfigEnableMultiTenancy({ siteId }).then(({ code, data }) => {
      if (code === 1000) {
        setIsMultiple(data)
      }
    })
  }

  const fetchData = (params?: any) => {
    return new Promise((resolve, reject) => {
      getProductCustomerGetCustomerAttributeList({ ...params, name: params.name || '' }).then((res) => {
        resolve(res.data)
      })
    })
  }

  const fetchPlatformData = (params?: any) => {
    return new Promise((resolve, reject) => {
      getProductPlatformGetAttributeList({
        ...params,
        name: params.name || '',
        groupName: params.groupName || '',
        isEnable: true,
      }).then((res) => {
        resolve(res.data)
      })
    })
  }

  const columns = StandardFormTable.createColumns([
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: intl.formatMessage({ id: 'classAndProperty.attribute.columns.name' }),
      dataIndex: 'name',
      key: 'name',
      searchField: 'Input',
      render: (text, record) => (
        <EyeAuthButton
          type={authUrl(pathname, 'detail') ? 'link' : 'button'}
          url={`/commodityAbility/classAndProperty/attribute/detail?id=${record.id}&isSee=true&isMultiple=${isMultiple}`}
        >
          {text}
        </EyeAuthButton>
      ),
    },
    {
      title: intl.formatMessage({ id: 'classAndProperty.attribute.columns.groupName' }),
      dataIndex: 'groupName',
      key: 'groupName',
    },
    {
      title: translate('web.resource.commodity.shifouguigeshuxing'),
      dataIndex: 'isPrice',
      key: 'isPrice',
      searchField: {
        type: 'Select',
        placeholder: translate('web.resource.commodity.shuxingleixing'),
        name: 'isSkuAttribute',
        valueEnum: [
          {
            label: translate('web.resource.commodity.leimushuxing'),
            value: false,
          },
          {
            label: translate('web.resource.commodity.guigeshuxing'),
            value: true,
          },
        ],
      },
      render: (text) =>
        text
          ? intl.formatMessage({ id: 'classAndProperty.attribute.columns.isEmpty.1' })
          : intl.formatMessage({ id: 'classAndProperty.attribute.columns.isEmpty.2' }),
    },
    {
      title: intl.formatMessage({ id: 'classAndProperty.attribute.columns.type' }),
      dataIndex: 'type',
      key: 'type',
      render: (text: number) => {
        let txt = new Map([
          [1, intl.formatMessage({ id: 'classAndProperty.attribute.columns.type.1' })],
          [2, intl.formatMessage({ id: 'classAndProperty.attribute.columns.type.2' })],
          [3, intl.formatMessage({ id: 'classAndProperty.attribute.columns.type.3' })],
        ])
        return txt.get(text)
      },
    },
    {
      title: intl.formatMessage({ id: 'classAndProperty.attribute.columns.isEmpty' }),
      dataIndex: 'isMust',
      key: 'isMust',
      render: (text) =>
        text
          ? intl.formatMessage({ id: 'classAndProperty.attribute.columns.isEmpty.1' })
          : intl.formatMessage({ id: 'classAndProperty.attribute.columns.isEmpty.2' }),
    },
    {
      title: intl.formatMessage({ id: 'classAndProperty.attribute.columns.isEnable' }),
      dataIndex: 'isEnable',
      key: 'isEnable',
      render: (text: any, record: any) => (
        <StatusAuthButton
          fieldNames="isEnable"
          handleConfirm={() => confirm(record)}
          handleCancel={cancel}
          record={record}
        />
      ),
    },
    {
      title: intl.formatMessage({ id: 'classAndProperty.attribute.columns.option' }),
      dataIndex: 'option',
      key: 'options',
      render: (text, record) =>
        record.isEnable ? (
          ''
        ) : (
          <>
            <EditAuthButton>
              <Button type="link" onClick={() => handleEdit(record)}>
                {intl.formatMessage({ id: 'classAndProperty.attribute.columns.option.linke.1' })}
              </Button>
            </EditAuthButton>

            <AuthButton type="custom" code="delete">
              <Popconfirm
                title={intl.formatMessage({ id: 'classAndProperty.attribute.columns.option.title' })}
                onConfirm={() => clickDelete(record)}
                onCancel={cancel}
                okText={intl.formatMessage({ id: 'classAndProperty.attribute.columns.option.okText' })}
                cancelText={intl.formatMessage({ id: 'classAndProperty.attribute.columns.option.cancelText' })}
              >
                <Button type="link">
                  {intl.formatMessage({ id: 'classAndProperty.attribute.columns.option.linke.2' })}
                </Button>
              </Popconfirm>
            </AuthButton>
          </>
        ),
    },
  ])

  const confirm = (record) => {
    postProductCustomerUpdateCustomerAttributeStatus({ id: record.id, isEnable: !record.isEnable }).then((res) => {
      ref.current.reload()
    })
  }

  const clickDelete = (record) => {
    postProductCustomerDeleteCustomerAttribute({ id: record.id }).then((res) => {
      ref.current.reload()
    })
  }

  const handleEdit = (record) => {
    history.push(`/commodityAbility/classAndProperty/attribute/edit?id=${record.id}&isMultiple=${isMultiple}`)
  }

  const handleAdd = () => {
    history.push(`/commodityAbility/classAndProperty/attribute/add?isMultiple=${isMultiple}`)
  }

  const cancel = () => {
    console.log('cancel')
  }

  const syncAttribute = () => {
    setSyncVisible(true)
  }

  const handleAsyncOk = () => {
    setSyncLoading(true)
    if (rowSelectionCtl.selectedRowKeys.length) {
      postProductCustomerSyncAttribute({ idList: rowSelectionCtl.selectedRowKeys }).then((res) => {
        if (res.code === 1000) {
          ref.current.reload()
          rowSelectionCtl.setSelectedRowKeys([])
        }
        setSyncVisible(false)
        setSyncLoading(false)
        clearModalParams()
      })
    } else {
      message.error(intl.formatMessage({ id: 'classAndProperty.attribute.error' }))
      setSyncLoading(false)
    }
  }

  const handleAsyncCancel = () => {
    setSyncVisible(false)
    clearModalParams()
  }

  return (
    <PageHeaderWrapper>
      <StandardFormTable
        columns={columns}
        request={(params) => fetchData(params)}
        actionRef={ref}
        searchButtons={[
          {
            type: 'primary',
            key: 'add',
            icon: <PlusOutlined />,
            children: intl.formatMessage({ id: 'classAndProperty.attribute.actions.button.1' }),
            onClick: handleAdd,
          },
          {
            key: 'synchronization',
            children: intl.formatMessage({ id: 'classAndProperty.attribute.actions.button.2' }),
            toolTip: intl.formatMessage({ id: 'classAndProperty.attribute.actions.tooltip' }),
            onClick: syncAttribute,
          },
        ]}
      />

      <ModalTable
        modalTitle={intl.formatMessage({ id: 'classAndProperty.attribute.modalTable' })}
        confirm={handleAsyncOk}
        cancel={handleAsyncCancel}
        visible={syncVisible}
        columns={columns.slice(0, -2)}
        rowSelection={rowSelection}
        fetchTableData={(params) => fetchPlatformData(params)}
        formilyProps={{
          ctx: {
            schema: formProduct,
            components: { ModalSearch: Search, Submit },
            effects: ($, actions) => {
              actions.reset()
              useStateFilterSearchLinkageEffect($, actions, 'groupName', FORM_FILTER_PATH)
            },
          },
        }}
        resetModal={{
          destroyOnClose: true,
        }}
        tableProps={{
          rowKey: 'id',
        }}
      />
    </PageHeaderWrapper>
  )
}

export default Attribute
