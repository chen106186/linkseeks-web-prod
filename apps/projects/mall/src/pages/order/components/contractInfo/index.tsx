import React, { useEffect, useState } from 'react'
import cx from 'classnames'
import { getContractSignatureAuthAuthStatus } from '@apps/apis'
import { Button, Modal, Space } from 'antd'
import { getWebIntl } from '@/utils/locales'
import { MEMBER_CENTER_URL } from '@/constants/domain'
import { CONTRACT_TYPE } from '../../types'
import styles from './index.module.less'

interface Props {
  visible: boolean
  contractType?: CONTRACT_TYPE
  onChange: (val: CONTRACT_TYPE) => void
}

const ContractInfo: React.FC<Props> = ({ contractType, visible, onChange }) => {
  const translate = getWebIntl()
  const [isModalOpen, setIsModalOpen] = useState(false)
  let hasCheck = false

  const CONTRACT_LABEL = [
    { value: CONTRACT_TYPE.ELECTRONIC, label: translate('web.resource.contract.dianzihetong') },
    { value: CONTRACT_TYPE.PAPER, label: translate('web.resource.contract.zhizhihetong') },
  ]

  const setContractType = (val: CONTRACT_TYPE) => {
    if (!hasCheck && val === 1) {
      getContractSignatureAuthAuthStatus().then((res: any) => {
        const { code, data } = res
        if (code === 1000) {
          if (data) {
            hasCheck = true
            onChange(val)
          } else {
            setIsModalOpen(true)
          }
        }
      })
    } else {
      onChange(val)
    }
  }

  /**
   * 跳转去认证电子签章
   */
  const fnJumpUrl = () => {
    let path = `${MEMBER_CENTER_URL}/contract/ElectronicSignature/apply`
    window.open(path)
  }

  return visible ? (
    <div className={styles.container}>
      <div className={styles.title}>{translate('web.resource.contract.hetongxinxi')}</div>
      <div className={styles.logistics_line}>
        <div className={styles.logistics_line_label}>{translate('web.resource.contract.qiandingfangshi')}: </div>
        <div className={styles.logistics_line_tags}>
          {CONTRACT_LABEL.map((item) => (
            <div
              className={cx(styles.tag, { [styles.active]: item.value === contractType })}
              onClick={() => setContractType(item.value)}
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>
      <Modal
        title={translate('web.common.tip')}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false)
          setContractType(2)
        }}
        footer={
          <Space>
            <Button onClick={fnJumpUrl}>{translate('web.resource.contract.qurenzheng')}</Button>
            <Button
              onClick={() => {
                setIsModalOpen(false)
                setContractType(1)
              }}
            >
              {translate('web.resource.contract.yirenzhengwancheng')}
            </Button>
            <Button
              onClick={() => {
                setIsModalOpen(false)
                setContractType(2)
              }}
            >
              {translate('web.resource.contract.shiyongzhizhihetong')}
            </Button>
          </Space>
        }
      >
        {translate('web.resource.contract.ninweiyourenzhengchenggongdianzi')}
      </Modal>
    </div>
  ) : null
}

export default ContractInfo
