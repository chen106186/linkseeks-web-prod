import React, { useContext, useEffect, useState } from 'react'
import Card from '../../../card'
import { PRICECONTRAST_TYPE } from '../../../../constants'
import { getIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Space, Button, Tabs, message, Row, Col, Typography, Skeleton, Divider, Empty, Pagination } from 'antd'
import { FilePdfOutlined } from '@ant-design/icons'
import RowLayout from './rowLayout'
import { Context, BidDetailContext } from '../context'
import ModalOperate from '../../../modalOperate'
import BidTable from '../bidTable'
import style from './rowLayout/index.less'
import { isEmpty } from 'lodash'
import {
  getPurchaseConfirmQuotedPriceQuotedPriceInfo,
  getPurchaseConfirmQuotedPriceRightOffContrastPrice,
  postPurchaseConfirmQuotedPriceDecryptQuotedPrice,
  postPurchaseConfirmQuotedPriceLaunchTurnQuotedPrice,
} from '@apps/apis'
import { getWebIntl } from '@apps/locales'
import { downloadFileByNameAndUrl } from '@apps/utils'

const intl = getIntl()
const translate = getWebIntl()

const chNum: { [key: number]: string } = {
  1: translate('web.common.one'),
  2: translate('web.common.two'),
  3: translate('web.common.three'),
  4: translate('web.common.four'),
  5: translate('web.common.five'),
  6: translate('web.common.six'),
  7: translate('web.common.seven'),
  8: translate('web.common.eight'),
  9: translate('web.common.nine'),
}

export type queryType = {
  /** 单据id */
  id?: number
  /** 报价轮次 */
  turn: number
}

export interface SizeType {
  /** 页数 */
  current: string
  /** 每页条数 */
  pageSize: string
}

export interface IProps {
  query?: queryType
  redux?(e: any)
  preview?: boolean
  /** 是否编辑 */
  isEdit?: boolean
  /** path哪里进来的 */
  isPath?: string
}

