import React, { useRef } from 'react'
import { getIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import Table from '../../components/table'
import { ColumnType } from 'antd/lib/table/interface'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { formatTimeString } from '@/utils'
import { Row, Col, Button, Badge, Space, Typography, Popconfirm } from 'antd'
import { OFFTER_INTERNALSTATE_COLOR } from '../../constants'
import { DEMANDPLAN_INTERNALSTATE_TYPE } from '../../constants/demandPlan'
import { PlayCircleOutlined, PlusOutlined, PoweroffOutlined } from '@ant-design/icons'
import { getPurchaseNeedPlanToBeAddList, postPurchaseNeedPlanDelete, postPurchaseNeedPlanSubmitExam } from '@apps/apis'
import { customAuthUrl as AuthUrl } from '@apps/domains'
import { AuthButton } from '@apps/components'
const { Text } = Typography

const DemandPlanAdded = () => {
  const intl = getIntl()
  const ref = useRef<any>({})
  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'table.purchase.purchasePlanNo' }),
      key: 'needPlanNo',
      dataIndex: 'needPlanNo',
      render: (text: any, record: any) => (
        <Space direction="vertical" size={0}>
          <DetailAuthButton>
            <EyeAuthButton
              type={AuthUrl('detail') ? 'link' : 'button'}
              url={`/procurementAbility/demandPlan/demandPlanAdded/detail?id=${record.id}`}
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
        <Space direction="vertical" size={0}>
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
      render: (text: any, record: any) => formatTimeString(text, 'YYYY-MM-DD'),
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
          {record.innerStatus === DEMANDPLAN_INTERNALSTATE_TYPE.WAITESUBMITAUDIT_TYPE && (
            <AuthButton type="custom" code="submit">
              <Popconfirm
                title={intl.formatMessage({ id: 'table.purchase.popconfirm' })}
                okText={intl.formatMessage({ id: 'table.purchase.okText' })}
                cancelText={intl.formatMessage({ id: 'table.purchase.cancelText' })}
                onConfirm={() => handleSubmit(record.id)}
              >
                <Button type="link">{intl.formatMessage({ id: 'table.purchase.submit' })}</Button>
              </Popconfirm>
            </AuthButton>
          )}

          <AuthButton type="custom" code="eidt">
            <Button
              type="link"
              onClick={() => history.push(`/procurementAbility/demandPlan/demandPlanAdded/edit?id=${record.id}`)}
            >
              {intl.formatMessage({ id: 'table.purchase.eidt' })}
            </Button>
          </AuthButton>

          {record.innerStatus === DEMANDPLAN_INTERNALSTATE_TYPE.WAITESUBMITAUDIT_TYPE && (
            <AuthButton type="custom" code="del">
              <Popconfirm
                title={intl.formatMessage({ id: 'table.purchase.popconfirm2' })}
                okText={intl.formatMessage({ id: 'table.purchase.okText' })}
                cancelText={intl.formatMessage({ id: 'table.purchase.cancelText' })}
                onConfirm={() => handleDelect(record.id)}
              >
                <Button type="link">{intl.formatMessage({ id: 'table.purchase.delete' })}</Button>
              </Popconfirm>
            </AuthButton>
          )}
        </>
      ),
    },
  ]

  const handleSubmit = async (id: number) => {
    await postPurchaseNeedPlanSubmitExam({ id })
      .then((res) => {
        if (res.code !== 1000) {
          return
        }
        ref.current.reloadCurrent()
      })
      .catch((error) => {
        console.warn(error)
      })
  }

  const handleDelect = async (id: number) => {
    await postPurchaseNeedPlanDelete({ id })
      .then((res) => {
        if (res.code !== 1000) {
          return
        }
        ref.current.reloadCurrent()
      })
      .catch((error) => {
        console.warn(error)
      })
  }

  return (
    <Table
      reload={ref}
      schemaType="DEMANDPLANADDED_SECHEMA"
      columns={columns}
      effects="needPlanNo"
      fetch={getPurchaseNeedPlanToBeAddList}
      controllerBtns={
        <Row>
          <Col span={6}>
            <AuthButton type="add" code="add">
              <Button
                onClick={() => history.push('/procurementAbility/demandPlan/demandPlanAdded/add')}
                type="primary"
                icon={<PlusOutlined />}
              >
                {intl.formatMessage({ id: 'table.purchase.added' })}
              </Button>
            </AuthButton>
          </Col>
        </Row>
      }
    />
  )
}
export default DemandPlanAdded
