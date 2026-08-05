import React, { useState, useEffect } from 'react'
import { history } from '@linkseeks/router-manager'
import { useQuery } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { Button, Steps, Card, Space, Tooltip, Row, Col, Descriptions, Table, Badge } from '@linkseeks/ui'
import { PageHeaderWrapper } from '@apps/components'
import { QuestionCircleOutlined, FormOutlined } from '@ant-design/icons'
import type { ColumnType } from 'antd/lib/table/interface'
import ReturnEle from '@/components/ReturnEle'
import { formatTimeString } from '@/utils'
import styles from './index.less'
import { productStatusColor, productStatusLabel } from '../../commodity/products/constant'
import {
  getProductBrandGetBrand,
  getProductBrandGetBrandCheckRecord,
  GetProductBrandGetBrandResponse,
} from '@apps/apis'
import { postCommodityShopExistSelfShop } from '@apps/apis'
import { authService } from '@apps/services'

const { Step } = Steps

const viewBrand: React.FC<{}> = () => {
  const intl = useIntl()
  const BrandOpeartionLabel = [
    '',
    intl.formatMessage({ id: 'trademark.viewBrand.brandOpeartionLabel.1' }),
    intl.formatMessage({ id: 'trademark.viewBrand.brandOpeartionLabel.2' }),
    intl.formatMessage({ id: 'trademark.viewBrand.brandOpeartionLabel.3' }),
  ]

  const [brandInfo, setBrandInfo] = useState<GetProductBrandGetBrandResponse>({} as any)
  const [fixStep, setFixStep] = useState(0)
  const [recordData, setRecordData] = useState<any[]>([])
  const [hasSelfStore, setHasSelfStore] = useState<boolean>(false)
  const { roles, memberRoleId, memberId } = authService.getAuth() || {}

  const query = useQuery()

  useEffect(() => {
    const { id } = query
    if (id) {
      getProductBrandGetBrand({ id: id + '' }).then((res) => {
        if (res.code === 1000) {
          setBrandInfo(res.data)
          if (res.data.status === 1) setFixStep(0)
          else if (res.data.status === 2) setFixStep(1)
          else setFixStep(2)
        }
      })
      getProductBrandGetBrandCheckRecord({ brandId: id + '' }).then((res) => {
        if (res.code === 1000) setRecordData(res.data)
      })
    }

    postCommodityShopExistSelfShop({ memberId, memberRoleId }, { ctlType: 'none' }).then(({ code, data }) => {
      if (code === 1000) {
        setHasSelfStore(data)
      }
    })
  }, [])

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'trademark.viewBrand.columns.id' }),
      dataIndex: 'id',
      key: 'id',
      render: (_text, _record, index) => index + 1,
    },
    {
      title: intl.formatMessage({ id: 'trademark.viewBrand.columns.memberRoleName' }),
      dataIndex: 'memberRoleName',
      key: 'memberRoleName',
    },
    {
      title: intl.formatMessage({ id: 'trademark.viewBrand.columns.status' }),
      dataIndex: 'status',
      key: 'status',
      render: (t) => <Badge color={productStatusColor[t]} text={productStatusLabel[t]} />,
    },
    {
      title: intl.formatMessage({ id: 'trademark.viewBrand.columns.operation' }),
      dataIndex: 'operation',
      key: 'operation',
      render: (t) => BrandOpeartionLabel[t],
    },
    {
      title: intl.formatMessage({ id: 'trademark.viewBrand.columns.createTime' }),
      dataIndex: 'createTime',
      key: 'createTime',
      render: (text) => formatTimeString(text),
    },
    {
      title: intl.formatMessage({ id: 'trademark.viewBrand.columns.checkRemark' }),
      dataIndex: 'checkRemark',
      key: 'checkRemark',
    },
  ]

  const fixProveUrl = (proveInfo: string[]) => {
    if (proveInfo) {
      return proveInfo.map((item: string, index: number) => (
        <Col key={index} span={3} xxl={3} xl={4} lg={4}>
          <div className={styles.proveBox}>
            <img src={item} alt="" />
          </div>
        </Col>
      ))
    }
  }
  const tips = (
    <>
      {intl.formatMessage({ id: 'trademark.viewBrand.tips' })}
      <Tooltip title={intl.formatMessage({ id: 'trademark.viewBrand.tips.tooltip' })}>
        <span>
          &nbsp;
          <QuestionCircleOutlined />
        </span>
      </Tooltip>
    </>
  )

  return (
    <PageHeaderWrapper
      title={brandInfo?.name}
      titleIcon={brandInfo?.logoUrl}
      items={[
        {
          key: 'process',
          label: intl.formatMessage({
            id: 'trademark.viewBrand.card.1',
          }),
        },
        {
          key: 'basicInfo',
          label: intl.formatMessage({
            id: 'commodity.products.addProducts.tab.1',
          }),
        },
        {
          key: 'evidence',
          label: intl.formatMessage({ id: 'trademark.viewBrand.tips' }),
        },
        {
          key: 'history',
          label: intl.formatMessage({
            id: 'trademark.viewBrand.card.2',
          }),
        },
      ]}
      extra={[
        <Button
          icon={<FormOutlined />}
          key="1"
          type="primary"
          onClick={() => history.push(`/commodityAbility/trademark/trademarkApply/edit?id=${brandInfo.id}`)}
          disabled={!(brandInfo.status === 1 || brandInfo.status === 3)}
          style={{
            display: !(brandInfo.status === 1 || brandInfo.status === 3) ? 'none' : 'block',
          }}
        >
          {intl.formatMessage({ id: 'trademark.viewBrand.extra' })}
        </Button>,
      ]}
    >
      <Space direction="vertical" style={{ width: '100%' }} size={16}>
        <Card
          id="process"
          headStyle={{ borderBottom: 'none' }}
          title={intl.formatMessage({ id: 'trademark.viewBrand.card.1' })}
        >
          <Steps progressDot current={fixStep}>
            <Step
              title={intl.formatMessage({ id: 'trademark.viewBrand.card.1.step.1' })}
              description={roles?.filter((item) => item.roleId === memberRoleId)[0]?.roleName}
            />
            {hasSelfStore ? (
              <Step
                title={intl.formatMessage({ id: 'trademark.viewBrand.card.1.step.2' })}
                description={roles?.filter((item) => item.roleId === memberRoleId)[0]?.roleName}
              />
            ) : (
              <Step
                title={intl.formatMessage({ id: 'trademark.viewBrand.card.1.step.2' })}
                description={intl.formatMessage({
                  id: 'trademark.viewBrand.card.1.step.2.description',
                })}
              />
            )}
            <Step title={intl.formatMessage({ id: 'trademark.viewBrand.card.1.step.2' })} description="" />
          </Steps>
        </Card>
        <Card id="basicInfo" title={intl.formatMessage({ id: 'commodity.products.addProducts.tab.1' })}>
          <Descriptions column={2} colon={true} className="common-descriptions">
            <Descriptions.Item span={1} label="品牌Logo">
              <img
                src={brandInfo?.logoUrl}
                width="40px"
                height="40px"
                style={{
                  borderRadius: 8,
                  objectFit: 'contain',
                }}
              />
            </Descriptions.Item>
            <Descriptions.Item span={1} label="申请审核时间">
              {brandInfo.applyTime && formatTimeString(brandInfo.applyTime)}
            </Descriptions.Item>
            <Descriptions.Item span={1} label="品牌名称">
              {brandInfo?.name}
            </Descriptions.Item>
            <Descriptions.Item span={1} label="品牌状态">
              {brandInfo.isEnable ? '有效' : '无效'}
            </Descriptions.Item>
            <Descriptions.Item span={1} label="审核状态">
              <Badge color={productStatusColor[brandInfo?.status]} text={productStatusLabel[brandInfo?.status]} />
            </Descriptions.Item>
          </Descriptions>
        </Card>
        <Card id="evidence" headStyle={{ borderBottom: 'none' }} title={tips}>
          <Row gutter={24}>{fixProveUrl(brandInfo.provePic)}</Row>
        </Card>
        <Card
          id="history"
          headStyle={{ borderBottom: 'none' }}
          title={intl.formatMessage({ id: 'trademark.viewBrand.card.2' })}
        >
          <Table dataSource={recordData} columns={columns} pagination={false} />
        </Card>
      </Space>
    </PageHeaderWrapper>
  )
}

export default viewBrand
