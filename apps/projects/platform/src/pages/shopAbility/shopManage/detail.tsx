import React from 'react'
import { PageHeaderWrapper, ImageBox } from '@apps/components'
import { Space, Card, Descriptions, Typography } from '@linkseeks/ui'
import { useIntl } from '@linkseeks/i18n'
import { usePageStatus } from '@/hooks/usePageStatus'
import cx from 'classnames'
import StoreInfoTitle from '../services/components/storeInfoTitle'
import useStore from '../services/hooks/useStore'
import { renderShopAreas } from '../services/utils'
import styles from './index.less'
import { downloadFileByNameAndUrl } from '@apps/utils'

const ShopDetail: React.FC = () => {
  const { id } = usePageStatus()
  const { storeDetail } = useStore({ id: Number(id) })
  const intl = useIntl()

  const items = [
    {
      key: 'basicInfo',
      label: intl.formatMessage({ id: 'shop.seo.tab.basic', defaultMessage: '基本信息' }),
    },
    {
      key: 'information',
      label: intl.formatMessage({ id: 'store.text.information', defaultMessage: '店铺资料' }),
    },
    {
      key: 'contact',
      label: intl.formatMessage({ id: 'store.text.contact', defaultMessage: '店铺联系方式' }),
    },
  ]

  return (
    <PageHeaderWrapper title={<StoreInfoTitle storeInfo={storeDetail} />} backDom items={items}>
      <Space direction="vertical" size={16} style={{}}>
        <Card id="basicInfo" title={intl.formatMessage({ id: 'shop.seo.tab.basic', defaultMessage: '基本信息' })}>
          <Descriptions column={1}>
            <Descriptions.Item label={intl.formatMessage({ id: 'store.text.describe', defaultMessage: '店铺介绍' })}>
              {storeDetail?.describe}
            </Descriptions.Item>
            <Descriptions.Item
              label={intl.formatMessage({ id: 'shop.form.label.memberShopAreas', defaultMessage: '业务所在地' })}
            >
              {renderShopAreas(storeDetail?.areaList)}
            </Descriptions.Item>
          </Descriptions>
        </Card>
        <Card id="information" title={intl.formatMessage({ id: 'store.text.information', defaultMessage: '店铺资料' })}>
          <Descriptions column={1}>
            <Descriptions.Item
              label={intl.formatMessage({ id: 'shop.form.label.workshopPics', defaultMessage: '厂房照片' })}
            >
              <div className={styles.img_list}>
                {storeDetail?.workshopPics &&
                  storeDetail?.workshopPics.length > 0 &&
                  storeDetail?.workshopPics.map((item, index) => (
                    <div key={index} className={cx(styles.img_list_item)}>
                      <ImageBox
                        round={2}
                        resizeMode="cover"
                        width={188}
                        height={124}
                        className={styles.upload_img}
                        src={item}
                        preview
                      />
                    </div>
                  ))}
              </div>
            </Descriptions.Item>
            <Descriptions.Item
              label={intl.formatMessage({ id: 'shop.form.label.honorPics', defaultMessage: '资质荣誉' })}
            >
              <div className={styles.img_list}>
                {storeDetail?.honorPics &&
                  storeDetail?.honorPics.length > 0 &&
                  storeDetail?.honorPics.map((item, index) => (
                    <div key={index} className={cx(styles.img_list_item)}>
                      <ImageBox
                        round={2}
                        resizeMode="cover"
                        width={188}
                        height={124}
                        className={styles.upload_img}
                        src={item}
                        preview
                      />
                    </div>
                  ))}
              </div>
            </Descriptions.Item>
            <Descriptions.Item
              label={intl.formatMessage({ id: 'shop.form.label.albumName', defaultMessage: '宣传画册' })}
            >
              <Typography.Link
                onClick={() =>
                  downloadFileByNameAndUrl(storeDetail?.albumUrl as string, storeDetail?.albumName as string)
                }
              >
                {storeDetail?.albumName}
              </Typography.Link>
            </Descriptions.Item>
          </Descriptions>
        </Card>
        <Card id="contact" title={intl.formatMessage({ id: 'store.text.contact', defaultMessage: '店铺联系方式' })}>
          <Descriptions column={2}>
            <Descriptions.Item label={intl.formatMessage({ id: 'shop.form.label.phone', defaultMessage: '联系电话' })}>
              {storeDetail?.phone}
            </Descriptions.Item>
            <Descriptions.Item
              label={intl.formatMessage({ id: 'shop.form.label.address', defaultMessage: '详细地址' })}
            >
              {storeDetail?.address}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Space>
    </PageHeaderWrapper>
  )
}

export default ShopDetail
