import React from 'react'
import { Button } from 'antd'
import { clearSelectedStatus } from '@apps/design-core'
import { createFormActions, ISchemaFormActions } from '@apps/formily'
import { FixtureContentProvider } from './common/context'
import styles from './index.less'

interface SettingPanelPropsType {
  footer?: React.ReactNode
  onOK?: Function
  onCancel?: Function
  confirmLoading?: boolean
  shopId: number
  property: number
}

const formActions: ISchemaFormActions = createFormActions()

const SettingWrap: React.FC<SettingPanelPropsType> = (props) => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const { children, footer, onOK, onCancel, confirmLoading = false, shopId, property } = props

  const handleConfirm = (e) => {
    if (formActions.validate()) {
      formActions.submit().then(() => {
        clearSelectedStatus()
      })
    } else {
      clearSelectedStatus()
    }
  }

  return (
    <div className={styles.setting_panel} id="setting_panel">
      <div className={styles.setting_panel_body}>
        <FixtureContentProvider value={{ formActions: formActions, shopId, property }}>
          {children}
        </FixtureContentProvider>
      </div>
      {footer ? (
        <div className={styles.setting_panel_footer}>{footer}</div>
      ) : (
        <div className={styles.setting_panel_footer}>
          <div style={{ textAlign: 'right' }}>
            <Button style={{ marginRight: 8 }} onClick={() => (onCancel ? onCancel() : clearSelectedStatus())}>
              取消
            </Button>
            <Button type="primary" onClick={(e) => handleConfirm(e)} loading={confirmLoading}>
              确定
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SettingWrap
