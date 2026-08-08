import React, { useContext, useEffect, useRef, useState } from 'react'
import { Table, Button, Radio, Row, Col, message, Upload } from 'antd'
import MellowCard from '@/components/MellowCard'
import { UserOutlined, UploadOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import style from './index.less'
import imgLink from '@/assets/imgs/default_avatar.png'
import level1 from '@/assets/imgs/rank1.png'
import level2 from '@/assets/imgs/rank2.png'
import level3 from '@/assets/imgs/rank3.png'
import { createFormActions, ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { ReportDetailContext } from '@/pages/procurement/_public/bid/context'
import ModalForm from '@/components/ModalForm'
import { addRecommandMemberSchema } from '../../constant'
import cx from 'classnames'
import { EditableCell, EditableRow } from '../remarkTableCell'
import { groupBy } from '@/pages/procurement/constants'
import { authService } from '@apps/services'
import { ExpertRectractStatus } from '@/constants/procurement'
import { omit } from '@/utils'
import { getPurchaseTemplateGetTemplate } from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'
import { FILE_PREFIX_ENUM } from '@apps/constants/file'
const intl = getIntl()

/**
 * 评标报告
 */

const modalActions = createFormActions()

export interface RemarkBidReportProps {
  cardTitle?: string
  addSchemaAction?: ISchemaFormActions | ISchemaFormAsyncActions
  editable?: Boolean
}

const RemarkBidReport: React.FC<RemarkBidReportProps> = ({ editable }) => {
  const { accessToken } = authService.getAuth() || {}
  const { data, submitData, submitCtl } = useContext(ReportDetailContext)
  const currentRef = useRef<any>({})
  const [transferRadio, setTransferRadio] = useState<number>(0)
  const { recommandList, childTableData, offlineData, offlineColumn } = submitData
  const { setFileList, setRecommandList, setChildrenTableData, setOfflineData, setOfflineColumn } = submitCtl

  const [evaluationRecord, setEvaluationRecord] = useState<any>([])
  const [childTableColumns, setChildrenTableColumns] = useState<any>([])
  const [templateSort, setTemplateSort] = useState<any>([])
  const getCommodityRef = useRef<boolean>(true)

  useEffect(() => {
    if (data?.evaluationTenderRecommendList.length) {
      setRecommandList(data.evaluationTenderRecommendList)
    }
    if (data?.memberList.length) {
      // 转换数据 生成评分项radio和所有分块表格
      let dataSource: any = [],
        tempObject: any = {}
      const { memberList, expertExtractList } = data

      for (let i = 0; i < memberList.length; i++) {
        let item = memberList[i]
        tempObject.id = item.id
        tempObject.memberId = item.memberId
        tempObject.memberName = item.memberName
        if (data?.isOnlineEvaluation) {
          // * 在线评标
          if (item.evaluationTenderList) {
            // 有手动进行评标操作
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
          } else {
            // 没有手动评 取评标模板和专家抽取列表组合而成
            if (expertExtractList.length) {
              for (let m = 0; m < expertExtractList.length; m++) {
                if (expertExtractList[m]['status'] === 3) {
                  // 过滤掉确认通知的专家
                  for (let n = 0; n < templateSort.length; n++) {
                    tempObject.expertExtractRecordId = expertExtractList[m]['id']
                    tempObject.score = 0
                    tempObject.sort = templateSort[n]['sort']
                    tempObject.standard = templateSort[n]['standard']
                    tempObject.standardScore = templateSort[n]['standardScore']
                    tempObject.term = templateSort[n]['term']
                    dataSource.push({ ...tempObject })
                  }
                }
              }
            }
            // dataSource.push({...tempObject})
          }
        } else {
          // * 非在线评标
          generateOfflineData(memberList)
        }
      }

      // 数据去重处理（主要针对没有专家评，但评标模板评标分类有重复）
      dataSource = Object.values(
        [...dataSource]
          .map((item) => ({ ...item, mockId: `${item.memberId}_${item.expertExtractRecordId}_${item.sort}` }))
          .reduce((item, next) => {
            item[next.mockId] = next
            return item
          }, {}),
      )

      // 计算总分 计算平均分
      const computedData = groupBy(dataSource, 'memberName')
      const computedScore = Object.keys(computedData).map((item) => {
        let expertNumber = Object.keys(groupBy(computedData[item], 'expertExtractRecordId')).length
        let total = computedData[item].reduce((a, b) => a + b.score, 0) || 0

        return {
          memberName: item,
          total: total.toFixed(2),
          average: (total / expertNumber).toFixed(2) || null,
          expertNumber,
        }
      })

      const dataBySort = groupBy(dataSource, 'sort')

      setEvaluationRecord(dataBySort)

      if (data?.templateId && getCommodityRef.current) {
        getPurchaseTemplateGetTemplate({ id: data.templateId }).then((res) => {
          const { code, data } = res
          if (code === 1000 && data?.templateContentList?.length) {
            setTemplateSort(data.templateContentList)
            getCommodityRef.current = false
          }
        })
      }

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
            width: 256,
            ellipsis: true,
            render: (t, r, i) => renderRanking(t, r, ++i),
          },
          {
            title: intl.formatMessage({ id: 'table.purchase.xiuzhengzongfen' }),
            dataIndex: 'modifyTotal',
            key: 'modifyTotal',
            editable: true,
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
            modifyTotal: computedMemberScoreItem['total'], //在线模式 默认修正总分是总分
            average: computedMemberScoreItem['average'] ? Number(computedMemberScoreItem['average']).toFixed(2) : null,
            expertNumber: computedMemberScoreItem['expertNumber'],
            editable,
          }
          let columns: any = []
          childDataSource[_item].forEach((__item, __index) => {
            // 没有手动评标就不存在抽取id
            if (__item['expertExtractRecordId']) {
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
            }
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
  }, [data, templateSort])

  /** 线下评标表格数据 */
  const generateOfflineData = (mbList) => {
    let offlineDataSource = []
    let offlineDataColumns: any = [
      {
        title: intl.formatMessage({ id: 'table.purchase.huiyuan' }),
        dataIndex: 'memberName',
        key: 'memberName',
        render: (t, r, i) => renderRanking(t, r, ++i),
      },
      {
        title: intl.formatMessage({ id: 'table.purchase.xiuzhengzongfen' }),
        dataIndex: 'modifyTotal',
        key: 'modifyTotal',
        editable: true,
      },
    ]
    templateSort.forEach((item) => {
      offlineDataColumns.push({
        title: `${item.sort}(${item.standardScore})`,
        dataIndex: item.id,
        key: item.id,
        editable: true,
      })
    })
    mbList.forEach((item) => {
      let itemObject = {
        memberId: item['memberId'],
        memberName: item['memberName'],
        total: null,
        editable: false,
        noAverage: true,
      }
      templateSort.forEach((_item) => {
        itemObject[_item.id] = null
      })
      offlineDataSource.push(itemObject)
    })
    setOfflineColumn(offlineDataColumns)
    setOfflineData(offlineDataSource)
  }

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
                {r.noAverage ? null : (
                  <span>
                    {intl.formatMessage({ id: 'table.purchase.pingjunfen' })}:{r.average}
                  </span>
                )}
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
                {r.noAverage ? null : (
                  <span>
                    {intl.formatMessage({ id: 'table.purchase.pingjunfen' })}:{r.average}
                  </span>
                )}
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
                {r.noAverage ? null : (
                  <span>
                    {intl.formatMessage({ id: 'table.purchase.pingjunfen' })}:{r.average}
                  </span>
                )}
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
                {r.noAverage ? null : (
                  <span>
                    {intl.formatMessage({ id: 'table.purchase.pingjunfen' })}:{r.average}
                  </span>
                )}
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

  const uploadProps = {
    name: 'file',
    action: '/api/support/file/upload/prefix',
    data: {
      fileType: 1,
      prefix: FILE_PREFIX_ENUM.PURCHASE_SERVICE,
    },
    headers: {
      accessToken,
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
      }
      if (info.file.status === 'done') {
        setFileList(() =>
          info.fileList.map((item) => ({
            ...item.response.data,
            name: item.response.data.name.split('/').pop(),
          })),
        )
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} ${intl.formatMessage({ id: 'table.purchase.shangchuanshibai' })}`)
      }
    },
    beforeUpload(file) {
      if (file.name.length > 100) {
        message.warning(intl.formatMessage({ id: 'table.purchase.wenjianmingguochang' }))
        return Promise.reject(intl.formatMessage({ id: 'table.purchase.wenjianmingguochang' }))
      }
      if (file.size / 1024 / 1024 > 20) {
        message.warning(intl.formatMessage({ id: 'table.purchase.yicishangchuanyi' }))
        return Promise.reject(intl.formatMessage({ id: 'table.purchase.yicishangchuanyi' }))
      }
    },
  }

  const deleteMemeber = (mid, index) => {
    setRecommandList(() => {
      return mid ? recommandList.filter((item) => item.id !== mid) : recommandList.filter((item, _i) => _i !== index)
    })
  }

  const onConfirm = () => {
    modalActions.submit()
  }

  const handleSubmit = (values) => {
    currentRef.current.setVisible(false)
    setRecommandList(() => {
      let _t = recommandList ? [...recommandList] : []
      _t.push({ ...values })
      return _t
    })
  }

  const handleAddMember = () => {
    currentRef.current.setVisible(true)
    modalActions.reset()
  }

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  }

  const handleSave = (row) => {
    console.log(row, childTableData)
    // 双重遍历childTableData数据 改变total和average
    setChildrenTableData(() => {
      return childTableData.map((element) => {
        return element.map((_e) => {
          if (_e.memberName === row.memberName) {
            return {
              ..._e,
              modifyTotal: Number(row.modifyTotal),
              // @reason：修正总分和总分不需要联动
              // total: Number(row.total),
              // average: (Number(row.total) / row.expertNumber).toFixed(2),
            }
          } else {
            return _e
          }
        })
      })
    })
  }

  // 非在线保存
  const handleOfflineSave = (row) => {
    setOfflineData(() =>
      offlineData.map((element) => {
        if (element.memberId === row.memberId) {
          let computed = omit({ ...row }, ['editable', 'memberId', 'memberName', 'noAverage', 'total'])

          return {
            ...row,
            total: Object.values(computed).reduce((a, b) => Number(a) + Number(b), 0),
          }
        } else {
          return element
        }
      }),
    )
  }

  return (
    <>
      <div id="extractExpertList">
        <MellowCard
          title={intl.formatMessage({ id: 'table.purchase.zhuanjiachouqulie' })}
          style={{ marginTop: 24 }}
          bordered={false}
          fullHeight
        >
          <Row gutter={[16, 0]}>
            {data?.expertExtractList.length
              ? data.expertExtractList.map((item) => (
                  <Col span={4} key={item.id}>
                    <div className={style.committeeItem}>
                      <div className={style.avater}>
                        <img src={imgLink} alt={intl.formatMessage({ id: 'table.purchase.zhuanjiatouxiang' })} />
                        <p>
                          {item.source === 1
                            ? intl.formatMessage({ id: 'table.purchase.xitongchouqu' })
                            : intl.formatMessage({ id: 'table.purchase.rengongchouqu' })}
                        </p>
                      </div>
                      <p>
                        <span className={style['card-list_title']}>
                          {intl.formatMessage({ id: 'table.purchase.pingweizhuanjiabian' })}
                        </span>
                        {item.id}
                      </p>
                      {item.status === 2 ? (
                        <span className={cx(style.status, style.statusInfo)}>{ExpertRectractStatus[item.status]}</span>
                      ) : null}
                      {item.status === 3 ? (
                        <span className={cx(style.status, style.statusReceive)}>
                          {ExpertRectractStatus[item.status]}
                        </span>
                      ) : null}
                      {item.status === 4 ? (
                        <span className={cx(style.status, style.statusReject)}>
                          {ExpertRectractStatus[item.status]}
                        </span>
                      ) : null}
                      {item.status === 5 ? (
                        <span className={style.status}>{ExpertRectractStatus[item.status]}</span>
                      ) : null}
                    </div>
                  </Col>
                ))
              : null}
          </Row>
        </MellowCard>
      </div>
      <div id="remarkBidRecord" className={style.remarkRecordContainer}>
        <MellowCard
          title={intl.formatMessage({ id: 'table.purchase.pingbiaojilu' })}
          style={{ marginTop: 24 }}
          bordered={false}
          fullHeight
        >
          {data?.isOnlineEvaluation ? (
            <div>
              <div className={style.remarkRecordHead}>
                <div className="common-panel-title">{intl.formatMessage({ id: 'table.purchase.pingbiaojilu' })}</div>
                <Radio.Group value={transferRadio} buttonStyle="solid" size="small" onChange={handleChangeType}>
                  {Object.keys(evaluationRecord).map((item, index) =>
                    item === 'undefined' ? null : (
                      <Radio.Button key={index} value={index}>
                        {item}
                      </Radio.Button>
                    ),
                  )}
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
                      handleSave: (row) => handleSave(row),
                    }),
                  }
                })

                if (transferRadio === index) {
                  return (
                    <Table
                      scroll={{ x: true }}
                      key={index}
                      components={components}
                      dataSource={childTableData[index]}
                      columns={columns}
                      pagination={false}
                    />
                  )
                }
              })}
            </div>
          ) : (
            <div>
              <div className={style.remarkRecordHead}>
                <div className="common-panel-title">{intl.formatMessage({ id: 'table.purchase.pingbiaojilu' })}</div>
              </div>
              <Table
                scroll={{ x: true }}
                key="memberId"
                components={components}
                dataSource={offlineData}
                columns={offlineColumn.map((col) => {
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
                      handleSave: (row) => handleOfflineSave(row),
                    }),
                  }
                })}
                pagination={false}
              />
            </div>
          )}
        </MellowCard>
      </div>
      <div id="recommandBidMember">
        <MellowCard
          title={intl.formatMessage({ id: 'table.purchase.tuijianzhongbiaohui' })}
          style={{ marginTop: 24 }}
          bordered={false}
          fullHeight
        >
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
            {/* 新增 */}
            {editable && (
              <Col span={4}>
                <div className={style['card-list-dash']} onClick={handleAddMember}>
                  <Row>
                    <Col span={8}>
                      <p className={style['card-list_title']}></p>
                    </Col>
                    <Col>
                      <p style={{ opacity: 0 }}>{intl.formatMessage({ id: 'table.purchase.xinzengtuijianzhong' })}</p>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={8}>
                      <p className={style['card-list_title']}></p>
                    </Col>
                    <Col>
                      <p>
                        <PlusOutlined />
                        &nbsp;{intl.formatMessage({ id: 'table.purchase.xinzengtuijianzhong' })}
                      </p>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={8}>
                      <p className={style['card-list_title']}></p>
                    </Col>
                    <Col>
                      <p style={{ opacity: 0 }}>{intl.formatMessage({ id: 'table.purchase.xinzengtuijianzhong' })}</p>
                    </Col>
                  </Row>
                </div>
              </Col>
            )}
          </Row>
        </MellowCard>
      </div>
      <div id="remarkBidFiles">
        <MellowCard
          title={intl.formatMessage({ id: 'table.purchase.pingbiaofujian' })}
          style={{ marginTop: 24 }}
          bordered={false}
          fullHeight
        >
          <Row>
            <Col span={2}>
              <p className={style['card-list_title']}>{intl.formatMessage({ id: 'table.purchase.pingbiaofujian' })}:</p>
            </Col>
            <Col>
              {editable && (
                <Upload {...uploadProps}>
                  <Button icon={<UploadOutlined />}>
                    {intl.formatMessage({ id: 'table.purchase.shangchuanfujian' })}
                  </Button>
                </Upload>
              )}
            </Col>
          </Row>
        </MellowCard>
      </div>
      {/* 新增推荐会员 */}
      <ModalForm
        modalTitle={intl.formatMessage({ id: 'table.purchase.xinzengtuijianhui' })}
        currentRef={currentRef}
        confirm={onConfirm}
        onSubmit={handleSubmit}
        actions={modalActions}
        schema={addRecommandMemberSchema}
      />
    </>
  )
}

RemarkBidReport.defaultProps = {}

export default RemarkBidReport
