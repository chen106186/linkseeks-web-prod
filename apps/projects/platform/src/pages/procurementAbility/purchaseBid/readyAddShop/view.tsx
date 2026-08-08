import React, { useRef, useState, useEffect, useCallback } from 'react'
import { getIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { ColumnType } from 'antd/lib/table/interface'
import { Row, Col, Space, Button, Typography, Popconfirm, Badge, Menu, Dropdown, message, Modal } from 'antd'
import { PlusOutlined, PlayCircleOutlined, PoweroffOutlined, CaretDownOutlined } from '@ant-design/icons'

import { formatTimeString } from '@/utils'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import StatusTag from '@/components/StatusTag'
import {
  postPurchaseBiddingExamine,
  postPurchaseBiddingExamineBatch,
  postPurchaseBiddingDelete,
  postPurchaseBiddingDeleteBatch,
  getPurchaseBiddingAwaitNewList,
  getPurchaseBiddingAwaitShopNewList,
} from '@apps/apis'
import { getCommodityWebMemberPurchaseWebFindCurrMemberPurchase } from '@apps/apis'

import Table from '../../components/table'

import { BID_EXTERNALSTATE_COLOR, BID_INTERNALSTATE_COLOR, PurchaseBidButtons } from '../../constants/purchaseBid'
import { AuthButton } from '@apps/components'
import { customAuthUrl as AuthUrl } from '@apps/domains'

const intl = getIntl()

const { Text } = Typography

const ReadyAdd = () => {
  /** 多选操作 */
  const ref = useRef<any>({})
  const [rowkeys, setRowKeys] = useState<Array<number>>([])
  const [addBtnLoading, setAddBtnLoading] = useState<boolean>(false)

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'table.purchase.biddingNo' }),
      key: 'biddingNo',
      dataIndex: 'biddingNo',
      render: (text: any, record: any) => (
        <Space direction="vertical" style={{ width: 300 }}>
          <DetailAuthButton>
            <EyeAuthButton
              class
              type={AuthUrl('detail') ? 'link' : 'button'}
              url={`/procurementAbility/purchaseBid/readyAddShop/detail?id=${record.id}&number=${text}&button=${record.button}`}
            >
              {text}
            </EyeAuthButton>
          </DetailAuthButton>
          <Text type="secondary">{record.details}</Text>
        </Space>
      ),
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.biddingStartTime' }),
      key: 'biddingStartTime',
      dataIndex: 'biddingStartTime',
      render: (text: any, record: any) => (
        <>
          <div>
            <PlayCircleOutlined />
            &nbsp;{formatTimeString(record.biddingStartTime)}
          </div>
          <div>
            <PoweroffOutlined />
            &nbsp;{formatTimeString(record.biddingEndTime)}
          </div>
        </>
      ),
      width: 180,
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.dementCreateTime' }),
      key: 'createTime',
      dataIndex: 'createTime',
      render: (text: any, record: any) => formatTimeString(text),
      width: 180,
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.externalStatus' }),
      key: 'externalState',
      dataIndex: 'externalState',
      render: (text: any, record: any) => (
        <StatusTag type={BID_EXTERNALSTATE_COLOR(text)} title={record.externalStateName} />
      ),
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.innerStatus' }),
      key: 'interiorState',
      dataIndex: 'interiorState',
      render: (text: any, record: any) => (
        <Badge status={BID_INTERNALSTATE_COLOR(text)} text={record.interiorStateName} />
      ),
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.operate' }),
      key: 'operate',
      dataIndex: 'operate',
      render: (text: any, record: any) => (
        <>
          {record?.buttons?.indexOf(PurchaseBidButtons.SUBMIT_REVIEW) >= 0 && (
            <AuthButton type="custom" code="submit">
              <Popconfirm
                title={intl.formatMessage({ id: 'table.purchase.popconfirm1' })}
                okText={intl.formatMessage({ id: 'table.purchase.okText' })}
                cancelText={intl.formatMessage({ id: 'table.purchase.cancelText' })}
                onConfirm={() => fetchSubmitBatch(record.id)}
              >
                <Button type="link">{intl.formatMessage({ id: 'table.purchase.submit' })}</Button>
              </Popconfirm>
            </AuthButton>
          )}
          {/* <Dropdown overlay={() => (
          <Menu onClick={(e) => handleMenuClick(e, record)}>
            <AuthButton code='readyAdd.edit'>
              <Menu.Item key="1">{intl.formatMessage({ id: 'detail.purchase.edit' })}</Menu.Item>
            </AuthButton>
            <AuthButton code='readyAdd.del'>
              <Menu.Item key="2" disabled={!(record.button === 1)}>{intl.formatMessage({ id: 'table.purchase.delete' })}</Menu.Item>
            </AuthButton>
          </Menu>
        )}>
          <AuthButton code='readyAdd.more'>
            <Button type='link'>{intl.formatMessage({ id: 'table.purchase.more' })}<CaretDownOutlined /></Button>
          </AuthButton>
        </Dropdown> */}
          {/* 有点问题先注释上面 */}
          <Dropdown
            overlay={
              <Menu onClick={(e) => handleMenuClick(e, record)}>
                {/* <AuthButton code='readyAdd.edit' key="1"> */}
                {AuthUrl('edit') && record?.buttons?.indexOf(PurchaseBidButtons.UPDATE) >= 0 && (
                  <Menu.Item key="1">{intl.formatMessage({ id: 'detail.purchase.edit' })}</Menu.Item>
                )}
                {/* </AuthButton> */}
                {/* <AuthButton code='readyAdd.del' key="2"> */}
                {AuthUrl('del') && record?.buttons?.indexOf(PurchaseBidButtons.DELETE) >= 0 && (
                  <Menu.Item key="2" disabled={!(record.button === 1)}>
                    {intl.formatMessage({ id: 'table.purchase.delete' })}
                  </Menu.Item>
                )}
                {/* </AuthButton> */}
              </Menu>
            }
          >
            <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
              {intl.formatMessage({ id: 'table.purchase.more' })} <CaretDownOutlined />
            </a>
          </Dropdown>
        </>
      ),
    },
  ]

  const handleMenuClick = (e: any, record: any) => {
    if (e.key === '1') {
      history.push(`/procurementAbility/purchaseBid/readyAddShop/edit?id=${record.id}&number=${record.biddingNo}`)
    } else {
      fetchDeleteBatch(record.id)
    }
  }

  /** 批量审核 */
  const fetchSubmitBatch = async (id?: number) => {
    let res: any = null
    if (id) {
      res = await postPurchaseBiddingExamine({ id })
    } else {
      res = await postPurchaseBiddingExamineBatch({ ids: rowkeys })
    }
    if (res.code === 1000) {
      ref.current.reloadCurrent()
      setRowKeys([])
    }
  }

  /**
   * 删除或批量删除
   * @type: 1: 单个删除, 2: 批量删除
   * */
  const fetchDeleteBatch = async (id?: number) => {
    let res: any = null
    if (id) {
      res = await postPurchaseBiddingDelete({ id })
    } else {
      res = await postPurchaseBiddingDeleteBatch({ ids: rowkeys })
    }
    if (res.code === 1000) {
      ref.current.reloadCurrent()
      setRowKeys([])
    }
  }

  const addFn = async () => {
    await getCommodityWebMemberPurchaseWebFindCurrMemberPurchase().then((res) => {
      if (res.code !== 1000) {
        message.error(intl.formatMessage({ id: `${res.code}` }))
        return
      }
      if (!res.data) {
        Modal.warning({
          title: intl.formatMessage({ id: 'table.purchase.moduleWarning' }),
          content: intl.formatMessage({ id: 'table.purchase.moduleWarning1' }),
          okText: intl.formatMessage({ id: 'detail.purchase.confirm' }),
          onOk: () => history.push('/procurementAbility/purchasDoor/purchasInfo'),
        })
        return
      }
      history.push('/procurementAbility/purchaseBid/readyAddShop/add')
    })
  }

  return (
    <Table
      selectedRow
      reload={ref}
      fetchRowkeys={(e) => setRowKeys(e)}
      schemaType="PURCHASEBIDREADYADD_SCHEMA"
      columns={columns}
      effects="biddingNo"
      fetch={getPurchaseBiddingAwaitShopNewList}
      extraParams={{
        shopType: 1,
      }}
      controllerBtns={
        <Row>
          <Col span={24}>
            <Space size={16}>
              <AuthButton type="add" code={'add'}>
                <Button
                  onClick={addFn}
                  type="primary"
                  icon={<PlusOutlined />}
                  disabled={addBtnLoading}
                  loading={addBtnLoading}
                >
                  {intl.formatMessage({ id: 'table.purchase.added' })}
                </Button>
              </AuthButton>
              <AuthButton type="custom" code={'batchshenhe'}>
                <Button onClick={() => fetchSubmitBatch()} disabled={rowkeys.length === 0}>
                  {intl.formatMessage({ id: 'table.purchase.submitBatch' })}
                </Button>
              </AuthButton>
              <AuthButton type="custom" code={'del'}>
                <Button onClick={() => fetchDeleteBatch()} disabled={rowkeys.length === 0}>
                  {intl.formatMessage({ id: 'table.purchase.deleteBatch' })}
                </Button>
              </AuthButton>
            </Space>
          </Col>
        </Row>
      }
    />
  )
}
export default ReadyAdd
