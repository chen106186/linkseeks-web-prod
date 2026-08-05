import { useIntl } from '@linkseeks/i18n'
import React, { useState, Fragment } from 'react'
import { Form, Checkbox, Radio, Input, Space, Button, DatePicker, Select, FormInstance } from 'antd'
import { EventEmitter } from '@linkseeks/hooks'
import { isEmpty } from 'lodash'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import moment from 'moment'
import style from './index.less'
import { Card as CardLayout } from '@linkseeks/ui'
import { OVERLAYACTIVITYTYPE, PROMOTIONTYPE, LADDERBOLIST } from '../../constants'
import {
  ACTIVITY_TYPE_1,
  ACTIVITY_TYPE_2,
  ACTIVITY_TYPE_3,
  ACTIVITY_TYPE_4,
  ACTIVITY_TYPE_5,
  ACTIVITY_TYPE_6,
  ACTIVITY_TYPE_7,
  ACTIVITY_TYPE_8,
  ACTIVITY_TYPE_9,
  ACTIVITY_TYPE_10,
  ACTIVITY_TYPE_11,
  ACTIVITY_TYPE_12,
  ACTIVITY_TYPE_13,
  ACTIVITY_TYPE_14,
  ACTIVITY_TYPE_15,
  ACTIVITY_TYPE_16,
  RANDOM_AMOUNT,
  FIXATION_AMOUNT,
  LOTTERY_ORDERLOTTERY,
  LOTTERY_INTEGRALLOTTERY,
  LOTTERY_BEHAVIORLOTTERY,
  LOTTERY_ACTIVITYLOTTERY,
  LOTTERY_APPLYMEMBER,
  LOTTERY_SIGNIN,
  EVERY_DAY,
  EVERY_WEEK,
  EVERY_MONTH,
  SEASON_ENTO,
  FULL_EXCHANGE,
  BUYPRODUCT_EXCHANGE,
  WHITGIFT_PRODUCT,
  BUYPRODUCT_WHITGIFT,
} from '@/constants/marketing'

interface RulesLayoutProps {
  /** umi-hooks */
  focus$?: EventEmitter<void>
  /** FormInstance */
  form?: FormInstance
  /** 监听规则改变 */
  getRule?: () => void
}

type optionProps = {
  /** key */
  key?: string | number
  /** value */
  value?: number
  /** children */
  children?: string
}

