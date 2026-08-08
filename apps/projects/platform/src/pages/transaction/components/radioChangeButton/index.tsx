import React from 'react'
import { Radio } from 'antd'
import styles from './index.less'
import { ALTERATION } from '../orderDetailSection'

interface RadioChangeButtonProps {
  /**
   * 切换变更
   */
  handleVersions: <T>(arg: T) => void
}

const RadioChangeButtonCard: React.FC<RadioChangeButtonProps> = (props) => {
  const { handleVersions } = props
  return (
    <Radio.Group
      className={styles.radioChangeButton}
      onChange={handleVersions}
      defaultValue={ALTERATION.AFTER_ALTERATION}
    >
      <Radio value={ALTERATION.BEFORE_ALTERATION}>变更前</Radio>
      <Radio value={ALTERATION.AFTER_ALTERATION}>变更后</Radio>
    </Radio.Group>
  )
}
export default RadioChangeButtonCard
