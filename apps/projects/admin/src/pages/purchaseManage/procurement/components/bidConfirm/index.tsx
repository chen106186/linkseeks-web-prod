import React, { useContext, useState, useEffect } from 'react'
import { Row, Col, Divider } from 'antd'
import MellowCard from '@/components/MellowCard'
import { BidDetailContext } from '@/pages/purchaseManage/procurement/_public/bid/context'
import style from './index.less'
import level1 from '@/assets/rank1.png'
import level2 from '@/assets/rank2.png'
import level3 from '@/assets/rank3.png'
import TotalAmount from './components/totalAmount'
import GivenBidItem from './components/givenBidItem'
import winBid from '@/assets/winBid.png'

/**
 * 招标结果/招标定标
 */

export interface BidConfirmProps {
  cardTitle?: string
}

const BidConfirm: React.FC<BidConfirmProps> = ({ cardTitle }) => {
  const { data, ctl } = useContext(BidDetailContext)

  const [tableColumns, setTableColumns] = useState<any>([])
  const [tableDataSource, setTableDataSource] = useState<any>([])

  useEffect(() => {
    if (data?.memberList.length) {
      const { memberList } = data
      const _memberList = memberList
        .map((item) => {
          // 投过标的才显示
          if (item.submitTender) {
            return {
              ...item,
              totalAmount: item.submitTender.submitTenderMateriel.reduce(
                (a, b) => a + b.price * b.inviteTenderMateriel.count,
                0,
              ),
            }
          }
        })
        .filter(Boolean)
        .sort((a, b) => b.totalAmount - a.totalAmount)

      /** 组合table列 */
      let columns: any[] = [
        {
          title: '采购物料',
          dataIndex: 'inviteTenderMateriel',
          key: 'inviteTenderMateriel',
        },
        {
          title: '采购数量',
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
            temp['isAwardTender'] = false
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
          <img src={level1} alt="排名一" />
          {title}
        </>
      )
    } else if (level === 2) {
      return (
        <>
          <img src={level2} alt="排名二" />
          {title}
        </>
      )
    } else if (level === 3) {
      return (
        <>
          <img src={level3} alt="排名三" />
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
      <MellowCard title={cardTitle} style={{ marginTop: 24 }} bordered={false} fullHeight>
        <div className={style['winContainer']}>
          <div className="common-panel-title">中标会员</div>
          <Row gutter={[16, 0]}>
            {data.memberList
              .filter((m) => m.isWin)
              .map((item) => (
                <Col key={item.id} span={6}>
                  <div className={style['card-list']}>
                    <h4>{item.memberName}</h4>
                    <Row>
                      <Col span={8}>
                        <p className={style['card-list_title']}>中标总金额(含税):</p>
                      </Col>
                      <Col>
                        <p className={style.amount}>
                          ¥
                          {item.submitTender.submitTenderMateriel.reduce(
                            (a, b) => a + b.price * b.inviteTenderMateriel.count,
                            0,
                          )}
                        </p>
                      </Col>
                    </Row>
                    <img src={winBid} alt="已中标" />
                  </div>
                </Col>
              ))}
          </Row>
        </div>
        <Divider />
        <div>
          <div className="common-panel-title">中标理由</div>
          <div className={style['card-list']}>
            <Row>
              <Col span={4}>
                <p className={style['card-list_title']}>中标理由:</p>
              </Col>
              <Col>
                <p>{data.winTenderReason}</p>
              </Col>
            </Row>
          </div>
          <div className={style['card-list']}>
            <Row>
              <Col span={4}>
                <p className={style['card-list_title']}>中标附件:</p>
              </Col>
              <Col>
                {data?.winTenderFile?.length
                  ? data.winTenderFile.map((item) => (
                      <p key={item.id}>
                        <a href={item.url} target="_blank">
                          {item.name}
                        </a>
                      </p>
                    ))
                  : null}
              </Col>
            </Row>
          </div>
        </div>
        <Divider />
        <div>
          <div className="common-panel-title">中标物料</div>
          <div className={style.bidConfirmWrapper}>
            <Row gutter={[0, 4]}>
              <Col span={24}>
                {/* header */}
                <Row wrap={false}>
                  <Col span={4} lg={6}>
                    <p className={style.bidTableHead}>采购物料</p>
                  </Col>
                  <Col span={4} lg={6}>
                    <p className={style.bidTableHead}>采购数量</p>
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
                  <Row
                    wrap={false}
                    key={`row_${index}`}
                    gutter={[0, 4]}
                    style={{ margin: '0 4px', backgroundColor: '#fff' }}
                  >
                    {tableColumns.map((_item, _index) => {
                      const { title, dataIndex } = _item
                      if (title === '采购物料') {
                        return (
                          <Col span={4} lg={6} style={{ paddingTop: 0, marginTop: 0 }}>
                            <div className={style.materialInfo}>
                              <span className={style.rankNumber}>{index + 1}</span>
                              <div className={style['card-list']}>
                                <Row>
                                  <Col span={8}>
                                    <p className={style['card-list_title']}>物料编号:</p>
                                  </Col>
                                  <Col>
                                    <p>{item[dataIndex]['code']}</p>
                                  </Col>
                                </Row>
                              </div>
                              <div className={style['card-list']}>
                                <Row>
                                  <Col span={8}>
                                    <p className={style['card-list_title']}>物料名称:</p>
                                  </Col>
                                  <Col>
                                    <p>{item[dataIndex]['name']}</p>
                                  </Col>
                                </Row>
                              </div>
                              <div className={style['card-list']}>
                                <Row>
                                  <Col span={8}>
                                    <p className={style['card-list_title']}>规格型号:</p>
                                  </Col>
                                  <Col>
                                    <p>{item[dataIndex]['type']}</p>
                                  </Col>
                                </Row>
                              </div>
                              <div className={style['card-list']}>
                                <Row>
                                  <Col span={8}>
                                    <p className={style['card-list_title']}>品类:</p>
                                  </Col>
                                  <Col>
                                    <p>{item[dataIndex]['categoryName']}</p>
                                  </Col>
                                </Row>
                              </div>
                              <div className={style['card-list']}>
                                <Row>
                                  <Col span={8}>
                                    <p className={style['card-list_title']}>品牌:</p>
                                  </Col>
                                  <Col>
                                    <p>{item[dataIndex]['brandName']}</p>
                                  </Col>
                                </Row>
                              </div>
                            </div>
                          </Col>
                        )
                      } else if (title === '采购数量') {
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
                {/* statistics */}
                {/* <Row gutter={[0, 4]} style={{margin: '0 4px'}}>
                  <Col span={24}>
                    <TotalAmount datas={tableDataSource} columns={tableColumns} />
                  </Col>
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
                                <p className={style['card-list_title']}>报价小计:</p>
                              </Col>
                              <Col>
                                <p>
                                  ¥
                                  {tableDataSource
                                    .reduce((a, b) => a + b[item.dataIndex]['price'] * b.count, 0)
                                    .toFixed(2)}
                                  (含税)
                                </p>
                              </Col>
                            </Row>
                          </div>
                          <div className={style['card-list']}>
                            <Row>
                              <Col span={8}>
                                <p className={style['card-list_title']}>报价排名:</p>
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
                                <p className={style['card-list_title']}>授标数量:</p>
                              </Col>
                              <Col>
                                <p>
                                  {tableDataSource.reduce(
                                    (a, b) => a + (b[item.dataIndex]['isAwardTender'] ? 1 : 0),
                                    0,
                                  )}
                                </p>
                              </Col>
                            </Row>
                          </div>
                          <div className={style['card-list']}>
                            <Row>
                              <Col span={8}>
                                <p className={style['card-list_title']}>授标总额:</p>
                              </Col>
                              <Col>
                                <p>
                                  ¥
                                  {tableDataSource
                                    .reduce(
                                      (a, b) =>
                                        a +
                                        (b[item.dataIndex]['isAwardTender']
                                          ? (b[item.dataIndex]['price'] * b.count * b[item.dataIndex]['awardRate']) /
                                            100
                                          : 0),
                                      0,
                                    )
                                    .toFixed(2)}
                                  (含税)
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
        </div>
      </MellowCard>
    </div>
  )
}

BidConfirm.defaultProps = {}

export default BidConfirm
