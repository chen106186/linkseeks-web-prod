import React, { useMemo } from 'react'
import { Button, Row, Col } from 'antd'
import Img from '@/assets/imgs/illus.png'
import { getWebIntl } from '@/utils/locales'
import useHistory from '@/hooks/useHistory'
import HelmetProvider from '@/context/helmetProvider'
import styles from './index.module.less'

const NoFoundPage: React.FC<{}> = () => {
  const translate = getWebIntl()
  const history = useHistory()

  const handleReturn = () => {
    history.goBack()
  }

  const seoState = useMemo(() => {
    return {
      title: translate('web.resource.mall.zhaobudaoyemian'),
      keyword: translate('web.resource.mall.zhaobudaoyemian'),
      description: translate('web.resource.mall.zhaobudaoyemian'),
    }
  }, [])

  return (
    <HelmetProvider {...seoState}>
      <div className={styles.wrapper}>
        <div className={styles.errorBox}>
          <Row>
            <Col span={12}>
              <div className={styles.desc}>
                <h1>{translate('web.resource.mall.yemianweizhaodao')}</h1>
                <h4>{translate('web.resource.mall.gaicuowukenengyouyuruxiayuanyin')}</h4>
                <p>·{translate('web.resource.mall.yemianyishixiao')}</p>
                <p>·{translate('web.resource.mall.yemianyixiugaihuozheshanchu')}</p>
                <Button type="primary" size="large" style={{ marginTop: 100 }} onClick={handleReturn}>
                  {translate('web.common.fanhui')}
                </Button>
              </div>
            </Col>
            <Col span={12}>
              <img className={styles.image} src={Img} />
            </Col>
          </Row>
        </div>
      </div>
    </HelmetProvider>
  )
}

export default NoFoundPage
