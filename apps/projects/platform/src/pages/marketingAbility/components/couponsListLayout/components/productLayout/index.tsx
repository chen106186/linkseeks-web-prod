import { useIntl } from '@linkseeks/i18n'
import React, { Fragment } from 'react'
import { Form, Input, Row, Col, Image, FormInstance } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import style from '../../index.less'
import { formatTimeString, getLadderPrice } from '@/utils'

type ListProps = {
  /** id */
  id?: number
  /** 商品id */
  productId?: number
  /** 商品名称 */
  productName?: string
  /** 品类 */
  category?: string
  /** 品牌 */
  brand?: string
  /** 单位 */
  unit?: string
  /** 商品价格 */
  price?: number
  /** 换购价格 */
  swapPrice?: number
  /** 允许换购数量赠送数量搭配数量 */
  num: number
  /** 赠品主图 */
  productImgUrl?: string
  /** 活动商品id */
  activityGoodsId?: number
  /** 优惠券id */
  couponId?: number
  /** 优惠券名称 */
  couponName?: string
}

type RemindLayoutProps = {
  /** 弹窗标题 */
  modalTitle?: string
  /** 选择商品按钮名称 */
  buttonTitle?: string
  /** 列表标题 */
  listTitle?: string
  /** 列表label */
  label?: { [key: number]: string }
  /** 提醒 */
  message?: { [key: number]: string }
}

export interface ProductLayoutProps {
  /** FormInstance */
  form?: FormInstance
  /** message */
  remind?: RemindLayoutProps
  /** 最外层标号 */
  index: number
  /** list 数据 */
  list: any[]
  /** 删除某一个 */
  onDeletion: (_index: number) => void
  /** 输入数量或者套餐价格 */
  onEntry: (name: string, num: number, _index?: number) => void
  /** 查看 */
  isPreview?: boolean
}

