import React, { useState, useRef } from 'react'
import { getIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import Table from '../../components/table'
import { ColumnType } from 'antd/lib/table/interface'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { formatTimeString } from '@/utils'
import { Row, Col, Button, Badge, Space, Typography, Modal, message } from 'antd'
import { OFFTER_INTERNALSTATE_COLOR } from '../../constants'
import { PlayCircleOutlined, PoweroffOutlined } from '@ant-design/icons'
import { isEmpty } from 'lodash'
import { getPurchaseNeedPlanToBeCollectList, postPurchaseNeedPlanCollect } from '@apps/apis'
import { AuthButton } from '@apps/components'
import { customAuthUrl as AuthUrl } from '@apps/domains'
const { Text } = Typography

const intl = getIntl()

const DemandPlanSummary = () => {
  const ref = useRef<any>({})
  const [idList, setIdList] = useState<Array<number>>([])
  const [visible, setVisible] = useState<boolean>(false)
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'table.purchase.purchasePlanNo' }),
      key: 'needPlanNo',
      dataIndex: 'needPlanNo',
      render: (text: any, record: any) => (
        <Space direction="vertical">
          <DetailAuthButton>
            <EyeAuthButton
              type={AuthUrl('detail') ? 'link' : 'button'}
              url={`/procurementAbility/purchasePlan/demandPlanSummary/detail?id=${record.id}`}
            >
              {text}
            </EyeAuthButton>
          </DetailAuthButton>
          <Text>{record.summary}</Text>
        </Space>
      ),
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.startTime' }),
      key: 'startTime',
      dataIndex: 'startTime',
      render: (text: any, record: any) => (
        <Space direction="vertical">
          <Text>
            <PlayCircleOutlined style={{ marginRight: 5 }} />
            {formatTimeString(text, 'YYYY-MM-DD')}
          </Text>
          <Text>
            <PoweroffOutlined style={{ marginRight: 5 }} />
            {formatTimeString(record.endTime, 'YYYY-MM-DD')}
          </Text>
        </Space>
      ),
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.department' }),
      key: 'department',
      dataIndex: 'department',
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.userName' }),
      key: 'userName',
      dataIndex: 'userName',
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.createTime' }),
      key: 'createTime',
      dataIndex: 'createTime',
      render: (text: any, record: any) => <Text>{formatTimeString(text, 'YYYY-MM-DD')}</Text>,
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.innerStatus' }),
      key: 'innerStatus',
      dataIndex: 'innerStatus',
      render: (text: any, record: any) => (
        <Badge status={OFFTER_INTERNALSTATE_COLOR[text]} text={record.innerStatusName} />
      ),
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.operate' }),
      key: 'operate',
      dataIndex: 'operate',
      render: (text: any, record: any) => (
        <>
          <AuthButton type="custom" code="billBack1">
            <Button
              type="link"
              onClick={() => history.push(`/procurementAbility/purchasePlan/demandPlanSummary/detail?id=${record.id}`)}
            >
              {intl.formatMessage({ id: 'detail.purchase.billBack1' })}
            </Button>
          </AuthButton>
        </>
      ),
    },
  ]

  const handleCancel = () => {
    setVisible(false)
  }

  const fetchSubmitBatch = async () => {
    if (isEmpty(idList)) {
      message.warning(intl.formatMessage({ id: 'detail.purchase.message42' }))
      return
    }
    setConfirmLoading(true)
    await postPurchaseNeedPlanCollect({ idList })
      .then((res) => {
        if (res.code !== 1000) {
          setConfirmLoading(false)
          return
        }
        ref.current.reloadCurrent()
        setIdList([])
        setVisible(false)
        setConfirmLoading(false)
      })
      .catch((error) => {
        console.warn(error)
      })
  }

  return (
    <>
      <Table
        selectedRow
        reload={ref}
        fetchRowkeys={(e) => setIdList(e)}
        schemaType="DEMANDPLANADDED_SECHEMA"
        columns={columns}
        effects="needPlanNo"
        fetch={getPurchaseNeedPlanToBeCollectList}
        controllerBtns={
          <Row>
            <Col span={6}>
              <AuthButton type="custom" code="batch">
                <Button disabled={idList.length === 0} onClick={() => setVisible(true)}>
                  {intl.formatMessage({ id: 'detail.purchase.modalTitle10' })}
                </Button>
              </AuthButton>
            </Col>
          </Row>
        }
      />
      <Modal
        title={intl.formatMessage({ id: 'detail.purchase.modalTitle10' })}
        visible={visible}
        onOk={fetchSubmitBatch}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p>{intl.formatMessage({ id: 'detail.purchase.tips8' })}</p>
      </Modal>
    </>
  )
}
export default DemandPlanSummary
