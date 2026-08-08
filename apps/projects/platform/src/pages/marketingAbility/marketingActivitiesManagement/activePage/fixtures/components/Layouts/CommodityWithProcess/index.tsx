import React from 'react'
import { Commodity, Progress } from '@apps/design-ui'
import styles from './index.less'
import classNames from 'classnames'
import { getIntl } from '@linkseeks/i18n'
import Price from '../../Price'
const intl = getIntl()
interface IChildprops {
  className: string
  onClick: () => void
  onMouseOver: () => void
  draggable?: boolean
  getOperateState: any
  productImgUrl?: string
  productName?: string
  productId?: number
  id?: number
  price?: number
  activityPrice?: number
  /** 活动限购数 */
  restrictTotalNum: number
  /** 已售数量 */
  salesNum: number
  /** 单位 */
  unit: string
}

interface Iprops {
  className: string
  children: React.ReactNode
  title: string
  theme: 0 | 1 | 2
  visible: boolean
}

const CommodityWithProcess: React.FC<Iprops> & { Item: typeof Item } = (props: Iprops) => {
  const { children, className, title, theme, visible = true, ...other } = props
  const classNameStr = classNames(styles.recommand, className)
  const { onClick, onMouseOver, getOperateState } = other as any

  const divProps = {
    onClick,
    onMouseOver,
  }

  if (!visible) {
    return null
  }

  const renderChild = () => {
    return (
      <div>
        {React.Children.map(children, (_child: any) => {
          if (_child === null) {
            return null
          }
          return React.cloneElement(_child, { ..._child.props })
        })}
      </div>
    )
  }

  return (
    <div className={classNameStr} {...divProps}>
      <span className={styles.title}>{title}</span>
      <div className={styles.container}>{renderChild()}</div>
    </div>
  )
}

const Item: React.FC<IChildprops> = (props: IChildprops) => {
  const { className, onClick, onMouseOver, ...other } = props
  const divProps = {
    onClick,
    onMouseOver,
  }

  const renderFooter = () => {
    return (
      <div className={styles.footer}>
        <Price originalPrice={other?.price!} discountPrice={other?.activityPrice} />
        <div className={styles['btn']}>
          <div>{intl.formatMessage({ id: 'activityPage.buyNow' })}</div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.item}>
      <div {...divProps} className={className} style={{ height: '100%' }}>
        <Commodity
          name={other.productName}
          image={other.productImgUrl}
          mode="horizontal"
          // discountPrice={other.activityPrice}
          // price={other.price}
          // buyBtnText={intl.formatMessage({id: 'activityPage.buyNow'})}
          progress={
            <Progress
              percent={Math.floor(((other.restrictTotalNum - (other.salesNum || 0)) / other.restrictTotalNum) * 100)}
              progressTips={intl.formatMessage({
                id: 'activityPage.surplus.percent',
                defaultMessage: '剩余0%',
                data: Math.floor(((other.restrictTotalNum - (other.salesNum || 0)) / other.restrictTotalNum) * 100),
              })}
              extra={
                <div style={{ fontSize: '10px', color: '#919598', marginLeft: '12px', minWidth: '80px' }}>
                  {intl.formatMessage({ id: 'activityPage.surplus', defaultMessage: '剩余' })}
                  <span style={{ color: '#ef3346' }}>{other.restrictTotalNum - (other.salesNum || 0)}</span>
                  {other.unit}
                </div>
              }
            />
          }
          footer={renderFooter()}
        />
      </div>
    </div>
  )
}

CommodityWithProcess.Item = Item

export default CommodityWithProcess
