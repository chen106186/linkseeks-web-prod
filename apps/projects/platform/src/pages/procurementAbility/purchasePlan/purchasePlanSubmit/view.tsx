import React, { useRef } from 'react'
import { getIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import Table from '../../components/table'
import { ColumnType } from 'antd/lib/table/interface'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { formatTimeString } from '@/utils'
import { Button, Badge, Space, Typography, Popconfirm } from 'antd'
import { OFFTER_INTERNALSTATE_COLOR } from '../../constants'
import { DEMANDPLAN_INTERNALSTATE_TYPE } from '../../constants/demandPlan'
import { PlayCircleOutlined, PoweroffOutlined } from '@ant-design/icons'
import { getPurchasePurchasePlanToBeSubmitExamList, postPurchasePurchasePlanDelete } from '@apps/apis'
import { customAuthUrl as AuthUrl } from '@apps/domains'
import { AuthButton } from '@apps/components'
const { Text } = Typography

const intl = getIntl()

const PurchasePlanSubmit = () => {
  const ref = useRef<any>({})
  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'table.purchase.purchasePlanNo1' }),
      key: 'purchasePlanNo',
      dataIndex: 'purchasePlanNo',
      render: (text: any, record: any) => (
        <Space direction="vertical">
          <DetailAuthButton>
            <EyeAuthButton
              type={AuthUrl('detail') ? 'link' : 'button'}
              url={`/procurementAbility/purchasePlan/purchasePlanSubmit/detail?id=${record.id}`}
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
          {record.innerStatus === DEMANDPLAN_INTERNALSTATE_TYPE.WAITESUBMITAUDIT_TYPE && (
            <AuthButton type="custom" code="submit">
              <Button
                type="link"
                onClick={() =>
                  history.push(`/procurementAbility/purchasePlan/purchasePlanSubmit/detail?id=${record.id}`)
                }
              >
                {intl.formatMessage({ id: 'table.purchase.submit' })}
              </Button>
            </AuthButton>
          )}
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
        </>
      ),
    },
  ]
  const handleDelect = async (id: number) => {
    await postPurchasePurchasePlanDelete({ id })
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
      schemaType="PURCHASEPLAN_SECHEMA"
      columns={columns}
      effects="purchasePlanNo"
      fetch={getPurchasePurchasePlanToBeSubmitExamList}
    />
  )
}
export default PurchasePlanSubmit
