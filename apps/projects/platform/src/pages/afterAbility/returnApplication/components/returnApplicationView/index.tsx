import {
  DetailAuthButton,
  EyeAuthButton,
  AuthButton,
  useTableRef,
  PageHeaderWrapper,
  StandardFormTable,
} from '@apps/components'
import { dateFormat } from '@apps/utils/src/format'
import { useWebIntl } from '@apps/locales'
import { Link } from '@linkseeks/router-core'
import StatusTag from '@/components/StatusTag'
import { Badge, Button, Modal, Popconfirm, message } from '@linkseeks/ui'
import { history } from '@linkseeks/router-manager'
import { ExclamationCircleOutlined } from '@ant-design/icons'

import { RETURN_OUTER_STATUS_TAG_MAP, RETURN_INNER_STATUS_BADGE_MAP } from '../../../constants'
import {
  RETURN_INNER_STATUS_NOT_ADDED_RETURN_DELIVERY,
  RETURN_INNER_STATUS_UNREVIEWED_RETURN_DELIVERY,
  RETURN_INNER_STATUS_CONSUMER_NOT_ADDED_LOGISTICS,
  RETURN_INNER_STATUS_CONSUMER_UNCONFIRMED_LOGISTICS,
  RETURN_INNER_STATUS_UNACCEPTED_LOGISTICS,
} from '@/constants/afterService'
import { RETURN_INNER_STATUS_UNCOMMITTED, RETURN_OUTER_STATUS_FAILED } from '@/constants/afterService'

import {
  postAftersalesReturnGoodsVerifyReturnDeliveryGoods,
  postAftersalesReturnGoodsSubmit,
  postAftersalesReturnGoodsDelete,
  postAftersalesReturnGoodsStopReturnGoods,
} from '@apps/apis'
import { useState } from 'react'
import { Form, Input } from 'antd'

interface IProps {
  request: (params: any) => void
  rowKey?: string
  searchButtons?: any[]
  pageType:
    | 'returnPrAddDeliver'
    | 'returnPrAddLogistics'
    | 'returnPrSubmit'
    | 'returnPrConfirmBack'
    | 'returnPrConfirmFinish'
    | 'returnPrConfirmResult'
    | 'returnPrDeliver'
}

const { confirm } = Modal

