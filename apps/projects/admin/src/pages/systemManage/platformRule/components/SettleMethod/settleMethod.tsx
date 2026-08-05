import { QuestionCircleOutlined } from '@ant-design/icons'
import { Input, Radio, Tooltip } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import classnames from 'classnames'
import styles from './settleMethod.less'

const DAY = 1
const MONTH = 2

/** 1 => 账期，2 => 月结 */
export type SettleActiveType = 1 | 2

type EventParams = {
  active: SettleActiveType
  otherValues: [number, number]
  payDay: number
}

interface Iprops {
  value: EventParams
  onChange: (params: EventParams) => void
  /** 是否显示账期结算 */
  daysVisible: boolean
  /** 是否显示月结 */
  monthVisible: boolean
}

const SettleMethod: React.FC<Iprops> = (props: Iprops) => {
  const { value, daysVisible, monthVisible, onChange } = props
  const { active = DAY, otherValues = [30, 1], payDay = 1 } = value || {}
  const intl = useIntl()
  const handleChange = (e, type: SettleActiveType) => {
    if (active == type) {
      return
    }
    const previewValue = otherValues
    // setActive(type)
    onChange({
      active: type,
      otherValues: previewValue,
      payDay: payDay,
    })
  }

  const handleInputChange = (value: string, type: SettleActiveType) => {
    const target = type - 1
    const temp = [...otherValues]
    temp[target] = value as unknown as number
    props.onChange({
      active: type,
      otherValues: temp as [number, number],
      payDay: payDay,
    })
  }

  if (!monthVisible && !daysVisible) {
    return null
  }

  const handlePayDayChange = (e) => {
    onChange({
      ...value,
      payDay: e.target.value,
    })
  }

  const isDayActive = active === DAY
  const monthOrDayValue = isDayActive ? otherValues[0] : otherValues[1]

  return (
    <div className={styles.methods}>
      <div className={styles.container}>
        <div className={styles.methodsOptions}>
          {(daysVisible && (
            <div
              className={classnames(styles.period, {
                [styles.active]: isDayActive,
              })}
              onClick={(e) => handleChange(e, DAY)}
            >
              账期(默认)
            </div>
          )) ||
            null}
          {(monthVisible && (
            <div
              className={classnames(styles.period, {
                [styles.active]: active === MONTH,
              })}
              onClick={(e) => handleChange(e, MONTH)}
            >
              月结
            </div>
          )) ||
            null}
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.sectionItem}>
          <div className={styles.label}>{isDayActive ? '账期天数' : '每月结算日期'}</div>
          <div className={styles.input}>
            <Input
              addonAfter={isDayActive ? '天' : '号'}
              value={monthOrDayValue}
              onChange={(e) => handleInputChange(e.target.value, isDayActive ? DAY : MONTH)}
            />
          </div>
        </div>
        <div className={styles.sectionItem}>
          <div className={styles.label}>每月付款日:</div>
          <div className={styles.input}>
            <Input addonAfter={'号'} value={payDay} onChange={handlePayDayChange} />
          </div>
        </div>
      </div>
      <div className={styles.tips}>
        {isDayActive
          ? '选择账期并设置账期天数后，即结算时间为T+账期天数，系统每天自动结算当天已支付金额，更新预计付款时间为T+账期天数'
          : '选择月结并设置每月结算日期后，系统将在每月结算日当天自动将上月发生的支付金额进行结算，如每月结算日期设置为每月1号，则每月1号系统自动结算上月所有已发生的支付金额'}
      </div>
    </div>
  )
}

export default SettleMethod
