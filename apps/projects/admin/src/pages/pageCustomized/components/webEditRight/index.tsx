import React from 'react'
import { selectComponent } from '@apps/design-core'
import { ModuleTree } from '@apps/design-react'
import { Button } from '@linkseeks/ui'
import { getWebIntl } from '@apps/locales'
import styles from './index.less'

interface WebEditLeftProps {}

const WebEditRight: React.FC<WebEditLeftProps> = (props: WebEditLeftProps) => {
  const translate = getWebIntl()

  return (
    <div className={styles.edit_container}>
      <div className={styles.edit_container_title}>
        <span>已添加组件</span>
      </div>
      <ModuleTree />
      <Button
        type="primary"
        className={styles.add_button}
        onClick={() => {
          selectComponent({
            parentKey: '0',
            key: '99',
            domTreeKeys: ['0', '99'],
          })
        }}
      >
        {translate('web.resource.shop.tianjiazujian')}
      </Button>
    </div>
  )
}

export default WebEditRight
