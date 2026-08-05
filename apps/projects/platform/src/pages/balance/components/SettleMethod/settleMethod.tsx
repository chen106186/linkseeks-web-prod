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
              {intl.formatMessage({ id: 'balance.components.settleMethod.method.1' })}
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
              {intl.formatMessage({ id: 'balance.components.settleMethod.method.2' })}
            </div>
          )) ||
            null}
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.sectionItem}>
          <div className={styles.label}>
            {isDayActive
              ? intl.formatMessage({ id: 'balance.components.settleMethod.days.1' })
              : intl.formatMessage({ id: 'balance.components.settleMethod.days.2' })}
          </div>
          <div className={styles.input}>
            <Input
              addonAfter={
                isDayActive
                  ? intl.formatMessage({ id: 'balance.components.settleMethod.days.1.addonAfter' })
                  : intl.formatMessage({ id: 'balance.components.settleMethod.days.2.addonAfter' })
              }
              value={monthOrDayValue}
              onChange={(e) => handleInputChange(e.target.value, isDayActive ? DAY : MONTH)}
            />
          </div>
        </div>
        <div className={styles.sectionItem}>
          <div className={styles.label}>
            {intl.formatMessage({ id: 'balance.memberSettle.settleMethod.payDay', defaultMessage: '每月付款日' })}
          </div>
          <div className={styles.input}>
            <Input
              addonAfter={intl.formatMessage({ id: 'balance.components.settleMethod.days.2.addonAfter' })}
              value={payDay}
              onChange={handlePayDayChange}
            />
          </div>
        </div>
      </div>
      <div className={styles.tips}>
        {isDayActive
          ? intl.formatMessage({ id: 'balance.components.settleMethod.method.1.tooltip' })
          : intl.formatMessage({ id: 'balance.components.settleMethod.method.2.tooltip' })}
      </div>
    </div>
  )
}

export default SettleMethod
