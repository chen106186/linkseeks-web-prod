import React from 'react'
import { Tooltip, Checkbox } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { getWebIntl } from '@/utils/locales'
import styles from './index.module.less'

interface ContractPropsType {
  state: boolean
  onChange: Function
  contractInfo: any
  errorInfo?: any
  visibile: boolean
}

const Contract: React.FC<ContractPropsType> = (props) => {
  const { visibile, state, onChange, contractInfo, errorInfo } = props
  const translate = getWebIntl()

  return visibile ? (
    <div className={styles.contract}>
      <div className={styles.common_title}>
        <span>{translate('web.resource.contract.dizihetongxinxi')}</span>
        <Tooltip placement="top" title={translate('web.resource.contract.gouxuanzebiaoshitongyiqianshudianzihetong')}>
          <QuestionCircleOutlined translate={undefined} className={styles.common_title_icon} />
        </Tooltip>
      </div>
      {contractInfo && (
        <div className={styles.checkbox}>
          <Checkbox checked={state} onChange={(e) => onChange(e.target.checked)}>
            <span>{translate('web.resource.contract.wotongyiqianding')}</span>
          </Checkbox>
          <a
            href={contractInfo?.contractUrl}
            download
            rel="noreferrer"
            target="_blank"
            className={styles.checkbox_contract_text}
          >
            {' '}
            《{contractInfo?.contractName}》
          </a>
        </div>
      )}
      {errorInfo && !contractInfo && <span className={styles.errorText}>{errorInfo}</span>}
    </div>
  ) : null
}

export default Contract