const RulesLayout: React.FC<RulesLayoutProps> = (props: any) => {
  const { focus$, form, getRule } = props
  const intl = useIntl()
  const [option, setOption] = useState<optionProps>()
  const [ladderType, setLadderType] = useState<number>(1)
  const [rejec, setRejec] = useState<any>({})

  const handleActivityDefinedBO = (e) => {
    const { value } = e.target
    setLadderType(Number(value))
    form.resetFields([['activityDefined', 'ladderList']])
    getRule()
  }

  focus$.useSubscription((val: optionProps) => {
    setOption(val)
    form.resetFields(['activityDefined'])
    setRejec({})
  })

  const rejection = (key: string, num: number) => {
    console.log(num, 10086)
    const data = { ...rejec }
    if (data[key] === num) {
      data[key] = null
    } else {
      data[key] = num
    }
    setRejec({ ...data })
  }

  /** 叠加活动类型 */
  const allowActivity = (int = 1) => {
    switch (int) {
      case ACTIVITY_TYPE_1:
      case ACTIVITY_TYPE_2:
      case ACTIVITY_TYPE_3:
      case ACTIVITY_TYPE_4:
      case ACTIVITY_TYPE_5:
      case ACTIVITY_TYPE_6:
      case ACTIVITY_TYPE_7:
      case ACTIVITY_TYPE_8:
      case ACTIVITY_TYPE_13:
        return (
          <Form.Item
            name={['activityDefined', 'allowActivity']}
            tooltip={intl.formatMessage({ id: 'selfManagement.stackingActivityStackedActivity' })}
            label={intl.formatMessage({ id: 'selfManagement.overlayTheActivityType' })}
            rules={[
              {
                required: false,
                message: `${intl.formatMessage({ id: 'selfManagement.pleaseSelectSuperpositionActivity' })}`,
              },
            ]}
            className={style.rulesLayout}
          >
            <Checkbox.Group onChange={() => getRule()}>
              {!isEmpty(OVERLAYACTIVITYTYPE(int).A) &&
                OVERLAYACTIVITYTYPE(int).A.map((item) => (
                  <Checkbox
                    key={item.value}
                    value={item.value}
                    disabled={rejec?.A && item.value !== rejec?.A}
                    onChange={(value) => rejection('A', item.value)}
                  >
                    {item.label}
                  </Checkbox>
                ))}
              {!isEmpty(OVERLAYACTIVITYTYPE(int).B) &&
                OVERLAYACTIVITYTYPE(int).B.map((item) => (
                  <Checkbox
                    key={item.value}
                    value={item.value}
                    disabled={rejec?.B && item.value !== rejec?.B}
                    onChange={(value) => rejection('B', item.value)}
                  >
                    {item.label}
                  </Checkbox>
                ))}
              {!isEmpty(OVERLAYACTIVITYTYPE(int).C) &&
                OVERLAYACTIVITYTYPE(int).C.map((item) => (
                  <Checkbox key={item.value} value={item.value}>
                    {item.label}
                  </Checkbox>
                ))}
            </Checkbox.Group>
          </Form.Item>
        )
    }
  }
  /** 叠加优惠券 */
  const allowCoupon = (int = 1) => {
    switch (int) {
      case ACTIVITY_TYPE_1:
      case ACTIVITY_TYPE_2:
      case ACTIVITY_TYPE_3:
      case ACTIVITY_TYPE_4:
      case ACTIVITY_TYPE_5:
      case ACTIVITY_TYPE_6:
      case ACTIVITY_TYPE_7:
      case ACTIVITY_TYPE_8:
      case ACTIVITY_TYPE_12:
      case ACTIVITY_TYPE_13:
      case ACTIVITY_TYPE_15:
        return (
          <Form.Item
            name={['activityDefined', 'allowCoupon']}
            tooltip={intl.formatMessage({ id: 'selfManagement.overlayCouponActivitiesWhetherCoupon' })}
            label={intl.formatMessage({ id: 'selfManagement.superpositionOfCoupons' })}
            rules={[
              {
                required: true,
                message: `${intl.formatMessage({ id: 'selfManagement.pleaseChooseWhetherToOverlay' })}`,
              },
            ]}
          >
            <Radio.Group onChange={() => getRule()}>
              <Radio value={true}>{intl.formatMessage({ id: 'selfManagement.is' })}</Radio>
              <Radio value={false}>{intl.formatMessage({ id: 'selfManagement.no' })}</Radio>
            </Radio.Group>
          </Form.Item>
        )
    }
  }
  // /** 超限规则 */
  // const exceedRule = (int = 1) => {
  //   switch (int) {
  //     case ACTIVITY_TYPE_1:
  //     case ACTIVITY_TYPE_2:
  //     case ACTIVITY_TYPE_3:
  //     case ACTIVITY_TYPE_8:
  //     case ACTIVITY_TYPE_4:
  //     case ACTIVITY_TYPE_5:
  //     case ACTIVITY_TYPE_6:
  //     case ACTIVITY_TYPE_7:
  //     case ACTIVITY_TYPE_12:
  //     case ACTIVITY_TYPE_13:
  //       return (
  //         <Form.Item
  //           name={['activityDefined', 'exceedRule']}
  //           tooltip={intl.formatMessage({ id: 'selfManagement.transfiniteIndividualPurchaseQuantityBeyondOriginal'})}
  //           label={intl.formatMessage({ id: 'selfManagement.transfiniteRules'})}
  //           rules={[{ required: true, message: `${intl.formatMessage({ id: 'selfManagement.pleaseSelectAProhibitiveRules'})}` }]}
  //         >
  //           <Radio.Group>
  //             {OVERRUNRULETYPE(int)?.map(item => (
  //               <Radio key={item.value} value={item.value}>{item.label}</Radio>
  //             ))}
  //           </Radio.Group>
  //         </Form.Item>
  //       )
  //   }
  // }
  /** 满量/满额/赠送促销类型 */
  const type = (int = 1) => {
    switch (int) {
      /** 满量促销 */
      case ACTIVITY_TYPE_4:
      /** 满额促销 */
      case ACTIVITY_TYPE_5:
      /** 赠送促销 */
      case ACTIVITY_TYPE_6:
        return (
          <Form.Item
            name={['activityDefined', PROMOTIONTYPE(int)!.name]}
            tooltip={PROMOTIONTYPE(int)?.tooltip}
            label={PROMOTIONTYPE(int)?.label}
            rules={[{ required: true, message: PROMOTIONTYPE(int)?.message }]}
            className={style.rulesLayout}
            initialValue={1}
          >
            <Radio.Group onChange={handleActivityDefinedBO}>
              {PROMOTIONTYPE(int)?.radio.map((item) => (
                <Radio.Button key={item.value} value={item.value}>
                  {item.label}
                </Radio.Button>
              ))}
            </Radio.Group>
          </Form.Item>
        )
      /** 砍价 */
      case ACTIVITY_TYPE_11:
        return (
          <Form.Item
            tooltip={intl.formatMessage({
              id: 'selfManagement.negotiateMaximumAmountBargainingAmountAccordingAmountFixedRandomAmountAmountWithinRandomAmount',
            })}
            label={intl.formatMessage({ id: 'selfManagement.amountBargaining' })}
            required
            className={style.rulesLayout}
          >
            <Space direction="vertical">
              <Form.Item
                style={{ margin: 0 }}
                name={['activityDefined', 'type']}
                rules={[{ required: true, message: `${intl.formatMessage({ id: 'selfManagement.pleaseSelectA' })}` }]}
              >
                <Radio.Group>
                  <Radio.Button value={RANDOM_AMOUNT}>
                    {intl.formatMessage({ id: 'selfManagement.aRandomAmount' })}
                  </Radio.Button>
                  <Radio.Button value={FIXATION_AMOUNT}>
                    {intl.formatMessage({ id: 'selfManagement.fixedAmount' })}
                  </Radio.Button>
                </Radio.Group>
              </Form.Item>
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) =>
                  prevValues.activityDefined !== currentValues.activityDefined
                }
              >
                {({ getFieldValue }) =>
                  getFieldValue(['activityDefined', 'type']) === RANDOM_AMOUNT ? (
                    <Space style={{ display: 'flex' }}>
                      {intl.formatMessage({ id: 'selfManagement.aRandomAmountRange' })}
                      <Form.Item
                        style={{ margin: 0 }}
                        name={['activityDefined', 'randomStartPrice']}
                        dependencies={[['activityDefined', 'randomEndPrice']]}
                        rules={[
                          ({ getFieldValue }) => ({
                            validator: (_rule, value) => {
                              const pattern = /^([1-9]\d*(\.\d{1,2})?|([0](\.([0][1-9]|[1-9]\d{0,1}))))$/
                              const randomEndPrice = getFieldValue('activityDefined')['randomEndPrice']
                              if (!value) {
                                return Promise.reject(
                                  new Error(
                                    `${intl.formatMessage({ id: 'selfManagement.pleaseMinimumAmountRandom' })}`,
                                  ),
                                )
                              }
                              if (!pattern.test(value) || !(Number(value) < Number(randomEndPrice))) {
                                return Promise.reject(
                                  new Error(
                                    `${intl.formatMessage({ id: 'selfManagement.greaterLargestAmountRandom' })}`,
                                  ),
                                )
                              }
                              return Promise.resolve()
                            },
                          }),
                        ]}
                      >
                        <Input
                          style={{ width: '160px' }}
                          addonAfter={intl.formatMessage({ id: 'selfManagement.yuan' })}
                        />
                      </Form.Item>
                      ~
                      <Form.Item
                        style={{ margin: 0 }}
                        name={['activityDefined', 'randomEndPrice']}
                        dependencies={[['activityDefined', 'randomStartPrice']]}
                        rules={[
                          ({ getFieldValue }) => ({
                            validator: (_rule, value) => {
                              const pattern = /^([1-9]\d*(\.\d{1,2})?|([0](\.([0][1-9]|[1-9]\d{0,1}))))$/
                              const randomStartPrice = getFieldValue('activityDefined')['randomStartPrice']
                              if (!value) {
                                return Promise.reject(
                                  new Error(
                                    `${intl.formatMessage({ id: 'selfManagement.pleaseLargestAmountRandom' })}`,
                                  ),
                                )
                              }
                              if (!pattern.test(value) || !(Number(value) > Number(randomStartPrice))) {
                                return Promise.reject(
                                  new Error(
                                    `${intl.formatMessage({ id: 'selfManagement.greaterGreaterMinimumAmountRandom' })}`,
                                  ),
                                )
                              }
                              return Promise.resolve()
                            },
                          }),
                        ]}
                      >
                        <Input
                          style={{ width: '160px' }}
                          addonAfter={intl.formatMessage({ id: 'selfManagement.yuan' })}
                        />
                      </Form.Item>
                    </Space>
                  ) : getFieldValue(['activityDefined', 'type']) === FIXATION_AMOUNT ? (
                    <Space style={{ display: 'flex' }}>
                      {intl.formatMessage({ id: 'selfManagement.amountBargaining' })}
                      <Form.Item
                        style={{ margin: 0 }}
                        name={['activityDefined', 'restrictPrice']}
                        rules={[
                          {
                            required: true,
                            validator: (_rule, value) => {
                              const pattern = /^[1-9]\d*$/
                              if (!value) {
                                return Promise.reject(
                                  new Error(`${intl.formatMessage({ id: 'selfManagement.pleaseAmountBargaining' })}`),
                                )
                              }
                              if (!pattern.test(value)) {
                                return Promise.reject(
                                  new Error(`${intl.formatMessage({ id: 'selfManagement.bargainAmountGreater' })}`),
                                )
                              }
                              return Promise.resolve()
                            },
                          },
                        ]}
                      >
                        <Input
                          style={{ width: '160px' }}
                          addonAfter={intl.formatMessage({ id: 'selfManagement.yuan' })}
                        />
                      </Form.Item>
                    </Space>
                  ) : null
                }
              </Form.Item>
            </Space>
          </Form.Item>
        )
    }
  }
  /** 满量/额减 */
  const ladderBOList = (int = 1, type) => {
    switch (int) {
      /** 满量促销 */
      case ACTIVITY_TYPE_4:
      /** 满额促销 */
      case ACTIVITY_TYPE_5:
      /** 多件促销 */
      case ACTIVITY_TYPE_7:
        return (
          <Form.List
            name={['activityDefined', 'ladderList']}
            rules={[
              {
                validator: async (_, ladderBOList) => {
                  if (!ladderBOList || JSON.stringify(ladderBOList) === '[]') {
                    return Promise.reject(new Error(LADDERBOLIST(int, type)?.message))
                  }
                  return Promise.resolve()
                },
              },
            ]}
          >
            {(fields, { add, remove }, { errors }) => (
              <Form.Item tooltip={LADDERBOLIST(int, type)?.tooltip} label={LADDERBOLIST(int, type)?.label} required>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="center">
                    {int === ACTIVITY_TYPE_7
                      ? intl.formatMessage({ id: 'selfManagement.di' })
                      : intl.formatMessage({ id: 'selfManagement.full' })}
                    <Form.Item
                      {...restField}
                      style={{ margin: 0 }}
                      name={[name, `${int === ACTIVITY_TYPE_7 ? 'num' : 'key'}`]}
                      fieldKey={[name, `${int === ACTIVITY_TYPE_7 ? 'num' : 'key'}`]}
                      rules={[
                        {
                          required: true,
                          validator: (_rule, value) => {
                            try {
                              const pattern1 = /^([1-9]\d*(\.\d{1,3})?|([0](\.([0][1-9]|[1-9]\d{0,1}))))$/
                              const pattern2 = /^([1-9]\d*(\.\d{1,2})?|([0](\.([0][1-9]|[1-9]\d{0,1}))))$/
                              const valueKey = form.getFieldValue(`activityDefined`)['ladderList'][name]['value']
                              // if (!value) {
                              //   return Promise.reject(new Error(`${intl.formatMessage({ id: 'selfManagement.pleaseEnterThe' })}`));
                              // }
                              if (!value && int === ACTIVITY_TYPE_4) {
                                return Promise.reject(
                                  new Error(`${intl.formatMessage({ id: 'selfManagement.pleaseEnterTheNumberOf' })}`),
                                )
                              }
                              if (!value && int === ACTIVITY_TYPE_5) {
                                return Promise.reject(
                                  new Error(`${intl.formatMessage({ id: 'selfManagement.pleaseEnterTheAmount' })}`),
                                )
                              }
                              if (!value && int === ACTIVITY_TYPE_7) {
                                return Promise.reject(
                                  new Error(`${intl.formatMessage({ id: 'selfManagement.pleaseEnterTheNumber' })}`),
                                )
                              }
                              if (!pattern1.test(value) && (int === ACTIVITY_TYPE_4 || int === ACTIVITY_TYPE_7)) {
                                return Promise.reject(
                                  new Error(
                                    `${intl.formatMessage({ id: 'selfManagement.bixudayu0zuiduobaoliu3wei' })}`,
                                  ),
                                )
                              }
                              if (!pattern2.test(value) && int === ACTIVITY_TYPE_5) {
                                return Promise.reject(
                                  new Error(
                                    `${intl.formatMessage({
                                      id: 'marketingAbility.bixudayu0zuiduobaoliu2weixiaoshu',
                                    })}`,
                                  ),
                                )
                              }
                              if (
                                !pattern2.test(value) &&
                                int === ACTIVITY_TYPE_5 &&
                                Number(valueKey) >= Number(value)
                              ) {
                                return Promise.reject(new Error('最多保留2位小数，大于0且大于满额减金额'))
                              }
                              return Promise.resolve()
                            } catch (err) {
                              return Promise.reject(
                                new Error(`${intl.formatMessage({ id: 'selfManagement.pleaseEnterThe' })}`),
                              )
                            }
                          },
                        },
                      ]}
                    >
                      <Input addonAfter={LADDERBOLIST(int, type)?.addon} onBlur={() => getRule()} />
                    </Form.Item>
                    {LADDERBOLIST(int, type)?.addonAfter}
                    <Form.Item
                      {...restField}
                      style={{ margin: 0 }}
                      name={[name, `${int === ACTIVITY_TYPE_7 ? 'discount' : 'value'}`]}
                      fieldKey={[name, `${int === ACTIVITY_TYPE_7 ? 'discount' : 'value'}`]}
                      dependencies={[
                        ['activityDefined', 'ladderList', name, `${int === ACTIVITY_TYPE_7 ? 'num' : 'key'}`],
                      ]}
                      rules={[
                        {
                          required: true,
                          validator: (_rule, value) => {
                            try {
                              const pattern1 = /^([1-9]\d*(\.\d{1,2})?|([0](\.([0][1-9]|[1-9]\d{0,1}))))$/
                              const pattern2 = /^([1-9]\d*(\.\d{1,2})?|([0](\.([0][1-9]|[1-9]\d{0,1}))))$/
                              const pattern3 = /^(?!0+(?:\.0+)?$)\d?\d(?:\.\d{1,1}?)?$/
                              const pattern4 = /^(?!0+(?:\.0+)?$)\d?\d(?:\.\d{1,1}?)?$/
                              const valueKey = form.getFieldValue(`activityDefined`)['ladderList'][name]['key']
                              // if (!value) {
                              //   return Promise.reject(new Error(`${intl.formatMessage({ id: 'selfManagement.pleaseEnterThe' })}`));
                              // }
                              if (
                                !pattern1.test(value) &&
                                (int === ACTIVITY_TYPE_4 || int === ACTIVITY_TYPE_7) &&
                                type === 1
                              ) {
                                return Promise.reject(
                                  new Error(
                                    `${intl.formatMessage({
                                      id: 'marketingAbility.bixudayu0zuiduobaoliu2weixiaoshu',
                                    })}`,
                                  ),
                                )
                              }
                              if (
                                !pattern3.test(value) &&
                                (int === ACTIVITY_TYPE_4 || int === ACTIVITY_TYPE_7) &&
                                type === 2
                              ) {
                                return Promise.reject(
                                  new Error(`${intl.formatMessage({ id: 'selfManagement.rejectmin1' })}`),
                                )
                              }
                              if (!pattern2.test(value) && int === ACTIVITY_TYPE_5 && type === 1) {
                                return Promise.reject(
                                  new Error(
                                    `${intl.formatMessage({
                                      id: 'marketingAbility.bixudayu0zuiduobaoliu2weixiaoshu',
                                    })}`,
                                  ),
                                )
                              }
                              if (int === ACTIVITY_TYPE_5 && type === 1 && Number(valueKey) <= Number(value)) {
                                return Promise.reject(new Error('最多保留2位小数，大于0且小于优惠门槛'))
                              }
                              if (!pattern4.test(value) && int === ACTIVITY_TYPE_5 && type === 2) {
                                return Promise.reject(
                                  new Error(`${intl.formatMessage({ id: 'selfManagement.rejectmin1' })}`),
                                )
                              }
                              return Promise.resolve()
                            } catch (err) {
                              return Promise.reject(
                                new Error(`${intl.formatMessage({ id: 'selfManagement.pleaseEnterThe' })}`),
                              )
                            }
                          },
                        },
                      ]}
                    >
                      <Input addonAfter={LADDERBOLIST(int, type)?.addonBefore} onBlur={() => getRule()} />
                    </Form.Item>
                    <Button icon={<MinusOutlined />} onClick={() => remove(name)} />
                  </Space>
                ))}
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  {intl.formatMessage({ id: 'selfManagement.new' })}
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            )}
          </Form.List>
        )
      /** 组合促销 */
      case ACTIVITY_TYPE_8:
        return (
          <Form.Item label={intl.formatMessage({ id: 'selfManagement.preferentialRules' })} required>
            <Space style={{ display: 'flex', marginBottom: 8 }} align="center">
              {intl.formatMessage({ id: 'selfManagement.youCanChooseAny' })}
              <Form.Item
                style={{ margin: 0 }}
                name={['activityDefined', 'num']}
                rules={[
                  {
                    required: true,
                    validator: (_rule, value) => {
                      const pattern = /^[1-9]\d*$/
                      if (!value) {
                        return Promise.reject(
                          new Error(`${intl.formatMessage({ id: 'selfManagement.pleaseEnterTheNumber' })}`),
                        )
                      }
                      if (!pattern.test(value)) {
                        return Promise.reject(
                          new Error(`${intl.formatMessage({ id: 'selfManagement.mustBeGreaterThanZero' })}`),
                        )
                      }
                      return Promise.resolve()
                    },
                  },
                ]}
              >
                <Input addonAfter={intl.formatMessage({ id: 'selfManagement.a' })} />
              </Form.Item>
              {intl.formatMessage({ id: 'selfManagement.pay' })}
              <Form.Item
                style={{ margin: 0 }}
                name={['activityDefined', 'price']}
                rules={[
                  {
                    required: true,
                    validator: (_rule, value) => {
                      const pattern = /^([1-9]\d*(\.\d{1,2})?|([0](\.([0][1-9]|[1-9]\d{0,1}))))$/
                      if (!value) {
                        return Promise.reject(
                          new Error(`${intl.formatMessage({ id: 'selfManagement.pleaseEnterTheAmount' })}`),
                        )
                      }
                      if (!pattern.test(value)) {
                        return Promise.reject(
                          new Error(`${intl.formatMessage({ id: 'selfManagement.amountGreaterDecimalPlaces' })}`),
                        )
                      }
                      return Promise.resolve()
                    },
                  },
                ]}
              >
                <Input addonAfter={intl.formatMessage({ id: 'selfManagement.yuan' })} />
              </Form.Item>
            </Space>
          </Form.Item>
        )
    }
  }
  /** 赠品类型 */
  const giftType = (int = 1) => {
    switch (int) {
      /** 赠品类型 */
      case ACTIVITY_TYPE_6:
        return (
          <Form.Item
            name={['activityDefined', 'giftType']}
            tooltip={intl.formatMessage({ id: 'selfManagement.specificCommoditiesCouponGivingSpecificCoupons' })}
            label={intl.formatMessage({ id: 'selfManagement.giftType' })}
            rules={[
              { required: true, message: `${intl.formatMessage({ id: 'selfManagement.pleaseSelectAGiftType' })}` },
            ]}
            className={style.rulesLayout}
          >
            <Radio.Group onChange={() => getRule()}>
              <Radio.Button value={WHITGIFT_PRODUCT}>
                {intl.formatMessage({ id: 'selfManagement.sendGoods' })}
              </Radio.Button>
              <Radio.Button value={BUYPRODUCT_WHITGIFT}>
                {intl.formatMessage({ id: 'selfManagement.aGiftCoupon' })}
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
        )
    }
  }
  /** 换购类型 */
  const swapType = (int = 1) => {
    switch (int) {
      /** 换购类型 */
      case ACTIVITY_TYPE_13:
        return (
          <Form.Item
            name={['activityDefined', 'swapType']}
            tooltip={intl.formatMessage({
              id: 'selfManagement.purchasesRequirementsPreferentialGoodsNumberActivitiesPurchaseGoodsPreferential',
            })}
            label={intl.formatMessage({ id: 'selfManagement.buyType' })}
            rules={[{ required: true, message: `${intl.formatMessage({ id: 'selfManagement.pleaseSelectBuyType' })}` }]}
            className={style.rulesLayout}
          >
            <Radio.Group onChange={() => getRule()}>
              <Radio.Button value={FULL_EXCHANGE}>
                {intl.formatMessage({ id: 'selfManagement.fullRedemption' })}
              </Radio.Button>
              <Radio.Button value={BUYPRODUCT_EXCHANGE}>
                {intl.formatMessage({ id: 'selfManagement.buyGoods' })}
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
        )
    }
  }
  /** 同一用户帮砍价限制次数 */
  const restrictNum = (int = 1) => {
    switch (int) {
      /** 砍价 */
      case ACTIVITY_TYPE_11:
        return (
          <Form.Item
            tooltip={intl.formatMessage({ id: 'selfManagement.negotiateMaximumDegree' })}
            label={intl.formatMessage({ id: 'selfManagement.userLimitNumberOf' })}
            required
          >
            <Space style={{ display: 'flex' }}>
              {intl.formatMessage({ id: 'selfManagement.theSameUserLimit' })}
              <Form.Item
                style={{ margin: 0 }}
                name={['activityDefined', 'restrictNum']}
                initialValue={1}
                rules={[
                  {
                    required: true,
                    validator: (_rule, value) => {
                      const pattern = /^[1-9]\d*$/
                      if (!value) {
                        return Promise.reject(
                          new Error(`${intl.formatMessage({ id: 'selfManagement.pleaseNumberRestrictions' })}`),
                        )
                      }
                      if (!pattern.test(value)) {
                        return Promise.reject(
                          new Error(`${intl.formatMessage({ id: 'selfManagement.numberGreater' })}`),
                        )
                      }
                      return Promise.resolve()
                    },
                  },
                ]}
              >
                <Input
                  style={{ width: '160px' }}
                  addonAfter={intl.formatMessage({ id: 'selfManagement.time' })}
                  onBlur={() => getRule()}
                />
              </Form.Item>
            </Space>
          </Form.Item>
        )
    }
  }
  /** 拼团 */
  const grouPing = (int = 1) => {
    switch (Number(int)) {
      case ACTIVITY_TYPE_9:
        return (
          <Fragment>
            <Form.Item
              tooltip={intl.formatMessage({
                id: 'selfManagement.requirementsCloudsAchieveNumberPeopleGroup-buyingDemandCloudsNumberNumber',
              })}
              label={intl.formatMessage({ id: 'selfManagement.theNumberOfClusters' })}
              name={['activityDefined', 'assembleNum']}
              rules={[
                {
                  required: true,
                  validator: (_rule, value) => {
                    const pattern = /^0*(?:[2-9]|[1-9]\d\d*)$/
                    if (!value) {
                      return Promise.reject(
                        new Error(`${intl.formatMessage({ id: 'selfManagement.pleaseNumberClusters' })}`),
                      )
                    }
                    if (!pattern.test(value)) {
                      return Promise.reject(
                        new Error(`${intl.formatMessage({ id: 'selfManagement.cloudsNumberGreater' })}`),
                      )
                    }
                    return Promise.resolve()
                  },
                },
              ]}
            >
              <Input
                style={{ width: '359px' }}
                addonAfter={intl.formatMessage({ id: 'selfManagement.people' })}
                onBlur={() => getRule()}
              />
            </Form.Item>
            <Form.Item
              tooltip="成团时间表示在活动有效期内，是否需要限制成团时间，不限制表示在活动有效时间内都可以参团，限制时要求输入限制时间，达到限制时间时自动成团，不能再参团。"
              label={intl.formatMessage({ id: 'selfManagement.cloudsOfTime' })}
              className={style.rulesLayout}
              required
            >
              <Space>
                <Form.Item
                  style={{ margin: 0 }}
                  name={['activityDefined', 'assembleStatus']}
                  initialValue={1}
                  rules={[{ required: true, message: `${intl.formatMessage({ id: 'selfManagement.pleaseSelectA' })}` }]}
                >
                  <Radio.Group onChange={() => getRule()}>
                    {/* <Radio.Button value={0}>{ intl.formatMessage({ id: 'selfManagement.dontLimit'}) }</Radio.Button> */}
                    <Radio.Button value={1}>{intl.formatMessage({ id: 'selfManagement.limit' })}</Radio.Button>
                  </Radio.Group>
                </Form.Item>
                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, currentValues) =>
                    prevValues.activityDefined !== currentValues.activityDefined
                  }
                >
                  {({ getFieldValue }) =>
                    getFieldValue(['activityDefined', 'assembleStatus']) === 1 && (
                      <Form.Item
                        style={{ margin: 0 }}
                        name={['activityDefined', 'assembleTime']}
                        initialValue={24}
                        rules={[
                          {
                            required: true,
                            validator: (_rule, value) => {
                              const pattern = /^([1-9]|1\d|2[0-4])$/
                              if (!value) {
                                return Promise.reject(
                                  new Error(`${intl.formatMessage({ id: 'selfManagement.pleaseClumps' })}`),
                                )
                              }
                              if (!pattern.test(value)) {
                                return Promise.reject(
                                  new Error(`${intl.formatMessage({ id: 'selfManagement.cloudsGreater' })}`),
                                )
                              }
                              return Promise.resolve()
                            },
                          },
                        ]}
                      >
                        <Input
                          style={{ width: '191px' }}
                          addonAfter={intl.formatMessage({ id: 'selfManagement.hours' })}
                          onBlur={() => getRule()}
                        />
                      </Form.Item>
                    )
                  }
                </Form.Item>
              </Space>
            </Form.Item>
            {/* <Form.Item
              tooltip={intl.formatMessage({ id: 'selfManagement.tuxedoTuxedoGroup-buyingActivitiesWhetherGroup-buyingActivitiesEffectivelyWithoutLimitingUnlimitedRequiredNumberDefault'})}
              label={intl.formatMessage({ id: 'selfManagement.userTuxedoLimit'})}
              className={style.rulesLayout}
              required
            >
              <Space>
                <Form.Item
                  style={{ margin: 0 }}
                  name={['activityDefined', 'joinAssembleStatus']}
                  rules={[{ required: true, message: `${intl.formatMessage({ id: 'selfManagement.pleaseSelectA'})}` }]}
                >
                  <Radio.Group>
                    <Radio.Button value={0}>{ intl.formatMessage({ id: 'selfManagement.dontLimit'}) }</Radio.Button>
                    <Radio.Button value={1}>{ intl.formatMessage({ id: 'selfManagement.limit'}) }</Radio.Button>
                  </Radio.Group>
                </Form.Item>
                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, currentValues) => prevValues.activityDefined !== currentValues.activityDefined}
                >
                  {({ getFieldValue }) => getFieldValue(['activityDefined', 'joinAssembleStatus']) === 1 && (
                    <Form.Item
                      style={{ margin: 0 }}
                      name={['activityDefined', 'joinAssembleNum']}
                      initialValue={1}
                      rules={[{
                        required: true, validator: (_rule, value) => {
                          const pattern = /^[1-9]\d*$/;
                          if (!value) {
                            return Promise.reject(new Error(`${intl.formatMessage({ id: 'selfManagement.pleaseTuxedoNumber'})}`));
                          }
                          if (!pattern.test(value)) {
                            return Promise.reject(new Error(`${intl.formatMessage({ id: 'selfManagement.tuxedoNumberGreater'})}`));
                          }
                          return Promise.resolve();
                        }
                      }]}
                    >
                      <Input style={{ width: '191px' }} addonAfter={intl.formatMessage({ id: 'selfManagement.time'})} />
                    </Form.Item>
                  )}
                </Form.Item>
              </Space>
            </Form.Item> */}
          </Fragment>
        )
    }
  }
  /** 秒杀 */
  const secondKill = (int = 1) => {
    switch (Number(int)) {
      case ACTIVITY_TYPE_12:
        return (
          <Form.Item
            tooltip={intl.formatMessage({ id: 'selfManagement.secondsSecondBargainSecondsRestoreOriginal' })}
            label={intl.formatMessage({ id: 'selfManagement.dailySecondsToKillTime' })}
            style={{ margin: 0 }}
            required
          >
            <Space style={{ display: 'flex' }} align="baseline">
              <Form.Item
                name={['activityDefined', 'startTime']}
                rules={[
                  { required: true, message: `${intl.formatMessage({ id: 'selfManagement.beginToKill!' })}` },
                  () => ({
                    validator(_, value) {
                      const _endTime = form.getFieldValue('activityDefined').endTime
                      if (_endTime && !moment(value).isBefore(_endTime)) {
                        return Promise.reject(new Error(`${intl.formatMessage({ id: 'selfManagement.seconds' })}`))
                      }
                      return Promise.resolve()
                    },
                  }),
                ]}
              >
                <DatePicker style={{ width: '168px' }} picker="time" allowClear onBlur={() => getRule()} />
              </Form.Item>
              ~
              <Form.Item
                name={['activityDefined', 'endTime']}
                rules={[
                  { required: true, message: `${intl.formatMessage({ id: 'selfManagement.second' })}` },
                  () => ({
                    validator(_, value) {
                      const _startTime = form.getFieldValue('activityDefined').startTime
                      if (_startTime && !moment(value).isAfter(_startTime)) {
                        return Promise.reject(
                          new Error(`${intl.formatMessage({ id: 'selfManagement.secondGreater' })}`),
                        )
                      }
                      return Promise.resolve()
                    },
                  }),
                ]}
              >
                <DatePicker style={{ width: '168px' }} picker="time" allowClear onBlur={() => getRule()} />
              </Form.Item>
            </Space>
          </Form.Item>
        )
    }
  }
  /** 试用 */
  const probation = (int = 1) => {
    switch (Number(int)) {
      case ACTIVITY_TYPE_16:
        return (
          <Fragment>
            <Form.Item
              tooltip={intl.formatMessage({
                id: 'selfManagement.expiresActivitiesAccordingExtractingTrialSystemAutomaticallyApplicationExtractGenerate',
              })}
              label={intl.formatMessage({ id: 'selfManagement.extractingUserTimeTrial' })}
              name={['activityDefined', 'extractAttemptUserTime']}
              rules={[
                { required: true, message: `${intl.formatMessage({ id: 'selfManagement.pleaseSelectExtract' })}` },
              ]}
            >
              <DatePicker
                showTime
                showNow={false}
                style={{ width: '168px' }}
                allowClear
                onBlur={() => getRule()}
                disabledDate={(current) => {
                  return current && current < moment().startOf('second')
                }}
              />
            </Form.Item>
            <Form.Item
              tooltip={intl.formatMessage({ id: 'selfManagement.arrivalRequestSubmitsReportSystemRemindSubmitReport' })}
              label={intl.formatMessage({ id: 'selfManagement.endOfTheTrialTime' })}
              name={['activityDefined', 'attemptEndTime']}
              rules={[{ required: true, message: `${intl.formatMessage({ id: 'selfManagement.pleaseSelect' })}` }]}
            >
              <DatePicker
                showTime
                showNow={false}
                style={{ width: '168px' }}
                allowClear
                onBlur={() => getRule()}
                disabledDate={(current) => {
                  return current && current < moment().endOf('second')
                }}
              />
            </Form.Item>
          </Fragment>
        )
    }
  }
  /** 抽奖 */
  const lottery = (int = 1) => {
    switch (Number(int)) {
      case ACTIVITY_TYPE_10:
        return (
          <Fragment>
            <Form.Item
              tooltip={intl.formatMessage({
                id: 'selfManagement.lotteryPaymentSuccessParticipateConsumptionIntegralParticipateBehaviorLotteryMemberParticipateActivityRaffleParticipateUnconditionally',
              })}
              label={intl.formatMessage({ id: 'selfManagement.drawType' })}
              required
            >
              <Space direction="vertical">
                <Form.Item
                  name={['activityDefined', 'lotteryType']}
                  style={{ margin: 0 }}
                  rules={[
                    {
                      required: true,
                      message: `${intl.formatMessage({ id: 'selfManagement.pleaseSelectALotteryTypes' })}`,
                    },
                  ]}
                >
                  <Radio.Group>
                    <Radio.Button value={LOTTERY_ORDERLOTTERY}>
                      {intl.formatMessage({ id: 'selfManagement.ordersForLuckyDraw' })}
                    </Radio.Button>
                    <Radio.Button value={LOTTERY_INTEGRALLOTTERY}>
                      {intl.formatMessage({ id: 'selfManagement.integralDraw' })}
                    </Radio.Button>
                    <Radio.Button value={LOTTERY_BEHAVIORLOTTERY}>
                      {intl.formatMessage({ id: 'selfManagement.behaviorLottery' })}
                    </Radio.Button>
                    <Radio.Button value={LOTTERY_ACTIVITYLOTTERY}>
                      {intl.formatMessage({ id: 'selfManagement.activitiesDraw' })}
                    </Radio.Button>
                  </Radio.Group>
                </Form.Item>
                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, currentValues) =>
                    prevValues.activityDefined !== currentValues.activityDefined
                  }
                >
                  {({ getFieldValue }) =>
                    getFieldValue(['activityDefined', 'lotteryType']) === LOTTERY_ORDERLOTTERY ? (
                      <Space style={{ display: 'flex' }}>
                        {intl.formatMessage({ id: 'selfManagement.fullOrderAmount' })}
                        <Form.Item
                          style={{ margin: 0 }}
                          name={['activityDefined', 'orderPrice']}
                          rules={[
                            {
                              required: true,
                              validator: (_rule, value) => {
                                const pattern = /^([1-9]\d*(\.\d{1,2})?|([0](\.([0][1-9]|[1-9]\d{0,1}))))$/
                                if (!value) {
                                  return Promise.reject(
                                    new Error(
                                      `${intl.formatMessage({ id: 'selfManagement.pleaseEnterTheOrderAmount' })}`,
                                    ),
                                  )
                                }
                                if (!pattern.test(value)) {
                                  return Promise.reject(
                                    new Error(`${intl.formatMessage({ id: 'selfManagement.amountGreater' })}`),
                                  )
                                }
                                return Promise.resolve()
                              },
                            },
                          ]}
                        >
                          <Input
                            style={{ width: '160px' }}
                            addonAfter={intl.formatMessage({ id: 'selfManagement.yuan' })}
                          />
                        </Form.Item>
                        {intl.formatMessage({ id: 'selfManagement.participateSuccessfulPayment' })}
                      </Space>
                    ) : getFieldValue(['activityDefined', 'lotteryType']) === LOTTERY_INTEGRALLOTTERY ? (
                      <Space style={{ display: 'flex' }}>
                        {intl.formatMessage({ id: 'selfManagement.eachLotteryConsumption' })}
                        <Form.Item
                          style={{ margin: 0 }}
                          name={['activityDefined', 'integral']}
                          rules={[
                            {
                              required: true,
                              validator: (_rule, value) => {
                                const pattern = /^[1-9]\d*$/
                                if (!value) {
                                  return Promise.reject(
                                    new Error(
                                      `${intl.formatMessage({ id: 'selfManagement.pleaseEnterTheConsumptionPoints' })}`,
                                    ),
                                  )
                                }
                                if (!pattern.test(value)) {
                                  return Promise.reject(
                                    new Error(
                                      `${intl.formatMessage({ id: 'selfManagement.consumptionPointsGreater' })}`,
                                    ),
                                  )
                                }
                                return Promise.resolve()
                              },
                            },
                          ]}
                        >
                          <Input
                            style={{ width: '160px' }}
                            addonAfter={intl.formatMessage({ id: 'selfManagement.integral' })}
                          />
                        </Form.Item>
                      </Space>
                    ) : (
                      getFieldValue(['activityDefined', 'lotteryType']) === LOTTERY_BEHAVIORLOTTERY && (
                        <Space style={{ display: 'flex' }}>
                          {intl.formatMessage({ id: 'selfManagement.theUserHasFinished' })}
                          <Form.Item
                            style={{ margin: 0 }}
                            name={['activityDefined', 'behavior']}
                            rules={[
                              {
                                required: true,
                                message: `${intl.formatMessage({ id: 'selfManagement.pleaseSelectA' })}`,
                              },
                            ]}
                          >
                            <Select
                              style={{ width: 160 }}
                              placeholder={intl.formatMessage({ id: 'selfManagement.pleaseSelectA' })}
                            >
                              <Select.Option value={LOTTERY_APPLYMEMBER}>
                                {intl.formatMessage({ id: 'selfManagement.toApplyForMembership' })}
                              </Select.Option>
                              <Select.Option value={LOTTERY_SIGNIN}>
                                {intl.formatMessage({ id: 'selfManagement.signIn' })}
                              </Select.Option>
                            </Select>
                          </Form.Item>
                          {intl.formatMessage({ id: 'selfManagement.participateInLuckyDraw' })}
                        </Space>
                      )
                    )
                  }
                </Form.Item>
              </Space>
            </Form.Item>
            <Form.Item
              tooltip={intl.formatMessage({
                id: 'selfManagement.lotteryNumberLotteryNumberAllowingLotteryNumberLotteryNumberRestrictionsDuringAllowsLotteryNumber',
              })}
              label={intl.formatMessage({ id: 'selfManagement.lotteryNumber' })}
              required
              className={style.rulesLayout}
            >
              <Space style={{ display: 'flex' }}>
                <Form.Item
                  style={{ margin: 0 }}
                  name={['activityDefined', 'lotteryNumType']}
                  rules={[
                    {
                      required: true,
                      message: `${intl.formatMessage({ id: 'selfManagement.pleaseSelectLotteryNumber' })}`,
                    },
                  ]}
                >
                  <Select
                    style={{ width: 160 }}
                    placeholder={intl.formatMessage({ id: 'selfManagement.pleaseSelectA' })}
                  >
                    <Select.Option value={EVERY_DAY}>
                      {intl.formatMessage({ id: 'selfManagement.daily' })}
                    </Select.Option>
                    <Select.Option value={EVERY_WEEK}>
                      {intl.formatMessage({ id: 'selfManagement.onceAWeek' })}
                    </Select.Option>
                    <Select.Option value={EVERY_MONTH}>
                      {intl.formatMessage({ id: 'selfManagement.aMonth' })}
                    </Select.Option>
                    <Select.Option value={SEASON_ENTO}>
                      {intl.formatMessage({ id: 'selfManagement.thePeriodOfActivity' })}
                    </Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  style={{ margin: 0 }}
                  name={['activityDefined', 'lotteryNum']}
                  initialValue={1}
                  rules={[
                    {
                      required: true,
                      validator: (_rule, value) => {
                        const pattern = /^[1-9]\d*$/
                        if (!value) {
                          return Promise.reject(
                            new Error(`${intl.formatMessage({ id: 'selfManagement.pleaseNumberLottery' })}`),
                          )
                        }
                        if (!pattern.test(value)) {
                          return Promise.reject(
                            new Error(`${intl.formatMessage({ id: 'selfManagement.drawingNumberGreater' })}`),
                          )
                        }
                        return Promise.resolve()
                      },
                    },
                  ]}
                >
                  <Input style={{ width: '160px' }} addonAfter={intl.formatMessage({ id: 'selfManagement.time' })} />
                </Form.Item>
              </Space>
            </Form.Item>
          </Fragment>
        )
    }
  }
  /** 预售 */
  const advanceSale = (int = 1) => {
    switch (Number(int)) {
      case ACTIVITY_TYPE_14:
        return (
          <Fragment>
            <Form.Item
              label={intl.formatMessage({ id: 'selfManagement.theDepositPaymentTime' })}
              style={{ margin: 0 }}
              required
            >
              <Space style={{ display: 'flex' }} align="baseline">
                <Form.Item
                  name={['activityDefined', 'depositPayStartTime']}
                  validateFirst
                  dependencies={['startTime', 'endTime']}
                  rules={[
                    {
                      required: true,
                      message: `${intl.formatMessage({ id: 'selfManagement.pleaseSelectDepositPayment' })}`,
                    },
                    ({ getFieldValue }) => ({
                      validator: (_rule, value) => {
                        const _startTime = getFieldValue('startTime')
                        if (_startTime && !moment(value).isAfter(_startTime)) {
                          return Promise.reject(
                            new Error(`${intl.formatMessage({ id: 'selfManagement.depositPaymentGreater' })}`),
                          )
                        }
                        return Promise.resolve()
                      },
                    }),
                  ]}
                >
                  <DatePicker
                    showTime
                    showNow={false}
                    allowClear
                    onBlur={() => getRule()}
                    disabledDate={(current) => {
                      return current && current < moment().startOf('day')
                    }}
                  />
                </Form.Item>
                ~
                <Form.Item
                  name={['activityDefined', 'depositPayEndTime']}
                  validateFirst
                  dependencies={['startTime', 'endTime']}
                  rules={[
                    {
                      required: true,
                      message: `${intl.formatMessage({ id: 'selfManagement.pleaseSelectDepositPaymentDeadline' })}`,
                    },
                    ({ getFieldValue }) => ({
                      validator: (_rule, value) => {
                        const _endTime = getFieldValue('endTime')
                        if (_endTime && !moment(value).isBefore(_endTime)) {
                          return Promise.reject(
                            new Error(
                              `${intl.formatMessage({ id: 'selfManagement.depositPaymentDeadlineSmallerActivity' })}`,
                            ),
                          )
                        }
                        return Promise.resolve()
                      },
                    }),
                  ]}
                >
                  <DatePicker
                    showTime
                    showNow={false}
                    allowClear
                    onBlur={() => getRule()}
                    disabledDate={(current) => {
                      return current && current < moment().startOf('day')
                    }}
                  />
                </Form.Item>
              </Space>
            </Form.Item>
            <Form.Item
              label={intl.formatMessage({ id: 'selfManagement.balancePaymentPaymentTime' })}
              style={{ margin: 0 }}
              required
            >
              <Space style={{ display: 'flex' }} align="baseline">
                <Form.Item
                  name={['activityDefined', 'balancePaymentPayStartTime']}
                  validateFirst
                  dependencies={['startTime', 'endTime']}
                  rules={[
                    {
                      required: true,
                      message: `${intl.formatMessage({ id: 'selfManagement.pleaseBalancePayment' })}`,
                    },
                    ({ getFieldValue }) => ({
                      validator: (_rule, value) => {
                        const _startTime = getFieldValue('startTime')
                        if (_startTime && !moment(value).isAfter(_startTime)) {
                          return Promise.reject(
                            new Error(`${intl.formatMessage({ id: 'selfManagement.balancePaymentGreater' })}`),
                          )
                        }
                        return Promise.resolve()
                      },
                    }),
                  ]}
                >
                  <DatePicker
                    showTime
                    showNow={false}
                    allowClear
                    onBlur={() => getRule()}
                    disabledDate={(current) => {
                      return current && current < moment().startOf('day')
                    }}
                  />
                </Form.Item>
                ~
                <Form.Item
                  name={['activityDefined', 'balancePaymentPayEndTime']}
                  validateFirst
                  dependencies={['startTime', 'endTime']}
                  rules={[
                    {
                      required: true,
                      message: `${intl.formatMessage({ id: 'selfManagement.pleasePayBalancePaymentDeadline' })}`,
                    },
                    ({ getFieldValue }) => ({
                      validator: (_rule, value) => {
                        const _endTime = getFieldValue('endTime')
                        if (_endTime && !moment(value).isBefore(_endTime)) {
                          return Promise.reject(
                            new Error(
                              `${intl.formatMessage({ id: 'selfManagement.balancePaymentDeadlineSmallerActivity' })}`,
                            ),
                          )
                        }
                        return Promise.resolve()
                      },
                    }),
                  ]}
                >
                  <DatePicker
                    showTime
                    showNow={false}
                    allowClear
                    onBlur={() => getRule()}
                    disabledDate={(current) => {
                      return current && current < moment().startOf('day')
                    }}
                  />
                </Form.Item>
              </Space>
            </Form.Item>
            <Form.Item
              name={['activityDefined', 'deliverTime']}
              label={intl.formatMessage({ id: 'selfManagement.startTheDeliveryTime' })}
              validateFirst
              dependencies={[['activityDefined', 'balancePaymentPayEndTime']]}
              rules={[
                {
                  required: true,
                  message: `${intl.formatMessage({ id: 'selfManagement.pleaseSelectShipping' })}`,
                },
                ({ getFieldValue }) => ({
                  validator: (_rule, value) => {
                    const _balancePaymentPayEndTime = getFieldValue('activityDefined').balancePaymentPayEndTime
                    if (_balancePaymentPayEndTime && !moment(value).isAfter(_balancePaymentPayEndTime)) {
                      return Promise.reject(
                        new Error(
                          `${intl.formatMessage({ id: 'selfManagement.deliveryGreaterBalancePaymentDeadline' })}`,
                        ),
                      )
                    }
                    return Promise.resolve()
                  },
                }),
              ]}
            >
              <DatePicker
                showTime
                showNow={false}
                allowClear
                onBlur={() => getRule()}
                disabledDate={(current) => {
                  return current && current < moment().startOf('day')
                }}
              />
            </Form.Item>
          </Fragment>
        )
    }
  }

  return (
    <CardLayout
      id="rulesLayout"
      title={`${intl.formatMessage({ id: 'paltformSign.activityRules' })}-${
        !isEmpty(option) ? option.children : `${intl.formatMessage({ id: 'selfManagement.noSales' })}`
      }`}
    >
      {secondKill(option?.value)}
      {type(option?.value)}
      {restrictNum(option?.value)}
      {ladderBOList(option?.value, ladderType)}
      {giftType(option?.value)}
      {swapType(option?.value)}
      {allowActivity(option?.value)}
      {allowCoupon(option?.value)}
      {grouPing(option?.value)}
      {/* {exceedRule(option?.value)} */}
      {probation(option?.value)}
      {lottery(option?.value)}
      {advanceSale(option?.value)}
      <Form.Item
        name={['activityDefined', 'describe']}
        label={intl.formatMessage({ id: 'selfManagement.activityDescription' })}
      >
        <Input.TextArea
          rows={4}
          placeholder={intl.formatMessage({ id: 'selfManagement.maximum500Characters' })}
          maxLength={500}
        />
      </Form.Item>
    </CardLayout>
  )
}
export default RulesLayout
