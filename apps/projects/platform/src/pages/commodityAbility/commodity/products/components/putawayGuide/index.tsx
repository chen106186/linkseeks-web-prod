import React from 'react'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { Button, Modal, ModalProps } from 'antd'
import cx from 'classnames'
import styles from './index.less'

export interface PutawayGuideProps extends ModalProps {
  visible?: boolean
  /** 当前步骤 */
  currentStep: number
  /** 提示的商品id数组 */
  data?: number[]
}

export enum GuideMenu {
  /** 创建店铺 */
  CreateShop = 1,
  /** 配置库存 */
  ConfigStore,
  /** 配置流程 */
  ConfigProcess,
  /** 上架商品 */
  Putaway,
}

/**
 * 商品 上架引导
 * @param props
 * @returns ReactDOM
 */
const PutawayGuide: React.FC<PutawayGuideProps> = (props) => {
  const intl = useIntl()
  const { visible = false, data = [], currentStep, ...restProps } = props

  const _data = Array.from(new Set(data))

  return (
    <Modal
      title={intl.formatMessage({ id: 'commodity.putawayGuide.modal.title', defaultMessage: '商品上架引导' })}
      visible={visible}
      footer={null}
      destroyOnClose={true}
      {...restProps}
    >
      <div className={styles.giudeContainer}>
        <div className={cx(styles.guideItem, currentStep === GuideMenu.CreateShop ? styles.guideItemCurrent : null)}>
          <div>
            {intl.formatMessage({ id: 'commodity.putawayGuide.modal.h3.1', defaultMessage: '创建自营商城(店铺)' })}
          </div>
          {currentStep === GuideMenu.CreateShop ? (
            <>
              <p>
                {intl.formatMessage({ id: 'commodity.putawayGuide.modal.p.1', defaultMessage: '您还没有创建店铺。' })}
              </p>
              <Button onClick={() => history.push('/shopAbility/shopManage/add')}>
                {intl.formatMessage({ id: 'commodity.putawayGuide.modal.button.1', defaultMessage: '创建店铺' })}
              </Button>
            </>
          ) : currentStep > GuideMenu.CreateShop ? (
            <Button disabled={true}>
              {intl.formatMessage({ id: 'commodity.putawayGuide.modal.finsih', defaultMessage: '已完成' })}
            </Button>
          ) : null}
          <span className={styles.stepNumber}>1</span>
        </div>
        <div className={cx(styles.guideItem, currentStep === GuideMenu.ConfigStore ? styles.guideItemCurrent : null)}>
          <div>{intl.formatMessage({ id: 'commodity.putawayGuide.modal.h3.2', defaultMessage: '配置仓位库存' })}</div>
          {currentStep === GuideMenu.ConfigStore ? (
            <>
              <p>
                {intl.formatMessage({ id: 'commodity.putawayGuide.modal.p.2.first', defaultMessage: '您选择的商品：' })}
                {_data.toString()}{' '}
                {intl.formatMessage({
                  id: 'commodity.putawayGuide.modal.p.2.last',
                  defaultMessage: '还没有配置仓位库存。',
                })}
              </p>
              <Button onClick={() => history.push('/commodityAbility/repositories/manage')}>
                {intl.formatMessage({ id: 'commodity.putawayGuide.modal.button.2', defaultMessage: '配置仓位库存' })}
              </Button>
            </>
          ) : currentStep > GuideMenu.ConfigStore ? (
            <Button disabled={true}>
              {intl.formatMessage({ id: 'commodity.putawayGuide.modal.finsih', defaultMessage: '已完成' })}
            </Button>
          ) : null}
          <span className={styles.stepNumber}>2</span>
        </div>
        <div className={cx(styles.guideItem, currentStep === GuideMenu.ConfigProcess ? styles.guideItemCurrent : null)}>
          <div>{intl.formatMessage({ id: 'commodity.putawayGuide.modal.h3.3', defaultMessage: '配置订单流程' })}</div>
          {currentStep === GuideMenu.ConfigProcess ? (
            <>
              <p>
                {intl.formatMessage({ id: 'commodity.putawayGuide.modal.p.3.first', defaultMessage: '您选择的商品：' })}
                {_data.toString()}{' '}
                {intl.formatMessage({
                  id: 'commodity.putawayGuide.modal.p.3.last',
                  defaultMessage: '还没有配置订单流程。',
                })}
              </p>
              <Button onClick={() => history.push('/systemAbility/processManagement/purchaseB2BProcess')}>
                {intl.formatMessage({ id: 'commodity.putawayGuide.modal.button.3', defaultMessage: '配置订单流程' })}
              </Button>
            </>
          ) : currentStep > GuideMenu.ConfigProcess ? (
            <Button disabled={true}>
              {intl.formatMessage({ id: 'commodity.putawayGuide.modal.finsih', defaultMessage: '已完成' })}
            </Button>
          ) : null}
          <span className={styles.stepNumber}>3</span>
        </div>
        <div className={styles.guideItem}>
          <div>{intl.formatMessage({ id: 'commodity.putawayGuide.modal.h3.4', defaultMessage: '上架商品' })}</div>
          <span className={styles.stepNumber}>4</span>
        </div>
      </div>
    </Modal>
  )
}

PutawayGuide.defaultProps = {}

export default PutawayGuide
