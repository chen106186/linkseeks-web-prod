import React, { ReactNode, useRef } from 'react'
import { history } from '@linkseeks/router-manager'
import { useLocation } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { Button, Popconfirm, Card, Dropdown, Menu, Modal, Badge } from 'antd'
import { ImageBox, PageHeaderWrapper, RecordColumns, StandardFormTable } from '@apps/components'
import { EyeAuthButton } from '@apps/components'
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  CaretDownOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import { formatTimeString } from '@/utils'
import { productStatusColor, productStatusLabel } from '../../commodity/products/constant'
import {
  GetProductBrandGetBrandListResponseDetail,
  getProductBrandGetBrandList,
  postProductBrandApplyCheckBrand,
  postProductBrandDeleteBrand,
  postProductBrandUpdateBrandEnable,
} from '@apps/apis'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton } from '@apps/components'
const { confirm } = Modal

const Trademark: React.FC<{}> = () => {
  const intl = useIntl()
  const ref = useRef<any>({})
  const { pathname } = useLocation()

  const fetchData = (params: any) => {
    const searchParams = {
      ...params,
    }
    const postData = {
      ...searchParams,
      name: searchParams?.name || '',
      status: searchParams?.status || 0,
    }
    return new Promise((resolve) => {
      getProductBrandGetBrandList(postData).then((res) => {
        const { data } = res
        resolve(data)
      })
    })
  }

  const columns: RecordColumns<GetProductBrandGetBrandListResponseDetail>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: intl.formatMessage({ id: 'trademark.addBrand.card.2.logoUrl', defaultMessage: '品牌LOGO' }),
      dataIndex: 'logoUrl',
      key: 'logoUrl',
      width: 100,
      render: (logoUrl) => <ImageBox width={48} height={48} src={logoUrl} preview />,
    },
    {
      title: intl.formatMessage({ id: 'trademark.columns.name' }),
      dataIndex: 'name',
      key: 'name',
      className: 'commonPickColor',
      searchField: {
        main: true,
        type: 'Input',
      },
      render: (text: any, record: any) => (
        <EyeAuthButton
          type={authUrl(pathname, 'detail') ? 'link' : 'button'}
          url={`/commodityAbility/trademark/trademarkApply/detail?id=${record.id}`}
        >
          {text}
        </EyeAuthButton>
      ),
    },
    {
      title: intl.formatMessage({ id: 'trademark.columns.sourceBrandName' }),
      dataIndex: 'sourceBrandName',
      key: 'sourceBrandName',
    },
    {
      title: intl.formatMessage({ id: 'trademark.columns.applyTime' }),
      dataIndex: 'applyTime',
      key: 'applyTime',
      render: (text: any) => text && formatTimeString(text),
    },
    {
      // trademarkApply.state
      title: intl.formatMessage({ id: 'trademark.columns.isEnable' }),
      dataIndex: 'isEnable',
      key: 'isEnable',
      render: (text: any, record: any) => {
        let component: ReactNode = null
        component = (
          <Popconfirm
            title={intl.formatMessage({ id: 'trademark.columns.isEnable.popconfirm.title' })}
            onConfirm={() => confirmUpdate(record)}
            okText={intl.formatMessage({ id: 'trademark.columns.isEnable.popconfirm.okText' })}
            cancelText={intl.formatMessage({ id: 'trademark.columns.isEnable.popconfirm.cancelText' })}
            disabled={record.status !== 4}
          >
            <Button
              disabled={record.status !== 4}
              type="link"
              style={record.isEnable ? { color: '#00A98F' } : { color: 'red' }}
            >
              {record.isEnable ? (
                <>
                  {intl.formatMessage({ id: 'trademark.columns.isEnable.button.1' })} <PlayCircleOutlined />
                </>
              ) : (
                <>
                  {intl.formatMessage({ id: 'trademark.columns.isEnable.button.2' })} <PauseCircleOutlined />
                </>
              )}
            </Button>
          </Popconfirm>
        )
        return component
      },
    },
    {
      title: intl.formatMessage({ id: 'trademark.columns.status' }),
      dataIndex: 'status',
      key: 'status',
      searchField: {
        type: 'Select',
        valueEnum: [
          { label: intl.formatMessage({ id: 'trademark.schema.status.1', defaultMessage: '全部' }), value: 0 },
          { label: intl.formatMessage({ id: 'trademark.schema.status.2', defaultMessage: '待提交审核' }), value: 1 },
          { label: intl.formatMessage({ id: 'trademark.schema.status.3', defaultMessage: '待审核' }), value: 2 },
          { label: intl.formatMessage({ id: 'trademark.schema.status.4', defaultMessage: '审核不通过' }), value: 3 },
          { label: intl.formatMessage({ id: 'trademark.schema.status.5', defaultMessage: '审核通过' }), value: 4 },
        ],
      },
      render: (t) => <Badge color={productStatusColor[t]} text={productStatusLabel[t]} />,
    },
    {
      title: intl.formatMessage({ id: 'trademark.columns.option' }),
      dataIndex: 'option',
      key: 'option',
      fixed: 'right',
      render: (text: any, record: any) => {
        // 1待提交审核 2待审核 3审核不通过 4审核通过
        return record.status !== 2 ? (
          <>
            {record.status === 1 ? (
              <>
                <AuthButton type="custom" code="examine">
                  <Button type="link" onClick={() => handleApplyCheck(record)}>
                    {intl.formatMessage({ id: 'trademark.columns.option.button.1' })}
                  </Button>
                </AuthButton>

                <Dropdown
                  overlay={
                    <Menu>
                      <Menu.Item>
                        <EditAuthButton>
                          <Button
                            type="link"
                            onClick={() =>
                              history.push(`/commodityAbility/trademark/trademarkApply/edit?id=${record.id}`)
                            }
                          >
                            {intl.formatMessage({ id: 'trademark.columns.option.button.2' })}
                          </Button>
                        </EditAuthButton>
                      </Menu.Item>
                      <Menu.Item>
                        <AuthButton type="custom" code="delete">
                          <Button onClick={() => handelDelete(record)} type="link">
                            {intl.formatMessage({ id: 'trademark.columns.option.button.3' })}
                          </Button>
                        </AuthButton>
                      </Menu.Item>
                    </Menu>
                  }
                >
                  <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                    {intl.formatMessage({ id: 'trademark.columns.option.button.4' })} <CaretDownOutlined />
                  </a>
                </Dropdown>
              </>
            ) : (
              // 3 / 4
              <>
                {record.isEnable && (
                  <>
                    <EditAuthButton>
                      <Button
                        type="link"
                        onClick={() => history.push(`/commodityAbility/trademark/trademarkApply/edit?id=${record.id}`)}
                      >
                        {intl.formatMessage({ id: 'trademark.columns.option.button.2' })}
                      </Button>
                    </EditAuthButton>
                  </>
                )}
                {record.status === 3 && (
                  <AuthButton type="custom" code="delete">
                    <Button onClick={() => handelDelete(record)} type="link">
                      {intl.formatMessage({ id: 'trademark.columns.option.button.3' })}
                    </Button>
                  </AuthButton>
                )}
              </>
            )}
          </>
        ) : (
          ''
        )
      },
    },
  ]

  const confirmUpdate = (record: any) => {
    postProductBrandUpdateBrandEnable({ id: record.id, isEnable: !record.isEnable }).then((res) => {
      ref.current.reload()
    })
  }

  const handelDelete = (record: any) => {
    confirm({
      title: intl.formatMessage({ id: 'trademark.handelDelete.title' }),
      icon: <ExclamationCircleOutlined />,
      okText: intl.formatMessage({ id: 'trademark.handelDelete.okText' }),
      okType: 'danger',
      cancelText: intl.formatMessage({ id: 'trademark.handelDelete.cancelText' }),
      onOk() {
        postProductBrandDeleteBrand({ id: record.id }).then((res) => {
          if (res.code === 1000) ref.current.reload()
        })
      },
    })
  }

  const handleApplyCheck = (record: any) => {
    postProductBrandApplyCheckBrand({ id: record.id }).then((res) => {
      ref.current.reload()
    })
  }

  return (
    <PageHeaderWrapper>
      <StandardFormTable
        actionRef={ref}
        columns={columns}
        request={(params: any) => fetchData(params)}
        autoScrollX
        searchButtons={[
          {
            children: intl.formatMessage({ id: 'trademark.actions', defaultMessage: '新建' }),
            type: 'primary',
            key: 'add',
            icon: 'add',
            onClick() {
              history.push('/commodityAbility/trademark/trademarkApply/add')
            },
          },
        ]}
      />
    </PageHeaderWrapper>
  )
}

export default Trademark
