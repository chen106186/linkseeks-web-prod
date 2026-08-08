import React, { useMemo, useState } from 'react'
import Zxcvbn from 'zxcvbn'
import cx from 'classnames'
import { useIntl } from '@linkseeks/i18n'
import './index.less'

export type LevelType = 'low' | 'middle' | 'high'

interface PasswordStrengthProps {
  style?: React.CSSProperties
  className?: string
  value: string
  onLevelChange?: (level: LevelType) => void
}

const PasswordStrength: React.FC<PasswordStrengthProps> = (props) => {
  const { value, style, onLevelChange, className } = props
  const [level, setLevel] = useState<LevelType>('low')
  const intl = useIntl()

  /**
   * 校验密码强度
   * */
  const checkoutPwdStrength = () => {
    if (value) {
      const strengthInfo = Zxcvbn(value)
      if (strengthInfo) {
        if (strengthInfo.score >= 3) {
          setLevel('high')
          onLevelChange?.('high')
        } else if (strengthInfo.score >= 1) {
          setLevel('middle')
          onLevelChange?.('middle')
        } else {
          setLevel('low')
          onLevelChange?.('low')
        }
      }
    }
  }

  useMemo(() => {
    checkoutPwdStrength()
  }, [value])

  return (
    <div style={style} className={cx('password-strength', className)}>
      <div className="password-strength-body">
        <div className="password-strength-level-list">
          <div className={cx('password-strength-level-list-item', level === 'low' ? 'low' : '')}>
            <span>{intl.formatMessage({ id: 'common.register.pwd.low', defaultMessage: '弱' })}</span>
          </div>
          <div className={cx('password-strength-level-list-item', level === 'middle' ? 'middle' : '')}>
            <span>{intl.formatMessage({ id: 'common.register.pwd.middle', defaultMessage: '中' })}</span>
          </div>
          <div className={cx('password-strength-level-list-item', level === 'high' ? 'high' : '')}>
            <span>{intl.formatMessage({ id: 'common.register.pwd.high', defaultMessage: '强' })}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PasswordStrength
