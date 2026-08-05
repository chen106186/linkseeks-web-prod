import React, { useContext, useState, useEffect } from 'react'
import { Row, Col, Divider } from 'antd'
import MellowCard from '@/components/MellowCard'
import { ReadyConfirmBidContext } from '@/pages/procurement/_public/bid/context'
import style from './index.less'
import level1 from '@/assets/imgs/rank1.png'
import level2 from '@/assets/imgs/rank2.png'
import level3 from '@/assets/imgs/rank3.png'
import TotalAmount from './components/totalAmount'
import GivenBidItem from './components/givenBidItem'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()

/**
 * 招标定标 待定标专用
 */

export interface BidConfirmProps {
  cardTitle?: string
}

const BidConfirm: React.FC<BidConfirmProps> = ({ cardTitle }) => {
  const { data, submitData, submitCtl } = useContext(ReadyConfirmBidContext)

  // const [tableColumns, setTableColumns] = useState<any>([])
  // const [tableDataSource, setTableDataSource] = useState<any>([])

  const { paramsTableData: tableDataSource, simulateColumn: tableColumns } = submitData
  const { setParamsTableData: setTableDataSource, setSimulateColumn: setTableColumns } = submitCtl

  useEffect(() => {
    if (data?.memberList.length) {
      const { memberList } = data
      const _memberList = memberList
        .filter((every) => every.submitTender && every.isSubmit)
        .map((item) => ({
          ...item,
          totalAmount: item.submitTender.submitTenderMateriel
            .reduce((a, b) => a + b.price * b.inviteTenderMateriel.count, 0)
            .toFixed(2),
        }))
        .sort((a, b) => b.totalAmount - a.totalAmount)

      /** 组合table列 */
      let columns: any[] = [
        {
          title: intl.formatMessage({ id: 'detail.purchase.materialLayout' }),
          dataIndex: 'inviteTenderMateriel',
          key: 'inviteTenderMateriel',
        },
        {
          title: intl.formatMessage({ id: 'table.purchase.caigoushuliang' }),
          dataIndex: 'count',
          key: 'count',
        },
      ]
      _memberList.forEach((item, index) => {
        columns.push({
          title: item.memberName,
          // 以投标会员id为 dataIndex 保存投标信息
          dataIndex: item.id,
          key: item.id,
        })
      })
      setTableColumns(columns)
      /** 组合table所需data */
      let tempData: any = []
      // 只需取一个投标会员的物料项 决定table的行数
      _memberList[0]?.submitTender &&
        _memberList[0].submitTender.submitTenderMateriel.forEach((item, index) => {
          tempData.push({
            inviteTenderMateriel: item.inviteTenderMateriel,
            count: item.inviteTenderMateriel.count,
            unitName: item.inviteTenderMateriel.unitName,
            // submitTenderMateriel: { id: item.id }
          })
        })

      setTableDataSource(() =>
        tempData.map((item, index) => {
          let tempOjbect = { ...item }
          _memberList.forEach((_item) => {
            let temp = {}
            temp['memberList'] = { id: _item.id }
            temp['submitTender'] = { id: _item.submitTender.id }
            temp['totalAmount'] = _item.totalAmount
            // 默认不授标 授标率100
            temp['isAward'] = false
            temp['awardRate'] = 100
            tempOjbect[_item.id] = { ...temp, ..._item.submitTender.submitTenderMateriel[index] }
          })
          return tempOjbect
        }),
      )
    }
  }, [data])

  useEffect(() => {
    console.log(tableColumns, tableDataSource)
  }, [tableColumns, tableDataSource])

  const RenderRanking = ({ title, level }) => {
    if (level === 1) {
      return (
        <>
          <img src={level1} alt={intl.formatMessage({ id: 'table.purchase.paimingyi' })} />
          {title}
        </>
      )
    } else if (level === 2) {
      return (
        <>
          <img src={level2} alt={intl.formatMessage({ id: 'table.purchase.paiminger' })} />
          {title}
        </>
      )
    } else if (level === 3) {
      return (
        <>
          <img src={level3} alt={intl.formatMessage({ id: 'table.purchase.paimingsan' })} />
          {title}
        </>
      )
    } else {
      return (
        <>
          <span className={style.levelCircle}>4</span>
          {title}
        </>
      )
    }
  }

  return (
    <div id="bidConfirm">
      <MellowCard title={cardTitle} style={{ marginTop: 16 }} bordered={false} fullHeight>
        <div className={style.bidConfirmWrapper}>
          <Row gutter={[0, 4]}>
            <Col span={24}>
              {/* header */}
              <Row wrap={false}>
                <Col span={4} lg={6}>
                  <p className={style.bidTableHead}>{intl.formatMessage({ id: 'detail.purchase.materialLayout' })}</p>
                </Col>
                <Col span={4} lg={6}>
                  <p className={style.bidTableHead}>{intl.formatMessage({ id: 'detail.purchase.purchaseCount' })}</p>
                </Col>
                {tableColumns.map((item, index) =>
                  index > 1 ? (
                    <Col span={4} lg={6} key={`column_${index}`}>
                      <p className={style.bidTableHead}>
                        <RenderRanking title={item.title} level={index - 1} />
                      </p>
                    </Col>
                  ) : null,
                )}
              </Row>
              {/* body */}
              {tableDataSource.map((item, index) => (
                <Row wrap={false} key={`row_${index}`} gutter={[0, 4]} style={{ margin: '0 4px' }}>
                  {tableColumns.map((_item, _index) => {
                    const { title, dataIndex } = _item
                    if (title === intl.formatMessage({ id: 'detail.purchase.materialLayout' }) && item[dataIndex]) {
                      return (
                        <Col span={4} lg={6} style={{ paddingTop: 0 }}>
                          <div className={style.materialInfo}>
                            <span className={style.rankNumber}>{index + 1}</span>
                            <div className={style['card-list']}>
                              <Row>
                                <Col span={8}>
                                  <p className={style['card-list_title']}>
                                    {intl.formatMessage({ id: 'detail.purchase.materialCode' })}:
                                  </p>
                                </Col>
                                <Col>
                                  <p>{item[dataIndex]['code'] || null}</p>
                                </Col>
                              </Row>
                            </div>
                            <div className={style['card-list']}>
                              <Row>
                                <Col span={8}>
                                  <p className={style['card-list_title']}>
                                    {intl.formatMessage({ id: 'detail.purchase.materialName' })}:
                                  </p>
                                </Col>
                                <Col>
                                  <p>{item[dataIndex]['name']}</p>
                                </Col>
                              </Row>
                            </div>
                            <div className={style['card-list']}>
                              <Row>
                                <Col span={8}>
                                  <p className={style['card-list_title']}>
                                    {intl.formatMessage({ id: 'table.purchase.guigexinghao' })}:
                                  </p>
                                </Col>
                                <Col>
                                  <p>{item[dataIndex]['type']}</p>
                                </Col>
                              </Row>
                            </div>
                            <div className={style['card-list']}>
                              <Row>
                                <Col span={8}>
                                  <p className={style['card-list_title']}>
                                    {intl.formatMessage({ id: 'table.purchase.pinlei' })}:
                                  </p>
                                </Col>
                                <Col>
                                  <p>{item[dataIndex]['categoryName']}</p>
                                </Col>
                              </Row>
                            </div>
                            <div className={style['card-list']}>
                              <Row>
                                <Col span={8}>
                                  <p className={style['card-list_title']}>
                                    {intl.formatMessage({ id: 'table.purchase.pinpai' })}:
                                  </p>
                                </Col>
                                <Col>
                                  <p>{item[dataIndex]['brandName']}</p>
                                </Col>
                              </Row>
                            </div>
                          </div>
                        </Col>
                      )
                    } else if (title === intl.formatMessage({ id: 'table.purchase.caigoushuliang' })) {
                      return (
                        <Col span={4} lg={6}>
                          <div className={style.amountInfo}>
                            <span>{item[dataIndex]}</span>
                            <br />
                            <span style={{ color: '#909399' }}>({item['unitName']})</span>
                          </div>
                        </Col>
                      )
                    } else {
                      return (
                        <Col span={4} lg={6}>
                          <GivenBidItem
                            currentData={item}
                            datas={tableDataSource}
                            currentColumn={_item}
                            columns={tableColumns}
                            currentIndex={index}
                          />
                        </Col>
                      )
                    }
                  })}
                </Row>
              ))}
              {/* statistics 停用组件 */}
              {/* <Row wrap={false} gutter={[0, 4]} style={{margin: '0 4px'}}>
                <Col span={24}> */}
              {/* <TotalAmount datas={tableDataSource} columns={tableColumns} /> */}
              {/* </Col>
              </Row> */}
              <Row wrap={false} gutter={[0, 4]} style={{ margin: '0 4px' }}>
                <Col span={4} lg={6} style={{ marginBottom: 0 }}>
                  <div className={style.totalWrapper}></div>
                </Col>
                <Col span={4} lg={6} style={{ marginBottom: 0 }}>
                  <div className={style.totalWrapper}></div>
                </Col>
                {tableColumns.map((item, index) =>
                  index > 1 ? (
                    <Col span={4} lg={6} style={{ marginBottom: 0 }}>
                      <div className={style.totalWrapper}>
                        <div className={style['card-list']}>
                          <Row>
                            <Col span={8}>
                              <p className={style['card-list_title']}>
                                {intl.formatMessage({ id: 'detail.purchase.label34' })}:
                              </p>
                            </Col>
                            <Col>
                              <p>
                                {intl.formatMessage({ id: 'common.money' })}
                                {tableDataSource
                                  .reduce((a, b) => a + b[item.dataIndex]['price'] * b.count, 0)
                                  .toFixed(2)}
                                ({intl.formatMessage({ id: 'detail.purchase.isTax' })})
                              </p>
                            </Col>
                          </Row>
                        </div>
                        <div className={style['card-list']}>
                          <Row>
                            <Col span={8}>
                              <p className={style['card-list_title']}>
                                {intl.formatMessage({ id: 'detail.purchase.offerRank' })}:
                              </p>
                            </Col>
                            <Col>
                              <p>{index - 1}</p>
                            </Col>
                          </Row>
                        </div>
                      </div>
                    </Col>
                  ) : null,
                )}
              </Row>

              <Row wrap={false}>
                <Divider dashed={true} style={{ margin: '0 4px' }} />
              </Row>

              <Row wrap={false} style={{ margin: '0 4px' }}>
                <Col span={4} lg={6}>
                  <div className={style.totalWrapper}></div>
                </Col>
                <Col span={4} lg={6}>
                  <div className={style.totalWrapper}></div>
                </Col>
                {tableColumns.map((item, index) =>
                  index > 1 ? (
                    <Col span={4} lg={6}>
                      <div className={style.totalWrapper}>
                        <div className={style['card-list']}>
                          <Row>
                            <Col span={8}>
                              <p className={style['card-list_title']}>
                                {intl.formatMessage({ id: 'table.purchase.shoubiaoshuliang' })}:
                              </p>
                            </Col>
                            <Col>
                              <p>{tableDataSource.reduce((a, b) => a + (b[item.dataIndex]['isAward'] ? 1 : 0), 0)}</p>
                            </Col>
                          </Row>
                        </div>
                        <div className={style['card-list']}>
                          <Row>
                            <Col span={8}>
                              <p className={style['card-list_title']}>
                                {intl.formatMessage({ id: 'table.purchase.shoubiaozonge' })}:
                              </p>
                            </Col>
                            <Col>
                              <p>
                                {intl.formatMessage({ id: 'common.money' })}
                                {tableDataSource
                                  .reduce(
                                    (a, b) =>
                                      a +
                                      (b[item.dataIndex]['isAward']
                                        ? (b[item.dataIndex]['price'] * b.count * b[item.dataIndex]['awardRate']) / 100
                                        : 0),
                                    0,
                                  )
                                  .toFixed(2)}
                                ({intl.formatMessage({ id: 'detail.purchase.isTax' })})
                              </p>
                            </Col>
                          </Row>
                        </div>
                      </div>
                    </Col>
                  ) : null,
                )}
              </Row>
            </Col>
          </Row>
        </div>
      </MellowCard>
    </div>
  )
}

BidConfirm.defaultProps = {}

export default BidConfirm
