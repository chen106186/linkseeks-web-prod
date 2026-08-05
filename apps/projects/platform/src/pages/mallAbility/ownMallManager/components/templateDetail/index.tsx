import React, { useState } from 'react'
import cx from 'classnames'
import { Checkbox, message, Tag } from '@linkseeks/ui'
import { ENVIRONMENT_TYPE } from '@/constants/environment'
import { useIntl } from '@linkseeks/i18n'
import { EyeOutlined, LayoutOutlined, PushpinOutlined } from '@ant-design/icons'
import UseModal from '../useModal'
import styles from './index.less'
import defaultLogo from '@/assets/imgs/default_logo.jpg'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import { postCommodityWebPageTemplateWebOpenMro, postCommodityWebPageTemplateWebUseSelfTemplate } from '@apps/apis'
import { PlayCircleIcon } from '@linkseeks/icons'
import { history } from '@linkseeks/router-manager'
interface IProps {
  detailInfo: any
  isMro?: boolean
  allShopList: any[]
  onRefresh: () => void
}

const STYLE_NAME = {
  0: 'pc',
  1: 'pc',
  2: 'h5',
  3: 'applet',
  4: 'app',
}

const TemplateDetail: React.FC<IProps> = (props) => {
  const { detailInfo, isMro, allShopList, onRefresh } = props
  const [useModalVisible, setUseModalVisible] = useState<boolean>(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const intl = useIntl()
  const MOBILE_ENVIROMENT = [2, 3, 4]

  const onChangeMroSetting = (e) => {
    postCommodityWebPageTemplateWebOpenMro({
      openMro: e.target.checked ? 1 : 0,
      templateId: detailInfo.id,
      type: 1,
    })
  }

  const handleLinkEdit = () => {
    const shopId = detailInfo?.shopId || detailInfo?.sourceShopId
    if (detailInfo?.environment === 1) {
      // 自营商城装修
      history.push(
        `/mallAbility/ownMallManager/ownMallTemplate/design/edit?id=${detailInfo.id}&template=${detailInfo.fileName}&shopId=${shopId}&property=${detailInfo?.property}`,
      )
    } else if (MOBILE_ENVIROMENT.includes(detailInfo?.environment)) {
      // 自营商城装修
      history.push(
        `/mallAbility/ownMallManager/ownMallTemplate/design/mobile/edit?id=${detailInfo.id}&template=${detailInfo.fileName}&shopId=${shopId}&environment=${detailInfo?.environment}&property=${detailInfo?.property}`,
      )
    } else {
      message.info(intl.formatMessage({ id: 'shop.template.edit.tip' }))
    }
  }

  const handleLinkPreview = () => {
    const shopId = detailInfo?.shopId || detailInfo?.sourceShopId
    if (detailInfo?.environment === 1) {
      history.push(
        `/mallAbility/ownMallManager/ownMallTemplate/design/detail?id=${detailInfo?.id}&template=${detailInfo.fileName}&shopId=${shopId}&property=${detailInfo?.property}`,
      )
    } else if (MOBILE_ENVIROMENT.includes(detailInfo?.environment)) {
      history.push(
        `/mallAbility/ownMallManager/ownMallTemplate/design/mobile/detail?id=${detailInfo.id}&template=${detailInfo.fileName}&shopId=${shopId}&environment=${detailInfo?.environment}&property=${detailInfo?.property}`,
      )
    } else {
      message.info(intl.formatMessage({ id: 'shop.template.preview.tip' }))
    }
  }

  /**
   * 使用模板
   */
  const handleConfirmUse = (selectItem) => {
    setConfirmLoading(true)
    const params: any = {
      id: detailInfo?.id,
      shopId: selectItem.value,
      shopName: selectItem.label,
    }
    postCommodityWebPageTemplateWebUseSelfTemplate(params)
      .then((res) => {
        if (res.code === 1000) {
          setUseModalVisible(false)
          onRefresh()
        }
        setConfirmLoading(false)
      })
      .catch(() => {
        setConfirmLoading(false)
      })
  }

  /**
   * 查询相同环境的商城数据
   */
  const getMallList = () => {
    if (allShopList && allShopList.length > 0) {
      const filterMallList = allShopList.filter(
        (item) => item.environment === detailInfo?.environment && item.type === 1,
      )
      return filterMallList
    }
    return []
  }

  return (
    <div className={styles.template_detail}>
      <div className={styles.template_info_wrap}>
        <div className={styles.template_img_box}>
          <img className={styles.template_img} src={detailInfo?.templatePicUrl || defaultLogo} />
        </div>
        <div className={styles.template_info}>
          <div className={styles.template_info_line}>
            <span className={styles.tempalte_name}>{detailInfo?.templateName}</span>
          </div>
          <div className={styles.template_info_line}>
            <Tag className={styles.template_info_line_tag} color="#ECF2FE">
              {ENVIRONMENT_TYPE[detailInfo?.environment].name}
            </Tag>
          </div>
          <div className={styles.template_info_line}>
            <label>{intl.formatMessage({ id: 'shop.template.form.label.templateDescribe' })}</label>
            <span>{detailInfo?.templateDescribe}</span>
          </div>
          <div className={styles.template_info_line}>
            <label>{intl.formatMessage({ id: 'shop.template.form.label.shopName' })}</label>
            <span>{detailInfo?.sourceShopName || detailInfo?.shopName}</span>
          </div>
          <div className={styles.template_info_line}>
            <label>
              {intl.formatMessage({
                id: 'common.table.status',
                defaultMessage: '状态',
              })}
              ：
            </label>
            <span
              className={cx(
                Boolean(detailInfo?.use) ? styles.template_info_line_status_use : styles.template_info_line_status_stop,
              )}
            >
              {Boolean(detailInfo?.use)
                ? intl.formatMessage({ id: 'coupon.yishiyong', defaultMessage: '已使用' })
                : intl.formatMessage({ id: 'coupon.weishiyong', defaultMessage: '未使用' })}
            </span>
          </div>
        </div>
      </div>
      {isMro && (
        <div>
          <Checkbox onChange={onChangeMroSetting} checked={detailInfo.isOpenMro}>
            {intl.formatMessage({ id: 'template.detail.openMro', defaultMessage: '启用商城MRO筛选模式' })}
          </Checkbox>
        </div>
      )}
      {Boolean(detailInfo?.use) && (
        <>
          <DetailAuthButton>
            <div className={styles.btn} onClick={() => handleLinkPreview()}>
              <EyeOutlined />
              <label>{intl.formatMessage({ id: 'common.button.preview' })}</label>
            </div>
          </DetailAuthButton>
          <EditAuthButton>
            <div className={cx(styles.btn)} onClick={() => handleLinkEdit()}>
              <LayoutOutlined />
              <label>{intl.formatMessage({ id: 'own.template.button.mall.edit' })}</label>
            </div>
          </EditAuthButton>
        </>
      )}
      {/* <AuthButton btnCode="ownMallTemplate.detail.categoryrenovation">
				{MOBILE_ENVIROMENT.includes(detailInfo?.environment) && (
					<div className={cx(styles.btn)} onClick={() => handleCategoryJump()}>
						<LayoutOutlined />
						<label>{intl.formatMessage({ id: 'own.template.button.mall.category.edit' })}</label>
					</div>
				)}
			</AuthButton> */}
      {!Boolean(detailInfo?.use) && (
        <AuthButton type="custom" code="state">
          <div className={cx(styles.btn, styles.use)} onClick={() => setUseModalVisible(true)}>
            <PlayCircleIcon size={14} />
            <label>
              {intl.formatMessage({
                id: 'shop.template.button.state.use',
                defaultMessage: '使用',
              })}
            </label>
          </div>
        </AuthButton>
      )}

      <UseModal
        title={intl.formatMessage({ id: 'own.template.modal.title.use' })}
        visible={useModalVisible}
        dataInfo={detailInfo}
        mallList={getMallList()}
        confirmLoading={confirmLoading}
        onOk={(selectItem) => handleConfirmUse(selectItem)}
        onCancel={() => setUseModalVisible(false)}
      />
    </div>
  )
}

export default TemplateDetail
