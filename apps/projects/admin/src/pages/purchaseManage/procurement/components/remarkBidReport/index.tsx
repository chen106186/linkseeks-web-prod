import React, { useContext, useEffect, useRef, useState } from 'react'
import { Table, Button, Radio, Row, Col, message } from 'antd'
import MellowCard from '@/components/MellowCard'
import { UserOutlined, DeleteOutlined } from '@ant-design/icons'
import style from './index.less'
import level1 from '@/assets/rank1.png'
import level2 from '@/assets/rank2.png'
import level3 from '@/assets/rank3.png'
import { ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { BidDetailContext } from '@/pages/purchaseManage/procurement/_public/bid/context'
import { groupBy } from '../../constants'
import { EditableCell, EditableRow } from '../remarkTableCell'

/**
 * 评标报告 通用
 */

export interface RemarkBidReportProps {
  cardTitle?: string
  addSchemaAction?: ISchemaFormActions | ISchemaFormAsyncActions
}

const RemarkBidReport: React.FC<RemarkBidReportProps> = ({ cardTitle }) => {
  const { data, ctl } = useContext(BidDetailContext)
  const [transferRadio, setTransferRadio] = useState<number>(0)

  const [recommandList, setRecommandList] = useState<any>([])
  const [childTableData, setChildrenTableData] = useState<any>([])

  const [evaluationRecord, setEvaluationRecord] = useState<any>([])
  const [childTableColumns, setChildrenTableColumns] = useState<any>([])

  useEffect(() => {
    if (data?.evaluationTenderRecommendList?.length) {
      setRecommandList(data.evaluationTenderRecommendList)
    }
    if (data?.evaluationInviteMemberList?.length) {
      // 转换数据 生成评分项radio和所有分块表格
      let dataSource: any = [],
        tempObject: any = {}
      const { evaluationInviteMemberList } = data
      for (let i = 0; i < evaluationInviteMemberList.length; i++) {
        let item = evaluationInviteMemberList[i]
        tempObject.id = item.id
        tempObject.memberId = item.memberId
        tempObject.memberName = item.memberName
        for (let j = 0; j < item.evaluationTenderList.length; j++) {
          let _item = item['evaluationTenderList'][j]
          tempObject.expertExtractRecordId = _item['expertExtractRecord']['id']
          tempObject.score = _item['score']
          tempObject.sort = _item['sort']
          tempObject.standard = _item['standard']
          tempObject.standardScore = _item['standardScore']
          tempObject.term = _item['term']
          dataSource.push({ ...tempObject })
        }
      }

      // 计算总分 计算平均分
      const computedData = groupBy(dataSource, 'memberName')
      const computedScore = Object.keys(computedData).map((item, index) => {
        let expertNumber = Object.keys(groupBy(computedData[item], 'expertExtractRecordId')).length
        let total = computedData[item].reduce((a, b) => a + b.score, 0)

        return {
          memberName: item,
          total,
          average: total / expertNumber,
          expertNumber,
        }
      })

      const dataBySort = groupBy(dataSource, 'sort')
      setEvaluationRecord(dataBySort)
      // 根据评标sort分类后的数据 遍历 分子表格
      let childrenTableDataSource: any = [] // table data
      let childTableDataColumns: any = [] // table columns
      Object.keys(dataBySort).forEach((item, index) => {
        let childTableData: any = []
        let childTableColumns = [
          {
            title: '会员',
            dataIndex: 'memberName',
            key: 'memberName',
            render: (t, r, i) => renderRanking(t, r, ++i),
          },
          {
            title: '修正总分',
            dataIndex: 'total',
            key: 'total',
            // editable: true,
          },
          {
            title: '平均分',
            dataIndex: 'average',
            key: 'average',
            className: 'commonHide',
          },
        ]
        let childTableColumnResult: any = []
        const childDataSource = groupBy(dataBySort[item], 'memberName')
        Object.keys(childDataSource).forEach((_item, _index) => {
          // 动态子表格列 // 合并同会员下的专家评标
          // 相同同会员名下的分数数据 只需要取一个
          const computedMemberScoreItem = computedScore.filter((_v) => _v.memberName === _item)[0]
          let objectItem: any = {
            memberId: childDataSource[_item][0]['memberId'],
            memberName: _item,
            total: computedMemberScoreItem['total'],
            average: computedMemberScoreItem['average'] ? computedMemberScoreItem['average'].toFixed(2) : null,
            expertNumber: computedMemberScoreItem['expertNumber'],
          }
          let columns: any = []
          childDataSource[_item].forEach((__item, __index) => {
            columns.push({
              title: (
                <>
                  <UserOutlined />
                  {__item['expertExtractRecordId']}
                </>
              ),
              dataIndex: __item['expertExtractRecordId'],
              key: __item['expertExtractRecordId'],
            })
            objectItem[__item['expertExtractRecordId']] = __item['score']
          })
          childTableData.push(objectItem)
          childTableColumnResult = childTableColumns.concat(columns)
        })
        childrenTableDataSource.push(childTableData.sort((a, b) => b.total - a.total))
        childTableDataColumns.push(childTableColumnResult)
      })
      setChildrenTableData(childrenTableDataSource)
      setChildrenTableColumns(childTableDataColumns)
    }
  }, [data])

  const renderRanking = (t, r, i) => {
    if (i === 1) {
      return (
        <div className={style.rankContainer}>
          <div className={style.rankContent}>
            <p>
              <img src={level1} alt="排名一" />
            </p>
            <div>
              <h5>{t}</h5>
              <p>
                <span>总分：{r.total}</span>
                <span>平均分：{r.average}</span>
              </p>
            </div>
          </div>
        </div>
      )
    } else if (i === 2) {
      return (
        <div className={style.rankContainer}>
          <div className={style.rankContent}>
            <p>
              <img src={level2} alt="排名二" />
            </p>
            <div>
              <h5>{t}</h5>
              <p>
                <span>总分：{r.total}</span>
                <span>平均分：{r.average}</span>
              </p>
            </div>
          </div>
        </div>
      )
    } else if (i === 3) {
      return (
        <div className={style.rankContainer}>
          <div className={style.rankContent}>
            <p>
              <img src={level3} alt="排名三" />
            </p>
            <div>
              <h5>{t}</h5>
              <p>
                <span>总分：{r.total}</span>
                <span>平均分：{r.average}</span>
              </p>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div className={style.rankContainer}>
          <div className={style.rankContent}>
            <p>
              <span className={style.levelCircle}>{i}</span>
            </p>
            <div>
              <h5>{t}</h5>
              <p>
                <span>总分：{r.total}</span>
                <span>平均分：{r.average}</span>
              </p>
            </div>
          </div>
        </div>
      )
    }
  }

  const handleChangeType = (e) => {
    setTransferRadio(e.target.value)
  }

  const deleteMemeber = (mid, index) => {
    setRecommandList(() => {
      return mid ? recommandList.filter((item) => item.id !== mid) : recommandList.filter((item, _i) => _i !== index)
    })
  }

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  }

  const handleSave = (row, index) => {
    // 双重遍历childTableData数据 改变total和average
    setChildrenTableData(() => {
      return childTableData.map((element) => {
        return element.map((_e) => {
          if (_e.memberName === row.memberName) {
            return {
              ..._e,
              total: Number(row.total),
              average: Number(row.total) / row.expertNumber,
            }
          } else {
            return _e
          }
        })
      })
    })
  }

  return (
    <>
      <div id="remarkBidReport" className={style.remarkRecordContainer}>
        <MellowCard title={cardTitle} style={{ marginTop: 24 }} bordered={false} fullHeight>
          <div className={style.remarkRecordHead}>
            <div className="common-panel-title">评标记录</div>
            <Radio.Group value={transferRadio} buttonStyle="solid" size="small" onChange={handleChangeType}>
              {Object.keys(evaluationRecord).map((item, index) => (
                <Radio.Button key={index} value={index}>
                  {item}
                </Radio.Button>
              ))}
            </Radio.Group>
          </div>
          {Object.keys(evaluationRecord).map((item, index) => {
            // 处理列
            const columns = childTableColumns[index].map((col) => {
              if (!col.editable) {
                return col
              }
              return {
                ...col,
                onCell: (record: any) => ({
                  record,
                  editable: col.editable,
                  dataIndex: col.dataIndex,
                  title: col.title,
                  handleSave: (row) => handleSave(row, index),
                }),
              }
            })

            if (transferRadio === index) {
              return (
                <Table
                  key={index}
                  components={components}
                  dataSource={childTableData[index]}
                  columns={columns}
                  pagination={{ size: 'small' }}
                />
              )
            }
          })}
          <div className={style.remarkBidMember}>
            <div className="common-panel-title">推荐中标会员</div>
            <Row gutter={[16, 0]}>
              {recommandList?.length
                ? recommandList.map((item, index) => (
                    <Col key={item.id} span={4}>
                      <div className={style['card-list']}>
                        <Row>
                          <Col span={8}>
                            <p className={style['card-list_title']}>会员:</p>
                          </Col>
                          <Col>
                            <p>{item.memberName}</p>
                          </Col>
                        </Row>
                        <Row>
                          <Col span={8}>
                            <p className={style['card-list_title']}>推荐人:</p>
                          </Col>
                          <Col>
                            <p>{item.userName}</p>
                          </Col>
                        </Row>
                        <Row>
                          <Col span={8}>
                            <p className={style['card-list_title']}>理由:</p>
                          </Col>
                          <Col>
                            <p>{item.reason}</p>
                          </Col>
                        </Row>
                        {item?.id ? null : (
                          <span className={style.deleteMember} onClick={() => deleteMemeber(item.id, index)}>
                            <DeleteOutlined />
                          </span>
                        )}
                      </div>
                    </Col>
                  ))
                : null}
            </Row>
          </div>
          <div className={style.remarkFile}>
            <div className="common-panel-title">评标附件</div>
            <div className={style['card-list']}>
              <Row>
                <Col span={4}>
                  <p className={style['card-list_title']}>附件:</p>
                </Col>
                <Col>
                  {data?.evaluationFile.length
                    ? data.evaluationFile.map((item) => (
                        <p key={item.id}>
                          <a href={item.url}>{item.name}</a>
                        </p>
                      ))
                    : null}
                </Col>
              </Row>
            </div>
          </div>
        </MellowCard>
      </div>
    </>
  )
}

RemarkBidReport.defaultProps = {}

export default RemarkBidReport
