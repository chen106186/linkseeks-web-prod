import React, { useContext, useEffect, useState } from 'react'
import { Table, Radio, Row, Col } from 'antd'
import MellowCard from '@/components/MellowCard'
import { UserOutlined, DeleteOutlined, FileFilled } from '@ant-design/icons'
import style from './index.less'
import level1 from '@/assets/imgs/rank1.png'
import level2 from '@/assets/imgs/rank2.png'
import level3 from '@/assets/imgs/rank3.png'
import { ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { EditableCell, EditableRow } from '../../../readySubmitReport/components/remarkTableCell'
import { ReadyConfirmBidContext } from '@/pages/procurement/_public/bid/context'
import { groupBy } from '@/pages/procurement/constants'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()

/**
 * 评标报告 待审核专用
 */

export interface RemarkBidReportProps {
  cardTitle?: string
  addSchemaAction?: ISchemaFormActions | ISchemaFormAsyncActions
}

const RemarkBidReport: React.FC<RemarkBidReportProps> = ({ cardTitle }) => {
  const { data, submitData, submitCtl } = useContext(ReadyConfirmBidContext)
  const [transferRadio, setTransferRadio] = useState<number>(0)
  const { fileList, recommandList, childTableData } = submitData
  const { setFileList, setRecommandList, setChildrenTableData } = submitCtl

  const [evaluationRecord, setEvaluationRecord] = useState<any>([])
  const [childTableColumns, setChildrenTableColumns] = useState<any>([])

  useEffect(() => {
    if (data?.evaluationTenderRecommendList.length) {
      setRecommandList(data.evaluationTenderRecommendList)
    }
    if (data?.evaluationInviteMemberList.length) {
      // 转换数据 生成评分项radio和所有分块表格
      let dataSource: any = [],
        tempObject: any = {}
      const { evaluationInviteMemberList } = data
      for (let i = 0; i < evaluationInviteMemberList.length; i++) {
        let item = evaluationInviteMemberList[i]
        tempObject.id = item.id
        tempObject.memberId = item.memberId
        tempObject.memberName = item.memberName
        tempObject.correctScore = item.correctScore
        for (let j = 0; j < item.evaluationTenderList.length; j++) {
          let _item = item['evaluationTenderList'][j]
          tempObject.expertExtractRecordId = _item.expertExtractRecord?.id || _item['sort']
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
        let total = computedData[item].reduce((a, b) => a + b.score, 0) || 0

        return {
          memberName: item,
          total: total.toFixed(2),
          average: (total / expertNumber).toFixed(2) || null,
          expertNumber,
          correctScore: computedData[item][0]['correctScore'],
        }
      })

      const dataBySort = groupBy(dataSource, 'sort')
      setEvaluationRecord(dataBySort)
      // 根据评标sort分类后的数据 遍历 分子表格
      let childrenTableDataSource = [] // table data
      let childTableDataColumns = [] // table columns
      Object.keys(dataBySort).forEach((item, index) => {
        let childTableData = []
        let childTableColumns = [
          {
            title: intl.formatMessage({ id: 'table.purchase.huiyuan' }),
            dataIndex: 'memberName',
            key: 'memberName',
            render: (t, r, i) => renderRanking(t, r, ++i),
          },
          {
            title: intl.formatMessage({ id: 'table.purchase.xiuzhengzongfen' }),
            dataIndex: 'correctScore',
            key: 'correctScore',
            // editable: true,
          },
          {
            title: intl.formatMessage({ id: 'table.purchase.pingjunfen' }),
            dataIndex: 'average',
            key: 'average',
            className: 'commonHide',
          },
        ]
        let childTableColumnResult = []
        const childDataSource = groupBy(dataBySort[item], 'memberName')
        Object.keys(childDataSource).forEach((_item, _index) => {
          // 动态子表格列 // 合并同会员下的专家评标
          // 相同同会员名下的分数数据 只需要取一个
          const computedMemberScoreItem = computedScore.filter((_v) => _v.memberName === _item)[0]
          let objectItem: any = {
            memberId: childDataSource[_item][0]['memberId'],
            memberName: _item,
            total: computedMemberScoreItem['total'],
            average: computedMemberScoreItem['average'] ? Number(computedMemberScoreItem['average']).toFixed(2) : null,
            expertNumber: computedMemberScoreItem['expertNumber'],
            correctScore: childDataSource[_item][0]['correctScore'],
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
              <img src={level1} alt={intl.formatMessage({ id: 'table.purchase.paimingyi' })} />
            </p>
            <div>
              <h5>{t}</h5>
              <p>
                <span>
                  {intl.formatMessage({ id: 'table.purchase.zongfen' })}:{r.total}
                </span>
                <span>
                  {intl.formatMessage({ id: 'table.purchase.pingjunfen' })}:{r.average}
                </span>
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
              <img src={level2} alt={intl.formatMessage({ id: 'table.purchase.paiminger' })} />
            </p>
            <div>
              <h5>{t}</h5>
              <p>
                <span>
                  {intl.formatMessage({ id: 'table.purchase.zongfen' })}:{r.total}
                </span>
                <span>
                  {intl.formatMessage({ id: 'table.purchase.pingjunfen' })}:{r.average}
                </span>
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
              <img src={level3} alt={intl.formatMessage({ id: 'table.purchase.paimingsan' })} />
            </p>
            <div>
              <h5>{t}</h5>
              <p>
                <span>
                  {intl.formatMessage({ id: 'table.purchase.zongfen' })}:{r.total}
                </span>
                <span>
                  {intl.formatMessage({ id: 'table.purchase.pingjunfen' })}:{r.average}
                </span>
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
                <span>
                  {intl.formatMessage({ id: 'table.purchase.zongfen' })}:{r.total}
                </span>
                <span>
                  {intl.formatMessage({ id: 'table.purchase.pingjunfen' })}:{r.average}
                </span>
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
            <div className="common-panel-title">{intl.formatMessage({ id: 'table.purchase.pingbiaojilu' })}</div>
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
                  pagination={false}
                  scroll={{ x: true }}
                />
              )
            }
          })}
          <div className={style.remarkBidMember}>
            <div className="common-panel-title">{intl.formatMessage({ id: 'table.purchase.tuijianzhongbiaohui' })}</div>
            <Row gutter={[16, 0]}>
              {recommandList?.length
                ? recommandList.map((item, index) => (
                    <Col key={item.id} span={4}>
                      <div className={style['card-list']}>
                        <Row>
                          <Col span={8}>
                            <p className={style['card-list_title']}>
                              {intl.formatMessage({ id: 'table.purchase.huiyuan' })}:
                            </p>
                          </Col>
                          <Col>
                            <p>{item.memberName}</p>
                          </Col>
                        </Row>
                        <Row>
                          <Col span={8}>
                            <p className={style['card-list_title']}>
                              {intl.formatMessage({ id: 'table.purchase.tuijianren' })}:
                            </p>
                          </Col>
                          <Col>
                            <p>{item.userName}</p>
                          </Col>
                        </Row>
                        <Row>
                          <Col span={8}>
                            <p className={style['card-list_title']}>
                              {intl.formatMessage({ id: 'table.purchase.liyou' })}:
                            </p>
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
            <div className="common-panel-title">{intl.formatMessage({ id: 'table.purchase.pingbiaofujian' })}</div>
            <div className={style['card-list']}>
              <Row>
                <Col span={4}>
                  <p className={style['card-list_title']}>{intl.formatMessage({ id: 'table.purchase.fujian' })}:</p>
                </Col>
                <Col>
                  {data?.evaluationTenderFile.length
                    ? data.evaluationTenderFile.map((item) => (
                        <p key={item.id}>
                          <a href={item.url} target="_blank">
                            <FileFilled /> {item.name}
                          </a>
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
