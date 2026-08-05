import React, { useRef, useState } from 'react'
import Table from '../../components/table'
import { getIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { ColumnType } from 'antd/lib/table/interface'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { formatTimeString } from '@/utils'
import { Row, Col, Space, Button, Tag, Badge, Popconfirm, Typography, message, Modal } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import {
  INQUIRY_EXTERNALSTATE_COLOR,
  INQUIRY_INTERNALSTATE_COLOR,
  OFFTER_EXTERNALSTATE_TYPE,
  OFFTER_INTERNALSTATE_TYPE,
  BUTTONAUTHORITY,
} from '../../constants'
import {
  getPurchasePurchaseInquiryAddList,
  postPurchasePurchaseInquiryDelete,
  postPurchasePurchaseInquiryDeleteBatch,
  postPurchasePurchaseInquirySubmit,
  postPurchasePurchaseInquirySubmitBatch,
} from '@apps/apis'
import { getCommodityWebMemberPurchaseWebFindCurrMemberPurchase } from '@apps/apis'
import { AuthButton } from '@apps/components'
const { Text } = Typography
const intl = getIntl()
const AddInquiry = () => {
  const ref = useRef<any>({})
  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'table.purchase.purchaseInquiryNo' }),
      key: 'purchaseInquiryNo',
      dataIndex: 'purchaseInquiryNo',
      render: (text: any, record: any) => (
        <Space direction="vertical">
          <EyeAuthButton
            url={`/procurementAbility/purchaseInquiry/addInquiry/detail?id=${record.id}&number=${record.purchaseInquiryNo}`}
          >
            {text}
          </EyeAuthButton>
          <Text type="secondary">{record.details}</Text>
        </Space>
      ),
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.deliveryTime' }),
      key: 'deliveryTime',
      dataIndex: 'deliveryTime',
      render: (text: any, record: any) => formatTimeString(text, 'YYYY-MM-DD'),
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.quotedPriceTime' }),
      key: 'offerEndTime',
      dataIndex: 'offerEndTime',
      render: (text: any, record: any) => formatTimeString(text),
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.dementCreateTime' }),
      key: 'createTime',
      dataIndex: 'createTime',
      render: (text: any, record: any) => formatTimeString(text),
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.externalStatus' }),
      key: 'externalState',
      dataIndex: 'externalState',
      render: (text: any, record: any) => (
        <Tag color={INQUIRY_EXTERNALSTATE_COLOR[text]}>{record.externalStateName}</Tag>
      ),
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.innerStatus' }),
      key: 'interiorState',
      dataIndex: 'interiorState',
      render: (text: any, record: any) => (
        <Badge status={INQUIRY_INTERNALSTATE_COLOR[text]} text={record.interiorStateName} />
      ),
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.option' }),
      key: 'operate',
      dataIndex: 'operate',
      render: (text: any, record: any) => (
        <>
          {record.button === BUTTONAUTHORITY.ONE && (
            <AuthButton type="custom" code="submit">
              <Popconfirm
                title={intl.formatMessage({ id: 'table.purchase.popconfirm' })}
                okText={intl.formatMessage({ id: 'table.purchase.okText' })}
                cancelText={intl.formatMessage({ id: 'table.purchase.cancelText' })}
                onConfirm={() => fetchSubmitBatch(record.id)}
              >
                <Button type="link">{intl.formatMessage({ id: 'table.purchase.submit' })}</Button>
              </Popconfirm>
            </AuthButton>
          )}
          {(record.button === BUTTONAUTHORITY.ONE || record.button === BUTTONAUTHORITY.TWO) && (
            <AuthButton type="edit" code="edit">
              <Button
                type="link"
                onClick={() =>
                  history.push(
                    `/procurementAbility/purchaseInquiry/addInquiry/edit?id=${record.id}&number=${record.purchaseInquiryNo}`,
                  )
                }
              >
                {intl.formatMessage({ id: 'table.purchase.eidt' })}
              </Button>
            </AuthButton>
          )}
          {record.button === BUTTONAUTHORITY.ONE && (
            <AuthButton type="custom" code="del">
              <Popconfirm
                title={intl.formatMessage({ id: 'table.purchase.popconfirm2' })}
                okText={intl.formatMessage({ id: 'table.purchase.okText' })}
                cancelText={intl.formatMessage({ id: 'table.purchase.cancelText' })}
                onConfirm={() => fetchDeleteBatch(record.id)}
              >
                <Button type="link">{intl.formatMessage({ id: 'table.purchase.delete' })}</Button>
              </Popconfirm>
            </AuthButton>
          )}
        </>
      ),
    },
  ]
  const [rowkeys, setRowKeys] = useState<Array<number>>([])

  /** 批量审核 */
  const fetchSubmitBatch = async (id?: number) => {
    let res = null
    if (id) {
      res = await postPurchasePurchaseInquirySubmit({ id: Number(id) })
    } else {
      res = await postPurchasePurchaseInquirySubmitBatch({ ids: rowkeys })
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
    let res = null
    if (id) {
      res = await postPurchasePurchaseInquiryDelete({ id })
    } else {
      res = await postPurchasePurchaseInquiryDeleteBatch({ ids: rowkeys })
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
      history.push('/procurementAbility/purchaseInquiry/addInquiry/add')
    })
  }

  return (
    <Table
      selectedRow
      reload={ref}
      schemaType="INQUIRYWAITORDER_SCHEMA"
      columns={columns}
      effects="purchaseInquiryNo"
      fetch={getPurchasePurchaseInquiryAddList}
      fetchRowkeys={(e) => setRowKeys(e)}
      controllerBtns={
        <Row>
          <Col span={24}>
            <Space direction="horizontal" size={16}>
              <AuthButton type="custom" code="add">
                <Button onClick={() => addFn()} type="primary" icon={<PlusOutlined />}>
                  {intl.formatMessage({ id: 'table.purchase.added' })}
                </Button>
              </AuthButton>

              <AuthButton type="custom" code="batchsubmit">
                <Button onClick={() => fetchSubmitBatch()} disabled={rowkeys.length === 0}>
                  {intl.formatMessage({ id: 'table.purchase.submitBatch' })}
                </Button>
              </AuthButton>

              <AuthButton type="custom" code="batchdel">
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
export default AddInquiry
