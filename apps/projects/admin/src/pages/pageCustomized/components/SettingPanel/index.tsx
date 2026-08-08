import React from 'react'
import { Button, Modal, Space } from 'antd'
import { clearSelectedStatus, deleteComponent, SelectedInfoType, STATE_PROPS } from '@apps/design-core'
import { useSelector } from '@apps/design-react'
import styles from './index.less'

interface SettingPanelPropsType {
  footer?: React.ReactNode
  onOK?: Function
  onCancel?: Function
  confirmLoading?: boolean
}

type SettingPanelType = {
  selectedInfo: SelectedInfoType
}

interface SettingPanelPropsType {
  footer?: React.ReactNode
  onOK?: Function
  onCancel?: Function
  confirmLoading?: boolean
  children?: React.ReactNode
}

const SettingPanel: React.FC<SettingPanelPropsType> = (props) => {
  const { children, footer, onOK = () => {}, onCancel, confirmLoading = false } = props
  const { selectedInfo } = useSelector<SettingPanelType, STATE_PROPS>(['selectedInfo'])

  const handleDeleteComponent = () => {
    Modal.confirm({
      title: '是否确认删除该组件?',
      centered: true,
      onOk: () => {
        deleteComponent()
      },
    })
  }

  return (
    <div className={styles.setting_panel} id="setting_panel">
      <div className={styles.setting_panel_body}>{children}</div>
      {footer ? (
        <div className={styles.setting_panel_footer}>{footer}</div>
      ) : (
        <div className={styles.setting_panel_footer}>
          <div style={{ textAlign: 'right' }}>
            <Space>
              {selectedInfo && selectedInfo.props?.canDelete && (
                <Button onClick={handleDeleteComponent} danger>
                  删除组件
                </Button>
              )}
              <Button style={{ marginRight: 8 }} onClick={() => (onCancel ? onCancel() : clearSelectedStatus())}>
                取消
              </Button>
              <Button type="primary" onClick={(e) => onOK(e)} loading={confirmLoading}>
                确定
              </Button>
            </Space>
          </div>
        </div>
      )}
    </div>
  )
}

export default SettingPanel