const ContrastLyout1: React.FC<IProps> = (props: any) => {
  const {
    query: { id, turn },
    redux,
    preview,
    isEdit,
    isPath,
  } = props
  const context = useContext(Context)
  const [count, setCount] = useState<any>([])
  const [soure, setSoure] = useState<any>({})
  const [total, setTotal] = useState<number>(0)
  const [current, setCurrent] = useState<string>('1')
  const [type, setType] = useState<string>('')
  const [visible, setVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [disabled, setDisabled] = useState<boolean>(false)
  /** 当前为 contrast 并且轮数不等于当前报价轮数 */
  const [bool, setBool] = useState<boolean>(false)
  const [rowSource, setRowSource] = useState<any>({})
  /** 当前tab的报价轮次 */
  const [tabIdx, setTabIdx] = useState<string>(turn)
  /** 当前报价单是否加密 */
  const [encrypt, setEncrypt] = useState<number>(0)
  /** 当前数据的第0条 */
  const [idx, setIdx] = useState<number>(0)

  /** 供应商的报价是否已解密 */
  const [decrypt, setDecrypt] = useState<boolean>(false)

  /** 报价轮次 */
  const handleTurn = (num: number) => {
    let isTurn: Array<number> = []
    for (let i = 0; i < num; i += 1) {
      isTurn.push(i + 1)
    }
    setCount(isTurn.reverse())
  }

  const handleFlag = (flag: boolean) => {
    setLoading(flag)
  }

  /** 格式化数据 */
  const formatting = (data: any, index: number) => {
    const arr: any =
      data[0].awardInfoResponses.sort((a, b) => {
        return a.goodsId - b.goodsId
      }) || []
    const params: any = []
    arr.forEach((i: any, index: number) => {
      let item = {
        goodsId: i.goodsId,
        number: i.number,
        name: i.name,
        model: i.model,
        category: i.category,
        brand: i.brand,
        unit: i.unit,
        purchaseCount: i.purchaseCount,
        company: null,
      }
      let companyArr = []
      data.forEach((it: any) => {
        const sort = it.awardInfoResponses.sort((a, b) => {
          return a.goodsId - b.goodsId
        })
        let cItem = {
          itemId: sort[index].id,
          awardTaxProbability: sort[index].awardTaxProbability || 0,
          taxPrice: sort[index].taxPrice,
          taxProbability: sort[index].taxProbability,
          taxUnitPrice: sort[index].taxUnitPrice,
          isTax: sort[index].isTax,
          unit: sort[index].unit,
          isPrize: sort[index].isPrize,
          awardCount: it.awardCount,
          id: it.id,
          memberId: it.memberId,
          memberName: it.memberName,
          memberRoleId: it.memberRoleId,
          minimum: it.minimum,
          ranking: it.ranking,
          subtotal: it.subtotal,
          sumPrice: it.sumPrice,
        }
        companyArr.push(cItem)
      })
      /** 排名排序 */
      const companySort = companyArr.sort((a, b) => a.ranking - b.ranking)
      item.company = companySort
      params.push(item)
    })
    const dataSoure = { ...soure }
    dataSoure[index] = [...params]
    setSoure(dataSoure)
    redux(params)
    // if (preview || isEdit) {
    //   redux(params)
    // }
  }

  /** 点击比价 */
  const offContrastPrice = async (num: string, key: number, i: number) => {
    if (key === PRICECONTRAST_TYPE.UNENCRYPTED) {
      if (isPath === 'toComparePrices' && preview && i === 0) {
        return
      }
      handleFlag(true)
      const params = {
        id,
        turn: num,
      }
      if (i === 0) {
        setDisabled(true)
      }
      await getPurchaseConfirmQuotedPriceRightOffContrastPrice({ ...params }, { ctrlType: 'none' })
        .then((res: any) => {
          if (res.code === 1000) {
            const { data } = res
            if (data.length > 0) {
              formatting(data, i)
            } else {
              // message.error('当前暂无比价信息');
              setDisabled(false)
            }
            setLoading(false)
          } else {
            handleFlag(false)
          }
        })
        .catch((err) => {
          handleFlag(false)
        })
    } else if (key === PRICECONTRAST_TYPE.UNDECRYPTED && preview) {
      return
    } else {
      message.error(intl.formatMessage({ id: 'detail.purchase.message81' }))
    }
  }

  /** 获取报价会员信息
   * t: 轮次
   * i: 当前tab 下标
   */
  const fetchTableData = async (t: string, i?: number, page?: any) => {
    const params = {
      id,
      turn: t,
      pageSize: '4',
      current: page ? page : current,
    }
    await getPurchaseConfirmQuotedPriceQuotedPriceInfo({ ...params })
      .then((res) => {
        if (res.code !== 1000) {
          return
        }
        const { data } = res.data
        setTotal(res.data.totalCount)
        const params = { ...rowSource }
        params[i] = [...data]
        if (data.length > 0) {
          setDecrypt(true)
          setEncrypt(data[0].isDecrypt)
          setRowSource(params)
          /**
           * 1. 比价的 需要 报价轮次不等于当前(表示已经报过假的) 并且preview 为 false 就要显示比价信息
           * 2. preview 为 ture 表示查看详情的 立即调用比价接口
           */
          const index = i ? i : idx
          if (isEdit) {
            offContrastPrice(t, data[0].isDecrypt, index)
          } else if (t !== turn && !preview) {
            offContrastPrice(t, data[0].isDecrypt, index)
          } else if (preview) {
            offContrastPrice(t, data[0].isDecrypt, index)
          }
        } else {
          const param = { ...soure }
          ;(param[i] = null), setSoure(param)
          setRowSource(params)
        }
      })
      .catch((error) => {
        console.warn(error)
      })
  }

  useEffect(() => {
    if (turn) {
      fetchTableData(turn, idx)
      handleTurn(turn)
    }
  }, [turn])

  /** 切换轮次并且请求报价用户信息接口 */
  const getQuotedPriceInfo = (item: string) => {
    const num = item.split('-')[0]
    const index = item.split('-')[1]
    setIdx(Number(index))
    setTabIdx(num)
    const params = { ...soure }
    if (!preview && num !== turn) {
      setBool(true)
    } else {
      setBool(false)
    }
    if (!params[index]) {
      fetchTableData(num, Number(index))
    }
  }

  const handleSubmit = (type: string) => {
    setVisible(true)
    setType(type)
  }

  const reduxFetch = (data: any) => {
    redux(data)
  }

  const handleOnOk = () => {
    if (type === 'next') {
      history.goBack()
    } else {
      window.location.reload()
    }
  }

  const handlePagination = (page) => {
    fetchTableData(turn, idx, page)
  }

  useEffect(() => {
    if (!isEmpty(context) && !decrypt) {
      let priceContrast = context.priceContrast === 1 ? PRICECONTRAST_TYPE.UNDECRYPTED : PRICECONTRAST_TYPE.UNENCRYPTED
      setEncrypt(priceContrast)
    }
  }, [context])

  return (
    <BidDetailContext.Provider value={soure[idx]}>
      <Card
        id="contrastLyout"
        title={intl.formatMessage({ id: 'detail.purchase.offerLayout' })}
        extra={
          <>
            {tabIdx === turn && !preview && (
              <Space>
                <Button onClick={() => handleSubmit('next')}>
                  {intl.formatMessage({ id: 'detail.purchase.modalTitle15' })}
                </Button>
                {encrypt === PRICECONTRAST_TYPE.UNDECRYPTED && (
                  <Button onClick={() => handleSubmit('key')}>
                    {intl.formatMessage({ id: 'detail.purchase.modalTitle16' })}
                  </Button>
                )}
                <Button type="primary" disabled={disabled} onClick={() => offContrastPrice(tabIdx, encrypt, idx)}>
                  {intl.formatMessage({ id: 'detail.purchase.modalTitle17' })}
                </Button>
              </Space>
            )}
          </>
        }
      >
        <Tabs onChange={getQuotedPriceInfo}>
          {count.map((item: number, index: number) => (
            <Tabs.TabPane
              key={`${item}-${index}`}
              data-index={index}
              tab={`${intl.formatMessage({ id: 'detail.purchase.label4' })}${item}${intl.formatMessage({
                id: 'detail.purchase.label29',
              })}`}
            >
              {rowSource[idx] && rowSource[idx].length > 0 ? (
                <RowLayout
                  priceContrast={context.priceContrast}
                  encrypt={encrypt}
                  rowSource={rowSource[idx]}
                  pagination={
                    <Pagination
                      simple
                      defaultPageSize={4}
                      defaultCurrent={1}
                      total={total}
                      onChange={handlePagination}
                    />
                  }
                />
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
              <Skeleton active loading={loading} />
              {soure[idx] && (
                <>
                  <div className={style.divider} style={{ marginTop: '12px' }}>
                    <div>
                      <Divider type="vertical" className={style.vertical} />
                      {intl.formatMessage({ id: 'detail.purchase.modalTitle19' })}
                    </div>
                  </div>
                  <BidTable preview={bool ? bool : preview} redux={reduxFetch} />
                  {/* 授标了才显示 */}
                  {preview && context.externalState === 99 && Number(item) === Number(turn) && (
                    <Row gutter={[0, 4]} style={{ marginTop: '1em' }}>
                      {context.awardComments && (
                        <Col span={24}>
                          <div className={style['card-list']}>
                            <Row>
                              <Col span={3}>
                                <p className={style['card-list_title']}>
                                  {intl.formatMessage({ id: 'detail.purchase.isAward' })}
                                  {intl.formatMessage({ id: 'detail.purchase.modalTitle20' })}:
                                </p>
                              </Col>
                              <Col>
                                <p>{context.awardComments}</p>
                              </Col>
                            </Row>
                          </div>
                        </Col>
                      )}
                      {!isEmpty(context.urls) && (
                        <Col span={24}>
                          <div className={style['card-list']}>
                            <Row>
                              <Col span={3}>
                                <p className={style['card-list_title']}>
                                  {intl.formatMessage({ id: 'detail.purchase.file' })}:
                                </p>
                              </Col>
                              <Col>
                                {context.urls &&
                                  context.urls.map((item, index) => (
                                    <p key={`urls_${index + 1}`} className={style['card-list_file']}>
                                      <Typography.Link
                                        key={`link_${index + 1}`}
                                        onClick={() => downloadFileByNameAndUrl(item.url, item.name)}
                                      >
                                        <FilePdfOutlined style={{ marginRight: '5px' }} />
                                        {item.name}
                                      </Typography.Link>
                                    </p>
                                  ))}
                              </Col>
                            </Row>
                          </div>
                        </Col>
                      )}
                    </Row>
                  )}
                </>
              )}
            </Tabs.TabPane>
          ))}
        </Tabs>
        {isPath === 'offerInquire' && context.externalState === 99 && (
          <div>
            <div className={style.divider} style={{ marginTop: '12px' }}>
              <div>
                <Divider type="vertical" className={style.vertical} />
                {intl.formatMessage({ id: 'table.purchase.result' })}
              </div>
            </div>
            <Row gutter={[0, 4]} style={{ marginTop: '1em' }}>
              {context.awardResults && (
                <Col span={24}>
                  <div className={style['card-list']}>
                    <Row>
                      <Col span={3}>
                        <p className={style['card-list_title']}>
                          {intl.formatMessage({ id: 'detail.purchase.label41' })}:
                        </p>
                      </Col>
                      <Col span={10}>
                        <p style={{ whiteSpace: 'break-spaces' }}>{context.awardResults}</p>
                      </Col>
                    </Row>
                  </div>
                </Col>
              )}
              {context.content && (
                <Col span={24}>
                  <div className={style['card-list']}>
                    <Row>
                      <Col span={3}>
                        <p className={style['card-list_title']}>
                          {intl.formatMessage({ id: 'detail.purchase.thanks' })}:
                        </p>
                      </Col>
                      <Col span={10}>
                        <p style={{ whiteSpace: 'break-spaces' }}>{context.content}</p>
                      </Col>
                    </Row>
                  </div>
                </Col>
              )}
            </Row>
          </div>
        )}

        <ModalOperate
          id={id}
          title={
            type === 'next'
              ? intl.formatMessage({ id: 'detail.purchase.modalTitle21' })
              : intl.formatMessage({ id: 'detail.purchase.modalTitle22' })
          }
          modalType={type === 'next' ? 'next' : 'key'}
          visible={visible}
          fetch={
            type === 'next'
              ? postPurchaseConfirmQuotedPriceLaunchTurnQuotedPrice
              : postPurchaseConfirmQuotedPriceDecryptQuotedPrice
          }
          onCancel={() => setVisible(false)}
          onOk={handleOnOk}
        />
      </Card>
    </BidDetailContext.Provider>
  )
}
export default ContrastLyout1