const ProductLayout: React.FC<ProductLayoutProps> = (props: any) => {
  const { form, remind, index, list, onDeletion, onEntry, isPreview } = props
  const intl = useIntl()

  const handleChange = (e, name, _index?) => {
    onEntry(name, Number(e.target.value), _index)
  }

  console.log(list)

  return (
    <Fragment>
      {/* 套餐价格 */}
      <Form.Item
        name={`${remind.type}_${index}`}
        label={remind.label[1]}
        rules={[
          {
            required: true,
            validator: (_rule, value) => {
              const pattern = /(^[1-9](\d+)?(\.\d{1,3})?$)|(^\d\.\d{1,3}$)/
              const pattern1 = /(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/
              if (!value) {
                return Promise.reject(new Error(remind.message[4]))
              }
              if (!pattern.test(value) && remind.label[2] !== intl.formatMessage({ id: 'paltformSign.yuan' })) {
                return Promise.reject(
                  new Error(
                    remind.label[1] + `${intl.formatMessage({ id: 'selfManagement.bixudayu0zuiduobaoliu3wei' })}`,
                  ),
                )
              }
              if (!pattern1.test(value) && remind.label[2] === intl.formatMessage({ id: 'paltformSign.yuan' })) {
                return Promise.reject(
                  new Error(
                    remind.label[1] +
                      `${intl.formatMessage({ id: 'marketingAbility.bixudayu0zuiduobaoliu2weixiaoshu' })}`,
                  ),
                )
              }
              return Promise.resolve()
            },
          },
        ]}
      >
        <Input
          disabled={isPreview}
          addonBefore={remind.type === 'limitValue' && `${intl.formatMessage({ id: 'marketingAbility.mai' })}`}
          addonAfter={remind.label[2]}
          onBlur={(e) => handleChange(e, `${remind.type}`)}
        />
      </Form.Item>
      {/* 搭配商品 */}
      {list.map((_item: any, _index: number) => (
        <div key={`list_${_index + 1}`}>
          <div className={style.productLayout_title}>
            <span className={style.productLayout_arrow}>
              {remind.label[3]}
              {_index + 1}
            </span>
            {!isPreview && <DeleteOutlined onClick={() => onDeletion(_index)} />}
          </div>
          <div className={style.productLayout_contenxt}>
            <Form.Item label={remind.label[3]} className={style.productLayout_formItem}>
              {remind.value === 1 && (
                <div className={style.productLayout_item}>
                  <Row gutter={8} wrap={false}>
                    <Col>
                      <div className={style.productLayout_item_img}>
                        <Image width={80} height={80} src={_item.productImgUrl} />
                      </div>
                    </Col>
                    <Col flex="auto">
                      <div className={style.productLayout_item_title}>{_item.productName}</div>
                      <div className={style.productLayout_item_price}>
                        <span>
                          {intl.formatMessage({ id: 'common.money', defaultMessage: '￥' })}{' '}
                          {getLadderPrice(_item?.price, _item?.num).toFixed(2)}
                        </span>
                        /{_item.unit}
                      </div>
                      <div className={style.productLayout_item_info}>
                        {intl.formatMessage({ id: 'paltformSign.category', defaultMessage: '品类' })}：{_item.category}
                      </div>
                      <div className={style.productLayout_item_info}>
                        {intl.formatMessage({ id: 'paltformSign.brand', defaultMessage: '品牌' })}：{_item.brand}L
                      </div>
                    </Col>
                  </Row>
                </div>
              )}
              {remind.value !== 1 && (
                <div className={style.couponLayout_contenxt}>
                  <Row style={{ height: '100%', marginLeft: 10 }} wrap={false}>
                    <Col flex="none">
                      <div className={style.couponLayout_item_left}>
                        <p>
                          {intl.formatMessage({ id: 'common.money', defaultMessage: '￥' })}
                          <span>{_item.denomination}</span>
                        </p>
                        <p>
                          {intl.formatMessage({ id: 'paltformSign.full', defaultMessage: '满' })}
                          {_item.useConditionMoney}
                          {intl.formatMessage({ id: 'marketingAbility.yuankeyong' })}
                        </p>
                      </div>
                    </Col>
                    <Col flex="auto" style={{ overflow: 'hidden' }}>
                      <div className={style.couponLayout_item_right}>
                        <div className={style.couponLayout_item_right_type}>{_item.typeName}</div>
                        <div className={style.couponLayout_item_right_info}>{_item.name || _item.couponName}</div>
                        <div className={style.couponLayout_item_right_date}>
                          {_item.effectiveType === 1 && (
                            <>
                              {formatTimeString(_item.effectiveTimeStart, 'YYYY-MM-DD')}-
                              {formatTimeString(_item.effectiveTimeEnd, 'YYYY-MM-DD')}
                            </>
                          )}
                          {_item.effectiveType === 2 && (
                            <>
                              {intl.formatMessage({ id: 'marketingAbility.lingqu' })}
                              {_item.invalidDay}
                              {intl.formatMessage({ id: 'marketingAbility.tianhoushixiao' })}
                            </>
                          )}
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              )}
            </Form.Item>
            <Form.Item
              label={remind.label[4]}
              name={`num_${index}_${_index}`}
              initialValue={1}
              rules={[
                {
                  required: true,
                  validator: (_rule, value) => {
                    const pattern = /^[1-9]\d*$/
                    if (!value) {
                      return Promise.reject(new Error(remind.message[5]))
                    }
                    if (!pattern.test(value)) {
                      return Promise.reject(
                        new Error(remind.label[4] + `${intl.formatMessage({ id: 'marketingAbility.bixudayu0' })}`),
                      )
                    }
                    return Promise.resolve()
                  },
                },
              ]}
            >
              <Input disabled={isPreview} addonAfter={_item.unit} onBlur={(e) => handleChange(e, 'num', _index)} />
            </Form.Item>
          </div>
        </div>
      ))}
    </Fragment>
  )
}
export default ProductLayout
