import React, { PropsWithChildren } from 'react'
import { Button } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import { clearSelectedStatus } from '@apps/design-core'
import { createFormActions, ISchemaFormActions } from '@apps/formily'
import { FixtureContentProvider } from './common/context'
import styles from './index.less'

interface SettingPanelPropsType {
  footer?: React.ReactNode
  onOK?: Function
  onCancel?: Function
  confirmLoading?: boolean
}

const formActions: ISchemaFormActions = createFormActions()

const SettingWrap: React.FC<PropsWithChildren<SettingPanelPropsType>> = (props) => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const { children, footer, onOK, onCancel, confirmLoading = false } = props
  const intl = useIntl()

  const handleConfirm = async (e) => {
    if (await formActions.validate()) {
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
        <FixtureContentProvider value={{ formActions: formActions }}>{children}</FixtureContentProvider>
      </div>
      {footer ? (
        <div className={styles.setting_panel_footer}>{footer}</div>
      ) : (
        <div className={styles.setting_panel_footer}>
          <div style={{ textAlign: 'right' }}>
            <Button style={{ marginRight: 8 }} onClick={() => (onCancel ? onCancel() : clearSelectedStatus())}>
              {intl.formatMessage({ id: 'common.button.cancel' })}
            </Button>
            <Button type="primary" onClick={handleConfirm} loading={confirmLoading}>
              {intl.formatMessage({ id: 'common.button.confirm' })}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SettingWrap
