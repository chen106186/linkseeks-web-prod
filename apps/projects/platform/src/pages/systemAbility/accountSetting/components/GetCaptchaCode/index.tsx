import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from 'antd'
import styles from './index.less'
import cx from 'classnames'
import { useIntl } from '@linkseeks/i18n'

const GetCaptchaCode = (props) => {
  const intl = useIntl()
  const { disable = false } = props
  const [time, setTime] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    return () => {
      clearInterval(ref.current)
    }
  }, [])

  // 这里不使用, 这里相当于每次修改time，重新设置一个setTimeout
  // useEffect(() => {
  //   setTimeout((prev) => prev - 1, 1000);
  // }, [time])

  useEffect(() => {
    if (time === 59) {
      ref.current = setInterval(() => {
        setTime((prev) => prev - 1)
      }, 1000)
    } else if (time == 0) {
      !!props.callback && props.callback()
      clearInterval(ref.current)
    }
  }, [time])

  const isDisabled = disable || time > 0
  const handleClick = useCallback(() => {
    if (isDisabled) {
      return
    }
    const hasFn = !!props.getCode
    if (hasFn) {
      props.getCode()
      setTime(59)
    }
  }, [isDisabled])

  return (
    <div onClick={handleClick} className={cx(styles.btn, { [styles.disabled]: isDisabled })} style={{ width: '100%' }}>
      {time ? `${time} s` : intl.formatMessage({ id: 'accountSetting.getVerificationCode' })}
    </div>
  )
}

export default GetCaptchaCode
