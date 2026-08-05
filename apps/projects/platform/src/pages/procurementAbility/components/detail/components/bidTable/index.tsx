import React, { useContext } from 'react'
import { Row, Col, Checkbox, InputNumber, Form, Typography, Space, Tooltip } from 'antd'
import style from './index.less'
import { useBidTable } from '../../../effects/useBidTable'
import { BidDetailContext } from '../context'
import level1 from '@/assets/icons/the_first.png'
import level2 from '@/assets/icons/the_second.png'
import level3 from '@/assets/icons/the_third.png'
import { CheckCircleOutlined } from '@ant-design/icons'
import cx from 'classnames'
import { getIntl } from '@linkseeks/i18n'

export interface ReduxProps {
  redux?(e: any)
  preview?: boolean
}

const intl = getIntl()

const BidTable: React.FC<ReduxProps> = (props: any) => {
  const { redux, preview } = props
  const [form] = Form.useForm()
  const {
    formContext: {
      ctl: { setDataSource },
    },
  } = useBidTable()

  /**
   *
   * @param v
   * @param index 最外层数据下标
   * @param idx 当前选择的公司下标
   * @param checked 是否选择
   */
  const setAwardTaxProbability = (v, index, idx, checked?) => {
    const params = [...bidDetailContext]
    const company = [...params[index].company]
    company[idx].awardTaxProbability = v
    company[idx].isPrize = checked ? 1 : 0
    let sumPrice = 0
    let awardCount = 0
    let taxPrice = (company[idx].taxPrice * v) / 100
    let sprize = company[idx].isPrize
    company[idx].vPrice = taxPrice
    company[idx].sprize = sprize
    /** 待优化 */
    params.map((item) => {
      item.company.map((items, oIndex) => {
        if (items.vPrice && oIndex === idx) {
          sumPrice += items.vPrice
          awardCount += items.sprize
        }
      })
    })
    params.map((item) => {
      item.company.map((items, oIndex) => {
        if (oIndex === idx) {
          items.sumPrice = sumPrice
          items.awardCount = awardCount
        }
      })
    })
    setDataSource([...params])
    redux([...params])
  }

  const bidDetailContext = useContext(BidDetailContext)

  const onChangeInput = (v, index, idx) => {
    setAwardTaxProbability(v, index, idx, true)
  }

  const chanegChecked = (e, index, idx) => {
    if (e.target.checked) {
      // e.nativeEvent.path[8].style.border = '2px solid #00A98F';
      // e.nativeEvent.path[2].nextSibling.style.display = 'flex';
      setAwardTaxProbability(100, index, idx, e.target.checked)
      form.setFieldsValue({
        [`awardTaxProbability_${index}_${idx}`]: 100,
      })
    } else {
      // e.nativeEvent.path[8].style.border = 'none';
      // e.nativeEvent.path[2].nextSibling.style.display = 'none';
      setAwardTaxProbability(0, index, idx, e.target.checked)
      form.setFieldsValue({
        [`awardTaxProbability_${index}_${idx}`]: undefined,
      })
    }
  }

  const toFixedPrice = (price: number) => {
    return price.toFixed(2)
  }

  const _returnPrizeTotal = (num1: string | number, num2: string | number) => {
    return Math.round((Number(num1) / 100) * Number(num2))
  }

  return (
    <div className={style.bidConfirmWrapper}>
      <Form form={form}>
        <Row gutter={[0, 4]} className={style.bidRowWrapper}>
          <Col span={24}>
            <Row wrap={false}>
              <Col span={4}>
                <p className={style.bidTableHead}>{intl.formatMessage({ id: 'detail.purchase.materialLayout' })}</p>
              </Col>
              <Col span={4}>
                <p className={style.bidTableHead}>{intl.formatMessage({ id: 'detail.purchase.purchaseCount' })}</p>
              </Col>
              {bidDetailContext[0].company.map((item: any, idx: number) => (
                <Col span={4} key={`company${idx + 1}`}>
                  <p className={style.bidTableHead}>
                    {item.ranking === 1 && (
                      <img src={level1} alt={`${intl.formatMessage({ id: 'detail.purchase.label30' })}${idx + 1}`} />
                    )}
                    {item.ranking === 2 && (
                      <img src={level2} alt={`${intl.formatMessage({ id: 'detail.purchase.label30' })}${idx + 1}`} />
                    )}
                    {item.ranking === 3 && (
                      <img src={level3} alt={`${intl.formatMessage({ id: 'detail.purchase.label30' })}${idx + 1}`} />
                    )}
                    {item.ranking > 3 && <span className={style.levelCircle}>{idx + 1}</span>}
                    {item.memberName}
                  </p>
                </Col>
              ))}
            </Row>
            {bidDetailContext.map((item: any, index: number) => (
              <Row
                key={`row${index + 1}`}
                wrap={false}
                gutter={[0, 4]}
                style={{ backgroundColor: '#FFFFFF', marginBottom: '4px' }}
              >
                <Col span={4}>
                  <div className={style.materialInfo}>
                    <span className={style.rankNumber}>{index + 1}</span>
                    <div className={style['card-list']}>
                      <Row>
                        <Col span={10}>
                          <p className={style['card-list_title']}>
                            {intl.formatMessage({ id: 'detail.purchase.materialCode' })}:
                          </p>
                        </Col>
                        <Col>
                          <p>{item.number}</p>
                        </Col>
                      </Row>
                    </div>
                    <div className={style['card-list']}>
                      <Row>
                        <Col span={10}>
                          <p className={style['card-list_title']}>
                            {intl.formatMessage({ id: 'detail.purchase.materialName' })}:
                          </p>
                        </Col>
                        <Col>
                          <p>{item.name}</p>
                        </Col>
                      </Row>
                    </div>
                    <div className={style['card-list']}>
                      <Row>
                        <Col span={10}>
                          <p className={style['card-list_title']}>
                            {intl.formatMessage({ id: 'detail.purchase.nameCode' })}:
                          </p>
                        </Col>
                        <Col>
                          <p>{item.model}</p>
                        </Col>
                      </Row>
                    </div>
                    <div className={style['card-list']}>
                      <Row>
                        <Col span={10}>
                          <p className={style['card-list_title']}>
                            {intl.formatMessage({ id: 'detail.purchase.customerCategory' })}:
                          </p>
                        </Col>
                        <Col>
                          <p>{item.category}</p>
                        </Col>
                      </Row>
                    </div>
                    <div className={style['card-list']}>
                      <Row>
                        <Col span={10}>
                          <p className={style['card-list_title']}>
                            {intl.formatMessage({ id: 'detail.purchase.brand' })}:
                          </p>
                        </Col>
                        <Col>
                          <p>{item.brand}</p>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </Col>
                <Col span={2}>
                  <div className={style.amountInfo}>
                    <span>{item.purchaseCount}</span>
                    <br />
                    <span style={{ color: '#909399' }}>({item.unit})</span>
                  </div>
                </Col>
                {item.company.map((it: any, idx: number) => (
                  <Col span={5} key={`company${idx + 1}`}>
                    <div className={cx(style.throwBidInfo, it.isPrize && !preview && style.isPrizeStyle)}>
                      <div className={style['card-list']}>
                        <Row>
                          <Col span={10}>
                            <p className={style['card-list_title']}>
                              {intl.formatMessage({ id: 'detail.purchase.label33' })}:
                            </p>
                          </Col>
                          <Col>
                            <p>
                              {intl.formatMessage({ id: 'common.money' })}
                              {it.taxUnitPrice.toFixed(4)}
                            </p>
                          </Col>
                        </Row>
                      </div>
                      <div className={style['card-list']}>
                        <Row>
                          <Col span={10}>
                            <p className={style['card-list_title']}>
                              {intl.formatMessage({ id: 'detail.purchase.label32' })}:
                            </p>
                          </Col>
                          <Col>
                            <p>
                              {intl.formatMessage({ id: 'common.money' })}
                              {toFixedPrice(it.taxPrice)}
                            </p>
                          </Col>
                        </Row>
                      </div>
                      <div className={style['card-list']}>
                        <Row>
                          <Col span={10}>
                            <p className={style['card-list_title']}>
                              {intl.formatMessage({ id: 'detail.purchase.label31' })}:
                            </p>
                          </Col>
                          <Col>
                            <p>
                              {it.isTax === 1
                                ? intl.formatMessage({ id: 'detail.purchase.okText' })
                                : intl.formatMessage({ id: 'detail.purchase.cancelText' })}
                            </p>
                          </Col>
                        </Row>
                      </div>
                      <div className={style['card-list']}>
                        <Row>
                          <Col span={10}>
                            <p className={style['card-list_title']}>
                              {intl.formatMessage({ id: 'detail.purchase.taxProbability' })}:
                            </p>
                          </Col>
                          <Col>
                            <p>{it.taxProbability}%</p>
                          </Col>
                        </Row>
                      </div>
                      <div className={style['card-list']}>
                        <Row wrap={false}>
                          <Col span={10}>
                            <p className={style['card-list_title']}>
                              {intl.formatMessage({ id: 'detail.purchase.isAward' })}:
                            </p>
                          </Col>
                          <Col>
                            <div style={{ display: 'flex' }}>
                              {!preview && (
                                <Tooltip
                                  title={`${intl.formatMessage({
                                    id: 'detail.purchase.procurementQuantityAwarded',
                                  })}${_returnPrizeTotal(it.awardTaxProbability, item.purchaseCount)}${item.unit}`}
                                  overlayClassName={style['prizeTotal']}
                                >
                                  <Space>
                                    <Form.Item noStyle>
                                      <Checkbox
                                        defaultChecked={it.isPrize}
                                        style={{ marginRight: 16 }}
                                        onChange={(e) => chanegChecked(e, index, idx)}
                                      />
                                    </Form.Item>
                                    <Form.Item
                                      name={`awardTaxProbability_${index}_${idx}`}
                                      style={{ marginBottom: 0, display: it.isPrize ? 'block' : 'none' }}
                                      rules={[
                                        {
                                          required: true,
                                          message: ``,
                                        },
                                      ]}
                                      initialValue={it.awardTaxProbability}
                                    >
                                      <InputNumber
                                        style={{ width: '120px' }}
                                        min={0}
                                        max={100}
                                        onChange={(v) => onChangeInput(v, index, idx)}
                                        addonAfter={'%'}
                                      />
                                    </Form.Item>
                                  </Space>
                                </Tooltip>
                              )}
                              {preview && (
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                  <Typography.Text>{it.isPrize ? `${it.awardTaxProbability}%` : '-'}</Typography.Text>
                                  {it.isPrize && (
                                    <CheckCircleOutlined
                                      style={{ color: '#00A98F', fontSize: '12px', marginLeft: '4px' }}
                                    />
                                  )}
                                </div>
                              )}
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            ))}
            <Row wrap={false} gutter={[0, 4]} style={{ backgroundColor: '#FFFFFF' }}>
              <Col span={4} />
              <Col span={4} />
              {bidDetailContext[0].company.map((it: any, idx: number) => (
                <Col span={4} key={`company${idx + 1}`}>
                  <div className={style.throwBidInfo} style={{ height: 'auto', paddingBottom: '0' }}>
                    <div className={style['card-list']}>
                      <Row>
                        <Col span={11}>
                          <p className={style['card-list_title']}>
                            {intl.formatMessage({ id: 'detail.purchase.label34' })}:
                          </p>
                        </Col>
                        <Col>
                          <p>
                            {intl.formatMessage({ id: 'common.money' })}
                            {toFixedPrice(it.subtotal)}({intl.formatMessage({ id: 'detail.purchase.isTax' })})
                          </p>
                        </Col>
                      </Row>
                    </div>
                    <div className={style['card-list']}>
                      <Row>
                        <Col span={11}>
                          <p className={style['card-list_title']}>
                            {intl.formatMessage({ id: 'detail.purchase.offerRank' })}:
                          </p>
                        </Col>
                        <Col>
                          <p>{it.ranking}</p>
                        </Col>
                      </Row>
                    </div>
                    <div className={style['card-list']}>
                      <Row>
                        <Col span={11}>
                          <p className={style['card-list_title']}>
                            {intl.formatMessage({ id: 'detail.purchase.label35' })}:
                          </p>
                        </Col>
                        <Col>
                          <p>{it.minimum}</p>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
            <Row wrap={false} gutter={[0, 4]} style={{ backgroundColor: '#FFFFFF', borderTop: '1px dashed #F4F5F7' }}>
              <Col span={4} />
              <Col span={4} />
              {bidDetailContext[0].company.map((it: any, idx: number) => (
                <Col span={4} key={`company${idx + 1}`}>
                  <div className={style.throwBidInfo} style={{ height: 'auto', paddingTop: '5px' }}>
                    <div className={style['card-list']}>
                      <Row>
                        <Col span={11}>
                          <p className={style['card-list_title']}>
                            {intl.formatMessage({ id: 'detail.purchase.isAward' })}
                            {intl.formatMessage({ id: 'detail.purchase.label36' })}:
                          </p>
                        </Col>
                        <Col>
                          <p>{it.awardCount}</p>
                        </Col>
                      </Row>
                    </div>
                    <div className={style['card-list']}>
                      <Row>
                        <Col span={11}>
                          <p className={style['card-list_title']}>
                            {intl.formatMessage({ id: 'detail.purchase.isAward' })}
                            {intl.formatMessage({ id: 'detail.purchase.label37' })}:
                          </p>
                        </Col>
                        <Col>
                          <p>
                            {intl.formatMessage({ id: 'common.money' })}
                            {toFixedPrice(it.sumPrice)}({intl.formatMessage({ id: 'detail.purchase.isTax' })})
                          </p>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Form>
    </div>
  )
}
export default BidTable
