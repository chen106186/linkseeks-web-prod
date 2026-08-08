import React, { useContext, useEffect, useState } from 'react'
import { Card } from '@linkseeks/ui'
import { PRICECONTRAST_TYPE } from '../../../../constants'
import { Tabs, message, Row, Col, Typography, Skeleton, Divider, Empty, Pagination } from 'antd'
import { FilePdfOutlined } from '@ant-design/icons'
import RowLayout from './rowLayout'
import { Context, BidDetailContext } from '../context'
import BidTable from '../bidTable'
import style from './rowLayout/index.less'
import {
  getPurchaseConfirmQuotedPriceQuotedPriceInfo,
  getPurchaseConfirmQuotedPriceRightOffContrastPrice,
} from '@apps/apis'

const chNum: { [key: number]: string } = {
  1: '一',
  2: '二',
  3: '三',
  4: '四',
  5: '五',
  6: '六',
  7: '七',
  8: '八',
  9: '九',
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
}

const ContrastLyout1: React.FC<IProps> = (props: any) => {
  const {
    query: { id, turn },
    redux,
    preview,
  } = props
  const context = useContext(Context)
  const [count, setCount] = useState<any>([])
  const [soure, setSoure] = useState<any>({})
  const [total, setTotal] = useState<number>(0)
  const [size, setSize] = useState<SizeType>({
    pageSize: '4',
    current: '1',
  })
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
    setDisabled(flag)
  }

  /** 格式化数据 */
  const formatting = (data: any, index: number) => {
    console.log(index, 10086)
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
      let companyArr: any = []
      data.forEach((it: any) => {
        const sort = it.awardInfoResponses.sort((a, b) => {
          return a.goodsId - b.goodsId
        })
        let cItem: any = {
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
    if (preview) {
      redux(params)
    }
  }

  /** 点击比价 */
  const offContrastPrice = async (num: string, key: number, i: number) => {
    if (key === PRICECONTRAST_TYPE.UNENCRYPTED) {
      handleFlag(true)
      const params = {
        id,
        turn: num,
      }
      await getPurchaseConfirmQuotedPriceRightOffContrastPrice({ ...params }, { ctrlType: 'none' })
        .then((res: any) => {
          if (res.code === 1000) {
            const { data } = res
            if (data.length > 0) {
              formatting(data, i)
            } else {
              message.error('当前暂无比价信息')
              setDisabled(true)
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
      message.error('当前报价为密封报价，请先解密报价单')
    }
  }

  /** 获取报价会员信息
   * t: 轮次
   * i: 当前tab 下标
   */
  const fetchTableData = async (t: string, i: number, page?: any) => {
    const param: any = {
      id,
      turn: t,
      pageSize: '4',
      current: page ? page : '1',
    }
    await getPurchaseConfirmQuotedPriceQuotedPriceInfo({ ...param }).then((res) => {
      if (res.code !== 1000) {
        return
      }
      const { data } = res.data
      setTotal(res.data.totalCount)
      const params: any = { ...rowSource }
      params[i] = [...data]
      if (data.length > 0) {
        setEncrypt(data[0].isDecrypt)
        setRowSource(params)
        /**
         * 1. 比价的 需要 报价轮次不等于当前(表示已经报过假的) 并且preview 为 false 就要显示比价信息
         * 2. preview 为 ture 表示查看详情的 立即调用比价接口
         */
        const index = i ? i : idx
        if (t !== turn && !preview) {
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

  const reduxFetch = (data: any) => {
    redux(data)
  }

  const handlePagination = (page) => {
    fetchTableData(turn, idx, page)
  }

  return (
    <BidDetailContext.Provider value={soure[idx]}>
      <Card id="contrastLyout" title="报价信息">
        <Tabs onChange={getQuotedPriceInfo}>
          {count.map((item: number, index: number) => (
            <Tabs.TabPane key={`${item}-${index}`} data-index={index} tab={`第${chNum[item]}轮`}>
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
                  <div className={style.divider}>
                    <div>
                      <Divider type="vertical" className={style.vertical} />
                      比价信息
                    </div>
                  </div>
                  <BidTable preview={bool ? bool : preview} redux={reduxFetch} />
                </>
              )}
            </Tabs.TabPane>
          ))}
        </Tabs>
        {preview && (
          <Row gutter={[0, 4]} style={{ marginTop: '1em' }}>
            {context.awardComments && (
              <Col span={24}>
                <div className={style['card-list']}>
                  <Row>
                    <Col span={2}>
                      <p className={style['card-list_title']}>授标意见:</p>
                    </Col>
                    <Col>
                      <p>{context.awardComments}</p>
                    </Col>
                  </Row>
                </div>
              </Col>
            )}
            {context.urls && (
              <Col span={24}>
                <div className={style['card-list']}>
                  <Row>
                    <Col span={2}>
                      <p className={style['card-list_title']}>附件:</p>
                    </Col>
                    <Col>
                      {context.urls &&
                        context.urls.map((item, index) => (
                          <p key={`urls_${index + 1}`} className={style['card-list_file']}>
                            <FilePdfOutlined className={style[`card-list_fileicon`]} />
                            <Typography.Link href={item.url} target="_blank">
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
      </Card>
    </BidDetailContext.Provider>
  )
}
export default ContrastLyout1
