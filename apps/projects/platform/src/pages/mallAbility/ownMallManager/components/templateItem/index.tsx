import React from 'react'
import { PlayCircleOutlined } from '@ant-design/icons'
import cx from 'classnames'
import { Link } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import default_img from '@/assets/imgs/template_default_img.png'
import styles from './index.less'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
interface TemplateItemPropsType {
  templateInfo: any
  type: string
}

const TemplateItem: React.FC<TemplateItemPropsType> = (props) => {
  const { templateInfo, type } = props
  const intl = useIntl()
  const Environment_Status = {
    0: {
      name: intl.formatMessage({ id: 'shop.template.environment.status_0' }),
    },
    1: {
      name: 'web',
    },
    2: {
      name: 'H5',
    },
    3: {
      name: intl.formatMessage({ id: 'shop.template.environment.status_3' }),
    },
    4: {
      name: 'APP',
    },
  }

  return (
    <div className={styles.template_item}>
      <div className={styles.img_box} style={{ backgroundImage: `url(${templateInfo.templatePicUrl})` }}>
        <div className={styles.img_box_mask}>
          <DetailAuthButton>
            <Link
              to={`/mallAbility/ownMallManager/template/detail?type=${type}&id=${templateInfo.id}`}
              className={styles.detail_btn}
            >
              {intl.formatMessage({ id: 'common.button.view.details' })}
            </Link>
          </DetailAuthButton>
        </div>
        <div className={cx(styles.type_tag, templateInfo.environment === 2 ? styles.h5 : '')}>
          {Environment_Status[templateInfo.environment].name}
        </div>
      </div>
      <div className={styles.template_info}>
        <div className={styles.template_info_name}>
          <span>{templateInfo.templateName}</span>
          {templateInfo.isDefault && (
            <div className={styles.tag}>{intl.formatMessage({ id: 'shop.template.tag.default' })}</div>
          )}
        </div>
        <div className={cx(styles.template_info_content, type === 'goods' ? styles.goods : '')}>
          <div className={styles.template_info_content_text_wrap}>
            <div className={styles.template_info_content_text_line}>
              <label>{intl.formatMessage({ id: 'shop.template.form.label.siteName' })}</label>
              <span>{templateInfo.siteName}</span>
            </div>

            <div className={styles.template_info_content_text_line}>
              <label>{intl.formatMessage({ id: 'shop.template.form.label.shopName' })}</label>
              <span>{templateInfo.shopName}</span>
            </div>
          </div>
          <div
            className={cx(styles.template_item_btn, templateInfo.use === 1 && templateInfo.shopId ? styles.active : '')}
          >
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
