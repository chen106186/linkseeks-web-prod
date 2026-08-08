import { Select, Space } from 'antd'
import { isEmpty } from 'lodash'
import React from 'react'

interface ChangeButtonProps {
  /**
   * 详情数据
   */
  formContext: any
  /**
   * 变更
   */
  versionChange?: <T>(arg: T) => void
  /**
   * 操作按钮
   */
  authButtonCard?: React.ReactNode
  /**
   * 新否显示最新版本
   */
  isVersion?: boolean
}

const ChangeButtonCard: React.FC<ChangeButtonProps> = (props) => {
  const { formContext, versionChange, authButtonCard, isVersion } = props
  return (
    <Space>
      {!isEmpty(formContext?.data?.versions) && (
        <Select
          defaultValue={
            isVersion ? (formContext?.data?.versions[formContext?.data?.versions.length - 1]).version : undefined
          }
          style={{ width: '75px' }}
          placeholder="变更记录"
          allowClear
          onChange={versionChange}
        >
          {formContext?.data?.versions.map((_item) => (
            <Select.Option value={_item?.version} key={_item?.version}>
              {_item?.versionName}
            </Select.Option>
          ))}
        </Select>
      )}
      {authButtonCard && authButtonCard}
    </Space>
  )
}

ChangeButtonCard.defaultProps = {
  isVersion: false,
}

export default ChangeButtonCard
