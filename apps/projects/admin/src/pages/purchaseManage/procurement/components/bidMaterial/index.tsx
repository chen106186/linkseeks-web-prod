import React, { useContext, useEffect, useRef, useState } from 'react'
import { Table, Drawer, Button, Tabs, Row, Col } from 'antd'
import MellowCard from '@/components/MellowCard'
import { BidDetailContext } from '../../_public/bid/context'
import { EyeAuthButton } from '@apps/components'
import style from './index.less'
import AnchorDrawer from '@/components/AnchorDrawer'

/**
 * 招标物料表格
 */

export interface BidMaterialProps {
  cardTitle?: string
}

const BidMaterial: React.FC<BidMaterialProps> = ({ cardTitle }) => {
  const bidDetailContext = useContext(BidDetailContext)
  const { data, ctl } = bidDetailContext
  const { materielList } = data

  const [visible, setVisible] = useState<boolean>(false)
  const [currentRow, setCurrentRow] = useState<any>()

  const dataList = currentRow?.code
    ? [
        {
          title: '基本信息',
          id: 'baseInfo',
          name: '',
          render: (data) => (
            <>
              <Row className={style['card-list']}>
                <Col span={4} className={style['card-list_title']}>
                  物料编号:
                </Col>
                <Col>{currentRow['code']}</Col>
              </Row>
              <Row className={style['card-list']}>
                <Col span={4} className={style['card-list_title']}>
                  物料名称:
                </Col>
                <Col>{currentRow['name']}</Col>
              </Row>
              <Row className={style['card-list']}>
                <Col span={4} className={style['card-list_title']}>
                  规格型号:
                </Col>
                <Col>{currentRow['type']}</Col>
              </Row>
              <Row className={style['card-list']}>
                <Col span={4} className={style['card-list_title']}>
                  品类:
                </Col>
                <Col>{currentRow['categoryName']}</Col>
              </Row>
              <Row className={style['card-list']}>
                <Col span={4} className={style['card-list_title']}>
                  品牌:
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
          title: '附件',
          name: '',
          id: 'file',
          render: (data) => (
            <>
              <Row className={style['card-list']}>
                <Col span={4} className={style['card-list_title']}>
                  附件:
                </Col>
                {currentRow.file?.length
                  ? currentRow['file'].map((item) => (
                      <Col key={item.id}>
                        <a href={item.url} target="_blank">
                          {item.name}
                        </a>
                      </Col>
                    ))
                  : null}
              </Row>
            </>
          ),
        },
        {
          title: '采购数量',
          name: '',
          id: 'purchaseAmount',
          render: (data) => (
            <>
              <Row className={style['card-list']}>
                <Col span={4} className={style['card-list_title']}>
                  单位:
                </Col>
                <Col>{currentRow['unitName']}</Col>
              </Row>
              <Row className={style['card-list']}>
                <Col span={4} className={style['card-list_title']}>
                  采购数量:
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
      title: '物料编号',
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
      title: '物料名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '规格型号',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '品类',
      dataIndex: 'categoryName',
      key: 'categoryName',
    },
    {
      title: '品牌',
      dataIndex: 'brandName',
      key: 'brandName',
    },
    {
      title: '单位',
      dataIndex: 'unitName',
      key: 'unitName',
    },
    {
      title: '采购数量',
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
        取消
      </Button>
      <Button onClick={() => setVisible(false)} type="primary">
        确定
      </Button>
    </div>
  )

  return (
    <>
      <MellowCard title={cardTitle} style={{ marginTop: 24 }} bordered={false} fullHeight>
        <Table dataSource={materielList} columns={columns} pagination={{ size: 'small' }} />
      </MellowCard>

      <AnchorDrawer
        title="物料详情"
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
