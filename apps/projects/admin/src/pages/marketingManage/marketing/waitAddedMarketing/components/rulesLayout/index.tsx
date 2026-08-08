import React, { Fragment, useState } from 'react'
import { OVERLAYACTIVITYTYPE, PROMOTIONTYPE, LADDERBOLIST } from '../constants'
import { Form, Checkbox, Radio, Input, Space, Button, DatePicker, Select } from 'antd'
import { EventEmitter } from '@linkseeks/hooks'
import { FormInstance } from 'antd/es/form/Form'
import { Card as CardLayout } from '@linkseeks/ui'
import style from './index.less'
import { isEmpty } from 'lodash'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import moment from 'moment'
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
} from '@/constants/const/marketing'
interface RulesLayoutProps {
  /** umi-hooks */
  focus$?: EventEmitter<void>
  /** FormInstance */
  form?: FormInstance
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
  const { focus$, form } = props
  const [option, setOption] = useState<optionProps>()
  const [ladderType, setLadderType] = useState<number>(1)
  const [rejec, setRejec] = useState<any>({})

  const handleActivityDefinedBO = (e) => {
    const { value } = e.target
    setLadderType(Number(value))
  }

  focus$.useSubscription((val: optionProps) => {
    setRejec({})
    setOption(val)
    form.resetFields(['activityDefined'])
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
            tooltip="允许叠加活动类型表明在同一时间内允许同一个商品可以叠加的活动类型"
            label="叠加活动类型"
            rules={[{ required: false, message: '请选择叠加活动类型' }]}
            className={style.rulesLayout}
          >
            <Checkbox.Group>
              {!isEmpty(OVERLAYACTIVITYTYPE(int)?.A) &&
                OVERLAYACTIVITYTYPE(int)?.A!.map((item) => (
                  <Checkbox
                    key={item.value}
                    value={item.value}
                    disabled={rejec?.A && item.value !== rejec?.A}
                    onChange={(value) => rejection('A', item.value)}
                  >
                    {item.label}
                  </Checkbox>
                ))}
              {!isEmpty(OVERLAYACTIVITYTYPE(int)?.B) &&
                OVERLAYACTIVITYTYPE(int)?.B.map((item) => (
                  <Checkbox
                    key={item.value}
                    value={item.value}
                    disabled={rejec?.B && item.value !== rejec?.B}
                    onChange={(value) => rejection('B', item.value)}
                  >
                    {item.label}
                  </Checkbox>
                ))}
              {!isEmpty(OVERLAYACTIVITYTYPE(int)?.C) &&
                OVERLAYACTIVITYTYPE(int)?.C.map((item) => (
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
            tooltip="叠加优惠券表示活动商品是否可以同时使用优惠券"
            label="叠加优惠券"
            rules={[{ required: true, message: '请选择是否叠加优惠' }]}
          >
            <Radio.Group>
              <Radio value={true}>是</Radio>
              <Radio value={false}>否</Radio>
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
  //           tooltip="超限规则表示超过个人限购数量时，超出部分可以设定为原价购买，也可以设定为不可购买"
  //           label="超限规则"
  //           rules={[{ required: true, message: '请选择超限规则' }]}
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
            tooltip="每次用户帮砍价时最多能砍价的金额，固定金额表示每次砍掉的金额为固定，随机金额表示每次砍掉的金额为设置范围内的随机金额"
            label="每次砍价金额"
            required
            className={style.rulesLayout}
          >
            <Space direction="vertical">
              <Form.Item
                style={{ margin: 0 }}
                name={['activityDefined', 'type']}
                rules={[{ required: true, message: '请选择' }]}
              >
                <Radio.Group>
                  <Radio.Button value={RANDOM_AMOUNT}>随机金额</Radio.Button>
                  <Radio.Button value={FIXATION_AMOUNT}>固定金额</Radio.Button>
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
                      随机金额范围
                      <Form.Item
                        style={{ margin: 0 }}
                        name={['activityDefined', 'randomStartPrice']}
                        dependencies={[['activityDefined', 'randomEndPrice']]}
                        rules={[
                          ({ getFieldValue }) => ({
                            validator: (_rule, value) => {
                              const pattern = /^(\-)?\d+(\.\d{1,2})?$/
                              const randomEndPrice = getFieldValue('activityDefined')['randomEndPrice']
                              if (!value) {
                                return Promise.reject(new Error('请输入最小随机金额'))
                              }
                              if (!pattern.test(value) || !(Number(value) < Number(randomEndPrice))) {
                                return Promise.reject(new Error('必须大于0且小于最大随机金额'))
                              }
                              return Promise.resolve()
                            },
                          }),
                        ]}
                      >
                        <Input style={{ width: '160px' }} addonAfter="元" />
                      </Form.Item>
                      ~
                      <Form.Item
                        style={{ margin: 0 }}
                        name={['activityDefined', 'randomEndPrice']}
                        dependencies={[['activityDefined', 'randomStartPrice']]}
                        rules={[
                          ({ getFieldValue }) => ({
                            validator: (_rule, value) => {
                              const pattern = /^(\-)?\d+(\.\d{1,2})?$/
                              const randomStartPrice = getFieldValue('activityDefined')['randomStartPrice']
                              if (!value) {
                                return Promise.reject(new Error('请输入最大随机金额'))
                              }
                              if (!pattern.test(value) || !(Number(value) > Number(randomStartPrice))) {
                                return Promise.reject(new Error('必须大于0且大于最小随机金额'))
                              }
                              return Promise.resolve()
                            },
                          }),
                        ]}
                      >
                        <Input style={{ width: '160px' }} addonAfter="元" />
                      </Form.Item>
                    </Space>
                  ) : getFieldValue(['activityDefined', 'type']) === FIXATION_AMOUNT ? (
                    <Space style={{ display: 'flex' }}>
                      每次砍价金额
                      <Form.Item
                        style={{ margin: 0 }}
                        name={['activityDefined', 'restrictPrice']}
                        rules={[
                          {
                            required: true,
                            validator: (_rule, value) => {
                              const pattern = /^[1-9]\d*$/
                              if (!value) {
                                return Promise.reject(new Error('请输入每次砍价金额'))
                              }
                              if (!pattern.test(value)) {
                                return Promise.reject(new Error(`每次砍价金额必须大于0`))
                              }
                              return Promise.resolve()
                            },
                          },
                        ]}
                      >
                        <Input style={{ width: '160px' }} addonAfter="元" />
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
                    满
                    <Form.Item
                      {...restField}
                      style={{ margin: 0 }}
                      name={[name, `${int === ACTIVITY_TYPE_7 ? 'num' : 'key'}`]}
                      fieldKey={[name, `${int === ACTIVITY_TYPE_7 ? 'num' : 'key'}`]}
                      rules={[
                        {
                          required: true,
                          validator: (_rule, value) => {
                            const pattern1 = /^[1-9]\d*$/
                            const pattern2 = /^([1-9]\d*(\.\d{1,2})?|([0](\.([0][1-9]|[1-9]\d{0,1}))))$/
                            if (!value && int === ACTIVITY_TYPE_4) {
                              return Promise.reject(new Error('请输入数量'))
                            }
                            if (!value && int === ACTIVITY_TYPE_5) {
                              return Promise.reject(new Error('请输入金额'))
                            }
                            if (!value && int === ACTIVITY_TYPE_7) {
                              return Promise.reject(new Error('请输入件数'))
                            }
                            if (!pattern1.test(value) && (int === ACTIVITY_TYPE_4 || int === ACTIVITY_TYPE_7)) {
                              return Promise.reject(new Error(`必须大于0`))
                            }
                            if (!pattern2.test(value) && int === ACTIVITY_TYPE_5) {
                              return Promise.reject(new Error(`必须大于0最多保留2位小数`))
                            }
                            return Promise.resolve()
                          },
                        },
                      ]}
                    >
                      <Input addonAfter={LADDERBOLIST(int, type)?.addon} />
                    </Form.Item>
                    {LADDERBOLIST(int, type)?.addonAfter}
                    <Form.Item
                      {...restField}
                      style={{ margin: 0 }}
                      name={[name, `${int === ACTIVITY_TYPE_7 ? 'discount' : 'value'}`]}
                      fieldKey={[name, `${int === ACTIVITY_TYPE_7 ? 'discount' : 'value'}`]}
                      rules={[
                        {
                          required: true,
                          validator: (_rule, value) => {
                            const pattern1 = /^([1-9]\d*(\.\d{1,2})?|([0](\.([0][1-9]|[1-9]\d{0,1}))))$/
                            const pattern2 = /^([1-9]\d*(\.\d{1,2})?|([0](\.([0][1-9]|[1-9]\d{0,1}))))$/
                            const pattern3 = /^(?!0+(?:\.0+)?$)\d?\d(?:\.\d{1,1}?)?$/
                            const pattern4 = /^(?!0+(?:\.0+)?$)\d?\d(?:\.\d{1,1}?)?$/
                            const valueKey = form.getFieldValue(`activityDefined`)['ladderList'][name]['key']
                            if (!value) {
                              return Promise.reject(new Error('请输入'))
                            }
                            if (
                              !pattern1.test(value) &&
                              (int === ACTIVITY_TYPE_4 || int === ACTIVITY_TYPE_7) &&
                              type === 1
                            ) {
                              return Promise.reject(new Error('最多保留2位小数，大于0，不可为空'))
                            }
                            if (
                              !pattern3.test(value) &&
                              (int === ACTIVITY_TYPE_4 || int === ACTIVITY_TYPE_7) &&
                              type === 2
                            ) {
                              return Promise.reject(new Error('最多保留1位小数，大于0且小于100，不可为空'))
                            }
                            if (!pattern2.test(value) && int === ACTIVITY_TYPE_5 && type === 1) {
                              return Promise.reject(new Error('最多保留2位小数，大于0，不可为空'))
                            }
                            if (int === ACTIVITY_TYPE_5 && type === 1 && Number(valueKey) <= Number(value)) {
                              return Promise.reject(new Error('最多保留2位小数，大于0且小于优惠门槛'))
                            }
                            if (!pattern4.test(value) && int === ACTIVITY_TYPE_5 && type === 2) {
                              return Promise.reject(new Error('必须大于0且小于100最多保留2位小数'))
                            }
                            return Promise.resolve()
                          },
                        },
                      ]}
                    >
                      <Input addonAfter={LADDERBOLIST(int, type)?.addonBefore} />
                    </Form.Item>
                    <Button icon={<MinusOutlined />} onClick={() => remove(name)} />
                  </Space>
                ))}
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  新增
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            )}
          </Form.List>
        )
      /** 组合促销 */
      case ACTIVITY_TYPE_8:
        return (
          <Form.Item label="优惠规则" required>
            <Space style={{ display: 'flex', marginBottom: 8 }} align="center">
              任选
              <Form.Item
                style={{ margin: 0 }}
                name={['activityDefined', 'num']}
                rules={[
                  {
                    required: true,
                    validator: (_rule, value) => {
                      const pattern = /^[1-9]\d*$/
                      if (!value) {
                        return Promise.reject(new Error('请输入件数'))
                      }
                      if (!pattern.test(value)) {
                        return Promise.reject(new Error(`必须大于0`))
                      }
                      return Promise.resolve()
                    },
                  },
                ]}
              >
                <Input addonAfter="件" />
              </Form.Item>
              付
              <Form.Item
                style={{ margin: 0 }}
                name={['activityDefined', 'price']}
                rules={[
                  {
                    required: true,
                    validator: (_rule, value) => {
                      const pattern = /^([1-9]\d*(\.\d{1,2})?|([0](\.([0][1-9]|[1-9]\d{0,1}))))$/
                      if (!value) {
                        return Promise.reject(new Error('请输入金额'))
                      }
                      if (!pattern.test(value)) {
                        return Promise.reject(new Error(`金额必须大于0最多保留2位小数`))
                      }
                      return Promise.resolve()
                    },
                  },
                ]}
              >
                <Input addonAfter="元" />
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
            tooltip="赠商品为赠送特定的商品，赠优惠券为赠送特定的优惠券"
            label="赠品类型"
            rules={[{ required: true, message: '请选择赠品类型' }]}
            className={style.rulesLayout}
          >
            <Radio.Group>
              <Radio.Button value={WHITGIFT_PRODUCT}>赠商品</Radio.Button>
              <Radio.Button value={BUYPRODUCT_WHITGIFT}>赠优惠券</Radio.Button>
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
            tooltip="满额换购为订单满足要求购买的金额后，以优惠价格换购商品，买商品换购为购买满足数量的活动商品后，以优惠价格换购商品"
            label="换购类型"
            rules={[{ required: true, message: '请选择换购类型' }]}
            className={style.rulesLayout}
          >
            <Radio.Group>
              <Radio.Button value={FULL_EXCHANGE}>满额换购</Radio.Button>
              <Radio.Button value={BUYPRODUCT_EXCHANGE}>买商品换购</Radio.Button>
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
          <Form.Item tooltip="每个用户帮砍价的最大次数" label="用户限制次数" required>
            <Space style={{ display: 'flex' }}>
              同一用户限制
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
                        return Promise.reject(new Error('请输入限制次数'))
                      }
                      if (!pattern.test(value)) {
                        return Promise.reject(new Error(`限制次数必须大于0`))
                      }
                      return Promise.resolve()
                    },
                  },
                ]}
              >
                <Input style={{ width: '160px' }} addonAfter="次" />
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
              tooltip="要求成团必须达到的人数，如只有参加团购的人数满足成团人数设置要求，团购才成立"
              label="成团人数"
              name={['activityDefined', 'assembleNum']}
              rules={[
                {
                  required: true,
                  validator: (_rule, value) => {
                    const pattern = /^0*(?:[2-9]|[1-9]\d\d*)$/
                    if (!value) {
                      return Promise.reject(new Error('请输入成团人数'))
                    }
                    if (!pattern.test(value)) {
                      return Promise.reject(new Error(`成团人数必须大于0`))
                    }
                    return Promise.resolve()
                  },
                },
              ]}
            >
              <Input style={{ width: '359px' }} addonAfter="人" />
            </Form.Item>
            <Form.Item
              tooltip="成团时间表示在活动有效期内，是否需要限制成团时间，不限制表示在活动有效时间内都可以参团，限制时要求输入限制时间，达到限制时间时自动成团，不能再参团。"
              label="成团时间"
              className={style.rulesLayout}
              required
            >
              <Space>
                <Form.Item
                  style={{ margin: 0 }}
                  name={['activityDefined', 'assembleStatus']}
                  initialValue={1}
                  rules={[{ required: true, message: '请选择' }]}
                >
                  <Radio.Group>
                    {/* <Radio.Button value={0}>不限制</Radio.Button> */}
                    <Radio.Button value={1}>限制</Radio.Button>
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
                                return Promise.reject(new Error('请输入成团时间'))
                              }
                              if (!pattern.test(value)) {
                                return Promise.reject(new Error(`成团时间必须大于0小于24`))
                              }
                              return Promise.resolve()
                            },
                          },
                        ]}
                      >
                        <Input style={{ width: '191px' }} addonAfter="小时" />
                      </Form.Item>
                    )
                  }
                </Form.Item>
              </Space>
            </Form.Item>
            {/* <Form.Item
              tooltip="用户参团限制表示已在本团购活动内参团的用户是否可以参加其他有效团购活动，不限制表示可以无限制参加，限制时要求填写次数，默认为1"
              label="用户参团限制"
              className={style.rulesLayout}
              required
            >
              <Space>
                <Form.Item
                  style={{ margin: 0 }}
                  name={['activityDefined', 'joinAssembleStatus']}
                  rules={[{ required: true, message: "请选择" }]}
                >
                  <Radio.Group>
                    <Radio.Button value={0}>不限制</Radio.Button>
                    <Radio.Button value={1}>限制</Radio.Button>
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
                            return Promise.reject(new Error('请输入参团限制次数'));
                          }
                          if (!pattern.test(value)) {
                            return Promise.reject(new Error(`参团限制次数必须大于0`));
                          }
                          return Promise.resolve();
                        }
                      }]}
                    >
                      <Input style={{ width: '191px' }} addonAfter="次" />
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
            tooltip="设置活动周期内每日可以秒杀时间段，在秒杀时间段内，可以用秒杀价购买，不在秒杀时间段内，恢复原价购买"
            label="每日秒杀时间段"
            style={{ margin: 0 }}
            required
          >
            <Space style={{ display: 'flex' }} align="baseline">
              <Form.Item
                name={['activityDefined', 'startTime']}
                rules={[
                  { required: true, message: '开始秒杀！' },
                  () => ({
                    validator(_, value) {
                      const _endTime = form.getFieldValue('activityDefined').endTime
                      if (_endTime && !moment(value).isBefore(_endTime)) {
                        return Promise.reject(new Error('开始秒杀时间必须小于结束秒杀时间'))
                      }
                      return Promise.resolve()
                    },
                  }),
                ]}
              >
                <DatePicker style={{ width: '168px' }} picker="time" allowClear />
              </Form.Item>
              ~
              <Form.Item
                name={['activityDefined', 'endTime']}
                rules={[
                  { required: true, message: '结束秒杀！' },
                  () => ({
                    validator(_, value) {
                      const _startTime = form.getFieldValue('activityDefined').startTime
                      if (_startTime && !moment(value).isAfter(_startTime)) {
                        return Promise.reject(new Error('结束秒杀时间必须大于开始秒杀时间'))
                      }
                      return Promise.resolve()
                    },
                  }),
                ]}
              >
                <DatePicker style={{ width: '168px' }} picker="time" allowClear />
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
              tooltip="当试用活动到期后，按设置的抽取试用用户时间，系统自动从申请试用用户中抽取试用用户并生成订单"
              label="抽取试用用户时间"
              name={['activityDefined', 'extractAttemptUserTime']}
              rules={[{ required: true, message: '请选择抽取试用用户时间' }]}
            >
              <DatePicker
                showTime
                showNow={false}
                style={{ width: '168px' }}
                allowClear
                disabledDate={(current) => {
                  return current && current < moment().startOf('second')
                }}
              />
            </Form.Item>
            <Form.Item
              tooltip="试用结束时间到达后，要求试用用户提交试用报告，系统提醒试用用户提交试用报告"
              label="试用结束时间"
              name={['activityDefined', 'attemptEndTime']}
              rules={[{ required: true, message: '请选择试用结束时间' }]}
            >
              <DatePicker
                showTime
                showNow={false}
                style={{ width: '168px' }}
                allowClear
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
              tooltip="订单抽奖表示用户订单满N元且支付成功后可参与一次抽奖，积分抽奖表示用户消耗N积分可参与一次抽奖，行为抽奖表示用户签到或申请会员后可参与一次抽奖，活动抽奖表示在抽奖活动中，用户可无条件参与抽奖"
              label="抽奖类型"
              required
            >
              <Space direction="vertical">
                <Form.Item
                  name={['activityDefined', 'lotteryType']}
                  style={{ margin: 0 }}
                  rules={[{ required: true, message: '请选择抽奖类型' }]}
                >
                  <Radio.Group>
                    <Radio.Button value={LOTTERY_ORDERLOTTERY}>订单抽奖</Radio.Button>
                    <Radio.Button value={LOTTERY_INTEGRALLOTTERY}>积分抽奖</Radio.Button>
                    <Radio.Button value={LOTTERY_BEHAVIORLOTTERY}>行为抽奖</Radio.Button>
                    <Radio.Button value={LOTTERY_ACTIVITYLOTTERY}>活动抽奖</Radio.Button>
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
                        订单金额满
                        <Form.Item
                          style={{ margin: 0 }}
                          name={['activityDefined', 'orderPrice']}
                          rules={[
                            {
                              required: true,
                              validator: (_rule, value) => {
                                const pattern = /^([1-9]\d*(\.\d{1,2})?|([0](\.([0][1-9]|[1-9]\d{0,1}))))$/
                                if (!value) {
                                  return Promise.reject(new Error('请输入订单金额'))
                                }
                                if (!pattern.test(value)) {
                                  return Promise.reject(new Error(`订单金额必须大于0`))
                                }
                                return Promise.resolve()
                              },
                            },
                          ]}
                        >
                          <Input style={{ width: '160px' }} addonAfter="元" />
                        </Form.Item>
                        且支付成功后参与抽奖
                      </Space>
                    ) : getFieldValue(['activityDefined', 'lotteryType']) === LOTTERY_INTEGRALLOTTERY ? (
                      <Space style={{ display: 'flex' }}>
                        每次抽奖消耗
                        <Form.Item
                          style={{ margin: 0 }}
                          name={['activityDefined', 'integral']}
                          rules={[
                            {
                              required: true,
                              validator: (_rule, value) => {
                                const pattern = /^[1-9]\d*$/
                                if (!value) {
                                  return Promise.reject(new Error('请输入消耗积分'))
                                }
                                if (!pattern.test(value)) {
                                  return Promise.reject(new Error(`消耗积分必须大于0`))
                                }
                                return Promise.resolve()
                              },
                            },
                          ]}
                        >
                          <Input style={{ width: '160px' }} addonAfter="积分" />
                        </Form.Item>
                      </Space>
                    ) : (
                      getFieldValue(['activityDefined', 'lotteryType']) === LOTTERY_BEHAVIORLOTTERY && (
                        <Space style={{ display: 'flex' }}>
                          用户完成
                          <Form.Item
                            style={{ margin: 0 }}
                            name={['activityDefined', 'behavior']}
                            rules={[{ required: true, message: '请选择' }]}
                          >
                            <Select style={{ width: 160 }} placeholder="请选择">
                              <Select.Option value={LOTTERY_APPLYMEMBER}>申请会员</Select.Option>
                              <Select.Option value={LOTTERY_SIGNIN}>签到</Select.Option>
                            </Select>
                          </Form.Item>
                          参与抽奖
                        </Space>
                      )
                    )
                  }
                </Form.Item>
              </Space>
            </Form.Item>
            <Form.Item
              tooltip="抽奖次数可限制每日允许抽奖次数，每周允许抽奖次数，每月允许抽奖次数，也可限制在活动期间允许抽奖次数"
              label="抽奖次数"
              required
              className={style.rulesLayout}
            >
              <Space style={{ display: 'flex' }}>
                <Form.Item
                  style={{ margin: 0 }}
                  name={['activityDefined', 'lotteryNumType']}
                  rules={[{ required: true, message: '请选择抽奖次数类型' }]}
                >
                  <Select style={{ width: 160 }} placeholder="请选择">
                    <Select.Option value={EVERY_DAY}>每日</Select.Option>
                    <Select.Option value={EVERY_WEEK}>每周</Select.Option>
                    <Select.Option value={EVERY_MONTH}>每月</Select.Option>
                    <Select.Option value={SEASON_ENTO}>活动期内</Select.Option>
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
                          return Promise.reject(new Error('请输入抽奖次数'))
                        }
                        if (!pattern.test(value)) {
                          return Promise.reject(new Error(`抽奖次数必须大于0`))
                        }
                        return Promise.resolve()
                      },
                    },
                  ]}
                >
                  <Input style={{ width: '160px' }} addonAfter="次" />
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
            <Form.Item label="定金支付时间" style={{ margin: 0 }} required>
              <Space style={{ display: 'flex' }} align="baseline">
                <Form.Item
                  name={['activityDefined', 'depositPayStartTime']}
                  validateFirst
                  dependencies={['startTime', 'endTime']}
                  rules={[
                    {
                      required: true,
                      message: '请选择定金支付开始时间',
                    },
                    ({ getFieldValue }) => ({
                      validator: (_rule, value) => {
                        const _startTime = getFieldValue('startTime')
                        if (_startTime && !moment(value).isAfter(_startTime)) {
                          return Promise.reject(new Error('定金支付开始时间必须大于活动开始时间'))
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
                      message: '请选择定金支付截止时间',
                    },
                    ({ getFieldValue }) => ({
                      validator: (_rule, value) => {
                        const _endTime = getFieldValue('endTime')
                        if (_endTime && !moment(value).isBefore(_endTime)) {
                          return Promise.reject(new Error('定金支付截止时间必须小于活动结束时间'))
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
                    disabledDate={(current) => {
                      return current && current < moment().startOf('day')
                    }}
                  />
                </Form.Item>
              </Space>
            </Form.Item>
            <Form.Item label="尾款支付时间" style={{ margin: 0 }} required>
              <Space style={{ display: 'flex' }} align="baseline">
                <Form.Item
                  name={['activityDefined', 'balancePaymentPayStartTime']}
                  validateFirst
                  dependencies={['startTime', 'endTime']}
                  rules={[
                    {
                      required: true,
                      message: '请选择尾款支付开始时间',
                    },
                    ({ getFieldValue }) => ({
                      validator: (_rule, value) => {
                        const _startTime = getFieldValue('startTime')
                        if (_startTime && !moment(value).isAfter(_startTime)) {
                          return Promise.reject(new Error('尾款支付开始时间必须大于活动开始时间'))
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
                      message: '请选择尾款支付截止时间',
                    },
                    ({ getFieldValue }) => ({
                      validator: (_rule, value) => {
                        const _endTime = getFieldValue('endTime')
                        if (_endTime && !moment(value).isBefore(_endTime)) {
                          return Promise.reject(new Error('尾款支付截止时间必须小于活动结束时间'))
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
                    disabledDate={(current) => {
                      return current && current < moment().startOf('day')
                    }}
                  />
                </Form.Item>
              </Space>
            </Form.Item>
            <Form.Item
              name={['activityDefined', 'deliverTime']}
              label="开始发货时间"
              validateFirst
              dependencies={[['activityDefined', 'balancePaymentPayEndTime']]}
              rules={[
                {
                  required: true,
                  message: '请选择开始发货时间',
                },
                ({ getFieldValue }) => ({
                  validator: (_rule, value) => {
                    const _balancePaymentPayEndTime = getFieldValue('activityDefined').balancePaymentPayEndTime
                    if (_balancePaymentPayEndTime && !moment(value).isAfter(_balancePaymentPayEndTime)) {
                      return Promise.reject(new Error('开始发货时间必须大于尾款支付截止时间'))
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
    <CardLayout id="rulesLayout" title={`活动规则-${!isEmpty(option) ? option?.children : '特价促销'}`}>
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
      <Form.Item name={['activityDefined', 'describe']} label="活动描述">
        <Input.TextArea rows={4} placeholder="最长500个汉字" maxLength={500} />
      </Form.Item>
    </CardLayout>
  )
}
export default RulesLayout
