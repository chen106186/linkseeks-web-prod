import React, { Dispatch, SetStateAction } from 'react'
import { Modal } from 'antd'
import InterestedCommodity from '@/components/InterestedCommodity'
import { PostProductShopStoreGetCommodityListResponseDetail } from '@apps/apis'
import { LinkTo } from '@/utils'
import cx from 'classnames'
import { getWebIntl } from '@/utils/locales'
import styles from './index.module.less'
import useLink from '@/hooks/useLink'

interface IProps {
  purchaseCount: number
  visible: boolean
  setVisible: Dispatch<SetStateAction<boolean>>
  commonCategoryCommodityList: PostProductShopStoreGetCommodityListResponseDetail[]
}

const DialogModal: React.FC<React.PropsWithChildren<IProps>> = (props) => {
  const { purchaseCount, commonCategoryCommodityList, visible, setVisible } = props
  const { linkPrefix } = useLink()
  const translate = getWebIntl()

  return (
    <Modal
      className={styles.add_success_modal}
      title={translate('web.resource.mall.tianjiachenggong')}
      open={visible}
      footer={null}
      centered
      width={600}
      onCancel={() => setVisible(false)}
    >
      <div className={styles.add_success}>
        <div className={styles.add_success_info}>
          <div className={styles.add_success_info_title}>
            <i className={styles.add_success_info_icon}></i>
            <span>{translate('web.resource.mall.huopinyitianjiadaojinhuodan')}</span>
          </div>
          <div className={styles.add_success_info_text}>
            <span>
              {translate('web.resource.mall.dangqianjinhuodangongjizhongshangpin', {
                count: purchaseCount,
              })}
            </span>
          </div>
        </div>
        <div
          className={cx(styles.add_success_btn, styles.primary)}
          onClick={() => LinkTo(linkPrefix('/purchaseOrder'))}
        >
          {translate('web.resource.mall.qujiesuan')}
        </div>
        <div className={styles.add_success_btn} onClick={() => setVisible(false)}>
          {translate('web.resource.mall.jixugouwu')}
        </div>
      </div>
      <InterestedCommodity dataList={commonCategoryCommodityList} {...props} />
    </Modal>
  )
}

export default DialogModal
