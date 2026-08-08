import React, { PropsWithChildren } from 'react'
import { Button, Modal, Space } from 'antd'
import { useWebIntl } from '@apps/locales'
import { STATE_PROPS, SelectedInfoType, clearSelectedStatus, deleteComponent } from '@apps/design-core'
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

const SettingPanel: React.FC<PropsWithChildren<SettingPanelPropsType>> = (props) => {
  const {
    children,
    footer,
    onOK = () => {
      console.log()
    },
    onCancel,
    confirmLoading = false,
  } = props
  const { selectedInfo } = useSelector<SettingPanelType, STATE_PROPS>(['selectedInfo'])
  const translate = useWebIntl()

  const handleDeleteComponent = () => {
    Modal.confirm({
      title: translate('web.resource.shop.shifouquerenshanchugaizujian'),
      centered: true,
      onOk: () => {
        deleteComponent()
      },
    })
  }

  return (
    <div className={styles.setting_panel}>
      <div className={styles.setting_panel_body}>{children}</div>
      {footer ? (
        <div className={styles.setting_panel_footer}>{footer}</div>
      ) : (
        <div className={styles.setting_panel_footer}>
          <div style={{ textAlign: 'right' }}>
            <Space>
              {selectedInfo && selectedInfo.props?.canDelete && (
                <Button onClick={handleDeleteComponent} danger>
                  {translate('web.resource.shop.shanchuzujian')}
                </Button>
              )}
              <Button onClick={() => (onCancel ? onCancel() : clearSelectedStatus())}>
                {translate('web.common.cancel')}
              </Button>
              <Button type="primary" onClick={(e) => onOK(e)} loading={confirmLoading}>
                {translate('web.common.confirm')}
              </Button>
            </Space>
          </div>
        </div>
      )}
    </div>
  )
}

export default SettingPanel
