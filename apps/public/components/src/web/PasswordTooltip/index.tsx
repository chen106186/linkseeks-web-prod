import React from 'react'
import { CloseCircleIcon, CheckCircleIcon } from '@linkseeks/icons'
import { useIntl } from '@linkseeks/i18n'
import './index.less'

export interface PasswrodTooltipProps {
  /** 密码 */
  password: string
}

const PasswrodTooltip: React.FC<PasswrodTooltipProps> = (props) => {
  const { password } = props
  const LengthReg = /^[^\s]{8,20}$/
  const wordReg =
    /^(?=[a-zA-Z])(?=(?:.*\d){1,}|(?:.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]){1,})(?=(?:.*\d)(?:.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])|(?:.*[a-zA-Z])(?:.*\d)|(?:.*[a-zA-Z])(?:.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]))(?!.*\s).{8,20}$/
  const intl = useIntl()

  return (
    <div className="passwordInputTip">
      <div className="tipItem">
        {LengthReg.test(password) ? (
          <CheckCircleIcon style={{ color: '#00b47b' }} />
        ) : (
          <CloseCircleIcon style={{ color: '#e63f3c' }} />
        )}
        <span className="tiptext">
          {intl.formatMessage({
            id: 'user.mimachangdu820gezifu',
            defaultMessage: '密码长度8-20个字符',
          })}
        </span>
      </div>
      <div className="tipItem">
        {password.indexOf(' ') === -1 ? (
          <CheckCircleIcon style={{ color: '#00b47b' }} />
        ) : (
          <CloseCircleIcon style={{ color: '#e63f3c' }} />
        )}
        <span className="tiptext">
          {intl.formatMessage({
            id: 'user.mimabunengbaohankongge',
            defaultMessage: '密码不能包含空格',
          })}
        </span>
      </div>
      <div className="tipItem">
        {wordReg.test(password) ? (
          <CheckCircleIcon style={{ color: '#00b47b' }} />
        ) : (
          <CloseCircleIcon style={{ color: '#e63f3c' }} />
        )}
        <span className="tiptext">
          {intl.formatMessage({
            id: 'user.mimabixubaohandaxie',
            defaultMessage: '密码由字母开头且必须包含大写字母、小写字母和数字',
          })}
        </span>
      </div>
    </div>
  )
}

export default PasswrodTooltip
