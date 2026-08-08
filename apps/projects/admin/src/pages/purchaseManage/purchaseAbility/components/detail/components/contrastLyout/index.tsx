import React, { useContext, useEffect, useRef, useState } from 'react'
import { Space, Button, Tabs, Divider, Skeleton, Typography, message, Row, Col } from 'antd'
import { history } from '@linkseeks/router-manager'
import { formatTimeString } from '@/utils'
import { Card } from '@linkseeks/ui'
import { PRICECONTRAST_TYPE } from '../../../../constants'
import style from './index.less'
import { EyeAuthButton, StandardFormTable } from '@apps/components'
import BidTable from '../bidTable'
import { Context, BidDetailContext } from '../context'
import { useBidTable } from '../../../effects/useBidTable'
import { FilePdfOutlined } from '@ant-design/icons'
import {
  getPurchaseConfirmQuotedPriceQuotedPriceInfo,
  getPurchaseConfirmQuotedPriceRightOffContrastPrice,
} from '@apps/apis'

export interface ContrastProps {
  effect?: any
  redux?(e: any)
  preview?: boolean
}

const ContrastLyout: React.FC<ContrastProps> = (props: any) => {
  const {
    effect: { id, turn },
    redux,
    preview,
  } = props
  const {
    formContext: {
      dataSource,
      ctl: { setDataSource },
    },
  } = useBidTable()
  const ref = useRef<any>({})
  const context = useContext(Context)
  const [loading, setLoading] = useState<boolean>(false)
  const [disabled, setDisabled] = useState<boolean>(false)
  const [type, setType] = useState<string>('')
  const [visible, setVisible] = useState<boolean>(false)
  const [iturn, setTurn] = useState<number[]>([])
  const [isDecrypt, setIsDecrypt] = useState<number>()
  const columns = [
    {
      title: '报价单号/摘要',
      key: 'quotedPriceNo',
      dataIndex: 'quotedPriceNo',
      render: (text: any, record: any) => (
        <Space direction="vertical">
          <EyeAuthButton
            url={`/memberCenter/procurementAbility/confirmOffer/quote/detail?id=${record.id}&number=${record.quotedPriceNo}`}
          >
            {text}
          </EyeAuthButton>
          <Typography.Text>{record.details}</Typography.Text>
        </Space>
      ),
    },
    {
      title: '报价会员',
      key: 'createMemberName',
      dataIndex: 'createMemberName',
    },
    {
      title: '报价时间',
      key: 'createTime',
      dataIndex: 'createTime',
      render: (text: any, record: any) => <Typography.Text>{formatTimeString(text)}</Typography.Text>,
    },
    {
      title: '报价总额',
      key: 'sumPrice',
      dataIndex: 'sumPrice',
    },
    {
      title: '联系人/电话',
      key: 'contacts',
      dataIndex: 'contacts',
      render: (text: any, record: any) => (
        <Space direction="vertical">
          <Typography.Text>{text}</Typography.Text>
          <Typography.Text>{record.tel}</Typography.Text>
        </Space>
      ),
    },
    {
      title: '解密状态',
      key: 'isDecrypt',
      dataIndex: 'isDecrypt',
      render: (text: any, record: any) => <Typography.Text>{text === 1 ? '未加密' : '未解密'}</Typography.Text>,
    },
  ]

  const fetchTableData = (params: any) => {
    return new Promise((resolve) => {
      getPurchaseConfirmQuotedPriceQuotedPriceInfo({ ...params, id, turn }).then((res) => {
        if (res.code === 1000) {
          resolve(res.data)
        }
      })
    })
  }

  const setBoolean = (flag: boolean) => {
    setLoading(flag)
    setDisabled(flag)
  }

  /** 格式化数据 */
  const formatting = (data: any) => {
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
      item.company = companyArr
      params.push(item)
    })
    setDataSource(params)
    if (preview) {
      redux(params)
    }
  }

  /** 立即比价 */
  const atonceContrast = () => {
    const PRICECONTRAST = context.priceContrast
    if (PRICECONTRAST === PRICECONTRAST_TYPE.UNENCRYPTED) {
      setBoolean(true)
      const params = {
        id,
        turn,
      }
      getPurchaseConfirmQuotedPriceRightOffContrastPrice(params)
        .then((res: any) => {
          if (res.code === 1000) {
            const { data } = res
            if (data.length > 0) {
              formatting(data)
            } else {
              message.error('当前暂无比价信息')
              setDisabled(true)
            }
            setLoading(false)
          } else {
            setBoolean(false)
          }
        })
        .catch((err) => {
          setBoolean(false)
        })
    } else {
      message.error('当前报价为密封报价，请先解密报价单')
    }
  }

  const reduxFetch = (data: any) => {
    redux(data)
  }

  useEffect(() => {
    if (preview && Object.keys(context).length > 0) {
      atonceContrast()
    }
  }, [context])

  return (
    <BidDetailContext.Provider value={dataSource}>
      <Card
        id="contrastLyout"
        title="报价信息"
        extra={
          preview ? null : (
            <Space>
              <Button onClick={() => history.goBack()}>发起下轮报价</Button>
              {context.priceContrast === PRICECONTRAST_TYPE.UNDECRYPTED && <Button>解密报价单</Button>}
              <Button type="primary" disabled={disabled} onClick={atonceContrast}>
                立即比价
              </Button>
            </Space>
          )
        }
      >
        <Tabs>
          <Tabs.TabPane key="1" tab="第一轮">
            <div className={style.divider}>
              <Divider type="vertical" className={style.vertical} />
              供应商信息
            </div>
            <StandardFormTable
              columns={columns}
              autoScrollX
              rowKey="id"
              request={(params: any) => fetchTableData(params)}
            />
            <Skeleton active loading={loading} />
            {dataSource.length > 0 && (
              <>
                <div className={style.divider}>
                  <Divider type="vertical" className={style.vertical} />
                  比价信息
                </div>
                <BidTable preview={preview} redux={reduxFetch} />
              </>
            )}
          </Tabs.TabPane>
        </Tabs>
        {preview && (
          <Row gutter={[0, 4]} style={{ marginTop: '1em' }}>
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
                          <Typography.Link href={item.url}>{item.name}</Typography.Link>
                        </p>
                      ))}
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        )}
      </Card>
    </BidDetailContext.Provider>
  )
}
export default ContrastLyout
