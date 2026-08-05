import React, { useContext } from 'react'
import { Row, Col, Checkbox, InputNumber, Divider, Form, Typography } from 'antd'
import style from './index.less'
import { useBidTable } from '../../../effects/useBidTable'
import cx from 'classnames'
import { BidDetailContext } from '../context'
import level1 from '@/assets/icons/the_first.png'
import level2 from '@/assets/icons/the_second.png'
import level3 from '@/assets/icons/the_third.png'
import { CheckCircleOutlined } from '@ant-design/icons'

export interface ReduxProps {
  redux?(e: any)
  preview?: boolean
}

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

  return (
    <div className={style.bidConfirmWrapper}>
      <Form form={form}>
        <Row gutter={[0, 4]} className={style.bidRowWrapper}>
          <Col span={24}>
            <Row wrap={false}>
              <Col span={4}>
                <p className={style.bidTableHead}>采购物料</p>
              </Col>
              <Col span={4}>
                <p className={style.bidTableHead}>采购数量</p>
              </Col>
              {bidDetailContext[0].company.map((item: any, idx: number) => (
                <Col span={4} key={`company${idx + 1}`}>
                  <p className={style.bidTableHead}>
                    {item.ranking === 1 && <img src={level1} alt={`排名${idx + 1}`} />}
                    {item.ranking === 2 && <img src={level2} alt={`排名${idx + 1}`} />}
                    {item.ranking === 3 && <img src={level3} alt={`排名${idx + 1}`} />}
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
                        <Col span={8}>
                          <p className={style['card-list_title']}>物料编号:</p>
                        </Col>
                        <Col>
                          <p>{item.number}</p>
                        </Col>
                      </Row>
                    </div>
                    <div className={style['card-list']}>
                      <Row>
                        <Col span={8}>
                          <p className={style['card-list_title']}>物料名称:</p>
                        </Col>
                        <Col>
                          <p>{item.name}</p>
                        </Col>
                      </Row>
                    </div>
                    <div className={style['card-list']}>
                      <Row>
                        <Col span={8}>
                          <p className={style['card-list_title']}>规格型号:</p>
                        </Col>
                        <Col>
                          <p>{item.model}</p>
                        </Col>
                      </Row>
                    </div>
                    <div className={style['card-list']}>
                      <Row>
                        <Col span={8}>
                          <p className={style['card-list_title']}>品类:</p>
                        </Col>
                        <Col>
                          <p>{item.category}</p>
                        </Col>
                      </Row>
                    </div>
                    <div className={style['card-list']}>
                      <Row>
                        <Col span={8}>
                          <p className={style['card-list_title']}>品牌:</p>
                        </Col>
                        <Col>
                          <p>{item.brand}</p>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </Col>
                <Col span={4}>
                  <div className={style.amountInfo}>
                    <span>{item.purchaseCount}</span>
                    <br />
                    <span style={{ color: '#909399' }}>({item.unit})</span>
                  </div>
                </Col>
                {item.company.map((it: any, idx: number) => (
                  <Col span={4} key={`company${idx + 1}`}>
                    <div className={cx(style.throwBidInfo, it.isPrize && !preview && style.isPrizeStyle)}>
                      <div className={style['card-list']}>
                        <Row>
                          <Col span={8}>
                            <p className={style['card-list_title']}>含税单价:</p>
                          </Col>
                          <Col>
                            <p>￥{toFixedPrice(it.taxUnitPrice)}</p>
                          </Col>
                        </Row>
                      </div>
                      <div className={style['card-list']}>
                        <Row>
                          <Col span={8}>
                            <p className={style['card-list_title']}>含税金额:</p>
                          </Col>
                          <Col>
                            <p>￥{toFixedPrice(it.taxPrice)}</p>
                          </Col>
                        </Row>
                      </div>
                      <div className={style['card-list']}>
                        <Row>
                          <Col span={8}>
                            <p className={style['card-list_title']}>是否含税:</p>
                          </Col>
                          <Col>
                            <p>{it.isTax === 1 ? '是' : '否'}</p>
                          </Col>
                        </Row>
                      </div>
                      <div className={style['card-list']}>
                        <Row>
                          <Col span={8}>
                            <p className={style['card-list_title']}>税率:</p>
                          </Col>
                          <Col>
                            <p>{it.taxProbability}%</p>
                          </Col>
                        </Row>
                      </div>
                      <div className={style['card-list']}>
                        <Row wrap={false}>
                          <Col span={8}>
                            <p className={style['card-list_title']}>授标:</p>
                          </Col>
                          <Col>
                            <div style={{ display: 'flex' }}>
                              {!preview && (
                                <>
                                  <Form.Item noStyle>
                                    <Checkbox
                                      defaultChecked={it.isPrize}
                                      style={{ marginRight: 16 }}
                                      onChange={(e) => chanegChecked(e, index, idx)}
                                    />
                                  </Form.Item>
                                  <Form.Item
                                    name={`awardTaxProbability_${index}_${idx}`}
                                    style={{
                                      marginBottom: 0,
                                      display: it.isPrize ? 'block' : 'none',
                                    }}
                                    rules={[
                                      {
                                        required: true,
                                        message: ``,
                                      },
                                    ]}
                                    initialValue={it.awardTaxProbability}
                                  >
                                    <InputNumber min={0} max={100} onChange={(v) => onChangeInput(v, index, idx)} />
                                  </Form.Item>
                                </>
                              )}
                              {preview && (
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                  <Typography.Text>{it.isPrize ? `${it.awardTaxProbability}%` : '-'}</Typography.Text>
                                  {it.isPrize && (
                                    <CheckCircleOutlined
                                      style={{
                                        color: '#00A98F',
                                        fontSize: '12px',
                                        marginLeft: '4px',
                                      }}
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
                        <Col span={8}>
                          <p className={style['card-list_title']}>报价小计:</p>
                        </Col>
                        <Col>
                          <p>¥{toFixedPrice(it.subtotal)}(含税)</p>
                        </Col>
                      </Row>
                    </div>
                    <div className={style['card-list']}>
                      <Row>
                        <Col span={8}>
                          <p className={style['card-list_title']}>报价排名:</p>
                        </Col>
                        <Col>
                          <p>{it.ranking}</p>
                        </Col>
                      </Row>
                    </div>
                    <div className={style['card-list']}>
                      <Row>
                        <Col span={8}>
                          <p className={style['card-list_title']}>最低标价:</p>
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
                        <Col span={8}>
                          <p className={style['card-list_title']}>授标数量:</p>
                        </Col>
                        <Col>
                          <p>{it.awardCount}</p>
                        </Col>
                      </Row>
                    </div>
                    <div className={style['card-list']}>
                      <Row>
                        <Col span={8}>
                          <p className={style['card-list_title']}>授标总额:</p>
                        </Col>
                        <Col>
                          <p>¥{toFixedPrice(it.sumPrice)}(含税)</p>
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
