import React from 'react'
import { PlayCircleOutlined } from '@ant-design/icons'
import cx from 'classnames'
import { Link } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import styles from './index.less'
import { AuthButton } from '@apps/components'
import { Environment_Status } from '@/constants'

interface TemplateItemPropsType {
  templateInfo: any
  type: string
  link: string
  btnCode: string
}

const TemplateItem: React.FC<TemplateItemPropsType> = (props) => {
  const { templateInfo, type, link, btnCode } = props
  const intl = useIntl()

  const STYLE_NAME = {
    0: 'pc',
    1: 'pc',
    2: 'h5',
    3: 'applet',
    4: 'app',
  }

  return (
    <div className={styles.template_item}>
      <div className={styles.img_box} style={{ backgroundImage: `url(${templateInfo.templatePicUrl})` }}>
        <div className={styles.img_box_mask}>
          <AuthButton type="custom" code={btnCode}>
            <Link to={`${link}?type=${type}&id=${templateInfo.id}`} className={styles.detail_btn}>
              {intl.formatMessage({ id: 'common.button.view.details' })}
            </Link>
          </AuthButton>
        </div>
      </div>
      <div className={styles.template_info}>
        <div className={cx(styles.template_info_content, type === 'goods' ? styles.goods : '')}>
          <div className={styles.template_info_content_text_wrap}>
            <div className={styles.template_info_name}>
              <span>{templateInfo.templateName}</span>
            </div>
            <div className={styles.template_info_content_text_line}>
              <div className={cx(styles.type_tag, styles[STYLE_NAME[templateInfo.environment]])}>
                {Environment_Status[templateInfo.environment].name}
              </div>
            </div>
          </div>
          <div className={cx(styles.template_item_btn, templateInfo.use === 1 ? styles.active : '')}>
            <PlayCircleOutlined />
            <label>
              {templateInfo.use === 1
                ? intl.formatMessage({ id: 'shop.template.button.state.enabling' })
                : intl.formatMessage({ id: 'shop.template.button.state.enable' })}
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TemplateItem
