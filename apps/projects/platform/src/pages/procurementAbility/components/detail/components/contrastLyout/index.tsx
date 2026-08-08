import React, { useContext, useEffect, useState, useRef } from 'react'
import { Space, Button, Tabs, Divider, Skeleton, Typography, message, Row, Col, Tooltip } from 'antd'
import StandardTable from '@/components/StandardTable'
import { getIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { formatTimeString } from '@/utils'
import Card from '../../../card'
import { PRICECONTRAST_TYPE } from '../../../../constants'
import style from './index.less'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import BidTable from '../bidTable'
import { Context, BidDetailContext } from '../context'
import { FilePdfOutlined } from '@ant-design/icons'
import ModalOperate from '../../../modalOperate'
import { useBidTable } from '../../../effects/useBidTable'
import {
  getPurchaseConfirmQuotedPriceQuotedPriceInfo,
  getPurchaseConfirmQuotedPriceRightOffContrastPrice,
  postPurchaseConfirmQuotedPriceDecryptQuotedPrice,
  postPurchaseConfirmQuotedPriceLaunchTurnQuotedPrice,
} from '@apps/apis'
import { getWebIntl } from '@apps/locales'
const intl = getIntl()
const translate = getWebIntl()
export interface ContrastProps {
  effect?: any
  redux?(e: any)
  preview?: boolean
}

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
  const [iturn, setTurn] = useState<Array<number>>([])
  const [isDecrypt, setIsDecrypt] = useState<number>()
  /** 当前的轮次 */
  const [count, setCount] = useState<number>(turn)
  const columns = [
    {
      title: intl.formatMessage({ id: 'table.purchase.purchaseInquiryNoDtails' }),
      key: 'quotedPriceNo',
      dataIndex: 'quotedPriceNo',
      render: (text: any, record: any) => (
        <Space direction="vertical">
          {record.isDecrypt === PRICECONTRAST_TYPE.UNENCRYPTED && (
            <EyeAuthButton
              url={`/procurementAbility/confirmOffer/quote?id=${record.id}&number=${record.quotedPriceNo}&turn=${record.turn}`}
            >
              {text}
            </EyeAuthButton>
          )}
          {record.isDecrypt === PRICECONTRAST_TYPE.UNDECRYPTED && (
            <Tooltip placement="topLeft" title={intl.formatMessage({ id: 'detail.purchase.message81' })}>
              <Typography.Text type="success">{text}</Typography.Text>
            </Tooltip>
          )}
          <Typography.Text>{record.details}</Typography.Text>
        </Space>
      ),
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.quotedMenber' }),
      key: 'createMemberName',
      dataIndex: 'createMemberName',
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.purchaseInquiryNoCreateTime' }),
      key: 'createTime',
      dataIndex: 'createTime',
      render: (text: any, record: any) => <Typography.Text>{formatTimeString(text)}</Typography.Text>,
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.sumPrice' }),
      key: 'sumPrice',
      dataIndex: 'sumPrice',
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.contactsPhone' }),
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
      title: intl.formatMessage({ id: 'table.purchase.isDecrypt' }),
      key: 'isDecrypt',
      dataIndex: 'isDecrypt',
      render: (text: any) => (
        <Typography.Text>
          {text === 1
            ? intl.formatMessage({ id: 'detail.purchase.label39' })
            : intl.formatMessage({ id: 'detail.purchase.label40' })}
        </Typography.Text>
      ),
    },
  ]

  /** 轮次 */
  const handleTurn = (num: number) => {
    let isTurn: Array<number> = []
    for (let i = 0; i < num; i += 1) {
      isTurn.push(i + 1)
    }
    setTurn(isTurn.reverse())
  }

  const fetchTableData = (params: any) => {
    return new Promise((resolve) => {
      getPurchaseConfirmQuotedPriceQuotedPriceInfo({ ...params, id, turn: count })
        .then((res) => {
          if (res.code === 1000) {
            resolve(res.data)
            if (res.data.data.length > 0) {
              setIsDecrypt(res.data.data[0].isDecrypt)
            }
          }
        })
        .catch((error) => {
          console.warn(error)
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
      /** 排名排序 */
      const companySort = companyArr.sort((a, b) => a.ranking - b.ranking)
      item.company = companySort
      params.push(item)
    })
    setDataSource(params)
    if (preview) {
      redux(params)
      console.log(params, data)
    }
  }

  /** 立即比价 */
  const atonceContrast = async () => {
    const PRICECONTRAST = isDecrypt
    if (PRICECONTRAST === PRICECONTRAST_TYPE.UNENCRYPTED) {
      setBoolean(true)
      const params = {
        id,
        turn: count.toString(),
      }
      await getPurchaseConfirmQuotedPriceRightOffContrastPrice({ ...params }, { ctrlType: 'none' })
        .then((res: any) => {
          if (res.code === 1000) {
            const { data } = res
            if (data.length > 0) {
              formatting(data)
            } else {
              message.error(intl.formatMessage({ id: 'detail.purchase.message80' }))
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
      message.error(intl.formatMessage({ id: 'detail.purchase.message81' }))
    }
  }

  const reduxFetch = (data: any) => {
    redux(data)
  }

  useEffect(() => {
    if (preview && Object.keys(context).length > 0) {
      if (isDecrypt === PRICECONTRAST_TYPE.UNENCRYPTED) {
        atonceContrast()
      }
      handleTurn(turn)
    }
  }, [context, isDecrypt])

  const handleSubmit = (type: string) => {
    setVisible(true)
    setType(type)
  }

  const handleOnChang = (e: any) => {
    console.log(ref.current)
    setCount(e)
  }

  return (
    <BidDetailContext.Provider value={dataSource}>
      <Card
        id="contrastLyout"
        title={intl.formatMessage({ id: 'detail.purchase.offerLayout' })}
        extra={
          preview ? null : (
            <Space>
              <Button onClick={() => handleSubmit('next')}>
                {intl.formatMessage({ id: 'detail.purchase.modalTitle15' })}
              </Button>
              {isDecrypt === PRICECONTRAST_TYPE.UNDECRYPTED && (
                <Button onClick={() => handleSubmit('key')}>
                  {intl.formatMessage({ id: 'detail.purchase.modalTitle16' })}
                </Button>
              )}
              <Button type="primary" disabled={disabled} onClick={atonceContrast}>
                {intl.formatMessage({ id: 'detail.purchase.modalTitle17' })}
              </Button>
            </Space>
          )
        }
      >
        <Tabs onChange={handleOnChang}>
          {iturn.map((item: any) => (
            <Tabs.TabPane
              key={item}
              tab={`${intl.formatMessage({ id: 'detail.purchase.label4' })}${chNum[item]}${intl.formatMessage({
                id: 'detail.purchase.label29',
              })}`}
            >
              <div className={style.divider}>
                <Divider type="vertical" className={style.vertical} />
                {intl.formatMessage({ id: 'detail.purchase.modalTitle18' })}
              </div>
              {/* <StandardTable
                currentRef={ref}
                columns={columns}
                tableProps={{ rowKew: 'id' }}
                fetchTableData={(params: any) => fetchTableData(params)}
              /> */}
              <Skeleton active loading={loading} />
              {dataSource.length > 0 && (
                <>
                  <div className={style.divider}>
                    <Divider type="vertical" className={style.vertical} />
                    {intl.formatMessage({ id: 'detail.purchase.modalTitle19' })}
                  </div>
                  <BidTable preview={preview} redux={reduxFetch} />
                </>
              )}
            </Tabs.TabPane>
          ))}
        </Tabs>
        {preview && (
          <Row gutter={[0, 4]} style={{ marginTop: '1em' }}>
            <Col span={24}>
              <div className={style['card-list']}>
                <Row>
                  <Col span={2}>
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
            <Col span={24}>
              <div className={style['card-list']}>
                <Row>
                  <Col span={2}>
                    <p className={style['card-list_title']}>{intl.formatMessage({ id: 'detail.purchase.file' })}:</p>
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
          </Row>
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
          onOk={() => history.goBack()}
        />
      </Card>
    </BidDetailContext.Provider>
  )
}
export default ContrastLyout
