/**
 * 结算方式Filed组件
 */
import React, { useEffect, useState } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Select, Dropdown, Button, Form, Input } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { FieldData } from 'rc-field-form/lib/interface'
import classNames from 'classnames'
import { ISchema } from '@apps/formily'
import themeConfig from '@apps/config/lingxi.theme.config'
import {
  PAY_TYPE_CASH,
  PAY_TYPE_MONTHLY_STATEMENT,
  PAY_TYPE_PAYMENT_DAYS_DAY,
  PAY_TYPE_PAYMENT_DAYS_MONTH,
} from '@/constants/settlement'
import { PATTERN_MAPS } from '@/constants/regExp'
import styles from './index.less'

type PayTypeEnum = {
  label: string
  value: number
}

export type PayTypeFiledValueType = {
  /**
   * 结算方式
   */
  payType: number
  /**
   * 账期，几月
   */
  month?: string
  /**
   * 结算日，每月几号
   */
  monthDay?: string
  /**
   * 结算天数
   */
  days?: string
}

interface PayTypeFiledProps {
  /**
   * 值
   */
  value: PayTypeFiledValueType
  /**
   * 自定义内容区块样式
   */
  contentStyle?: React.CSSProperties
}

const PayTypeFiled = (props) => {
  const { mutators, editable } = props
  const xComponentProps: PayTypeFiledProps = props.props['x-component-props'] || {}
  const { contentStyle } = xComponentProps

  const [visible, setVisible] = useState(false)
  const [internalPayType, setInternalPaytype] = useState(undefined)
  const [formValues, setFormValues] = useState<PayTypeFiledValueType | undefined>(undefined)

  const [form] = Form.useForm()

  const intl = useIntl()

  const value = typeof props.value === 'object' ? props.value : {}
  const options: PayTypeEnum[] = props.props.enum || []

  useEffect(() => {
    if (typeof props.value === 'object') {
      if ((value as PayTypeFiledValueType).payType !== internalPayType) {
        setInternalPaytype((value as PayTypeFiledValueType).payType)
      }
      form.setFieldsValue(value)
    }
  }, [value])

  const triggerChange = (next: PayTypeFiledValueType) => {
    mutators.change(next)
  }

  const handleVisibleChange = (flag: boolean) => {
    setVisible(flag)
  }

  // TODO: 有时间再把支付类型抽成Fields组件
  const handlePayTypeChange = (next: PayTypeEnum) => {
    setInternalPaytype(next.value)
    form.resetFields(['month', 'monthDay', 'days'])
    setFormValues(undefined)
  }

  const handleFormValuesChange = (
    _: Omit<PayTypeFiledValueType, 'payType'>,
    allValues: Omit<PayTypeFiledValueType, 'payType'>,
  ) => {
    // triggerChange({ ...value, payType: internalPayType, ...allValues });
    setFormValues({ payType: internalPayType, ...allValues })
  }

  const renderSettlementDate = () => {
    switch (internalPayType) {
      case PAY_TYPE_CASH: {
        break
      }
      case PAY_TYPE_PAYMENT_DAYS_DAY: {
        return (
          <>
            <Form.Item
              label={intl.formatMessage({
                id: 'customerAbility.management.memberPrComingClassify.drawer.form.classify.months',
                defaultMessage: '账期 (几个月)',
              })}
              name="month"
              style={{ marginBottom: themeConfig['@margin-xs'] }}
              rules={[
                {
                  pattern: PATTERN_MAPS.quantity,
                  message: intl.formatMessage({
                    id: 'customerAbility.management.memberPrComingClassify.drawer.form.classify.month.legal',
                    defaultMessage: '请输入正整数',
                  }),
                },
              ]}
            >
              <Input
                addonAfter={intl.formatMessage({
                  id: 'customerAbility.management.memberPrComingClassify.drawer.form.classify.month.addonAfter',
                  defaultMessage: '个月',
                })}
              />
            </Form.Item>
            <Form.Item
              label={intl.formatMessage({
                id: 'customerAbility.management.memberPrComingClassify.drawer.form.classify.monthDay2',
                defaultMessage: '结算日 (每月几号)',
              })}
              name="monthDay"
              style={{ marginBottom: themeConfig['@margin-xs'] }}
              rules={[
                {
                  pattern: PATTERN_MAPS.quantity,
                  message: intl.formatMessage({
                    id: 'customerAbility.management.memberPrComingClassify.drawer.form.classify.monthDay.legal',
                    defaultMessage: '请输入正整数',
                  }),
                },
                {
                  validator(value) {
                    const intVal = +value
                    return intVal > 31 || intVal < 0
                      ? Promise.reject(
                          new Error(
                            intl.formatMessage({
                              id: 'customerAbility.management.memberPrComingClassify.drawer.form.classify.monthDay.limit',
                              defaultMessage: '请输入大于0 小于等于 31的数值',
                            }),
                          ),
                        )
                      : Promise.resolve()
                  },
                },
              ]}
            >
              <Input
                addonAfter={intl.formatMessage({
                  id: 'customerAbility.management.memberPrComingClassify.drawer.form.classify.monthDay.addonAfter',
                  defaultMessage: '号',
                })}
              />
            </Form.Item>
          </>
        )
      }
      case PAY_TYPE_PAYMENT_DAYS_MONTH: {
        return (
          <Form.Item
            label={intl.formatMessage({
              id: 'customerAbility.management.memberPrComingClassify.drawer.form.classify.days2',
              defaultMessage: '账期 (间隔多少天)',
            })}
            name="days"
            rules={[
              {
                pattern: PATTERN_MAPS.quantity,
                message: intl.formatMessage({
                  id: 'customerAbility.management.memberPrComingClassify.drawer.form.classify.days.legal',
                  defaultMessage: '请输入正整数',
                }),
              },
            ]}
          >
            <Input
              addonAfter={intl.formatMessage({
                id: 'customerAbility.management.memberPrComingClassify.drawer.form.classify.days.addonAfter',
                defaultMessage: '天',
              })}
            />
          </Form.Item>
        )
      }
      case PAY_TYPE_MONTHLY_STATEMENT: {
        return (
          <Form.Item
            label={intl.formatMessage({
              id: 'customerAbility.management.memberPrComingClassify.drawer.form.classify.monthDay2',
              defaultMessage: '结算日 (每月几号)',
            })}
            name="monthDay"
            style={{ marginBottom: themeConfig['@margin-xs'] }}
            rules={[
              {
                pattern: PATTERN_MAPS.quantity,
                message: intl.formatMessage({
                  id: 'customerAbility.management.memberPrComingClassify.drawer.form.classify.monthDay.legal',
                  defaultMessage: '请输入正整数',
                }),
              },
              {
                validator(value) {
                  const intVal = +value
                  return intVal > 31 || intVal < 0
                    ? Promise.reject(
                        new Error(
                          intl.formatMessage({
                            id: 'customerAbility.management.memberPrComingClassify.drawer.form.classify.monthDay.limit',
                            defaultMessage: '请输入大于0 小于等于 31的数值',
                          }),
                        ),
                      )
                    : Promise.resolve()
                },
              },
            ]}
          >
            <Input
              addonAfter={intl.formatMessage({
                id: 'customerAbility.management.memberPrComingClassify.drawer.form.classify.monthDay.addonAfter',
                defaultMessage: '号',
              })}
            />
          </Form.Item>
        )
      }
      default:
        break
    }
  }

  const handleSubmit = () => {
    triggerChange({
      payType: internalPayType,
      ...form.getFieldsValue(),
    })
    setVisible(false)
  }

  const currentPayType = options?.find((item) => item.value === internalPayType)

  const content = (
    <div>
      {`
        ${currentPayType ? currentPayType.label : ''}
        ${
          formValues?.month
            ? '：' +
              formValues.month +
              intl.formatMessage({
                id: 'customerAbility.management.memberPrComingClassify.drawer.form.classify.month.addonAfter',
                defaultMessage: '个月',
              })
            : ''
        }
        ${
          formValues?.monthDay
            ? `，${intl.formatMessage({
                id: 'customerAbility.management.memberPrComingClassify.drawer.form.classify.monthDay',
                defaultMessage: '结算日',
              })}：` +
              formValues.monthDay +
              intl.formatMessage({
                id: 'customerAbility.management.memberPrComingClassify.drawer.form.classify.monthDay.addonAfter',
                defaultMessage: '号',
              })
            : ''
        }
        ${
          formValues?.days
            ? '：' +
              formValues.days +
              intl.formatMessage({
                id: 'customerAbility.management.memberPrComingClassify.drawer.form.classify.days.addonAfter',
                defaultMessage: '天',
              })
            : ''
        }
      `}
    </div>
  )

  if (!editable) return content

  return (
    <div className={styles['pay-type']}>
      <Dropdown
        visible={visible}
        onVisibleChange={handleVisibleChange}
        overlay={
          <div className={styles['pay-type-overlay']}>
            <div className={styles['pay-type-options']}>
              {options.map((item) => (
                <div key={item.value} className={styles['pay-type-options-item']}>
                  <Button
                    className={classNames(styles['pay-type-options-item-btn'], {
                      [styles['pay-type-options-item-btn-active']]: item.value === internalPayType,
                    })}
                    onClick={() => handlePayTypeChange(item)}
                  >
                    {item.label}
                  </Button>
                </div>
              ))}
            </div>
            <Form form={form} layout="vertical" onValuesChange={handleFormValuesChange}>
              {renderSettlementDate()}
            </Form>
            <div className={styles['pay-type-actions']}>
              <div className={styles['pay-type-actions-item']}>
                <Button onClick={() => setVisible(false)} block>
                  {intl.formatMessage({ id: 'common.button.cancel', defaultMessage: '取消' })}
                </Button>
              </div>
              <div className={styles['pay-type-actions-item']}>
                <Button type="primary" onClick={handleSubmit} block>
                  {intl.formatMessage({ id: 'common.button.confirm', defaultMessage: '确定' })}
                </Button>
              </div>
            </div>
          </div>
        }
        trigger={['click']}
      >
        <div
          className={classNames(styles['pay-type-content'], { [styles['pay-type-content-active']]: visible })}
          style={contentStyle}
        >
          <div className={styles['pay-type-content-text']}>{content}</div>
          <DownOutlined className={styles['pay-type-content-arrow']} />
        </div>
        {/* <Select
          value={'账期(按月)：3个月，结算日：1号'}
          dropdownStyle={{ display: 'none' }}
          onClick={(e) => { e.stopPropagation(); }}
          disabled
        /> */}
      </Dropdown>
    </div>
  )
}

PayTypeFiled.isFieldComponent = true

export default PayTypeFiled
