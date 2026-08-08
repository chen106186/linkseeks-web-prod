/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-20 15:11:42
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-04 15:45:09
 * @Description: 会员权益信息统计信息
 */
import React, { HTMLAttributes } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Row, Col } from 'antd'
import MellowCard from '@/components/MellowCard'
import IMG_EQUITY4 from '@/assets/imgs/equity-4.png'
import IMG_EQUITY5 from '@/assets/imgs/equity-5.png'
import styles from './index.less'
import { getWebIntl } from '@apps/locales'
const translate = getWebIntl()
interface IProps {
  /**
   * 权益信息
   */
  data: {
    /**
     * 累计返现金额
     */
    sumReturnMoney: number
    /**
     * 已用积分
     */
    sumUsedPoint: number
    /**
     * 累计积分
     */
    sumPoint: number
  }
}

const MemberRightsAnalysis: React.FC<IProps> = (props: IProps) => {
  const { data, ...rest } = props

  const intl = useIntl()

  return (
    <div className={styles.equityInfo} {...rest}>
      <Row gutter={16}>
        <Col span={12}>
          <MellowCard
            title={intl.formatMessage({
              id: 'customerAbility.components.MemberRightsAnalysis.returnMoney',
              defaultMessage: '返现',
            })}
          >
            <div className={styles.container}>
              <div className={styles['container-content']}>
                <div className={styles.exhibition}>
                  <div className={styles['exhibition-left']}>
                    <div className={styles['exhibition-title']}>
                      {intl.formatMessage({
                        id: 'customerAbility.components.MemberRightsAnalysis.sumReturnMoney',
                        defaultMessage: '累计返现金额',
                      })}
                    </div>
                    <div className={styles['exhibition-amount']}>
                      <span>{translate('web.common.currencySymbol')}</span>
                      {data?.sumReturnMoney}
                    </div>
                  </div>
                  <div className={styles['exhibition-right']}>
                    <div className={styles['exhibition-logo']}>
                      <img src={IMG_EQUITY4} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </MellowCard>
        </Col>
        <Col span={12}>
          <MellowCard
            title={intl.formatMessage({
              id: 'customerAbility.components.MemberRightsAnalysis.point',
              defaultMessage: '积分',
            })}
          >
            <div className={styles.container}>
              <div className={styles['container-content']}>
                <div className={styles.exhibition}>
                  <div className={styles['exhibition-left']}>
                    <div className={styles['exhibition-title']}>
                      {intl.formatMessage({
                        id: 'customerAbility.components.MemberRightsAnalysis.sumUsedPoint',
                        defaultMessage: '已用积分',
                      })}
                      /
                      {intl.formatMessage({
                        id: 'customerAbility.components.MemberRightsAnalysis.sumPoint',
                        defaultMessage: '总积分',
                      })}
                    </div>
                    <div className={styles['exhibition-amount']}>
                      {data?.sumUsedPoint}/{data?.sumPoint}
                    </div>
                  </div>
                  <div className={styles['exhibition-right']}>
                    <div className={styles['exhibition-logo']}>
                      <img src={IMG_EQUITY5} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </MellowCard>
        </Col>
      </Row>
    </div>
  )
}

export default MemberRightsAnalysis
