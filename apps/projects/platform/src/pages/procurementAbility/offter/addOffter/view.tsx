import React, { useRef, useState } from 'react'
import Table from '../../components/table'
import { getIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { ColumnType } from 'antd/lib/table/interface'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { formatTimeString } from '@/utils'
import { Row, Col, Space, Button, Typography, Popconfirm, Rate } from 'antd'
import { OFFTER_EXTERNALSTATE_COLOR, OFFTER_INTERNALSTATE_COLOR, BUTTONAUTHORITY } from '../../constants'
import { Badge, Tag } from 'antd'
import {
  getPurchaseQuotedPriceAddList,
  postPurchaseQuotedPriceDelete,
  postPurchaseQuotedPriceDeleteBatch,
  postPurchaseQuotedPriceSubmit,
  postPurchaseQuotedPriceSubmitBatch,
} from '@apps/apis'
import { customAuthUrl as AuthUrl } from '@apps/domains'
import { AuthButton } from '@apps/components'
const { Text } = Typography
const intl = getIntl()
const AddOffter = () => {
  console.log('待新增采购需求单')
  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'table.purchase.purchaseInquiryNoDtails' }),
      key: 'quotedPriceNo',
      dataIndex: 'quotedPriceNo',
      render: (text: any, record: any) => (
        <Space direction="vertical">
          <DetailAuthButton>
            <EyeAuthButton
              type={AuthUrl('detail') ? 'link' : 'button'}
              url={`/procurementAbility/offter/addOffter/detail?id=${record.id}&number=${record.quotedPriceNo}&turn=${record.turn}&preview=true`}
            >
              {text}
            </EyeAuthButton>
          </DetailAuthButton>
          <Text type="secondary">{record.details}</Text>
        </Space>
      ),
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.purchaseInquiryNoMember' }),
      key: 'purchaseInquiryNo',
      dataIndex: 'purchaseInquiryNo',
      render: (text: any, record: any) => (
        <Space direction="vertical">
          <DetailAuthButton>
            <EyeAuthButton
              type={AuthUrl('detail') ? 'link' : 'button'}
              url={`/procurementAbility/offter/offter/preview?id=${record.purchaseInquiryId}&number=${record.purchaseInquiryNo}`}
            >
              {text}
            </EyeAuthButton>
          </DetailAuthButton>
          <Text type="secondary">{record.memberName}</Text>
        </Space>
      ),
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
      title: intl.formatMessage({ id: 'table.purchase.turn' }),
      key: 'turn',
      dataIndex: 'turn',
      render: (text: any, record: any) => (
        <>
          <Rate
            count={3}
            character="▌"
            disabled
            className="rate_style"
            style={{
              fontSize: '12px',
              color: '#00A98F',
            }}
            value={text}
            allowHalf
          />
          <Text>{intl.formatMessage({ id: 'common.trun', data: text })}</Text>
        </>
      ),
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.externalStatus' }),
      key: 'externalState',
      dataIndex: 'externalState',
      render: (text: any, record: any) => (
        <Tag color={OFFTER_EXTERNALSTATE_COLOR[text]}>{record.externalStateName}</Tag>
      ),
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.innerStatus' }),
      key: 'interiorState',
      dataIndex: 'interiorState',
      render: (text: any, record: any) => (
        <Badge status={OFFTER_INTERNALSTATE_COLOR[text]} text={record.interiorStateName} />
      ),
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.operate' }),
      key: 'operate',
      dataIndex: 'operate',
      render: (text: any, record: any) => (
        <>
          {record.button === BUTTONAUTHORITY.ONE && (
            <AuthButton type="custom" code="shenhe">
              <Popconfirm
                title={intl.formatMessage({ id: 'table.purchase.popconfirm1' })}
                okText={intl.formatMessage({ id: 'detail.purchase.okText' })}
                cancelText={intl.formatMessage({ id: 'detail.purchase.cancelText' })}
                onConfirm={() => fetchSubmitBatch(record.id)}
              >
                <Button type="link">{intl.formatMessage({ id: 'detail.purchase.submit' })}</Button>
              </Popconfirm>
            </AuthButton>
          )}
          {(record.button === BUTTONAUTHORITY.ONE || record.button === BUTTONAUTHORITY.TWO) && (
            <AuthButton type="custom" code="edit">
              <Button
                onClick={() =>
                  history.push(
                    `/procurementAbility/offter/addOffter/edit?id=${record.id}&number=${record.quotedPriceNo}&turn=${record.turn}`,
                  )
                }
                type="link"
              >
                {intl.formatMessage({ id: 'table.purchase.eidt' })}
              </Button>
            </AuthButton>
          )}
          {record.button === BUTTONAUTHORITY.ONE && (
            <AuthButton type="custom" code="del">
              <Popconfirm
                title={intl.formatMessage({ id: 'table.purchase.popconfirm2' })}
                okText={intl.formatMessage({ id: 'detail.purchase.okText' })}
                cancelText={intl.formatMessage({ id: 'detail.purchase.cancelText' })}
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
  /** 多选操作 */
  const ref = useRef<any>({})
  const [rowkeys, setRowKeys] = useState<Array<number>>([])

  /** 批量审核 */
  const fetchSubmitBatch = async (id?: number) => {
    let res = null
    if (id) {
      res = await postPurchaseQuotedPriceSubmit({ id })
    } else {
      res = await postPurchaseQuotedPriceSubmitBatch({ ids: rowkeys })
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
      res = await postPurchaseQuotedPriceDelete({ id })
    } else {
      res = await postPurchaseQuotedPriceDeleteBatch({ ids: rowkeys })
    }
    if (res.code === 1000) {
      ref.current.reloadCurrent()
      setRowKeys([])
    }
  }

  return (
    <Table
      selectedRow
      reload={ref}
      fetchRowkeys={(e) => setRowKeys(e)}
      schemaType="OFFERSERAHAUDIT_SCHEMA"
      columns={columns}
      effects="quotedPriceNo"
      fetch={getPurchaseQuotedPriceAddList}
      controllerBtns={
        <Row>
          <Col span={24}>
            <Space size={16}>
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
export default AddOffter