const ReturnApplicationView = (props: IProps) => {
  const translate = useWebIntl()
  const tableRef = useTableRef()
  const { request, pageType, searchButtons } = props
  const [revocationVisible, setRevocationVisible] = useState<boolean>(false)
  const [currentRecord, setCurrentRecord] = useState<any>()
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const [form] = Form.useForm()

  const handleVerify = (record) => {
    confirm({
      title: translate('web.resource.afterAbility.querenshenhecaozuo'),
      icon: <ExclamationCircleOutlined />,
      content: translate('web.resource.afterAbility.returnPrAddDeliverVerifyContent', {
        returnDeliveryNo: record.returnDeliveryNo,
      }),
      onOk() {
        return new Promise((resolve, reject) => {
          postAftersalesReturnGoodsVerifyReturnDeliveryGoods({
            id: record.returnId,
          })
            .then((res) => {
              if (res.code === 1000) {
                tableRef.current.reload()
              }
              resolve(res)
            })
            .catch((err) => {
              reject(err)
            })
        })
      },
    })
  }
  const handleSubmit = (record) => {
    const msg = message.loading({
      content: translate('web.resource.afterAbility.zhengzaitijiao'),
      duration: 0,
    })
    postAftersalesReturnGoodsSubmit({
      id: record.returnId,
    })
      .then((res) => {
        if (res.code === 1000) {
          tableRef.current.reload()
        }
      })
      .finally(() => {
        msg()
      })
  }

  const handleDelete = (record) => {
    setCurrentRecord(record)
    setRevocationVisible(true)
  }

  let columns: any[] = [
    {
      title: translate('web.resource.member.shenqingdanhao'),
      dataIndex: 'applyNo',
      key: 'applyNo',
      render: (text, record) => {
        const applyUrlMap = new Map([
          ['returnPrAddDeliver', `/afterAbility/returnApplication/returnPrAddDeliver/detail?id=${record.returnId}`],
          ['returnPrAddLogistics', `/afterAbility/returnApplication/returnPrAddLogistics/detail?id=${record.returnId}`],
          ['returnPrSubmit', `/afterAbility/returnApplication/returnPrSubmit/detail?id=${record.returnId}`],
          ['returnPrConfirmBack', `/afterAbility/returnApplication/returnPrConfirmBack/detail?id=${record.returnId}`],
          [
            'returnPrConfirmFinish',
            `/afterAbility/returnApplication/returnPrConfirmFinish/detail?id=${record.returnId}`,
          ],
          [
            'returnPrConfirmResult',
            `/afterAbility/returnApplication/returnPrConfirmResult/detail?id=${record.returnId}`,
          ],
          ['returnPrDeliver', `/afterAbility/returnApplication/returnPrDeliver/detail?id=${record.returnId}`],
        ])
        return (
          <DetailAuthButton>
            <EyeAuthButton url={applyUrlMap.get(pageType)}>{text}</EyeAuthButton>
          </DetailAuthButton>
        )
      },
      searchField: {
        type: 'Input',
        main: true,
      },
    },
    {
      title: translate('web.resource.afterAbility.shenqingzhaiyao'),
      dataIndex: 'applyAbstract',
      key: 'applyAbstract',
      ellipsis: true,
      searchField: 'Input',
    },
    {
      title: translate('web.resource.afterAbility.supplierName'),
      dataIndex: 'supplierName',
      key: 'supplierName',
      searchField: 'Input',
    },
    {
      title: translate('web.resource.afterAbility.tuikuanjine'),
      dataIndex: 'refundAmount',
      key: 'refundAmount',
    },
    {
      title: translate('web.resource.afterAbility.applyTime'),
      dataIndex: 'applyTime',
      key: 'applyTime',
      searchField: {
        type: 'DateSelect',
      },
    },
  ]
  if (['returnPrAddDeliver', 'returnPrAddLogistics', 'returnPrConfirmBack', 'returnPrDeliver'].indexOf(pageType) > -1) {
    columns = columns.concat([
      {
        title: translate('web.resource.afterAbility.returnBatch'),
        dataIndex: 'returnBatch',
        key: 'returnBatch',
      },
      {
        title: translate('web.resource.afterAbility.returnDeliveryNo'),
        dataIndex: 'returnDeliveryNo',
        key: 'returnDeliveryNo',
        render: (text, record) => {
          return (
            <Link to={`/afterAbility/returnApplication/returnPrAddDeliver/deliverDetail?id=${record.returnDeliveryId}`}>
              {text}
            </Link>
          )
        },
      },
    ])
  }
  if (['returnPrConfirmResult'].indexOf(pageType) > -1) {
    columns = columns.concat([
      {
        title: translate('web.resource.afterAbility.yituikuan'),
        dataIndex: 'refunded',
        key: 'refunded',
      },
    ])
  }
  columns = columns.concat([
    {
      title: translate('web.resource.afterAbility.outerStatus'),
      dataIndex: 'outerStatusName',
      key: 'outerStatusName',
      render: (text, record) => <StatusTag type={RETURN_OUTER_STATUS_TAG_MAP[record.outerStatus]} title={text} />,
    },
    {
      title: translate('web.resource.afterAbility.innerStatus'),
      dataIndex: 'innerStatusName',
      key: 'innerStatusName',
      render: (text, record) => (
        <Badge color={RETURN_INNER_STATUS_BADGE_MAP[record.innerStatus] || '#606266'} text={text} />
      ),
    },
    {
      title: translate('web.common.control'),
      dataIndex: 'option',
      width: 160,
      render: (text, record) => {
        const renderMap: Map<string, any> = new Map([
          [
            'returnPrAddDeliver',
            <>
              {record.innerStatus === RETURN_INNER_STATUS_NOT_ADDED_RETURN_DELIVERY && (
                <AuthButton type="add" code="add">
                  <Button
                    type="link"
                    onClick={() =>
                      history.push(`/afterAbility/returnApplication/returnPrAddDeliver/add?applyId=${record.returnId}`)
                    }
                  >
                    {translate('web.common.add')}
                  </Button>
                </AuthButton>
              )}
              {record.innerStatus === RETURN_INNER_STATUS_UNREVIEWED_RETURN_DELIVERY && (
                <AuthButton type="custom" code="verify">
                  <Button type="link" onClick={() => handleVerify(record)}>
                    {translate('web.common.approved')}
                  </Button>
                </AuthButton>
              )}
            </>,
          ],
          [
            'returnPrAddLogistics',
            <>
              {record.innerStatus === RETURN_INNER_STATUS_CONSUMER_NOT_ADDED_LOGISTICS && (
                <AuthButton type="add" code="add">
                  <Button
                    type="link"
                    onClick={() =>
                      history.push(
                        `/logisticsAbility/logisticsBillSubmit/waitSbumitLogisticsBill/add?createType=${6}&id=${
                          record.returnId
                        }`,
                      )
                    }
                  >
                    {translate('web.common.add')}
                  </Button>
                </AuthButton>
              )}
              {record.innerStatus === RETURN_INNER_STATUS_CONSUMER_UNCONFIRMED_LOGISTICS && (
                <AuthButton type="custom" code="checkLogistics">
                  <Button
                    type="link"
                    onClick={() =>
                      history.push(
                        `/logisticsAbility/logisticsBillSubmit/logisticsBillQuery/detail?id=${record.returnLogisticsId}`,
                      )
                    }
                  >
                    {translate('web.resource.afterAbility.chakanwuliudan')}
                  </Button>
                </AuthButton>
              )}
              {record.innerStatus === RETURN_INNER_STATUS_UNACCEPTED_LOGISTICS && (
                <AuthButton type="edit" code="edit">
                  <Button
                    type="link"
                    onClick={() =>
                      history.push(
                        `/logisticsAbility/logisticsBillSubmit/waitSbumitLogisticsBill/edit?id=${record.returnLogisticsId}`,
                      )
                    }
                  >
                    {translate('web.common.edit')}
                  </Button>
                </AuthButton>
              )}
            </>,
          ],
          [
            'returnPrSubmit',
            <>
              {record.innerStatus === RETURN_INNER_STATUS_UNCOMMITTED && (
                <AuthButton type="custom" code="commit">
                  <Button type="link" onClick={() => handleSubmit(record)}>
                    {translate('web.common.submit')}
                  </Button>
                </AuthButton>
              )}
              {(record.innerStatus === RETURN_INNER_STATUS_UNCOMMITTED ||
                record.outerStatus === RETURN_OUTER_STATUS_FAILED) && (
                <AuthButton type="edit" code="edit">
                  <Button
                    type="link"
                    onClick={() =>
                      history.push(`/afterAbility/returnApplication/returnPrSubmit/edit?id=${record.returnId}`)
                    }
                  >
                    {translate('web.common.edit')}
                  </Button>
                </AuthButton>
              )}
              {(record.innerStatus === RETURN_INNER_STATUS_UNCOMMITTED ||
                record.outerStatus === RETURN_OUTER_STATUS_FAILED) && (
                <AuthButton type="custom" code="del">
                  <Button type="link" danger onClick={() => handleDelete(record)}>
                    {translate('web.resource.afterAbility.chexiao')}
                  </Button>
                </AuthButton>
              )}
            </>,
          ],
          [
            'returnPrConfirmBack',
            <>
              <AuthButton type="edit" code="edit">
                <Button
                  type="link"
                  onClick={() =>
                    history.push(`/afterAbility/returnApplication/returnPrConfirmBack/edit?id=${record.returnId}`)
                  }
                >
                  {translate('web.resource.afterAbility.querentuihuohuidan')}
                </Button>
              </AuthButton>
            </>,
          ],
          [
            'returnPrConfirmFinish',
            <>
              <AuthButton type="custom" code="edit">
                <Button
                  type="link"
                  onClick={() =>
                    history.push(`/afterAbility/returnApplication/returnPrConfirmFinish/edit?id=${record.returnId}`)
                  }
                >
                  {translate('web.resource.afterAbility.refundSubmitFinished')}
                </Button>
              </AuthButton>
            </>,
          ],
          [
            'returnPrConfirmResult',
            <>
              <AuthButton type="custom" code="edit">
                <Button
                  type="link"
                  onClick={() =>
                    history.push(`/afterAbility/returnApplication/returnPrConfirmResult/edit?id=${record.returnId}`)
                  }
                >
                  {translate('web.common.queren')}
                </Button>
              </AuthButton>
            </>,
          ],
          [
            'returnPrDeliver',
            <>
              <AuthButton type="custom" code="edit">
                <Button
                  type="link"
                  onClick={() =>
                    history.push(`/afterAbility/returnApplication/returnPrDeliver/edit?id=${record.returnId}`)
                  }
                >
                  {translate('web.resource.afterAbility.returnPrDeliverAllRefundDeliver')}
                </Button>
              </AuthButton>
            </>,
          ],
        ])
        return renderMap.get(pageType)
      },
    },
  ])

  let rowKey = props.rowKey || 'returnId'
  return (
    <PageHeaderWrapper>
      <StandardFormTable
        columns={columns}
        rowKey={rowKey}
        searchButtons={searchButtons}
        request={(params) => {
          const [startTime, endTime] = params?.applyTime?.split(',') || []
          if (startTime) {
            params.startTime = dateFormat(new Date(+startTime), 'YY-MM-DD HH:mm:ss')
          }
          if (endTime) {
            params.endTime = dateFormat(new Date(+endTime), 'YY-MM-DD HH:mm:ss')
          }
          delete params.applyTime
          return request(params)
        }}
        actionRef={tableRef}
      />
      <Modal
        open={revocationVisible}
        title={translate('web.resource.afterAbility.chexiaoshouhoushenqing')}
        confirmLoading={confirmLoading}
        onCancel={() => {
          setRevocationVisible(false)
          form.resetFields()
        }}
        onOk={() => {
          form.validateFields().then((values) => {
            setConfirmLoading(true)
            postAftersalesReturnGoodsStopReturnGoods({
              dataId: currentRecord?.returnId,
              remark: values?.remark,
            })
              .then((res) => {
                if (res.code === 1000) {
                  tableRef.current.reload()
                  setRevocationVisible(false)
                }
              })
              .finally(() => {
                setConfirmLoading(false)
              })
          })
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="remark"
            label={translate('web.resource.afterAbility.chexiaoliyou')}
            rules={[
              {
                required: true,
                message: translate('web.common.qingshuru'),
              },
            ]}
          >
            <Input.TextArea rows={3} maxLength={200} />
          </Form.Item>
        </Form>
      </Modal>
    </PageHeaderWrapper>
  )
}

export default ReturnApplicationView
