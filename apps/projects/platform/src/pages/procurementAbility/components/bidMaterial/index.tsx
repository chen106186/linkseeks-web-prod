import React, { useContext, useEffect, useRef, useState } from 'react'
import { Table, Drawer, Button, Tabs, Row, Col } from 'antd'
import MellowCard from '@/components/MellowCard'
import { BidDetailContext } from '@/pages/procurement/_public/bid/context'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import style from './index.less'
import AnchorDrawer from '@/components/AnchorDrawer'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()

/**
 * 招标物料表格
 */

export interface BidMaterialProps {
  cardTitle?: string
}

const BidMaterial: React.FC<BidMaterialProps> = ({ cardTitle }) => {
  const bidDetailContext = useContext(BidDetailContext)
  const { data: _data, ctl, apiType } = bidDetailContext

  // 处理和投标有关的数据格式
  const data = apiType === 'callForBid' ? _data : _data.inviteTender

  const { materielList } = data

  const [visible, setVisible] = useState<boolean>(false)
  const [currentRow, setCurrentRow] = useState<any>()

  const dataList = currentRow?.code
    ? [
        {
          title: intl.formatMessage({ id: 'table.purchase.jibenxinxi' }),
          id: 'baseInfo',
          name: '',
          render: (data) => (
            <>
              <Row className={style['card-list']}>
                <Col span={4} className={style['card-list_title']}>
                  {intl.formatMessage({ id: 'detail.purchase.materialCode' })}:
                </Col>
                <Col>{currentRow['code']}</Col>
              </Row>
              <Row className={style['card-list']}>
                <Col span={4} className={style['card-list_title']}>
                  {intl.formatMessage({ id: 'detail.purchase.materialName' })}:
                </Col>
                <Col>{currentRow['name']}</Col>
              </Row>
              <Row className={style['card-list']}>
                <Col span={4} className={style['card-list_title']}>
                  {intl.formatMessage({ id: 'table.purchase.guigexinghao' })}:
                </Col>
                <Col>{currentRow['type']}</Col>
              </Row>
              <Row className={style['card-list']}>
                <Col span={4} className={style['card-list_title']}>
                  {intl.formatMessage({ id: 'table.purchase.pinlei' })}:
                </Col>
                <Col>{currentRow['categoryName']}</Col>
              </Row>
              <Row className={style['card-list']}>
                <Col span={4} className={style['card-list_title']}>
                  {intl.formatMessage({ id: 'table.purchase.pinpai' })}:
                </Col>
                <Col>{currentRow['brandName']}</Col>
              </Row>
            </>
          ),
        },
        // {
        //   title: '产地',
        //   name: '',
        //   id: 'productLocatoin',
        //   render: (data) => (<>
        //     <Row className={style['card-list']}>
        //       <Col span={4} className={style['card-list_title']}>产地:</Col>
        //       <Col>产地</Col>
        //     </Row>
        //     <Row className={style['card-list']}>
        //       <Col span={4} className={style['card-list_title']}>产地:</Col>
        //       <Col>产地</Col>
        //     </Row>
        //     <Row className={style['card-list']}>
        //       <Col span={4} className={style['card-list_title']}>产地:</Col>
        //       <Col>产地</Col>
        //     </Row>
        //     <Row className={style['card-list']}>
        //       <Col span={4} className={style['card-list_title']}>产地:</Col>
        //       <Col>产地</Col>
        //     </Row>
        //   </>)
        // },
        // {
        //   title: '外观尺寸',
        //   name: '',
        //   id: 'aspect',
        //   render: (data) => (<>
        //     <Row className={style['card-list']}>
        //       <Col span={4} className={style['card-list_title']}>外观尺寸:</Col>
        //       <Col>外观尺寸</Col>
        //     </Row>
        //     <Row className={style['card-list']}>
        //       <Col span={4} className={style['card-list_title']}>外观尺寸:</Col>
        //       <Col>外观尺寸</Col>
        //     </Row>
        //     <Row className={style['card-list']}>
        //       <Col span={4} className={style['card-list_title']}>外观尺寸:</Col>
        //       <Col>外观尺寸</Col>
        //     </Row>
        //     <Row className={style['card-list']}>
        //       <Col span={4} className={style['card-list_title']}>外观尺寸:</Col>
        //       <Col>外观尺寸</Col>
        //     </Row>
        //   </>)
        // },
        // {
        //   title: '工艺',
        //   name: '',
        //   id: 'technique',
        //   render: (data) => (<>
        //     <Row className={style['card-list']}>
        //       <Col span={4} className={style['card-list_title']}>工艺:</Col>
        //       <Col>工艺</Col>
        //     </Row>
        //     <Row className={style['card-list']}>
        //       <Col span={4} className={style['card-list_title']}>工艺:</Col>
        //       <Col>工艺</Col>
        //     </Row>
        //     <Row className={style['card-list']}>
        //       <Col span={4} className={style['card-list_title']}>工艺:</Col>
        //       <Col>工艺</Col>
        //     </Row>
        //     <Row className={style['card-list']}>
        //       <Col span={4} className={style['card-list_title']}>工艺:</Col>
        //       <Col>工艺</Col>
        //     </Row>
        //   </>)
        // },
        // {
        //   title: '特殊说明',
        //   name: '',
        //   id: 'specificText',
        //   render: (data) => (<>
        //     <Row className={style['card-list']}>
        //       <Col span={4} className={style['card-list_title']}>特殊说明:</Col>
        //       <Col>特殊说明</Col>
        //     </Row>
        //     <Row className={style['card-list']}>
        //       <Col span={4} className={style['card-list_title']}>特殊说明:</Col>
        //       <Col>特殊说明</Col>
        //     </Row>
        //   </>)
        // },
        {
          title: intl.formatMessage({ id: 'table.purchase.fujian' }),
          name: '',
          id: 'file',
          render: (data) => (
            <>
              <Row className={style['card-list']}>
                <Col span={4} className={style['card-list_title']}>
                  {intl.formatMessage({ id: 'table.purchase.fujian' })}:
                </Col>
                <Col span={20}>
                  {currentRow.file?.length
                    ? currentRow['file'].map((item) => (
                        <a key={item.id} href={item.url} style={{ display: 'block' }} target="_blank">
                          {item.name}
                        </a>
                      ))
                    : null}
                </Col>
              </Row>
            </>
          ),
        },
        {
          title: intl.formatMessage({ id: 'table.purchase.caigoushuliang' }),
          name: '',
          id: 'purchaseAmount',
          render: (data) => (
            <>
              <Row className={style['card-list']}>
                <Col span={4} className={style['card-list_title']}>
                  {intl.formatMessage({ id: 'table.purchase.danwei' })}:
                </Col>
                <Col>{currentRow['unitName']}</Col>
              </Row>
              <Row className={style['card-list']}>
                <Col span={4} className={style['card-list_title']}>
                  {intl.formatMessage({ id: 'detail.purchase.purchaseCount' })}:
                </Col>
                <Col>{currentRow['count']}</Col>
              </Row>
            </>
          ),
        },
      ]
    : []

  const columns = [
    {
      title: intl.formatMessage({ id: 'table.purchase.wuliaobianhao' }),
      dataIndex: 'code',
      key: 'code',
      render: (text, record) => (
        <>
          <EyeAuthButton type="button" handleClick={() => clickPreview(record)}>
            {text}
          </EyeAuthButton>
        </>
      ),
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.wuliaomingcheng' }),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.guigexinghao' }),
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.pinlei' }),
      dataIndex: 'categoryName',
      key: 'categoryName',
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.pinpai' }),
      dataIndex: 'brandName',
      key: 'brandName',
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.danwei' }),
      dataIndex: 'unitName',
      key: 'unitName',
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.caigoushuliang' }),
      dataIndex: 'count',
      key: 'count',
    },
  ]

  const clickPreview = (record) => {
    console.log(record, '查看物料')
    setCurrentRow(record)
    setVisible(true)
  }

  const footer = (
    <div
      style={{
        textAlign: 'right',
      }}
    >
      <Button onClick={() => setVisible(false)} style={{ marginRight: 8 }}>
        {intl.formatMessage({ id: 'table.purchase.quxiao' })}
      </Button>
      <Button onClick={() => setVisible(false)} type="primary">
        {intl.formatMessage({ id: 'table.purchase.queding' })}
      </Button>
    </div>
  )

  return (
    <>
      <MellowCard title={cardTitle} style={{ marginTop: 16 }} bordered={false} fullHeight>
        <Table dataSource={materielList} columns={columns} pagination={{ size: 'small' }} />
      </MellowCard>

      <AnchorDrawer
        title={intl.formatMessage({ id: 'table.purchase.wuliaoxiangqing' })}
        visible={visible}
        dataRenderList={dataList}
        footer={footer}
        onClose={() => setVisible(false)}
      />
    </>
  )
}

BidMaterial.defaultProps = {}

export default BidMaterial
